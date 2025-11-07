'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Zap,
  Eye,
  Smartphone,
  Monitor,
  Accessibility,
  RefreshCw,
  Download,
  TrendingUp,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

type AuditIssue = {
  id: string
  type: 'error' | 'warning' | 'info'
  category: 'content' | 'performance' | 'ux' | 'seo'
  title: string
  description: string
  page?: string
  recommendation?: string
  priority: 'high' | 'medium' | 'low'
}

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'performance' | 'ux'>('content')
  const [loading, setLoading] = useState(false)
  const [issues, setIssues] = useState<AuditIssue[]>([])
  const [stats, setStats] = useState({
    totalPages: 0,
    pagesWithIssues: 0,
    totalIssues: 0,
    highPriority: 0
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    runAudit()
  }, [activeTab])

  const runAudit = async () => {
    setLoading(true)
    setIssues([])

    try {
      if (activeTab === 'content') {
        await runContentAudit()
      } else if (activeTab === 'performance') {
        await runPerformanceAudit()
      } else if (activeTab === 'ux') {
        await runUXAudit()
      }
    } catch (e) {
      console.error('Audit error:', e)
    } finally {
      setLoading(false)
    }
  }

  const runContentAudit = async () => {
    const foundIssues: AuditIssue[] = []

    // Check content_pages
    const { data: pages } = await supabase
      .from('content_pages')
      .select('slug, title, content, meta_description, published')

    if (pages) {
      pages.forEach(page => {
        // Missing meta description
        if (!page.meta_description || page.meta_description.trim().length === 0) {
          foundIssues.push({
            id: `meta-${page.slug}`,
            type: 'warning',
            category: 'seo',
            title: 'Missing Meta Description',
            description: `Page "${page.title || page.slug}" has no meta description`,
            page: page.slug,
            recommendation: 'Add a compelling 150-160 character meta description for better SEO',
            priority: 'high'
          })
        }

        // Short meta description
        if (page.meta_description && page.meta_description.length < 120) {
          foundIssues.push({
            id: `meta-short-${page.slug}`,
            type: 'info',
            category: 'seo',
            title: 'Short Meta Description',
            description: `Meta description for "${page.title || page.slug}" is only ${page.meta_description.length} characters`,
            page: page.slug,
            recommendation: 'Meta descriptions should be 150-160 characters for optimal display',
            priority: 'low'
          })
        }

        // Long title
        if (page.title && page.title.length > 60) {
          foundIssues.push({
            id: `title-long-${page.slug}`,
            type: 'warning',
            category: 'seo',
            title: 'Long Page Title',
            description: `Title for "${page.slug}" is ${page.title.length} characters (recommended max: 60)`,
            page: page.slug,
            recommendation: 'Shorten title to prevent truncation in search results',
            priority: 'medium'
          })
        }

        // Missing content
        if (!page.content || page.content.trim().length < 100) {
          foundIssues.push({
            id: `content-thin-${page.slug}`,
            type: 'error',
            category: 'content',
            title: 'Thin Content',
            description: `Page "${page.slug}" has very little content (${page.content?.length || 0} chars)`,
            page: page.slug,
            recommendation: 'Add more substantial content (aim for 300+ words)',
            priority: 'high'
          })
        }

        // Check for broken image references in content
        if (page.content) {
          const imgMatches = page.content.match(/<img[^>]+src=["']([^"']+)["']/g)
          if (imgMatches) {
            imgMatches.forEach(match => {
              const srcMatch = match.match(/src=["']([^"']+)["']/)
              if (srcMatch && srcMatch[1].startsWith('http')) {
                foundIssues.push({
                  id: `img-check-${page.slug}-${Math.random()}`,
                  type: 'info',
                  category: 'content',
                  title: 'External Image Reference',
                  description: `Page "${page.slug}" references external image: ${srcMatch[1].substring(0, 50)}...`,
                  page: page.slug,
                  recommendation: 'Consider hosting images locally for better performance and reliability',
                  priority: 'low'
                })
              }
            })
          }
        }

        // Unpublished pages
        if (!page.published) {
          foundIssues.push({
            id: `unpublished-${page.slug}`,
            type: 'info',
            category: 'content',
            title: 'Unpublished Page',
            description: `Page "${page.title || page.slug}" is not published`,
            page: page.slug,
            recommendation: 'Review and publish if ready, or delete if no longer needed',
            priority: 'low'
          })
        }
      })
    }

    // Check blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, content, published')

    if (posts) {
      posts.forEach(post => {
        if (!post.excerpt || post.excerpt.length < 100) {
          foundIssues.push({
            id: `blog-excerpt-${post.slug}`,
            type: 'warning',
            category: 'content',
            title: 'Missing/Short Blog Excerpt',
            description: `Blog post "${post.title}" has short or missing excerpt`,
            page: `/blog/${post.slug}`,
            recommendation: 'Add a compelling 150-200 character excerpt',
            priority: 'medium'
          })
        }

        if (!post.published) {
          foundIssues.push({
            id: `blog-unpublished-${post.slug}`,
            type: 'info',
            category: 'content',
            title: 'Unpublished Blog Post',
            description: `"${post.title}" is in draft status`,
            page: `/blog/${post.slug}`,
            recommendation: 'Publish when ready or delete if outdated',
            priority: 'low'
          })
        }
      })
    }

    // Check gallery images
    const { data: images } = await supabase
      .from('gallery_images')
      .select('id, title, alt_text, url')

    if (images) {
      images.forEach(img => {
        if (!img.alt_text || img.alt_text.trim().length === 0) {
          foundIssues.push({
            id: `img-alt-${img.id}`,
            type: 'error',
            category: 'content',
            title: 'Missing Alt Text',
            description: `Gallery image "${img.title || img.id}" has no alt text`,
            recommendation: 'Add descriptive alt text for accessibility and SEO',
            priority: 'high'
          })
        }

        if (img.alt_text && img.alt_text.length < 10) {
          foundIssues.push({
            id: `img-alt-short-${img.id}`,
            type: 'warning',
            category: 'content',
            title: 'Short Alt Text',
            description: `Image "${img.title || img.id}" has very short alt text`,
            recommendation: 'Alt text should be descriptive (aim for 10-125 characters)',
            priority: 'medium'
          })
        }
      })
    }

    setIssues(foundIssues)
    updateStats(foundIssues)
  }

  const runPerformanceAudit = async () => {
    const foundIssues: AuditIssue[] = []

    // Check gallery images for optimization
    const { data: images } = await supabase
      .from('gallery_images')
      .select('id, title, url, file_size')

    if (images) {
      images.forEach(img => {
        // Large file size warning
        if (img.file_size && img.file_size > 500000) { // 500KB
          foundIssues.push({
            id: `img-size-${img.id}`,
            type: 'warning',
            category: 'performance',
            title: 'Large Image File',
            description: `Image "${img.title || img.id}" is ${Math.round(img.file_size / 1024)}KB`,
            recommendation: 'Compress image or convert to WebP format for faster loading',
            priority: img.file_size > 1000000 ? 'high' : 'medium'
          })
        }

        // Check if using modern formats
        if (img.url && !img.url.includes('.webp') && !img.url.includes('.avif')) {
          foundIssues.push({
            id: `img-format-${img.id}`,
            type: 'info',
            category: 'performance',
            title: 'Image Format Optimization',
            description: `Consider converting "${img.title || img.id}" to WebP or AVIF`,
            recommendation: 'Modern formats reduce file size by 25-35% without quality loss',
            priority: 'low'
          })
        }
      })
    }

    // Check for potential performance issues in content
    const { data: pages } = await supabase
      .from('content_pages')
      .select('slug, title, content')

    if (pages) {
      pages.forEach(page => {
        if (page.content) {
          // Count inline scripts
          const scriptCount = (page.content.match(/<script/gi) || []).length
          if (scriptCount > 0) {
            foundIssues.push({
              id: `scripts-${page.slug}`,
              type: 'warning',
              category: 'performance',
              title: 'Inline Scripts Detected',
              description: `Page "${page.title || page.slug}" has ${scriptCount} inline script(s)`,
              page: page.slug,
              recommendation: 'Move scripts to external files for better caching',
              priority: 'medium'
            })
          }

          // Count images
          const imgCount = (page.content.match(/<img/gi) || []).length
          if (imgCount > 10) {
            foundIssues.push({
              id: `img-count-${page.slug}`,
              type: 'info',
              category: 'performance',
              title: 'Many Images on Page',
              description: `Page "${page.slug}" contains ${imgCount} images`,
              page: page.slug,
              recommendation: 'Consider lazy loading images below the fold',
              priority: 'low'
            })
          }
        }
      })
    }

    // Generic performance recommendations
    foundIssues.push({
      id: 'perf-cdn',
      type: 'info',
      category: 'performance',
      title: 'CDN Usage',
      description: 'Verify all static assets are served via CDN',
      recommendation: 'Use Cloudinary for images and Netlify CDN for static files',
      priority: 'medium'
    })

    foundIssues.push({
      id: 'perf-cache',
      type: 'info',
      category: 'performance',
      title: 'Cache Headers',
      description: 'Ensure proper cache headers are set for static assets',
      recommendation: 'Configure long cache TTL (1 year) for versioned assets',
      priority: 'low'
    })

    setIssues(foundIssues)
    updateStats(foundIssues)
  }

  const runUXAudit = async () => {
    const foundIssues: AuditIssue[] = []

    // Check navigation
    const { data: settings } = await supabase
      .from('settings')
      .select('navigation_items')
      .single()

    if (settings?.navigation_items) {
      const navItems = settings.navigation_items as any[]
      
      if (navItems.length === 0) {
        foundIssues.push({
          id: 'nav-empty',
          type: 'error',
          category: 'ux',
          title: 'No Navigation Items',
          description: 'Your site navigation is empty',
          recommendation: 'Add navigation menu items in the Navigation Editor',
          priority: 'high'
        })
      }

      if (navItems.length > 8) {
        foundIssues.push({
          id: 'nav-many',
          type: 'warning',
          category: 'ux',
          title: 'Too Many Navigation Items',
          description: `You have ${navItems.length} menu items (recommended: 5-7)`,
          recommendation: 'Consider grouping items or using a mega menu',
          priority: 'medium'
        })
      }

      const highlighted = navItems.filter(item => item.highlighted)
      if (highlighted.length === 0) {
        foundIssues.push({
          id: 'nav-no-cta',
          type: 'info',
          category: 'ux',
          title: 'No Primary CTA',
          description: 'No navigation item is highlighted as a call-to-action',
          recommendation: 'Highlight your most important action (e.g., "Book Now", "Contact")',
          priority: 'low'
        })
      }

      if (highlighted.length > 2) {
        foundIssues.push({
          id: 'nav-many-cta',
          type: 'warning',
          category: 'ux',
          title: 'Too Many Highlighted CTAs',
          description: `${highlighted.length} menu items are highlighted (recommended: 1-2)`,
          recommendation: 'Limit highlights to your most important actions',
          priority: 'medium'
        })
      }
    }

    // Check for accessibility issues
    const { data: pages } = await supabase
      .from('content_pages')
      .select('slug, title, content')

    if (pages) {
      pages.forEach(page => {
        if (page.content) {
          // Check for heading structure
          const h1Count = (page.content.match(/<h1/gi) || []).length
          if (h1Count === 0) {
            foundIssues.push({
              id: `h1-missing-${page.slug}`,
              type: 'warning',
              category: 'ux',
              title: 'Missing H1 Heading',
              description: `Page "${page.slug}" has no H1 heading`,
              page: page.slug,
              recommendation: 'Add exactly one H1 heading for better SEO and accessibility',
              priority: 'high'
            })
          }

          if (h1Count > 1) {
            foundIssues.push({
              id: `h1-multiple-${page.slug}`,
              type: 'warning',
              category: 'ux',
              title: 'Multiple H1 Headings',
              description: `Page "${page.slug}" has ${h1Count} H1 headings`,
              page: page.slug,
              recommendation: 'Use only one H1 per page; use H2-H6 for subheadings',
              priority: 'medium'
            })
          }

          // Check for images without alt
          const imgsWithoutAlt = (page.content.match(/<img(?![^>]*alt=)/gi) || []).length
          if (imgsWithoutAlt > 0) {
            foundIssues.push({
              id: `img-no-alt-${page.slug}`,
              type: 'error',
              category: 'ux',
              title: 'Images Without Alt Text',
              description: `${imgsWithoutAlt} image(s) on "${page.slug}" lack alt attributes`,
              page: page.slug,
              recommendation: 'Add alt text to all images for screen readers',
              priority: 'high'
            })
          }

          // Check for links without descriptive text
          const linkMatches = page.content.match(/<a[^>]*>([^<]+)<\/a>/gi)
          if (linkMatches) {
            linkMatches.forEach(link => {
              const textMatch = link.match(/>([^<]+)</)
              if (textMatch && (textMatch[1].toLowerCase() === 'click here' || textMatch[1].toLowerCase() === 'here' || textMatch[1].toLowerCase() === 'read more')) {
                foundIssues.push({
                  id: `link-generic-${page.slug}-${Math.random()}`,
                  type: 'info',
                  category: 'ux',
                  title: 'Generic Link Text',
                  description: `Page "${page.slug}" has links with generic text like "${textMatch[1]}"`,
                  page: page.slug,
                  recommendation: 'Use descriptive link text (e.g., "View our portfolio" instead of "click here")',
                  priority: 'low'
                })
              }
            })
          }
        }
      })
    }

    // General UX recommendations
    foundIssues.push({
      id: 'ux-mobile',
      type: 'info',
      category: 'ux',
      title: 'Mobile Responsiveness',
      description: 'Ensure all pages are tested on mobile devices',
      recommendation: 'Use Chrome DevTools mobile simulator or test on real devices',
      priority: 'medium'
    })

    foundIssues.push({
      id: 'ux-contrast',
      type: 'info',
      category: 'ux',
      title: 'Color Contrast',
      description: 'Verify text meets WCAG AA contrast requirements (4.5:1)',
      recommendation: 'Use tools like WebAIM Contrast Checker to validate colors',
      priority: 'medium'
    })

    foundIssues.push({
      id: 'ux-forms',
      type: 'info',
      category: 'ux',
      title: 'Form Accessibility',
      description: 'Ensure all form inputs have associated labels',
      recommendation: 'Add aria-label or label elements to all form fields',
      priority: 'low'
    })

    setIssues(foundIssues)
    updateStats(foundIssues)
  }

  const updateStats = (foundIssues: AuditIssue[]) => {
    const pages = new Set(foundIssues.map(i => i.page).filter(Boolean))
    const high = foundIssues.filter(i => i.priority === 'high')

    setStats({
      totalPages: pages.size,
      pagesWithIssues: pages.size,
      totalIssues: foundIssues.length,
      highPriority: high.length
    })
  }

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      category: activeTab,
      stats,
      issues
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-${activeTab}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (type: AuditIssue['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (type: AuditIssue['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      case 'info': return <AlertCircle className="h-5 w-5" />
      default: return <CheckCircle className="h-5 w-5" />
    }
  }

  const getPriorityBadge = (priority: AuditIssue['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return (
      <span className={`px-2 py-0.5 text-xs rounded border ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="h-6 w-6 text-amber-600" />
                Site Audit
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Analyze content, performance, and user experience
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runAudit}
                disabled={loading}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Scanning...' : 'Re-scan'}
              </button>

              <button
                onClick={exportReport}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Total Issues</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{stats.totalIssues}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">High Priority</div>
            <div className="text-3xl font-bold text-red-600 mt-1">{stats.highPriority}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Pages Checked</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPages}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Category</div>
            <div className="text-xl font-bold text-amber-600 mt-1 capitalize">{activeTab}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content Audit
                </div>
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'performance'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance
                </div>
              </button>
              <button
                onClick={() => setActiveTab('ux')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'ux'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  UX & Accessibility
                </div>
              </button>
            </div>
          </div>

          {/* Issues List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
                <p className="text-gray-600">Scanning your site...</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Issues Found!</h3>
                <p className="text-gray-600">
                  Your {activeTab} audit looks great. Keep up the good work!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map(issue => (
                  <div
                    key={issue.id}
                    className={`border rounded-lg p-4 ${getSeverityColor(issue.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(issue.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <h3 className="font-semibold">{issue.title}</h3>
                          {getPriorityBadge(issue.priority)}
                        </div>
                        <p className="text-sm mb-2">{issue.description}</p>
                        {issue.page && (
                          <div className="text-sm mb-2 flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            <span className="font-mono text-xs">{issue.page}</span>
                          </div>
                        )}
                        {issue.recommendation && (
                          <div className="text-sm bg-white/50 rounded p-2 mt-2">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
