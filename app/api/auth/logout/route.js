import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  // remove session cookie and redirect to login
  const response = NextResponse.redirect(new URL("/", BASE_URL));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}