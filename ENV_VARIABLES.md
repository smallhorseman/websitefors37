# Environment Variables Reference

This file documents all environment variables used in the project.

## Required (Server-Side)

### Supabase
```bash
# Get these from your Supabase project settings
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Required (Client-Side)

### Supabase Public
```bash
# Safe to expose to the browser
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Optional (Analytics & SEO)

### Google Analytics
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Google Search Console
```bash
GOOGLE_SITE_VERIFICATION=your-verification-code
```

## Optional (AI Features)

### Google Gemini API

```bash
# Get from: https://aistudio.google.com/app/apikey
# Used for: Blog post generation, chatbot, SEO suggestions, alt text generation
GEMINI_API_KEY=your-gemini-api-key-here
# or
GOOGLE_API_KEY=your-gemini-api-key-here
```

## Optional (Features)

### On-Demand Revalidation

```bash
# Secret for on-demand ISR revalidation API
# Generate with: openssl rand -base64 32
REVALIDATE_SECRET=your-random-secret-here

# Base URL for your site (needed for client-side revalidation calls)
NEXT_PUBLIC_SITE_URL=https://studio37.cc
# or for local dev:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Build Analysis

```bash
# Set to 'true' to generate bundle analysis report during build
ANALYZE=true
```

## Deployment-Specific

### Netlify
```bash
```

### Netlify

```bash
```

## Example .env.local

Create this file in your project root (never commit it):

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# AI Features (required for blog generator, chatbot, alt text)
GEMINI_API_KEY=your-gemini-api-key-here

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=abcd1234

# On-Demand Revalidation (optional)
REVALIDATE_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Build (optional)
# ANALYZE=true
```

## Security Notes

- **Never commit `.env.local`** to version control
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `REVALIDATE_SECRET` secure
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Rotate secrets periodically in production
- Use different values for dev/staging/production environments
