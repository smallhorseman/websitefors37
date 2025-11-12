# Chatbot Quote Builder & Admin Import Guide

## Overview

Two powerful new features have been added to enhance your chatbot:

1. **Quote Builder Form** - Structured lead capture in the chat UI
2. **Admin Content Import** - One-click button to refresh chatbot training data

---

## 1. Quote Builder Form

### What It Does

When a visitor clicks "Get a quote" in the chatbot, instead of just sending a text message, they now see a mini-form that captures:

- **Service Type** (required) - Wedding, Portrait, Event, Commercial, etc.
- **Hours Needed** - e.g., "4-6 hours"
- **Headcount** - e.g., "50-100 guests"
- **Location** - Venue name or city
- **Event Date** - Date picker
- **Additional Notes** - Free text for special requirements

### How It Works

**User Flow:**

1. Visitor asks about pricing or clicks "Get a quote" quick action
2. Quote form slides into view in the chat
3. They fill out the structured fields
4. Submit → Saved to `leads` table with rich metadata
5. Bot confirms receipt and next steps

**Lead Data:**

The quote request is saved with:

```txt
source: "chatbot-quote-form"
service_interest: [Selected service]
message: Formatted details with all fields + conversation context
status: "new"
```

**Example Lead Message:**

```txt
**Quote Request**
Service: Wedding Photography
Hours needed: 8-10 hours
Headcount: 150
Location: The Woodlands Country Club
Event Date: 2026-06-20
Additional Notes: Outdoor ceremony, need drone shots

--- Conversation Context ---
[bot] Hi! 👋 I'm the Studio37 AI assistant...
[user] I'm getting married next summer
[bot] Congratulations! When's the big day?
```

### Triggering the Form

The form appears when:

- User clicks "Get a quote" quick action button
- Bot detects pricing intent + detected service from conversation

You can customize the trigger logic in `components/EnhancedChatBot.tsx`:

```typescript
if (reply === "Get a quote") {
  setQuoteFormData((prev) => ({
    ...prev,
    service: inferred, // Pre-fills from conversation
  }));
  setShowQuoteForm(true);
  return;
}
```

### Customizing Fields

To add/remove fields, edit the `QuoteFormData` interface and form JSX in `components/EnhancedChatBot.tsx`:

```typescript
interface QuoteFormData {
  service: string;
  hours?: string;
  headcount?: string;
  location?: string;
  eventDate?: string;
  additionalNotes?: string;
  // Add your custom fields here
}
```

---

## 2. Admin Content Import

### Usage

A button in `/admin/chatbot-training` that triggers the website content import script **server-side**, refreshing all chatbot training data from:

- Published `content_pages` (including sub-service pages)
- Blog posts
- Gallery portfolio
- Business settings
- Service package details (hardcoded in script)
- Curated FAQs

### How to Use

1. Go to `/admin/chatbot-training`
2. Click **"Import Website Content"** button (top right)
3. Confirm the dialog
4. Wait ~30-60 seconds for import to complete
5. Success message shows total entries imported
6. Training examples list refreshes automatically

### When to Re-Import

Run the import whenever you:

- Add new service pages
- Update pricing or package details
- Publish new blog posts
- Change business info (hours, contact)
- Add new content pages

### Technical Details

**API Route:** `/api/admin/chatbot/import-content` (POST)

- Protected by admin session authentication
- Deletes existing auto-imported entries (those with `source_url`)
- Keeps manual entries (no `source_url`)
- Inserts new content in batches of 50

**Source:** `app/api/admin/chatbot/import-content/route.ts`

**Response:**

```json
{
  "success": true,
  "message": "Successfully imported 95 training entries",
  "total": 95,
  "imported": 95
}
```

### Troubleshooting

**Import fails with 401:**

- Session expired → Log out and back in to admin
- Cookie issue → Check browser allows cookies

**Import fails with 500:**

- Check server logs for details
- Verify Supabase env vars are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**No entries imported:**

- Check `content_pages` table has `status='published'` rows
- Verify blog posts are published
- Review server logs for specific errors

---

## Testing

### Quote Builder Test Flow

1. Open chatbot on website
2. Ask: "Can I get a quote for wedding photography?"
3. Bot should show "Get a quote" button
4. Click it → Form appears
5. Fill out:
   - Service: Wedding Photography
   - Hours: 8-10 hours
   - Headcount: 120
   - Location: Houston
   - Event Date: [Pick a date]
   - Notes: Outdoor ceremony
6. Submit
7. Verify:
   - Success message appears
   - Check `/admin/leads` → New lead with "chatbot-quote-form" source
   - Message field has structured details

### Admin Import Test Flow

1. Go to `/admin/chatbot-training`
2. Note current entry count
3. Click "Import Website Content"
4. Confirm dialog
5. Wait for success message
6. Verify:
   - Entry count increases/updates
   - Check entries for your sub-service pages (search for service names)
   - Test chatbot with a question about a sub-service (e.g., "Do you do corporate headshots?")
   - Bot should cite the correct page and show "View details" link

---

## Files Changed

### New Files

- `app/api/admin/chatbot/import-content/route.ts` - Server-side import API
- `CHATBOT_QUOTE_BUILDER_GUIDE.md` - This guide

### Modified Files

- `components/EnhancedChatBot.tsx`
  - Added `QuoteFormData` interface
  - Added quote form UI (modal in messages area)
  - Added `handleQuoteFormSubmit` function
  - Modified `handleQuickReply` to show form on "Get a quote"
  - Added `showQuoteForm` state

- `app/admin/chatbot-training/page.tsx`
  - Added `importing` state
  - Added `handleImportContent` function
  - Added "Import Website Content" button in header

---

## Next Steps (Optional Enhancements)

### Quote Builder

- **Add budget field** - Dropdown or range slider
- **Multi-step form** - Break into pages (service → details → contact → submit)
- **Conditional fields** - Show different fields per service type
- **File upload** - Inspiration photos or mood boards
- **Calendar integration** - Check availability before submission

### Admin Import

- **Scheduled imports** - Cron job to auto-refresh daily/weekly
- **Selective import** - Checkboxes to choose what to import
- **Import history** - Log of past imports with timestamp and entry count
- **Preview mode** - See what will be imported before committing

### Lead Management

- **Auto-response email** - Send quote request confirmation
- **Lead scoring** - Rank leads by completeness and intent
- **CRM sync** - Push to external CRM (HubSpot, Salesforce)
- **Follow-up automation** - Trigger emails if no response in 24h

---

## Summary

**Quote Builder:**

- ✅ Structured lead capture in chat
- ✅ Pre-filled from conversation context
- ✅ Saves to `leads` table with rich metadata
- ✅ Improves lead quality and reduces back-and-forth

**Admin Import:**

- ✅ One-click content refresh
- ✅ Server-side execution (no local script needed)
- ✅ Protected by admin auth
- ✅ Auto-reloads chatbot training data

Both features are live and ready to test!
