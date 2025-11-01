import Image from 'next/image'
import React from 'react'
import LocalBusinessSchema from './LocalBusinessSchema'
import SlideshowHeroClient from './blocks/SlideshowHeroClient'
import TestimonialsClient from './blocks/TestimonialsClient'
import WidgetEmbedClient from './blocks/WidgetEmbedClient'
import LeadCaptureForm from './LeadCaptureForm'
import NewsletterInlineClient from './blocks/NewsletterInlineClient'

// Server components used by MDX to render VisualEditor output faithfully

// Logo block - renders brand logo as SVG wordmark or image
export function LogoBlock({
  mode = 'svg',
  text = 'Studio 37',
  subtext,
  showCamera = 'true',
  color = '#111827',
  accentColor = '#b46e14',
  imageUrl,
  size = 'md',
  alignment = 'left',
  link,
  animation = 'none',
}: {
  mode?: 'svg' | 'image' | string
  text?: string
  subtext?: string
  showCamera?: boolean | string
  color?: string
  accentColor?: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg' | string
  alignment?: 'left' | 'center' | 'right' | string
  link?: string
  animation?: string
}) {
  const sizeMap: Record<string, string> = { sm: 'text-xl', md: 'text-2xl md:text-3xl', lg: 'text-4xl md:text-5xl' }
  const alignMap: Record<string, string> = { left: 'justify-start text-left', center: 'justify-center text-center', right: 'justify-end text-right' }
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''
  const showCam = String(showCamera) !== 'false'

  const node = (
    <div className={`p-4 ${animClass}`}>
      <div className={`flex ${alignMap[String(alignment)] || alignMap.left}`}>
        <div className={`flex items-center gap-3 ${sizeMap[String(size)] || sizeMap.md}`}>
          {String(mode) === 'image' && imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={text || 'Logo'} className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              {showCam && (
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill={accentColor || '#b46e14'} aria-hidden="true"><path d="M9 3l2 2h2l2-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4z"/><circle cx="12" cy="13" r="4" fill="currentColor"/></svg>
              )}
              <div>
                <div className="font-serif font-bold leading-none" style={{ color: color || '#111827' }} dangerouslySetInnerHTML={{ __html: text || '' }} />
                {subtext && <div className="text-sm tracking-wide" style={{ color: accentColor || '#b46e14' }}>{subtext}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (link) {
    return <a href={link} className="no-underline">{node}</a>
  }
  return node
}

export function HeroBlock({
  title,
  subtitle,
  backgroundImage,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  alignment = 'center',
  overlay = 50,
  titleColor = 'text-white',
  subtitleColor = 'text-amber-50',
  buttonStyle = 'primary',
  animation = 'none',
  buttonAnimation = 'none',
  fullBleed = false,
}: {
  title?: string
  subtitle?: string
  backgroundImage?: string
  buttonText?: string
  buttonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  alignment?: 'left' | 'center' | 'right'
  overlay?: number | string
  titleColor?: string
  subtitleColor?: string
  buttonStyle?: string
  animation?: string
  buttonAnimation?: string
  fullBleed?: boolean | string
}) {
  const buttonStyleClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30',
    outline: 'border-2 border-white text-white hover:bg-white/10'
  }
  const hoverZoom = buttonAnimation === 'hover-zoom' ? 'transition-transform duration-300 hover:scale-105' : ''
  const isFullBleed = String(fullBleed) === 'true'
  const sectionBase = `relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center text-white overflow-hidden ${animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''}`
  
  const section = (
    <section className={`${sectionBase} ${isFullBleed ? '' : 'rounded-lg'}`}>
      {backgroundImage && (
        <Image src={backgroundImage} alt="" fill className="object-cover" />
      )}
      <div
        className="absolute inset-0 bg-black/60"
        style={{ backgroundColor: `rgba(0,0,0,${Math.min(Math.max(Number(overlay ?? 50), 0), 100) / 100})` }}
      />
      <div className={`relative z-10 max-w-4xl w-full px-6 text-${alignment}`}>
        {title && <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${titleColor}`} dangerouslySetInnerHTML={{ __html: title }} />}
        {subtitle && <p className={`text-lg md:text-xl mb-6 opacity-90 ${subtitleColor}`} dangerouslySetInnerHTML={{ __html: subtitle }} />}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {buttonText && (
            <a
              href={buttonLink || '#'}
              className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses[buttonStyle] || buttonStyleClasses.primary} ${hoverZoom}`}
            >
              {buttonText}
            </a>
          )}
          {secondaryButtonText && (
            <a
              href={secondaryButtonLink || '#'}
              className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses.outline} ${hoverZoom}`}
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  )

  if (isFullBleed) {
    return (
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-clip">
        {section}
      </div>
    )
  }

  return section
}

export function TextBlock({ contentB64, alignment = 'left', size = 'md', animation = 'none' }: {
  contentB64?: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animation?: string
}) {
  const sizeClasses: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  }
  const content = contentB64 ? Buffer.from(contentB64, 'base64').toString('utf-8') : ''
  return (
    <div className={`p-6 md:p-8 ${sizeClasses[size || 'md']} text-${alignment} ${animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''}`}>
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  )
}

export function ImageBlock({ url, alt = '', caption, width = 'full', link, animation = 'none' }: {
  url?: string
  alt?: string
  caption?: string
  width?: 'full' | 'large' | 'medium' | 'small'
  link?: string
  animation?: string
}) {
  const widthClasses: Record<string, string> = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full',
  }
  
  const animationClasses: Record<string, string> = {
    none: '',
    'hover-zoom': 'transition-transform duration-300 hover:scale-105',
    'fade-in': 'animate-fadeIn',
    'slide-up': 'animate-slideUp',
    'zoom': 'animate-zoom'
  }
  
  const imageElement = (
    <div className={`mx-auto ${widthClasses[width || 'full']}`}>
      {url && (
        <div className={`relative aspect-video overflow-hidden ${animationClasses[animation || 'none']}`}>
          <Image src={url} alt={alt} fill className="object-cover rounded-lg" />
        </div>
      )}
      {caption && <p className="text-sm text-gray-600 mt-2 text-center">{caption}</p>}
    </div>
  )
  
  return (
    <div className="p-6 md:p-8">
      {link ? (
        <a href={link} className="block cursor-pointer">
          {imageElement}
        </a>
      ) : imageElement}
    </div>
  )
}

export function ButtonBlock({ text, link = '#', style = 'primary', alignment = 'center', animation = 'none' }: {
  text?: string
  link?: string
  style?: 'primary' | 'secondary' | 'outline'
  alignment?: 'left' | 'center' | 'right'
  animation?: string
}) {
  const styleClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  }
  const animClass =
    animation === 'fade-in'
      ? 'animate-fadeIn'
      : animation === 'slide-up'
      ? 'animate-slideUp'
      : animation === 'zoom'
      ? 'animate-zoom'
      : ''
  const hoverZoom = animation === 'hover-zoom' ? 'transition-transform duration-300 hover:scale-105' : ''

  return (
    <div className={`p-6 md:p-8 text-${alignment} ${animClass}`}>
      {text && (
        <a href={link} className={`inline-block px-6 py-3 rounded-lg transition no-underline ${styleClasses[style]} ${hoverZoom}`}>
          {text}
        </a>
      )}
    </div>
  )
}

export function ColumnsBlock({ columnsB64, animation = 'none' }: { columnsB64?: string, animation?: string }) {
  const decoded = columnsB64 ? Buffer.from(columnsB64, 'base64').toString('utf-8') : '[]'
  const cols: Array<{ content?: string; image?: string }> = JSON.parse(decoded || '[]')
  const count = Math.min(Math.max(cols.length || 2, 1), 4)
  const gridClass =
    count === 1
      ? 'md:grid-cols-1'
      : count === 2
      ? 'md:grid-cols-2'
      : count === 3
      ? 'md:grid-cols-3'
      : 'md:grid-cols-4'
  return (
    <div className={`p-6 md:p-8 ${animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
        {cols.map((col, i) => (
          <div key={i} className="space-y-4">
            {col.image && (
              <div className="relative aspect-video">
                <Image src={col.image} alt="" fill className="object-cover rounded-lg" />
              </div>
            )}
            {col.content && <div dangerouslySetInnerHTML={{ __html: col.content }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SpacerBlock({ height = 'md' }: { height?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const heights: Record<string, string> = { sm: 'h-8', md: 'h-16', lg: 'h-24', xl: 'h-32' }
  return <div className={heights[height] || heights.md} />
}

export function SeoFooterBlock({ contentB64, includeSchema = 'true' }: { contentB64?: string, includeSchema?: string }) {
  const html = contentB64 ? Buffer.from(contentB64, 'base64').toString('utf-8') : ''
  const withSchema = String(includeSchema) === 'true'
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        {html && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
      {withSchema && <LocalBusinessSchema />}
    </footer>
  )
}

// Badges block
export function BadgesBlock({ badgesB64, alignment = 'center', size = 'md', style = 'pill', animation = 'fade-in' }: {
  badgesB64?: string
  alignment?: 'left' | 'center' | 'right' | string
  size?: 'sm' | 'md' | 'lg' | string
  style?: 'solid' | 'outline' | 'pill' | string
  animation?: string
}) {
  const json = badgesB64 ? Buffer.from(badgesB64, 'base64').toString('utf-8') : '[]'
  let badges: Array<{ icon: 'star'|'thumbtack'|'shield'|'camera'|'check'|'yelp'|'google'; label: string; sublabel?: string; href?: string; color?: string }> = []
  try { badges = JSON.parse(json || '[]') } catch { badges = [] }

  const sizeClasses: Record<string,string> = { sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-1.5', lg: 'text-base px-4 py-2' }
  const alignClass = alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center'
  const badgeBase = style === 'solid' ? 'bg-primary-600 text-white' : style === 'outline' ? 'border border-gray-300 text-gray-800 bg-white' : 'bg-white/90 border border-gray-200 text-gray-800 rounded-full'
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''

  const Icon = ({ name, className }: { name: string, className?: string }) => {
    const cls = className || 'h-4 w-4'
    switch (name) {
      case 'star':
      case 'yelp':
      case 'google':
        return (
          <svg className={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" /></svg>
        )
      case 'thumbtack':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2l8 8-5.5 1.5L10.5 17 7 13.5l5.5-6.5L14 2z" /></svg>
        )
      case 'shield':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l7 3v6c0 5.55-3.84 10.74-7 12-3.16-1.26-7-6.45-7-12V5l7-3z" /><path d="M10 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        )
      case 'camera':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 3l2 2h2l2-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4z" /><circle cx="12" cy="13" r="4" fill="currentColor" /></svg>
        )
      case 'check':
        return (
          <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z" /></svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`p-6 md:p-8 ${animClass}`}>
      <div className={`flex flex-wrap gap-2 ${alignClass}`}>
        {badges.map((b, i) => {
          const styleColor = b.color && b.color.startsWith('#') ? { color: b.color } as React.CSSProperties : undefined
          const colorClass = b.color && b.color.startsWith('text-') ? b.color : ''
          const content = (
            <span className={`inline-flex items-center gap-2 ${sizeClasses[size || 'md']} ${badgeBase}`}>
              <span className={`inline-flex items-center ${colorClass}`} style={styleColor}>
                <Icon name={b.icon} />
              </span>
              <span className="font-medium">{b.label}</span>
              {b.sublabel && <span className="text-xs opacity-80">{b.sublabel}</span>}
            </span>
          )
          return b.href ? (
            <a key={i} href={b.href} className="no-underline" target="_blank" rel="noopener noreferrer">{content}</a>
          ) : (
            <span key={i}>{content}</span>
          )
        })}
      </div>
    </div>
  )
}

// Slideshow hero with multiple images and interval
export function SlideshowHeroBlock({
  slidesB64,
  intervalMs = '5000',
  overlay = '60',
  title,
  subtitle,
  buttonText,
  buttonLink = '/book-a-session',
  alignment = 'center',
  titleColor = 'text-white',
  subtitleColor = 'text-amber-50',
  buttonStyle = 'primary',
  buttonAnimation = 'hover-zoom',
  fullBleed = 'true'
}: {
  slidesB64?: string
  intervalMs?: string | number
  overlay?: string | number
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  alignment?: 'left' | 'center' | 'right' | string
  titleColor?: string
  subtitleColor?: string
  buttonStyle?: string
  buttonAnimation?: string
  fullBleed?: string | boolean
}) {
  const json = slidesB64 ? Buffer.from(slidesB64, 'base64').toString('utf-8') : '[]'
  let slides: Array<{ image: string; category?: string; title?: string }> = []
  try { slides = JSON.parse(json || '[]') } catch { slides = [] }
  const isFullBleed = String(fullBleed) === 'true'

  const node = (
    <SlideshowHeroClient
      slides={slides}
      intervalMs={Number(intervalMs || 5000)}
      overlay={Number(overlay || 60)}
      heading={title}
      subheading={subtitle}
      ctaText={buttonText}
      ctaLink={buttonLink}
      alignment={String(alignment) as any}
      titleColor={titleColor}
      subtitleColor={subtitleColor}
      buttonStyle={buttonStyle}
      buttonAnimation={buttonAnimation}
    />
  )

  if (isFullBleed) {
    return (
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-clip">
        {node}
      </div>
    )
  }
  return node
}

// Testimonials simple client carousel
export function TestimonialsBlock({ testimonialsB64, animation = 'fade-in' }: { testimonialsB64?: string, animation?: string }) {
  const json = testimonialsB64 ? Buffer.from(testimonialsB64, 'base64').toString('utf-8') : '[]'
  let testimonials: Array<{ quote: string; author?: string; subtext?: string; avatar?: string }> = []
  try { testimonials = JSON.parse(json || '[]') } catch { testimonials = [] }
  return (
    <div className={`p-6 md:p-10 ${animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <TestimonialsClient testimonials={testimonials} />
    </div>
  )
}

// Gallery highlights, fetches featured images by categories (if provided)
export async function GalleryHighlightsBlock({ categoriesB64, collectionsB64, tagsB64, group, featuredOnly = 'true', limit = '6', limitPerCategory, sortBy = 'display_order', sortDir = 'asc', animation = 'fade-in' }: {
  categoriesB64?: string,
  collectionsB64?: string,
  tagsB64?: string,
  group?: string,
  featuredOnly?: string | boolean,
  limit?: string | number,
  limitPerCategory?: string | number,
  sortBy?: 'display_order' | 'created_at' | string,
  sortDir?: 'asc' | 'desc' | string,
  animation?: string
}) {
  // Dynamic import to avoid making this entire module depend on Supabase at compile time
  const { createServerComponentClient } = await import('@supabase/auth-helpers-nextjs')
  const { cookies } = await import('next/headers')
  const supabase = createServerComponentClient({ cookies })

  let categories: string[] = []
  let collections: string[] = []
  let tags: string[] = []
  if (categoriesB64) {
    try { categories = JSON.parse(Buffer.from(categoriesB64, 'base64').toString('utf-8') || '[]') } catch {}
  }
  if (collectionsB64) {
    try { collections = JSON.parse(Buffer.from(collectionsB64, 'base64').toString('utf-8') || '[]') } catch {}
  }
  if (tagsB64) {
    try { tags = JSON.parse(Buffer.from(tagsB64, 'base64').toString('utf-8') || '[]') } catch {}
  }

  const asc = String(sortDir).toLowerCase() !== 'desc'
  const sortColumn = (sortBy === 'created_at') ? 'created_at' : 'display_order'

  const fetchBatch = async (extraFilters: (q: any) => any, lim?: number) => {
    let q: any = supabase.from('gallery_images').select('*')
    if (categories.length) { q = q.in('category', categories) }
    if (collections.length) { q = q.in('collection', collections) }
    if (tags.length) { /* supabase: overlaps for any tag match */ q = q.overlaps('tags', tags) }
    if (group) { q = q.eq('highlight_group', group) }
    if (String(featuredOnly) !== 'false') { q = q.eq('featured', true) }
    q = extraFilters(q)
    q = q.order(sortColumn, { ascending: asc })
    if (lim && lim > 0) q = q.limit(lim)
    const { data } = await q
    return data || []
  }

  let data: any[] = []
  const perCat = Number(limitPerCategory || 0)
  const totalLimit = Number(limit || 6)

  if (perCat > 0 && categories.length > 0) {
    // Fetch per category and merge
    for (const cat of categories) {
      const rows = await fetchBatch((q) => q.eq('category', cat), perCat)
      data.push(...rows)
    }
    // If overall limit set, trim
    if (data.length > totalLimit) {
      data = data.slice(0, totalLimit)
    }
  } else {
    data = await fetchBatch((q) => q, totalLimit)
  }

  return (
    <div className={`p-6 md:p-10 ${animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data || []).map((img) => (
          <div key={img.id} className="relative aspect-video">
            <Image src={img.image_url} alt={img.title || ''} fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
            <div className="absolute bottom-2 left-2 text-white drop-shadow">
              <div className="text-sm capitalize opacity-90">{img.category}</div>
              <div className="text-base font-medium">{img.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generic third-party widget embed with style isolation
export function WidgetEmbedBlock({ htmlB64, scriptSrcsB64, provider = 'custom', styleReset = 'true' }: {
  htmlB64?: string
  scriptSrcsB64?: string
  provider?: string
  styleReset?: string | boolean
}) {
  const html = htmlB64 ? Buffer.from(htmlB64, 'base64').toString('utf-8') : ''
  let scriptSrcs: string[] = []
  if (scriptSrcsB64) {
    try { scriptSrcs = JSON.parse(Buffer.from(scriptSrcsB64, 'base64').toString('utf-8') || '[]') } catch { scriptSrcs = [] }
  }
  return (
    <div className="p-6 md:p-8">
      <WidgetEmbedClient html={html} scriptSrcs={scriptSrcs} provider={provider} styleReset={String(styleReset) !== 'false'} />
    </div>
  )
}

// Services Grid - displays services with images and feature lists
export function ServicesGridBlock({ servicesB64, heading, subheading, columns = '3', animation = 'fade-in' }: {
  servicesB64?: string
  heading?: string
  subheading?: string
  columns?: string | number
  animation?: string
}) {
  const json = servicesB64 ? Buffer.from(servicesB64, 'base64').toString('utf-8') : '[]'
  let services: Array<{ image: string; title: string; description: string; features: string[] }> = []
  try { services = JSON.parse(json || '[]') } catch { services = [] }

  const gridCols: Record<string, string> = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4'
  }
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''

  return (
    <div className={`p-6 md:p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h2>
            {subheading && <p className="text-lg text-gray-600">{subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[String(columns)] || 'md:grid-cols-3'} gap-6`}>
          {services.map((service, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {service.image && (
                <div className="aspect-video relative overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                {service.description && <p className="text-gray-600 mb-4">{service.description}</p>}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Stats Block - displays statistics with icons and numbers
export function StatsBlock({ statsB64, heading, columns = '3', style = 'default', animation = 'fade-in' }: {
  statsB64?: string
  heading?: string
  columns?: string | number
  style?: 'default' | 'cards' | 'minimal' | string
  animation?: string
}) {
  const json = statsB64 ? Buffer.from(statsB64, 'base64').toString('utf-8') : '[]'
  let stats: Array<{ icon: string; number: string; label: string; suffix?: string }> = []
  try { stats = JSON.parse(json || '[]') } catch { stats = [] }

  const gridCols: Record<string, string> = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4'
  }
  const styleClasses: Record<string, string> = {
    default: '',
    cards: 'bg-white rounded-lg shadow-md p-6',
    minimal: 'border-b border-gray-200 pb-4'
  }
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''

  return (
    <div className={`p-6 md:p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{heading}</h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols[String(columns)] || 'md:grid-cols-3'} gap-6`}>
          {stats.map((stat, i) => (
            <div key={i} className={`text-center ${styleClasses[style] || ''}`}>
              {stat.icon && (
                <div className="text-4xl mb-3">{stat.icon}</div>
              )}
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stat.number}{stat.suffix || ''}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// CTA Banner - full-width call-to-action with background and dual buttons
export function CTABannerBlock({ heading, subheading, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, backgroundImage, backgroundColor = '#0f172a', overlay = '60', textColor = 'text-white', fullBleed = 'true', animation = 'fade-in' }: {
  heading?: string
  subheading?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
  backgroundColor?: string
  overlay?: string | number
  textColor?: string
  fullBleed?: string | boolean
  animation?: string
}) {
  const overlayAlpha = Math.min(Math.max(Number(overlay || 60), 0), 100) / 100
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''
  const isFullBleed = String(fullBleed) === 'true'

  const content = (
    <div className={`relative min-h-[300px] flex items-center justify-center overflow-hidden rounded-lg ${animClass}`}>
      {backgroundImage && (
        <Image src={backgroundImage} alt="CTA Background" fill className="object-cover" />
      )}
      {!backgroundImage && backgroundColor && (
        <div className="absolute inset-0" style={{ backgroundColor }} />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
      <div className={`relative z-10 max-w-4xl w-full px-6 text-center py-12`}>
        {heading && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${textColor}`}>
            {heading}
          </h2>
        )}
        {subheading && (
          <p className={`text-lg md:text-xl mb-6 opacity-90 ${textColor}`}>
            {subheading}
          </p>
        )}
        {(primaryButtonText || secondaryButtonText) && (
          <div className="flex flex-wrap gap-3 justify-center">
            {primaryButtonText && (
              <a href={primaryButtonLink || '#'} className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition no-underline">
                {primaryButtonText}
              </a>
            )}
            {secondaryButtonText && (
              <a href={secondaryButtonLink || '#'} className="inline-block px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition no-underline">
                {secondaryButtonText}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (isFullBleed) {
    return (
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-clip">
        {content}
      </div>
    )
  }
  return content
}

// Icon Features - small feature cards with icon, title, and description
export function IconFeaturesBlock({ featuresB64, heading, subheading, columns = '4', animation = 'fade-in' }: {
  featuresB64?: string
  heading?: string
  subheading?: string
  columns?: string | number
  animation?: string
}) {
  const json = featuresB64 ? Buffer.from(featuresB64, 'base64').toString('utf-8') : '[]'
  let features: Array<{ icon: string; title: string; description: string }> = []
  try { features = JSON.parse(json || '[]') } catch { features = [] }

  const gridCols: Record<string, string> = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4'
  }
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''

  return (
    <div className={`p-6 md:p-8 ${animClass}`}>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h2>
            {subheading && <p className="text-lg text-gray-600">{subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${gridCols[String(columns)] || 'md:grid-cols-4'} gap-6`}>
          {features.map((feature, i) => (
            <div key={i} className="text-center p-6">
              {feature.icon && (
                <div className="text-5xl mb-4">{feature.icon}</div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Contact Form - wraps client LeadCaptureForm with heading/subheading
export function ContactFormBlock({ heading, subheading, animation = 'fade-in' }: { heading?: string, subheading?: string, animation?: string }) {
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''
  return (
    <section className={`p-6 md:p-10 ${animClass}`}>
      <div className="max-w-3xl mx-auto">
        {(heading || subheading) && (
          <div className="text-center mb-6">
            {heading && <h2 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h2>}
            {subheading && <p className="text-gray-600">{subheading}</p>}
          </div>
        )}
        <LeadCaptureForm />
      </div>
    </section>
  )
}

// Newsletter Signup - inline client form
export function NewsletterBlock({ heading, subheading, disclaimer, style = 'card', animation = 'fade-in' }: { heading?: string, subheading?: string, disclaimer?: string, style?: 'card' | 'banner' | string, animation?: string }) {
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''
  const isBanner = String(style) === 'banner'
  return (
    <section className={`p-6 md:p-10 ${animClass}`}>
      <div className={`max-w-3xl mx-auto border rounded-xl p-6 ${isBanner ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'}`}>
        <NewsletterInlineClient heading={heading} subheading={subheading} disclaimer={disclaimer} />
      </div>
    </section>
  )
}

// FAQ block - collapsible Q&A list, supports 1-2 columns
export function FAQBlock({ itemsB64, heading, columns = '1', animation = 'fade-in' }: { itemsB64?: string, heading?: string, columns?: string | number, animation?: string }) {
  const json = itemsB64 ? Buffer.from(itemsB64, 'base64').toString('utf-8') : '[]'
  let items: Array<{ question: string; answer: string }> = []
  try { items = JSON.parse(json || '[]') } catch { items = [] }
  const cols = Math.min(Math.max(Number(columns || 1), 1), 2)
  const mid = Math.ceil(items.length / cols)
  const col1 = items.slice(0, cols === 2 ? mid : items.length)
  const col2 = cols === 2 ? items.slice(mid) : []
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''

  const renderCol = (arr: typeof items) => (
    <div className="space-y-3">
      {arr.map((qa, i) => (
        <details key={i} className="group bg-white border rounded-lg p-4">
          <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
            <span>{qa.question}</span>
            <span className="ml-4 text-gray-400 group-open:rotate-180 transition">⌄</span>
          </summary>
          <div className="mt-2 text-gray-600" dangerouslySetInnerHTML={{ __html: qa.answer }} />
        </details>
      ))}
    </div>
  )

  return (
    <section className={`p-6 md:p-10 ${animClass}`}>
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{heading}</h2>}
        <div className={`grid grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
          {renderCol(col1)}
          {col2.length > 0 && renderCol(col2)}
        </div>
      </div>
    </section>
  )
}

// Pricing Table block - plan cards with features
export function PricingTableBlock({ plansB64, heading, subheading, columns = '3', animation = 'fade-in', style = 'light', variant = 'card', showFeatureChecks = 'true' }: { plansB64?: string, heading?: string, subheading?: string, columns?: string | number, animation?: string, style?: 'light' | 'dark' | string, variant?: 'card' | 'flat' | string, showFeatureChecks?: boolean | string }) {
  const json = plansB64 ? Buffer.from(plansB64, 'base64').toString('utf-8') : '[]'
  let plans: Array<{ title: string; price: string; period?: string; features: string[]; ctaText?: string; ctaLink?: string; highlight?: boolean }> = []
  try { plans = JSON.parse(json || '[]') } catch { plans = [] }
  const gridCols: Record<string, string> = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-3', '4': 'md:grid-cols-4' }
  const animClass = animation === 'fade-in' ? 'animate-fadeIn' : animation === 'slide-up' ? 'animate-slideUp' : animation === 'zoom' ? 'animate-zoom' : ''
  const colClass = gridCols[String(columns)] || 'md:grid-cols-3'
  const isDark = String(style) === 'dark'
  const isCard = String(variant) !== 'flat'
  const showChecks = String(showFeatureChecks) !== 'false'

  const sectionText = isDark ? 'text-slate-100' : 'text-gray-900'
  const subText = isDark ? 'text-slate-300' : 'text-gray-600'

  const planBase = isCard
    ? (isDark ? 'rounded-xl border border-slate-700 bg-slate-800/60' : 'rounded-xl border border-gray-200 bg-white')
    : (isDark ? 'rounded-lg bg-transparent hover:bg-slate-800/50 transition' : 'rounded-lg bg-transparent hover:bg-gray-50 transition')

  return (
    <section className={`p-6 md:p-10 ${animClass} ${isDark ? 'bg-slate-900' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {(heading || subheading) && (
          <div className="text-center mb-8">
            {heading && <h2 className={`text-3xl font-bold mb-2 ${sectionText}`}>{heading}</h2>}
            {subheading && <p className={`text-lg ${subText}`}>{subheading}</p>}
          </div>
        )}
        <div className={`grid grid-cols-1 ${colClass} gap-6`}>
          {plans.map((plan, i) => (
            <div key={i} className={`${planBase} ${plan.highlight ? (isDark ? 'ring-1 ring-primary-700/40 bg-primary-900/20' : 'ring-1 ring-primary-200 bg-primary-50/30') : ''} p-6 flex flex-col`}>
              <div className="mb-4">
                <h3 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{plan.title}</h3>
                <div className={`mt-2 text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.price} {plan.period && <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>/ {plan.period}</span>}</div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                      {showChecks && (
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {plan.ctaText && (
                <a href={plan.ctaLink || '#'} className={`mt-auto inline-block px-5 py-2 rounded-lg text-center no-underline ${plan.highlight ? 'bg-primary-600 text-white hover:bg-primary-700' : (isDark ? 'border border-primary-400 text-primary-200 hover:bg-primary-900/20' : 'border border-primary-600 text-primary-700 hover:bg-primary-50')}`}>
                  {plan.ctaText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const MDXBuilderComponents = {
  LogoBlock,
  HeroBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  ColumnsBlock,
  SpacerBlock,
  SeoFooterBlock,
  BadgesBlock,
  SlideshowHeroBlock,
  TestimonialsBlock,
  GalleryHighlightsBlock,
  WidgetEmbedBlock,
  ServicesGridBlock,
  StatsBlock,
  CTABannerBlock,
  IconFeaturesBlock,
  ContactFormBlock,
  NewsletterBlock,
  FAQBlock,
  PricingTableBlock,
}
