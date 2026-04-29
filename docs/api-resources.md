# API Resource Map

## Auth API
- POST /api/register
- POST /api/login
- POST /api/logout
- GET /api/auth/google
- GET /api/me

## Jobs API
- GET /api/jobs
- GET /api/jobs/{id}
- POST /api/clinic/jobs
- PUT /api/clinic/jobs/{id}
- POST /api/clinic/jobs/{id}/publish
- POST /api/clinic/jobs/{id}/fill

## Resume API
- GET /api/resumes
- POST /api/resumes
- PUT /api/resumes/{id}
- DELETE /api/resumes/{id}

## Applications API
- POST /api/jobs/{id}/apply
- GET /api/applications
- GET /api/clinic/jobs/{id}/applications
- POST /api/applications/{id}/shortlist
- POST /api/applications/{id}/approve
- POST /api/applications/{id}/reject

## Notifications API
- GET /api/notifications
- POST /api/notifications/{id}/read

## Messaging API
- GET /api/conversations
- GET /api/conversations/{id}
- POST /api/conversations/{id}/messages

## Current Scaffold Note
The present NestJS scaffold exposes an earlier transitional API shape.
It should be aligned to the resource map above as feature modules are implemented for real data flows.
