import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Increase timeout to 60 seconds for blog generation

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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Stable, widely available model
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    });

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

Return the response in this exact JSON format (no markdown code blocks):
{
  "title": "Blog post title here",
  "metaDescription": "Meta description here",
  "content": "Full markdown content here",
  "excerpt": "Brief 1-2 sentence summary",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "category": "suggested category"
}`;


    let result, response;
    try {
      result = await model.generateContent(prompt);
      response = result.response;
    } catch (aiError: any) {
      console.error("Gemini API error:", aiError);
      const msg = String(aiError?.message || aiError || "");
      if (msg.includes("reported as leaked") || msg.includes("403")) {
        return NextResponse.json(
          { error: "API key was reported as leaked. Please rotate the key in Netlify and redeploy.", code: "API_KEY_LEAKED" },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Gemini API error: ${aiError?.message || aiError}` },
        { status: 502 }
      );
    }

    // Check if response exists
    if (!response) {
      console.error("No response from AI model");
      return NextResponse.json(
        { error: "No response from AI model" },
        { status: 500 }
      );
    }

    let responseText;
    try {
      responseText = response.text().trim();
    } catch (textError: any) {
      console.error("Error extracting text from response:", textError);
      console.error("Response object:", JSON.stringify(response, null, 2));
      return NextResponse.json(
        { error: `Failed to extract response: ${textError.message}` },
        { status: 500 }
      );
    }

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
      
      // Fix escaped newlines in content to actual newlines for proper markdown
      if (blogData.content && typeof blogData.content === 'string') {
        blogData.content = blogData.content.replace(/\\n/g, '\n');
      }
      if (blogData.title && typeof blogData.title === 'string') {
        blogData.title = blogData.title.replace(/\\n/g, '\n');
      }
      if (blogData.excerpt && typeof blogData.excerpt === 'string') {
        blogData.excerpt = blogData.excerpt.replace(/\\n/g, '\n');
      }
      
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
