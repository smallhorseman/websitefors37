import React from 'react'
// Use anon supabase client to enable ISR/caching (avoid cookies())
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ContentPage } from '@/lib/supabase'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
// IMPORTANT: Dynamically import BuilderRuntime components only when needed
// to avoid shipping the entire visual builder component set to every CMS page.
// This reduces unused JS (Lighthouse flag ~102 KiB) for simple markdown pages.
// We'll conditionally load them inside the builder branch.
import PageWrapper from '@/components/PageWrapper'

// Try to import rehype-raw, but fall back gracefully if not available
let rehypeRaw: any
try {
  rehypeRaw = require('rehype-raw')
} catch {
  console.warn('rehype-raw not available, MDX will not parse raw HTML')
}

const isValidSlug = (s: string) => /^[a-z0-9-]{1,64}$/.test(s)

// Generate metadata dynamically based on page content
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // If the slug is not valid, don't hit the DB; return a generic 404-like metadata
  if (!isValidSlug(params.slug)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found'
    }
  }
  
  const { data: page } = await supabase
    .from('content_pages')
    .select('title, meta_description')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()
  
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found'
    }
  }
  
  return {
    title: `${page.title} | Studio 37 Photography`,
    description: page.meta_description || 'Studio 37 Photography'
  }
}

// Revalidate CMS-driven pages every 10 minutes
export const revalidate = 600

// Renamed function to avoid naming conflict with the imported ContentPage type
export default async function DynamicPage({ params, searchParams }: { params: { slug: string }, searchParams?: Record<string, string | string[]> }) {
  // Short-circuit static asset-like requests or invalid slugs
  if (!isValidSlug(params.slug)) {
    notFound()
  }
  
  const { data: page, error } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle()
  
  // Treat 406 from PostgREST as not found; avoid leaking errors
  if (!page || (error && (error as any).status === 406)) {
    notFound()
  }
  
  // Log content for debugging
  console.log(`Rendering page: ${params.slug}`)
  console.log('Content preview:', page.content?.substring(0, 200))
  
  // Detect if content uses builder blocks (contains custom JSX components)
  // vs traditional markdown/prose content
  const isBuilderPage = page.content?.includes('Block') || false
  const showNav = page.show_navbar !== false // Default to true if not specified
  
  if (isBuilderPage) {
    // Dynamic import of MDX components for builder pages only.
  const { MDXBuilderComponents } = await import('@/components/BuilderRuntime')
  const { getPageConfigs, selectProps } = await import('@/lib/pageConfigs')
  const EditableChrome = (await import('@/components/editor/EditableChrome')).default
    
    // Fetch page-level overrides for current path
    const currentPath = `/${params.slug}`
  const configs = await getPageConfigs(currentPath)
  const useDraft = (searchParams?.edit === '1')
    
    // Wrap components to inject _overrides prop based on block anchorId
    const defaultAnchorIds: Record<string,string> = {
      LogoBlock:'logo', HeroBlock:'hero', TextBlock:'text', ImageBlock:'image', ButtonBlock:'button', ColumnsBlock:'columns', SpacerBlock:'spacer', SeoFooterBlock:'seo-footer', BadgesBlock:'badges', SlideshowHeroBlock:'slideshow-hero', TestimonialsBlock:'testimonials', GalleryHighlightsBlock:'gallery-highlights', WidgetEmbedBlock:'widget-embed', ServicesGridBlock:'services-grid', StatsBlock:'stats', CTABannerBlock:'cta-banner', IconFeaturesBlock:'icon-features', ContactFormBlock:'contact-form', NewsletterBlock:'newsletter', FAQBlock:'faq', PricingTableBlock:'pricing-table', PricingCalculatorBlock:'pricing-calculator'
    }
    const wrappedComponents = Object.fromEntries(
      Object.entries(MDXBuilderComponents).map(([name, Component]) => [
        name,
        (props: any) => {
          let anchorId = props.id || props.anchorId || defaultAnchorIds[name] || name
          const override = anchorId ? configs.get(anchorId) : undefined
          return (
            <div className="relative">
              <EditableChrome label={name.replace(/Block$/, '').replace(/([a-z])([A-Z])/g,'$1 $2')} block={name} anchorId={anchorId} />
              <Component {...props} _overrides={selectProps(override as any, useDraft)} />
            </div>
          )
        }
      ])
    )
    
    // Builder-managed page: render full-width with no constraints
    return (
      <PageWrapper showNav={showNav} className={`min-h-screen ${showNav ? 'pt-16' : ''}`}>
        {page.content ? (
          <MDXRemote 
            source={page.content}
            options={{
              mdxOptions: {
                rehypePlugins: rehypeRaw 
                  ? [rehypeRaw as any, [rehypeHighlight, {}] as any]
                  : [[rehypeHighlight, {}] as any]
              }
            }}
            components={wrappedComponents as any}
          />
        ) : (
          <div className="container mx-auto px-4 py-16">
            <div className="text-gray-600">This page has no content yet.</div>
          </div>
        )}
      </PageWrapper>
    )
  }
  
  // Traditional CMS/article page: use prose wrapper for nice typography
  return (
    <PageWrapper showNav={showNav} className={`min-h-screen ${showNav ? 'pt-16' : ''}`}>
      <div className="container mx-auto px-4 py-16">
        <article className="prose prose-lg md:prose-xl max-w-4xl mx-auto prose-headings:font-serif prose-headings:text-amber-900 prose-a:text-amber-700 hover:prose-a:text-amber-800">
          {page.content ? (
            <MDXRemote 
              source={page.content}
              options={{
                mdxOptions: {
                  rehypePlugins: rehypeRaw 
                    ? [rehypeRaw as any, [rehypeHighlight, {}] as any]
                    : [[rehypeHighlight, {}] as any]
                }
              }}
              components={MDXBuilderComponents as any}
            />
          ) : (
            <div className="text-gray-600">This page has no content yet.</div>
          )}
        </article>
      </div>
    </PageWrapper>
  )
}
