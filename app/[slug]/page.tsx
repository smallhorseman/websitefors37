import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ContentPage } from '@/lib/supabase'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import { MDXBuilderComponents } from '@/components/BuilderRuntime'

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
  const supabase = createServerComponentClient({ cookies })
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

// Renamed function to avoid naming conflict with the imported ContentPage type
export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
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
  
  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        <article className="prose max-w-none">
          {page.content ? (
            <MDXRemote 
              source={page.content}
              options={{
                mdxOptions: {
                  // Use rehype-raw if available, otherwise just highlight
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
    </div>
  )
}
