#!/bin/bash

# DEPLOYMENT SCRIPT FOR AUTO-RESPONSE EMAIL FEATURE
# Run this script to deploy the auto-response email system

set -e

echo "═══════════════════════════════════════════════════════"
echo "  AUTO-RESPONSE EMAIL DEPLOYMENT SCRIPT"
echo "═══════════════════════════════════════════════════════"
echo ""

# Instructions for user
cat << 'INSTRUCTIONS'
⚠️  IMPORTANT: You're working in a GitHub-mounted VS Code workspace.

The changes exist in VS Code's memory but need to be committed to GitHub.

FOLLOW THESE STEPS:

1. In VS Code, press Cmd+Shift+G (or click Source Control icon)

2. You should see these pending changes:
   - app/api/leads/route.ts (modified)
   - lib/emailRenderer.ts (modified)
   - app/admin/inbox/page.tsx (modified)
   - emails/ContactFormConfirmationEmail.tsx (new)
   - emails/BookingRequestConfirmationEmail.tsx (new)
   - emails/CouponDeliveryEmail.tsx (new)
   - emails/NewsletterWelcomeEmail.tsx (new)
   - supabase/migrations/2025-11-12_form_autoresponse_templates.sql (new)
   - FORM_AUTORESPONSE_SETUP.md (new)
   - AUTO_RESPONSE_AUDIT.md (new)

3. Click the "+" icon next to each file to stage it
   (Or click "+" next to "Changes" to stage all)

4. Type this commit message:
   "Add form auto-response email system with 4 React Email templates"

5. Click "Commit" button

6. Click "Sync Changes" button (or push icon)

7. Wait 2-3 minutes for Netlify to deploy

8. Run the database migration (see below)

═══════════════════════════════════════════════════════════
DATABASE MIGRATION
═══════════════════════════════════════════════════════════

Go to: https://supabase.com/dashboard
1. Select your Studio37 project
2. Click "SQL Editor" 
3. Click "+ New Query"
4. Paste this SQL:

INSERT INTO email_templates (name, slug, subject, html_content, category, is_active)
VALUES
  ('Contact Form Confirmation', 'contact-form-confirmation', 'Thanks for Contacting Studio37!', '<p>React Email</p>', 'autoresponse', true),
  ('Booking Request Confirmation', 'booking-request-confirmation', 'We Received Your Booking Request!', '<p>React Email</p>', 'autoresponse', true),
  ('Coupon Delivery', 'coupon-delivery', 'Your Studio37 Discount Code is Ready! 🎁', '<p>React Email</p>', 'promotional', true),
  ('Newsletter Welcome', 'newsletter-welcome', 'Welcome to Studio37 Newsletter! 📸', '<p>React Email</p>', 'newsletter', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = now();

5. Click "Run" (or press Cmd+Enter)

═══════════════════════════════════════════════════════════
TEST IT
═══════════════════════════════════════════════════════════

After deployment completes:
1. Go to https://www.studio37.cc/contact
2. Fill out the form with YOUR email address
3. Submit it
4. Check your inbox for the auto-response email

═══════════════════════════════════════════════════════════

INSTRUCTIONS

echo ""
echo "Press Cmd+Shift+G in VS Code NOW to start the deployment!"
echo ""
