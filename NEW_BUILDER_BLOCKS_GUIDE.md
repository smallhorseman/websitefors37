# New Builder Blocks Implementation Guide

## Overview
Three new advanced builder blocks have been added to your Visual Page Builder:

1. **Slideshow Hero Block** - Multi-image hero with auto-rotation
2. **Testimonials Block** - Auto-rotating testimonials carousel  
3. **Gallery Highlights Block** - Featured images from database

## Implementation Details

### 1. Slideshow Hero Block

**Features:**
- Multiple slides with images, categories, and titles
- Configurable interval timing (default: 5000ms)
- Overlay opacity control (0-100%)
- Main title, subtitle, and CTA button
- Text alignment (left/center/right)
- Color customization for title and subtitle
- Button styles (primary/secondary/outline)
- Hover zoom animation option
- Full bleed option

**Properties Panel:**
- Main title and subtitle inputs
- Button text and link configuration
- Interval and overlay controls
- Alignment and style dropdowns
- Color pickers for text
- **Slides array editor** with add/remove functionality:
  - Image URL
  - Category tag
  - Optional slide title

**Runtime:**
- Server component: `SlideshowHeroBlock` (BuilderRuntime.tsx)
- Client component: `SlideshowHeroClient` (components/blocks/SlideshowHeroClient.tsx)
- Auto-rotates through slides using React hooks

**MDX Export:**
```jsx
<SlideshowHeroBlock 
  slidesB64="base64-encoded-json-array"
  intervalMs="5000"
  overlay="60"
  title="Studio 37"
  subtitle="Professional Photography"
  buttonText="Book Now"
  buttonLink="/book-a-session"
  alignment="center"
  titleColor="text-white"
  subtitleColor="text-amber-50"
  buttonStyle="primary"
  buttonAnimation="hover-zoom"
  fullBleed="false"
/>
```

### 2. Testimonials Block

**Features:**
- Auto-rotating testimonials with quotes, authors, and avatars
- Configurable animation styles (fade-in/slide-up/zoom)
- Pagination dots for visual feedback
- Clean, centered layout

**Properties Panel:**
- Animation dropdown
- **Testimonials array editor** with add/remove:
  - Quote text (textarea)
  - Author name
  - Subtext (role/location)
  - Avatar URL (optional)

**Runtime:**
- Server component: `TestimonialsBlock` (BuilderRuntime.tsx)
- Client component: `TestimonialsClient` (components/blocks/TestimonialsClient.tsx)
- 5-second rotation interval

**MDX Export:**
```jsx
<TestimonialsBlock 
  testimonialsB64="base64-encoded-json-array"
  animation="fade-in"
/>
```

### 3. Gallery Highlights Block

**Features:**
- Pulls featured images from `gallery_images` table
- Category filtering
- Featured-only toggle
- Configurable image limit
- Async server-side rendering

**Properties Panel:**
- Featured-only checkbox
- Limit input (max images)
- Animation dropdown
- **Categories array editor** with add/remove:
  - Enter category names to filter
  - Remove categories as needed
  - Leave empty for all categories

**Runtime:**
- Async server component: `GalleryHighlightsBlock` (BuilderRuntime.tsx)
- Queries Supabase at render time
- Renders responsive grid with Next.js Image optimization

**MDX Export:**
```jsx
<GalleryHighlightsBlock 
  categoriesB64="base64-encoded-json-array"
  featuredOnly="true"
  limit="6"
  animation="fade-in"
/>
```

## Usage Instructions

### Adding a Block in the Editor

1. Navigate to **Admin → Page Builder**
2. Select a page slug or create new
3. Click one of the new sidebar buttons:
   - **Slideshow Hero** (🎬)
   - **Testimonials** (💬)
   - **Gallery Highlights** (🖼️)
4. Block appears in canvas with default data

### Editing Block Properties

1. Click the block in the canvas to select it
2. Properties panel opens on the right
3. Edit basic settings (animation, timing, etc.)
4. Use array editors to add/remove items:
   - **Slides**: Click "+ Add Slide" → fill image URL, category, title → click "Remove" to delete
   - **Testimonials**: Click "+ Add Testimonial" → fill quote, author, subtext, avatar → click "Remove" to delete
   - **Categories**: Type category name → click "Add" or press Enter → click "Remove" to delete

### Saving and Publishing

1. Click **"Save Draft"** to save work in progress (stores in `page_configs` table)
2. Click **"Publish Page"** to make live (stores in `content_pages` table as MDX)
3. Visit the published page to see live blocks

