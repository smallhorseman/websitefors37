# Theme-Based Visual Builder Upgrade

## Overview
The visual builder now includes **brand-consistent theme controls** for colors, fonts, and styling. All options are curated to match your Studio37 brand identity with warm amber tones and vintage photography aesthetic.

---

## 🎨 What's New

### 1. **Centralized Theme Configuration**
**File:** `lib/themeConfig.ts`

All brand colors, fonts, and design tokens are now defined in one place:

- **Primary Colors**: Amber scale (#fef9ef → #7a4b17)
- **Secondary Colors**: Gold scale (#fcf9f0 → #553d10)
- **Neutral Colors**: White, Grays, Black
- **Accent Colors**: Amber glow, Warm beige, Rich brown
- **Brand Fonts**: 
  - Headings: Playfair Display (serif)
  - Body: Inter (sans-serif)
- **Text Sizes**: sm → 3xl (7 options)
- **Button Styles**: Primary, Secondary, Ghost, Link
- **Spacing**: Padding (0-40px), Margin (0-16px)
- **Animations**: None, Fade In, Slide Up, Zoom

### 2. **Theme-Aware Form Controls**
**File:** `components/editor/ThemeControls.tsx`

New reusable components for the editor:

#### `<ColorPicker>`
- Visual swatches showing all brand colors
- Organized by color family (Primary, Secondary, Neutral, Accent)
- Optional "transparent" option
- Live preview of selected color

```tsx
<ColorPicker 
  label="Background Color" 
  value={backgroundColor} 
  onChange={(v) => setBackgroundColor(v)}
  allowTransparent
/>
```

#### `<FontPicker>`
- Shows font samples with "The quick brown fox" preview
- Filter by type: `heading`, `body`, or `all`
- Visual distinction between serif and sans-serif

```tsx
<FontPicker 
  label="Heading Font" 
  value={headingFont} 
  onChange={(v) => setHeadingFont(v)}
  type="heading"
/>
```

#### `<TextColorPicker>`
- Optimized color options based on background
- `light` background: dark text options
- `dark` background: light text options
- Ensures accessible contrast ratios

```tsx
<TextColorPicker 
  label="Text Color" 
  value={textColor} 
  onChange={(v) => setTextColor(v)}
  background="dark"
/>
```

#### Other Controls
- `<TextSizePicker>`: Dropdown with 7 size options
- `<ButtonStylePicker>`: Visual button style previews
- `<SpacingPicker>`: Padding/margin presets
- `<AnimationPicker>`: Entry animation options

### 3. **Updated Editor Forms**
**File:** `app/admin/editor/EditorFormClient.tsx`

#### Hero Block
**New Theme Fields:**
- Background Color (ColorPicker)
- Text Color (TextColorPicker)
- Title Font (FontPicker - heading)
- Subtitle Font (FontPicker - body)
- Button Style (ButtonStylePicker)

#### Text Block
**New Theme Fields:**
- Background Color (ColorPicker with transparent)
- Text Color (TextColorPicker)
- Font Family (FontPicker - all)
- Padding (SpacingPicker)
- Animation (AnimationPicker)

#### CTA Banner Block
**New Theme Fields:**
- Background Color (ColorPicker)
- Text Color (TextColorPicker)
- Heading Font (FontPicker - heading)
- Button Style (ButtonStylePicker)
- Animation (AnimationPicker)

---

## 📋 Homepage Improvement Recommendations

### Visual Design
1. **✅ Fix Services Images**: Services.tsx references `service.image` but array doesn't include URLs
   - Add category-specific images to services array
   - Use high-quality photos from your portfolio

2. **🎯 Enhance CTAs**: 
   - Make primary button larger with animated hover effect
   - Add subtle pulse animation to "Book Your Session"
   - Consider sticky CTA on mobile for better conversion

3. **📍 Reorder Content**:
   ```
   Current: Hero → Portrait Gallery → Services → Commercial Gallery → CTA → Testimonials
   Better:  Hero → Services → Testimonials → Portfolio Gallery → CTA
   ```
   - Move testimonials higher (social proof early)
   - Combine galleries or alternate with services

4. **🎨 Visual Polish**:
   - Increase padding in service cards (feels cramped)
   - Add subtle hover animations to gallery images
   - Consider parallax effect on hero background

### Content & Messaging
1. **🎯 Strengthen Value Prop**:
   ```
   Current: "Capturing your precious moments..."
   Better:  "10+ Years Capturing Houston's Most Precious Moments with Vintage Film Warmth"
   ```

2. **💰 Add Pricing Hints**:
   - Wedding: "Packages from $1,500"
   - Portrait: "Sessions starting at $300"
   - Shows transparency and filters unqualified leads

3. **⏱️ Set Expectations**:
   - Turnaround times: "2-week delivery for portraits"
   - Booking process: "Book online in 5 minutes"
   - Availability: "Limited spots each month"

4. **🏆 Trust Signals** (add after services):
   - Years in business badge
   - 5-star review aggregate
   - "Featured in [publication]" or industry memberships
   - Satisfaction guarantee callout

### User Experience
1. **🔝 Sticky Navigation**:
   - Add `position: sticky` to navbar on scroll
   - Improves navigation on long-scroll pages
   - Add progress indicator (optional)

2. **⚡ Gallery Improvements**:
   - Increase slideshow interval from 5s → 7-8s (current feels rushed)
   - Add manual navigation dots/arrows
   - Consider lazy-loading with intersection observer

3. **📱 Mobile Optimizations**:
   - Add floating/sticky CTA button on mobile
   - Reduce hero height on mobile (currently 70vh might be too tall)
   - Ensure touch targets are 44x44px minimum

4. **🧭 Wayfinding**:
   - Add scroll-spy active state to nav links
   - Show page section indicators on long pages
   - Add "back to top" button after 2 screen scrolls

### Conversion Optimization
1. **📞 Prominent Contact**:
   - Make phone number clickable `tel:` link in hero
   - Add WhatsApp/SMS quick contact options
   - Display business hours prominently

2. **⏰ Urgency/Scarcity**:
   - "Only 3 wedding slots left this season"
   - "Book by December 15 for 2025 rates"
   - Countdown timer for limited-time offers

3. **📊 A/B Test Ideas**:
   - Hero CTA: "Book Your Session" vs "Get Your Free Quote"
   - Button colors: Amber vs White with amber border
   - Newsletter placement: Exit intent vs inline after services

4. **🎁 Lead Magnets**:
   - "Free Wedding Photography Guide" PDF
   - "10 Tips for Perfect Family Portraits" video
   - "Pricing Guide" download in exchange for email

---

## 🚀 How to Use Theme Editor

### 1. Access the Editor
1. Navigate to any page (e.g., `/?edit=1`)
2. Click "Create a layout" from the yellow banner
3. Or go directly to `/admin/editor/layout?path=/`

### 2. Add Blocks with Theme Controls
1. Click "Add Block" → Select block type (e.g., Hero)
2. Fill in content fields (title, subtitle, etc.)
3. **New:** Expand "Theme & Styling" section
4. Use visual pickers to select colors/fonts
5. Preview changes with "Save Draft"
6. Publish when satisfied

### 3. Example: Styling a Hero Block
```
Content Section:
- Title: "Studio <span class='text-amber-200'>37</span>"
- Subtitle: "Your story, beautifully captured"
- Button Text: "Book Your Session"
- Button Link: "/book-a-session"
- Background Image: [your Cloudinary URL]
- Alignment: center
- Overlay: 60

Theme & Styling Section:
- Background Color: Primary Dark (#7a4b17) ← Visual picker
- Text Color: White ← Optimized for dark backgrounds
- Title Font: Playfair Display (Brand) ← Shows font sample
- Subtitle Font: Inter (Brand)
- Button Style: Primary ← Visual button preview
```

### 4. Color Picker Tips
- **Hover** over swatches to see color names
- Use **Primary** colors for important elements
- Use **Neutral** for backgrounds and text
- Use **Accent** for highlights and special effects
- "None" option creates transparent backgrounds

### 5. Font Picker Best Practices
- **Headings**: Use Playfair Display (serif) for elegant, vintage feel
- **Body Text**: Use Inter (sans-serif) for readability
- **Consistency**: Stick to 2 fonts max per page
- **Hierarchy**: Larger headings in serif, body in sans-serif

---

## 🔧 Technical Details

### Theme Config Structure
```typescript
// lib/themeConfig.ts
export const themeConfig = {
  colors: {
    primary: { variants: [...] },
    secondary: { variants: [...] },
    neutral: { variants: [...] },
    accent: { variants: [...] }
  },
  fonts: {
    heading: { options: [...] },
    body: { options: [...] }
  },
  textSizes: [...],
  buttonStyles: [...],
  spacing: { padding: [...], margin: [...] },
  animations: [...]
}
```

### Theme Control Props
All theme controls accept:
- `label`: Display label
- `value`: Current value
- `onChange`: Callback with new value

Specific props:
- `ColorPicker`: `allowTransparent`, `type` (background | text)
- `FontPicker`: `type` (heading | body | all)
- `TextColorPicker`: `background` (light | dark)
- `SpacingPicker`: `type` (padding | margin)

### Adding New Colors/Fonts
To add new theme options, edit `lib/themeConfig.ts`:

```typescript
// Add new color variant
colors: {
  primary: {
    variants: [
      { name: 'Custom Tint', value: '#f5e6d3', class: 'bg-custom text-gray-900' },
      // ... existing variants
    ]
  }
}

// Add new font
fonts: {
  heading: {
    options: [
      { name: 'New Serif', value: 'var(--font-new)', class: 'font-new' },
      // ... existing options
    ]
  }
}
```

**Remember to:**
1. Update `tailwind.config.js` with new color/font classes
2. Load font in `app/layout.tsx` if using Google Fonts
3. Add to `safelist` in Tailwind config if dynamic

---

## 🎯 Next Steps

### Immediate
1. ✅ Test theme controls in editor (all TypeScript errors resolved)
2. 🔄 Update builder block components to accept new theme props
3. 📝 Document theme props in each block's TypeScript interface

### Short-term
- Add theme controls to remaining blocks (ServicesGrid, Stats, IconFeatures, etc.)
- Create "Theme Presets" (Light Mode, Dark Mode, High Contrast)
- Add color palette preview in admin dashboard
- Build "Style Guide" page showing all theme options

### Long-term
- Add custom font upload capability
- Implement color picker with custom hex input
- Create "Brand Kit" export (colors, fonts, logos as JSON)
- Add A/B testing framework for different themes

---

## 📚 Additional Resources

- **Tailwind Color Reference**: https://tailwindcss.com/docs/customizing-colors
- **Google Fonts**: https://fonts.google.com
- **Color Accessibility Checker**: https://webaim.org/resources/contrastchecker/
- **Font Pairing Guide**: https://fontpair.co

---

## 🐛 Troubleshooting

### Colors Not Applying
- **Check**: Tailwind class is in safelist (`tailwind.config.js`)
- **Fix**: Add class to `safelist` array and rebuild

### Fonts Not Loading
- **Check**: Font variable defined in `app/layout.tsx`
- **Fix**: Import from `next/font/google` and add to `html` className

### Theme Picker Not Showing
- **Check**: Component imported in `EditorFormClient.tsx`
- **Fix**: Add import at top of file:
  ```tsx
  import { ColorPicker } from '@/components/editor/ThemeControls'
  ```

### Block Not Rendering Theme Props
- **Check**: Block component accepts and applies theme props
- **Fix**: Update block component to destructure and use theme props:
  ```tsx
  export function HeroBlock({ backgroundColor, textColor, ...props }) {
    return (
      <section className={`${backgroundColor} ${textColor}`}>
        {/* ... */}
      </section>
    )
  }
  ```

---

## 💡 Pro Tips

1. **Use ColorPicker Preview**: Current value shows below picker - helps track selections
2. **Font Samples**: Read sample text in picker to see actual font rendering
3. **Keyboard Navigation**: Use Tab/Arrow keys to navigate theme controls
4. **Batch Updates**: Change multiple theme settings before saving draft
5. **Theme Consistency**: Stick to 2-3 colors max per block for visual harmony
6. **Accessibility**: Always check text/background contrast with TextColorPicker
7. **Mobile Preview**: Test theme changes on mobile viewport before publishing
8. **Save Drafts Often**: Theme changes are part of draft state

---

## 🎓 Theme Design Guidelines

### Color Usage
- **Primary (Amber)**: CTAs, highlights, brand elements
- **Secondary (Gold)**: Borders, accents, hover states
- **Neutral**: Backgrounds, text, structure
- **Accent**: Special callouts, badges, decorative elements

### Typography Scale
- **Hero Titles**: 3XL (text-4xl)
- **Section Headings**: 2XL (text-3xl)
- **Subheadings**: XL (text-2xl)
- **Body**: Base (text-base)
- **Captions**: Small (text-sm)

### Spacing Rhythm
- **Tight**: 8px (between related elements)
- **Normal**: 16px (default section padding)
- **Relaxed**: 24-32px (between major sections)
- **Loose**: 40px (hero/feature sections)

---

**Version**: 1.0  
**Last Updated**: November 19, 2025  
**Author**: GitHub Copilot
