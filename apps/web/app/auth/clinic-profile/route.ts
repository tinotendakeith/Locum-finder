import { NextResponse } from "next/server";
import { getCurrentUser, updateClinicProfile } from "../../../lib/local-auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "clinic") {
    return NextResponse.redirect(new URL("/login?returnTo=/dashboard/clinic/profile", request.url));
  }

  const formData = await request.formData();
  updateClinicProfile(user.id, {
    facilityName: String(formData.get("facilityName") ?? ""),
    organizationType: String(formData.get("organizationType") ?? "clinic"),
    description: String(formData.get("description") ?? ""),
    city: String(formData.get("city") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? user.email),
    website: String(formData.get("website") ?? ""),
    contactPerson: String(formData.get("contactPerson") ?? ""),
  });

  return NextResponse.redirect(new URL("/dashboard/clinic/profile?saved=1", request.url));
}