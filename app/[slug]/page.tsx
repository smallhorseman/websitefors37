import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ContentPage } from '@/lib/supabase'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'

// Generate metadata dynamically based on page content
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
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
  
  const { data: page } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        <article className="prose max-w-none">
          <MDXRemote 
            source={page.content}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeHighlight]
              }
            }}
          />
        </article>
      </div>
    </div>
  )
}
