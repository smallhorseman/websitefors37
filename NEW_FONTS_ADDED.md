# New Fonts Added to Visual Editor

## 📝 Overview
Added 11 new Google Fonts to your Studio37 site, all available in the visual editor's font picker!

---

## 🎨 Font Categories

### Serif Fonts (Elegant & Classic)
Perfect for headings, titles, and sophisticated layouts

1. **Cormorant Garamond**
   - Style: Elegant, refined, book-like
   - Best for: Luxury wedding pages, portfolio titles
   - Weights: 300, 400, 500, 600, 700
   - Variable: `--font-cormorant`
   - Class: `font-cormorant`

2. **Lora**
   - Style: Contemporary serif with calligraphic roots
   - Best for: Long-form content, blog posts, testimonials
   - Weights: Variable (400-700)
   - Variable: `--font-lora`
   - Class: `font-lora`

3. **Crimson Pro**
   - Style: Book typeface with strong character
   - Best for: Editorial content, service descriptions
   - Weights: Variable (200-900)
   - Variable: `--font-crimson`
   - Class: `font-crimson`

4. **Libre Baskerville**
   - Style: Classic, highly readable
   - Best for: Body text, professional documentation
   - Weights: 400, 700
   - Variable: `--font-libre`
   - Class: `font-libre`

### Sans-Serif Fonts (Modern & Clean)
Perfect for body text, navigation, and contemporary sections

5. **Montserrat**
   - Style: Geometric, urban
   - Best for: Headlines, CTAs, modern sections
   - Weights: Variable (100-900)
   - Variable: `--font-montserrat`
   - Class: `font-montserrat`

6. **Raleway**
   - Style: Elegant sans, thin to bold
   - Best for: Minimalist designs, luxury branding
   - Weights: Variable (100-900)
   - Variable: `--font-raleway`
   - Class: `font-raleway`

7. **Nunito**
   - Style: Rounded, friendly
   - Best for: Approachable content, family portraits section
   - Weights: Variable (200-900)
   - Variable: `--font-nunito`
   - Class: `font-nunito`

8. **Work Sans**
   - Style: Grotesque, highly legible
   - Best for: UI elements, small text, mobile-first design
   - Weights: Variable (100-900)
   - Variable: `--font-worksans`
   - Class: `font-worksans`

### Display Fonts (Special Use)
Perfect for hero sections, branding moments, and creative headers

9. **Cinzel**
   - Style: Inspired by Roman inscriptions
   - Best for: Luxury branding, timeless elegance
   - Use case: Wedding photography hero sections
   - Weights: Variable (400-900)
   - Variable: `--font-cinzel`
   - Class: `font-cinzel`

10. **Great Vibes**
    - Style: Elegant script/cursive
    - Best for: Wedding accents, special announcements
    - Use case: Accent text like "& " between names
    - Weight: 400
    - Variable: `--font-greatvibes`
    - Class: `font-greatvibes`
    - ⚠️ Use sparingly for readability

11. **Bebas Neue**
    - Style: Bold, all-caps display
    - Best for: Impact headlines, promotional banners
    - Use case: Sale announcements, bold CTAs
    - Weight: 400
    - Variable: `--font-bebas`
    - Class: `font-bebas`

---

## 🎯 Font Pairing Suggestions

### Classic Elegance (Wedding Photography)
- **Heading**: Cinzel or Cormorant Garamond
- **Body**: Lora or Crimson Pro
- **Accent**: Great Vibes for "& " or decorative elements

### Modern Professional (Corporate/Commercial)
- **Heading**: Montserrat Bold
- **Body**: Work Sans or Inter (existing)
- **Accent**: Bebas Neue for CTAs

### Warm & Approachable (Family Portraits)
- **Heading**: Nunito Bold or Raleway
- **Body**: Nunito Regular or Lora
- **Accent**: None needed - keep it simple

### Editorial/Blog Style
- **Heading**: Libre Baskerville or Playfair Display (existing)
- **Body**: Crimson Pro or Lora
- **Accent**: Montserrat for quotes or callouts

### Luxury/High-End
- **Heading**: Cinzel
- **Body**: Cormorant Garamond or Raleway
- **Accent**: Great Vibes sparingly

---

## 🚀 How to Use in Visual Editor

### 1. Access Font Picker
1. Go to any page with `?edit=1`
2. Click "Create a layout" or edit existing block
3. Open **"Theme & Styling"** section
4. Look for **Font Picker** controls

