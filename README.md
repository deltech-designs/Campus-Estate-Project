# Estate Management System (EMS)

A full-stack monorepo application for managing residential and commercial estates, featuring secure role-based access control, electronic fault reporting, lease management, automated payments, and analytics.

---

## Monorepo Layout

This project is a monorepo structured with `pnpm Workspaces` and powered by `Turborepo`:

```
campus-estate/
├── apps/
│   ├── web/        # Next.js 15+ Frontend (React, Tailwind CSS v4)
│   └── api/        # Express.js Backend (Node.js, TypeScript, MongoDB)
└── packages/
    └── shared/     # Shared TypeScript models and type definitions
```

---

## Quick Start & Commands

### Prerequisites
* **Node.js**: `^20` (LTS recommended)
* **pnpm**: `^9`

Install all dependencies in the workspace:
```bash
pnpm install
```

---

## Running the Application

You can choose to run the entire stack together or spin up the frontend and backend independently.

### 1. Run Everything Concurrently
To start both the frontend and backend development servers side-by-side:
```bash
pnpm dev
```

---

### 2. Run the Frontend Independently
To start only the Next.js frontend development server:
```bash
pnpm dev:web
```
*Alternatively, using standard pnpm filter syntax:*
```bash
pnpm --filter @ems/web dev
```

---

### 3. Run the Backend Independently
To start only the Express API development server:
```bash
pnpm dev:api
```
*Alternatively, using standard pnpm filter syntax:*
```bash
pnpm --filter @ems/api dev
```

---

## Workspace Tooling

### Typechecking
To verify types across all applications and the shared types package:
```bash
pnpm typecheck
```

### Linting
To run ESLint checking across the workspace:
```bash
pnpm lint
```

### Building
To generate production-ready bundles for all apps:
```bash
pnpm build
```

---

## Development Notes

* **Shared Types:** All TypeScript interfaces are located in `packages/shared/src/types`. Never create types locally inside backend or frontend. If you need new types, define them there first and export them through `packages/shared/src/index.ts`.
* **Database Connection:** The backend requires a running MongoDB database. Update your configuration in `apps/api/.env`.
