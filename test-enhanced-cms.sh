#!/bin/bash

# Enhanced CMS - Quick Test Script
# Run this to verify everything is working before deployment

echo "🧪 Enhanced CMS Test Suite"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test file existence
test_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $2"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $2 - File not found: $1"
    ((FAILED++))
  fi
}

echo "1️⃣  Checking Component Files..."
echo "----------------------------"
test_file "components/EnhancedContentManagement.tsx" "EnhancedContentManagement component"
test_file "components/CloudinaryMediaSelector.tsx" "CloudinaryMediaSelector component"
test_file "components/SEOScoreIndicator.tsx" "SEOScoreIndicator component"
test_file "components/PagePreviewModal.tsx" "PagePreviewModal component"
echo ""

echo "2️⃣  Checking Admin Pages..."
echo "-------------------------"
test_file "app/admin/content-enhanced/page.tsx" "Enhanced CMS page"
test_file "app/admin/database-migrations/page.tsx" "Database migrations page"
echo ""

echo "3️⃣  Checking API Routes..."
echo "------------------------"
test_file "app/api/admin/run-migration/route.ts" "Migration runner API"
echo ""

echo "4️⃣  Checking Database Files..."
echo "----------------------------"
test_file "supabase/migrations/2025-11-10_enhanced_content_system.sql" "Enhanced CMS migration"
echo ""

echo "5️⃣  Checking Documentation..."
echo "---------------------------"
test_file "ENHANCED_CMS_GUIDE.md" "Feature guide"
test_file "ENHANCED_CMS_SUMMARY.md" "Implementation summary"
test_file "ENHANCED_CMS_DEPLOYMENT.md" "Deployment checklist"
echo ""

echo "6️⃣  Running TypeScript Type Check..."
echo "----------------------------------"
if command -v npm &> /dev/null; then
  npm run typecheck > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript compilation successful"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} TypeScript errors found - run 'npm run typecheck' for details"
    ((FAILED++))
  fi
else
  echo -e "${YELLOW}⚠${NC} npm not found - skipping TypeScript check"
fi
echo ""

echo "7️⃣  Checking Environment Variables..."
echo "-----------------------------------"
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} .env.local file exists"
  
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL configured"
  else
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_SUPABASE_URL not found"
  fi
  
  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY configured"
  else
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY not found"
  fi
  
  if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    echo -e "${GREEN}✓${NC} SUPABASE_SERVICE_ROLE_KEY configured"
  else
    echo -e "${YELLOW}⚠${NC} SUPABASE_SERVICE_ROLE_KEY not found"
  fi
  
  if grep -q "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" .env.local; then
    echo -e "${GREEN}✓${NC} NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME configured"
  else
    echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not configured (optional)"
  fi
else
  echo -e "${YELLOW}⚠${NC} .env.local not found"
fi
echo ""

echo "8️⃣  Checking Git Status..."
echo "------------------------"
if command -v git &> /dev/null; then
  CHANGED_FILES=$(git status --porcelain | wc -l)
  if [ $CHANGED_FILES -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} $CHANGED_FILES file(s) changed - ready to commit"
    echo ""
    echo "Changed files:"
    git status --short
  else
    echo -e "${GREEN}✓${NC} Working directory clean"
  fi
else
  echo -e "${YELLOW}⚠${NC} Git not found - skipping status check"
fi
echo ""

echo "=========================="
echo "📊 Test Results"
echo "=========================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "Failed: ${RED}$FAILED${NC}"
else
  echo -e "Failed: ${GREEN}0${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Ready for deployment.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Review changes: git diff"
  echo "2. Commit changes: git add . && git commit -m 'feat: Enhanced CMS with 8 major features'"
  echo "3. Run migration: Navigate to /admin/database-migrations"
  echo "4. Deploy: git push origin main"
else
  echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
  exit 1
fi
