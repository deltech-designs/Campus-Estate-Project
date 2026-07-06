---
name: ems-frontend
description: >
  Frontend rules for the Estate Management System (apps/web).
  Read SKILL.md first, then this file for any task involving Next.js pages,
  React components, feature hooks, services, or Tailwind styling.
---

# EMS Frontend — Agent Rules (apps/web)

> **Pre-check:** Read `SKILL.md` before this file. It has the monorepo structure, shared types, and auth roles.

---

## Stack

| Concern     | Tool                                     |
|-------------|------------------------------------------|
| Framework   | Next.js 15+ — App Router only            |
| Language    | TypeScript — strict mode                 |
| Styling     | Tailwind CSS v4 (`@theme` tokens)        |
| Forms       | react-hook-form + zod                    |
| Auth state  | React context + httpOnly cookie          |
| API calls   | fetch via `services/` — never in components |

---

## Folder Structure

```
apps/web/
├── app/
│   ├── (auth)/                        # Public — no layout wrapper
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (admin)/                       # Admin dashboard — role: admin
│   │   ├── layout.tsx                 # AdminShell (sidebar + topbar)
│   │   ├── overview/page.tsx
│   │   ├── properties/page.tsx
│   │   ├── tenants/page.tsx
│   │   ├── leases/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── maintenance/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── (landlord)/                    # Landlord/Agent dashboard — role: landlord
│   │   ├── layout.tsx                 # LandlordShell
│   │   ├── overview/page.tsx
│   │   ├── properties/page.tsx
│   │   ├── tenants/page.tsx
│   │   ├── leases/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── maintenance/page.tsx
│   │   
│   │
│   ├── (tenant)/                      # Tenant dashboard — role: tenant
│   │   ├── layout.tsx                 # TenantShell
│   │   ├── overview/page.tsx
│   │   ├── my-lease/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── maintenance/page.tsx
│   │   └── profile/page.tsx
│   │
│   ├── globals.css
│   └── layout.tsx                     # Root layout — fonts, providers
│
├── components/
│   ├── features/                      # Domain UI — scoped by dashboard
│   │   ├── admin/
│   │   │   ├── overview/              # AdminOverviewView + use-admin-overview.ts
│   │   │   ├── properties/            # Full CRUD — PropertiesView, forms, table
│   │   │   ├── tenants/               # TenantListView, KYC management, and property rented
│   │   │   ├── leases/                # LeaseListView, force-renew, terminate
│   │   │   ├── payments/              # Platform-wide PaymentsView, paying for rents
│   │   │   ├── maintenance/           # AllMaintenanceView, assign vendors
│   │   │   ├── notifications/         # AllNotificationsView
│   │   │   └── settings/              # SettingsView
│   │   │
│   │   ├── landlord/
│   │   │   ├── overview/              # PortfolioOverviewView
│   │   │   ├── properties/            # Own properties only — add, edit
│   │   │   ├── tenants/               # Tenants on own properties
│   │   │   ├── leases/                # Create & manage own leases
│   │   │   ├── payments/              # Track rent, mark received
│   │   │   ├── maintenance/           # View & respond to requests
│   │   │   ├── notifications/         # MyNotificationsView
│   │   │   ├── profile/               #  ProfileEditView, KYC upload
│   │   │
│   │   ├── tenant/
│   │   │   ├── overview/              # TenantOverviewView — lease + payment summary
│   │   │   ├── my-lease/              # LeaseDetailView — read-only
│   │   │   ├── payments/              # PaymentHistoryView, download receipts
│   │   │   ├── maintenance/           # SubmitRequestForm, RequestTracker
│   │   │   ├── notifications/         # MyNotificationsView
│   │   │   └── profile/               # ProfileEditView, KYC upload
│   │   │
│   │   └── auth/                      # LoginForm, RegisterForm
│   │
│   ├── partials/                      # Primitives — check here before creating anything new
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Checkbox.tsx
│   │   └── Avatar.tsx
│   │
│   ├── layout/                        # App shell components
│   │   ├── AdminShell.tsx             # Admin sidebar + topbar wrapper
│   │   ├── LandlordShell.tsx          # Landlord sidebar + topbar wrapper
│   │   ├── TenantShell.tsx            # Tenant sidebar + topbar wrapper
│   │   ├── Sidebar.tsx                # Shared sidebar — receives navItems prop
│   │   ├── Topbar.tsx
│   │   ├── NavItem.tsx
│   │   └── MobileNav.tsx
│   │
│   └── ui/                            # Feedback & display
│       ├── Alert.tsx
│       ├── Toast.tsx
│       ├── EmptyState.tsx
│       ├── Skeleton.tsx
│       ├── DataTable.tsx
│       └── StatCard.tsx
│
├── hooks/                             # Shared hooks — used by 2+ features only
├── services/                          # All API fetch functions — one file per domain
│   ├── properties.service.ts
│   ├── tenants.service.ts
│   ├── leases.service.ts
│   ├── maintenance.service.ts
│   ├── payments.service.ts
│   ├── vendors.service.ts
│   ├── staff.service.ts
│   └── users.service.ts
├── context/                           # React context providers (AuthContext)
└── lib/                               # Utilities, zod schemas, formatters
```

