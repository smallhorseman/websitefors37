# 🚀 Gemini 2.0 Flash Integration & Admin Enhancements - Complete Guide

**Date:** November 19, 2025  
**Version:** 2.0

---

## 🎯 Overview

This upgrade brings **Gemini 2.0 Flash (latest model)** integration across all AI features with:

1. **Unified AI Client** - Consistent, reliable AI usage
2. **Enhanced Admin Dashboard** - Modern UI with keyboard shortcuts
3. **AI-Powered Lead Scoring** - Intelligent prioritization
4. **Gallery Image Analysis** - Auto-tagging and quality assessment
5. **Real-Time Content Assistant** - SEO suggestions as you type

---

## ✨ What's New

### 1. Unified AI Client (`lib/ai-client.ts`)

**Purpose:** Single source of truth for all Gemini API interactions

**Features:**
- Automatic retry with exponential backoff
- Structured JSON output support
- Vision API for image analysis
- Pre-configured settings for different use cases
- Comprehensive error handling

**Usage Example:**
```typescript
import { generateText, generateJSON, analyzeImage } from "@/lib/ai-client";

// Simple text generation
const response = await generateText("Write a blog post about...", {
  config: "creative",
});

// Structured output
const data = await generateJSON<BlogPost>(prompt, {
  config: "structured",
});

// Image analysis
const altText = await analyzeImage(base64Image, "Describe this photo");
```

**Configuration Presets:**
- `creative` - Blog posts, marketing copy (temp: 0.9)
- `precise` - Chatbot, support (temp: 0.7)
- `structured` - Data extraction (temp: 0.3, JSON output)
- `concise` - Alt text, summaries (temp: 0.5)

---

### 2. Enhanced Admin Dashboard

**Location:** `app/admin/dashboard-enhanced.tsx`

**New Features:**

#### 📊 Real-Time Stats
- Total Leads with quality indicators
- Total Revenue tracking
- Bookings overview
- AI Insights widget

#### ⌨️ Keyboard Shortcuts
- `Cmd/Ctrl + L` → Leads
- `Cmd/Ctrl + G` → Gallery
- `Cmd/Ctrl + B` → Blog
- `Cmd/Ctrl + C` → Content CMS
- `Cmd/Ctrl + M` → Marketing
- `Cmd/Ctrl + S` → Settings
- `/` → Focus search bar

#### 🔍 Smart Search
- Search all features by name or description
- Instant filtering as you type
- Clear visual organization

#### 🎨 Visual Improvements
- Color-coded categories
- Badge indicators for new features
- Featured cards with special styling
- Responsive grid layout

**To Activate:**
Replace your current dashboard page with the enhanced version:
```typescript
// app/admin/page.tsx
export { default } from './dashboard-enhanced';
```

---

### 3. AI-Powered Lead Scoring

**Endpoint:** `POST /api/leads/score`

**Features:**
- 0-100 quality score
- Priority categorization (low/medium/high/urgent)
- Conversion probability estimation
- Next best action recommendations
- Sentiment analysis
- Quality indicators (contact info, budget, timeline, etc.)

**Request:**
```json
{
  "leadId": "uuid-here",
  "conversationHistory": "full chat transcript...",
  "leadData": {
    "name": "John Doe",
    "email": "john@example.com",
    "service": "wedding",
    "budget": "$3,000"
  }
}
```

**Response:**
```json
{
  "score": 85,
  "priority": "high",
  "reasoning": "Complete contact info, specific service interest, realistic budget, and urgent timeline indicate strong qualification.",
  "nextActions": [
    "Send wedding package pricing within 24 hours",
    "Schedule consultation call for this week",
    "Share portfolio of recent wedding work"
  ],
  "sentiment": "enthusiastic",
  "qualityIndicators": {
    "hasContactInfo": true,
    "hasServiceInterest": true,
    "hasBudget": true,
    "hasTimeline": true,
    "showsUrgency": true,
    "multipleInteractions": false
  },
  "estimatedValue": "$2,500-$4,000",
  "conversionProbability": 78
}
```

