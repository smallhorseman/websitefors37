import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Calendar, User, Tag } from 'lucide-react'

export const metadata = {
  title: 'Blog | Studio 37 Photography',
  description: 'Photography tips, insights, and inspiration from our professional team at Studio 37 Photography.',
}

export default async function BlogPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  
  return (
    <div className="min-h-screen pt-16">
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-3">Studio 37 Blog</h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            Photography insights, tips, and inspiration to help you capture life's precious moments.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
            <p className="text-gray-600 mt-2">We're working on some amazing content for you.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56">
                  <Image
                    src={post.featured_image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center flex-wrap">
                      <Tag className="h-4 w-4 text-primary-600 mr-2" />
                      {post.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
