# RBAC Matrix

## Roles
- ADMIN
- CLINIC
- LOCUM

## Key Permissions
- ADMIN:
  - full moderation and status transitions
  - manage reference data
  - view all documents/applications/audit logs
- CLINIC:
  - manage own clinic profile
  - manage own jobs and applicants
  - cannot access other clinics' data
- LOCUM:
  - manage own profile/documents
  - browse jobs and apply
  - cannot access other locums' private data

## Status-based Access Rules
- ACTIVE: full role access
- PENDING_VERIFICATION / PENDING_APPROVAL: limited access, can complete onboarding but restricted core workflows
- SUSPENDED / REJECTED / DEACTIVATED: blocked from protected role workflows

## Ownership Rules
- Clinic job mutation requires job.clinic.userId = currentUser.id
- Locum application mutation requires application.locum.userId = currentUser.id
- Document access requires owner or admin
