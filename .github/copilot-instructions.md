# Copilot instructions for this repo

This is a Next.js 14 App Router project (TypeScript + Tailwind) deployed on Netlify, using Supabase (PostgreSQL) for data and simple admin auth. Follow these repo-specific practices to be productive and safe.

## Local dev and builds
- Scripts (see `package.json`):
  - `npm run dev` (Next dev), `npm run build`, `npm start`, `npm run lint`, `npm run typecheck` (TS), `npm run analyze` (bundle report).
- Required env (create `.env.local`):
  - Client: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Server-only: `SUPABASE_SERVICE_ROLE_KEY` (never ship to client)
  - Optional: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`
- Build analysis: set `ANALYZE=true` during build to emit a static bundle report (see `next.config.js`).
- Netlify: `netlify.toml` config, `@netlify/plugin-nextjs`, publish `.next`. On Netlify, `process.env.NETLIFY === "true"` disables Next Image optimization.
- Bundle analysis: `npm run analyze` writes a static report during production build (only when `ANALYZE=true`).

## Architecture & data flow
- App Router under `app/` with server components by default; client components start with `"use client"`.
- Server data access: use `createServerComponentClient({ cookies })` from `@supabase/auth-helpers-nextjs` inside server components that depend on auth/session.
- Public, read-mostly pages: prefer the anon client from `lib/supabase.ts` in RSC and export `revalidate` (ISR) to enable caching (see `app/blog/page.tsx` and `app/[slug]/page.tsx`).
- Client data access: use the singleton client from `lib/supabase.ts` (ensures one GoTrue client in the browser).
- Admin auth:
  - Login handler: `app/api/auth/login/route.ts` verifies credentials (bcrypt migration supported), rate-limits via `lib/rateLimit.ts`, creates a DB-backed session (`lib/authSession.ts`), and sets the `admin_session` httpOnly cookie.
  - Middleware gate: `middleware.ts` protects `/admin/**` (except `/login` and `/setup-admin`) and adds security headers.
  - Client guard: `components/AdminProtected.tsx` checks `/api/auth/session` and redirects to `/login` if not authenticated.
  - Never use `supabaseAdmin` outside API route handlers.
- Service/admin client: `lib/supabaseAdmin.ts` uses `SUPABASE_SERVICE_ROLE_KEY` and bypasses RLS; only for server-side API routes in `app/api/**`.

## Content model & rendering
- CMS pages live in Supabase tables:
  - `content_pages`: drives `app/[slug]/page.tsx`. When the content includes Builder blocks (components named `*Block`), it renders through MDX using `components/BuilderRuntime.tsx`.
  - `settings`, `page_configs`, `blog_posts`, `gallery_images`, `admin_users`, `admin_sessions` (see `supabase/schema.sql` and peers).
- MDX/Builder:
  - MDX is rendered in RSC via `next-mdx-remote/rsc` with `rehype-highlight` and optional `rehype-raw`.
  - Add visual blocks by exporting new components from `components/BuilderRuntime.tsx` and adding them to `MDXBuilderComponents`.
- Home can be fully CMS-driven if `content_pages.slug = 'home'`; otherwise uses the static composition in `app/page.tsx`.

## UI, state, and performance
- Styling: Tailwind (typography plugin enabled). Global styles in `app/globals.css`.
- Data fetching/caching (client): React Query provider is wired in `app/layout.tsx` via `components/QueryProvider.tsx` with sensible defaults.
- Images:
  - Next Image remote patterns configured in `next.config.js` (Unsplash, Supabase, Cloudinary).
  - Prefer `components/OptimizedImage.tsx` for Cloudinary-backed URLs; it applies format/quality transforms via `lib/cloudinary.ts` and blur placeholders.
- Progressive loading: heavy components are dynamically imported below the fold (see `app/page.tsx`).

## SEO & platform files
- Per-page metadata: use `generateSEOMetadata` from `lib/seo-helpers.ts` and `businessInfo` from `lib/seo-config.ts`.
- `app/robots.ts` and `app/sitemap.ts` are server functions; sitemap queries Supabase for published pages/posts and is cached for 1h via `export const revalidate = 3600`.
- Structured data: `generateLocalBusinessSchema()` and helpers in `lib/seo-config.ts`.

## API route patterns
- Route handlers live under `app/api/**/route.ts` and use `NextRequest/NextResponse`.
- Use `lib/rateLimit.ts` (`getClientIp`, `rateLimit`) for public-facing endpoints.
- Use `lib/supabaseAdmin.ts` only here. For user-scoped access, prefer RLS with anon client.
- Add CORS/headers per route as needed; baseline security headers are added in `middleware.ts`.
- Observability: `app/api/vitals/route.ts` accepts web-vitals POSTs (zod-validated, rate-limited) and best-effort inserts into `web_vitals` when present.

## Conventions & gotchas
- Path alias `@/*` is configured in `tsconfig.json`.
- TypeScript is `strict`; prefer explicit types and `zod` where validating inputs.
- Admin surfaces (e.g., `app/admin/**`) are `force-dynamic` because they depend on cookies/session.
- Don’t import server-only modules into client components. `process.env.*` without `NEXT_PUBLIC_` is server-only.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client; do not import `lib/supabaseAdmin.ts` outside `app/api/**`.
- Be cautious with MDX `rehype-raw`: it’s optional and allowed only when explicitly required; prefer sanitized content in `content_pages`.

## Examples
- Server component Supabase fetch:
  - See `app/[slug]/page.tsx` (fetches `content_pages`) and uses MDX via `MDXBuilderComponents`.
- API login with rate limit:
  - See `app/api/auth/login/route.ts` for the pattern: validate input → rate-limit → DB lookup (admin users) → bcrypt compare/migrate → create hashed session → set httpOnly cookie.
- Adding a Builder block:
  - Implement component in `components/BuilderRuntime.tsx` and add it to `MDXBuilderComponents`; blocks are usable from MDX stored in `content_pages`.

If any of the above is unclear or you need more conventions captured (tests, CI, additional APIs like `app/api/chat/**`), ask to expand this doc and point to the relevant files to scan next.