import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

// Keep it simple and robust to avoid build issues and external API keys
export const runtime = "edge";

type ConversationState = {
  step: "initial" | "service" | "interest" | "contact" | "collect" | "final";
  data: Record<string, any>;
};
const conversations = new Map<string, ConversationState>();

const FLOWS = {
  initial:
    "Hi there! I'm Studio 37's virtual assistant. How can I help you today? Are you interested in wedding photography, portraits, events, or commercial photography?",
  service:
    "Great choice! Would you like to know about pricing options or book a consultation?",
  interest:
    "Could you share a bit more about what you are looking for? That helps us prepare a personalized quote.",
  contact:
    "Thanks! Leave your email or phone and we'll get back within 24 hours.",
  collect:
    "Perfect! Anything specific you want us to know before the consultation?",
  final:
    "Thanks for reaching out to Studio 37 Photography! We'll be in touch soon.",
  fallback:
    "Would you like to discuss your photography needs with our team? We can provide details on services and pricing.",
} as const;

const BodySchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`chat-simple:${ip}`, { limit: 60, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return new NextResponse(
        JSON.stringify({ message: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) } }
      );
    }

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }
    const message: string = parsed.data.message.trim();
    const sessionId: string = String(parsed.data.sessionId || "anonymous");

    const current = conversations.get(sessionId) || {
      step: "initial",
      data: {} as Record<string, any>,
    };
    const msg = message.toLowerCase();
    let response: string = FLOWS.initial;
    let nextState: ConversationState = { ...current };

    switch (current.step) {
      case "initial": {
        if (/(wedding|portrait|event|commercial)/.test(msg)) {
          nextState.step = "service";
          response = FLOWS.service;
          const svc = /(wedding|portrait|event|commercial)/.exec(msg)?.[1];
          if (svc) nextState.data.service = svc;
        } else {
          response = FLOWS.initial;
        }
        break;
      }
      case "service":
        nextState.step = "interest";
        response = FLOWS.interest;
        break;
      case "interest":
        nextState.data.details = message;
        nextState.step = "contact";
        response = FLOWS.contact;
        break;
      case "contact": {
        const email = message.match(
          /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/
        )?.[0];
        const phone = message.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)?.[0];
        if (email) nextState.data.email = email;
        if (phone) nextState.data.phone = phone;
        nextState.step = "collect";
        response = FLOWS.collect;
        break;
      }
      case "collect":
        nextState.data.additionalInfo = message;
        nextState.step = "final";
        response = FLOWS.final;
        break;
      case "final":
      default:
        response = FLOWS.fallback;
        break;
    }

    conversations.set(sessionId, nextState);
    return NextResponse.json({ message: response });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      {
        message:
          "I'm having trouble responding right now. Please contact us directly for assistance.",
      },
      { status: 500 }
    );
  }
}
