# On-Demand Revalidation Guide

This project supports on-demand ISR revalidation to immediately update cached pages when content changes in the admin.

## Setup

1. Add to your `.env.local`:

```bash
REVALIDATE_SECRET=your-random-secret-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

2. Generate a secure secret:

```bash
openssl rand -base64 32
```

## API Endpoint

**POST** `/api/revalidate`

Headers:

```http
Authorization: Bearer YOUR_REVALIDATE_SECRET
Content-Type: application/json
```

Body (path-based):

```json
{
  "path": "/blog",
  "type": "path"
}
```

Body (tag-based):

```json
{
  "tag": "blog-posts",
  "type": "tag"
}
```

## Usage from Admin

The `lib/revalidate.ts` helper provides convenience functions:

```typescript
import { revalidateContent, revalidateBlog, revalidateGallery } from '@/lib/revalidate'

// After updating a blog post
await revalidateBlog()
await revalidateContent(`/blog/${slug}`)

// After updating gallery
await revalidateGallery()

// After updating a content page
await revalidateContent(`/${slug}`)
```

## Example: Add to Blog Admin

In `app/admin/blog/page.tsx` (or wherever you update blog posts):

```typescript
import { revalidateBlog, revalidateContent } from '@/lib/revalidate'

async function handlePublish(slug: string) {
  // ... your existing publish logic
  
  // Trigger revalidation
  await revalidateBlog()
  await revalidateContent(`/blog/${slug}`)
}
```

## Pages with ISR Enabled

Current pages with `export const revalidate`:

- `/blog` - 600s (10 min)
- `/blog/[slug]` - 600s (10 min)
- `/[slug]` (content pages) - 600s (10 min)
- `/gallery` - 300s (5 min)
- `/services/**` - 86400s (24 hours)

## Security Notes

- The `REVALIDATE_SECRET` must match between environment and API calls
- Keep this secret secure and rotate periodically
- In production, use HTTPS only
- Consider IP whitelisting if calling from known admin servers
