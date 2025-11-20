import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/gallery/generate-alt-text");

export async function POST(req: Request) {
  try {
    const { imageUrl, title, description, category, tags } = await req.json();

    if (!imageUrl) {
      log.warn("Missing image URL");
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Check if AI is enabled in settings
    try {
      const { data } = await supabase
        .from("settings")
        .select("ai_enabled")
        .single();
      if (data && data.ai_enabled === false) {
        log.warn("AI disabled in settings");
        return NextResponse.json(
          { error: "AI is disabled in settings" },
          { status: 403 }
        );
      }
    } catch {
      // ignore settings read errors, allow call to continue
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      log.error("Missing API key", { env: "GOOGLE_API_KEY or GEMINI_API_KEY" });
      return NextResponse.json(
        { error: "Missing GOOGLE_API_KEY" },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const preferredModel =
      process.env.GOOGLE_GENAI_MODEL ||
      process.env.GEMINI_MODEL ||
      process.env.AI_MODEL ||
      "gemini-3-pro";
    const model = genAI.getGenerativeModel({ model: preferredModel });

    const prompt = `You are an SEO expert writing alt text for a photography studio's gallery images.

Studio: Studio37 Photography in Pinehurst, TX
Image Category: ${category || "general"}
Image Title: ${title || "Untitled"}
${description ? `Description: ${description}` : ""}
${tags && tags.length > 0 ? `Tags: ${tags.join(", ")}` : ""}

Write a concise, SEO-optimized alt text (50-125 characters) that:
- Describes what's in the image clearly
- Includes relevant photography keywords naturally
- Mentions the location (Pinehurst, TX) if appropriate
- Is accessible for screen readers
- Avoids phrases like "image of" or "picture of"

Return ONLY the alt text, no backticks or commentary.`;

    const result = await model.generateContent(prompt);
    const altText = result.response.text().trim().replace(/^"|"$/g, "");

    // Ensure it's within reasonable length
    const finalAltText =
      altText.length > 125 ? altText.slice(0, 122) + "..." : altText;

    return NextResponse.json({ altText: finalAltText });
  } catch (err: any) {
    log.error("Alt text generation failed", undefined, err);
    return NextResponse.json(
      { error: err?.message || "Alt text generation failed" },
      { status: 500 }
    );
  }
}
