# 🚀 Visual Page Builder - Quick Start Guide

## Accessing the Editor

Navigate to:
```
/admin/visual-editor/your-page-slug
```

Example:
```
/admin/visual-editor/about
/admin/visual-editor/services
/admin/visual-editor/portfolio
```

---

## Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│  Visual Editor / your-page-slug    [Preview] [Save] [Copy] │
├──────────┬──────────────────────────────────┬───────────┤
│          │                                  │           │
│ 📦 BLOCKS│         CANVAS                   │ ⚙️ PROPS  │
│          │                                  │           │
│ [Search] │   [Drag blocks here]             │ Heading   │
│ [Filters]│                                  │ [____]    │
│          │   ┌─────────────────┐            │           │
│ 🎯 Hero   │   │ HeroBlock       │ [×] [⎘]   │ Subtitle  │
│ 📝 Text   │   │ Welcome!        │            │ [____]    │
│ 🖼️ Image │   └─────────────────┘            │           │
│ ...      │                                  │ Button    │
│          │   ┌─────────────────┐            │ [____]    │
│          │   │ TextBlock       │ [×] [⎘]   │           │
│          │   │ Add content...  │            │ [Update]  │
│          │   └─────────────────┘            │           │
│          │                                  │           │
└──────────┴──────────────────────────────────┴───────────┘
```

---

## Basic Workflow

### 1. Add a Block
- Drag a block from the **left sidebar** onto the **canvas**
- Or click a block to add it to the bottom

### 2. Edit Properties
- Click a block in the canvas to select it
- Edit properties in the **right panel**
- Changes apply instantly

### 3. Reorder Blocks
- Drag the handle (⋮⋮) to move blocks up/down
- Drop between existing blocks to insert

### 4. Duplicate/Delete
- Use the **[⎘]** button to duplicate a block
- Use the **[×]** button to delete a block

### 5. Preview & Save
- Click **[👁️ Preview]** to see final result
- Click **[💾 Save]** to persist changes
- Click **[📋 Copy MDX]** to get the code

---

## Available Blocks (28+)

### Content Blocks
| Block | Icon | Use For |
|-------|------|---------|
| HeroBlock | 🎯 | Page header with title & CTA |
| TextBlock | 📝 | Rich text content |
| HeadingBlock | 📰 | Section headings |

### Media Blocks
| Block | Icon | Use For |
|-------|------|---------|
| ImageBlock | 🖼️ | Single images with captions |
| GalleryHighlightsBlock | 🎨 | Image grid gallery |
| MasonryGalleryBlock | 🧱 | Pinterest-style gallery |
| FilterableGalleryBlock | 🔍 | Gallery with category filters |
| SlideshowHeroBlock | 🎞️ | Rotating hero images |
| VideoHeroBlock | 🎬 | Hero with background video |
| BeforeAfterSliderBlock | ↔️ | Image comparison slider |

### Layout Blocks
| Block | Icon | Use For |
|-------|------|---------|
| ColumnsBlock | ⬜ | Multi-column layouts (2-4 cols) |
| SpacerBlock | ⬛ | Vertical spacing |
| ButtonBlock | 🔘 | Call-to-action buttons |
| LogoBlock | 🎭 | Brand logo display |

### Social Proof
| Block | Icon | Use For |
|-------|------|---------|
| TestimonialsBlock | 💬 | Client testimonials |
| StatsBlock | 📊 | Achievement statistics |
| AnimatedCounterStatsBlock | 🔢 | Counting number animations |
| BadgesBlock | 🏆 | Trust badges & awards |

### Conversion
| Block | Icon | Use For |
|-------|------|---------|
| CTABannerBlock | 📣 | Call-to-action banners |
| ContactFormBlock | ✉️ | Lead capture forms |
| LeadSignupBlock | 📧 | Email capture popups |
| NewsletterBlock | 📮 | Newsletter signup |
| PricingTableBlock | 💰 | Service pricing tables |
| PricingCalculatorBlock | 🧮 | Interactive pricing tool |

### Enhanced
| Block | Icon | Use For |
|-------|------|---------|
| ServicesGridBlock | 🎁 | Service offering grids |
| IconFeaturesBlock | ⭐ | Features with icons |
| TimelineBlock | 📅 | Process/milestone timelines |
| InteractiveMapBlock | 🗺️ | Google Maps embeds |
| WidgetEmbedBlock | 🔌 | Third-party widgets |

### Interactive
| Block | Icon | Use For |
|-------|------|---------|
| FAQBlock | ❓ | Basic FAQ accordions |
| EnhancedAccordionBlock | 📋 | Searchable accordions |
| TabbedContentBlock | 📑 | Tabbed content sections |

---

## Keyboard Shortcuts

| Action | Shortcut | Notes |
|--------|----------|-------|
| Save | Coming soon | Currently use button |
| Undo | Coming soon | Currently no undo |
| Delete selected | Coming soon | Use [×] button |
| Duplicate selected | Coming soon | Use [⎘] button |

---

## AI Block Suggestions

### How to Use:
1. Click **"✨ Get AI Suggestions"** in any admin page
2. Fill in the form:
   - **Page Type:** About, Services, Contact, etc.
   - **Industry:** Photography, E-commerce, etc.
   - **Current Blocks:** Automatically detected
3. Review suggestions with rationale
4. Click **"Insert"** or **"Copy MDX"**

### Example Prompt:
```
Page Type: About Us
Industry: Photography Studio
Current Blocks: HeroBlock, TestimonialsBlock
```

### AI Response:
```
✅ StatsBlock
   Category: Social Proof
   Rationale: Showcase years of experience, happy clients, 
   and projects completed to build credibility.

