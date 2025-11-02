import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = String(body?.message || "").trim();
    const sessionId: string = String(body?.sessionId || "anonymous");

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
