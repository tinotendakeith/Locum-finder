# Locum Finder Rebuild

Production-oriented monorepo for the Locum Finder healthcare staffing marketplace.

## Stack
- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL + Prisma
- Auth: JWT access token + refresh session rotation
- Storage: S3-compatible upload abstraction foundation
- Infra: Docker Compose for Postgres/Redis/MinIO

## Workspace
- `apps/web`: public pages + locum dashboard + clinic dashboard + admin console
- `apps/api`: modular monolith API (auth, profiles, jobs, applications, documents, notifications, admin)
- `apps/mobile`: Expo shell for future mobile client
- `packages/contracts`: shared Zod contracts/status enums
- `docs`: architecture, RBAC, flows, API map, assumptions

## Quick Start
1. Copy env file:
```bash
cp .env.example .env
```
2. Install dependencies:
```bash
pnpm install
```
3. Start services:
```bash
docker compose up -d
```
4. Generate Prisma client + run migrations + seed:
```bash
pnpm --filter @locumfinder/api prisma:generate
pnpm --filter @locumfinder/api prisma:migrate
pnpm --filter @locumfinder/api prisma:seed
```
5. Start apps:
```bash
pnpm dev
```

## API URLs
- API base: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/docs`
- Health: `http://localhost:4000/api/health`

## Seed Accounts
- Admin: `admin@locumfinder.test` / `Admin1234!`
- Clinic: `clinic@locumfinder.test` / `Clinic1234!`
- Locum: `locum@locumfinder.test` / `Locum1234!`

## Notes
- Approval workflows are modeled for locum profiles, clinic profiles, jobs, and documents.
- Account status guard blocks suspended/rejected/deactivated flows.
- Endpoints and pages are scaffolded for future messaging/payments/subscriptions expansion.
