# Page Templates Guide

## Overview

The Visual Page Builder now includes pre-built templates based on your existing pages. You can quickly start building any page using these professionally structured templates.

## Available Templates

### 📱 Homepage Template
**Based on:** `app/page.tsx`

**Structure:**
- Hero section with CTA button
- Secondary CTA (View Portfolio)
- Services overview in 3 columns
- Lead capture section
- Testimonials teaser
- SEO footer with business info

**Best for:** Landing pages, homepage layouts

---

### 👥 About Page Template
**Based on:** `app/about/page.tsx`

**Structure:**
- Hero with "Meet the Team" messaging
- Introduction section
- Team members showcase (Christian & Caitie)
- "Our Approach" content section
- Book a Session CTA

**Best for:** About pages, team introductions, company story

---

### 📸 Services Page Template
**Based on:** `app/services/page.tsx`

**Structure:**
- Hero with services overview
- Services introduction
- 6 service cards in grid layout:
  - Wedding Photography
  - Portrait Photography
  - Event Photography
  - Commercial Photography
  - Creative Sessions
  - Real Estate Photography
- Call-to-action section

**Best for:** Services pages, portfolio showcases, pricing pages

---

### 📧 Contact Page Template
**Based on:** `app/contact/page.tsx`

**Structure:**
- Hero with contact messaging
- Contact information cards (Email, Phone, Location)
- Business info section
- Book a Session CTA

**Best for:** Contact pages, inquiry forms, location pages

---

## How to Use Templates

### Step 1: Navigate to Page Builder
1. Go to **Admin → Page Builder**
2. Enter or select the page slug you want to build

### Step 2: Select a Template
1. Look for the **"Quick Start Templates"** dropdown in the left sidebar
2. Click the dropdown and choose a template:
   - 📱 Homepage Template
   - 👥 About Page Template
   - 📸 Services Page Template
   - 📧 Contact Page Template

### Step 3: Customize
1. The template components will populate in the canvas
2. Click any component to edit its properties in the right sidebar
3. Add, remove, or rearrange components as needed
4. Customize text, images, colors, and links

### Step 4: Save and Publish
1. Click **"Save Draft"** to save your work
2. Click **"Publish Page"** to make it live
3. View the published page at `studio37.cc/[your-slug]`

---

## Template Customization Tips

### Replacing Images
All templates use placeholder images from Unsplash. Replace them with your own:
1. Select the Hero or Image component
2. In the Properties panel, update the image URL
3. Use Cloudinary URLs for your professional photos

### Updating Content
1. Click any Text component or Column
2. Edit the HTML content directly
3. Use the formatting toolbar for bold, italic, headings
4. Keep SEO keywords in mind

### Adjusting Colors
1. Hero components have color selectors for titles and subtitles
2. Button components can be styled as Primary, Secondary, or Outline
3. Maintain brand consistency with amber/blue color scheme

### Adding Your Branding
1. Replace "Studio 37" with your business name
2. Update contact information (email, phone, address)
3. Add your logo as an image component
4. Customize CTAs to match your service offerings

---

## Template Components Included

Each template uses these builder components:

- **Hero Section** - Full-width header with background image, title, subtitle, and CTA
- **Text Block** - Rich HTML content with formatting options
- **Columns** - Multi-column layouts for services, team, or features
- **Button** - Styled call-to-action buttons with animations
- **Spacer** - Vertical spacing control (sm/md/lg/xl)
- **SEO Footer** - Rich footer content with optional LocalBusiness schema

Advanced components also available:
- **Slideshow Hero** - Multi-image rotating hero
- **Testimonials** - Auto-rotating testimonial carousel
- **Gallery Highlights** - Database-driven featured images

---

## Advanced Usage

### Combining Templates
You can mix and match sections from different templates:
1. Start with one template
2. Add individual components from the sidebar
3. Copy component structure from another template manually

### Creating Custom Templates
If you build a page you want to reuse:
1. Save and publish your custom page
2. Use "Import from published" button to clone it
3. Modify the slug and customize for the new page

### Template Variations
Create variations for different use cases:
- **Services**: One template per service category
- **Landing Pages**: Customized templates for different campaigns
- **Event Pages**: Seasonal or special event variations

---

## Best Practices

### SEO Optimization
- Update page titles and meta descriptions
- Include location keywords (Pinehurst, TX, Montgomery County)
- Use the SEO Footer component with LocalBusiness schema
- Add alt text to all images

### Performance
- Use optimized images (Cloudinary with transformations)
- Keep hero images under 500KB
- Limit animations to key sections
- Test page load speed after publishing

### Consistency
- Maintain similar structure across related pages
- Use consistent button styles and colors
- Keep spacing uniform with spacer components
- Match typography styles across sections

### Mobile Responsiveness
- All templates are mobile-responsive by default
- Test on mobile after making major customizations
- Keep text readable (avoid small fonts)
- Ensure buttons are easily clickable

---

## Troubleshooting

**Template doesn't appear:**
- Make sure you've selected a template from the dropdown
- Check that JavaScript is enabled
- Refresh the page and try again

**Components look wrong:**
- Ensure you're viewing in the editor, not preview mode
- Check that all required fields are filled
- Verify image URLs are valid and accessible

**Can't edit components:**
- Click the component in the canvas to select it
- Properties panel appears on the right
- Make sure you're not in preview mode

**Lost my changes:**
- Always click "Save Draft" frequently
- Use "Import from published" to restore last published version
- Check page_configs table in database for saved drafts

---

## Next Steps

1. **Try Each Template** - Familiarize yourself with all four templates
2. **Build Your Key Pages** - Start with About, Services, Contact
3. **Customize for Your Brand** - Update all placeholder content
4. **Add Real Photos** - Replace Unsplash images with your portfolio
5. **Publish and Test** - View live pages and test all links
6. **Create Variations** - Build landing pages for specific campaigns

---

## Support

Need help with templates?
- Check the main builder documentation: `NEW_BUILDER_BLOCKS_GUIDE.md`
- Review component properties in the right sidebar
- Test changes in draft mode before publishing
- Use "Import from published" to start over if needed

**Happy building! 🎨**
