import { NextResponse } from "next/server";
import { decodeIdToken } from "arctic";
import { eq } from "drizzle-orm";
import { google, createSession, SESSION_COOKIE, cookieOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// helper to redirect while attaching session cookie
function redirectWithCookie(path, token) {
  const response = NextResponse.redirect(new URL(path, BASE_URL));
  response.cookies.set(SESSION_COOKIE, token, cookieOptions);
  // clear temporary OAuth cookies
  response.cookies.delete("google_oauth_state");
  response.cookies.delete("google_code_verifier");
  return response;
}

// if auth fails, go back to login
function redirectError(reason) {
  return NextResponse.redirect(new URL(`/?error=${reason}`, BASE_URL));
}

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("google_oauth_state")?.value;
  const codeVerifier = request.cookies.get("google_code_verifier")?.value;

  // required values must be present and state must match
  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return redirectError("auth");
  }

  let claims;
  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    claims = decodeIdToken(tokens.idToken());
  } catch {
    return redirectError("auth");
  }

  const email = claims.email;

  // ALLOWED_EMAILS gate — only office's email gets in
  const allowed = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!email || !allowed.includes(email.toLowerCase())) {
    return redirectError("unauthorized");
  }

  // user upsert — find by googleId, insert if not found (no .returning())
  let user = (
    await db.select().from(users).where(eq(users.googleId, claims.sub)).limit(1)
  )[0];

  if (!user) {
    await db.insert(users).values({
      googleId: claims.sub,
      email,
      name: claims.name,
      picture: claims.picture,
    });
    user = (
      await db.select().from(users).where(eq(users.googleId, claims.sub)).limit(1)
    )[0];
  }

  // create session and redirect to dashboard with cookie
  const token = await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  });

  return redirectWithCookie("/dashboard", token);
}