# Navigation Setup Guide for New Sites

## How Dropdowns Work

### In the Navigation Editor (`/admin/navigation`)

1. **Add a parent nav item** (e.g., "Services", "Portfolio", "About")
2. **Click "+ Dropdown"** button next to the item
3. **Add child items** that appear in the dropdown menu
4. **Click the chevron** (▶/▼) to expand/collapse dropdown items
5. **Edit items** by clicking on them
6. **Save changes** when done

### Visual Indicators
- **Blue badge**: Shows how many dropdown items exist (e.g., "3 dropdown items")
- **Chevron icon**: Collapsed (▶) or Expanded (▼)
- **Blue background**: Child items have blue background to distinguish from parents

## Adding Navigation to a New Site

Your navigation system is **centralized in Supabase** and used across all sites. Here's how to set it up for a new domain:

### Option 1: Share the Same Navigation (Recommended for Studio37 family of sites)

If your new site is part of the Studio37 ecosystem:

1. **No code changes needed!** Navigation is already in the `settings` table
2. Just deploy your Next.js app with the same Supabase connection
3. The `components/Navigation.tsx` component will automatically load it

### Option 2: Separate Navigation for Different Brand

If you want completely separate navigation:

#### 1. Update Supabase Schema
Add a `site_id` column to track multiple sites:

```sql
-- Add site identifier
ALTER TABLE settings ADD COLUMN site_id VARCHAR DEFAULT 'studio37';

-- Create index for faster lookups
CREATE INDEX idx_settings_site_id ON settings(site_id);
```

#### 2. Modify Navigation Editor (`app/admin/navigation/page.tsx`)

Update the `loadNavigation` function:
```typescript
const loadNavigation = async () => {
  setLoading(true)
  setMessage(null)
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('navigation_items')
      .eq('site_id', 'your-new-site-name') // Add this line
      .limit(1)
      .maybeSingle()
    // ... rest of function
```

Update the `saveNavigation` function:
```typescript
const saveNavigation = async () => {
  // ... existing code ...
  
  if (existing) {
    await supabase
      .from('settings')
      .update({ navigation_items: reorderedItems })
      .match({ id: existing.id, site_id: 'your-new-site-name' }) // Add site_id
  } else {
    // Insert new settings for this site
    await supabase
      .from('settings')
      .insert({
        site_id: 'your-new-site-name',
        navigation_items: reorderedItems
      })
  }
```

#### 3. Modify Frontend Navigation (`components/Navigation.tsx`)

Update the data fetch:
```typescript
const { data: settings } = await supabase
  .from('settings')
  .select('navigation_items, logo_url')
  .eq('site_id', process.env.NEXT_PUBLIC_SITE_ID || 'studio37')
  .limit(1)
  .maybeSingle()
```

Add to `.env.local`:
```bash
NEXT_PUBLIC_SITE_ID=your-new-site-name
```

### Option 3: Completely Separate Database

For a fully independent site:

1. **Create new Supabase project** at https://supabase.com
2. **Run migrations** to create tables (use `supabase/migrations/` if you have them)
3. **Update `.env.local`** with new Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
   ```
4. **Deploy** and navigation will work independently

## Navigation Component Features

Your `components/Navigation.tsx` supports:

- ✅ **Desktop dropdowns** - Hover to reveal
- ✅ **Mobile dropdowns** - Tap to toggle
- ✅ **Highlighted buttons** - CTA styling for important links
- ✅ **Visibility toggle** - Hide items without deleting
- ✅ **Responsive** - Mobile hamburger menu
- ✅ **Logo** - Customizable from settings
- ✅ **Sticky header** - Always visible while scrolling

## Quick Reference: Navigation Data Structure

```typescript
interface NavigationItem {
  id: string              // Unique identifier
  label: string           // Display text ("Services")
  href: string            // URL ("/services")
  order: number           // Sort order (1, 2, 3...)
  visible: boolean        // Show/hide toggle
  highlighted?: boolean   // CTA button styling
  icon?: string          // Optional icon name
  children?: NavigationItem[]  // Dropdown items
}
```

## Example Navigation Structure

```json
[
  {
    "id": "nav-home",
    "label": "Home",
    "href": "/",
    "order": 1,
    "visible": true
  },
  {
    "id": "nav-services",
    "label": "Services",
    "href": "/services",
    "order": 2,
    "visible": true,
    "children": [
      {
        "id": "nav-weddings",
        "label": "Weddings",
        "href": "/services/weddings",
        "order": 1,
        "visible": true
      },
      {
        "id": "nav-portraits",
        "label": "Portraits",
        "href": "/services/portraits",
        "order": 2,
        "visible": true
      }
    ]
  },
  {
    "id": "nav-gallery",
    "label": "Gallery",
    "href": "/gallery",
    "order": 3,
    "visible": true
  },
  {
    "id": "nav-book",
    "label": "Book Now",
    "href": "/book-a-session",
    "order": 4,
    "visible": true,
    "highlighted": true  // Orange CTA button
  }
]
```

## Troubleshooting

### Dropdown not showing on frontend
- Check `components/Navigation.tsx` has `dropdownStates` tracking
- Verify `children` array exists in database
- Ensure parent item is `visible: true`

### Changes not saving
- Check browser console for errors
- Verify UUID fix is applied (`.match({ id: existing.id })`)
- Check Supabase permissions for `settings` table

### Navigation looks different on mobile
- This is intentional - mobile uses hamburger menu
- Dropdowns work with tap/click instead of hover
- Test on actual device or Chrome DevTools mobile view

## Best Practices

1. **Limit dropdown depth**: Only one level (parent → children), no nested dropdowns
2. **Keep labels short**: 1-2 words for mobile readability
3. **Use highlighted sparingly**: Only 1-2 CTA buttons max
4. **Test mobile**: Dropdowns behave differently on touch devices
5. **Logical grouping**: Related pages under same dropdown parent
