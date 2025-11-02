# 🔑 Google Gemini API Key Setup Guide

## Good News: You Only Need ONE API Key! 

All three AI features (Gallery Alt Text, Blog Generator, and Chatbot) use the **same** Google Gemini API key. You don't need separate keys for different purposes.

---

## ✅ What We Just Fixed

**Problem:** The code was using `gemini-1.5-pro` model name, but Google's API requires `gemini-pro` for the v1beta version.

**Fixed in:**
- ✅ `app/api/gallery/generate-alt-text/route.ts`
- ✅ `app/api/blog/generate/route.ts`
- ✅ `app/api/chat/respond/route.ts`
- ✅ `app/api/seo/generate/route.ts`
- ✅ `lib/settings.ts` (default model)
- ✅ `AI_FEATURES_GUIDE.md` (documentation)

**Chatbot Repetition:** Simplified the AI prompt to prevent repetitive responses.

---

## 🔧 Your Current Setup

You already have your API key set in Netlify as `GEMINI_API_KEY`. This is perfect!

### How the Code Uses It:

```typescript
const apiKey = 
  process.env.GEMINI_API_KEY || 
  process.env.GOOGLE_API_KEY;
```

The code checks for **either** environment variable name, so you're covered.

---

## 📍 Where to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (websitefors37)
3. Click **Site settings** → **Environment variables**
4. Your key should be listed as:
   - **Key name:** `GEMINI_API_KEY`
   - **Value:** `AIza...` (your actual key)
   - **Scopes:** All deployments, All branches

### Important: Redeploy After Changes

If you just added the key or we just fixed the model name, you need to:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to finish (~2-3 minutes)

This ensures the new code with `gemini-pro` is live.

---

## 🎯 Testing Each Feature

After redeployment, test in this order:

### 1. SEO Analyzer (Simplest test)
- Go to Admin → Blog → Create/Edit post
- Click the SEO analyzer icon
- Generate title/meta - should work without 404 error

### 2. Gallery Alt Text
- Go to Admin → Gallery
- Click a single image's sparkle ✨ button
- Should generate alt text in 2-3 seconds

### 3. Blog Generator
- Admin → Blog → "AI Writer" button
- Enter a topic like "Wedding photography tips"
- Click Generate - should create full post

### 4. Chatbot
- Visit your site's homepage
- Click the purple/pink chat button (bottom right)
- Ask "What are your wedding packages?"
- Should respond naturally without repeating itself

---

## 🆓 Free Tier Limits

Google Gemini Pro free tier:
- **60 requests per minute**
- **1,500 requests per day**

For your usage:
- This is MORE than enough
- Even with heavy testing, you won't hit limits
- No need to upgrade to paid tier yet

---

## 🐛 Troubleshooting

### Still Getting 404 Error?

1. **Check model name in Admin Settings:**
   - Go to Admin → Settings
   - Look for "AI Model" field
   - Should say `gemini-pro` (not `gemini-1.5-pro`)

2. **Verify API key in Netlify:**
   - Netlify dashboard → Site settings → Environment variables
   - Make sure `GEMINI_API_KEY` is set
   - Value should start with `AIza`

3. **Redeploy the site:**
   - Trigger a fresh deployment
   - Wait for completion
   - Test again

### Chatbot Still Repeating?

The new prompt is much shorter and clearer. If it still repeats:
- Clear browser cache/cookies
- Try a fresh conversation
- The repetition should be gone with the simplified prompt

### AI Features Not Enabled?

1. Go to Admin → Settings
2. Find "AI-powered title & meta suggestions"
3. Make sure it's **ON** (toggle should be blue/enabled)
4. Click Save

---

## 📝 What You DON'T Need

❌ **Separate API keys** for each feature  
❌ **Multiple Google Cloud projects**  
❌ **Different model versions**  
❌ **Paid Gemini subscription** (free tier is plenty)  
❌ **OpenAI API key** (we use Google Gemini, not ChatGPT)

---

## ✨ Next Steps

1. **Trigger a new Netlify deployment** (to deploy the `gemini-pro` fix)
2. **Wait 2-3 minutes** for deployment to complete
3. **Test all four features** in order above
4. **Report back** if anything still gives errors

The 404 error should be completely resolved now! 🎉
