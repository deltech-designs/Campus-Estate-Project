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
│   ├── (auth)/                      # Public — no layout wrapper
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/                 # Protected — wraps DashboardShell
│   │   ├── layout.tsx               # Renders <DashboardShell>
│   │   ├── overview/page.tsx
│   │   ├── properties/page.tsx
│   │   ├── tenants/page.tsx
│   │   ├── leases/page.tsx
│   │   ├── maintenance/page.tsx
│   │   ├── payments/page.tsx
│   │   ├── vendors/page.tsx
│   │   ├── staff/page.tsx
│   │   └── reports/page.tsx
│   ├── globals.css
│   └── layout.tsx                   # Root layout — fonts, providers
│
├── components/
│   ├── features/                    # Domain UI — one folder per module
│   │   ├── properties/
│   │   │   ├── PropertiesView.tsx   ← Entry point (only thing imported by page)
│   │   │   ├── PropertyTable.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── AddPropertyForm.tsx
│   │   │   ├── EditPropertyForm.tsx
│   │   │   ├── PropertyStatusBadge.tsx
│   │   │   └── use-properties.ts   ← Feature-scoped hook
│   │   ├── tenants/
│   │   ├── leases/
│   │   ├── maintenance/
│   │   ├── payments/
│   │   ├── vendors/
│   │   ├── staff/
│   │   └── auth/
│   │
│   ├── partials/                    # Primitives — check here before creating anything new
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Checkbox.tsx
│   │   └── Avatar.tsx
│   │
│   ├── layout/                      # App shell
│   │   ├── DashboardShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── NavItem.tsx
│   │   └── MobileNav.tsx
│   │
│   └── ui/                          # Feedback & display
│       ├── Alert.tsx
│       ├── Toast.tsx
│       ├── EmptyState.tsx
│       ├── Skeleton.tsx
│       ├── DataTable.tsx
│       └── StatCard.tsx
│
├── hooks/                           # Shared hooks — used by 2+ features only
├── services/                        # All API fetch functions — one file per domain
│   ├── properties.service.ts
│   ├── tenants.service.ts
│   ├── leases.service.ts
│   ├── maintenance.service.ts
│   ├── payments.service.ts
│   ├── vendors.service.ts
│   └── staff.service.ts
├── context/                         # React context providers
└── lib/                             # Utilities, zod schemas, formatters
```

---

## Page Rule — Pages Are Always Thin

Pages only render their feature's entry component. No logic, no hooks, no imports beyond the View.

```tsx
// app/(dashboard)/properties/page.tsx
import { PropertiesView } from '@/components/features/properties/PropertiesView';
export default function PropertiesPage() { return <PropertiesView />; }
```

```tsx
// app/(dashboard)/maintenance/page.tsx
import { MaintenanceView } from '@/components/features/maintenance/MaintenanceView';
export default function MaintenancePage() { return <MaintenanceView />; }
```

---

## Component Check — Before Creating Anything

1. Does a matching primitive exist in `partials/`? → reuse it.
2. Does a matching display component exist in `ui/`? → reuse it.
3. Does a matching layout component exist in `layout/`? → reuse it.
4. Only then create a new component inside `features/<module>/`.

---

## Service Layer Pattern

All API calls live in `services/`. Components never call `fetch` directly.

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

Every feature folder has one `use-<feature>.ts` hook. It owns the state and calls the service.

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

## Tailwind v4 Design Tokens

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary:  oklch(45% 0.18 240);    /* Deep estate navy */
  --color-accent:   oklch(65% 0.15 160);    /* Status green */
  --color-warning:  oklch(75% 0.18 75);     /* Overdue amber */
  --color-danger:   oklch(55% 0.22 25);     /* Error red */
  --color-surface:  oklch(98% 0.005 240);   /* Off-white background */
  --color-muted:    oklch(55% 0.02 240);    /* Secondary text */

  --font-sans:    'Inter', sans-serif;
  --font-display: 'Syne', sans-serif;       /* Headings and dashboard titles */

  --radius-card: 0.75rem;
  --radius-btn:  0.5rem;
}
```

Rules:
- Use `@theme` in CSS — **never** `theme.extend` in a config file.
- No inline styles — Tailwind utility classes only.
- Use `--color-*` tokens for any color that recurs.

---

## Route Groups & Middleware

```ts
// middleware.ts  (apps/web root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('ems_token');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/(auth)') ||
                      req.nextUrl.pathname === '/login';

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
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