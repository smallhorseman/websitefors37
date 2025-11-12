import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/marketing/campaigns");

// GET /api/marketing/campaigns - List all campaigns
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "email"; // 'email' or 'sms'
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const table = type === "email" ? "email_campaigns" : "sms_campaigns";

    let query = supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      campaigns: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    log.error("Failed to fetch campaigns", undefined, err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

// POST /api/marketing/campaigns - Create new campaign
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = "email", // 'email' or 'sms'
      name,
      subject,
      html_content,
      text_content,
      message_body,
      template_id,
      target_type = "all",
      target_criteria,
      recipient_ids,
      scheduled_at,
      from_name,
      from_email,
      tags,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
    }

    const table = type === "email" ? "email_campaigns" : "sms_campaigns";

    // Calculate recipient count based on targeting
    let recipientCount = 0;
    if (target_type === "all") {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });
      recipientCount = count || 0;
    } else if (target_type === "individual" && recipient_ids) {
      recipientCount = recipient_ids.length;
    } else if (target_type === "segment" && target_criteria) {
      // Build query based on criteria
      let query = supabase.from("leads").select("*", { count: "exact", head: true });

      if (target_criteria.status) {
        query = query.in("status", target_criteria.status);
      }
      if (target_criteria.service_interest) {
        query = query.in("service_interest", target_criteria.service_interest);
      }

      const { count } = await query;
      recipientCount = count || 0;
    }

    const campaignData: any = {
      name,
      status: scheduled_at ? "scheduled" : "draft",
      target_type,
      total_recipients: recipientCount,
      ...(template_id && { template_id }),
      ...(target_criteria && { target_criteria }),
      ...(recipient_ids && { recipient_ids }),
      ...(scheduled_at && { scheduled_at }),
      ...(tags && { tags }),
    };

    if (type === "email") {
      if (!subject || (!html_content && !text_content)) {
        return NextResponse.json(
          { error: "Subject and content are required for email campaigns" },
          { status: 400 }
        );
      }
      campaignData.subject = subject;
      campaignData.html_content = html_content;
      campaignData.text_content = text_content;
      campaignData.from_name = from_name || "Studio37 Photography";
      campaignData.from_email = from_email || "contact@studio37.cc";
    } else {
      if (!message_body) {
        return NextResponse.json(
          { error: "Message body is required for SMS campaigns" },
          { status: 400 }
        );
      }
      campaignData.message_body = message_body;
      // Calculate SMS cost estimate (approx $0.0075 per segment)
      const segments = Math.ceil(message_body.length / 160);
      campaignData.estimated_cost_cents = recipientCount * segments * 0.75;
    }

    const { data, error } = await supabase.from(table).insert(campaignData).select().single();

    if (error) throw error;

    log.info("Campaign created", { type, campaignId: data.id, name });

    return NextResponse.json({ campaign: data }, { status: 201 });
  } catch (err: any) {
    log.error("Failed to create campaign", undefined, err);
    return NextResponse.json(
      { error: err.message || "Failed to create campaign" },
      { status: 500 }
    );
  }
}
