import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { message, context, leadData } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
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

    const prompt = `You are a friendly, helpful customer service assistant for Studio37 Photography in Pinehurst, TX.

Business Info:
- Studio37 is a professional photography studio
- Services: Wedding, Portrait, Event, Commercial, Headshot photography
- Location: Pinehurst, TX
- Typical packages: $800-$5000+ depending on service
- Booking: Contact via form, phone, or email

Lead Context:
${leadData ? JSON.stringify(leadData, null, 2) : "New conversation"}

Conversation Context:
${context || "Starting conversation"}

User Message: "${message}"

Instructions:
- Be warm, professional, and conversational
- Keep responses under 100 words
- If asked about pricing, provide ranges and suggest a consultation
- If asked about availability, suggest using the booking form
- If asked about services, describe briefly and ask what they're planning
- Extract key info: service type, event date, budget, timeline
- Always end with a helpful next step or question
- Don't make up specific prices or dates
- If you don't know something, be honest and offer to connect them with the team

Response:`;

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
    console.error("Chat response generation failed:", err);
    console.error("Error details:", {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    });
    return NextResponse.json(
      { error: err?.message || "Chat response generation failed" },
      { status: 500 }
    );
  }
}
