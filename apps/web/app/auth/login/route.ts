import { NextResponse } from "next/server";
import { authenticateAccount, createSession, dashboardPathForRole, safeReturnTo, SESSION_COOKIE } from "../../../lib/local-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const role = String(formData.get("role") ?? "locum") as "locum" | "clinic" | "admin";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "");

  const result = authenticateAccount({ role, email, password });
  if (!result.ok) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", result.error);
    if (returnTo) url.searchParams.set("returnTo", returnTo);
    url.searchParams.set("email", email);
    url.searchParams.set("role", role);
    return NextResponse.redirect(url);
  }

  const token = createSession(result.account.id);
  const response = NextResponse.redirect(new URL(safeReturnTo(returnTo, dashboardPathForRole(result.account.role)), request.url));
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
