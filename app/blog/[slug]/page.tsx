import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'

// Generate metadata dynamically based on blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, meta_description, excerpt')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found'
    }
  }
  
  return {
    title: `${post.title} | Studio 37 Blog`,
    description: post.meta_description || post.excerpt || 'Studio 37 Photography Blog'
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()
  
  if (!post) {
    notFound()
  }
  
  // Get related posts
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, published_at')
    .eq('published', true)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)
  
  return (
    <div className="min-h-screen pt-16">
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
            <div className="flex items-center mr-6 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {post.published_at 
                  ? new Date(post.published_at).toLocaleDateString() 
                  : new Date(post.created_at || Date.now()).toLocaleDateString()
                }
              </span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center flex-wrap">
                <Tag className="h-4 w-4 mr-2" />
                {post.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-200 px-2 py-1 rounded mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {post.featured_image && (
        <div className="container mx-auto px-4 py-6">
          <div className="relative h-96 w-full">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {post.excerpt && (
            <div className="text-xl text-gray-600 mb-8 italic border-l-4 border-primary-500 pl-4 py-2">
              {post.excerpt}
            </div>
          )}
          
          <article className="prose lg:prose-lg max-w-none">
            <MDXRemote 
              source={post.content}
              options={{
                mdxOptions: {
                  rehypePlugins: [[rehypeHighlight, {}] as any]
                }
              }}
            />
          </article>
          
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(relatedPost.published_at).toLocaleDateString()}
                    </p>
                    <h4 className="font-bold hover:text-primary-600 transition-colors">
                      {relatedPost.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