---

## Page Rule — Pages Are Always Thin

Pages only render their dashboard-scoped feature View. No logic, no hooks, no extra imports.

```tsx
// app/(admin)/properties/page.tsx
import { AdminPropertiesView } from '@/components/features/admin/properties/AdminPropertiesView';
export default function AdminPropertiesPage() { return <AdminPropertiesView />; }
```

```tsx
// app/(landlord)/properties/page.tsx
import { LandlordPropertiesView } from '@/components/features/landlord/properties/LandlordPropertiesView';
export default function LandlordPropertiesPage() { return <LandlordPropertiesView />; }
```

```tsx
// app/(tenant)/maintenance/page.tsx
import { TenantMaintenanceView } from '@/components/features/tenant/maintenance/TenantMaintenanceView';
export default function TenantMaintenancePage() { return <TenantMaintenanceView />; }
```

The same domain (e.g. `maintenance`) has **three separate View components** — one per dashboard — because the data scope, actions, and UI differ by role.

---

## Component Check — Before Creating Anything

1. Does a matching primitive exist in `partials/`? → reuse it.
2. Does a matching display component exist in `ui/`? → reuse it.
3. Does a matching layout component exist in `layout/`? → reuse it.
4. Only then create a new component — inside `features/<dashboard>/<module>/`.

The same module (e.g. `maintenance`) will have **separate components per dashboard** because the UI and actions differ. Never mix admin and tenant logic in one component.

---

## Service Layer Pattern

All API calls live in `services/`. Components never call `fetch` directly.

Each service file is **role-agnostic at the fetch level** — the backend enforces ownership. The calling hook passes the right query (e.g. a tenant's hook calls `getMyLease()`, a landlord's calls `getAll()`).

