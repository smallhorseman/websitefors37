import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createLogger } from '@/lib/logger'

export const runtime = 'edge'

const log = createLogger('api/ai/generate-seo')

interface SEOSuggestions {
  titles: string[]
  metaDescription: string
  keywords: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { content, currentTitle, currentMeta } = await request.json()

    if (!content || content.trim().length < 50) {
      log.warn('Content too short', { length: content?.trim().length || 0 });
      return NextResponse.json(
        { error: 'Content must be at least 50 characters' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (!apiKey) {
      log.error('Missing API key', { env: 'GEMINI_API_KEY or GOOGLE_API_KEY' });
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY or GOOGLE_API_KEY in your environment variables.' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

    // Strip HTML tags and limit content length for the prompt
    const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000)

    const prompt = `You are an SEO expert specializing in local photography businesses. Analyze this page content and generate SEO recommendations.

Content:
${cleanContent}

Current Title: ${currentTitle || 'None'}
Current Meta Description: ${currentMeta || 'None'}

Generate:
1. Three compelling, SEO-optimized title options (max 60 characters each)
   - Include relevant keywords naturally
   - Focus on local SEO (Pinehurst, TX / Houston area / Montgomery County)
   - Make them click-worthy and professional
   
2. One meta description (150-160 characters)
   - Summarize the page value proposition
   - Include a call-to-action
   - Incorporate location and service keywords
   
3. 8-12 relevant keywords/phrases
   - Mix of broad and long-tail keywords
   - Include local SEO terms
   - Photography service-specific terms

Format your response as valid JSON:
{
  "titles": ["title 1", "title 2", "title 3"],
  "metaDescription": "description here",
  "keywords": ["keyword1", "keyword2", ...]
}

Respond ONLY with the JSON object, no other text.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '').trim()
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '').trim()
    }

    const suggestions: SEOSuggestions = JSON.parse(jsonText)

    // Validate response structure
    if (!suggestions.titles || !Array.isArray(suggestions.titles) || suggestions.titles.length === 0) {
      throw new Error('Invalid response: missing titles')
    }
    if (!suggestions.metaDescription || typeof suggestions.metaDescription !== 'string') {
      throw new Error('Invalid response: missing metaDescription')
    }
    if (!suggestions.keywords || !Array.isArray(suggestions.keywords)) {
      throw new Error('Invalid response: missing keywords')
    }

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error: any) {
    log.error('SEO generation failed', undefined, error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate SEO suggestions',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