✅ TimelineBlock
   Category: Content
   Rationale: Tell your studio's story with a visual timeline
   of key milestones and achievements.

✅ CTABannerBlock
   Category: Conversion
   Rationale: End the About page with a strong call-to-action
   to book a session.
```

---

## Templates

### Page Templates (Complete Pages)
1. **About Us** - Company story + team + values + CTA
2. **Services** - Services grid + pricing + FAQ + booking CTA
3. **Portfolio** - Gallery + categories + case studies
4. **Contact** - Contact form + map + hours + social links

### Section Templates (Reusable Combos)
1. **Hero + Stats Combo** - Hero with statistics overlay
2. **Testimonials Section** - Client quotes + badges
3. **Gallery Section** - Filterable gallery + CTA
4. **CTA Section** - Large banner with action button
5. **Timeline Section** - Process or milestone timeline

### How to Use:
1. Click **"📋 Use Template"** in admin
2. Filter by **Pages** or **Sections**
3. Preview template structure
4. Click **"Use Template"** to populate page
5. Customize blocks to match your content

---

## Common Patterns

### Landing Page Structure:
```
1. HeroBlock (with CTA)
2. StatsBlock (credibility)
3. ServicesGridBlock (offerings)
4. TestimonialsBlock (social proof)
5. GalleryHighlightsBlock (portfolio)
6. CTABannerBlock (conversion)
```

### About Page Structure:
```
1. HeroBlock (company intro)
2. TextBlock (mission/values)
3. TimelineBlock (company history)
4. TestimonialsBlock (client quotes)
5. CTABannerBlock (get in touch)
```

### Service Page Structure:
```
1. HeroBlock (service intro)
2. IconFeaturesBlock (service benefits)
3. PricingTableBlock (packages)
4. BeforeAfterSliderBlock (examples)
5. FAQBlock (common questions)
6. ContactFormBlock (book now)
```

---

## Tips & Tricks

### 🎨 Design Tips:
- **Alternate backgrounds:** White → Gray → White for visual rhythm
- **Use spacers:** Add SpacerBlock between sections for breathing room
- **Limit CTAs:** 1-2 strong calls-to-action per page max
- **Above the fold:** Put most important content in first HeroBlock

### ⚡ Performance Tips:
- **Optimize images:** Use WebP/AVIF format, max 1920px width
- **Lazy load:** Media blocks automatically lazy load
- **Limit animations:** Don't animate every block, use sparingly
- **Test mobile:** Always preview on mobile before publishing

### 📱 Mobile Tips:
- **Use responsive props:** Set different values for mobile/tablet/desktop
- **Hide on mobile:** Use `mobileHidden` for non-essential blocks
- **Simplify text:** Shorter headlines on mobile
- **Larger buttons:** Increase button size for touch targets

### 🔍 SEO Tips:
- **Meaningful headings:** Use descriptive text in HeroBlock titles
- **Alt text:** Always fill in ImageBlock alt attributes
- **Internal links:** Use ButtonBlock to link between pages
- **Footer links:** Add SeoFooterBlock for keyword-rich links

---

## Troubleshooting

### Block won't drop on canvas
- **Solution:** Ensure you're dragging to the canvas area, not the sidebar or properties panel

### Properties not updating
- **Solution:** Make sure block is selected (blue border). Click block to select it.

### Can't find a block
- **Solution:** Use the search bar in BlockLibrary sidebar

### MDX looks wrong
- **Solution:** Some props require base64 encoding. Use the visual editor instead of manual MDX.

### Changes not saving
- **Solution:** Check console for errors. Ensure you're authenticated and have admin access.

---

## Support

### Documentation:
- **Full Guide:** `/UI_UPGRADE_COMPLETE.md`
- **This Quick Start:** `/VISUAL_BUILDER_QUICKSTART.md`

### Help:
- **TypeScript Errors:** All components have 0 errors, report any you find
- **Feature Requests:** Document in project notes
- **Bug Reports:** Check browser console for errors

---

## What's Next?

### Upcoming Features:
- ⏳ **Undo/Redo** - History tracking
- ⏳ **Block Search** - Find blocks in canvas
- ⏳ **Keyboard Shortcuts** - Faster editing
- ⏳ **Block Presets** - Save customized blocks
- ⏳ **A/B Testing** - Create page variants

### Advanced Usage:
- Combine templates with AI suggestions
- Create custom block combinations
- Export MDX for version control
- Build responsive layouts for all devices

---

**Happy building! 🎨**
