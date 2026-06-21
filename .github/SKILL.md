---
name: estate-management-agent
description: >
  General agent instructions for the Estate Management System (EMS) monorepo.
  Read this file first on every task. It covers project overview, monorepo layout,
  shared types, package manager rules, domain modules, auth roles, environment
  variables, and API response contract. For frontend tasks also read FRONTEND.md.
  For backend tasks also read BACKEND.md.
---

# Estate Management System — General Agent Skill

This skill is the **entry point** for all AI coding work on the EMS.  
Always read this file first. Then read `FRONTEND.md` or `BACKEND.md` (or both) depending on the task.

---

## Project Overview

The **Estate Management System (EMS)** is a full-stack monorepo application for managing residential and commercial estates. It handles properties, tenants, leases, rent payments, maintenance requests, vendors, and staff — with role-based access for admins, managers, and tenants.

---

## Stack at a Glance

| Layer       | Technology                                               |
|-------------|----------------------------------------------------------|
| Frontend    | Next.js 15+ (App Router), Tailwind CSS v4, TypeScript    |
| Backend     | Express.js, TypeScript, Screaming Architecture           |
| Database    | MongoDB, Typegoose (Mongoose)                            |
| Validation  | class-validator + class-transformer (backend)            |
| Forms       | react-hook-form + zod (frontend)                         |
| Auth        | JWT (httpOnly cookies — cookie name: `ems_token`)        |
| Monorepo    | pnpm Workspaces                                          |
| Node.js     | ≥ 20 LTS                                                 |

---

## Monorepo Structure

```
estate-management/
├── apps/
│   ├── web/                          # Next.js 15+ frontend  → see FRONTEND.md
│   │   ├── app/
│   │   │   ├── (auth)/               # login, register
│   │   │   └── (dashboard)/          # protected routes per module
│   │   ├── components/
│   │   │   ├── features/             # domain UI groups
│   │   │   ├── partials/             # primitives: Button, Input, Modal…
│   │   │   ├── layout/               # Sidebar, Topbar, DashboardShell…
│   │   │   └── ui/                   # Toast, EmptyState, Skeleton…
│   │   ├── hooks/
│   │   ├── services/                 # all fetch calls
│   │   ├── context/
│   │   └── lib/
│   │
│   └── api/                          # Express backend  → see BACKEND.md
│       └── src/
│           ├── properties/
│           ├── tenants/
│           ├── leases/
│           ├── maintenance/
│           ├── payments/
│           ├── vendors/
│           ├── staff/
│           ├── auth/
│           ├── reports/
│           ├── shared/
│           │   ├── middleware/
│           │   └── utils/
│           ├── config/
│           │   └── db.ts
│           └── app.ts
│
└── packages/
    └── shared/                       # shared TypeScript types
        └── src/
            ├── types/
            │   ├── property.types.ts
            │   ├── tenant.types.ts
            │   ├── lease.types.ts
            │   ├── maintenance.types.ts
            │   ├── payment.types.ts
            │   ├── vendor.types.ts
            │   ├── staff.types.ts
            │   └── user.types.ts
            └── index.ts              # barrel — export everything from here
```

---

## Package Manager

**Always pnpm. Never npm or yarn.**

```bash
pnpm --filter @ems/web add <package>       # frontend dep
pnpm --filter @ems/api add <package>       # backend dep
pnpm --filter @ems/shared add <package>    # shared dep
pnpm add -D <package> -w                   # root dev dep
pnpm install                               # install all
```

---

## Before Writing Any Code — Three Questions

1. **Which workspace?** `apps/web`, `apps/api`, or `packages/shared`
2. **Does the type already exist in `packages/shared`?** Import it. If not, create it there first.
3. **Which feature module?** `properties` · `tenants` · `leases` · `maintenance` · `payments` · `vendors` · `staff` · `auth` · `reports`

---

## Domain Modules