## Technical Architecture

### Data Flow

**Editor → Draft:**
- User edits in VisualEditor → components state → Save Draft → JSON in `page_configs.content`

**Draft → MDX:**
- User clicks Publish → componentsToMDX → encodes arrays as base64 → MDX string in `content_pages.content`

**MDX → Runtime:**
- Page loads → MDXRemote parses → decodes base64 → passes to runtime components → renders

### Files Modified

1. **components/VisualEditor.tsx**
   - Added component types: `'slideshowHero' | 'testimonials' | 'galleryHighlights'`
   - Added interfaces: `SlideshowHeroComponent`, `TestimonialsComponent`, `GalleryHighlightsComponent`
   - Added sidebar buttons
   - Added default data generators
   - Added renderer functions (editor preview)
   - Added properties panels (editing UI)
   - Updated ComponentRenderer and ComponentProperties switches

2. **components/BuilderRuntime.tsx**
   - Added `SlideshowHeroBlock` server component
   - Added `TestimonialsBlock` server component
   - Added `GalleryHighlightsBlock` async server component
   - Updated `MDXBuilderComponents` export

3. **components/blocks/SlideshowHeroClient.tsx** (NEW)
   - Client component with slideshow logic
   - useEffect interval for auto-rotation
   - Supports all config props

4. **components/blocks/TestimonialsClient.tsx** (NEW)
   - Client component with testimonial rotation
   - useEffect interval for auto-rotation
   - Pagination dots

5. **app/admin/page-builder/page.tsx**
   - Updated `mdxToComponents` to parse new block types from MDX
   - Updated `componentsToMDX` to export new block types as MDX

## Database Schema Requirements

### For Gallery Highlights Block

Ensure `gallery_images` table exists with:
- `id` (uuid, primary key)
- `image_url` (text)
- `title` (text, optional)
- `category` (text, optional)
- `is_featured` (boolean, default false)
- `created_at` (timestamp)

The block queries:
```sql
SELECT * FROM gallery_images 
WHERE category = ANY(categories_array)  -- if categories provided
  AND is_featured = true                -- if featuredOnly = true
ORDER BY created_at DESC
LIMIT limit_value
```

## Testing Checklist

- [ ] Add Slideshow Hero block → verify preview shows slides
- [ ] Edit slides array → add/remove slides → verify updates
- [ ] Change interval/overlay → verify preview updates
- [ ] Save draft → reload page → verify persistence
- [ ] Publish → visit page → verify runtime slideshow works
- [ ] Add Testimonials block → verify preview shows rotation
- [ ] Edit testimonials array → add/remove → verify updates
- [ ] Publish → visit page → verify runtime rotation works
- [ ] Add Gallery Highlights block → verify preview shows config
- [ ] Edit categories/limit → verify updates
- [ ] Publish → visit page → verify DB query and image rendering
- [ ] Test on homepage (slug='home') → verify all blocks work

## Customization Tips

### Slideshow Hero
- Use high-quality hero images (1920x1080 recommended)
- Keep slide count to 3-5 for best UX
- Set interval between 4000-6000ms
- Use overlay 50-70% for text readability

### Testimonials
- Aim for 3-6 testimonials
- Keep quotes concise (1-2 sentences)
- Add client avatars for authenticity
- Consider matching animation to page theme

### Gallery Highlights
- Set `is_featured = true` on best images in database
- Use category names consistently across images
- Set limit to 6-12 for clean grid
- Featured-only recommended for homepage

## Troubleshooting

**Slideshow not rotating:**
- Check `intervalMs` is >= 1500
- Ensure slides array has 2+ items
- Verify component is published (not just draft)

**Testimonials not showing:**
- Check testimonials array is not empty
- Verify at least `quote` field is filled

**Gallery Highlights empty:**
- Ensure `gallery_images` table has data
- Check categories match exactly (case-sensitive)
- Verify `is_featured = true` if `featuredOnly` is checked
- Check Supabase RLS policies allow read access

**MDX export errors:**
- Ensure no special characters in text fields that break JSON
- Check base64 encoding is working (view page source)
- Verify all required props are present

## Next Steps

1. **Test end-to-end flow** with all three blocks
2. **Populate gallery_images table** with sample featured images
3. **Edit homepage** (slug='home') using builder with new blocks
4. **Customize animations** to match brand
5. **Add real testimonials** from clients
6. **Configure slideshow** with your best portfolio images

---

**Status:** ✅ Complete - All blocks implemented with full editor UI and runtime rendering
