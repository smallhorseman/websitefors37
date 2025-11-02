import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// Helper to build concise prompts for specific tasks
function buildPrompt(params: {
  type: "title" | "meta";
  content: string;
  targetKeyword?: string;
  brand?: string;
  location?: string;
  maxLength?: number;
}) {
  const {
    type,
    content,
    targetKeyword,
    brand = "Studio37 Photography",
    location = "Pinehurst, TX",
    maxLength,
  } = params;

  const constraints =
    type === "title"
      ? `Write a compelling, click-worthy page title between 50 and ${
          maxLength || 60
        } characters. Prefer including the brand "${brand}" if space allows. Avoid quotes and emojis.`
      : `Write a persuasive SEO meta description between 150 and 160 characters. Summarize the value clearly, include a subtle call-to-action, and keep natural language. Avoid quotes and emojis.`;

  const keywordLine = targetKeyword
    ? `Focus on the keyword: ${targetKeyword}`
    : "";

  return `You are an expert SEO copywriter for a local photography studio in ${location} named ${brand}.
${constraints}
${keywordLine}

Page content:
"""
${content.replace(/\s+/g, " ").slice(0, 4000)}
"""

Return ONLY the text, no backticks or commentary.`;
}

export async function POST(req: Request) {
  try {
    const { type, content, targetKeyword, maxLength } = await req.json();
    if (!content || (type !== "title" && type !== "meta")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Check if AI is enabled in settings (best-effort)
    try {
      const { data } = await supabase
        .from("settings")
        .select("ai_enabled, ai_model")
        .single();
      if (data && data.ai_enabled === false) {
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
      return NextResponse.json(
        { error: "Missing GOOGLE_API_KEY" },
        { status: 503 }
      );
    }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = buildPrompt({ type, content, targetKeyword, maxLength });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Post-process to enforce length
    let finalText = text.replace(/^"|"$/g, "");
    if (type === "title") {
      const limit = (maxLength as number) || 60;
      if (finalText.length > limit) {
        finalText = finalText.slice(0, limit - 1).replace(/\s+\S*$/, "") + "…";
      }
    } else {
      if (finalText.length > 160) {
        finalText = finalText.slice(0, 160);
      }
    }

    return NextResponse.json({ text: finalText });
  } catch (err) {
    console.error("AI generation failed:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
