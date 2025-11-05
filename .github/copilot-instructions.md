
# Copilot Instructions: Studio37 Monorepo (Next.js + Supabase)

Purpose: Give AI coding agents the minimum context to be productive in this codebase and avoid common pitfalls.

## Architecture & Data Flow
- Monorepo: apps live in `apps/*` (e.g., `apps/workflow`), shared code in `packages/shared`. Web site/admin is the Next.js app in `app/`.
- Web stack: Next.js 14 App Router + TypeScript + Tailwind on Netlify. PWA via `@ducanh2912/next-pwa` (disabled in dev).
- Data: Supabase (PostgreSQL). Public reads use `lib/supabase.ts`. Service role client `lib/supabaseAdmin.ts` is ONLY for server API routes under `app/api/**`.
- Core tables: `content_pages`, `blog_posts`, `gallery_images`, `settings`, `page_configs`, `admin_users`, `admin_sessions`.

## Dev Workflow
- Scripts (`package.json`): `dev`, `build`, `start`, `lint`, `typecheck`, `analyze` (set `ANALYZE=true` to enable bundle analyzer in prod builds).
- Env (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; server-only: `SUPABASE_SERVICE_ROLE_KEY`.
- Netlify (`netlify.toml`): uses `@netlify/plugin-nextjs` and long-lived caching headers. Images are unoptimized on Netlify when `NETLIFY=true` in `next.config.js`.
- Path alias: import with `@/*` per `tsconfig.json`.

## Patterns You’ll Reuse
- Public pages = anon Supabase + ISR: export `revalidate` for caching. Examples: `app/blog/page.tsx`, `app/[slug]/page.tsx`.
- MDX pages/blocks: `app/[slug]/page.tsx` renders MDX (next-mdx-remote/rsc). Visual blocks live in `components/BuilderRuntime.tsx`. To add a block, export it there and register in `MDXBuilderComponents`.
- Admin auth/session: Login API `app/api/auth/login/route.ts` (validate → rateLimit → bcrypt → create session → httpOnly cookie). `middleware.ts` protects `/admin/**` (except `/login`, `/setup-admin`). Client-side guard: `components/AdminProtected.tsx` checks `/api/auth/session`.
- Server comps needing cookies: use `createServerComponentClient({ cookies })` (see usage in builder/gallery blocks).
- API routes: Use NextRequest/NextResponse with `lib/rateLimit.ts` and `lib/logger.ts` for consistency.
- Images: `next.config.js` sets `remotePatterns` (Unsplash, Supabase, Cloudinary), formats (AVIF/WebP), and cache TTL; prefer `next/image` (note: unoptimized on Netlify).
- SEO/PWA: `app/robots.ts`, `app/sitemap.ts`, `public/manifest.webmanifest`, icons in `public/icons/`.

## Gotchas (avoid footguns)
- Never import `lib/supabaseAdmin.ts` outside `app/api/**`.
- Admin pages often need `force-dynamic` due to cookie/session usage.
- Don’t expose server-only env to client. Use `rehype-raw` only with sanitized content.

## Quick References
- ISR example: `app/blog/page.tsx`
- MDX + blocks: `app/[slug]/page.tsx`, `components/BuilderRuntime.tsx`
- Auth/session: `app/api/auth/login/route.ts`, `app/api/auth/session/route.ts`, `middleware.ts`, `components/AdminProtected.tsx`
- Config: `next.config.js`, `netlify.toml`, `tailwind.config.js`

More context: `README_ECOSYSTEM.md` (mono-repo plan) and `README.md` (site features/quickstart). Apply changes consistent with these patterns.