| Module        | Purpose                                               |
|---------------|-------------------------------------------------------|
| `properties`  | Estate units — apartments, duplexes, commercial       |
| `tenants`     | Tenant profiles, KYC documents, emergency contacts    |
| `leases`      | Lease agreements, start/end dates, renewal tracking   |
| `maintenance` | Repair requests, work orders, vendor assignments      |
| `payments`    | Rent payments, receipts, overdue tracking             |
| `vendors`     | Contractors and service providers                     |
| `staff`       | Estate staff: security, cleaners, facility managers   |
| `auth`        | Authentication — admin, manager, tenant roles         |
| `reports`     | Occupancy, revenue, maintenance analytics             |

---

## Auth Roles

| Role      | Access                                                           |
|-----------|------------------------------------------------------------------|
| `admin`   | Full system — all CRUD, staff, reports, configuration            |
| `manager` | Properties, tenants, leases, maintenance, payments               |
| `tenant`  | Own lease, own payments, submit maintenance requests             |

---

## Shared Types (packages/shared)

All types live in `packages/shared/src/types/` and are exported from `packages/shared/src/index.ts`.  
**Never duplicate a type. Always import from `@ems/shared`.**

```ts
import type { IProperty, ILease, IPayment } from '@ems/shared';
```

### Key interfaces

```ts
// property.types.ts
export type PropertyType   = 'apartment' | 'duplex' | 'commercial' | 'land';
export type PropertyStatus = 'available' | 'occupied' | 'maintenance' | 'inactive';

export interface IProperty {
  _id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  rentAmount: number;
  bedrooms: number;
  estateZone: string;
  amenities: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePropertyPayload {
  title: string;
  type: PropertyType;
  address: string;
  rentAmount: number;
  bedrooms: number;
  estateZone: string;
  amenities?: string[];
}
```

```ts
// tenant.types.ts
export type TenantStatus = 'active' | 'inactive' | 'blacklisted';

export interface ITenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nin: string;
  status: TenantStatus;
  emergencyContact: { name: string; phone: string; relationship: string };
  documents: string[];
  createdAt: string;
  updatedAt: string;
}
```

```ts
// lease.types.ts
export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'renewed';

export interface ILease {
  _id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  renewalNotified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// maintenance.types.ts
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus   = 'open' | 'assigned' | 'in_progress' | 'completed' | 'closed';

export interface IMaintenanceRequest {
  _id: string;
  propertyId: string;
  tenantId?: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  vendorId?: string;
  scheduledDate?: string;
  completedDate?: string;
  cost?: number;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// payment.types.ts
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'overdue';
export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'ussd';

export interface IPayment {
  _id: string;
  leaseId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

Barrel export:
```ts
// packages/shared/src/index.ts
export * from './types/property.types';
export * from './types/tenant.types';
export * from './types/lease.types';
export * from './types/maintenance.types';
export * from './types/payment.types';
export * from './types/vendor.types';
export * from './types/staff.types';
export * from './types/user.types';
```

---

## API Response Contract

Every API response — success or error — uses this shape. Both frontend and backend must agree on it.

```json
// success
{ "success": true,  "message": "Properties fetched", "data": [...] }

// error
{ "success": false, "message": "Property not found", "code": "NOT_FOUND" }
```

---

## Environment Variables

```bash
# apps/api/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/estate-management
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
API_BASE_URL=http://localhost:5000

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Skill Map

| Task type                          | Files to read          |
|------------------------------------|------------------------|
| Any task                           | **SKILL.md** ← you are here |
| Frontend page, component, hook     | SKILL.md + **FRONTEND.md** |
| Backend route, service, model, DTO | SKILL.md + **BACKEND.md**  |
| Shared type or barrel export       | SKILL.md only          |
| Full-stack feature                 | SKILL.md + FRONTEND.md + BACKEND.md |

---

## Universal Hard Rules

- ❌ No `any` in TypeScript — anywhere
- ❌ No `npm` or `yarn` — pnpm only
- ❌ No `localStorage` for tokens — httpOnly cookies only
- ❌ Duplicate types forbidden — `packages/shared` is the single source of truth