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
      console.error("Missing Google API Key - check environment variables");
      return NextResponse.json(
        { error: "AI service not configured. Missing API key." },
        { status: 503 }
      );
    }

    console.log("Initializing Gemini API with model: gemini-2.0-flash-exp");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try multiple models in order of preference
    const modelsToTry = [
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro-latest",
      "gemini-1.5-pro", 
      "gemini-pro"
    ];
    
    let model;
    let modelUsed = "";
    
    for (const modelName of modelsToTry) {
      try {
        model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_ONLY_HIGH",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_ONLY_HIGH",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_ONLY_HIGH",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH",
            },
          ],
        });
        modelUsed = modelName;
        console.log(`Using model: ${modelName}`);
        break;
      } catch (modelError) {
        console.warn(`Failed to initialize model ${modelName}, trying next...`);
        continue;
      }
    }
    
    if (!model) {
      console.error("All models failed to initialize");
      return NextResponse.json(
        { error: "Could not initialize AI model. Please check API key and model availability." },
        { status: 503 }
      );
    }

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
      console.log("Generating content with Gemini API...");
      result = await model.generateContent(prompt);
      response = result.response;
      console.log("Content generation successful");
    } catch (aiError: any) {
      console.error("Gemini API error details:", {
        message: aiError?.message,
        status: aiError?.status,
        statusText: aiError?.statusText,
        code: aiError?.code,
        name: aiError?.name,
        stack: aiError?.stack?.split('\n').slice(0, 3).join('\n')
      });
      
      const msg = String(aiError?.message || aiError || "");
      
      // Check for specific error types
      if (msg.includes("404") || msg.includes("not found") || msg.includes("does not exist")) {
        return NextResponse.json(
          { error: "Model not available. Using gemini-1.5-pro - if this persists, check Google AI Studio for available models.", code: "MODEL_NOT_FOUND" },
          { status: 503 }
        );
      }
      
      if (msg.includes("reported as leaked") || msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
        return NextResponse.json(
          { error: "API key issue. Please check the key is valid and not leaked. Rotate in Netlify if needed.", code: "API_KEY_INVALID" },
          { status: 403 }
        );
      }
      
      if (msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json(
          { error: "API quota exceeded. Please try again later or check your Google AI quota.", code: "QUOTA_EXCEEDED" },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `AI service error: ${aiError?.message || "Unknown error"}`, code: "AI_ERROR" },
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

    // Check for safety/content filtering
    const candidates = (result as any)?.candidates;
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0];
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.error("Content was blocked:", {
          finishReason: candidate.finishReason,
          safetyRatings: candidate.safetyRatings
        });
        return NextResponse.json(
          { error: `Content generation blocked: ${candidate.finishReason}. Try adjusting your topic or keywords.` },
          { status: 400 }
        );
      }
    }

    let responseText;
    try {
      responseText = response.text().trim();
    } catch (textError: any) {
      console.error("Error extracting text from response:", textError);
      console.error("Response object:", JSON.stringify(response, null, 2));
      
      // Check if it was blocked
      if (candidates && candidates.length > 0) {
        const candidate = candidates[0];
        console.error("Candidate info:", {
          finishReason: candidate.finishReason,
          safetyRatings: candidate.safetyRatings
        });
      }
      
      return NextResponse.json(
        { error: `Failed to extract response: ${textError.message}. The content may have been blocked by safety filters.` },
        { status: 500 }
      );
    }

    // Check if response is empty
    if (!responseText) {
      console.error("Empty response from AI model");
      console.error("Result candidates:", candidates);
      return NextResponse.json(
        { error: "AI returned empty response. Try different keywords or a simpler topic." },
        { status: 500 }
      );
    }

    // Clean up response if it has markdown code blocks
    responseText = responseText
      .replace(/^```json\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    // Helpers to clean and normalize AI text output
    const decodeBasicEntities = (s: string): string => {
      return s
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&nbsp;/g, " ");
    };
    const normalizeCommonUnicode = (s: string): string => {
      // Handle common unicode escapes sometimes double-escaped in LLM JSON
      return s
        // Dashes
        .replace(/\\u2014|—/g, "—") // em dash
        .replace(/\\u2013|–/g, "–") // en dash
        // Quotes/apostrophes
        .replace(/\\u2019|’/g, "’")
        .replace(/\\u2018|‘/g, "‘")
        .replace(/\\u201C|“/g, "“")
        .replace(/\\u201D|”/g, "”")
        // Ellipsis
        .replace(/\\u2026|…/g, "…");
    };

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

      // Fix all forms of escaped newlines and formatting
      if (blogData.content && typeof blogData.content === 'string') {
        // Replace all forms of escaped newlines
        blogData.content = normalizeCommonUnicode(decodeBasicEntities(
          blogData.content
          .replace(/\\n\\n/g, '\n\n')  // Double newlines first
          .replace(/\\n/g, '\n')       // Then single newlines
          .replace(/\\t/g, '\t')       // Fix tabs
          .replace(/\\r/g, '')         // Remove carriage returns
        )).trim();
      }
      if (blogData.title && typeof blogData.title === 'string') {
        blogData.title = normalizeCommonUnicode(decodeBasicEntities(blogData.title))
          .replace(/\\n/g, ' ')        // Replace newlines with spaces in titles
          .trim();
      }
      if (blogData.excerpt && typeof blogData.excerpt === 'string') {
        blogData.excerpt = normalizeCommonUnicode(decodeBasicEntities(blogData.excerpt))
          .replace(/\\n/g, ' ')        // Replace newlines with spaces in excerpts
          .trim();
      }
      if (blogData.metaDescription && typeof blogData.metaDescription === 'string') {
        blogData.metaDescription = normalizeCommonUnicode(decodeBasicEntities(blogData.metaDescription))
          .replace(/\\n/g, ' ')        // Replace newlines with spaces in meta
          .trim();
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
      
      // Fix newlines in raw response text before using as fallback
      let fallbackContent = normalizeCommonUnicode(decodeBasicEntities(String(responseText || "")
        .replace(/\\n\\n/g, '\n\n')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '')
      )).trim();
      
      return NextResponse.json({
        title: topic,
        metaDescription: `Learn about ${topic} with Studio37 Photography in Pinehurst, TX. Expert tips and professional insights.`,
        content: (() => {
          let fc = fallbackContent;
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
