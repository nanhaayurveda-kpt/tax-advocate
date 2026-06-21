import { Google } from "arctic";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Arctic Google OAuth client — used by both login and callback
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const SESSION_COOKIE = "session";
const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET);

// session cookie options — used when setting cookie in callback
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// build a signed session token using jose
export async function createSession(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

// verify token → payload; null if invalid/expired
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

// current logged-in user — read cookie then verify
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySession(token);
}

// logout — remove session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}