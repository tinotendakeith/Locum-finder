import { NextResponse } from "next/server";
import { createDataRightsRequest, getCurrentUser } from "../../../../lib/local-auth";

const allowedRequestTypes = ["access", "correction", "deletion", "objection", "export"] as const;

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const details = String(formData.get("details") ?? "");
  const requestType = String(formData.get("requestType") ?? "access");
  const user = await getCurrentUser();

  if (!name.trim() || !email.trim() || !details.trim() || !allowedRequestTypes.includes(requestType as typeof allowedRequestTypes[number])) {
    return NextResponse.redirect(new URL("/privacy/data-rights?error=missing_fields", request.url));
  }

  createDataRightsRequest({
    accountId: user?.id ?? null,
    name,
    email,
    requestType: requestType as typeof allowedRequestTypes[number],
    details,
  });

  return NextResponse.redirect(new URL("/privacy/data-rights?submitted=1", request.url));
}
