# Pages and Route Map

## Public Routes
- /
- /jobs
- /jobs/[slug]
- /login
- /register
- /auth/google/callback
- /about
- /contact
- /terms
- /privacy

## Locum Routes
- /dashboard
- /dashboard/resumes
- /dashboard/resumes/new
- /dashboard/resumes/[id]/edit
- /dashboard/applications
- /dashboard/messages
- /dashboard/notifications
- /dashboard/profile

## Clinic Routes
- /clinic/dashboard
- /clinic/jobs
- /clinic/jobs/new
- /clinic/jobs/[id]/edit
- /clinic/jobs/[id]/preview
- /clinic/jobs/[id]/applicants
- /clinic/messages
- /clinic/notifications
- /clinic/profile

## Admin Routes
- /admin
- /admin/users
- /admin/jobs
- /admin/applications
- /admin/categories
- /admin/reports

## Current Scaffold Note
The current preview still uses transitional route names such as `/dashboard/clinic/...` and `/dashboard/locum/...`.
Those should be normalized toward the route map above as implementation continues.
