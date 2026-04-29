import { NextResponse } from "next/server";
import { createSession, registerClinicAccount, SESSION_COOKIE } from "../../../../lib/local-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const facilityName = String(formData.get("facilityName") ?? "");
  const contactPerson = String(formData.get("contactPerson") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");
  const acceptedPrivacyNotice = formData.get("acceptedPrivacyNotice") === "on";
  const acceptedSensitiveDataUse = formData.get("acceptedSensitiveDataUse") === "on";
  const marketingOptIn = formData.get("marketingOptIn") === "on";

  if (!facilityName.trim() || !contactPerson.trim() || !email.trim() || !password.trim()) {
    return NextResponse.redirect(new URL("/register/clinic?error=missing_fields", request.url));
  }

  if (!acceptedPrivacyNotice || !acceptedSensitiveDataUse) {
    return NextResponse.redirect(new URL("/register/clinic?error=consent_required", request.url));
  }

  const result = registerClinicAccount({
    facilityName,
    contactPerson,
    email,
    phone,
    password,
    acceptedPrivacyNotice,
    acceptedSensitiveDataUse,
    marketingOptIn,
  });
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/register/clinic?error=${result.error}`, request.url));
  }

  const token = createSession(result.account.id);
  const response = NextResponse.redirect(new URL("/dashboard/clinic/profile?onboarding=1", request.url));
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
