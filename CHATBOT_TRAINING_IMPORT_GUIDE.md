# Chatbot Training Content Import Guide

This guide shows you how to automatically import your website content into the chatbot training system, plus how to manually add training data.

## 🤖 Automatic Import (Recommended)

The automatic import script scrapes all your website content and creates training data automatically.

### What It Imports:

1. **Content Pages** (About, Services, etc.)
   - Converts each page into Q&A format
   - Extracts key information and splits long content
   - Adds source URLs for reference

2. **Blog Posts**
   - Latest 20 published posts
   - Creates "Tell me about..." entries
   - Includes excerpt with link to full post

3. **Gallery/Portfolio**
   - Featured work examples
   - Portfolio overview with descriptions
   - Links to full gallery

4. **Business Info** (from settings table)
   - Business hours
   - Contact information
   - Booking process

5. **Curated FAQs**
   - Payment plans and pricing
   - Cancellation policies
   - Booking guidelines
   - Service offerings
   - Turnaround times
   - Print options

### How to Run:

1. **Install tsx** (if not already installed):
   ```bash
   npm install -D tsx
   ```

2. **Create the scripts directory**:
   ```bash
   mkdir -p scripts
   ```

3. **Copy the import script** to `scripts/import-website-content.ts` (see script file in repo)

4. **Run the import**:
   ```bash
   npm run import:training
   ```
   
   Or directly:
   ```bash
   npx tsx scripts/import-website-content.ts
   ```

5. **Verify** - The script will:
   - ✓ Fetch all published content from Supabase
   - ✓ Generate training entries with categories and keywords
   - ✓ Clear old auto-imported entries (keeps manual ones)
   - ✓ Import new entries in batches
   - ✓ Display progress and final count

### Output Example:
```
🚀 Starting website content import...

🔍 Fetching website content from Supabase...
✓ Found 12 content pages
✓ Found 15 blog posts
✓ Found 8 featured gallery images
✓ Found business settings

✓ Generated 47 training entries

📤 Importing training data to Supabase...
✓ Cleared existing auto-imported entries
✓ Imported batch 1 (47 entries)

✅ Import complete!
🎉 Success! Your chatbot now has access to all website content.
📊 Total entries: 47

You can view and edit training data at: /admin/ai-training
```

### When to Re-run:

Re-run the import script whenever you:
- Add new blog posts
- Update service/pricing pages
- Change business hours or contact info
- Add new portfolio pieces

The script automatically clears old auto-imported entries and refreshes with current content.

---

## ✋ Manual Training (For Quick Updates)

For small updates or testing, you can manually add training data through the admin UI.

### Access the Admin UI:

1. Go to: **`/admin/ai-training`**
2. Click **"Add New Training"**

### Training Entry Fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Category** | Type of question | `services`, `pricing`, `booking`, `general`, `policies`, `portfolio` |
| **Question** | What customers might ask | `"Do you offer wedding photography?"` |
| **Answer** | Bot's response | `"Yes! Wedding photography is one of our specialties..."` |
| **Keywords** | Search terms (optional) | `wedding, bride, ceremony, reception` |
| **Is Active** | Enable/disable | ✓ Checked |

### Category Guidelines:

- **`services`** - What you offer, service types, specializations
- **`pricing`** - Package info, costs, payment plans, what's included
- **`booking`** - How to book, availability, scheduling
- **`general`** - Hours, contact, turnaround times, FAQs
- **`policies`** - Cancellation, rescheduling, travel, refunds
- **`portfolio`** - Examples of work, past projects, gallery
- **`blog`** - Article summaries, tips, guides

### Best Practices:

1. **Be conversational** - Write like you're talking to a customer
   ```
   ❌ "Package includes: digital files, 2-hour session"
   ✅ "Great question! Our standard package includes a 2-hour session and all edited digital files delivered within 2 weeks."
   ```

2. **Include links** - Use markdown format for clickable links
   ```
   "You can [view our full gallery](https://studio37.cc/gallery) to see more examples."
   ```

3. **Anticipate variations** - Think of different ways customers ask
   ```
   Question: "How much does it cost?"
   Also covers: "What are your prices?" "How much do you charge?" "What's the pricing?"
   ```

4. **Keep answers concise** - 2-3 sentences, max 200 words
   - Focus on key info
   - Add link for more details
   - Avoid overwhelming with too much text

5. **Update regularly** - Keep info current
   - Seasonal pricing changes
   - Holiday hours
   - New services or packages
   - Updated policies

### Example Training Entries:

