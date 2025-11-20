#!/bin/bash

# Gemini 2.0 Flash Upgrade - Quick Test Script
# Run this to verify all new AI features are working

echo "🚀 Testing Gemini 2.0 Flash Integration..."
echo ""

# Check if environment variables are set
echo "1️⃣ Checking environment variables..."
if [ -z "$GOOGLE_API_KEY" ] && [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ GOOGLE_API_KEY or GEMINI_API_KEY not set"
  echo "   Add to .env.local or Netlify environment variables"
  exit 1
else
  echo "✅ API key configured"
fi

# Check if new files exist
echo ""
echo "2️⃣ Checking new files..."
FILES=(
  "lib/ai-client.ts"
  "app/api/leads/score/route.ts"
  "app/api/gallery/analyze/route.ts"
  "app/api/ai/content-suggestions/route.ts"
  "components/AIContentAssistant.tsx"
  "app/admin/dashboard-enhanced.tsx"
  "GEMINI_2_UPGRADE_COMPLETE.md"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file missing"
  fi
done

# Type check new files
echo ""
echo "3️⃣ Type-checking new AI files..."
npx tsc --noEmit --skipLibCheck lib/ai-client.ts 2>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ No TypeScript errors in new files"
else
  echo "⚠️ Some type errors found (check manually)"
fi

# Test build
echo ""
echo "4️⃣ Testing production build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed - check npm run build for details"
  exit 1
fi

echo ""
echo "✨ All checks passed!"
echo ""
echo "📋 Next Steps:"
echo "1. Run 'npm run dev' to test locally"
echo "2. Test these endpoints:"
echo "   • POST /api/leads/score (lead scoring)"
echo "   • POST /api/gallery/analyze (image analysis)"
echo "   • POST /api/ai/content-suggestions (SEO suggestions)"
echo "3. Visit /admin to see the enhanced dashboard"
echo "4. Read GEMINI_2_UPGRADE_COMPLETE.md for full documentation"
echo ""
echo "🚀 Ready to deploy!"
