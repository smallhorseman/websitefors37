# CRM Marketing & Client Portal Integration - Complete Guide

**Date:** November 11, 2025  
**Features:** Email Marketing, SMS Campaigns, Client Communication Portal

---

## 🎯 Overview

This integration adds professional marketing automation and client communication capabilities to your Studio37 CRM:

### Email Marketing
- ✅ Create and send email campaigns using **Resend** (modern, reliable email API)
- ✅ Email templates with variable substitution (`{{firstName}}`, `{{sessionDate}}`, etc.)
- ✅ Audience targeting (all leads, segments, individuals)
- ✅ Campaign analytics (sent, delivered, opened, clicked)
- ✅ Automated welcome emails, session reminders, delivery notifications

### SMS Campaigns
- ✅ Send SMS campaigns via **Twilio**
- ✅ SMS templates with character counting (160 chars per segment)
- ✅ Cost estimation before sending
- ✅ Delivery tracking and failure monitoring
- ✅ Appointment confirmations, reminders, quick updates

### Client Communication Portal
- ✅ Client login accounts linked to leads
- ✅ Project management (view sessions, galleries, files)
- ✅ Two-way messaging between clients and studio
- ✅ Payment status tracking
- ✅ Secure file sharing and gallery access

---

## 📋 Prerequisites

### 1. Database Migration
Run the schema migration to create all required tables:

```bash
# Option 1: Via Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Upload supabase/migrations/2025-11-11_marketing_portal.sql
3. Click "Run"

# Option 2: Via psql command line
psql -h <your-supabase-host> -U postgres -d postgres < supabase/migrations/2025-11-11_marketing_portal.sql
```

**Tables created:**
- `email_templates` - Reusable email templates
- `email_campaigns` - Email campaign management
- `email_campaign_sends` - Individual send tracking
- `sms_templates` - Reusable SMS templates
- `sms_campaigns` - SMS campaign management
- `sms_campaign_sends` - SMS send tracking
- `client_portal_users` - Client login accounts
- `client_projects` - Photography projects/sessions
- `client_messages` - Two-way messaging
- `marketing_preferences` - Unsubscribe/preference management

### 2. Install Required Packages

```bash
# Install email service (Resend)
npm install resend

# Install SMS service (Twilio)
npm install twilio

# Already installed: zod for validation, bcrypt for passwords
```

---

## 🔑 API Keys Setup

### Resend (Email Service)

**Why Resend?**
- Modern, developer-friendly API
- Generous free tier (100 emails/day, 3,000/month)
- Excellent deliverability
- No credit card required for free tier

**Setup Steps:**
1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to **API Keys** section
3. Create a new API key
4. Add to your `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Studio37 Photography <contact@studio37.cc>"
```

**Verify Domain (Optional but Recommended):**
1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `studio37.cc`)
3. Add DNS records to your domain provider:
   - SPF record: `v=spf1 include:resend.net ~all`
   - DKIM record: (provided by Resend)
   - DMARC record: `v=DMARC1; p=none; rua=mailto:your-email@studio37.cc`
4. Wait for verification (usually instant)
5. Update `EMAIL_FROM` to use your verified domain

**Pricing:**
- **Free:** 3,000 emails/month, 100/day
- **Pro ($20/month):** 50,000 emails/month, analytics, dedicated IPs

---

### Twilio (SMS Service)

**Why Twilio?**
- Industry-standard SMS platform
- Global reach (220+ countries)
- Reliable delivery tracking
- Pay-as-you-go pricing (~$0.0079/SMS in US)

**Setup Steps:**
1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio) and sign up
2. Get $15 free trial credit
3. From dashboard, note these values:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click to reveal)
4. **Buy a phone number:**
   - Go to **Phone Numbers** → **Buy a number**
   - Search for a local number in your area
   - Select number with SMS capability
   - Purchase ($1/month)
5. Add credentials to `.env.local`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Upgrade from Trial (Required for Production):**
- Trial accounts can only send to verified numbers
- To send to any number, upgrade account:
  1. Add payment method in Console
  2. Upgrade account (no monthly fee, just pay per SMS)
  3. Now you can send to any phone number

