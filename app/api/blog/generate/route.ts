import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { topic, keywords, tone, wordCount } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Check if AI is enabled in settings
    try {
      const { data } = await supabase
        .from("settings")
        .select("ai_enabled")
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert content writer for Studio37 Photography, a professional photography studio in Pinehurst, TX.

Write a complete, SEO-optimized blog post about: ${topic}

Requirements:
- Tone: ${tone || "professional and friendly"}
- Target length: ${wordCount || 800}-${(wordCount || 800) + 200} words
- Target keywords: ${keywords || "photography, Studio37, Pinehurst TX"}
- Include 3-5 H2 sections with descriptive headings
- Include 1-2 H3 subsections under each H2
- Write in Markdown format
- Be engaging, informative, and actionable
- Include relevant photography tips and insights
- Mention Studio37 Photography and Pinehurst, TX naturally
- End with a clear call-to-action
- Use short paragraphs (2-3 sentences max)

Blog Post Title:
Create an engaging, SEO-friendly title (50-60 characters) that includes main keywords.

Meta Description:
Write a compelling meta description (150-160 characters) that summarizes the post and includes a CTA.

Structure:
# [Title]

[Engaging introduction paragraph that hooks the reader]

## [H2 Section 1]
[Content...]

### [H3 Subsection if relevant]
[Content...]

## [H2 Section 2]
[Content...]

[Continue with 3-5 total H2 sections]

## Conclusion
[Summarize key points and include call-to-action]

---

Return the response in JSON format:
{
  "title": "Blog post title here",
  "metaDescription": "Meta description here",
  "content": "Full markdown content here",
  "excerpt": "Brief 1-2 sentence summary",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "category": "suggested category"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check if response exists
    if (!response) {
      console.error("No response from AI model");
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 500 }
      );
    }

    let responseText = response.text().trim();

    // Check if response is empty
    if (!responseText) {
      console.error("Empty response from AI model");
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    // Clean up response if it has markdown code blocks
    responseText = responseText
      .replace(/^```json\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    try {
      const blogData = JSON.parse(responseText);
      return NextResponse.json(blogData);
    } catch (parseError) {
      // If JSON parsing fails, return a structured fallback
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw response:", responseText.substring(0, 500));
      return NextResponse.json({
        title: topic,
        metaDescription: `Learn about ${topic} with Studio37 Photography in Pinehurst, TX. Expert tips and professional insights.`,
        content: responseText, // Use raw response as content
        excerpt: `Discover everything you need to know about ${topic}.`,
        suggestedTags: keywords?.split(",").map((k: string) => k.trim()) || [],
        category: "Photography Tips",
      });
    }
  } catch (err: any) {
    console.error("Blog post generation failed:", err);
    console.error("Error details:", {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    });
    return NextResponse.json(
      { error: err?.message || "Blog post generation failed" },
      { status: 500 }
    );
  }
}
