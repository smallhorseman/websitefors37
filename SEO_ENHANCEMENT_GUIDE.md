# SEO Analyzer Enhancement Guide

## 🚀 New Features Added

### 1. **Focus Keyword Tracking** ✅

Persistent keyword targeting for each piece of content.

**Database Changes:**

- Added `focus_keyword` column to `content_pages` and `blog_posts`
- Indexed for fast search/filtering

**How to Use:**

1. In SEO Analyzer modal, enter your target keyword
2. Click "Save" - it persists to the database
3. Next time you open that page/post, the keyword auto-fills
4. Use it to track keyword strategy across all content

**Benefits:**

- Consistent targeting across updates
- Team collaboration - everyone sees the same target
- Historical tracking of keyword strategy

---

### 2. **Live HTML Analysis** ✅

Analyze your published pages in real-time from production.

**API Endpoint:** `POST /api/seo/analyze-live`

**How to Use:**

1. Navigate to SEO & AI page
2. Click "Analyze Live" button (new feature)
3. Select a published page
4. Get real-time analysis of what's actually on the site

**What It Checks:**

- Actual rendered title and meta description
- All headings (H1, H2, H3) as they appear
- Open Graph tags (Facebook/LinkedIn previews)
- Twitter Card tags
- Canonical URLs
- Internal/external links
- Images with/without alt text
- Structured data (JSON-LD)
- Actual word count on page

**Use Cases:**

- Verify CMS changes deployed correctly
- Check if CDN/caching is serving correct meta tags
- Debug why Google shows different title
- Ensure all pages have proper schema markup

---

### 3. **Competitor Analysis** ✅

Benchmark your content against competitors.

**Function:** `analyzeCompetitor(competitorUrl)`

**How to Use:**

1. In SEO modal, click "Compare with Competitor"
2. Enter competitor URL (must be accessible publicly)
3. View side-by-side comparison

**What It Shows:**

- **Score Comparison:** Your score vs. theirs
- **Content Gaps:** What they have that you don't
  - More headings
  - Better alt text coverage
  - Longer content
- **Opportunities:** What you can add
  - Structured data
  - Canonical tags
  - External authoritative links

**Example Output:**

```
Your Score: 75
Competitor Score: 88

Gaps:
- Competitor has 8 H2 headings (you have 3)
- Competitor has 1,200 words (you have 600)
- Competitor has 100% alt text coverage (you have 60%)

Opportunities:
- Add structured data (JSON-LD)
- Add canonical tag
- Link to 2-3 authoritative sources
```

---

### 4. **Trending Keywords Database** ✅

Category-specific keyword suggestions.

**Function:** `getTrendingKeywords(category)`

**Categories:**

- `photography` (default)
- `wedding`
- `portrait`
- `commercial`

**How to Use:**

```typescript
const keywords = getTrendingKeywords("wedding");
// Returns: ['wedding photographer', 'engagement photos', 'bridal photography', ...]
```

**Integration:**

- Used in Generate Title/Meta to suggest relevant keywords
- Powers keyword density analysis
- Helps identify content gaps

---

### 5. **Content Freshness Score** ✅

Track how up-to-date your content is.

**Function:** `calculateFreshnessScore(publishDate, lastModified?)`

**Scoring:**

- < 30 days: 100 points (excellent)
- < 90 days: 90 points (good)
- < 180 days: 75 points (fair)
- < 365 days: 60 points (needs update)
- > 365 days: 40 points (stale)

**How to Use:**

- Automatically calculated in SEO dashboard
- Flags pages that need content refreshes
- Prioritize updates based on age

**Why It Matters:**

- Google favors fresh content for certain queries
- Old content may have outdated info/links
- Regular updates signal active site

---

### 6. **Improvement Plan Generator** ✅

Actionable step-by-step plan to reach target score.

**Function:** `generateImprovementPlan(analysis, targetScore)`

**Example Output:**

```
Current Score: 68
Target Score: 90

🚨 Fix 2 critical issue(s) first (potential +10 points)
  → Add a meta description (required for search results)
  → Fix missing H1 tag

⚠️ Address 4 warning(s) (potential +12 points)
  → Improve readability score from 45 to 60+
  → Add 2 more internal links
  → Optimize 3 images with alt text

📝 Expand content to 800-1200 words (currently 450)
🔑 Use more varied keywords (currently using 3)
🔗 Add 2 more internal links
🖼️ Add alt text to 3 image(s)
```

**How to Use:**

1. Run SEO analysis
2. Click "Show Improvement Plan"
3. Work through tasks top-to-bottom
4. Re-analyze to track progress

---

## 🎯 Best Practices & Workflows

### Daily Content Creation Workflow

1. **Plan** (5 min)

   - Choose focus keyword
   - Research competitor using Competitor Analysis
   - Check trending keywords for category

2. **Write** (30-60 min)

   - Draft content in Content Editor
   - Use focus keyword naturally 2-4 times
   - Add 3-5 internal links
   - Include 2-3 images with alt text

3. **Optimize** (10 min)

   - Run SEO Analysis
   - Click "Generate Title" and "Generate Meta"
   - Review suggestions and tweak
   - Fix any critical issues

4. **Validate** (5 min)

   - Save and publish
   - Use "Analyze Live" to verify production
   - Check score is 85+

5. **Track** (ongoing)
   - Monitor freshness score
   - Update content every 6 months
   - Re-run competitor analysis quarterly

### Monthly SEO Audit Workflow

1. **Overview**

   - Navigate to SEO & AI dashboard
   - Sort by lowest scores
   - Filter by content age > 180 days

