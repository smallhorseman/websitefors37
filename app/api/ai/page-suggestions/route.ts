import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createLogger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const runtime = 'edge'

const log = createLogger('api/ai/page-suggestions')

type ComponentType =
  | 'hero'
  | 'text'
  | 'image'
  | 'button'
  | 'columns'
  | 'spacer'
  | 'seoFooter'
  | 'slideshowHero'
  | 'testimonials'
  | 'galleryHighlights'
  | 'widgetEmbed'
  | 'badges'
  | 'servicesGrid'
  | 'stats'
  | 'ctaBanner'
  | 'iconFeatures'
  | 'logo'
  | 'contactForm'
  | 'newsletterSignup'
  | 'faq'
  | 'pricingTable'
  | 'teamMembers'
  | 'socialFeed'
  | 'dualCTA'
  | 'tabs'
  | 'videoHero'
  | 'beforeAfter'
  | 'photoGrid'
  | 'audioPlayer'
  | 'viewer360'
  | 'pdfEmbed'
  | 'reviews'
  | 'instagramFeed'
  | 'clientPortal'
  | 'stickyCTA'
  | 'countdown'
  | 'progressSteps'
  | 'calendarWidget'
  | 'trustBadges'
  | 'exitPopup'
  | 'timeline'
  | 'comparisonTable'
  | 'blogCards'
  | 'categoryNav'
  | 'breadcrumbs'
  | 'tableOfContents'
  | 'relatedContent'
  | 'mapEmbed'
  | 'quiz'
  | 'calculator'
  | 'lightbox'
  | 'enhancedTabs'
  | 'alertBanner'
  | 'logoCarousel'
  | 'liveCounter'
  | 'bookingsTicker'

type PageComponent = {
  id: string
  type: ComponentType
  data?: Record<string, any>
}

type AISuggestion = {
  type: ComponentType
  title: string
  description: string
  rationale: string
  afterType?: ComponentType | null
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit per IP
    const ip = getClientIp(request.headers as any)
    const rl = rateLimit(`ai:page-suggestions:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      log.warn('Rate limit exceeded', { ip })
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again shortly.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) } }
      )
    }

    const { components, slug, maxSuggestions = 6 } = await request.json()
    if (!Array.isArray(components)) {
      return NextResponse.json(
        { error: 'Invalid body: components[] is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!apiKey) {
      log.error('Missing API key', { env: 'GEMINI_API_KEY or GOOGLE_API_KEY' })
      return NextResponse.json(
        { error: 'Gemini API key not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY.' },
        { status: 503 }
      )
    }

    // Summarize current layout for the model
    const allowedTypes: ComponentType[] = [
      'hero','text','image','button','columns','spacer','seoFooter','slideshowHero','testimonials','galleryHighlights','widgetEmbed','badges','servicesGrid','stats','ctaBanner','iconFeatures','logo','contactForm','newsletterSignup','faq','pricingTable','teamMembers','socialFeed','dualCTA','tabs','videoHero','beforeAfter','photoGrid','audioPlayer','viewer360','pdfEmbed','reviews','instagramFeed','clientPortal','stickyCTA','countdown','progressSteps','calendarWidget','trustBadges','exitPopup','timeline','comparisonTable','blogCards','categoryNav','breadcrumbs','tableOfContents','relatedContent','mapEmbed','quiz','calculator','lightbox','enhancedTabs','alertBanner','logoCarousel','liveCounter','bookingsTicker'
    ]

    const typeCounts = components.reduce((acc: Record<string, number>, c: PageComponent) => {
      acc[c.type] = (acc[c.type] || 0) + 1
      return acc
    }, {})

    const outline = components
      .map((c: PageComponent, i: number) => {
        let detail = ''
        try {
          if (c.type === 'hero' && c.data?.title) detail = ` title="${String(c.data.title).slice(0, 80)}"`
          if (c.type === 'ctaBanner' && c.data?.heading) detail = ` heading="${String(c.data.heading).slice(0, 80)}"`
          if (c.type === 'text' && c.data?.content) detail = ` content~="${String(c.data.content).replace(/<[^>]*>/g, ' ').slice(0, 80)}"`
          if (c.type === 'servicesGrid' && c.data?.heading) detail = ` heading="${String(c.data.heading).slice(0, 80)}"`
          if (c.type === 'faq' && c.data?.items?.length) detail = ` items=${c.data.items.length}`
          if (c.type === 'pricingTable' && c.data?.plans?.length) detail = ` plans=${c.data.plans.length}`
          if (c.type === 'testimonials' && c.data?.testimonials?.length) detail = ` testimonials=${c.data.testimonials.length}`
          if (c.type === 'galleryHighlights') detail = ` limit=${c.data?.limit ?? ''}`
        } catch {}
        return `${i + 1}. ${c.type}${detail}`
      })
      .join('\n')

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

    const prompt = `You are assisting a no-code page builder for a photography studio website.
Suggest up to ${Math.max(1, Math.min(10, Number(maxSuggestions) || 6))} new blocks to improve conversions, clarity, and SEO, based on the current layout.

Allowed block types: ${allowedTypes.join(', ')}
Current page slug: ${slug || 'unknown'}

Current layout outline (top to bottom):\n${outline}

Rules:
- Only use allowed block types.
- Avoid duplicates that already exist unless making a clear case for a variant.
- Provide a short, non-generic rationale for each suggestion.
- If a placement is appropriate right after an existing type, set afterType accordingly (e.g., after testimonials, servicesGrid, galleryHighlights). Otherwise omit it.

Respond ONLY with valid JSON array of objects with the shape:
[
  { "type": "ctaBanner", "title": "Add Call-to-Action", "description": "Convert trust to action.", "rationale": "Testimonials build trust; CTA drives conversion.", "afterType": "testimonials" }
]
`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Strip markdown fences if present
    let jsonText = text
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/i, '').replace(/```\s*$/i, '').trim()
    }

    let suggestions: AISuggestion[] = []
    try {
      const parsed = JSON.parse(jsonText)
      if (Array.isArray(parsed)) {
        suggestions = parsed
          .filter((s: any) => s && allowedTypes.includes(s.type))
          .slice(0, Math.max(1, Math.min(10, Number(maxSuggestions) || 6)))
          .map((s: any) => ({
            type: s.type,
            title: String(s.title || s.type),
            description: String(s.description || ''),
            rationale: String(s.rationale || ''),
            afterType: allowedTypes.includes(s.afterType) ? s.afterType : undefined,
          }))
      } else {
        throw new Error('Response is not an array')
      }
    } catch (err) {
      log.warn('Failed to parse AI suggestions JSON; returning empty', { textSample: text.slice(0, 200) })
      suggestions = []
    }

    return NextResponse.json({ success: true, suggestions })
  } catch (error: any) {
    log.error('Page suggestions generation failed', undefined, error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