**Pricing:**
- **US SMS:** $0.0079 per message
- **Phone number:** $1/month
- **International:** Varies by country ([pricing page](https://www.twilio.com/sms/pricing/us))

---

## 🚀 Usage Guide

### 1. Email Campaigns

#### Creating a Campaign

1. Navigate to **Admin → Marketing** (or `/admin/marketing`)
2. Click **Email Campaigns** tab
3. Click **New Campaign**
4. Fill in details:
   - **Campaign Name:** e.g., "Spring 2025 Promotion"
   - **Subject:** "Special offer for portrait sessions!"
   - **HTML Content:** Full HTML email (use `{{variables}}`)
   - **Target Audience:** All Leads (or segment)
5. Click **Create Campaign** (saves as draft)
6. Click **Send Now** to execute campaign

#### Using Templates

Templates are pre-built with seed data. To use a template:

```typescript
// API call example
const response = await fetch('/api/marketing/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'client@example.com',
    templateId: '<template-id-from-database>',
    variables: {
      firstName: 'John',
      sessionType: 'wedding',
      sessionDate: 'June 15, 2025',
      sessionTime: '10:00 AM',
      location: 'Central Park, Houston',
    },
  }),
})
```

**Built-in Templates:**
1. **Welcome Email** (`welcome-email`)
   - Variables: `firstName`, `serviceType`
   - Use: Onboarding new leads

2. **Session Reminder** (`session-reminder`)
   - Variables: `firstName`, `sessionType`, `sessionDate`, `sessionTime`, `location`
   - Use: 24-48 hours before session

3. **Photos Ready** (`photos-ready`)
   - Variables: `firstName`, `sessionType`, `galleryLink`, `expiryDays`
   - Use: When gallery is delivered

#### Variables Reference

Common variables you can use in templates:

```
{{firstName}}      - First name extracted from lead
{{lastName}}       - Last name
{{email}}          - Email address
{{phone}}          - Phone number
{{serviceType}}    - Service interest (wedding, portrait, etc.)
{{budgetRange}}    - Budget range
{{sessionDate}}    - Appointment/session date
{{sessionTime}}    - Session time
{{location}}       - Session location
{{galleryLink}}    - Link to client gallery
{{expiryDays}}     - Gallery expiry (default 30)
```

---

### 2. SMS Campaigns

#### Creating an SMS Campaign

1. Go to **Admin → Marketing**
2. Click **SMS Campaigns** tab
3. Click **New Campaign**
4. Fill in:
   - **Campaign Name:** "Session Reminder - Week of June 15"
   - **Message Body:** "Hi {{firstName}}! Reminder: Your {{sessionType}} session is tomorrow at {{time}}. See you then! - Studio37"
   - **Target:** All leads with phone numbers
5. **Review cost estimate** (shown based on recipients × segments)
6. Click **Create Campaign** → **Send Now**

#### SMS Best Practices

- ✅ Keep under 160 characters (1 segment = cheaper)
- ✅ Include studio name so recipients know who's texting
- ✅ Provide opt-out option: "Reply STOP to unsubscribe"
- ✅ Send during business hours (9 AM - 8 PM)
- ✅ Avoid marketing after 9 PM (can violate TCPA)
- ❌ Don't use excessive emojis (can trigger spam filters)
- ❌ Don't send promotional SMS without consent (use email instead)

**SMS Template Examples:**

```
Confirmation (96 chars):
Hi {{firstName}}! Your {{sessionType}} session is confirmed for {{date}} at {{time}}. - Studio37

Reminder (87 chars):
Reminder: Your photo session is tomorrow at {{time}}! Location: {{location}}. - Studio37

Delivery (72 chars):
{{firstName}}, your photos are ready! 🎉 View: {{shortLink}} - Studio37
```

---

### 3. Client Portal (Coming Soon)

The client portal allows customers to:
- ✅ Log in with email/password
- ✅ View their photography projects
- ✅ Access galleries and download photos
- ✅ Track payment status
- ✅ Message the studio directly
- ✅ Approve final selections

**To create a client account:**

```sql
-- Option 1: SQL (manual)
INSERT INTO client_portal_users (email, first_name, last_name, lead_id)
VALUES ('client@example.com', 'John', 'Doe', '<lead-id-from-leads-table>');

-- Option 2: API (programmatic)
POST /api/portal/invite
{
  "leadId": "...",
  "email": "client@example.com",
  "sendWelcomeEmail": true
}
```

**Client portal features:**
- **Project Dashboard:** View all sessions (pending, scheduled, completed)
- **Gallery Access:** Browse and download high-res photos
- **Messaging:** Two-way chat with studio
- **Payments:** Track balance and make payments (integrate Stripe later)
- **Approvals:** Select favorites, approve final edits

---

## 📊 Analytics & Tracking

### Email Analytics

Track campaign performance in the database:

```sql
-- Campaign overview
SELECT
  name,
  total_recipients,
  total_sent,
  total_opened,
  total_clicked,
  ROUND((total_opened::decimal / NULLIF(total_sent, 0)) * 100, 2) AS open_rate,
  ROUND((total_clicked::decimal / NULLIF(total_sent, 0)) * 100, 2) AS click_rate
FROM email_campaigns
ORDER BY created_at DESC;

-- Individual email tracking
SELECT
  recipient_email,
  status,
  sent_at,
  opened_at,
  click_count
FROM email_campaign_sends
WHERE campaign_id = '<campaign-id>';
```

### SMS Analytics

```sql
-- SMS campaign stats
SELECT
  name,
  total_recipients,
  total_sent,
  total_delivered,
  total_failed,
  estimated_cost_cents / 100.0 AS estimated_cost_usd,
  actual_cost_cents / 100.0 AS actual_cost_usd
FROM sms_campaigns
ORDER BY created_at DESC;

-- Failed SMS analysis
SELECT
  recipient_phone,
  error_code,
  error_message,
  COUNT(*) AS failure_count
FROM sms_campaign_sends
WHERE status = 'failed'
GROUP BY recipient_phone, error_code, error_message;
```

---

## 🔒 Security & Compliance

### Email Compliance

1. **CAN-SPAM Act (US):**
   - ✅ Include unsubscribe link in every marketing email
   - ✅ Use accurate "From" names and subject lines
   - ✅ Include physical business address in footer
   - ✅ Honor unsubscribe requests within 10 business days

2. **GDPR (EU):**
   - ✅ Obtain explicit consent before sending marketing emails
   - ✅ Provide easy unsubscribe mechanism
   - ✅ Allow users to access/delete their data

**Unsubscribe Implementation:**

```html
<!-- Add to email template footer -->
<p style="font-size:12px;color:#666;">
  Don't want these emails? 
  <a href="https://studio37.cc/unsubscribe?email={{email}}&token={{unsubscribeToken}}">
    Unsubscribe
  </a>
</p>
```

### SMS Compliance

1. **TCPA (Telephone Consumer Protection Act):**
   - ✅ Obtain **written consent** before sending marketing SMS
   - ✅ Include opt-out instructions in first message
   - ✅ Honor STOP requests immediately
   - ❌ Don't use auto-dialers without consent
   - ❌ Don't send marketing texts before 8 AM or after 9 PM (recipient's time zone)

2. **Consent Tracking:**

```sql
-- Track SMS consent in leads table
ALTER TABLE leads ADD COLUMN sms_consent BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN sms_consent_date TIMESTAMP;

-- Only send SMS to consented leads
SELECT * FROM leads WHERE sms_consent = true AND phone IS NOT NULL;
```

---

## 🐛 Troubleshooting

### Email Issues

**Problem:** Emails going to spam

**Solutions:**
1. Verify your domain in Resend
2. Set up SPF, DKIM, DMARC records
3. Warm up your sending (start with 10-50 emails/day, gradually increase)
4. Avoid spam trigger words ("free", "urgent", "act now")
5. Maintain good sender reputation (low bounce/complaint rate)

**Problem:** "API key not configured" error

**Solution:**
```bash
# Check .env.local has:
RESEND_API_KEY=re_...

# Restart Next.js dev server:
npm run dev
```

**Problem:** Rate limit errors

**Solution:**
- Resend free tier: 100 emails/day
- Add delay between sends (500ms) if hitting rate limits
- Upgrade to Pro plan for higher limits

---

### SMS Issues

**Problem:** SMS not sending (trial account)

**Solution:**
- Twilio trial accounts can ONLY send to verified numbers
- Verify recipient numbers in Twilio Console → Verified Caller IDs
- OR upgrade account to send to any number

**Problem:** Invalid phone number error

**Solution:**
```typescript
// Ensure phone numbers are formatted correctly:
// US numbers: +1234567890 or 234-567-8900
// International: include country code

// Clean and format:
const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
const formatted = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`;
```

**Problem:** High failure rate

**Solution:**
- Check phone numbers are valid and active
- Some carriers block automated SMS (use opt-in)
- Avoid URL shorteners (can be flagged as spam)
- Send from a local number (not toll-free)

---

## 💰 Cost Breakdown

### Email (Resend)

| Volume | Plan | Monthly Cost | Per Email |
|--------|------|--------------|-----------|
| 0-3,000 | Free | $0 | $0 |
| 50,000 | Pro | $20 | $0.0004 |
| 100,000 | Pro | $20 | $0.0002 |

**Estimated monthly cost for 10,000 leads:**
- 1 email/month = 10,000 emails = **$20/month** (Pro plan)
- 4 emails/month = 40,000 emails = **$20/month** (Pro plan)

---

### SMS (Twilio)

| Item | Cost |
|------|------|
| Phone number (US) | $1.00/month |
| SMS (US) | $0.0079/message |
| SMS (Canada) | $0.0079/message |
| SMS (UK) | $0.05/message |

**Estimated monthly cost for 1,000 leads:**
- 1 SMS/month = 1,000 messages = **$8.90/month**
- 4 SMS/month = 4,000 messages = **$32.60/month**

**Multi-segment SMS (>160 chars):**
- 161-320 chars = 2 segments = $0.0158/message
- 321-480 chars = 3 segments = $0.0237/message

---

## 📚 API Reference

### Send Individual Email

```typescript
POST /api/marketing/email/send

{
  "to": "client@example.com",
  "subject": "Your Session Details",
  "html": "<h1>Hello!</h1><p>Your session...</p>",
  // OR use template:
  "templateId": "uuid-of-template",
  "variables": {
    "firstName": "John",
    "sessionDate": "June 15, 2025"
  }
}

Response: {
  "success": true,
  "results": [{
    "recipient": "client@example.com",
    "success": true,
    "messageId": "resend-msg-id"
  }]
}
```

---

### Send Individual SMS

```typescript
POST /api/marketing/sms/send

{
  "to": "+1234567890",
  "message": "Hi John! Your session is confirmed for tomorrow at 2 PM. - Studio37",
  // OR use template:
  "templateId": "uuid-of-sms-template",
  "variables": {
    "firstName": "John",
    "time": "2 PM"
  }
}

Response: {
  "success": true,
  "results": [{
    "recipient": "+1234567890",
    "success": true,
    "messageSid": "SM..."
  }]
}
```

---

### Create Campaign

```typescript
POST /api/marketing/campaigns

{
  "type": "email", // or "sms"
  "name": "Spring Promotion 2025",
  "subject": "Limited Time Offer!",
  "html_content": "<h1>Special Deal</h1>...",
  "target_type": "all", // or "segment", "individual"
  "scheduled_at": "2025-06-01T10:00:00Z" // optional
}

Response: {
  "campaign": {
    "id": "uuid",
    "name": "Spring Promotion 2025",
    "status": "draft",
    "total_recipients": 1247
  }
}
```

---

### Send Campaign

```typescript
POST /api/marketing/campaigns/{campaignId}/send

{
  "type": "email" // or "sms"
}

Response: {
  "success": true,
  "campaign": {
    "id": "uuid",
    "status": "sent",
    "sent_count": 1200,
    "failed_count": 47,
    "total_recipients": 1247
  }
}
```

---

## 🎓 Next Steps

### Phase 1: Basic Setup (Complete ✅)
- ✅ Database schema created
- ✅ Email API routes (Resend)
- ✅ SMS API routes (Twilio)
- ✅ Campaign management UI

### Phase 2: Advanced Features (Optional)
- [ ] **Template Editor UI** - Visual email builder (`/admin/marketing/templates`)
- [ ] **Segment Builder** - Create custom audience segments
- [ ] **A/B Testing** - Test subject lines, content variations
- [ ] **Drip Campaigns** - Automated email sequences
- [ ] **Webhook Tracking** - Real-time email open/click events
- [ ] **Client Portal Auth** - Client login and dashboard (`/portal`)

### Phase 3: Integrations (Optional)
- [ ] **Stripe Payments** - Accept payments via client portal
- [ ] **Calendar Integration** - Sync appointments with Google Calendar
- [ ] **Zapier** - Connect to 5,000+ apps
- [ ] **Google Analytics** - Track campaign performance in GA4

---

## 📞 Support

**Issues with this integration?**
- Check `.env.local` has all API keys
- Verify database migration ran successfully
- Check browser console for errors
- Review Resend/Twilio dashboards for API errors

**Resend Support:**
- Docs: https://resend.com/docs
- Status: https://status.resend.com
- Email: support@resend.com

**Twilio Support:**
- Docs: https://www.twilio.com/docs/sms
- Console: https://console.twilio.com
- Support: https://support.twilio.com

---

## 📝 License & Credits

**Email Service:** [Resend](https://resend.com)  
**SMS Service:** [Twilio](https://twilio.com)  
**Framework:** Next.js 14 + Supabase  
**Created:** November 11, 2025

---

**Ready to send your first campaign?** 🚀

1. Run database migration
2. Set up Resend API key
3. Create your first email template
4. Send a test campaign to yourself
5. Roll out to your leads!

Good luck! 📧📱
