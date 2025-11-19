/**
 * Theme Configuration
 * Centralized design system for the visual builder editor
 * All color and font options are brand-approved and maintain consistency
 */

export const themeConfig = {
  // Brand Colors (from tailwind.config.js and globals.css)
  colors: {
    primary: {
      label: 'Primary (Amber)',
      variants: [
        { name: 'Light', value: '#fef9ef', class: 'bg-primary-50 text-gray-900' },
        { name: 'Default', value: '#b46e14', class: 'bg-primary-700 text-white' },
        { name: 'Dark', value: '#7a4b17', class: 'bg-primary-900 text-white' },
      ]
    },
    secondary: {
      label: 'Secondary (Gold)',
      variants: [
        { name: 'Light', value: '#fcf9f0', class: 'bg-secondary-50 text-gray-900' },
        { name: 'Default', value: '#a17a07', class: 'bg-secondary-600 text-white' },
        { name: 'Dark', value: '#553d10', class: 'bg-secondary-900 text-white' },
      ]
    },
    neutral: {
      label: 'Neutral (Gray)',
      variants: [
        { name: 'White', value: '#ffffff', class: 'bg-white text-gray-900' },
        { name: 'Light', value: '#f9fafb', class: 'bg-gray-50 text-gray-900' },
        { name: 'Medium', value: '#e5e7eb', class: 'bg-gray-200 text-gray-900' },
        { name: 'Dark', value: '#1f2937', class: 'bg-gray-800 text-white' },
        { name: 'Black', value: '#111827', class: 'bg-gray-900 text-white' },
      ]
    },
    accent: {
      label: 'Accent Colors',
      variants: [
        { name: 'Amber Glow', value: '#fef3c7', class: 'bg-amber-100 text-amber-900' },
        { name: 'Warm Beige', value: '#fef7e8', class: 'bg-amber-50 text-amber-950' },
        { name: 'Rich Brown', value: '#78350f', class: 'bg-amber-900 text-amber-50' },
      ]
    }
  },

  // Brand Fonts (from layout.tsx and globals.css)
  fonts: {
    heading: {
      label: 'Heading Fonts',
      options: [
        { name: 'Playfair Display (Brand)', value: 'var(--font-playfair)', class: 'font-serif' },
        { name: 'Cormorant Garamond', value: 'var(--font-cormorant)', class: 'font-cormorant' },
        { name: 'Lora', value: 'var(--font-lora)', class: 'font-lora' },
        { name: 'Crimson Pro', value: 'var(--font-crimson)', class: 'font-crimson' },
        { name: 'Libre Baskerville', value: 'var(--font-libre)', class: 'font-libre' },
        { name: 'Cinzel (Display)', value: 'var(--font-cinzel)', class: 'font-cinzel' },
        { name: 'Great Vibes (Script)', value: 'var(--font-greatvibes)', class: 'font-greatvibes' },
        { name: 'Bebas Neue (Display)', value: 'var(--font-bebas)', class: 'font-bebas' },
        { name: 'Inter Bold', value: 'var(--font-inter)', class: 'font-sans font-bold' },
      ]
    },
    body: {
      label: 'Body Fonts',
      options: [
        { name: 'Inter (Brand)', value: 'var(--font-inter)', class: 'font-sans' },
        { name: 'Montserrat', value: 'var(--font-montserrat)', class: 'font-montserrat' },
        { name: 'Raleway', value: 'var(--font-raleway)', class: 'font-raleway' },
        { name: 'Nunito', value: 'var(--font-nunito)', class: 'font-nunito' },
        { name: 'Work Sans', value: 'var(--font-worksans)', class: 'font-worksans' },
        { name: 'Playfair Display', value: 'var(--font-playfair)', class: 'font-serif' },
        { name: 'Lora', value: 'var(--font-lora)', class: 'font-lora' },
      ]
    }
  },

  // Text Sizes
  textSizes: [
    { name: 'Small', value: 'sm', class: 'text-sm' },
    { name: 'Base', value: 'base', class: 'text-base' },
    { name: 'Medium', value: 'md', class: 'text-lg' },
    { name: 'Large', value: 'lg', class: 'text-xl' },
    { name: 'XL', value: 'xl', class: 'text-2xl' },
    { name: '2XL', value: '2xl', class: 'text-3xl' },
    { name: '3XL', value: '3xl', class: 'text-4xl' },
  ],

  // Text Colors (for use with neutral backgrounds)
  textColors: {
    light: [
      { name: 'Gray 900', value: 'text-gray-900', hex: '#111827' },
      { name: 'Gray 700', value: 'text-gray-700', hex: '#374151' },
      { name: 'Primary', value: 'text-primary-700', hex: '#b46e14' },
      { name: 'Secondary', value: 'text-secondary-600', hex: '#a17a07' },
    ],
    dark: [
      { name: 'White', value: 'text-white', hex: '#ffffff' },
      { name: 'Gray 50', value: 'text-gray-50', hex: '#f9fafb' },
      { name: 'Amber 50', value: 'text-amber-50', hex: '#fef9ef' },
      { name: 'Amber 200', value: 'text-amber-200', hex: '#fde68a' },
    ]
  },

  // Button Styles
  buttonStyles: [
    { name: 'Primary', class: 'btn-primary' },
    { name: 'Secondary', class: 'btn-secondary' },
    { name: 'Ghost', class: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900' },
    { name: 'Link', class: 'underline text-primary-700 hover:text-primary-900' },
  ],

  // Spacing Options
  spacing: {
    padding: [
      { name: 'None', value: '0' },
      { name: 'Small', value: '8' },
      { name: 'Medium', value: '16' },
      { name: 'Large', value: '24' },
      { name: 'XL', value: '32' },
      { name: '2XL', value: '40' },
    ],
    margin: [
      { name: 'None', value: '0' },
      { name: 'Small', value: '4' },
      { name: 'Medium', value: '8' },
      { name: 'Large', value: '12' },
      { name: 'XL', value: '16' },
    ]
  },

  // Animation Options
  animations: [
    { name: 'None', value: 'none' },
    { name: 'Fade In', value: 'fade-in' },
    { name: 'Slide Up', value: 'slide-up' },
    { name: 'Zoom', value: 'zoom' },
  ],
}

export type ThemeColor = {
  name: string
  value: string
  class: string
}

export type ThemeFont = {
  name: string
  value: string
  class: string
}

export type ThemeTextSize = {
  name: string
  value: string
  class: string
}

/**
 * Get color by value or fallback to default
 */
export function getThemeColor(value?: string): ThemeColor | undefined {
  if (!value) return undefined
  
  for (const colorGroup of Object.values(themeConfig.colors)) {
    const found = colorGroup.variants.find(v => v.value === value || v.class === value)
    if (found) return found
  }
  
  return undefined
}

/**
 * Get font by value or fallback to default
 */
export function getThemeFont(value?: string): ThemeFont | undefined {
  if (!value) return undefined
  
  for (const fontGroup of Object.values(themeConfig.fonts)) {
    const found = fontGroup.options.find(f => f.value === value || f.class === value)
    if (found) return found
  }
  
  return undefined
}

/**
 * Get all color variants as flat array (for dropdowns)
 */
export function getAllColorVariants(): ThemeColor[] {
  const colors: ThemeColor[] = []
  
  for (const colorGroup of Object.values(themeConfig.colors)) {
    colors.push(...colorGroup.variants)
  }
  
  return colors
}

/**
 * Get all font options as flat array
 */
export function getAllFontOptions(): ThemeFont[] {
  const fonts: ThemeFont[] = []
  
  for (const fontGroup of Object.values(themeConfig.fonts)) {
    fonts.push(...fontGroup.options)
  }
  
  return fonts
}
