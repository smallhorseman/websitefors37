# 🧠 AI Chatbot Training Module - User Guide

## ✨ What You Just Got

A complete AI training system built into your admin dashboard where you can:

✅ **Train the chatbot** with custom Q&A pairs  
✅ **Configure personality** (Friendly, Professional, Casual, Enthusiastic)  
✅ **Set response tone** (Professional, Conversational, Helpful, Concise)  
✅ **Customize messages** (Greeting, fallback, system instructions)  
✅ **Organize by category** (Pricing, Services, Booking, etc.)  
✅ **Real-time updates** - Changes take effect immediately!

---

## 🚀 How to Access

1. Go to **Admin Dashboard**
2. Use the new header button **🧠 AI Training** (top-right), or
3. From **Admin → SEO & AI**, click the **AI Training** quick action card
4. Start training your chatbot!

---

## 📊 Features Breakdown

### 1. Chatbot Personality Settings

Configure how your bot talks:

- **Personality Style**: Friendly & Warm, Professional, Casual, or Enthusiastic
- **Response Tone**: Professional, Conversational, Helpful, or Concise
- **Greeting Message**: First message visitors see
- **Fallback Message**: When AI can't understand a question
- **System Instructions**: Tell the AI who it is and how to behave

**Example:**

```
Personality: Friendly & Warm
Tone: Conversational
System Instructions: "You are Sarah, the lead photographer at Studio37.
You're passionate about capturing authentic moments and love helping
couples plan their perfect wedding day."
```

---

### 2. Training Examples (Q&A Pairs)

Teach your bot specific answers to common questions:

**How It Works:**

1. Choose a **category** (pricing, services, booking, etc.)
2. Enter a **question** customers might ask
3. Provide the **answer** you want the bot to give
4. Click **"Add Example"**

**Example Training Pair:**

```
Category: Pricing
Question: "How much does a wedding package cost?"
Answer: "Our wedding packages start at $2,500 and go up to $5,000+
depending on coverage hours and deliverables. Most couples invest
around $3,500 for 8 hours of coverage. I'd love to create a custom
quote for you - when's your big day?"
```

**Best Practices:**

- ✅ Add 10-20 examples covering your most common questions
- ✅ Write answers in your brand voice
- ✅ Include pricing ranges, not exact prices
- ✅ End with a call-to-action or follow-up question
- ✅ Use natural, conversational language

---

### 3. Categories

Organize your training examples:

- **general** - About your business, location, hours
- **pricing** - Package costs, payment plans
- **services** - What you offer (weddings, portraits, etc.)
- **booking** - How to schedule, availability
- **packages** - Package details, inclusions
- **availability** - Dates, locations served
- **portfolio** - Past work, style questions
- **contact** - How to reach you

---

## 🎯 Quick Start Guide

### Step 1: Configure Personality (1 minute)

1. Open **Admin → AI Training**
2. Set **Personality** to match your brand (e.g., "Friendly & Warm")
3. Set **Tone** (e.g., "Conversational")
4. Customize the **Greeting Message**
5. Click **"Save Settings"**

### Step 2: Add Your First 5 Training Examples (5 minutes)

Add these essential Q&A pairs:

**Example 1: Services**

```
Q: What services do you offer?
A: We specialize in wedding photography, engagement sessions,
bridal portraits, and family photos. Every package is tailored
to your unique needs!
```

**Example 2: Pricing**

```
Q: How much do you charge?
A: Our packages start at $1,500 and range up to $5,000+ depending
on what you need. Most clients invest around $2,500-$3,500.
What type of session are you looking for?
```

**Example 3: Booking**

```
Q: How do I book a session?
A: Easy! Just fill out our contact form or call us directly.
We'll chat about your vision, create a custom quote, and secure
your date with a deposit. Ready to get started?
```

**Example 4: Availability**

```
Q: Are you available for my date?
A: I'd love to check! What's your date and location? Our calendar
fills up 6-12 months in advance for weddings, so the sooner
you book, the better!
```

**Example 5: Portfolio**

```
Q: Can I see your work?
A: Absolutely! Check out our full portfolio at [your website].
We also post recent sessions on Instagram @studio37photography.
What style are you drawn to?
```

### Step 3: Test It Out! (2 minutes)

1. Go to your **live website**
2. Click the **chatbot** button (bottom right)
3. Ask one of your trained questions
4. See how the AI responds using your training!

---

## 💡 Pro Tips

### Make Your Bot Sound Human

