/**
 * AI-Powered Lead Scoring API
 * 
 * Uses Gemini 2.0 Flash to analyze lead quality and provide:
 * - Intelligent scoring (0-100)
 * - Priority categorization
 * - Next best action recommendations
 * - Conversation sentiment analysis
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractLeadData, generateJSON } from "@/lib/ai-client";
import { supabase } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const log = createLogger("api/leads/score");

const BodySchema = z.object({
  leadId: z.string().uuid().optional(),
  conversationHistory: z.string().min(10).max(10000).optional(),
  leadData: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    service: z.string().optional(),
    budget: z.string().optional(),
    eventDate: z.string().optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

interface LeadScore {
  score: number; // 0-100
  priority: "low" | "medium" | "high" | "urgent";
  reasoning: string;
  nextActions: string[];
  sentiment: "negative" | "neutral" | "positive" | "enthusiastic";
  qualityIndicators: {
    hasContactInfo: boolean;
    hasServiceInterest: boolean;
    hasBudget: boolean;
    hasTimeline: boolean;
    showsUrgency: boolean;
    multipleInteractions: boolean;
  };
  estimatedValue: string | null;
  conversionProbability: number; // 0-100
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`lead-score:${ip}`, { limit: 30, windowMs: 60 * 1000 });
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

    const { leadId, conversationHistory, leadData } = parsed.data;

    // Fetch lead from database if ID provided
    let lead: any = leadData;
    if (leadId) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();
      if (data) {
        lead = data;
      }
    }

    if (!lead && !conversationHistory) {
      return NextResponse.json(
        { error: "Either leadId or conversationHistory must be provided" },
        { status: 400 }
      );
    }

    // Build comprehensive prompt for scoring
    const prompt = `You are an expert sales qualification analyst for Studio37 Photography. Analyze this lead and provide a comprehensive scoring assessment.

${lead ? `
Lead Information:
- Name: ${lead.name || "Not provided"}
- Email: ${lead.email || "Not provided"}
- Phone: ${lead.phone || "Not provided"}
- Service Interest: ${lead.service || "Not specified"}
- Budget: ${lead.budget || "Not mentioned"}
- Event Date: ${lead.eventDate || lead.event_date || "Not specified"}
- Source: ${lead.source || "Unknown"}
- Notes: ${lead.notes || "None"}
` : ""}

${conversationHistory ? `
Conversation History:
${conversationHistory}
` : ""}

Analyze this lead comprehensively and return a JSON object with this exact structure:
{
  "score": 0-100 (integer representing lead quality),
  "priority": "low|medium|high|urgent",
  "reasoning": "Brief explanation of the score (2-3 sentences)",
  "nextActions": ["specific action 1", "specific action 2", "specific action 3"],
  "sentiment": "negative|neutral|positive|enthusiastic",
  "qualityIndicators": {
    "hasContactInfo": boolean,
    "hasServiceInterest": boolean,
    "hasBudget": boolean,
    "hasTimeline": boolean,
    "showsUrgency": boolean,
    "multipleInteractions": boolean
  },
  "estimatedValue": "dollar range or null if unknown",
  "conversionProbability": 0-100 (likelihood of booking)
}

Scoring Guidelines:
- 0-25: Unqualified (no contact info, vague interest)
- 26-50: Low priority (some info, casual inquiry)
- 51-75: Qualified (good info, clear intent)
- 76-100: Hot lead (complete info, urgent timeline, high intent)

Consider:
- Quality of contact information (email > phone > no contact)
- Specific service interest vs vague inquiry
- Budget awareness and realistic expectations
- Timeline urgency (sooner = higher score)
- Engagement level and response quality
- Multiple touchpoints or follow-up interest
- Professional tone and seriousness of inquiry

Return ONLY valid JSON, no markdown or extra text.`;

    const analysis = await generateJSON<LeadScore>(prompt);

    // Update lead in database with new score if leadId provided
    if (leadId) {
      await supabase
        .from("leads")
        .update({
          score: analysis.score,
          priority: analysis.priority,
          ai_analysis: analysis,
          last_scored_at: new Date().toISOString(),
        })
        .eq("id", leadId);
      
      log.info("Lead scored and updated", { leadId, score: analysis.score });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    log.error("Lead scoring failed", undefined, error);
    return NextResponse.json(
      { error: error?.message || "Lead scoring failed" },
      { status: 500 }
    );
  }
}

// Batch score all leads
export async function PUT(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`batch-score:${ip}`, { limit: 3, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many batch requests" },
        { status: 429 }
      );
    }

    // Fetch all leads without scores or with old scores
    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .or("score.is.null,last_scored_at.lt." + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(50);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: "No leads to score", count: 0 });
    }

    let scored = 0;
    for (const lead of leads) {
      try {
        // Score each lead
        const analysis = await generateJSON<LeadScore>(`Analyze this lead:
${JSON.stringify(lead, null, 2)}

Return scoring JSON as per API spec.`);

        await supabase
          .from("leads")
          .update({
            score: analysis.score,
            priority: analysis.priority,
            ai_analysis: analysis,
            last_scored_at: new Date().toISOString(),
          })
          .eq("id", lead.id);
        
        scored++;
        
        // Rate limit between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        log.warn("Failed to score individual lead", { leadId: lead.id, error: err });
      }
    }

    log.info("Batch scoring completed", { total: leads.length, scored });
    return NextResponse.json({ 
      message: "Batch scoring completed", 
      total: leads.length, 
      scored 
    });
  } catch (error: any) {
    log.error("Batch scoring failed", undefined, error);
    return NextResponse.json(
      { error: error?.message || "Batch scoring failed" },
      { status: 500 }
    );
  }
}
