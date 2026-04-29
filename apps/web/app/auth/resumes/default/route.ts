import { NextResponse } from "next/server";
import { getCurrentUser, setDefaultResumeForUser, safeReturnTo } from "../../../../lib/local-auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "locum") {
    return NextResponse.redirect(new URL("/login?returnTo=/dashboard/locum/profile", request.url));
  }

  const formData = await request.formData();
  const resumeId = String(formData.get("resumeId") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "");
  if (resumeId) {
    setDefaultResumeForUser(user.id, resumeId);
  }

  const url = new URL("/dashboard/locum/profile", request.url);
  url.searchParams.set("defaulted", "1");
  if (returnTo) url.searchParams.set("returnTo", safeReturnTo(returnTo, "/jobs"));
  return NextResponse.redirect(url);
}