**❌ Bad Example:**

```
Q: What is your pricing?
A: Pricing information can be found on our website.
```

**✅ Good Example:**

```
Q: What are your wedding package prices?
A: Great question! Our wedding collections start at $2,500 and
go up to $5,000+. Most couples invest around $3,500 for full-day
coverage. I'd love to create a custom quote just for you -
when's the big day? 📸
```

### Use Brand Voice

If you're:

- **Luxury/High-End**: Use "collection" instead of "package", "invest" instead of "cost"
- **Fun/Casual**: Use emojis, exclamation points, friendly language
- **Professional**: Focus on expertise, experience, quality

### Handle Objections

Add training for common concerns:

```
Q: That seems expensive
A: I totally understand! Professional photography is an investment.
Here's what you get: 8 hours of expert coverage, 500+ edited
high-res images, online gallery, and print rights. These are
the photos you'll treasure forever! Many couples say it was
the best money they spent. Want to chat about payment plans?
```

---

## 🔧 Technical Details

### Database Tables

Your training data is stored in:

- `chatbot_training` - Q&A examples
- `chatbot_settings` - Personality config

### How Training Works

1. **Training Examples** are loaded when someone chats
2. **AI** uses them as reference context
3. **Gemini 2.5 Pro** generates responses based on:
   - Your system instructions
   - Personality & tone settings
   - Training examples
   - Conversation context
   - Lead information (if captured)

### Privacy & Security

- ✅ Training data stored in your Supabase database
- ✅ Only admins can access training page
- ✅ No sensitive data in prompts
- ✅ Conversations are contextual, not stored long-term

---

## 📈 Measuring Success

**Good Signs Your Training is Working:**

- ✅ Bot answers match your brand voice
- ✅ Visitors ask follow-up questions
- ✅ Lead capture rate increases
- ✅ Fewer "I don't understand" responses
- ✅ More qualified inquiries in your CRM

**Optimization:**

1. **Week 1**: Add 10-15 core examples
2. **Week 2**: Review chat logs, add missing Q&As
3. **Week 3**: Refine personality based on feedback
4. **Month 2**: Have 30-40 examples covering all topics
5. **Ongoing**: Add seasonal Q&As (wedding season, holiday photos)

---

## 🚨 Troubleshooting

### Bot Not Using Training Data

1. Make sure **AI is enabled** in Admin → Settings
2. Check **GEMINI_API_KEY** is set in Netlify
3. Verify you **saved settings** after adding examples
4. Try **refreshing** the training page

### Responses Don't Match Training

- AI uses examples as **context**, not exact scripts
- Add more examples for better accuracy
- Make your **system instructions** more specific
- Adjust **personality & tone** settings

### Changes Not Showing

- Changes are **instant** - no deployment needed
- Clear browser cache if testing
- Check the training example was actually saved (refresh page)

---

## 🎨 Advanced Customization

### Season-Specific Training

Add examples based on time of year:

**Wedding Season (Spring/Summer):**

```
Q: Do you have availability in June?
A: June is our busiest month! We have limited dates left.
Let's check the calendar together - what's your exact date?
```

**Holiday Season:**

```
Q: Do you do family Christmas photos?
A: Yes! Our holiday mini sessions are $350 and include 20 edited
images. They book fast - want to reserve your spot?
```

### Location-Based Answers

```
Q: Do you travel to Austin?
A: Absolutely! We serve all of Texas and love destination work.
There's a travel fee for locations beyond 50 miles from Houston.
Austin is such a beautiful backdrop - what's your vision?
```

### Upsell Training

```
Q: Do you offer albums?
A: Yes! Our heirloom albums are stunning. They start at $800 and
make the perfect way to preserve your memories. Most couples
add them to their package. Want to see samples?
```

---

## 📚 Database Migration

Run this SQL in Supabase to create the tables:

```bash
# In Supabase SQL Editor, paste:
supabase/migrations/20251102_chatbot_training.sql
```

Or use Supabase CLI:

```bash
supabase db push
```

---

## 🎉 You're All Set!

Your AI chatbot can now be trained with:

- ✅ Custom personality & tone
- ✅ Brand-specific answers
- ✅ Organized by category
- ✅ Real-time updates
- ✅ Full admin control

**Next Steps:**

1. Run the database migration
2. Add your first 10 training examples
3. Configure personality settings
4. Test on your live site
5. Monitor and improve!

---

**Questions?** Check the in-app help or review the training examples already loaded as templates! 🚀
