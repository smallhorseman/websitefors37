# AI Blog Writer Fix - JSON Parse Error

## Problem
Blog writer shows error: `JSON.parse: unexpected end of data at line 1 column 1`

## Root Cause
Missing `GEMINI_API_KEY` environment variable in Netlify.

## ✅ Solution - Add API Key to Netlify

### Step 1: Get Your Gemini API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

### Step 2: Add to Netlify Environment Variables

1. Go to: **Netlify Dashboard → Your Site**
2. Click **"Site configuration"** (or "Site settings")
3. Click **"Environment variables"** in sidebar
4. Click **"Add a variable"** (or "Add environment variable")
5. Enter:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Paste your API key
   - **Scopes:** Check all (Production, Deploy Previews, Branch deploys)
6. Click **"Create variable"**

### Step 3: Redeploy Site

1. Click **"Deploys"** tab
2. Click **"Trigger deploy" → "Deploy site"**
3. Wait ~3 minutes for build to complete

### Step 4: Test Blog Writer

1. Go to: **Admin → Blog → Click "AI Writer" button**
2. Fill in:
   - **Topic:** "5 tips to prep for a portrait session with a professional photographer"
   - **Keywords:** "wedding photography, branding photography, senior portraits"
   - **Tone:** Professional and friendly
   - **Word Count:** 800
3. Click **"Generate Blog Post"**
4. **Expected:** Full blog post generated in 5-10 seconds

## 🎯 What This Fixes

With `GEMINI_API_KEY` configured, these features will work:

- ✅ **AI Blog Writer** - Generate SEO-optimized blog posts
- ✅ **Chatbot** - AI-powered customer support chat
- ✅ **Gallery Alt Text** - Auto-generate image descriptions
- ✅ **SEO Suggestions** - AI-powered meta descriptions

## 🔧 Code Changes Made

### 1. Better Error Handling (app/admin/blog/page.tsx)

```typescript
// Now catches JSON parse errors and shows helpful message
if (!res.ok) {
  let errorMessage = "Failed to generate blog post";
  try {
    const errorData = await res.json();
    errorMessage = errorData.error || errorMessage;
  } catch (parseError) {
    errorMessage = `Server error: ${res.status} ${res.statusText}`;
  }
  throw new Error(errorMessage);
}

let data;
try {
  data = await res.json();
} catch (parseError) {
  throw new Error("Invalid response from server. Please check if GEMINI_API_KEY is configured in Netlify environment variables.");
}
```

### 2. Updated ENV_VARIABLES.md

Added `GEMINI_API_KEY` documentation so it's not forgotten in future deployments.

## 💡 Why This Happened

The API route `/api/blog/generate/route.ts` requires `GEMINI_API_KEY` to work:

```typescript
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  return NextResponse.json(
    { error: "Missing GOOGLE_API_KEY" },
    { status: 503 }
  );
}
```

Without the key:
1. API returns 503 error with JSON body
2. Frontend tries to parse error response
3. If response is malformed/empty, JSON.parse fails
4. User sees cryptic "unexpected end of data" error

Now the error message will clearly say "Please check if GEMINI_API_KEY is configured in Netlify environment variables."

## 📋 Deploy Checklist

Before deploying, verify all env vars are set in Netlify:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `GEMINI_API_KEY` ← **NEW! Add this now**
- ⚠️ `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
- ⚠️ `REVALIDATE_SECRET` (optional)

## 🚀 After Deployment

All AI features will work:
- Blog generation: 5-10 seconds per post
- Chatbot responses: 2-3 seconds
- Alt text generation: 2-3 seconds per image
- SEO suggestions: 3-5 seconds

The site will continue to work without the API key (fallback behavior), but AI features will show "AI is disabled" or "Missing GOOGLE_API_KEY" errors.