### 2. Font Picker Options
The font picker now shows:
- **Heading Fonts** (9 options):
  - Playfair Display (Brand) ✓
  - Cormorant Garamond
  - Lora
  - Crimson Pro
  - Libre Baskerville
  - Cinzel (Display)
  - Great Vibes (Script)
  - Bebas Neue (Display)
  - Inter Bold

- **Body Fonts** (7 options):
  - Inter (Brand) ✓
  - Montserrat
  - Raleway
  - Nunito
  - Work Sans
  - Playfair Display
  - Lora

### 3. Live Preview
- Each font shows "The quick brown fox jumps" sample
- Click to select
- Save Draft to preview on page
- Publish when satisfied

---

## 💡 Font Usage Best Practices

### Readability
- **Body text**: Stick to 16-18px minimum
- **Avoid script fonts** for body text (Great Vibes)
- **Display fonts** (Bebas, Cinzel) only for headlines
- **Line height**: 1.5-1.7 for body, 1.2-1.3 for headings

### Performance
- **Limit to 2-3 fonts** per page max
- All fonts loaded via next/font with automatic optimization
- Fonts are subset to Latin characters only
- Display: swap ensures text shows immediately

### Hierarchy
```
Hero Title: Cinzel 4xl (48px) - MAXIMUM IMPACT
Section Heading: Cormorant 3xl (36px) - SECONDARY
Subheading: Montserrat 2xl (24px) - tertiary
Body: Lora base (16px) - readable
Caption: Work Sans sm (14px) - subtle
```

### Accessibility
- **Minimum contrast**: 4.5:1 for body text
- **Script fonts**: Size 24px+ for legibility
- **All-caps fonts** (Bebas): Use sparingly, harder to read
- **Test mobile**: Ensure fonts scale properly

---

## 🔧 Technical Implementation

### Files Modified

#### 1. `app/layout.tsx`
```tsx
// Added imports
import { 
  Cormorant_Garamond, Lora, Crimson_Pro, Libre_Baskerville,
  Montserrat, Raleway, Nunito, Work_Sans,
  Cinzel, Great_Vibes, Bebas_Neue
} from "next/font/google"

// Configured each font
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})
// ... (10 more font configs)

// Added to body className
<body className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ... `}>
```

#### 2. `tailwind.config.js`
```js
fontFamily: {
  cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
  lora: ['var(--font-lora)', 'Georgia', 'serif'],
  // ... 9 more font families
}

safelist: [
  'font-cormorant', 'font-lora', 'font-crimson',
  // ... all font classes to prevent purging
]
```

#### 3. `lib/themeConfig.ts`
```ts
fonts: {
  heading: {
    options: [
      { name: 'Cormorant Garamond', value: 'var(--font-cormorant)', class: 'font-cormorant' },
      // ... 8 more heading fonts
    ]
  },
  body: {
    options: [
      { name: 'Montserrat', value: 'var(--font-montserrat)', class: 'font-montserrat' },
      // ... 6 more body fonts
    ]
  }
}
```

### CSS Variables Available
```css
--font-inter         /* Inter (sans-serif) */
--font-playfair      /* Playfair Display (serif) */
--font-cormorant     /* Cormorant Garamond (serif) */
--font-lora          /* Lora (serif) */
--font-crimson       /* Crimson Pro (serif) */
--font-libre         /* Libre Baskerville (serif) */
--font-montserrat    /* Montserrat (sans-serif) */
--font-raleway       /* Raleway (sans-serif) */
--font-nunito        /* Nunito (sans-serif) */
--font-worksans      /* Work Sans (sans-serif) */
--font-cinzel        /* Cinzel (display serif) */
--font-greatvibes    /* Great Vibes (script) */
--font-bebas         /* Bebas Neue (display sans) */
```

### Tailwind Classes
```html
<!-- Serif -->
<h1 class="font-cormorant">Elegant Heading</h1>
<p class="font-lora">Readable body text</p>

<!-- Sans-serif -->
<h2 class="font-montserrat">Modern Heading</h2>
<p class="font-nunito">Friendly body text</p>

<!-- Display -->
<h1 class="font-cinzel text-4xl">LUXURY BRAND</h1>
<span class="font-greatvibes text-2xl">& </span>
<h2 class="font-bebas text-5xl">BOLD IMPACT</h2>
```

---

## 🎨 Example Use Cases

### Wedding Page Hero
```tsx
<HeroBlock
  title="Sarah & John"
  titleFont="font-cinzel"          // Elegant, timeless
  subtitle="August 15, 2025"
  subtitleFont="font-greatvibes"   // Script accent
  backgroundColor="bg-primary-700"
  textColor="text-white"
