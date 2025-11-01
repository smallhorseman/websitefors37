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
}: {
  title?: string
  subtitle?: string
  backgroundImage?: string
  buttonText?: string
  buttonLink?: string
  alignment?: 'left' | 'center' | 'right'
  overlay?: number
}) {
  return (
    <section className="relative h-96 md:h-[28rem] flex items-center justify-center text-white overflow-hidden rounded-lg">
      {backgroundImage && (
        <Image src={backgroundImage} alt="" fill className="object-cover" />
      )}
      <div
        className="absolute inset-0 bg-black/60"
        style={{ backgroundColor: `rgba(0,0,0,${Math.min(Math.max(overlay ?? 50, 0), 100) / 100})` }}
      />
      <div className={`relative z-10 max-w-4xl w-full px-6 text-${alignment}`}>
        {title && <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>}
        {subtitle && <p className="text-lg md:text-xl mb-6 opacity-90">{subtitle}</p>}
        {buttonText && (
          <a
            href={buttonLink || '#'}
            className="inline-block px-6 py-3 bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}

export function TextBlock({ content, alignment = 'left', size = 'md' }: {
  content?: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const sizeClasses: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  }
  return (
    <div className={`p-6 md:p-8 ${sizeClasses[size || 'md']} text-${alignment}`}>
      {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  )
}

export function ImageBlock({ url, alt = '', caption, width = 'full' }: {
  url?: string
  alt?: string
  caption?: string
  width?: 'full' | 'large' | 'medium' | 'small'
}) {
  const widthClasses: Record<string, string> = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full',
  }
  return (
    <div className="p-6 md:p-8">
      <div className={`mx-auto ${widthClasses[width || 'full']}`}>
        {url && (
          <div className="relative aspect-video">
            <Image src={url} alt={alt} fill className="object-cover rounded-lg" />
          </div>
        )}
        {caption && <p className="text-sm text-gray-600 mt-2 text-center">{caption}</p>}
      </div>
    </div>
  )
}

export function ButtonBlock({ text, link = '#', style = 'primary', alignment = 'center' }: {
  text?: string
  link?: string
  style?: 'primary' | 'secondary' | 'outline'
  alignment?: 'left' | 'center' | 'right'
}) {
  const styleClasses: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  }
  return (
    <div className={`p-6 md:p-8 text-${alignment}`}>
      {text && (
        <a href={link} className={`inline-block px-6 py-3 rounded-lg transition ${styleClasses[style]}`}>
          {text}
        </a>
      )}
    </div>
  )
}

export function ColumnsBlock({ columnsJson }: { columnsJson?: string }) {
  const cols: Array<{ content?: string; image?: string }> = columnsJson ? JSON.parse(columnsJson) : []
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
    <div className="p-6 md:p-8">
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
