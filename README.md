# Clenvora – New Frontend

A clean, minimal SaaS UI for cleaning business management. Built from scratch with a focus on clarity, maintainability, and ease of use for cleaners.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **shadcn/ui** (Button, Card, Input, Badge, Avatar, Skeleton, Sonner)
- **TanStack Query** (React Query)
- **Supabase** (Auth)
- **date-fns** (Date formatting)
- **Sonner** (Toast notifications)

## Design Philosophy

- **Minimal**: No clutter, clear hierarchy
- **Colorful**: Purposeful color (teal primary, colored quick actions)
- **No gradients**: Solid colors and subtle borders
- **Cleaner-friendly**: Large touch targets, simple labels, scannable lists

## Getting Started

1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`
3. Run the backend at `http://localhost:5000`
4. `npm install && npm run dev`

## GitHub & Vercel Deployment

### Prerequisites

- Node.js 20+ (or use the version in `.nvmrc` if present)
- Backend API deployed and reachable (for production)

### Deploy to Vercel

1. **Push to GitHub**  
   Ensure the `frontend-new` folder is the root of your repo, or deploy it as a monorepo with Vercel’s root directory set to `frontend-new`.

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com) → Add New Project
   - Import your GitHub repo
   - Set **Root Directory** to `frontend-new` (if it’s inside a monorepo)
   - Framework Preset: **Next.js**

3. **Environment Variables** (Vercel → Project → Settings → Environment Variables)

   | Variable                       | Description                | Example                          |
   |--------------------------------|----------------------------|----------------------------------|
   | `NEXT_PUBLIC_API_URL`          | Backend API base URL       | `https://api.yourdomain.com`     |
   | `NEXT_PUBLIC_SUPABASE_URL`     | Supabase project URL       | `https://xxx.supabase.co`        |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase anon key          | `eyJ...`                         |
   | `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`      | ImageKit public key (optional) | `public_xxx`              |
   | `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`    | ImageKit URL endpoint (optional) | `https://ik.imagekit.io/xxx` |

4. **Deploy**  
   Click Deploy. Vercel will build and deploy the app.

### CORS & Backend

Your backend must allow the Vercel domain in CORS (e.g. `https://your-app.vercel.app` or your custom domain). Update the backend CORS config accordingly.

### Deploying as Standalone Repo

To deploy only the frontend as its own GitHub repo:

1. Create a new repo and copy the contents of `frontend-new` into the root
2. Or use the monorepo and set Vercel’s **Root Directory** to `frontend-new`

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Authenticated app (layout + pages)
│   ├── auth/            # Auth callback
│   ├── login/
│   ├── register/
│   └── page.tsx         # Landing
├── components/
│   ├── app-header.tsx
│   ├── app-sidebar.tsx
│   └── ui/              # shadcn components
├── lib/
│   ├── api.ts           # API client (uses Supabase token)
│   ├── supabase/
│   └── utils.ts
├── providers/
│   └── query-provider.tsx
└── types/
    └── api.ts           # Shared API types
```

## Features

- **Auth**: Login, register, forgot password, reset password
- **Onboarding**: Business setup for new owners
- **Dashboard**: Stats, quick actions, today's jobs (role-aware)
- **Jobs**: List, create, edit, detail
- **My Jobs**: Cleaner view of assigned jobs
- **Clients**: List, create, detail
- **Invoices**: List, detail, PDF download
- **Settings / Staff**: Team members list
- **RBAC**: Owner vs cleaner navigation and access
- **Error handling**: Global boundary, API errors → toasts, 401 → sign out
- **Loading states**: Skeletons, consistent empty/error states

## API

Uses the existing backend. All requests include `Authorization: Bearer <supabase_token>`.
