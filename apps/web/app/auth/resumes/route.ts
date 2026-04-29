import { NextResponse } from "next/server";
import { createResumeForUser, getCurrentUser, safeReturnTo } from "../../../lib/local-auth";

function fileNameOf(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value.name : "";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "locum") {
    return NextResponse.redirect(new URL("/login?returnTo=/dashboard/locum/profile", request.url));
  }

  const formData = await request.formData();
  const returnTo = String(formData.get("returnTo") ?? "");
  const title = String(formData.get("title") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const professionalTitle = String(formData.get("professionalTitle") ?? "");
  const location = String(formData.get("location") ?? "");
  const specialties = String(formData.get("specialties") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const videoUrl = String(formData.get("videoUrl") ?? "");
  const urls = String(formData.get("urls") ?? "");
  const education = String(formData.get("education") ?? "");
  const experience = String(formData.get("experience") ?? "");
  const photoFileName = fileNameOf(formData.get("profilePhoto"));
  const qualificationCertificateFileName = fileNameOf(formData.get("qualificationCertificate"));
  const practicingCertificateFileName = fileNameOf(formData.get("practicingCertificate"));

  if (!title.trim() || !fullName.trim() || !professionalTitle.trim()) {
    const url = new URL("/dashboard/locum/profile", request.url);
    url.searchParams.set("error", "missing_resume_fields");
    if (returnTo) url.searchParams.set("returnTo", safeReturnTo(returnTo, "/jobs"));
    return NextResponse.redirect(url);
  }

  createResumeForUser(user, {
    title,
    fullName,
    professionalTitle,
    location,
    specialties,
    summary,
    videoUrl,
    urls,
    education,
    experience,
    photoFileName,
    qualificationCertificateFileName,
    practicingCertificateFileName,
  });

  const url = new URL("/dashboard/locum/profile", request.url);
  url.searchParams.set("saved", "1");
  if (returnTo) url.searchParams.set("returnTo", safeReturnTo(returnTo, "/jobs"));
  return NextResponse.redirect(url);
}
