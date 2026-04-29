# Implementation Alignment Notes

## What The Product Owner Clarified
The product is not a generic job board.
It is a healthcare staffing marketplace built around:
- public job discovery
- resume-based locum applications
- clinic hiring workflows
- notifications
- messaging
- role-based dashboards

## Backend Progress Completed
The current backend now aligns with the architecture in these areas:
- `Resume` is a first-class Prisma model with related education, experience, membership, specialty, and document relationships.
- A dedicated NestJS `resumes` module exists for locum resume CRUD and default-resume management.
- Applications are now resume-based and store `resumeId`, `applicantUserId`, `clinicUserId`, `message`, and a resume snapshot.
- Duplicate applications are prevented per user/job.
- Clinic application views now resolve applicant resume data instead of relying on `LocumProfile` as the application record.
- Job lifecycle code now uses the current schema statuses: `DRAFT`, `PUBLISHED`, `CLOSED`, `FILLED`, `ARCHIVED`.
- Seed data now creates a real locum resume and a sample application that uses it.
- Prisma client generation and API typecheck both pass after the refactor.

## Current Remaining Gaps
### High priority gaps
- Google OAuth is not implemented.
- Messaging / conversations are modeled in the schema, but not yet implemented as API modules and UI flows.
- Public and dashboard routes still use provisional names in parts of the frontend.
- The frontend apply flow does not yet call the resume-selection API end to end.
- Job moderation still uses an `ARCHIVED` fallback for rejected jobs because the current schema does not include a dedicated rejected job status.

### Medium priority gaps
- Saved jobs are only partially scaffolded.
- Notification delivery is present in-app at the data layer, but email delivery is not wired.
- Employer profile data still needs to pre-fill more of the job creation flow.
- Applicant management actions need richer clinic-side UX and messaging tools.

## Recommended Next Refactor Sequence
1. Update the frontend apply flow to require selecting a saved resume before submission.
2. Build clinic applicant screens around resume cards, action buttons, and status changes.
3. Add conversations and messages tied to an application.
4. Normalize route structure toward `/dashboard` for locums and `/clinic/...` for employers.
5. Add Google OAuth onboarding.
6. Revisit whether job rejection should get a dedicated status instead of using `ARCHIVED` with a rejection reason.

## Delivery Principle
Every next implementation step should be checked against the owner architecture before code is added, so the product stays aligned with the intended workflow rather than drifting into a generic recruitment app.
