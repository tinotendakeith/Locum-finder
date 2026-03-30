# Locum Finder Architecture Plan

## Monorepo Structure
- apps/web: Next.js 15 App Router (public site + role dashboards)
- apps/api: NestJS modular monolith (REST API, Swagger, auth, workflows)
- packages/contracts: shared zod/types for API contracts and status enums
- docs: architecture, flows, RBAC, schema, API map, rollout plan

## Backend Architecture
- Pattern: modular monolith with domain modules and explicit boundaries.
- Cross-cutting modules:
  - config
  - prisma
  - auth (JWT access + refresh)
  - rbac (role and status guards)
  - common (pagination, response envelope, exceptions)
  - audit
  - notifications
  - documents (S3 abstraction)
- Domain modules:
  - users
  - locums
  - clinics
  - jobs
  - applications
  - taxonomy
  - admin

## Frontend Architecture
- App Router route groups:
  - (public)
  - (auth)
  - dashboard/locum
  - dashboard/clinic
  - admin
- Reusable UI system:
  - AppShell (header/sidebar/content)
  - cards, tables, status badges, empty/loading/error states
- Data access:
  - thin API client (server + client safe)
  - typed contracts from packages/contracts

## Security Foundation
- Password hashing with bcrypt.
- JWT access token + hashed refresh token rotation.
- Status-aware authorization: suspended/rejected/deactivated blocked from protected actions.
- Role guards and ownership checks.
- File ownership + access policy checks.
- Audit logging for moderation/status transitions.

## Scalability Notes
- Redis-ready design for queues/cache/rate-limiting.
- S3 abstraction provider for future MinIO/AWS swap.
- Clear workflow states for approval/moderation.
- API designed for mobile clients (pagination/filtering/stable resource contracts).
