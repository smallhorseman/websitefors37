import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/chat/respond");

const BodySchema = z.object({
  message: z.string().min(1, "message is required").max(2000),
  context: z.string().max(4000).optional(),
  leadData: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    // Rate limit by IP: up to 20 requests per 60s
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`chat:${ip}`, { limit: 20, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      log.warn("Rate limit exceeded", { ip });
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      log.warn("Validation failed", { issues: parsed.error.flatten() });
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { message, context, leadData } = parsed.data;

    // message presence already enforced by zod

    // Check if AI is enabled in settings
    try {
      const { data } = await supabase
        .from("settings")
        .select("ai_enabled")
        .single();
      if (data && data.ai_enabled === false) {
        log.warn("AI disabled in settings", { ip });
        return NextResponse.json(
          { error: "AI is disabled in settings" },
          { status: 403 }
        );
      }
    } catch {
      // ignore settings read errors, allow call to continue
    }

    // Load chatbot settings and training data
    let chatbotSettings = null;
    let trainingExamples: any[] = [];

    try {
      const { data: settings } = await supabase
        .from("chatbot_settings")
        .select("*")
        .single();
      chatbotSettings = settings;

      const { data: examples } = await supabase
        .from("chatbot_training")
        .select("question, answer, category")
        .limit(50);
      trainingExamples = examples || [];
    } catch {
      // Use defaults if tables don't exist yet
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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Build comprehensive prompt with custom training data
    const systemInstructions =
      chatbotSettings?.system_instructions ||
      "You are an expert customer service assistant for Studio37 Photography in Pinehurst, TX.";

    const personality = chatbotSettings?.personality || "warm and professional";
    const tone = chatbotSettings?.tone || "conversational";

    // Format training examples for context
    const trainingContext =
      trainingExamples.length > 0
        ? `\n\n### Trained Q&A Knowledge Base:\n${trainingExamples
            .map((ex) => `**Q:** ${ex.question}\n**A:** ${ex.answer}\n**Category:** ${ex.category || 'general'}`)
            .join("\n\n")}`
        : "";

    const prompt = `${systemInstructions}

## Your Role
You are the AI assistant for Studio37 Photography, a professional photography studio in Pinehurst, TX specializing in weddings, portraits, events, and commercial work. Your goal is to provide helpful information, qualify leads, and guide potential clients toward booking.

## Personality & Tone
- **Personality:** ${personality}
- **Tone:** ${tone}
- **Style:** Engaging, knowledgeable, and empathetic. Mirror the customer's energy level.

## Services & Pricing
- **Wedding Photography:** $2,500-$5,000+ (full-day coverage, engagement session, albums)
- **Portrait Sessions:** $800-$2,000 (family, senior, maternity, newborn)
- **Event Photography:** $1,200-$3,500 (corporate, birthday, graduation)
- **Commercial Photography:** $1,500-$5,000+ (product, real estate, brand)
- **Headshots:** $300-$800 (individual or team packages)

All packages include professional editing, online gallery, and print rights.

## Key Information
- **Location:** Pinehurst, TX (serving Houston metro area)
- **Experience:** 10+ years professional photography
- **Specialties:** Natural light, candid moments, storytelling
- **Availability:** Book 6-12 months in advance for weddings
- **Contact:** Book consultations via website or call directly
${trainingContext}

## Lead Qualification Strategy
1. **Identify service interest** - Ask what type of photography they need
2. **Understand timeline** - When is their event/session?
3. **Budget awareness** - Gauge budget expectations without being pushy
4. **Capture contact info** - Gently ask for email/phone for follow-up
5. **Drive booking** - Encourage consultation or package selection

## Current Context
${leadData && Object.keys(leadData).length > 0 ? `**Known about customer:**\n${Object.entries(leadData).map(([k, v]) => `- ${k}: ${v}`).join('\n')}` : "First interaction with this customer."}

${context ? `**Recent conversation:**\n${context}` : ""}

## Customer Message
"${message}"

## Response Guidelines
- Keep responses concise (2-4 sentences max)
- Be specific about pricing when asked, but mention packages vary
- Use the trained Q&A examples to answer similar questions
- If customer shares email/phone, acknowledge it warmly
- If discussing services, suggest next steps (consultation, availability check)
- Avoid repetition - if info was already discussed, build on it
- Match customer's communication style (formal vs casual)
- Use emojis sparingly and appropriately (✨📸💍 for weddings, etc.)
- **Include clickable links** when relevant using markdown format: [link text](https://url)
  - Gallery/Portfolio: [view our gallery](https://studio37.cc/gallery)
  - Services: [our services](https://studio37.cc/services)
  - Booking: [book a consultation](https://studio37.cc/book-a-session)
  - Contact: [contact us](https://studio37.cc/contact)
  - About: [learn more about us](https://studio37.cc/about)
  - Blog: [read our blog](https://studio37.cc/blog)

Respond now:`;
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (aiError:any) {
      const msg = String(aiError?.message || aiError || "");
      if (msg.includes("reported as leaked") || (aiError.status === 403 && msg.includes("Forbidden"))) {
        return NextResponse.json({ error: "API key was reported as leaked. Rotate in Netlify and redeploy.", code: "API_KEY_LEAKED" }, { status: 403 });
      }
      throw aiError;
    }
    const response = result.response.text().trim();

    // Enhanced lead information detection
    const detectedInfo: any = {};
    const lowerMessage = message.toLowerCase();

    // Service detection with more keywords
    const servicePatterns = {
      wedding: /\b(wedding|bride|groom|engagement|ceremony|reception|bridal)\b/i,
      portrait: /\b(portrait|family|senior|maternity|newborn|baby|graduation)\b/i,
      event: /\b(event|party|birthday|corporate|conference|celebration)\b/i,
      commercial: /\b(commercial|product|real estate|business|brand|headshot)\b/i,
    };

    for (const [service, pattern] of Object.entries(servicePatterns)) {
      if (pattern.test(lowerMessage)) {
        detectedInfo.service = service;
        break;
      }
    }

    // Budget detection with ranges
    const budgetMatch = message.match(/\$?\s?(\d{1,3}(,\d{3})*(\.\d{2})?)/);
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1].replace(/,/g, ""));
      if (amount >= 500 && amount <= 50000) {
        detectedInfo.budget = `$${amount.toLocaleString()}`;
      }
    } else if (lowerMessage.includes("budget") || lowerMessage.includes("price")) {
      // User mentioned budget/price but didn't give amount - mark for follow-up
      detectedInfo.budgetInquiry = true;
    }

    // Name detection
    const namePatterns = [
      /my name is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
      /i'?m ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
      /this is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    ];
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) {
        detectedInfo.name = match[1];
        break;
      }
    }

    // Email detection
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    if (emailMatch) {
      detectedInfo.email = emailMatch[0];
    }

    // Phone detection (more flexible formats)
    const phoneMatch = message.match(/(\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) {
      detectedInfo.phone = phoneMatch[1].replace(/\s+/g, ' ').trim();
    }

    // Date/Timeline detection
    const datePatterns = [
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\b/i,
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
      /\bin\s+(\d+)\s+(weeks?|months?|days?)\b/i,
      /\bnext\s+(week|month|year|spring|summer|fall|winter)\b/i,
    ];
    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        detectedInfo.eventDate = match[0];
        break;
      }
    }

    // Intent detection
    if (/\b(book|schedule|reserve|consultation|available|availability)\b/i.test(lowerMessage)) {
      detectedInfo.intent = "booking";
    } else if (/\b(price|pricing|cost|package|rate|quote)\b/i.test(lowerMessage)) {
      detectedInfo.intent = "pricing";
    } else if (/\b(portfolio|work|examples|photos|style)\b/i.test(lowerMessage)) {
      detectedInfo.intent = "portfolio";
    }

    return NextResponse.json({
      response,
      detectedInfo: Object.keys(detectedInfo).length > 0 ? detectedInfo : null,
    });
  } catch (err: any) {
    log.error("Chat response generation failed", undefined, err);
    return NextResponse.json(
      { error: err?.message || "Chat response generation failed" },
      { status: 500 }
    );
  }
}
