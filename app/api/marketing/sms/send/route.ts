import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const log = createLogger("api/marketing/sms/send");

interface SendSMSRequest {
  to: string | string[];
  message: string;
  templateId?: string;
  variables?: Record<string, any>;
  campaignId?: string;
  leadId?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers as any);
    const rl = rateLimit(`sms-send:${ip}`, { limit: 5, windowMs: 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many SMS requests" },
        { status: 429 }
      );
    }

    // Check if Twilio credentials are configured
    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER,
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      log.error("Twilio credentials not configured");
      return NextResponse.json(
        { error: "SMS service not configured" },
        { status: 503 }
      );
    }

    const body: SendSMSRequest = await req.json();
    const {
      to,
      message,
      templateId,
      variables = {},
      campaignId,
      leadId,
    } = body;

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 }
      );
    }

    let smsMessage = message;

    // If template ID provided, fetch and render template
    if (templateId) {
      const { data: template, error: templateError } = await supabase
        .from("sms_templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (templateError || !template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // Replace variables in template
      smsMessage = renderTemplate(template.message_body, variables);
    }

    // Prepare recipients array
    const recipients = Array.isArray(to) ? to : [to];
    const results: any[] = [];

    // Import Twilio dynamically (only when needed)
    const twilio = require("twilio");
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Send SMS messages
    for (const recipient of recipients) {
      try {
        // Validate phone number format (basic check)
        const cleanPhone = recipient.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
          results.push({
            recipient,
            success: false,
            error: "Invalid phone number format",
          });
          continue;
        }

        // Format phone number (add +1 if US number and no country code)
        const formattedPhone = cleanPhone.startsWith("1")
          ? `+${cleanPhone}`
          : `+1${cleanPhone}`;

        const twilioMessage = await client.messages.create({
          body: smsMessage,
          from: TWILIO_PHONE_NUMBER,
          to: formattedPhone,
        });

        log.info("SMS sent successfully", {
          recipient: formattedPhone,
          sid: twilioMessage.sid,
        });

        results.push({
          recipient,
          success: true,
          messageSid: twilioMessage.sid,
          status: twilioMessage.status,
        });

        // Track successful send if campaign
        if (campaignId) {
          await trackCampaignSend(
            campaignId,
            formattedPhone,
            leadId,
            twilioMessage.status,
            twilioMessage.sid
          );
        }
      } catch (err: any) {
        log.error("SMS send exception", { recipient }, err);
        results.push({
          recipient,
          success: false,
          error: err.message,
          code: err.code,
        });

        // Track failed send if campaign
        if (campaignId) {
          await trackCampaignSend(
            campaignId,
            recipient,
            leadId,
            "failed",
            null,
            err.message,
            err.code
          );
        }
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: failCount === 0,
      results,
      summary: {
        total: recipients.length,
        sent: successCount,
        failed: failCount,
      },
    });
  } catch (err: any) {
    log.error("SMS API error", undefined, err);
    return NextResponse.json(
      { error: err.message || "Failed to send SMS" },
      { status: 500 }
    );
  }
}

// Helper: Replace {{variables}} in template
function renderTemplate(template: string, variables: Record<string, any>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, String(value || ""));
  });
  return result;
}

// Helper: Track campaign send in database
async function trackCampaignSend(
  campaignId: string,
  recipientPhone: string,
  leadId: string | undefined,
  status: string,
  providerMessageSid: string | null = null,
  errorMessage: string | null = null,
  errorCode: string | null = null
) {
  try {
    const sendData: any = {
      campaign_id: campaignId,
      recipient_phone: recipientPhone,
      status,
      provider: "twilio",
      ...(leadId && { lead_id: leadId }),
      ...(providerMessageSid && { provider_message_sid: providerMessageSid }),
      ...(errorMessage && { error_message: errorMessage }),
      ...(errorCode && { error_code: errorCode }),
      ...(status === "queued" || status === "sent") && {
        sent_at: new Date().toISOString(),
      },
    };

    await supabase.from("sms_campaign_sends").insert(sendData);

    // Update campaign totals
    const updateField =
      status === "queued" || status === "sent"
        ? "total_sent"
        : status === "failed"
        ? "total_failed"
        : null;

    if (updateField) {
      await supabase.rpc("increment_campaign_stat", {
        campaign_id: campaignId,
        stat_field: updateField,
      });
    }
  } catch (err) {
    log.error("Failed to track SMS campaign send", { campaignId, recipientPhone }, err);
  }
}
