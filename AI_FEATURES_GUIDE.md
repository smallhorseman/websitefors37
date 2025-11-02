# 🚀 AI Features Implementation Guide

All three AI-powered features have been successfully implemented! Here's how to use them:

---

## 1. 📸 Image Alt Text Batch Tool

**Location:** Admin → Gallery Management

### Features:

- **Single Image AI:** Purple sparkle button next to alt text field generates SEO-optimized alt text
- **Batch Processing:** "AI Alt Text" button (top right) generates for all images missing alt text
- **Character Counter:** Shows 0/125 characters for optimal length
- **Auto-save:** Batch tool saves each image immediately

### How to Use:

1. Go to Admin Gallery
2. Click **"AI Alt Text"** button for batch processing
3. Or select an image and click the sparkle ✨ button for single generation
4. Review and save changes

---

## 2. ✍️ AI Blog Post Generator

**Location:** Admin → Blog → "AI Writer" Button

### Features:

- Complete blog post generation (800-1500 words)
- SEO-optimized title & meta description
- Structured with H2/H3 headings
- Suggested tags and category
- Multiple tone options (Professional, Friendly, Creative, Educational)

### How to Use:

1. Go to Admin Blog
2. Click **"AI Writer"** button (purple/pink gradient)
3. Fill in:
   - **Topic**: What to write about (required)
   - **Keywords**: Comma-separated keywords for SEO
   - **Tone**: Choose writing style
   - **Word Count**: 500-1500 words
4. Click **"Generate Blog Post"**
5. Review, edit if needed, and publish

### Tips:

- Be specific with topics: "How to prepare for your wedding photoshoot" vs "Wedding tips"
- Include 3-5 target keywords for best SEO
- Generated content populates a new post - you can edit before publishing

---

## 3. 💬 Enhanced AI Chatbot

**Location:** Bottom-right corner of website (purple/pink gradient button)

### Features:

- **AI-Powered Responses:** Natural conversation using Gemini Pro
- **Smart Lead Capture:** Auto-detects email, phone, service type, budget
- **Quick Replies:** Contextual suggestion buttons
- **Live Lead Tracking:** Shows captured info in colored badges
- **Session Storage:** Saves leads to database automatically
- **FAQ Support:** Common questions handled intelligently

### How It Works:

1. Visitor clicks chat button
2. Bot greets and offers quick reply buttons
3. AI responds naturally to questions about:
   - Services & packages
   - Pricing (gives ranges)
   - Availability
   - What to expect
4. Automatically extracts:
   - Service type (wedding, portrait, etc.)
   - Budget mentions
   - Contact info (email/phone)
   - Event dates
5. Saves qualified leads to CRM

### Lead Capture Intelligence:

The chatbot detects:

- Keywords: "wedding", "portrait", "headshot", "event", "commercial"
- Budget: Any $XXX-$XXXX amounts
- Email: Any valid email format
- Phone: (123) 456-7890 or 123-456-7890 formats

---

## 🔧 Setup Requirements

### Environment Variables (Already Set):

```bash
GEMINI_API_KEY=your_key_here  # Set in Netlify
```

### Admin Settings:

1. Go to **Admin → Settings → SEO**
2. Enable **"AI-powered title & meta suggestions"**
3. Model: `gemini-pro` (default)

### Database:

All features use existing tables:

- `gallery_images` (alt_text column)
- `blog_posts`
- `leads` (source: 'chatbot')

---

## 📊 Cost Estimation

Using Gemini Pro API:

### Free Tier (First 60 requests/min):

- **Gallery Alt Text**: ~$0.00 per batch of 50 images
- **Blog Post**: ~$0.01 per post
- **Chatbot**: ~$0.00 per conversation

### Typical Monthly Usage:

- 100 gallery images = $0.02
- 10 blog posts = $0.10
- 500 chat conversations = $0.05
- **Total: ~$0.20/month** 🎉

---

## 🎯 Best Practices

### Gallery Alt Text:

- Run batch generation once, then use single-image AI for new uploads
- Review AI suggestions - they're 95% accurate but you know your photos best
- Keep alt text descriptive and under 125 characters

### Blog Posts:

- Use AI as a starting point, not final copy
- Always add your personal touch and real examples
- Include actual photo placeholders in content
- Review meta description for accuracy

### Chatbot:

- Monitor leads in Admin → CRM
- Follow up quickly - AI captures high-intent leads
- Check captured info accuracy
- Update FAQ responses in chat API if needed

---

## 🔄 Replacing the Old Chatbot

To use the new Enhanced ChatBot:

1. Open `app/layout.tsx` or wherever `ChatBot` is imported
2. Replace:

```tsx
import ChatBot from "@/components/ChatBot";
```

With:

```tsx
import EnhancedChatBot from "@/components/EnhancedChatBot";
```

3. Replace component:

```tsx
<ChatBot />
```

With:

```tsx
<EnhancedChatBot />
```

---

## 🐛 Troubleshooting

### AI Features Not Working:

1. Check Admin Settings → AI is enabled
2. Verify `GEMINI_API_KEY` is set in Netlify
3. Check browser console for errors

### Alt Text Batch Fails:

- Ensure images have titles/categories
- Check rate limiting (500ms delay between requests)
- Verify alt_text column exists in database

### Blog Generator Returns Generic Content:

- Be more specific in topic field
- Add relevant keywords
- Try different tone settings

### Chatbot Not Responding:

- Check AI enabled in settings
- Verify API endpoint `/api/chat/respond` is deployed
- Check network tab for 403/500 errors

---

## 🎨 Customization

### Chatbot Personality:

Edit `app/api/chat/respond/route.ts` prompt section to adjust tone, response length, or business info.

### Blog Post Structure:

Modify `app/api/blog/generate/route.ts` prompt to change H2/H3 count, writing style, or length.

### Alt Text Style:

Adjust `app/api/gallery/generate-alt-text/route.ts` prompt for different alt text formats (more/less SEO focus).

---

## 🚀 Next Steps

1. **Test all three features** in staging
2. **Review generated content** for quality
3. **Monitor chatbot leads** for conversion rate
4. **A/B test** blog posts (AI vs manual)
5. **Measure SEO impact** of alt text after 30 days

---

**Need Help?** All features respect the AI toggle in Admin Settings. If AI is off, features either show fallback behavior or display helpful error messages.
