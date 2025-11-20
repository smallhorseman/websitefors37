/**
 * AI-Powered Gallery Image Analysis
 * 
 * Uses Gemini 2.0 Flash Vision to:
 * - Generate optimized alt text
 * - Auto-detect categories
 * - Suggest relevant tags
 * - Assess image quality
 * - Extract color palettes
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeImage, generateJSON } from "@/lib/ai-client";
import { supabase } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const log = createLogger("api/gallery/analyze");

const BodySchema = z.object({
  imageId: z.string().uuid().optional(),
  imageUrl: z.string().url(),
  context: z.object({
    title: z.string().optional(),
    existingCategory: z.string().optional(),
    existingTags: z.array(z.string()).optional(),
  }).optional(),
});

interface ImageAnalysis {
  altText: string;
  suggestedCategory: "wedding" | "portrait" | "event" | "commercial" | "general";
  suggestedTags: string[];
  qualityScore: number; // 0-100
  qualityNotes: string[];
  dominantColors: string[];
  composition: {
    subject: string;
    lighting: string;
    mood: string;
    setting: string;
  };
  seoKeywords: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`image-analyze:${ip}`, { limit: 20, windowMs: 60 * 1000 });
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

    const { imageId, imageUrl, context } = parsed.data;

    // Fetch image and convert to base64
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 400 }
      );
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Comprehensive image analysis prompt
    const prompt = `Analyze this photography portfolio image comprehensively. This is for Studio37 Photography, specializing in weddings, portraits, events, and commercial work.

${context ? `
Existing Context:
- Title: ${context.title || "None"}
- Category: ${context.existingCategory || "None"}
- Tags: ${context.existingTags?.join(", ") || "None"}
` : ""}

Provide a detailed analysis as JSON:
{
  "altText": "SEO-optimized alt text (under 125 chars, descriptive, keyword-rich)",
  "suggestedCategory": "wedding|portrait|event|commercial|general (best fit category)",
  "suggestedTags": ["relevant", "specific", "seo", "tags", "max 8"],
  "qualityScore": 0-100 (technical quality assessment),
  "qualityNotes": ["specific quality observation 1", "observation 2"],
  "dominantColors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "composition": {
    "subject": "what/who is the main subject",
    "lighting": "natural/studio/golden-hour/etc and quality",
    "mood": "romantic/professional/candid/dramatic/etc",
    "setting": "indoor/outdoor location description"
  },
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Quality Scoring Criteria:
- Technical: Focus, exposure, color balance
- Composition: Rule of thirds, leading lines, framing
- Lighting: Quality, direction, mood creation
- Subject: Expression, posing, engagement
- Post-processing: Natural vs over-edited

Tags should be:
- Specific to the image content
- Mix of technical and descriptive
- SEO-friendly (what people search for)
- Photography industry terms

Alt text should:
- Describe the image accurately
- Include relevant keywords naturally
- Be concise but informative
- Help visually impaired users understand the image

Return ONLY valid JSON.`;

    const analysis = await generateJSON<ImageAnalysis>(prompt, {
      // Use default model (env-configurable, Gemini 3 Pro Preview by default)
      config: "creative",
    });

    // Update image in database if imageId provided
    if (imageId) {
      await supabase
        .from("gallery_images")
        .update({
          alt_text: analysis.altText,
          category: analysis.suggestedCategory,
          tags: analysis.suggestedTags,
          ai_analysis: analysis,
          last_analyzed_at: new Date().toISOString(),
        })
        .eq("id", imageId);
      
      log.info("Image analyzed and updated", { imageId });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    log.error("Image analysis failed", undefined, error);
    return NextResponse.json(
      { error: error?.message || "Image analysis failed" },
      { status: 500 }
    );
  }
}

// Batch analyze gallery images
export async function PUT(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`batch-analyze:${ip}`, { limit: 2, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many batch requests" },
        { status: 429 }
      );
    }

    // Fetch images without alt text or analysis
    const { data: images } = await supabase
      .from("gallery_images")
      .select("id, image_url, title, category, tags")
      .or("alt_text.is.null,last_analyzed_at.is.null")
      .limit(20); // Limit batch size to avoid timeouts

    if (!images || images.length === 0) {
      return NextResponse.json({ message: "No images to analyze", count: 0 });
    }

    let analyzed = 0;
    for (const image of images) {
      try {
        // Analyze each image
        const response = await fetch(image.image_url);
        if (!response.ok) continue;
        
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        const prompt = `Analyze this image and return JSON with: altText, suggestedCategory, suggestedTags, qualityScore, qualityNotes, dominantColors, composition, seoKeywords.`;
        
        const analysis = await generateJSON<ImageAnalysis>(prompt, {
          // Use default model (env-configurable)
        });

        await supabase
          .from("gallery_images")
          .update({
            alt_text: analysis.altText,
            category: analysis.suggestedCategory,
            tags: analysis.suggestedTags,
            ai_analysis: analysis,
            last_analyzed_at: new Date().toISOString(),
          })
          .eq("id", image.id);
        
        analyzed++;
        
        // Rate limit between requests (important for API limits)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        log.warn("Failed to analyze individual image", { imageId: image.id, error: err });
      }
    }

    log.info("Batch analysis completed", { total: images.length, analyzed });
    return NextResponse.json({ 
      message: "Batch analysis completed", 
      total: images.length, 
      analyzed 
    });
  } catch (error: any) {
    log.error("Batch analysis failed", undefined, error);
    return NextResponse.json(
      { error: error?.message || "Batch analysis failed" },
      { status: 500 }
    );
  }
}
