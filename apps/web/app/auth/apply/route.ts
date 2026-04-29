import { NextResponse } from "next/server";
import { createApplicationForUser, getCurrentUser, safeReturnTo } from "../../../lib/local-auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const formData = await request.formData();
  const jobId = String(formData.get("jobId") ?? "");
  const resumeId = String(formData.get("resumeId") ?? "");
  const message = String(formData.get("message") ?? "");
  const returnTo = safeReturnTo(String(formData.get("returnTo") ?? `/jobs/${jobId}`), `/jobs/${jobId}`);

  if (!user) {
    return NextResponse.redirect(new URL(`/login?returnTo=${encodeURIComponent(returnTo)}`, request.url));
  }

  if (user.role !== "locum") {
    return NextResponse.redirect(new URL(`${returnTo}?error=locum_only`, request.url));
  }

  const result = createApplicationForUser(user, { jobId, resumeId, message });
  const url = new URL(returnTo, request.url);
  url.searchParams.set(result.ok ? "applied" : "error", result.ok ? "1" : result.error);
  return NextResponse.redirect(url);
}