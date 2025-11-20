import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/ai-client'
import { createLogger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const log = createLogger('api/ai/block-suggestions')

/**
 * AI Block Suggestions API - Phase 5
 * 
 * Generates contextual block recommendations for page building using Gemini AI.
 * Analyzes page type, industry, and existing blocks to suggest complementary content blocks.
 */

interface BlockSuggestion {
  block: string
  props: Record<string, any>
  rationale: string
  category: 'hero' | 'content' | 'media' | 'social' | 'conversion'
}

interface SuggestionsRequest {
  pageType: string
  industry?: string
  currentBlocks?: string[]
  maxSuggestions?: number
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 requests per 5 minutes per IP
    const ip = getClientIp(request.headers)
    const rl = rateLimit(`ai-suggestions:${ip}`, { 
      limit: 10, 
      windowMs: 5 * 60 * 1000 
    })
    
    if (!rl.allowed) {
      log.warn('Rate limit exceeded', { ip })
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes.' },
        { status: 429 }
      )
    }

    // Parse and validate request
    const body: SuggestionsRequest = await request.json()
    const { 
      pageType, 
      industry = 'photography', 
      currentBlocks = [], 
      maxSuggestions = 4 
    } = body

    if (!pageType) {
      return NextResponse.json(
        { error: 'pageType is required' },
        { status: 400 }
      )
    }

    log.info('Generating block suggestions', { pageType, industry, currentBlocks })

    // Build AI prompt for block suggestions
    const prompt = `You are an expert web designer and UX consultant specializing in ${industry} business websites.

Task: Suggest ${maxSuggestions} complementary content blocks for a ${pageType} page.

Current blocks already on the page:
${currentBlocks.length > 0 ? currentBlocks.map(b => `- ${b}`).join('\n') : '- None yet'}

Available block types:
- HeroBlock: Full-screen hero with background image, title, subtitle, CTA buttons (variants: fullscreen, split, minimal, parallax)
- VideoHeroBlock: Video background hero with YouTube/Vimeo/direct video support
- TextBlock: Rich text content area with typography controls
- ImageBlock: Single image with caption, hover effects (zoom, lift, tilt)
- ServicesGridBlock: Grid of service cards with images, descriptions, features list
- StatsBlock: Statistics display with animated counters (styles: default, cards, minimal)
- CTABannerBlock: Call-to-action banner with background image and dual buttons
- GalleryBlock: Image gallery grid with lightbox
- TestimonialsBlock: Client testimonials carousel or grid
- FAQBlock: Frequently asked questions accordion
- ContactFormBlock: Lead capture form with customizable fields
- BeforeAfterSliderBlock: Interactive before/after image comparison slider
- TimelineBlock: Vertical timeline for company history or process steps (styles: default, modern, minimal)
- MasonryGalleryBlock: Pinterest-style image gallery with balanced columns
- AnimatedCounterStatsBlock: Stats that count up when scrolled into view
- InteractiveMapBlock: Google Maps embed with custom markers
- NewsletterBlock: Newsletter signup inline or modal

Guidelines:
1. Don't suggest blocks that are already present
2. Suggest blocks that naturally complement the page type
3. For ${pageType} pages in ${industry}, consider industry-specific best practices
4. Provide realistic, ready-to-use prop values
5. Explain WHY each block enhances the page

Return JSON array of ${maxSuggestions} suggestions in this format:
[
  {
    "block": "BlockName",
    "props": { "heading": "Example Heading", "other": "props" },
    "rationale": "Brief explanation of why this block fits",
    "category": "hero|content|media|social|conversion"
  }
]

Return ONLY valid JSON, no markdown or additional text.`

    // Generate suggestions with Gemini
    const response = await generateText(prompt, {
      temperature: 0.8, // Higher creativity for varied suggestions
      maxOutputTokens: 2000
    })

    // Parse AI response
    let suggestions: BlockSuggestion[]
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || 
                        response.match(/\[[\s\S]*\]/)
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response
      suggestions = JSON.parse(jsonStr)
    } catch (parseError) {
      log.error('Failed to parse AI response', { response, error: parseError })
      return NextResponse.json(
        { error: 'AI response format error. Please try again.' },
        { status: 500 }
      )
    }

    // Validate suggestions
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      log.error('Invalid suggestions format', { suggestions })
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      )
    }

    // Filter out invalid suggestions
    const validSuggestions = suggestions.filter(s => 
      s.block && 
      typeof s.block === 'string' && 
      s.props && 
      typeof s.props === 'object' &&
      s.rationale &&
      typeof s.rationale === 'string'
    ).slice(0, maxSuggestions)

    log.info('Successfully generated suggestions', { 
      count: validSuggestions.length,
      blocks: validSuggestions.map(s => s.block)
    })

    return NextResponse.json({
      success: true,
      suggestions: validSuggestions,
      meta: {
        pageType,
        industry,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    log.error('Block suggestions error', { error: error.message })
    
    return NextResponse.json(
      { 
        error: 'Failed to generate suggestions. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// GET method to check API health
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Block Suggestions',
    version: '1.0.0',
    model: process.env.GOOGLE_GENAI_MODEL || 'gemini-3-pro-preview'
  })
}
