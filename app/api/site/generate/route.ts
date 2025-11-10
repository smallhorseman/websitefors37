import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type PageComponent = any; // We validate minimally and let the client editor enforce full typing

export async function POST(req: Request) {
  try {
    const { prompt, style, wordCount } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Check AI enabled setting (best-effort)
    try {
      const { data } = await supabase.from("settings").select("ai_enabled").single();
      if (data && data.ai_enabled === false) {
        return NextResponse.json(
          { error: "AI is disabled in settings" },
          { status: 403 }
        );
      }
    } catch {}

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_API_KEY" },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.65,
      },
    });

    const allowedTypes = [
      "hero",
      "text",
      "servicesGrid",
      "galleryHighlights",
      "testimonials",
      "faq",
      "pricingTable",
      "ctaBanner",
      "mapEmbed",
      "blogCards",
      "contactForm",
      "seoFooter",
    ];

    const sysPrompt = `You are an expert UX/UI landing page architect for Studio37 Photography in Pinehurst, TX.
Design a conversion-oriented page based on the user's brief.

Return ONLY valid JSON (no markdown fences). The JSON schema is:
{
  "title": "string",
  "suggestedSlug": "kebab-case-string",
  "notes": "string",
  "components": [
    // ordered list of components. Allowed types: ${allowedTypes.join(", ")}
    { "id": "string", "type": "hero", "data": { "title": "string", "subtitle": "string", "backgroundImage": "string", "buttonText": "string", "buttonLink": "/book-a-session", "alignment": "left|center|right", "overlay": 0 } },
    { "id": "string", "type": "text", "data": { "content": "html or markdown", "alignment": "left|center|right", "size": "sm|md|lg|xl" } },
    { "id": "string", "type": "servicesGrid", "data": { "heading": "string", "subheading": "string", "services": [{ "image": "string", "title": "string", "description": "string", "features": ["string"], "link": "/services" }], "columns": 2 } },
    { "id": "string", "type": "testimonials", "data": { "testimonials": [{ "quote": "string", "author": "string", "subtext": "string" }] } },
    { "id": "string", "type": "faq", "data": { "heading": "string", "items": [{ "question": "string", "answer": "string" }] } },
    { "id": "string", "type": "pricingTable", "data": { "heading": "string", "subheading": "string", "plans": [{ "title": "string", "price": "string", "features": ["string"], "ctaText": "string", "ctaLink": "/book-a-session" }], "columns": 3 } },
    { "id": "string", "type": "ctaBanner", "data": { "heading": "string", "primaryButtonText": "string", "primaryButtonLink": "/book-a-session" } },
    { "id": "string", "type": "mapEmbed", "data": { "address": "Pinehurst, TX", "lat": 30.1737, "lng": -95.6886, "zoom": 11, "height": "md" } },
    { "id": "string", "type": "seoFooter", "data": { "content": "markdown", "includeSchema": false } }
  ]
}

Rules:
- Use only allowed component types and fields above.
- Supply reasonable defaults for missing images/links.
- Keep a balanced structure: hero → intro text → services → testimonials/faq → pricing → map → CTA → seoFooter.
- Business/brand context: Studio37 Photography, Pinehurst, TX. Use internal links where natural ("/services", "/book-a-session", "/contact").
- Writing tone: ${style || "friendly, premium, trustworthy"}. Target length: ${wordCount || 500}-800 words across text components.
`;

    let aiText = "";
    try {
      const result = await model.generateContent(`${sysPrompt}\n\nUser brief: ${prompt}`);
      const response = result.response;
      aiText = response?.text?.().trim?.() || "";
    } catch (aiError: any) {
      const msg = String(aiError?.message || aiError || "");
      if (msg.includes("reported as leaked") || msg.includes("403")) {
        return NextResponse.json(
          { error: "API key was reported as leaked. Please rotate the key in Netlify and redeploy.", code: "API_KEY_LEAKED" },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: `Gemini API error: ${aiError?.message || aiError}` }, { status: 502 });
    }

    if (!aiText) {
      return NextResponse.json({ error: "No response from AI model" }, { status: 500 });
    }

    // Strip code fences if present
    aiText = aiText.replace(/^```json\n?/i, "").replace(/\n?```$/i, "").trim();

    // Normalize components list to safe subset
    const normalize = (raw: any) => {
      const makeId = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      const components: PageComponent[] = [];
      const push = (c: any) => {
        if (!c || typeof c !== "object") return;
        if (!allowedTypes.includes(c.type)) return;
        c.id = c.id || makeId(c.type);
        c.visibility = c.visibility || { desktop: true, tablet: true, mobile: true };
        c.data = c.data || {};
        // defaults by type
        switch (c.type) {
          case "hero":
            c.data.title = c.data.title || "Professional Photography in Pinehurst, TX";
            c.data.subtitle = c.data.subtitle || "Studio37 – Timeless visuals with local expertise";
            c.data.backgroundImage = c.data.backgroundImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
            c.data.buttonText = c.data.buttonText || "Book a Session";
            c.data.buttonLink = c.data.buttonLink || "/book-a-session";
            c.data.alignment = c.data.alignment || "center";
            c.data.overlay = typeof c.data.overlay === "number" ? c.data.overlay : 55;
            break;
          case "text":
            c.data.content = c.data.content || "<p>We blend artistic vision with technical precision to capture authentic stories.</p>";
            c.data.alignment = c.data.alignment || "left";
            c.data.size = c.data.size || "md";
            break;
          case "servicesGrid":
            c.data.heading = c.data.heading || "Popular Services";
            c.data.subheading = c.data.subheading || "Tailored for families, brands & events";
            c.data.columns = c.data.columns || 2;
            c.data.services = Array.isArray(c.data.services) && c.data.services.length ? c.data.services : [
              { image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", title: "Portrait Sessions", description: "Natural-light portraits.", features: ["Outdoor & studio"], link: "/services" },
              { image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", title: "Event Coverage", description: "Document your milestones.", features: ["Candid + posed"], link: "/services" },
            ];
            break;
          case "testimonials":
            c.data.testimonials = Array.isArray(c.data.testimonials) && c.data.testimonials.length ? c.data.testimonials : [
              { quote: "Absolutely loved our photos!", author: "Happy Client", subtext: "Google Review" },
            ];
            break;
          case "faq":
            c.data.heading = c.data.heading || "FAQs";
            c.data.items = Array.isArray(c.data.items) && c.data.items.length ? c.data.items : [
              { question: "How do I book?", answer: "Use the \"Book a Session\" button or contact us." },
              { question: "Do you help with posing?", answer: "Yes, we guide you into relaxed, natural poses." },
            ];
            break;
          case "pricingTable":
            c.data.heading = c.data.heading || "Session Investment";
            c.data.plans = Array.isArray(c.data.plans) && c.data.plans.length ? c.data.plans : [
              { title: "Essentials", price: "$249", features: ["30 min", "15 edited images"], ctaText: "Book Essentials", ctaLink: "/book-a-session" },
              { title: "Signature", price: "$449", features: ["60 min", "35 edited images"], ctaText: "Book Signature", ctaLink: "/book-a-session" },
            ];
            c.data.columns = c.data.columns || 3;
            break;
          case "ctaBanner":
            c.data.heading = c.data.heading || "Ready to create something beautiful?";
            c.data.primaryButtonText = c.data.primaryButtonText || "Start Your Booking";
            c.data.primaryButtonLink = c.data.primaryButtonLink || "/book-a-session";
            break;
          case "mapEmbed":
            c.data.address = c.data.address || "Pinehurst, TX";
            c.data.lat = c.data.lat ?? 30.1737;
            c.data.lng = c.data.lng ?? -95.6886;
            c.data.zoom = c.data.zoom || 11;
            c.data.height = c.data.height || "md";
            c.data.showMarker = c.data.showMarker ?? true;
            c.data.mapType = c.data.mapType || "roadmap";
            break;
          case "seoFooter":
            c.data.content = c.data.content || "**Studio37 Photography – Pinehurst, TX**\nPortraits, families, branding & events. Book a session today.";
            c.data.includeSchema = !!c.data.includeSchema;
            break;
        }
        components.push(c);
      };

      let parsed: any;
      try { parsed = JSON.parse(aiText); } catch {}

      const title = (parsed?.title as string) || "AI Generated Page";
      const suggestedSlug = (parsed?.suggestedSlug as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "ai-page";
      const notes = (parsed?.notes as string) || "Generated from prompt.";
      const rawComponents = Array.isArray(parsed?.components) ? parsed.components : [];
      if (rawComponents.length) {
        rawComponents.forEach(push);
      }

      // If nothing came through, provide a sensible default structure
      if (components.length === 0) {
        push({ type: "hero" });
        push({ type: "text" });
        push({ type: "servicesGrid" });
        push({ type: "faq" });
        push({ type: "pricingTable" });
        push({ type: "mapEmbed" });
        push({ type: "ctaBanner" });
        push({ type: "seoFooter" });
      }

      return { title, suggestedSlug, notes, components };
    };

    try {
      const normalized = normalize(aiText);
      return NextResponse.json(normalized);
    } catch (e) {
      return NextResponse.json({ error: "Failed to normalize AI output" }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Site generation failed" }, { status: 500 });
  }
}
