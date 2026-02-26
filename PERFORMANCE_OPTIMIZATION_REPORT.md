# Frontend Performance & Quality Report

**Goal:** Make the site super fast for users.  
**Scope:** frontend-new (Next.js app).

---

## 1. Bundle & Loading

| Finding | Location | Impact | Effort |
|--------|----------|--------|--------|
| No `next/dynamic` or `React.lazy` | App-wide | Medium | Low |
| Empty/minimal `next.config` | `next.config.ts` | Medium | Low |
| Dashboard shell always loaded | `(dashboard)/layout.tsx` | Medium | Medium |
| Admin layout blocks on `useUser` | `(admin)/layout.tsx` | Medium | Low |
| lucide-react / date-fns / radix | Multiple files | Low | — |

- **Code-splitting:** Only route-level splitting; no lazy loading of heavy UI (dialogs, admin shell).
- **next.config:** Default only; no bundle or experimental optimizations.
- **Dashboard layout:** AppHeader, MobileBottomNav, ErrorBoundary, OnboardingGuard, AdminRedirectGuard are all on the critical path for every dashboard route.
- **Icons/dates:** Named imports used; tree-shaking is effective.

---

## 2. Data Fetching

| Finding | Location | Impact | Effort |
|--------|----------|--------|--------|
| No prefetch on hover/route | App-wide | Medium | Medium |
| Inconsistent React Query defaults | `query-provider.tsx`, hooks | Low | Low |
| No request waterfalls | Dashboard / admin | — | — |
| Duplicate requests avoided | Shared queryKeys | — | — |

- **QueryProvider:** Only `staleTime: 60 * 1000`; no `gcTime`, `refetchOnWindowFocus`, or `retry` in defaults.
- **Prefetching:** No `prefetchQuery` or link-hover prefetch; every navigation waits for that page’s queries.
- **Waterfalls:** Multiple queries run in parallel; no obvious sequential waterfalls.
- **Deduplication:** Same queryKey across components, so React Query deduplicates.

---

## 3. React Patterns

| Finding | Location | Impact | Effort |
|--------|----------|--------|--------|
| Lists not virtualized | Jobs, clients, invoices, admin | **High** if lists grow | High |
| Lists have keys | All list pages | — | — |
| Limited memo/useCallback | App-wide | Low | Medium |
| Dialogs always in tree | e.g. workers page | Low | Low |

- **Lists:** Jobs, clients, invoices, admin users/businesses all use `.map()` with no virtualization. 100+ items = 100+ DOM nodes and more work on scroll/update.
- **memo/useCallback:** Used in a few places (app-header, workers); not used in list item components or other hot paths.

---

## 4. Assets & Media

| Finding | Location | Impact | Effort |
|--------|----------|--------|--------|
| Job photos use raw `<img>` | `jobs/[id]/page.tsx` | **Medium** | Low |
| No `next/image` | App-wide | Medium for LCP/images | Low–Medium |
| Fonts use `next/font` | Root layout | Good | — |

- **Job detail photos:** `<img src={photo.imageUrl} />` with no `next/image`, no `loading="lazy"`, no `sizes`; all photos load eagerly and are not optimized.
- **Fonts:** Roboto and Inter via `next/font/google`; non-blocking and good for LCP.

---

## 5. Layout & Components

| Finding | Location | Impact | Effort |
|--------|----------|--------|--------|
| Root layout is lean | `app/layout.tsx` | Good | — |
| Dashboard shell not lazy | Dashboard layout | Medium | Medium |
| Suspense only on jobs list | Jobs vs clients/invoices | Low | Low |

- **Root layout:** Minimal critical path (fonts, globals, QueryProvider).
- **Dashboard:** Full shell loaded for every dashboard route.
- **Suspense:** Jobs page uses `<Suspense>`; clients and invoices do not.

---

## 6. Code Quality

| Finding | Location | Impact | Effort |
|--------|----------|--------|--------|
| Repeated API list normalization | 6+ pages | Medium | Low |
| Repeated message banner pattern | Job detail, invoices, settings, workers | Low | Low |
| Backend response shape inconsistency | `{ data: T[] }` vs `T[]` | Medium | Backend |

- **Array normalization:** Same pattern in many places:  
  `const list = Array.isArray(data) ? data : (data as { data?: T[] })?.data ?? [];`  
  Should be a single helper (e.g. in `lib/api`).
- **Message banner:** Same success/error state + className pattern in multiple pages; a shared `MessageBanner` would reduce duplication.
- **Backend shape:** Some endpoints return `T[]`, others `{ data: T[] }`; normalizing once in the API layer would simplify pages.

