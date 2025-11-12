# Form Auto-Response Email Setup

## ⚠️ IMPORTANT: You didn't receive an email because the database migration hasn't been run yet!

## Quick Setup (3 steps)

### Step 1: Run the Database Migration

The email templates need to be created in your Supabase database first.

**Option A: Via Supabase Dashboard (Easiest)**
1. Go to https://supabase.com/dashboard
2. Select your Studio37 project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the entire contents of `supabase/migrations/2025-11-12_form_autoresponse_templates.sql`
6. Click "Run" (or press Cmd+Enter)
7. You should see "Success. No rows returned"

**Option B: Via Supabase CLI**
```bash
supabase db push
```

### Step 2: Deploy the Code

The updated `/app/api/leads/route.ts` needs to be deployed to Netlify.

**Commit and push your changes:**
```bash
git add .
git commit -m "Add form auto-response email system"
git push origin main
```

Netlify will automatically deploy within 2-3 minutes.

### Step 3: Test It!

1. Go to https://www.studio37.cc/contact
2. Fill out the contact form with YOUR email address
3. Submit the form
4. Check your inbox - you should receive either:
   - **Contact Form Confirmation** (for general inquiries)
   - **Booking Request Confirmation** (for wedding/event/portrait inquiries)

## What Was Built

### 4 New Email Templates

1. **ContactFormConfirmationEmail** (`contact-form-confirmation`)
   - Sent for general contact form submissions
   - Green success header with checkmark
   - Echoes the user's message for confirmation
   - Quick links to portfolio, services, about, blog
   - Urgent contact callout with phone/text option

2. **BookingRequestConfirmationEmail** (`booking-request-confirmation`)
   - Sent when user selects wedding/portrait/event service
   - Gradient amber header with camera icon
   - Request summary showing all details
   - 3-step timeline: Quote in 24h → Consultation → Book with deposit
   - Portfolio CTA and urgent availability option

3. **CouponDeliveryEmail** (`coupon-delivery`)
   - For promotional code campaigns (future use)
   - Pink/purple gradient with celebration emoji
   - Dashed coupon box with big discount display
   - Expiry countdown and terms

4. **NewsletterWelcomeEmail** (`newsletter-welcome`)
   - For newsletter signups (future use)
   - Blue gradient with welcome banner
   - What-to-expect benefits list
   - Social media follow buttons
   - 10% welcome discount offer

### Smart Template Detection

The system automatically chooses the right template:

```typescript
// Keywords that trigger booking confirmation
const bookingKeywords = ['wedding', 'event', 'portrait', 'session', 'photoshoot', 'commercial']

// If user selects any of these services OR includes event_date
→ Sends "Booking Request Confirmation"

// Otherwise
→ Sends "Contact Form Confirmation"
```

### Files Modified

- ✅ `emails/ContactFormConfirmationEmail.tsx` - New React Email component
- ✅ `emails/BookingRequestConfirmationEmail.tsx` - New React Email component
- ✅ `emails/CouponDeliveryEmail.tsx` - New React Email component
- ✅ `emails/NewsletterWelcomeEmail.tsx` - New React Email component
- ✅ `lib/emailRenderer.ts` - Registered all 4 new templates
- ✅ `app/api/leads/route.ts` - Added auto-response trigger
- ✅ `supabase/migrations/2025-11-12_form_autoresponse_templates.sql` - Database templates
- ✅ `app/admin/inbox/page.tsx` - Fixed Supabase client bug (bonus fix!)

## How It Works

1. **User submits form** → POST to `/api/leads`
2. **Lead saved to database** → Returns lead ID
3. **Template selected** → Based on service_interest keywords
4. **Template ID fetched** → From `email_templates` table by slug
5. **Name parsed** → Split into firstName/lastName
6. **Variables prepared** → Map form data to template props
7. **Email sent** → Via `/api/marketing/email/send` with React Email rendering
8. **User receives email** → Within seconds, branded and professional

### Fire-and-Forget Pattern

The email send is **non-blocking**:
```typescript
sendAutoResponseEmail(insertedLead, payload).catch(err => {
  log.error('Auto-response email failed', { leadId: insertedLead.id }, err)
})

return NextResponse.json({ success: true }) // User doesn't wait
```

This ensures:
- Fast form submission response (< 500ms)
- Email failures don't break the form
- Errors are logged for debugging

## Troubleshooting

### "I still didn't get an email"

**Check the Supabase logs:**
1. Go to Supabase Dashboard → Logs
2. Look for errors around the time you submitted
3. Common issues:
   - Template not found (migration not run)
   - RESEND_API_KEY missing from env vars
   - Email address typo in form

**Check Netlify function logs:**
1. Go to Netlify Dashboard → Functions
2. Find `api/leads` and `api/marketing/email/send`
3. Check for errors in last invocations

**Verify environment variables:**
- `RESEND_API_KEY` must be set in Netlify
- `EMAIL_FROM` should be configured
- `NEXT_PUBLIC_SITE_URL` should be `https://www.studio37.cc`

### "Email template not found"

The migration hasn't been run. Go back to Step 1.

### "Email arrived but looks broken"

React Email inline styles require email client support. Test in:
- Gmail (desktop + mobile)
- Apple Mail
- Outlook

### "Wrong template was sent"

Check the service_interest value you selected:
- `wedding`, `event`, `portrait`, `commercial` → Booking template
- Anything else → Contact template

## Testing Different Templates

**Test Contact Form Confirmation:**
- Service: "Other"
- Message: "I have a question about pricing"

**Test Booking Request Confirmation:**
- Service: "Wedding Photography"
- Event Date: [any future date]
- Message: "I'm interested in booking"

**Future: Coupon Delivery**
Will be sent via marketing campaigns (not form submission)

**Future: Newsletter Welcome**
Will be sent when newsletter signup form is added

## Next Steps

Once this is working, you can:

1. **Add newsletter signup** → Trigger newsletter-welcome email
2. **Create coupon campaigns** → Use coupon-delivery template
3. **Build more auto-responses** → Cart abandonment, payment reminders, etc.
4. **Add email tracking** → Open rates, click rates via Resend webhooks

## Files You Need to Deploy

Make sure these are committed and pushed:

```
emails/
  ContactFormConfirmationEmail.tsx
  BookingRequestConfirmationEmail.tsx
  CouponDeliveryEmail.tsx
  NewsletterWelcomeEmail.tsx
lib/
  emailRenderer.ts
app/api/leads/
  route.ts
app/admin/inbox/
  page.tsx
supabase/migrations/
  2025-11-12_form_autoresponse_templates.sql
```

Run migration → Push code → Test form → 🎉