**Batch Scoring:**
```typescript
// Score all unscored or old leads
PUT /api/leads/score
// Returns: { total: 50, scored: 48 }
```

---

### 4. Gallery Image Analysis

**Endpoint:** `POST /api/gallery/analyze`

**Features:**
- AI-generated alt text (SEO-optimized)
- Automatic category detection
- Smart tag suggestions
- Quality scoring (0-100)
- Color palette extraction
- Composition analysis

**Request:**
```json
{
  "imageId": "uuid-here",
  "imageUrl": "https://...",
  "context": {
    "title": "Sunset Wedding",
    "existingCategory": "wedding",
    "existingTags": ["outdoor", "golden hour"]
  }
}
```

**Response:**
```json
{
  "altText": "Bride and groom embracing during golden hour sunset at outdoor wedding ceremony",
  "suggestedCategory": "wedding",
  "suggestedTags": ["wedding", "outdoor", "sunset", "golden-hour", "bride-groom", "romantic", "ceremony", "natural-light"],
  "qualityScore": 92,
  "qualityNotes": [
    "Excellent exposure and dynamic range",
    "Strong composition with rule of thirds",
    "Beautiful natural lighting during golden hour",
    "Sharp focus on subjects"
  ],
  "dominantColors": ["#F4A460", "#FFD700", "#8B4513"],
  "composition": {
    "subject": "Bride and groom in romantic embrace",
    "lighting": "Natural golden hour with warm tones",
    "mood": "Romantic and intimate",
    "setting": "Outdoor wedding venue at sunset"
  },
  "seoKeywords": ["wedding photography", "outdoor wedding", "golden hour", "romantic photos", "ceremony"]
}
```

**Batch Analysis:**
```typescript
// Analyze all images without alt text
PUT /api/gallery/analyze
// Returns: { total: 20, analyzed: 18 }
```

---

### 5. Real-Time Content Assistant

**Component:** `components/AIContentAssistant.tsx`

**Features:**
- Live SEO score (0-100)
- Keyword density tracking
- Readability analysis (Flesch Reading Ease)
- Title suggestions
- Meta description suggestions
- Improvement recommendations

**Usage:**
```tsx
import AIContentAssistant from "@/components/AIContentAssistant";

<AIContentAssistant
  content={blogContent}
  targetKeywords={["wedding photography", "Texas photographer"]}
  onSuggestionsChange={(suggestions) => {
    console.log("New score:", suggestions?.seoScore);
  }}
/>
```

**Compact Mode:**
```tsx
<AIContentAssistant
  content={blogContent}
  targetKeywords={["wedding photography"]}
  compact={true}
/>
```

**Features:**
- Debounced analysis (waits 2s after typing stops)
- Three tabs: SEO Analysis, Readability, Suggestions
- Click-to-copy title and meta suggestions
- Visual keyword density indicators
- Reading grade level calculation

---

## 🛠️ Installation & Setup

### 1. Install Dependencies

Already installed! Your project already has `@google/generative-ai`.

### 2. Environment Variables

Add to Netlify (if not already set):
```bash
GOOGLE_API_KEY=your_gemini_api_key_here
# OR
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Database Schema Updates

Add these columns to existing tables:

```sql
-- Leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS priority TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_scored_at TIMESTAMPTZ;

-- Gallery images table
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS last_analyzed_at TIMESTAMPTZ;
```

### 4. Update Existing Features

#### Chatbot
Your chatbot already uses Gemini 2.0 Flash! No changes needed. It's already configured with:
- Model: `gemini-2.0-flash-exp`
- Temperature: 0.8
- Comprehensive training data integration

#### Blog Generator
To upgrade, update `app/api/blog/generate/route.ts`:
```typescript
import { generateBlogPost } from "@/lib/ai-client";

const blogPost = await generateBlogPost(
  topic,
  keywords,
  wordCount,
  tone
);
```

#### Gallery Alt Text
Update `app/api/gallery/generate-alt-text/route.ts`:
```typescript
import { generateAltText } from "@/lib/ai-client";

