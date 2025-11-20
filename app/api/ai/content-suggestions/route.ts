/**
 * AI Content Suggestions API
 * 
 * Real-time SEO and content quality analysis
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/ai-client";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/ai/content-suggestions");

const BodySchema = z.object({
  content: z.string().min(50).max(20000),
  targetKeywords: z.array(z.string()).optional(),
});

interface ContentAnalysis {
  seoScore: number;
  suggestions: string[];
  keywords: Array<{
    target: string;
    count: number;
    density: number;
    ideal: number;
  }>;
  readability: {
    grade: number;
    score: number;
    difficulty: "easy" | "medium" | "hard";
  };
  titleSuggestions: string[];
  metaSuggestions: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - more generous for content editing
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`content-suggest:${ip}`, { limit: 30, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { content, targetKeywords = [] } = parsed.data;

    // Calculate basic metrics
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);

    // Simple readability calculation (Flesch Reading Ease approximation)
    const syllables = content.split(/\s+/).reduce((acc, word) => {
      return acc + Math.max(1, word.length / 3);
    }, 0);
    const avgSyllablesPerWord = syllables / Math.max(wordCount, 1);
    const readabilityScore = Math.round(
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
    );

    // Grade level calculation
    const gradeLevel = Math.round(
      0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
    );

    // Keyword analysis
    const keywordAnalysis = targetKeywords.map(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = content.match(regex) || [];
      const count = matches.length;
      const density = count / wordCount;
      const ideal = 0.01; // 1% ideal density

      return {
        target: keyword,
        count,
        density,
        ideal,
      };
    });

    // AI-powered analysis
    const prompt = `Analyze this content for SEO and quality. Provide actionable suggestions.

Content (${wordCount} words):
${content.slice(0, 2000)}

Target Keywords: ${targetKeywords.join(", ") || "None specified"}

Provide analysis as JSON:
{
  "seoScore": 0-100 (overall SEO quality),
  "suggestions": ["specific improvement 1", "specific improvement 2", "up to 8 suggestions"],
  "titleSuggestions": ["SEO title 1 (50-60 chars)", "SEO title 2", "SEO title 3"],
  "metaSuggestions": ["meta description 1 (150-160 chars)", "meta description 2"]
}

Focus suggestions on:
- Keyword usage and placement
- Content structure (headings, paragraphs)
- Engaging writing style
- Call-to-action opportunities
- Internal linking suggestions
- Mobile readability
- Photography business context

Keep suggestions specific, actionable, and prioritized by impact.`;

    const aiAnalysis = await generateJSON<{
      seoScore: number;
      suggestions: string[];
      titleSuggestions: string[];
      metaSuggestions: string[];
    }>(prompt, {
      config: "creative",
    });

    const result: ContentAnalysis = {
      seoScore: aiAnalysis.seoScore,
      suggestions: aiAnalysis.suggestions,
      keywords: keywordAnalysis,
      readability: {
        grade: Math.max(1, Math.min(gradeLevel, 18)),
        score: Math.max(0, Math.min(readabilityScore, 100)),
        difficulty: readabilityScore >= 70 ? "easy" : readabilityScore >= 50 ? "medium" : "hard",
      },
      titleSuggestions: aiAnalysis.titleSuggestions,
      metaSuggestions: aiAnalysis.metaSuggestions,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    log.error("Content analysis failed", undefined, error);
    return NextResponse.json(
      { error: error?.message || "Content analysis failed" },
      { status: 500 }
    );
  }
}
