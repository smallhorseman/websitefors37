# SMS Inbox Setup Guide

Your SMS inbox (Textline-style) is now ready! Here's how to get it fully operational.

## 🎯 What You Get

- **Two-way SMS messaging** with leads from your CRM
- **Unified inbox** - all conversations in one place
- **Quick replies** - saved templates for common responses
- **Real-time updates** - incoming texts appear automatically
- **Lead integration** - messages linked to lead profiles
- **Conversation history** - full SMS thread per contact

## 📋 Setup Steps

### 1. Upload Database Migration

Upload this file to Supabase SQL Editor:
```
supabase/migrations/2025-11-12_sms_inbox.sql
```

This creates:
- `sms_conversations` - conversation threads
- `sms_messages` - individual messages
- `sms_quick_replies` - message templates
- Helper functions for conversation management

### 2. Configure Twilio Webhook

In your [Twilio Console](https://console.twilio.com/):

1. Go to **Phone Numbers** → **Manage** → **Active Numbers**
2. Click on your number: **832-281-6621**
3. Scroll to **Messaging Configuration**
4. Under "A MESSAGE COMES IN":
   - Webhook URL: `https://www.studio37.cc/api/webhooks/twilio/sms`
   - HTTP Method: `POST`
5. Click **Save**

**Test it:** Send a text to 832-281-6621 from your phone. It should appear in `/admin/inbox` within seconds!

### 3. Access Your Inbox

Go to: **https://www.studio37.cc/admin/inbox**

You'll see:
- **Left sidebar:** All conversations with unread counts
- **Center:** Message thread with selected contact
- **Bottom:** Send box (Enter to send, Shift+Enter for new line)

## 🔧 Your Phone Number Options

You have **832-713-9944** on your Pixel 8a and **832-281-6621** in Twilio. Here are your options:

### Option A: Port 832-713-9944 to Twilio ⭐ Recommended

**Pros:**
- One number for everything
- Full SMS inbox integration
- Call forwarding/recording available
- Use Twilio mobile app on your Pixel
- Professional call features (voicemail transcription, etc.)

**Cons:**
- Takes 7-10 business days to port
- Phone will be offline during port (usually <1 hour)

**How to do it:**
1. Twilio Console → **Phone Numbers** → **Buy a Number** → **Port a Number**
2. Enter 832-713-9944 and your carrier info
3. Twilio handles everything with your carrier
4. Update webhook to use your newly ported number

**Cost:** $1/month + usage (same as Twilio number)

### Option B: Dual Number Setup (Easiest - Use Today)

**Keep both numbers:**
- **832-713-9944** (Personal/Pixel) - Your personal line, keep as-is
- **832-281-6621** (Business/CRM) - All CRM communication

**Pros:**
- Works immediately (no porting delay)
- Separate personal/business lines
- No phone downtime

**Cons:**
- Clients might have your old number saved
- Need to gradually migrate clients to new number

**Implementation:**
1. Already configured! Inbox uses 832-281-6621
2. Start giving out 832-281-6621 for new clients
3. Update website/business cards with new number
4. Eventually port 832-713-9944 when ready

### Option C: Forward 832-713-9944 → 832-281-6621

Set up call forwarding from your carrier:
- Incoming to 832-713-9944 → forwards to 832-281-6621
- Twilio captures it → shows in CRM
- Response goes out from 832-281-6621

**Pros:** Clients can still use your original number
**Cons:** They see responses from different number (confusing)

## 🚀 Quick Replies Setup

Pre-loaded templates are ready to use! In the inbox:

1. Type `/` to see available quick replies
2. Examples:
   - `/thanks` - "Thank you for reaching out..."
   - `/confirm` - Appointment confirmation
   - `/gallery` - "Your photos are ready!"

**Add your own:**
1. Go to database: `sms_quick_replies` table
2. Add row with name, shortcut, message_body
3. They'll appear instantly in inbox

## 📱 Using the Inbox

### Send a message:
1. Select conversation from left sidebar
2. Type message in bottom box
3. Press **Enter** to send (or click Send button)

### Incoming messages:
- Appear automatically when client texts 832-281-6621
- Conversation gets unread count badge
- Clicking conversation marks it as read

### Search:
- Use search box at top to find by name, phone, or message content

## 🔐 Security Notes

- Webhook validates Twilio signature (prevents spam)
- Only authenticated admins can access inbox
- Messages stored securely in Supabase

## 📞 Next Steps: Voice Calling

Want to add **click-to-call** from lead profiles?

I can build:
1. **Call button** on each lead card
2. **Browser-based calling** (no phone needed)
3. **Call history** tracked per lead
4. **Voicemail transcription**
5. **Call recording**

All using the same Twilio setup!

## 🆘 Troubleshooting

**Incoming texts not showing:**
- Check Twilio webhook is configured correctly
- Verify URL ends with `/api/webhooks/twilio/sms`
- Check Netlify deploy logs for errors

**Can't send messages:**
- Verify Twilio env vars in Netlify (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
- Check trial account limits (must verify destination numbers)

**Conversations not linking to leads:**
- Phone numbers must match format (stored without +1 prefix)
- Check `leads` table has matching phone number

## 💰 Costs

- **Twilio number:** $1/month (832-281-6621)
- **Incoming SMS:** FREE
- **Outgoing SMS:** $0.0075 per message (less than 1 cent!)
- **Porting 832-713-9944:** One-time $30 fee

Example: 1000 outbound texts = $7.50/month

---

**Ready to test?** Text 832-281-6621 from your phone, then check `/admin/inbox`! 📱
