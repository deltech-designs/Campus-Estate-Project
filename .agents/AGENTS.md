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

This system is specifically designed to address the persistent inefficiencies of manual estate management in campus and institutional environments — including poor record-keeping, unstructured maintenance requests, lack of real-time visibility, and weak administrative decision-making support.

---

## Aim

To design and develop a web-based Campus Estate Management System that automates estate operations, centralizes facility data, and enhances efficiency across asset management, maintenance, and reporting.

---

## Objectives

1. **System Analysis** — Identify process inefficiencies, information requirements, and functional specifications by analyzing existing manual estate management workflows.

2. **Database Design** — Design a normalized database schema incorporating entities for buildings, land parcels, maintenance requests, work orders, users, and departments with appropriate relationships and integrity constraints.

3. **Application Development** — Develop a full-stack web application with secure authentication and role-based authorization mechanisms covering all core estate management modules.

4. **Maintenance Tracking** — Implement electronic fault reporting and maintenance tracking with workflow management, status updates, and assignment capabilities that streamline request handling and reduce response times.

5. **Reporting & Analytics** — Provide automated report generation for facility condition summaries, maintenance performance metrics, and cost analyses that support data-driven administrative decisions.

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
│   │   │   ├── (admin)/              # Admin dashboard routes
│   │   │   ├── (landlord)/           # Landlord/Agent dashboard routes
│   │   │   └── (tenant)/             # Tenant dashboard routes
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
│           ├── users/
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
3. **Which dashboard & module?** Identify the dashboard first (`admin` / `landlord` / `tenant`), then the feature module within it.

---

## Dashboards & Domain Modules

The EMS has **three distinct dashboards**, each scoped to a role. Every feature module belongs to one or more dashboards. When building any screen or API endpoint, identify the dashboard first.

---

### 1. Admin Dashboard
**Role:** `admin`  
**Purpose:** Full system control — platform configuration, user management, oversight of all estates, global reports.

| Module          | Purpose                                                                 |
|-----------------|-------------------------------------------------------------------------|
| `overview`      | System-wide stats — total properties, active leases, revenue, requests  |
| `properties`    | Create, edit, delete all estate units across all landlords              |
| `tenants`       | View and manage all tenant profiles, KYC status, blacklisting           |
| `leases`        | View all leases across the platform, force renewals or terminations     |
| `payments`      | Platform-wide payment records, overdue tracking, receipts               |
| `maintenance`   | All maintenance requests across estates; assign vendors, close tickets  |
| `vendors`       | Register and manage contractors/service providers                       |
| `staff`         | Manage estate staff: security, cleaners, facility managers              |
| `users`         | Create/deactivate admin, landlord, and tenant accounts                  |
| `reports`       | Occupancy rates, revenue summaries, maintenance performance analytics   |
| `settings`      | Platform configuration, roles, notification rules                       |

---

### 2. Landlord / Agent Dashboard
**Role:** `landlord`  
**Purpose:** Manage their own properties, tenants, leases, payments, and maintenance requests.

| Module          | Purpose                                                                 |
|-----------------|-------------------------------------------------------------------------|
| `overview`      | Portfolio stats — occupied units, rent due this month, open requests    |
| `properties`    | Add, edit, and manage their own estate units                            |
| `tenants`       | View tenants occupying their properties; manage KYC documents           |
| `leases`        | Create and manage lease agreements for their properties                 |
| `payments`      | Track rent payments, mark as received, generate receipts                |
| `maintenance`   | View and respond to maintenance requests on their properties            |
| `vendors`       | View and contact assigned contractors for their properties              |
| `reports`       | Per-property occupancy, income summaries, maintenance history           |

---

### 3. Tenant Dashboard
**Role:** `tenant`  
**Purpose:** View their own lease, pay rent, submit maintenance requests, and track their history.

| Module          | Purpose                                                                 |
|-----------------|-------------------------------------------------------------------------|
| `overview`      | Quick summary — lease status, next rent due, open maintenance tickets   |
| `my-lease`      | View current lease details, start/end date, rent amount, renewal status |
| `payments`      | View payment history, outstanding balance, download receipts            |
| `maintenance`   | Submit new fault/repair requests, track status of existing ones         |
| `profile`       | Update personal info, emergency contact, upload KYC documents           |

---

## Auth Roles

| Role       | Dashboard          | Token claim  |
|------------|--------------------|--------------|
| `admin`    | Admin Dashboard    | `role: 'admin'`    |
| `landlord` | Landlord Dashboard | `role: 'landlord'` |
| `tenant`   | Tenant Dashboard   | `role: 'tenant'`   |

After login, redirect by role:
- `admin` → `/admin/overview`
- `landlord` → `/landlord/overview`
- `tenant` → `/tenant/overview`

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

| Task type                              | Files to read                        |
|----------------------------------------|--------------------------------------|
| Any task                               | **SKILL.md** ← you are here          |
| Frontend page, component, hook         | SKILL.md + **FRONTEND.md**           |
| Backend route, service, model, DTO     | SKILL.md + **BACKEND.md**            |
| Shared type or barrel export           | SKILL.md only                        |
| Full-stack feature                     | SKILL.md + FRONTEND.md + BACKEND.md  |
| Which modules does dashboard X have?   | SKILL.md → Dashboards & Domain Modules section |
| Which role guards route X?             | SKILL.md → Auth Roles section        |

---

## Universal Hard Rules

- ❌ No `any` in TypeScript — anywhere
- ❌ No `npm` or `yarn` — pnpm only
- ❌ No `localStorage` for tokens — httpOnly cookies only
- ❌ Duplicate types forbidden — `packages/shared` is the single source of truth