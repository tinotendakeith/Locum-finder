# Domain Modules and Responsibilities

## auth
- Register locum/clinic users
- Login/logout
- Refresh token rotation
- Forgot/reset password foundation
- Email verification token foundation

## users
- Base user account, status transitions, account settings
- Admin-driven suspension/rejection/deactivation

## locums
- Rich professional profile
- Employment/education history
- Availability and preferences
- Profile approval workflow

## clinics
- Organization profile and verification data
- Verification workflow

## jobs
- Opportunity lifecycle (draft -> pending -> active/closed/filled/etc.)
- Search/filter/sort/pagination
- Clinic ownership enforcement

## applications
- Apply, withdraw, review pipeline
- Duplicate prevention
- Application status history trail

## documents
- Upload metadata + secure access
- Typed documents (ID/license/CV/facility registration)
- Admin review actions

## notifications
- In-app notifications with read/unread
- Event-driven creation hooks from workflows

## admin
- Moderation queues and actions
- Basic metrics and operational dashboards

## taxonomy
- Backend-managed reference entities:
  - professions
  - specialties
  - facility types
  - regions
  - document types
