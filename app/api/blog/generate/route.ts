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

    // Fetch site content for context
    let siteContext = "";
    try {
      // Get about page content
      const { data: aboutPage } = await supabase
        .from("content_pages")
        .select("content")
        .eq("slug", "about")
        .maybeSingle();
      
      // Get services information
      const { data: servicesPages } = await supabase
        .from("content_pages")
        .select("title, content")
        .in("slug", [
          "services",
          "wedding-photography",
          "portrait-photography",
          "commercial-photography",
          "event-photography",
          "family-photography",
          "senior-portraits",
          "professional-headshots",
          "maternity-sessions"
        ]);

      // Get existing blog posts for tone/style reference
      const { data: existingPosts } = await supabase
        .from("blog_posts")
        .select("title, excerpt, content")
        .eq("published", true)
        .limit(3);

      if (aboutPage?.content) {
        siteContext += `\n\nAbout Studio37:\n${aboutPage.content.substring(0, 500)}`;
      }

      if (servicesPages && servicesPages.length > 0) {
        siteContext += "\n\nOur Services:\n";
        servicesPages.forEach((page: any) => {
          const excerpt = page.content?.substring(0, 200) || "";
          siteContext += `- ${page.title}: ${excerpt}\n`;
        });
      }

      if (existingPosts && existingPosts.length > 0) {
        siteContext += "\n\nExisting Blog Style Reference:\n";
        existingPosts.forEach((post: any) => {
          siteContext += `- ${post.title}: ${post.excerpt || post.content?.substring(0, 150)}\n`;
        });
      }
    } catch (contextError) {
      console.error("Error fetching site context:", contextError);
      // Continue without context if fetch fails
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

    const prompt = `You are an expert content strategist and senior copywriter for Studio37 Photography, a professional photography studio in Pinehurst, TX.

CRITICAL LINKING RULES - YOU MUST FOLLOW THESE:
1. ONLY use links to www.studio37.cc domain (our website)
2. NEVER link to www.studio37photography.com or any external photography sites
3. NEVER mention or reference competitor websites
4. Use these internal links ONLY:
   - /services (general services page)
   - /wedding-photography
   - /portrait-photography
   - /commercial-photography
   - /event-photography
   - /family-photography
   - /senior-portraits
   - /professional-headshots
   - /maternity-sessions
   - /book-a-session (booking page)
   - /contact (contact page)
   - /about (about us)
   - /blog (blog home)
   - /gallery (portfolio)

SITE CONTEXT (use this real information - DO NOT make up information):
${siteContext || "Studio37 Photography is a professional photography studio based in Pinehurst, TX, offering wedding, portrait, commercial, and event photography services."}

Write a complete, SEO-optimized blog post about: ${topic}

STRICT STRUCTURE REQUIREMENTS (must appear exactly as H2 headings in this order):
## 🎯 Vision & Purpose
## 🎨 Style & Aesthetic
## 🤝 Client Experience & Collaboration
## 💰 Investment & Value
## 📍 Local Advantage (Pinehurst, TX)

Under each required H2 heading include 1-2 H3 subsections with concise, keyword-relevant titles.

Additional Requirements:
- Tone: ${tone || "professional and friendly"}
- Target length: ${wordCount || 800}-${(wordCount || 800) + 200} words
- Target keywords: ${keywords || "photography, Studio37, Pinehurst TX"}
- Write in Markdown format (no HTML tags except inline code if needed)
- Be engaging, informative, and actionable
- Include relevant photography tips and insights based on the site context provided
- Mention Studio37 Photography and Pinehurst, TX naturally (brand mention at least twice)
- Use internal linking opportunities from the approved list above
- End with a clear call-to-action linking to /book-a-session
- Use short paragraphs (2-3 sentences max)
- Avoid fluff, maintain clarity and professionalism
- Base recommendations on actual Studio37 services mentioned in the context

REMINDER: Only link to pages on www.studio37.cc. Do NOT reference external websites or competitors.

Return the response in this exact JSON format (no markdown code blocks):
{
  "title": "Blog post title here",
  "metaDescription": "Meta description here",
  "content": "Full markdown content here including required emoji section headings in order",
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

    // Helper: ensure required emoji section headings exist & ordered
    const ensureSectionHeadings = (md: string): string => {
      const required = [
        "## 🎯 Vision & Purpose",
        "## 🎨 Style & Aesthetic",
        "## 🤝 Client Experience & Collaboration",
        "## 💰 Investment & Value",
        "## 📍 Local Advantage (Pinehurst, TX)"
      ];
      let out = md || "";
      const present = required.filter(h => out.includes(h));
      // If none present, prepend all in order with placeholder intro paragraphs
      if (present.length === 0) {
        out = required.map(h => `${h}\n\n`).join("") + out;
      } else {
        // Ensure order: rebuild sequence preserving existing content for each section
        // Split at required headings
        const sections: Record<string, string> = {};
        for (const h of required) {
          if (out.includes(h)) {
            const idx = out.indexOf(h);
            // Find next heading or end
            let nextIdx = out.length;
            for (const other of required) {
              if (other !== h && out.indexOf(other) > idx) {
                nextIdx = Math.min(nextIdx, out.indexOf(other));
              }
            }
            sections[h] = out.substring(idx, nextIdx).trim();
          }
        }
        // Reassemble in canonical order
        out = required.map(h => sections[h] || `${h}\n\n`).join("\n\n");
      }
      return out;
    };

    // Helper to inject internal links & CTA if missing
    const ensureLinks = (md: string): string => {
      let out = md || "";
      
      // CRITICAL: Remove any references to competitor sites
      out = out.replace(/www\.studio37photography\.com/gi, "www.studio37.cc");
      out = out.replace(/studio37photography\.com/gi, "www.studio37.cc");
      out = out.replace(/\[([^\]]+)\]\(https?:\/\/(?!www\.studio37\.cc)[^)]+\)/gi, "$1"); // Remove external links
      
      // Link brand mention to our site only
      if (!/\[Studio37 Photography\]\(/.test(out) && out.includes("Studio37 Photography")) {
        out = out.replace(/Studio37 Photography/g, "[Studio37 Photography](https://www.studio37.cc/services)");
      }
      
      // Service links - all internal to www.studio37.cc
      if (!/\]\(https:\/\/www\.studio37\.cc\/services\)/.test(out) && !/\]\(\/services\)/.test(out)) {
        out = out.replace(/\bwedding photography\b/gi, "[wedding photography](/services/wedding-photography)");
        out = out.replace(/\bcorporate (?:photography|services)\b/gi, "[corporate services](/services/commercial-photography)");
        out = out.replace(/\bportrait photography\b/gi, "[portrait photography](/services/portrait-photography)");
        out = out.replace(/\bfamily portraits?\b/gi, "[family portraits](/family-photography)");
      }
      
      // Session booking CTA - only to our booking page
      if (!/book-a-session/.test(out) && !/\/contact/.test(out)) {
        out += "\n\n---\n\n**Ready to create something beautiful?** [Book a session with Studio37](https://www.studio37.cc/book-a-session) or [contact us](https://www.studio37.cc/contact) to discuss your photography needs.";
      }
      
      return out;
    };

    try {
      const blogData = JSON.parse(responseText);

      // Fix escaped newlines in content/title/excerpt
      if (blogData.content && typeof blogData.content === 'string') {
        blogData.content = blogData.content.replace(/\\n/g, '\n');
      }
      if (blogData.title && typeof blogData.title === 'string') {
        blogData.title = blogData.title.replace(/\\n/g, '\n');
      }
      if (blogData.excerpt && typeof blogData.excerpt === 'string') {
        blogData.excerpt = blogData.excerpt.replace(/\\n/g, '\n');
      }

      // Apply formatting template if missing leading H1
      let contentStr = String(blogData.content || "");
      const titleStr = String(blogData.title || topic || "");
      const introStr = String(blogData.metaDescription || blogData.excerpt || "");
      const hasHeader = /^#\s/.test(contentStr.trim());
      if (!hasHeader && titleStr) {
        contentStr = `# ${titleStr}\n\n${introStr ? '> ' + introStr + '\n\n' : ''}---\n\n` + contentStr;
      }
  // Enforce section headings structure then internal links
  blogData.content = ensureLinks(ensureSectionHeadings(contentStr));

      return NextResponse.json(blogData);
    } catch (parseError) {
      // If JSON parsing fails, return a structured fallback
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw response:", responseText.substring(0, 500));
      return NextResponse.json({
        title: topic,
        metaDescription: `Learn about ${topic} with Studio37 Photography in Pinehurst, TX. Expert tips and professional insights.`,
        content: (() => {
          let fc = String(responseText || "");
          const ft = String(topic || "");
          const fi = `Learn about ${topic} with Studio37 Photography in Pinehurst, TX. Expert tips and professional insights.`;
          const startsWithHeader = /^#\s/.test(fc.trim());
          if (!startsWithHeader && ft) {
            fc = `# ${ft}\n\n> ${fi}\n\n---\n\n` + fc;
          }
          return ensureLinks(ensureSectionHeadings(fc));
        })(), // Formatted fallback content
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