/>
```

### Blog Post
```tsx
<TextBlock
  fontFamily="font-lora"           // Highly readable
  textColor="text-gray-900"
  backgroundColor="bg-white"
  padding="24"
/>
```

### Bold CTA Banner
```tsx
<CTABannerBlock
  heading="BOOK NOW"
  headingFont="font-bebas"         // Maximum impact
  buttonStyle="btn-primary"
  backgroundColor="bg-gray-900"
  textColor="text-white"
/>
```

### Services Section
```tsx
<ServicesGridBlock
  heading="Our Services"
  headingFont="font-montserrat"    // Clean, professional
  bodyFont="font-worksans"         // Highly legible
/>
```

---

## 📊 Font Loading Performance

### Optimization Features
- ✅ **Automatic subsetting**: Only Latin characters loaded
- ✅ **Font display: swap**: Text visible immediately
- ✅ **Preload**: Critical fonts prioritized
- ✅ **Self-hosting**: Fonts served from your domain
- ✅ **CSS variables**: Zero layout shift

### Load Impact
- Original: 2 fonts (Inter + Playfair) ≈ 60KB
- New: 13 fonts total ≈ 180KB
- **Only loaded fonts used on page count toward bundle**
- Next.js automatically tree-shakes unused fonts

### Best Practices
1. **Don't use all fonts on one page** - pick 2-3 max
2. **Unused fonts won't load** - Next.js optimization
3. **Variable fonts preferred** - single file, multiple weights
4. **Display fonts sparingly** - they're heavier

---

## 🐛 Troubleshooting

### Font Not Showing in Editor
**Issue**: Font picker doesn't show new fonts
**Fix**: Hard refresh browser (Cmd/Ctrl + Shift + R)

### Font Not Rendering on Page
**Issue**: Selected font doesn't appear on live page
**Fix**: 
1. Check Tailwind safelist includes the font class
2. Rebuild: `npm run build`
3. Verify font variable in body className

### Font Looks Different Than Expected
**Issue**: Font rendering inconsistency
**Fix**:
1. Check weight selection (some fonts have limited weights)
2. Great Vibes only has weight 400
3. Bebas Neue is all-caps by design

### Performance Impact
**Issue**: Page loads slower after adding fonts
**Fix**:
1. Only use 2-3 fonts per page
2. Check Network tab - unused fonts shouldn't load
3. Consider using fewer display/script fonts

---

## 🎓 Typography Tips for Photography Sites

### Do's ✅
- **Pair serif heading + sans body** (Classic elegance)
- **Use display fonts for hero sections only**
- **Keep script fonts > 20px** for readability
- **Maintain consistent font hierarchy** across site
- **Test on mobile devices** - some fonts scale poorly

### Don'ts ❌
- **Don't use script fonts for body text** (Great Vibes)
- **Don't mix too many fonts** (max 3 per page)
- **Don't use all-caps for long text** (Bebas Neue)
- **Don't sacrifice readability for style**
- **Don't ignore contrast ratios** (accessibility)

### Photography-Specific
- **Wedding pages**: Elegant serif (Cinzel, Cormorant)
- **Family portraits**: Friendly sans (Nunito, Raleway)
- **Commercial**: Professional sans (Montserrat, Work Sans)
- **Editorial/Blog**: Readable serif (Lora, Crimson Pro)
- **Luxury branding**: Display serif (Cinzel) + Classic serif (Libre Baskerville)

---

## 📚 Font Resources

- **Google Fonts**: https://fonts.google.com
- **Font Pair**: https://fontpair.co (Pairing suggestions)
- **Type Scale**: https://typescale.com (Size hierarchy)
- **Font Squirrel**: https://www.fontsquirrel.com (Additional fonts)

---

## 🚀 Next Steps

### Immediate
1. ✅ Fonts loaded and available
2. ✅ Theme editor updated
3. ✅ Tailwind configured
4. 🔄 Test each font in visual editor
5. 🔄 Update homepage with your favorite pairings

### Short-term
- Create font pairing presets in theme config
- Add font weight selector to editor
- Document your preferred font combinations
- Update brand guidelines with font choices

### Long-term
- A/B test different font pairings for conversion
- Create page templates with optimized fonts
- Add custom font upload capability
- Build font loading performance monitoring

---

**Total Fonts Available**: 13 (2 original + 11 new)
**Serif Options**: 6 fonts
**Sans-serif Options**: 5 fonts
**Display Options**: 2 fonts
**Script Options**: 1 font

**All fonts are now live in your visual editor! 🎉**

---

*Last Updated: November 19, 2025*
