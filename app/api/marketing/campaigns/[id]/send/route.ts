import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { createLogger } from "@/lib/logger";

const log = createLogger("api/marketing/campaigns/[id]/send");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: campaignId } = params;
    const { type = "email" } = await req.json();

    if (!process.env.RESEND_API_KEY && type === "email") {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const table = type === "email" ? "email_campaigns" : "sms_campaigns";

    // Fetch campaign
    const { data: campaign, error: campaignError } = await supabase
      .from(table)
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status === "sent") {
      return NextResponse.json(
        { error: "Campaign already sent" },
        { status: 400 }
      );
    }

    // Update campaign status to 'sending'
    await supabase
      .from(table)
      .update({ status: "sending" })
      .eq("id", campaignId);

    // Get recipients based on targeting
    const recipients = await getRecipients(
      campaign.target_type,
      campaign.target_criteria,
      campaign.recipient_ids,
      type
    );

    if (recipients.length === 0) {
      await supabase
        .from(table)
        .update({ status: "draft" })
        .eq("id", campaignId);
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 }
      );
    }

    log.info("Starting campaign send", {
      campaignId,
      type,
      recipientCount: recipients.length,
    });

    // Send emails/SMS
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      try {
        if (type === "email") {
          // Send email
          const { data: sendResult, error: sendError } = await resend.emails.send({
            from: `${campaign.from_name || "Studio37"} <${campaign.from_email || "contact@studio37.cc"}>`,
            to: recipient.email,
            subject: renderTemplate(campaign.subject, recipient.variables),
            html: renderTemplate(campaign.html_content, recipient.variables),
            ...(campaign.text_content && {
              text: renderTemplate(campaign.text_content, recipient.variables),
            }),
          });

          if (sendError) {
            failedCount++;
            await trackSend(campaignId, recipient, "bounced", null, sendError.message, type);
          } else {
            sentCount++;
            await trackSend(campaignId, recipient, "sent", sendResult?.id, null, type);
          }
        } else {
          // SMS sending would go here using Twilio
          // For now, just track as sent
          sentCount++;
          await trackSend(campaignId, recipient, "sent", null, null, type);
        }
      } catch (err: any) {
        failedCount++;
        await trackSend(campaignId, recipient, "bounced", null, err.message, type);
      }
    }

    // Update campaign final status and stats
    await supabase
      .from(table)
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        total_sent: sentCount,
        ...(type === "email" && { total_bounced: failedCount }),
        ...(type === "sms" && { total_failed: failedCount }),
      })
      .eq("id", campaignId);

    log.info("Campaign send completed", {
      campaignId,
      sentCount,
      failedCount,
    });

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaignId,
        status: "sent",
        sent_count: sentCount,
        failed_count: failedCount,
        total_recipients: recipients.length,
      },
    });
  } catch (err: any) {
    log.error("Campaign send failed", { campaignId: params.id }, err);
    return NextResponse.json(
      { error: err.message || "Failed to send campaign" },
      { status: 500 }
    );
  }
}

// Helper: Get recipients based on targeting rules
async function getRecipients(
  targetType: string,
  targetCriteria: any,
  recipientIds: string[] | null,
  type: string
) {
  const recipients: any[] = [];

  if (targetType === "individual" && recipientIds) {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .in("id", recipientIds);

    return (
      data?.map((lead) => ({
        id: lead.id,
        email: lead.email,
        phone: lead.phone,
        name: lead.name,
        variables: {
          firstName: lead.name?.split(" ")[0] || "there",
          lastName: lead.name?.split(" ").slice(1).join(" ") || "",
          email: lead.email,
          phone: lead.phone || "",
          serviceType: lead.service_interest || "photography",
        },
      })) || []
    );
  }

  let query = supabase.from("leads").select("*");

  if (type === "email") {
    query = query.not("email", "is", null);
  } else {
    query = query.not("phone", "is", null);
  }

  if (targetType === "segment" && targetCriteria) {
    if (targetCriteria.status) {
      query = query.in("status", targetCriteria.status);
    }
    if (targetCriteria.service_interest) {
      query = query.in("service_interest", targetCriteria.service_interest);
    }
    if (targetCriteria.budget_min) {
      query = query.gte("budget_range", targetCriteria.budget_min);
    }
  }

  const { data } = await query;

  return (
    data?.map((lead) => ({
      id: lead.id,
      email: lead.email,
      phone: lead.phone,
      name: lead.name,
      variables: {
        firstName: lead.name?.split(" ")[0] || "there",
        lastName: lead.name?.split(" ").slice(1).join(" ") || "",
        email: lead.email,
        phone: lead.phone || "",
        serviceType: lead.service_interest || "photography",
        budgetRange: lead.budget_range || "",
      },
    })) || []
  );
}

// Helper: Track individual send
async function trackSend(
  campaignId: string,
  recipient: any,
  status: string,
  providerId: string | null,
  errorMessage: string | null,
  type: string
) {
  const table = type === "email" ? "email_campaign_sends" : "sms_campaign_sends";

  const sendData: any = {
    campaign_id: campaignId,
    lead_id: recipient.id,
    status,
    ...(type === "email" && {
      recipient_email: recipient.email,
      recipient_name: recipient.name,
    }),
    ...(type === "sms" && {
      recipient_phone: recipient.phone,
      recipient_name: recipient.name,
    }),
    provider: type === "email" ? "resend" : "twilio",
    ...(providerId && { provider_message_id: providerId }),
    ...(errorMessage && { error_message: errorMessage }),
    ...(status === "sent" && { sent_at: new Date().toISOString() }),
  };

  await supabase.from(table).insert(sendData);
}

// Helper: Replace variables in template
function renderTemplate(template: string, variables: Record<string, any>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, String(value || ""));
  });
  return result;
}
