'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Save, Eye, RefreshCcw, AlertTriangle } from 'lucide-react'
import VisualEditor from '@/components/VisualEditor'
import type { PageComponent } from '@/types/page-builder'
import { revalidateContent } from '@/lib/revalidate'

/**
 * Edit Live Homepage
 * This editor loads the ACTUAL live homepage and publishes changes directly to content_pages
 * Changes are immediately visible to visitors after publishing
 */
export default function EditLiveHomepage() {
  const [components, setComponents] = useState<PageComponent[]>([])
  const [originalComponents, setOriginalComponents] = useState<PageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadLiveHomepage()
  }, [])

  useEffect(() => {
    const changed = JSON.stringify(components) !== JSON.stringify(originalComponents)
    setHasChanges(changed)
  }, [components, originalComponents])

  const loadLiveHomepage = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      // Check if published homepage exists in content_pages
      const { data: publishedPage, error: publishedError } = await supabase
        .from('content_pages')
        .select('content')
        .eq('slug', 'home')
        .eq('published', true)
        .maybeSingle()

      if (publishedError && publishedError.code !== 'PGRST116') {
        throw publishedError
      }

      let loadedComponents: PageComponent[] = []

      if (publishedPage?.content) {
        // Parse existing MDX from content_pages
        console.log('Loading from published content_pages')
        loadedComponents = mdxToComponents(publishedPage.content)
      } else {
        // Create components matching the static homepage in app/page.tsx
        console.log('Creating components from static homepage')
        loadedComponents = createStaticHomepageComponents()
      }

      setComponents(loadedComponents)
      setOriginalComponents(JSON.parse(JSON.stringify(loadedComponents)))
      setMessage({
        type: 'success',
        text: `Loaded ${loadedComponents.length} components from ${publishedPage ? 'published page' : 'static homepage'}`
      })
    } catch (e: any) {
      console.error('Load error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to load homepage' })
      
      // Fallback to static homepage
      const fallback = createStaticHomepageComponents()
      setComponents(fallback)
      setOriginalComponents(JSON.parse(JSON.stringify(fallback)))
    } finally {
      setLoading(false)
    }
  }

  // Create components matching app/page.tsx static homepage
  const createStaticHomepageComponents = (): PageComponent[] => {
    return [
      {
        id: 'hero-live',
        type: 'hero',
        data: {
          title: 'Studio 37',
          subtitle: 'Capturing your precious moments with artistic excellence and professional craftsmanship',
          backgroundImage: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg',
          buttonText: 'Book Your Session',
          buttonLink: '/book-a-session',
          secondaryButtonText: 'View Portfolio',
          secondaryButtonLink: '/gallery',
          alignment: 'center',
          overlay: 50,
          titleColor: 'text-white',
          subtitleColor: 'text-amber-50',
          buttonStyle: 'primary',
          fullBleed: true,
        }
      },
      {
        id: 'portrait-gallery-live',
        type: 'galleryHighlights',
        data: {
          categories: ['Portrait'],
          featuredOnly: true,
          limit: 6,
          sortBy: 'display_order',
          sortDir: 'asc',
        }
      },
      {
        id: 'services-live',
        type: 'servicesGrid',
        data: {
          heading: 'Our Photography Services',
          subheading: 'From intimate portraits to grand celebrations, we offer comprehensive photography services tailored to your unique needs.',
          services: [
            {
              title: 'Wedding Photography',
              description: 'Capture your special day with romantic and timeless images that tell your love story.',
              icon: 'heart',
              link: '/services/wedding-photography',
            },
            {
              title: 'Portrait Sessions',
              description: 'Professional headshots, family portraits, and individual sessions in studio or on location.',
              icon: 'users',
              link: '/services/portrait-photography',
            },
            {
              title: 'Event Photography',
              description: 'Document your corporate events, parties, and celebrations with candid and posed shots.',
              icon: 'camera',
              link: '/services/event-photography',
            },
            {
              title: 'Commercial Photography',
              description: 'Product photography, business headshots, and marketing materials for your brand.',
              icon: 'briefcase',
              link: '/services/commercial-photography',
            }
          ],
          columns: 4,
        }
      },
      {
        id: 'commercial-gallery-live',
        type: 'galleryHighlights',
        data: {
          heading: 'Commercial Photography Showcase',
          subheading: 'Professional photography solutions that elevate your brand, showcase your products, and tell your business story with compelling visual content.',
          categories: ['Commercial'],
          featuredOnly: true,
          limit: 6,
          sortBy: 'display_order',
          sortDir: 'asc',
        }
      },
      {
        id: 'cta-live',
        type: 'ctaBanner',
        data: {
          heading: 'Ready to Capture Your Story?',
          subheading: "Let's discuss your photography needs and create something beautiful together.",
          primaryButtonText: 'Get Your Quote',
          primaryButtonLink: '/book-a-session',
          backgroundColor: '#f9fafb',
          textColor: 'text-gray-900',
        }
      },
      {
        id: 'testimonials-live',
        type: 'testimonials',
        data: {
          heading: 'What Our Clients Say',
          subheading: "Don't just take our word for it. Here's what our satisfied clients have to say about their experience with Studio 37.",
          style: 'cards',
          autoplay: true,
          interval: 5000,
          items: [
            {
              text: 'Studio 37 captured our wedding day perfectly! The photos are absolutely stunning and we couldn\'t be happier with the results. Professional, creative, and a joy to work with.',
              author: 'Sarah & Michael Johnson',
              role: 'Wedding Photography',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
              rating: 5,
            },
            {
              text: 'Outstanding professional headshots for our entire team. The photographer made everyone feel comfortable and the results exceeded our expectations. Highly recommend!',
              author: 'David Chen',
              role: 'Corporate Headshots',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              rating: 5,
            },
            {
              text: 'Amazing experience! They captured our family\'s personality beautifully. The session was fun and relaxed, and we now have gorgeous photos we\'ll treasure forever.',
              author: 'Emily Rodriguez',
              role: 'Family Portraits',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
              rating: 5,
            }
          ]
        }
      }
    ]
  }

  // Parse MDX to components (simplified version)
  const mdxToComponents = (mdx: string): PageComponent[] => {
    const comps: PageComponent[] = []
    const blockRegex = /<(\w+Block)\s+([^>]+)\/>/g
    let match

    while ((match = blockRegex.exec(mdx)) !== null) {
      const blockName = match[1]
      const attrsStr = match[2]
      
      // Parse attributes
      const attrs: Record<string, any> = {}
      const attrRegex = /(\w+)="([^"]*)"/g
      let attrMatch
      
      while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
        const key = attrMatch[1]
        let value: any = attrMatch[2]
        
        // Try to decode base64 for complex objects
        try {
          if (value.match(/^[A-Za-z0-9+/=]+$/)) {
            const decoded = Buffer.from(value, 'base64').toString('utf-8')
            value = JSON.parse(decoded)
          }
        } catch {
          // Keep as string if not valid base64/JSON
        }
        
        attrs[key] = value
      }

      // Determine component type from block name
      const type = blockName.replace('Block', '').toLowerCase()
      
      comps.push({
        id: `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: type as any,
        data: attrs
      })
    }

    return comps
  }

  // Publish changes to live site
  const publishToLive = async () => {
    if (components.length === 0) {
      setMessage({ type: 'warning', text: 'No components to publish' })
      return
    }

    const confirmed = window.confirm(
      '⚠️ PUBLISH TO LIVE SITE?\n\nThis will immediately update your homepage for all visitors.\n\nAre you sure?'
    )
    if (!confirmed) return

    setSaving(true)
    setMessage(null)

    try {
      // Convert components to MDX
      const mdxContent = components.map(comp => {
        const { type, data } = comp
        const attrs = Object.entries(data)
          .map(([k, v]) => {
            if (v === undefined || v === null) return ''
            if (typeof v === 'object') {
              return `${k}="${Buffer.from(JSON.stringify(v)).toString('base64')}"`
            }
            return `${k}="${String(v).replace(/"/g, '&quot;').replace(/'/g, '&#39;')}"`
          })
          .filter(Boolean)
          .join(' ')
        
        const blockName = type.charAt(0).toUpperCase() + type.slice(1) + 'Block'
        return `<${blockName} ${attrs} />`
      }).join('\n\n')

      // Save to content_pages with published=true
      const { error } = await supabase
        .from('content_pages')
        .upsert({
          slug: 'home',
          title: 'Home - Studio 37 Photography',
          content: mdxContent,
          published: true,
        }, { onConflict: 'slug' })

      if (error) throw error

      setOriginalComponents(JSON.parse(JSON.stringify(components)))
      setMessage({ 
        type: 'success', 
        text: '🎉 Homepage published! Changes are now LIVE for all visitors.' 
      })

      // Trigger revalidation to clear cache
      try {
        await revalidateContent('/')
      } catch (revalError) {
        console.warn('Revalidation warning:', revalError)
      }
    } catch (e: any) {
      console.error('Publish error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to publish to live site' })
    } finally {
      setSaving(false)
    }
  }

  const revertChanges = () => {
    setComponents(JSON.parse(JSON.stringify(originalComponents)))
    setMessage({ type: 'success', text: 'Changes reverted' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🏠 Edit Live Homepage
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Edit your homepage directly. Changes publish immediately to visitors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadLiveHomepage}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
              title="Reload from live site"
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Reload
            </button>

            {hasChanges && (
              <button
                onClick={revertChanges}
                className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Revert Changes
              </button>
            )}

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>

            <button
              onClick={publishToLive}
              disabled={!hasChanges || saving || loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg font-semibold"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Publishing...' : 'Publish to Live Site'}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {hasChanges && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Unsaved changes:</strong> Click "Publish to Live Site" to make your changes visible to visitors.
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`mx-6 mt-4 rounded-lg border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden flex">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading homepage...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Visual Editor */}
            <div className={showPreview ? 'flex-1 border-r' : 'flex-1'}>
              <VisualEditor
                initialComponents={components}
                onSave={(comps) => {
                  setComponents(comps)
                }}
                onChange={setComponents}
                slug="home"
              />
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="w-1/2 bg-white flex flex-col">
                <div className="border-b px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700">Live Preview</h3>
                  <span className="text-xs text-gray-500">How visitors see it</span>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-gray-100">
                  <iframe
                    src="/"
                    className="w-full h-full bg-white rounded shadow"
                    title="Homepage Preview"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