---

# Optimization Plan (Prioritized)

## Phase 1: Quick wins (low effort, clear impact)

1. **Normalize API list responses in one place**  
   Add `normalizeList<T>(res: T[] | { data?: T[] }): T[]` in `lib/api.ts` and use it everywhere.  
   **Impact:** Less duplication, fewer bugs when backend shape changes. **Effort:** Low.

2. **Use `next/image` for job photos**  
   In `jobs/[id]/page.tsx`, replace `<img>` with `<Image>` for `photo.imageUrl`; add `sizes` and `loading="lazy"` (or `priority` for first image).  
   **Impact:** Better LCP, less layout shift, automatic optimization. **Effort:** Low.

3. **Tune React Query defaults**  
   In `QueryProvider`: set `refetchOnWindowFocus: false` (or true only where needed), `gcTime`, and consistent `staleTime`.  
   **Impact:** Fewer unnecessary refetches, predictable cache. **Effort:** Low.

4. **Add `loading="lazy"` to below-the-fold images**  
   For any remaining raw `<img>` that are not LCP, add `loading="lazy"`.  
   **Impact:** Less initial network and decode. **Effort:** Low.

5. **Shared message/inline-alert component**  
   Extract the repeated success/error banner into one component (e.g. `InlineMessage` or `AlertBanner`).  
   **Impact:** Consistent UX, less code. **Effort:** Low.

---

## Phase 2: Medium effort

6. **Lazy-load dashboard shell or heavy pieces**  
   Use `next/dynamic` for `MobileBottomNav`, `AppHeader`, or worker dialogs with a simple loading state.  
   **Impact:** Smaller initial chunk, faster TTI. **Effort:** Medium.

7. **Prefetch on link hover / route change**  
   Prefetch `['job', id]` on job link hover; prefetch list data when navigating toward jobs/clients/invoices.  
   **Impact:** Faster perceived navigation. **Effort:** Medium.

8. **Extend Suspense usage**  
   Wrap clients and invoices list content in `<Suspense>` with a skeleton/fallback like the jobs page.  
   **Impact:** Consistent loading UX, better streaming. **Effort:** Low.

9. **Next.js config**  
   In `next.config.ts`, add `experimental.optimizePackageImports` for `lucide-react` (if supported in Next 16) and any other heavy packages; ensure static generation where possible.  
   **Impact:** Smaller bundles. **Effort:** Low–Medium.

---

## Phase 3: Larger refactors

10. **Virtualize long lists**  
    For jobs, clients, invoices, admin users/businesses, use a virtual list (e.g. `@tanstack/react-virtual`) when list length exceeds a threshold (e.g. 50).  
    **Impact:** Smoother scroll, fewer DOM nodes with 100+ items. **Effort:** High.

11. **Unify backend list response shape**  
    Standardize on one shape (e.g. always `{ data: T[] }`) and normalize once in the API client.  
    **Impact:** Simpler frontend, easier pagination later. **Effort:** Backend + low frontend.

12. **Lazy-load admin layout**  
    Load admin shell only when entering admin routes (e.g. dynamic import of admin layout or heavy children).  
    **Impact:** Smaller initial bundle for non-admin users. **Effort:** Medium.

---

# Expected Impact Summary

| Change | Expected effect |
|--------|------------------|
| `next/image` + lazy for job photos | Better LCP, less layout shift, smaller image payloads |
| API list normalization + shared message component | Less JS, easier maintenance, consistent UX |
| React Query defaults + prefetch | Fewer redundant requests, faster navigation |
| Lazy dashboard shell / admin | Smaller initial JS, faster TTI |
| Virtualized lists (when large) | Smoother list scroll, lower memory and DOM cost |
| next.config + Suspense | Smaller bundle, predictable loading states |

---

# File Reference Summary

- **Config:** `next.config.ts`
- **Layouts:** `app/layout.tsx`, `app/(dashboard)/layout.tsx`, `app/(admin)/layout.tsx`
- **Data:** `providers/query-provider.tsx`, `lib/api.ts`, `hooks/use-user.ts`, `hooks/use-business.ts`
- **Lists:** `app/(dashboard)/jobs/page.tsx`, `clients/page.tsx`, `invoices/page.tsx`, `my-jobs/page.tsx`, `admin/users/page.tsx`, `admin/businesses/page.tsx`
- **Job detail & photos:** `app/(dashboard)/jobs/[id]/page.tsx`
- **Message pattern:** `jobs/[id]/page.tsx`, `invoices/page.tsx`, `invoices/[id]/page.tsx`, `settings/page.tsx`, `settings/workers/page.tsx`
