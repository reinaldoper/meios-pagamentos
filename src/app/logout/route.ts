
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL));
  response.cookies.set("__session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
