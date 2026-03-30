# API Resource Map

## Auth
- POST /api/auth/register/locum
- POST /api/auth/register/clinic
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

## Users
- GET /api/users/me
- PATCH /api/users/me
- PATCH /api/admin/users/:id/status

## Locums
- GET /api/locums/me
- PATCH /api/locums/me
- POST /api/locums/me/submit
- GET /api/admin/locums
- PATCH /api/admin/locums/:id/review

## Clinics
- GET /api/clinics/me
- PATCH /api/clinics/me
- POST /api/clinics/me/submit
- GET /api/admin/clinics
- PATCH /api/admin/clinics/:id/review

## Jobs
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/clinic/jobs
- PATCH /api/clinic/jobs/:id
- POST /api/clinic/jobs/:id/submit
- POST /api/clinic/jobs/:id/close
- PATCH /api/admin/jobs/:id/review

## Applications
- POST /api/locum/applications
- GET /api/locum/applications
- POST /api/locum/applications/:id/withdraw
- GET /api/clinic/applications
- PATCH /api/clinic/applications/:id/status
- GET /api/admin/applications

## Documents
- POST /api/documents/upload-url
- POST /api/documents
- GET /api/documents/me
- GET /api/admin/documents
- PATCH /api/admin/documents/:id/review

## Notifications
- GET /api/notifications
- POST /api/notifications/:id/read

## Admin Dashboard
- GET /api/admin/dashboard/metrics
- GET /api/admin/approvals
- GET /api/admin/audit-logs

## Taxonomy
- GET /api/taxonomy/professions
- GET /api/taxonomy/specialties
- GET /api/taxonomy/facility-types
- GET /api/taxonomy/regions
