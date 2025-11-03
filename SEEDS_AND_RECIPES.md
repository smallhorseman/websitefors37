# DX Recipes and Seeds

This doc captures a few quick developer recipes and optional seeds for this Next.js + Supabase project.

## Recipe: CMS‑driven Service Page

Goal: Create a new service landing page that is CMS‑managed via the `content_pages` table and rendered as MDX.

Steps:

- Insert a new row into `content_pages` with:
  - `slug`: short, kebab‑case path (e.g. `mini-sessions`)
  - `title`: page title
  - `content`: MDX body. You can use Builder blocks exported from `components/BuilderRuntime.tsx` (components suffixed with `Block`).
  - `published`: true
- The route `/[slug]` will render your page. For block‑based layouts, include block components in the MDX, e.g. `<HeroBlock ... />`.
- SEO: `app/[slug]/page.tsx` generates metadata from `title` and `meta_description`. Add `meta_description` in the table for best results.
- Caching: The page is revalidated every 10 minutes by default; adjust by editing `export const revalidate` in `app/[slug]/page.tsx`.


## Recipe: Blog Post

- Insert a row in `blog_posts` with `published=true` and a unique `slug`.
- The blog index at `/blog` is cached for 10 minutes.
- Add `featured_image` for best LCP and discovery.

## Optional: Persist Web Vitals

- API endpoint: `POST /api/vitals` accepts a single metric payload. It validates input and rate‑limits by IP.
- Optional table: run `supabase/web_vitals.sql` in your Supabase SQL editor to create the `web_vitals` table. The endpoint inserts rows when the table exists; otherwise it no‑ops with a warning.
- Client sender: `components/WebVitals.tsx` already sends LCP/INP/CLS/TTFB to the endpoint in addition to any analytics providers.

## Seeds and Sample Content

- The `supabase/schema.sql` includes inserts for `content_pages`, `gallery_images`, and `blog_posts` for local dev.
- To add more realistic data, create your own `.sql` files under `supabase/` and run them in Supabase SQL editor.

## Notes

- Avoid importing `lib/supabaseAdmin.ts` outside of `app/api/**`.
- Public, read‑mostly pages now use an anon Supabase client on the server and `export const revalidate` for ISR.
- Admin surfaces remain dynamic and cookie‑scoped.
