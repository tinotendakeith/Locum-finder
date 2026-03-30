# Database Schema Summary

## Core Identity
- `User`: role (`ADMIN|CLINIC|LOCUM`), account status workflow, email verification, auth metadata.
- `RefreshSession`: hashed refresh token sessions with revoke/expiry.
- `PasswordResetToken`, `EmailVerificationToken`: secure token lifecycle.

## Taxonomy
- `Profession`
- `Specialty`
- `FacilityType`
- `Region`
- `DocumentType`

## Locum Domain
- `LocumProfile` with full status workflow and moderation fields.
- `LocumEmployment`
- `LocumEducation`
- `LocumQualification`
- `LocumCertification`

## Clinic Domain
- `ClinicProfile` with verification/approval workflow.

## Job Marketplace
- `Job` with moderation lifecycle and staffing metadata.
- `JobSpecialty` (many-to-many)
- `SavedJob`

## Applications
- `Application` with status workflow and profile snapshot.
- `ApplicationHistory` status transitions audit trail.

## Documents and Compliance
- `Document` with ownership, type, review state, and reviewer metadata.

## Platform Operations
- `Notification` (in-app event feed).
- `AuditLog` (admin and workflow auditability).

## Indexing/Constraints
- Unique emails, one profile per user (`LocumProfile.userId`, `ClinicProfile.userId`).
- Duplicate application prevention via unique `(jobId, locumProfileId)`.
- Common workflow indexes:
  - `Job(status, startDate)`
  - `Application(status, submittedAt)`
  - `Notification(userId, readAt)`
  - `AuditLog(entityType, entityId)`
