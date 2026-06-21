# EMS Monorepo — Agent Rules

These rules apply to all AI coding work in this workspace.

## Always Read These Files First

1. `.github/SKILL.md` — project overview, monorepo structure, shared types, API contract
2. `.github/Frontend.md` — for any frontend task (Next.js pages, components, hooks, services)
3. `.github/Backend.md` — for any backend task (Express routes, controllers, services, models, DTOs)

## Package Manager

**pnpm only.** Never npm or yarn.

```bash
pnpm --filter @ems/web add <package>       # frontend dep
pnpm --filter @ems/api add <package>       # backend dep
pnpm --filter @ems/shared add <package>    # shared dep
pnpm add -D <package> -w                   # root dev dep
```

## Hard Rules

- No `any` in TypeScript — anywhere
- No `npm` or `yarn` — pnpm only
- No `localStorage` for tokens — httpOnly cookies (`ems_token`) only
- Never duplicate types — import from `@ems/shared`
- No logic in Next.js page files — thin pages only
- No API calls in React components — only through `services/` via hooks
- No `res.json()` directly in Express — use `sendSuccess` / `sendError`
- Every Express route must use `asyncWrapper()`
- Never hard-delete — soft-delete with `isDeleted: true`