#### Wedding Photography
```
Category: services
Question: Do you offer wedding photography?
Answer: Absolutely! Wedding photography is one of our specialties. We offer full-day coverage, including getting ready, ceremony, reception, and portraits. Packages include edited digital files and online gallery. [View our wedding portfolio](https://studio37.cc/gallery?category=wedding) to see our work!
Keywords: wedding, bride, groom, ceremony, reception, marriage
```

#### Pricing
```
Category: pricing
Question: Do you have payment plans?
Answer: Yes! We offer flexible payment plans to make professional photography accessible. Typically, we require a 50% deposit to secure your date, with the remaining balance due before your session. We accept credit cards, PayPal, and bank transfers. [Contact us](https://studio37.cc/contact) to discuss options!
Keywords: payment, plans, deposit, cost, pricing, finance
```

#### Booking
```
Category: booking
Question: How do I book a session?
Answer: Booking is easy! Simply [visit our booking page](https://studio37.cc/book-a-session) to see available dates and times. Choose a slot that works for you, and we'll send you a confirmation with next steps. We recommend booking 4-6 weeks in advance for best availability.
Keywords: book, schedule, appointment, reserve, availability
```

---

## 🔄 Update Workflow

### For Major Content Changes:
1. Update your website pages in `/admin/pages` or `/admin/blog`
2. Run automatic import script to refresh all training data
3. Verify in `/admin/ai-training` that changes appear

### For Quick FAQ Updates:
1. Go to `/admin/ai-training`
2. Click "Add New Training" or edit existing entry
3. Changes take effect immediately (no deploy needed)

---

## 📊 Monitoring Training Quality

### Check What The AI Knows:

1. Test the chatbot on your website
2. Ask questions customers would ask
3. Verify answers are accurate and helpful

### Common Issues:

| Problem | Solution |
|---------|----------|
| AI gives wrong answer | Add specific training entry with correct info |
| AI says "I don't know" | Add training entry covering that question |
| Answer too generic | Make training answer more specific with examples |
| Outdated information | Re-run import script or manually update entry |

---

## 💡 Pro Tips

1. **Keywords Help** - Add keywords customers actually use in conversation
   - Not: "photography services"
   - Yes: "pics, photos, shoot, photoshoot, pictures"

2. **Link Everything** - Make it easy for customers to take action
   - Gallery links for portfolio questions
   - Booking links for availability questions
   - Services links for package questions

3. **Seasonal Updates** - Add training for:
   - Holiday mini-sessions
   - Seasonal promotions
   - Weather-related policies (outdoor shoots)

4. **Cover Objections** - Add training for concerns:
   - "Is this in my budget?"
   - "What if it rains?"
   - "Can I reschedule?"
   - "Do I need to pay upfront?"

5. **Test Regularly** - Monthly chat tests ensure quality:
   - Use incognito mode to test as new customer
   - Ask 5-10 common questions
   - Update training based on weak answers

---

## 🎯 Training Data Strategy

### Immediate (Do Now):
- [x] Run automatic import to get all website content
- [ ] Test chatbot with 10 common customer questions
- [ ] Add any missing FAQs discovered during testing

### Weekly:
- [ ] Review new blog posts and add to training
- [ ] Check for outdated pricing/packages
- [ ] Add seasonal promotions or offers

### Monthly:
- [ ] Re-run full import to refresh all content
- [ ] Review chatbot analytics (if available)
- [ ] Update policies or business hours changes

---

## 🚨 Troubleshooting

### Import Script Errors:

**Error: Missing environment variables**
```
Solution: Ensure .env.local has:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
```

**Error: Cannot find module**
```bash
Solution: Install dependencies
npm install -D tsx
npm install @supabase/supabase-js
```

**Error: Permission denied**
```
Solution: Run with proper Supabase service role key
Check that SUPABASE_SERVICE_ROLE_KEY is set correctly
```

### Manual Entry Issues:

**Changes not appearing in chat**
- Check "Is Active" checkbox is enabled
- Refresh chatbot (close and reopen)
- Verify category is correct

**AI not using training data**
- Check that AI is enabled in settings
- Verify training entry question matches what customers ask
- Add more keywords to help matching

---

## 📚 Additional Resources

- **Admin AI Training UI**: `/admin/ai-training`
- **Chatbot Settings**: `/admin/settings` (scroll to AI section)
- **Test Chatbot**: Visit any page on your website, click chat icon
- **Training Script**: `scripts/import-website-content.ts`

---

**Need Help?** The chatbot uses Google's Gemini AI model, which is very good at understanding context and answering questions naturally. The more training data you provide, the better it gets!
