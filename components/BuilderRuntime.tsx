import Image from 'next/image'
import React from 'react'

// Server components used by MDX to render VisualEditor output faithfully

export function HeroBlock({
  title,
  subtitle,
  backgroundImage,
  buttonText,
  buttonLink,
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
        {title && <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${titleColor}`}>{title}</h1>}
        {subtitle && <p className={`text-lg md:text-xl mb-6 opacity-90 ${subtitleColor}`}>{subtitle}</p>}
        {buttonText && (
          <a
            href={buttonLink || '#'}
            className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses[buttonStyle] || buttonStyleClasses.primary} ${hoverZoom}`}
          >
            {buttonText}
          </a>
        )}
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

export const MDXBuilderComponents = {
  HeroBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  ColumnsBlock,
  SpacerBlock,
}
