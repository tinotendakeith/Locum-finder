# Locum Finder Architecture Plan

## Source of Truth
This document reflects the intended Locum Finder product model provided by the product owner on 2026-03-31.

## Core Product Model
Locum Finder is a role-based healthcare staffing marketplace with three user states:
- Guest
- Locum Professional
- Clinic / Employer

Guests can browse and search jobs, open vacancy details, and click apply, but they cannot apply or manage platform resources.
Locum professionals create resumes, apply using a selected resume, manage applications, receive notifications, and message clinics.
Clinics manage jobs, applicants, hiring actions, notifications, and clinic profile information from an employer dashboard.

## Stack Decision For This Rebuild
The live repository is already scaffolded as:
- Next.js frontend
- NestJS backend
- PostgreSQL + Prisma

The product owner also suggested Laravel as a strong alternative. That is valid, but the current implementation path will continue on Next.js + NestJS unless an explicit stack rewrite is requested.

## Product Workflow Model
### Locum Journey
1. Guest lands on homepage.
2. Guest browses or searches jobs.
3. Guest opens a job detail page.
4. Guest clicks apply.
5. If unauthenticated, the user is prompted to log in, sign up, or continue with Google.
6. After authentication, the system checks whether the locum has at least one resume.
7. If no resume exists, redirect to resume creation.
8. If resumes exist, open an apply flow where the user selects one resume and submits an optional message.
9. Clinic is notified.
10. Locum sees the application in dashboard history and receives future notifications.

### Clinic Journey
1. Clinic enters from homepage via post job / hire a locum entry points.
2. If unauthenticated, prompt for login, sign up, or Google auth.
3. After authentication, clinic lands in employer dashboard.
4. Clinic creates, previews, edits, publishes, closes, fills, and archives jobs.
5. Clinic reviews applicants, messages them, and takes shortlist / approve / reject actions.
6. Filled jobs disappear from public listings.

## Modules
- Public Website
- Authentication and User Identity
- Locum Resume Management
- Employer / Clinic Profile
- Job Management
- Job Discovery
- Application Engine
- Employer Applicant Management
- Messaging System
- Notification System
- Dashboard System
- Admin / Platform Management

## Resume-Centric Rule
Resumes are first-class entities.
A locum does not apply with ad hoc text alone.
Every application must reference exactly one selected resume.
Multiple resumes per locum account are allowed.

## Key Business Rules
- Only published, active, not-filled, not-expired jobs appear publicly.
- Applying requires authentication and the locum role.
- Applying requires at least one resume.
- Applications reference one selected resume.
- Filled jobs are removed from public listings.
- Messaging is only allowed in the context of a job/application relationship.
- Notifications are created for application, review, message, and job-filled events.

## Architecture Boundaries
### Frontend
- Public marketing and browse pages
- Locum dashboard
- Clinic dashboard
- Admin dashboard
- Notification UI
- Messaging UI

### Backend
- Auth
- Users
- Roles / access control
- Resumes
- Clinics
- Jobs
- Applications
- Conversations / messages
- Notifications
- Admin and audit
- Taxonomy

## Data and Platform Concerns
- PostgreSQL relational model
- S3-compatible file storage for resumes, logos, photos, and supporting documents
- Role-based access control
- Google OAuth support
- API-first design for future mobile apps
- Queue-ready notification delivery and asynchronous workflows