const altText = await generateAltText(imageUrl, {
  title: image.title,
  category: image.category,
  keywords: image.tags,
});
```

---

## 📈 Usage Examples

### Admin Dashboard

1. **Access Enhanced Dashboard:**
   - Navigate to `/admin`
   - See new stats cards with real-time data
   - Use keyboard shortcuts for quick navigation
   - Search for features with `/` key

2. **Quick Actions:**
   - Click "🧠 AI Training" to manage chatbot
   - Click "⚡ AI Site Builder" for page generation
   - View notification center for alerts

### Lead Scoring

1. **Single Lead Scoring:**
```typescript
const response = await fetch("/api/leads/score", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    leadId: "lead-uuid-here"
  })
});

const score = await response.json();
console.log("Lead Score:", score.score);
console.log("Priority:", score.priority);
console.log("Next Actions:", score.nextActions);
```

2. **Batch Scoring:**
```typescript
// Admin button to score all leads
const batchScore = async () => {
  const response = await fetch("/api/leads/score", {
    method: "PUT"
  });
  const result = await response.json();
  alert(`Scored ${result.scored} out of ${result.total} leads`);
};
```

### Gallery Analysis

1. **Single Image:**
```typescript
const analyzeImage = async (imageId: string, imageUrl: string) => {
  const response = await fetch("/api/gallery/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageId,
      imageUrl,
      context: {
        title: "Wedding Photo",
        existingCategory: "wedding"
      }
    })
  });
  
  const analysis = await response.json();
  // Analysis includes alt text, tags, quality score, etc.
};
```

2. **Batch Analysis:**
```typescript
// Analyze all images without alt text
const batchAnalyze = async () => {
  const response = await fetch("/api/gallery/analyze", {
    method: "PUT"
  });
  const result = await response.json();
  console.log(`Analyzed ${result.analyzed} images`);
};
```

### Content Assistant

1. **In Blog Editor:**
```tsx
const [content, setContent] = useState("");
const [suggestions, setSuggestions] = useState(null);

<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  className="w-full h-64 p-4 border rounded"
/>

<AIContentAssistant
  content={content}
  targetKeywords={["wedding photography", "Houston"]}
  onSuggestionsChange={(s) => setSuggestions(s)}
/>

{suggestions && (
  <div className="mt-4">
    <p>SEO Score: {suggestions.seoScore}/100</p>
    <p>Readability: Grade {suggestions.readability.grade}</p>
  </div>
)}
```

---

## 🎨 UI Components

### Add to Admin Gallery Page

```tsx
import { useState } from "react";

export default function GalleryAdmin() {
  const [analyzing, setAnalyzing] = useState(false);
  
  const handleBatchAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/gallery/analyze", {
        method: "PUT"
      });
      const result = await response.json();
      alert(`Analyzed ${result.analyzed} out of ${result.total} images!`);
    } catch (error) {
      alert("Analysis failed: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleBatchAnalyze}
        disabled={analyzing}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {analyzing ? "Analyzing..." : "🤖 AI Analyze All Images"}
      </button>
      
      {/* Your gallery grid... */}
    </div>
  );
}
```

### Add to Lead Management Page

```tsx
import { useState } from "react";

export default function LeadsAdmin() {
  const [scoring, setScoring] = useState(false);
  
  const handleBatchScore = async () => {
    setScoring(true);
    try {
      const response = await fetch("/api/leads/score", {
        method: "PUT"
      });
      const result = await response.json();
      alert(`Scored ${result.scored} out of ${result.total} leads!`);
      // Refresh leads list
    } catch (error) {
      alert("Scoring failed: " + error.message);
    } finally {
      setScoring(false);
    }
  };
  
  return (
    <div>
      <button
        onClick={handleBatchScore}
        disabled={scoring}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {scoring ? "Scoring..." : "🎯 AI Score All Leads"}
      </button>
      
      {/* Your leads table with score column... */}
    </div>
  );
}
```

---

## 🧪 Testing

### 1. Test AI Client
```typescript
// In your browser console or a test page
import { generateText } from "@/lib/ai-client";

