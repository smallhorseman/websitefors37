# Service Page Training Content - Quick Reference

> New: The chatbot now pulls the most relevant service/sub‑service pages into its answer in real time and adds “View details” + “Get a quote” quick actions. No manual wiring per page needed—just import your site content once and it will use it automatically.

## What Gets Imported From Service Pages

The updated import script now extracts detailed information from these specific service pages:

### 1. `/services/portrait-photography`

**Packages:** $200 (Mini) | $350 (Standard) | $500 (Extended)

**Types Covered:**

- Family Portraits
- Senior Portraits  
- Headshots
- Maternity Sessions

**Training Entries Created:**

- ✅ "Tell me about your portrait photography services"
- ✅ "How much does portrait photography cost?"
- ✅ "What's included in your portrait photography packages?"
- ✅ "Do you offer family portraits?" (+ each type)
- ✅ "Do you provide portrait photography in my area?"

### 2. `/services/wedding-photography`

**Packages:** $1,800 (Essential) | $2,800 (Premium) | $4,200 (Luxury)

**Types Covered:**

- Full Day Coverage
- Engagement Sessions
- Bridal Portraits
- Ceremony Only

**Training Entries Created:**

- ✅ "Tell me about your wedding photography services"
- ✅ "How much does wedding photography cost?"
- ✅ "What's included in your wedding photography packages?"
- ✅ "Do you offer engagement sessions?" (+ each type)
- ✅ "Do you provide wedding photography in my area?"

### 3. `/services/event-photography`

**Packages:** $400 (Basic) | $700 (Standard) | $1,000 (Full)

**Types Covered:**

- Corporate Events
- Birthday Parties
- Graduations
- Special Occasions

**Training Entries Created:**

- ✅ "Tell me about your event photography services"
- ✅ "How much does event photography cost?"
- ✅ "What's included in your event photography packages?"
- ✅ "Do you offer corporate events?" (+ each type)
- ✅ "Do you provide event photography in my area?"

### 4. `/services/commercial-photography`

**Packages:** Multiple options including headshots, products, real estate, brand photography

**Types Covered:**

- Real Estate
- Product Photography
- Business Headshots
- Brand Photography

**Training Entries Created:**

- ✅ "Tell me about your commercial photography services"
- ✅ "How much does commercial photography cost?"
- ✅ "What's included in your commercial photography packages?"
- ✅ "Do you offer real estate photography?" (+ each type)
- ✅ "Do you provide commercial photography in my area?"

---

## Example Chatbot Responses

### Customer: "Can you break down some of the portrait packages?"

**Bot Response:**
> "Alright! Let's dive into our portrait packages! We offer a range of options, typically between $200-$500, that cover individual headshots to full family sessions. Here's a breakdown:
>
> **Mini Package** ($200): 30 minutes • 15+ edited photos • Digital gallery
>
> **Standard Package** ($350): 60 minutes • 30+ edited photos • Multiple outfits/looks • Digital gallery
>
> **Extended Package** ($500): 90 minutes • 50+ edited photos • Multiple locations • Multiple outfits • Digital gallery • Print credit
>
> All photos are professionally edited and delivered through a private online gallery. [View full details](https://studio37.cc/services/portrait-photography) or [book a consultation](https://studio37.cc/book-a-session) to discuss which package is right for you!"

### Customer: "Do you do senior portraits?"

**Bot Response:**
> "Yes! Senior Portraits is one of our specialties in portrait photography. Professional portrait photography in Pinehurst, Texas capturing life's precious moments. [View our portrait photography portfolio](https://studio37.cc/gallery) or [schedule a consultation](https://studio37.cc/book-a-session) to discuss your senior portraits needs!"

### Customer: "How much is a wedding photographer?"

**Bot Response:**
> "Our wedding photography packages range from $1,800 to $4,200. Here's a breakdown:
>
> **Essential Package** ($1,800): 6 hours • 300+ edited photos • Two photographers, Online gallery, Print release
>
> **Premium Package** ($2,800): 8 hours • 500+ edited photos • Two photographers, Engagement session, Online gallery, Print release, Premium album
>
> **Luxury Package** ($4,200): 10 hours • 700+ edited photos • Two photographers, Engagement session, Bridal session, Premium album, Parent albums, Print release
>
> All packages include professional editing and digital delivery. [View full details](https://studio37.cc/services/wedding-photography) or [contact us](https://studio37.cc/contact) for custom quotes!"

### Customer: "Do you travel to The Woodlands?"

**Bot Response:**
> "We provide portrait photography services throughout Pinehurst TX, The Woodlands TX, Montgomery TX, and surrounding areas including Spring TX, Tomball TX, Magnolia TX, Conroe TX, Houston TX. [Contact us](https://studio37.cc/contact) to confirm we serve your location!"

---

## Total Training Entries

From service pages alone:

- **Portrait Photography**: ~10 entries
- **Wedding Photography**: ~10 entries  
- **Event Photography**: ~10 entries
- **Commercial Photography**: ~10 entries

**Service Page Total**: ~40 entries

Plus from rest of site:

- Content pages: ~15 entries
- Blog posts: ~20 entries
- Gallery/portfolio: ~5 entries
- Business info: ~5 entries
- Curated FAQs: ~10 entries

**Grand Total**: ~95 comprehensive training entries

---

## How The AI Uses This

When a customer asks about services or pricing, the AI:

1. **Searches training data** for the best‑matching snippets (now ranked per message)
2. **Injects the top matches** (with source links) into its prompt
3. **Responds with concrete pricing/details** and links to the exact sub‑service page
4. **Shows quick actions**: “View details” opens the page, “Get a quote” nudges the flow into pricing/booking

The more specific the training data, the better the AI responses!

---

## Updating Service Information

If you change pricing or packages:

### Option 1: Update the script (for permanent changes)

Edit `scripts/import-website-content.ts` and update the service data, then re-run the import.

### Option 2: Manual override (for quick changes)

Go to `/admin/ai-training` and edit the specific training entry directly.

---

## Next Steps

1. **Run the import**: `npx tsx scripts/import-website-content.ts`
2. **Test the chatbot**: Ask questions about your services
3. **Refine as needed**: Add manual entries for edge cases

The AI now knows everything about your services, packages, and pricing! 🎉
