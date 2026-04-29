import { NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE } from "../../../lib/local-auth";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];

  destroySession(token);

  const response = NextResponse.redirect(new URL("/login?loggedOut=1", request.url));
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: new Date(0),
  });
  return response;
}