const test = async () => {
  const response = await generateText("Say hello!", {
    config: "concise"
  });
  console.log("AI Response:", response);
};

test();
```

### 2. Test Lead Scoring
```bash
curl -X POST https://yourdomain.com/api/leads/score \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": "Hi, I need a wedding photographer for June 2026. Budget is around $3000.",
    "leadData": {
      "email": "test@example.com",
      "service": "wedding"
    }
  }'
```

### 3. Test Image Analysis
```bash
curl -X POST https://yourdomain.com/api/gallery/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://your-image-url.jpg",
    "context": {
      "title": "Wedding Photo",
      "category": "wedding"
    }
  }'
```

---

## 📊 Cost Estimation

Using Gemini 2.0 Flash API (as of Nov 2025):

### Free Tier
- 15 requests per minute
- 1 million tokens per month free
- Perfect for initial usage

### Typical Monthly Costs (after free tier)
- **Lead Scoring:** 500 leads × $0.0001 = $0.05
- **Image Analysis:** 100 images × $0.0003 = $0.03
- **Content Suggestions:** 200 analyses × $0.0002 = $0.04
- **Chatbot:** 1,000 conversations × $0.0001 = $0.10
- **Total:** ~$0.25/month 🎉

**Gemini 2.0 Flash is 10x cheaper than GPT-4!**

---

## 🚀 Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: Add Gemini 2.0 Flash integration and admin enhancements"
git push origin main
```

### 2. Netlify Auto-Deploy
Your site will automatically rebuild and deploy.

### 3. Verify Environment Variables
In Netlify dashboard:
- Go to Site Settings → Environment Variables
- Ensure `GOOGLE_API_KEY` or `GEMINI_API_KEY` is set

### 4. Run Database Migrations
If using Supabase, run the SQL commands from step 3 above.

---

## 🎯 Next Steps

1. **Test Each Feature:**
   - Score a few leads manually
   - Analyze sample gallery images
   - Try the content assistant in blog editor

2. **Add UI Elements:**
   - Add "AI Score" button to leads page
   - Add "AI Analyze" button to gallery
   - Integrate content assistant into CMS

3. **Monitor Usage:**
   - Check Gemini API console for usage
   - Review error logs in Netlify functions
   - Track feature adoption in analytics

4. **Optimize:**
   - Adjust temperature settings for different use cases
   - Fine-tune prompts based on results
   - Add user feedback collection

---

## 🐛 Troubleshooting

### API Key Errors
```
Error: Missing GOOGLE_API_KEY
```
**Fix:** Add `GOOGLE_API_KEY` or `GEMINI_API_KEY` to Netlify environment variables and redeploy.

### Rate Limiting
```
Error: Too many requests
```
**Fix:** The AI client automatically retries with exponential backoff. If this persists, upgrade Gemini API quota.

### Image Analysis Fails
```
Error: Failed to fetch image
```
**Fix:** Ensure image URL is publicly accessible and CORS-enabled. Use Cloudinary URLs for best results.

### Content Suggestions Slow
**Fix:** Normal - analysis takes 2-5 seconds. The component shows a loading state automatically.

---

## 📚 Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **Gemini 2.0 Flash Release:** Latest model with improved quality and speed
- **Your AI Client:** `lib/ai-client.ts` - single source of truth
- **API Endpoints:**
  - `/api/leads/score` - Lead scoring
  - `/api/gallery/analyze` - Image analysis
  - `/api/ai/content-suggestions` - Content SEO
  - `/api/chat/respond` - Chatbot (existing)

---

## ✅ Checklist

- [x] Unified AI client created
- [x] Enhanced admin dashboard designed
- [x] Lead scoring API implemented
- [x] Gallery analysis API implemented
- [x] Content assistant component created
- [ ] Update admin UI with new features
- [ ] Run database migrations
- [ ] Test all endpoints
- [ ] Deploy to production
- [ ] Monitor usage and costs

---

**🎉 You now have state-of-the-art AI capabilities powered by Gemini 2.0 Flash across your entire platform!**

Need help? Check the inline code documentation or review the API responses for detailed information.