2. **Prioritize**

   - Critical issues first (red flags)
   - Old high-traffic pages (freshness)
   - Underperforming vs competitors

3. **Batch Update**

   - Use Improvement Plan for each
   - Update 5-10 pages per session
   - Re-analyze to confirm improvements

4. **Report**
   - Export scores before/after
   - Track average score over time
   - Celebrate wins with team

---

## 🔧 Advanced Configuration

### Customize Keyword Database

Edit `lib/seo-analyzer.ts` → `getTrendingKeywords()`:

```typescript
const keywordDatabase: Record<string, string[]> = {
  photography: [
    "your custom keywords",
    // Add local/niche terms
  ],
};
```

### Adjust Scoring Weights

Edit `calculateScore()` method to emphasize different factors:

```typescript
// Give more weight to content length
const contentLengthScore =
  metrics.wordCount >= 800 ? 20 : (metrics.wordCount / 800) * 20;

// Reduce penalty for low readability if technical content
const readabilityScore =
  metrics.readabilityScore >= 60 ? 15 : (metrics.readabilityScore / 60) * 10;
```

### Add Custom Checks

Extend the analyzer with domain-specific rules:

```typescript
// Check for local SEO elements
if (!this.content.includes("Pinehurst") && !this.content.includes("Texas")) {
  issues.push({
    severity: "warning",
    category: "content",
    message: "Missing local location keywords",
    fix: "Add your city/state for local SEO",
  });
}
```

---

## 📊 Metrics Explained

### SEO Score Breakdown (0-100)

| Component        | Weight | Description                          |
| ---------------- | ------ | ------------------------------------ |
| Title Tag        | 15 pts | Length 50-60 chars, includes keyword |
| Meta Description | 15 pts | Length 140-160 chars, compelling     |
| Content Length   | 20 pts | 800-1200 words ideal                 |
| Readability      | 15 pts | Flesch score 60+                     |
| Headings         | 10 pts | H1 unique, H2/H3 hierarchy           |
| Keywords         | 10 pts | Density 1-3%, varied                 |
| Links            | 8 pts  | 3-5 internal, 1-2 external           |
| Images           | 7 pts  | Alt text, proper format              |

### Readability Score (Flesch Reading Ease)

- **90-100:** Very easy (5th grade)
- **80-89:** Easy (6th grade)
- **70-79:** Fairly easy (7th grade)
- **60-69:** Standard (8th-9th grade) ← **Target**
- **50-59:** Fairly difficult
- **30-49:** Difficult (college)
- **0-29:** Very difficult (graduate)

**For photography/studio content:** Aim for 60-70 (accessible to broad audience)

### Keyword Density

- **< 0.5%:** Too low, Google may not recognize topic
- **0.5-1%:** Good, natural usage
- **1-2%:** Optimal for primary keyword
- **2-3%:** Upper limit, still safe
- **> 3%:** Risky, may appear as keyword stuffing

---

## 🐛 Troubleshooting

### "Could not fetch live page"

**Cause:** Page not published or URL incorrect  
**Fix:** Verify URL, ensure page is live, check NEXT_PUBLIC_SITE_URL env var

### "Competitor analysis failed"

**Cause:** Competitor site blocks scraping or CORS issue  
**Fix:** Only works for your own domain or publicly accessible pages. For external competitors, manually copy their content.

### Score lower than expected

**Cause:** Strict default thresholds  
**Fix:** Review Improvement Plan, focus on critical issues first. Remember: 85+ is excellent.

### Keywords not saving

**Cause:** Database migration not run  
**Fix:** Run `supabase/migrations/20251101_add_focus_keyword_columns.sql` in Supabase dashboard

---

## 🎓 Learning Resources

### Recommended Reading

- [Google Search Central](https://developers.google.com/search) - Official SEO docs
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog) - SEO strategies

### Photography SEO Specifics

- Use location keywords ("Pinehurst photographer", "Texas wedding photography")
- Alt text describes the subject AND style ("romantic sunset engagement photo at Hidden Lake")
- Internal link between related services (weddings ↔ engagements ↔ portraits)
- Fresh content: blog recent sessions, seasonal tips, behind-the-scenes

### Local SEO

- Ensure Google Business Profile complete
- NAP consistency (Name, Address, Phone across all platforms)
- Get reviews and respond to them
- List in local directories (Yelp, WeddingWire, The Knot)
- Create location-specific pages

---

## 🚀 Future Enhancements Roadmap

### Planned Features

- [ ] Automated monthly SEO reports (email digest)
- [ ] Keyword rank tracking integration
- [ ] A/B testing for titles/meta
- [ ] Bulk content audit export (CSV)
- [ ] AI content suggestions based on gaps
- [ ] Google Search Console integration
- [ ] Backlink analysis
- [ ] Schema markup generator UI

### Vote on Next Feature

Want a specific feature prioritized? Add to GitHub issues or discuss with your dev team.

---

## ✅ Quick Reference Checklist

Before publishing any content:

- [ ] Focus keyword selected and saved
- [ ] SEO score 85+ (or improvement plan created)
- [ ] Title 50-60 characters, includes keyword
- [ ] Meta description 140-160 characters, compelling
- [ ] Content 800+ words
- [ ] H1 unique, H2/H3 hierarchy correct
- [ ] 3-5 internal links to related content
- [ ] All images have descriptive alt text
- [ ] Readability score 60+
- [ ] "Analyze Live" confirms production correct

---

_Last Updated: November 1, 2025_  
_Version: 2.0 - Enhanced with Live Analysis & Competitor Insights_