```ts
// services/properties.service.ts
import type { IProperty, ICreatePropertyPayload } from '@ems/shared';

const API = process.env.NEXT_PUBLIC_API_URL!;

export const propertiesService = {
  async getAll(): Promise<IProperty[]> {
    const res = await fetch(`${API}/api/properties`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getById(id: string): Promise<IProperty> {
    const res = await fetch(`${API}/api/properties/${id}`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async create(payload: ICreatePropertyPayload): Promise<IProperty> {
    const res = await fetch(`${API}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async update(id: string, payload: Partial<ICreatePropertyPayload>): Promise<IProperty> {
    const res = await fetch(`${API}/api/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API}/api/properties/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
  },
};
```

---

## Feature Hook Pattern

Every feature folder has one `use-<feature>.ts` hook scoped to that dashboard. It owns the state and calls the service with the right parameters for its role.

Naming convention: `use-admin-properties.ts` / `use-landlord-properties.ts` / `use-tenant-maintenance.ts`

```ts
// components/features/properties/use-properties.ts
import { useState, useEffect } from 'react';
import { propertiesService } from '@/services/properties.service';
import type { IProperty, ICreatePropertyPayload } from '@ems/shared';

export function useProperties() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProperties(await propertiesService.getAll());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (payload: ICreatePropertyPayload) => {
    const created = await propertiesService.create(payload);
    setProperties(prev => [created, ...prev]);
  };

  const remove = async (id: string) => {
    await propertiesService.remove(id);
    setProperties(prev => prev.filter(p => p._id !== id));
  };

  useEffect(() => { fetchAll(); }, []);

  return { properties, isLoading, error, refetch: fetchAll, create, remove };
}
```

---

## UI States — Always Handle All Three

Never render a list without handling loading, error, and empty.

```tsx
const { properties, isLoading, error, refetch } = useProperties();

if (isLoading) return <Skeleton />;
if (error)     return <ErrorMessage message={error} onRetry={refetch} />;
if (properties.length === 0) return <EmptyState title="No properties yet" action="Add Property" />;
return <PropertyTable data={properties} />;
```

---

## Form Pattern (react-hook-form + zod)

```tsx
// components/features/properties/AddPropertyForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ICreatePropertyPayload } from '@ems/shared';

const schema = z.object({
  title:       z.string().min(1, 'Title is required'),
  type:        z.enum(['apartment', 'duplex', 'commercial', 'land']),
  address:     z.string().min(1, 'Address is required'),
  rentAmount:  z.number({ invalid_type_error: 'Enter a valid amount' }).min(0),
  bedrooms:    z.number().min(1),
  estateZone:  z.string().min(1, 'Zone is required'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (values: ICreatePropertyPayload) => Promise<void>;
  onClose: () => void;
}

export function AddPropertyForm({ onSubmit, onClose }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      {/* remaining fields */}
      <Button type="submit" loading={isSubmitting}>Create Property</Button>
    </form>
  );
}
```

---

## Design System

### Concept
The EMS visual identity reflects a **campus institutional authority** — structured, trustworthy, and professional. Think of a well-managed university estate office: clean desks, clear signage, no clutter. The palette leans on deep navy (authority + trust), warm white surfaces (openness), and purposeful status colors.

---

### Color Palette

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ── Brand ──────────────────────────────── */
  --color-primary:        oklch(38% 0.16 248);   /* Deep institutional navy   */
  --color-primary-hover:  oklch(32% 0.16 248);   /* Darker on hover           */
  --color-primary-light:  oklch(94% 0.04 248);   /* Tinted background / chips */

  /* ── Surface ─────────────────────────────── */
  --color-surface:        oklch(99% 0.003 248);  /* Near-white page bg        */
  --color-surface-raised: oklch(100% 0 0);       /* Card / modal bg           */
  --color-surface-sunken: oklch(96% 0.006 248);  /* Input / table row bg      */
  --color-border:         oklch(89% 0.008 248);  /* Dividers, input borders   */

  /* ── Text ────────────────────────────────── */
  --color-text-primary:   oklch(18% 0.02 248);   /* Body / heading text       */
  --color-text-secondary: oklch(48% 0.02 248);   /* Meta, labels, captions    */
  --color-text-disabled:  oklch(70% 0.01 248);   /* Placeholder, disabled     */
  --color-text-inverse:   oklch(99% 0 0);        /* Text on dark bg           */

  /* ── Status / Semantic ───────────────────── */
  --color-success:        oklch(54% 0.16 155);   /* Active lease, paid        */
  --color-success-bg:     oklch(95% 0.04 155);
  --color-warning:        oklch(68% 0.17 68);    /* Overdue, expiring soon    */
  --color-warning-bg:     oklch(96% 0.05 68);
  --color-danger:         oklch(52% 0.20 22);    /* Error, terminated, urgent */
  --color-danger-bg:      oklch(96% 0.04 22);
  --color-info:           oklch(56% 0.16 240);   /* Informational notices     */
  --color-info-bg:        oklch(95% 0.04 240);

  /* ── Sidebar ─────────────────────────────── */
  --color-sidebar-bg:     oklch(22% 0.06 248);   /* Dark navy sidebar         */
  --color-sidebar-text:   oklch(80% 0.02 248);   /* Muted sidebar labels      */
  --color-sidebar-active: oklch(99% 0 0);        /* Active nav item text      */
  --color-sidebar-hover:  oklch(30% 0.06 248);   /* Nav hover bg              */
  --color-sidebar-accent: oklch(62% 0.17 248);   /* Active indicator bar      */

  /* ── Typography ──────────────────────────── */
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', 'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* ── Spacing & Radius ────────────────────── */
  --radius-sm:   0.375rem;   /* Tags, badges                */
  --radius-md:   0.625rem;   /* Inputs, buttons             */
  --radius-lg:   0.875rem;   /* Cards, modals               */
  --radius-xl:   1.25rem;    /* Full panels                 */

  /* ── Shadows ─────────────────────────────── */
  --shadow-card: 0 1px 3px oklch(18% 0.02 248 / 0.08), 0 1px 2px oklch(18% 0.02 248 / 0.06);
  --shadow-modal:0 10px 25px oklch(18% 0.02 248 / 0.15), 0 4px 10px oklch(18% 0.02 248 / 0.10);
}
```

---

### Typography Scale

| Role           | Font                  | Size        | Weight | Usage                         |
|----------------|-----------------------|-------------|--------|-------------------------------|
| Page title     | Plus Jakarta Sans     | `text-2xl`  | 700    | Dashboard heading, page H1    |
| Section title  | Plus Jakarta Sans     | `text-lg`   | 600    | Card titles, modal headers    |
| Body           | Inter                 | `text-sm`   | 400    | Table content, descriptions   |
| Label          | Inter                 | `text-xs`   | 500    | Form labels, table headers    |
| Stat number    | Plus Jakarta Sans     | `text-3xl`  | 700    | StatCard values (occupancy %) |
| Code / ID      | JetBrains Mono        | `text-xs`   | 400    | Ticket IDs, reference numbers |

Load fonts in `app/layout.tsx`:
```tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

### Component Patterns

#### Status Badges

Map domain values to semantic colors consistently across every module.

```tsx
// components/partials/StatusBadge.tsx
const statusMap: Record<string, string> = {
  // Property
  available:    'bg-[--color-success-bg]   text-[--color-success]',
  occupied:     'bg-[--color-primary-light] text-[--color-primary]',
  maintenance:  'bg-[--color-warning-bg]   text-[--color-warning]',
  inactive:     'bg-[--color-surface-sunken] text-[--color-text-disabled]',
  // Lease
  active:       'bg-[--color-success-bg]   text-[--color-success]',
  expired:      'bg-[--color-danger-bg]    text-[--color-danger]',
  terminated:   'bg-[--color-danger-bg]    text-[--color-danger]',
  renewed:      'bg-[--color-info-bg]      text-[--color-info]',
  // Payment
  paid:         'bg-[--color-success-bg]   text-[--color-success]',
  overdue:      'bg-[--color-danger-bg]    text-[--color-danger]',
  pending:      'bg-[--color-warning-bg]   text-[--color-warning]',
  // Maintenance priority
  urgent:       'bg-[--color-danger-bg]    text-[--color-danger]',
  high:         'bg-[--color-warning-bg]   text-[--color-warning]',
  medium:       'bg-[--color-info-bg]      text-[--color-info]',
  low:          'bg-[--color-surface-sunken] text-[--color-text-secondary]',
};

export function StatusBadge({ status }: { status: string }) {
  const classes = statusMap[status] ?? 'bg-[--color-surface-sunken] text-[--color-text-secondary]';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[--radius-sm] text-xs font-medium capitalize ${classes}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
```

#### Cards

```tsx
// Standard card wrapper — use for all dashboard panels
<div className="bg-[--color-surface-raised] rounded-[--radius-lg] border border-[--color-border] shadow-[--shadow-card] p-6">
  {children}
</div>
```

#### Stat Cards (Dashboard overview)

```tsx
<div className="bg-[--color-surface-raised] rounded-[--radius-lg] border border-[--color-border] shadow-[--shadow-card] p-6">
  <p className="text-xs font-medium text-[--color-text-secondary] uppercase tracking-wide">{label}</p>
  <p className="mt-2 font-[--font-display] text-3xl font-bold text-[--color-text-primary]">{value}</p>
  <p className="mt-1 text-xs text-[--color-text-secondary]">{subtitle}</p>
</div>
```

#### Sidebar

```tsx
// Dark navy sidebar with light text
<aside className="w-64 h-screen bg-[--color-sidebar-bg] flex flex-col">
  {/* Logo zone */}
  <div className="px-6 py-5 border-b border-white/10">
    <span className="font-[--font-display] text-lg font-bold text-[--color-sidebar-active]">EMS</span>
  </div>

  {/* Nav items */}
  <nav className="flex-1 px-3 py-4 space-y-0.5">
    <NavItem href="/properties" icon={<BuildingIcon />} label="Properties" />
  </nav>
</aside>
```

```tsx
// NavItem — active state uses left accent bar
function NavItem({ href, icon, label, active }) {
  return (
    <a href={href} className={`
      flex items-center gap-3 px-3 py-2.5 rounded-[--radius-md] text-sm font-medium transition-colors
      ${active
        ? 'bg-[--color-sidebar-hover] text-[--color-sidebar-active] border-l-2 border-[--color-sidebar-accent]'
        : 'text-[--color-sidebar-text] hover:bg-[--color-sidebar-hover] hover:text-[--color-sidebar-active]'
      }
    `}>
      {icon}
      {label}
    </a>
  );
}
```

#### Buttons

```tsx
// Primary
<button className="inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-md] text-sm font-medium bg-[--color-primary] text-[--color-text-inverse] hover:bg-[--color-primary-hover] transition-colors">
  Create Property
</button>

// Secondary / outline
<button className="inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-md] text-sm font-medium border border-[--color-border] bg-[--color-surface-raised] text-[--color-text-primary] hover:bg-[--color-surface-sunken] transition-colors">
  Cancel
</button>

// Danger
<button className="inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-md] text-sm font-medium bg-[--color-danger] text-white hover:opacity-90 transition-opacity">
  Delete
</button>
```

#### Form Inputs

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-[--color-text-secondary] uppercase tracking-wide">
    Property Title
  </label>
  <input
    className="w-full px-3 py-2.5 rounded-[--radius-md] border border-[--color-border] bg-[--color-surface-sunken] text-sm text-[--color-text-primary] placeholder:text-[--color-text-disabled] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/30 focus:border-[--color-primary] transition-colors"
    placeholder="e.g. Block A — Unit 12"
  />
  {error && <p className="text-xs text-[--color-danger]">{error}</p>}
</div>
```

#### Data Tables

```tsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-[--color-border]">
      <th className="px-4 py-3 text-left text-xs font-medium text-[--color-text-secondary] uppercase tracking-wide">
        Property
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-[--color-border]">
    <tr className="hover:bg-[--color-surface-sunken] transition-colors">
      <td className="px-4 py-3.5 text-[--color-text-primary]">Block A</td>
    </tr>
  </tbody>
</table>
```

---

### Design Rules

- ❌ No raw hex colors — always reference a `--color-*` token
- ❌ No inline styles — Tailwind utility classes only
- ❌ No `theme.extend` in a config file — use `@theme` in CSS
- ✅ Dark sidebar + light content area — never invert this
- ✅ Status badges must use the `statusMap` pattern — no one-off color classes
- ✅ All card surfaces use `--color-surface-raised` + `--shadow-card`
- ✅ All inputs use `--color-surface-sunken` background + `--color-border` border
- ✅ Font Display (`Plus Jakarta Sans`) for all headings, numbers, and stat values
- ✅ Font Sans (`Inter`) for all body text, labels, and table content
## Route Groups & Middleware

Each route group has its own `layout.tsx` that validates the role. The root `middleware.ts` handles the auth gate and role-based redirect.

```ts
// middleware.ts  (apps/web root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

const ROLE_HOME: Record<string, string> = {
  admin:    '/admin/overview',
  landlord: '/landlord/overview',
  tenant:   '/tenant/overview',
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get('ems_token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

  // No token → send to login (except auth pages)
  if (!token && !isAuthPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Has token on auth page → redirect to role home
  if (token && isAuthPath) {
    try {
      const { role } = jwtDecode<{ role: string }>(token);
      return NextResponse.redirect(new URL(ROLE_HOME[role] ?? '/login', req.url));
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protect dashboard route groups by role
  if (token) {
    try {
      const { role } = jwtDecode<{ role: string }>(token);
      if (pathname.startsWith('/admin')    && role !== 'admin')    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? '/login', req.url));
      if (pathname.startsWith('/landlord') && role !== 'landlord') return NextResponse.redirect(new URL(ROLE_HOME[role] ?? '/login', req.url));
      if (pathname.startsWith('/tenant')  && role !== 'tenant')   return NextResponse.redirect(new URL(ROLE_HOME[role] ?? '/login', req.url));
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
```

### Layout Shell pattern (one per dashboard)

```tsx
// app/(admin)/layout.tsx
import { AdminShell } from '@/components/layout/AdminShell';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
```

```tsx
// app/(landlord)/layout.tsx
import { LandlordShell } from '@/components/layout/LandlordShell';
export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return <LandlordShell>{children}</LandlordShell>;
}
```

```tsx
// app/(tenant)/layout.tsx
import { TenantShell } from '@/components/layout/TenantShell';
export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <TenantShell>{children}</TenantShell>;
}
```

### Sidebar nav items — per dashboard

```ts
// lib/nav.ts
import {
  LayoutDashboard, Building2, Users, FileText,
  CreditCard, Wrench, HardHat, UserCog, BarChart3,
  Settings, Home, ClipboardList, UserCircle,
} from 'lucide-react';

export const adminNav = [
  { label: 'Overview',    href: '/admin/overview',    icon: LayoutDashboard },
  { label: 'Properties',  href: '/admin/properties',  icon: Building2 },
  { label: 'Tenants',     href: '/admin/tenants',     icon: Users },
  { label: 'Leases',      href: '/admin/leases',      icon: FileText },
  { label: 'Payments',    href: '/admin/payments',    icon: CreditCard },
  { label: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
  { label: 'Vendors',     href: '/admin/vendors',     icon: HardHat },
  { label: 'Staff',       href: '/admin/staff',       icon: UserCog },
  { label: 'Users',       href: '/admin/users',       icon: Users },
  { label: 'Reports',     href: '/admin/reports',     icon: BarChart3 },
  { label: 'Settings',    href: '/admin/settings',    icon: Settings },
];

export const landlordNav = [
  { label: 'Overview',    href: '/landlord/overview',    icon: LayoutDashboard },
  { label: 'Properties',  href: '/landlord/properties',  icon: Building2 },
  { label: 'Tenants',     href: '/landlord/tenants',     icon: Users },
  { label: 'Leases',      href: '/landlord/leases',      icon: FileText },
  { label: 'Payments',    href: '/landlord/payments',    icon: CreditCard },
  { label: 'Maintenance', href: '/landlord/maintenance', icon: Wrench },
  { label: 'Vendors',     href: '/landlord/vendors',     icon: HardHat },
  { label: 'Reports',     href: '/landlord/reports',     icon: BarChart3 },
];

export const tenantNav = [
  { label: 'Overview',    href: '/tenant/overview',     icon: LayoutDashboard },
  { label: 'My Lease',    href: '/tenant/my-lease',     icon: Home },
  { label: 'Payments',    href: '/tenant/payments',     icon: CreditCard },
  { label: 'Maintenance', href: '/tenant/maintenance',  icon: ClipboardList },
  { label: 'Profile',     href: '/tenant/profile',      icon: UserCircle },
];
```

---

## Frontend Hard Rules

- ❌ No `any` in TypeScript
- ❌ No API calls inside React components — only through `services/` via hooks
- ❌ No logic in page files — pages render one View component only
- ❌ No duplicate types — import from `@ems/shared`
- ❌ No `localStorage` for tokens — httpOnly cookies only
- ❌ No inline styles — Tailwind v4 utility classes only
- ❌ No `theme.extend` — use `@theme` in CSS
- ❌ No skipping UI states — always handle loading, error, empty
- ❌ No creating a primitive or layout component when one already exists in `partials/` / `layout/` / `ui/`