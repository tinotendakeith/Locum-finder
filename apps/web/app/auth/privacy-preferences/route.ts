import { NextResponse } from "next/server";
import { requireUser, updatePrivacyPreferences } from "../../../lib/local-auth";

export async function POST(request: Request) {
  const user = await requireUser(null, "/login");
  const formData = await request.formData();
  const returnTo = String(formData.get("returnTo") || "/dashboard/locum/settings");

  updatePrivacyPreferences(user.id, {
    accountEmail: true,
    jobAlerts: formData.get("jobAlerts") === "on",
    smsNotifications: formData.get("smsNotifications") === "on",
    marketingMessages: formData.get("marketingMessages") === "on",
  });

  return NextResponse.redirect(new URL(`${returnTo}?privacy=updated`, request.url));
}
