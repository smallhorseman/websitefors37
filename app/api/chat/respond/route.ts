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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build prompt with custom training data
    const systemInstructions =
      chatbotSettings?.system_instructions ||
      "You are a friendly customer service assistant for Studio37 Photography in Pinehurst, TX.";

    const personality = chatbotSettings?.personality || "friendly";
    const tone = chatbotSettings?.tone || "professional";

    // Format training examples for context
    const trainingContext =
      trainingExamples.length > 0
        ? `\n\nTrained Q&A Examples:\n${trainingExamples
            .map((ex) => `Q: ${ex.question}\nA: ${ex.answer}`)
            .join("\n\n")}`
        : "";

    const prompt = `${systemInstructions}

Personality: ${personality}
Tone: ${tone}

Services: Wedding, Portrait, Event, Commercial, Headshot photography
Packages: $800-$5000+ depending on service
${trainingContext}
${
  leadData && Object.keys(leadData).length > 0
    ? `\nKnown about customer: ${JSON.stringify(leadData)}`
    : ""
}
${context ? `\nRecent conversation:\n${context}` : ""}

Customer says: "${message}"

Respond naturally in 2-3 sentences using the ${personality} personality and ${tone} tone. Use the training examples above as reference for similar questions. Don't repeat information already discussed. Be helpful and conversational.`;

  const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Try to detect if user provided important information
    const detectedInfo: any = {};

    // Simple keyword detection
    const lowerMessage = message.toLowerCase();

    // Service detection
    if (lowerMessage.includes("wedding")) detectedInfo.service = "wedding";
    else if (
      lowerMessage.includes("portrait") ||
      lowerMessage.includes("headshot")
    )
      detectedInfo.service = "portrait";
    else if (lowerMessage.includes("event")) detectedInfo.service = "event";
    else if (
      lowerMessage.includes("commercial") ||
      lowerMessage.includes("product")
    )
      detectedInfo.service = "commercial";

    // Budget detection
    if (lowerMessage.match(/\$?\d{3,5}/)) {
      const match = message.match(/\$?(\d{3,5})/);
      if (match) detectedInfo.budget = `$${match[1]}`;
    }

    // Email detection
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) detectedInfo.email = emailMatch[0];

    // Phone detection
    const phoneMatch = message.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})/);
    if (phoneMatch) detectedInfo.phone = phoneMatch[1];

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
