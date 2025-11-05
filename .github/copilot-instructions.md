## Copilot instructions (concise, repo-specific)

**Project:** Multi-app photography business ecosystem (web admin + 4 mobile/PWA apps). See README_ECOSYSTEM.md for full architecture.

Stack and hosting
- Next.js 14 App Router + TypeScript + Tailwind; deployed on Netlify. Images are unoptimized on Netlify (next.config.js sets images.unoptimized when NETLIFY=true).
- Data: Supabase (PostgreSQL). Anon client for public reads; service role client only in server API routes.
- Mono-repo: Turborepo with workspaces (apps/* and packages/shared).

Dev workflow
- Scripts: dev, build, start, lint, typecheck, analyze (ANALYZE=true enables bundle analyzer via next.config.js).
- Required env in .env.local: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY; server-only: SUPABASE_SERVICE_ROLE_KEY; optional: GOOGLE_SITE_VERIFICATION, NEXT_PUBLIC_GA_MEASUREMENT_ID.

Data access patterns
- Public RSC pages use the anon client from lib/supabase.ts and ISR via export const revalidate (e.g., app/blog/page.tsx and app/[slug]/page.tsx revalidate=600).
- When a server component needs session/cookies, use createServerComponentClient({ cookies }) (see GalleryHighlightsBlock in components/BuilderRuntime.tsx).
- Never import lib/supabaseAdmin.ts outside app/api/**. It bypasses RLS and uses SUPABASE_SERVICE_ROLE_KEY.
- Multi-app ecosystem uses packages/shared for types and Supabase utilities. Import from @studio37/shared in mobile apps.

Admin auth model
- Login endpoint app/api/auth/login/route.ts: validate payload → rateLimit via lib/rateLimit.ts → fetch admin_users → bcrypt compare/migrate → createSession in lib/authSession.ts (hashed token stored in admin_sessions) → set httpOnly admin_session cookie.
- middleware.ts protects /admin/** (except /login and /setup-admin) and adds baseline security headers.
- components/AdminProtected.tsx checks /api/auth/session and client-redirects to /login when unauthenticated.

Content model and rendering
- CMS tables include content_pages, blog_posts, gallery_images, settings, page_configs, admin_users, admin_sessions.
- app/[slug]/page.tsx renders content_pages via MDX in RSC using next-mdx-remote/rsc with rehype-highlight and optional rehype-raw.
- Visual “Builder” blocks live in components/BuilderRuntime.tsx; export new FooBlock and add to MDXBuilderComponents to make it available in MDX.

SEO and platform
- Use generateSEOMetadata from lib/seo-helpers.ts and businessInfo from lib/seo-config.ts for per-page metadata.
- app/sitemap.ts queries Supabase for published content and is cached for 1h (export const revalidate = 3600).

UI, images, performance
- Tailwind (typography plugin); global CSS in app/globals.css. Path alias @/* in tsconfig.json.
- next.config.js defines remotePatterns (Unsplash, Supabase, Cloudinary) and security/perf headers; redirects /portfolio → /gallery.
- PWA: Manifest at public/manifest.webmanifest; service worker via @ducanh2912/next-pwa wrapped in next.config.js. Icons live under public/icons/ (see README for generation).

API route conventions
- app/api/**/route.ts uses NextRequest/NextResponse, lib/rateLimit.ts (getClientIp/rateLimit), and lib/logger.ts for structured JSON logs.
- Use supabaseAdmin only in API routes; for user-scoped reads, prefer anon client + RLS.

Gotchas
- Do not leak server-only env to client; anything without NEXT_PUBLIC_ is server-only.
- Use rehype-raw sparingly; content is expected to be sanitized in content_pages.
- Admin pages often need force-dynamic due to cookies/session.

Pointers to patterns in code
- Public ISR page with Supabase: app/blog/page.tsx
- CMS-driven MDX page: app/[slug]/page.tsx + components/BuilderRuntime.tsx
- Auth/session flow: app/api/auth/login/route.ts, app/api/auth/session/route.ts, lib/authSession.ts, middleware.ts
- Config and hosting: next.config.js, netlify.toml