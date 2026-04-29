import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, registerLocumAccount, safeReturnTo } from "../../../../lib/local-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const firstName = String(formData.get("firstName") ?? "");
  const lastName = String(formData.get("lastName") ?? "");
  const email = String(formData.get("email") ?? "");
  const profession = String(formData.get("profession") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "");
  const acceptedPrivacyNotice = formData.get("acceptedPrivacyNotice") === "on";
  const acceptedSensitiveDataUse = formData.get("acceptedSensitiveDataUse") === "on";
  const marketingOptIn = formData.get("marketingOptIn") === "on";

  if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
    return NextResponse.redirect(new URL("/register/locum?error=missing_fields", request.url));
  }

  if (!acceptedPrivacyNotice || !acceptedSensitiveDataUse) {
    return NextResponse.redirect(new URL("/register/locum?error=consent_required", request.url));
  }

  const result = registerLocumAccount({
    firstName,
    lastName,
    email,
    profession,
    phone,
    password,
    acceptedPrivacyNotice,
    acceptedSensitiveDataUse,
    marketingOptIn,
  });
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/register/locum?error=${result.error}`, request.url));
  }

  const token = createSession(result.account.id);
  const query = new URLSearchParams({ onboarding: "1" });
  if (result.onboarding.fullName) query.set("fullName", result.onboarding.fullName);
  if (result.onboarding.profession) query.set("profession", result.onboarding.profession);
  if (result.onboarding.phone) query.set("phone", result.onboarding.phone);
  if (returnTo) query.set("returnTo", safeReturnTo(returnTo, "/jobs"));

  const response = NextResponse.redirect(new URL(`/dashboard/locum/profile?${query.toString()}`, request.url));
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
