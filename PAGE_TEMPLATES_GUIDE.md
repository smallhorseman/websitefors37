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

### 📍 Location Page Template
**Based on:** Local SEO best practices for photography business

**Structure:**
- Hero with location-specific title (e.g., "Wedding Photographer in Pinehurst, TX")
- Business introduction with service area details
- Hours & Availability section
- Map embed (Google Maps location)
- Gallery highlights filtered by category
- Local testimonials & reviews
- Location-specific FAQ
- Contact CTA with booking link

**Best for:** City/area service pages, local SEO landing pages, location-specific marketing

**JSON Structure:**
```json
[
  {
    "id": "hero-location",
    "type": "hero",
    "data": {
      "title": "Professional Wedding Photography in Pinehurst, TX",
      "subtitle": "Serving Montgomery County, The Woodlands, Conroe, and Surrounding Areas",
      "backgroundImage": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920",
      "buttonText": "Book Your Session",
      "buttonLink": "/book-a-session",
      "secondaryButtonText": "View Portfolio",
      "secondaryButtonLink": "/gallery",
      "alignment": "center",
      "overlay": 60,
      "titleColor": "text-white",
      "subtitleColor": "text-amber-50",
      "buttonStyle": "primary",
      "animation": "fade-in"
    }
  },
  {
    "id": "intro-location",
    "type": "text",
    "data": {
      "content": "<h2>Your Local Photography Experts in Pinehurst</h2><p>At Studio37, we're proud to serve Pinehurst, TX and the greater Montgomery County area. As local photographers, we understand what makes your community special and know the best locations for stunning wedding and portrait photography.</p>",
      "alignment": "center",
      "size": "lg"
    }
  },
  {
    "id": "hours-section",
    "type": "columns",
    "data": {
      "columns": [
        {
          "content": "<div style='text-align: center;'><h3>📅 Hours</h3><p><strong>Monday - Friday:</strong> 9am - 7pm<br><strong>Saturday:</strong> 10am - 6pm<br><strong>Sunday:</strong> By Appointment</p></div>"
        },
        {
          "content": "<div style='text-align: center;'><h3>📍 Service Area</h3><p>Pinehurst, The Woodlands, Conroe, Spring, Tomball, Magnolia, and all of Montgomery County</p></div>"
        },
        {
          "content": "<div style='text-align: center;'><h3>📞 Contact</h3><p><strong>Phone:</strong> (123) 456-7890<br><strong>Email:</strong> hello@studio37.cc</p></div>"
        }
      ],
      "animation": "fade-in"
    }
  },
  {
    "id": "map-embed",
    "type": "widgetEmbed",
    "data": {
      "heading": "Visit Our Studio",
      "embedCode": "<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.234567890123!2d-95.48765432109876!3d30.15432109876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA5JzE1LjYiTiA5NcKwMjknMTUuNiJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus' width='100%' height='450' style='border:0;' allowfullscreen='' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>",
      "animation": "fade-in"
    }
  },
  {
    "id": "gallery-location",
    "type": "galleryHighlights",
    "data": {
      "heading": "Pinehurst Photography Portfolio",
      "categories": ["Wedding", "Portrait"],
      "featuredOnly": true,
      "limit": 6,
      "sortBy": "display_order",
      "animation": "fade-in"
    }
  },
  {
    "id": "testimonials-location",
    "type": "testimonials",
    "data": {
      "heading": "What Pinehurst Clients Say",
      "testimonials": [
        {
          "name": "Sarah & Mike Johnson",
          "service": "Wedding Photography",
          "text": "Studio37 captured our Pinehurst wedding perfectly! They knew all the best local spots for photos.",
          "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        },
        {
          "name": "Jennifer Martinez",
          "service": "Family Portraits",
          "text": "As a Pinehurst local, I wanted a photographer who understood our community. Studio37 delivered beyond expectations!",
          "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
        }
      ],
      "animation": "fade-in"
    }
  },
  {
    "id": "faq-location",
    "type": "faq",
    "data": {
      "heading": "Frequently Asked Questions - Pinehurst Photography",
      "items": [
        {
          "question": "Do you travel to other areas besides Pinehurst?",
          "answer": "Yes! We serve all of Montgomery County including The Woodlands, Conroe, Spring, Tomball, and Magnolia. We also travel to Houston and surrounding areas."
        },
        {
          "question": "What are your most popular photography locations in Pinehurst?",
          "answer": "We love shooting at local parks, downtown Pinehurst, The Woodlands Waterway, and private venues. We'll help you choose the perfect location for your session."
        },
        {
          "question": "How far in advance should I book?",
          "answer": "We recommend booking 2-3 months in advance for weddings and 2-4 weeks for portrait sessions, especially during peak season (fall and spring)."
        },
        {
          "question": "Do you offer in-home sessions?",
          "answer": "Absolutely! We offer in-home lifestyle photography throughout Pinehurst and surrounding areas."
        }
      ],
      "columns": 1,
      "animation": "fade-in"
    }
  },
  {
    "id": "cta-location",
    "type": "text",
    "data": {
      "content": "<div style='text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 12px;'><h2 style='color: white; margin-bottom: 20px;'>Ready to Book Your Pinehurst Photography Session?</h2><p style='font-size: 1.125rem; margin-bottom: 30px;'>Contact us today to discuss your photography needs and available dates.</p><a href='/book-a-session' style='display: inline-block; background: white; color: #d97706; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.125rem;'>Schedule Your Session →</a></div>",
      "alignment": "center",
      "size": "lg"
    }
  },
  {
    "id": "seo-footer-location",
    "type": "seoFooter",
    "data": {
      "content": "<p><strong>Studio37 Photography - Pinehurst's Premier Photography Studio</strong></p><p>Specializing in wedding photography, portrait photography, family photos, engagement sessions, and commercial photography in Pinehurst, TX. Proudly serving Montgomery County, The Woodlands, Conroe, Spring, Tomball, Magnolia, and the greater Houston area.</p><p><strong>Service Areas:</strong> Pinehurst TX, The Woodlands, Conroe, Montgomery, Willis, Spring, Tomball, Magnolia, Montgomery County, Harris County</p><p><strong>Photography Services:</strong> Wedding Photography, Engagement Photography, Portrait Photography, Family Photography, Senior Portraits, Headshots, Commercial Photography, Real Estate Photography, Event Photography</p>",
      "includeSchema": true
    }
  }
]
```

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
   - 📍 Location Page Template

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
