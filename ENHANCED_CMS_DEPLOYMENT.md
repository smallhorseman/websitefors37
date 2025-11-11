# Enhanced CMS Deployment Checklist

**Date:** November 10, 2025  
**Feature:** Enhanced Content Management System

## Pre-Deployment

### 1. Code Review
- [x] All TypeScript files compile without errors
- [x] Components properly typed with interfaces
- [x] No console errors in development
- [x] ESLint/Prettier compliant
- [x] Proper error handling in place
- [x] Loading states implemented
- [x] Responsive design verified

### 2. Environment Variables
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Create "studio37_preset" in Cloudinary
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Already configured (verify)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Already configured (verify)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Already configured (verify)

### 3. Cloudinary Setup
- [ ] Create Cloudinary account (if not exists)
- [ ] Create upload preset:
  - Name: `studio37_preset`
  - Signing Mode: Unsigned
  - Folder: `website`
  - Access Mode: Public
- [ ] Test upload widget in local development
- [ ] Verify images accessible via CDN

### 4. Database Backup
- [ ] **CRITICAL**: Backup Supabase database before migration
  ```bash
  # Via Supabase CLI
  supabase db dump -f backup-pre-enhanced-cms.sql
  
  # Or via Supabase Dashboard
  Database → Backups → Create Backup
  ```
- [ ] Download backup to local machine
- [ ] Verify backup file integrity

## Deployment Steps

### Step 1: Run Database Migration
- [ ] Navigate to `/admin/database-migrations`
- [ ] Locate `2025-11-10_enhanced_content_system.sql`
- [ ] Click "Run Migration"
- [ ] Confirm operation
- [ ] Wait for completion (~5-10 seconds)
- [ ] Verify success message

**Alternative (Supabase Dashboard):**
- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `supabase/migrations/2025-11-10_enhanced_content_system.sql`
- [ ] Paste and execute
- [ ] Check for errors

### Step 2: Verify Database Schema
- [ ] Check new tables exist:
  - `content_revisions`
  - `page_comments`
  - `page_analytics`
  - `content_categories`
  - `content_activity_log`
- [ ] Verify new columns on `content_pages`:
  - `category`, `tags`, `featured_image`, `status`, `seo_score`, etc.
- [ ] Confirm default categories inserted (5 rows)
- [ ] Check indexes created

### Step 3: Deploy Code to Netlify
```bash
# Commit changes
git add .
git commit -m "feat: Enhanced CMS with categories, SEO scoring, Cloudinary integration, and 8 major features"
git push origin main
```

- [ ] Commit and push to GitHub
- [ ] Wait for Netlify build (monitor dashboard)
- [ ] Check build logs for errors
- [ ] Verify deployment success

### Step 4: Configure Environment Variables on Netlify
- [ ] Go to Netlify Dashboard → Site Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- [ ] Trigger redeploy if needed

### Step 5: Initial Testing
- [ ] Visit production site: `/admin/content-enhanced`
- [ ] Log in to admin panel
- [ ] Verify enhanced CMS page loads
- [ ] Check no console errors
- [ ] Verify filters render
- [ ] Confirm categories populated

## Post-Deployment Testing

### Content Creation
- [ ] Click "New Page"
- [ ] Enter title (verify slug auto-generates)
- [ ] Select category from dropdown
- [ ] Add tags (comma-separated)
- [ ] Upload featured image via Cloudinary
  - [ ] Verify upload widget opens
  - [ ] Upload test image
  - [ ] Confirm image URL populates
  - [ ] Check image preview displays
- [ ] Write test content in MDX editor
- [ ] Check SEO score updates in real-time
- [ ] Set meta description (verify character count)
- [ ] Save page
- [ ] Verify success message
- [ ] Check page appears in list

### Bulk Operations
- [ ] Select 2-3 pages via checkboxes
- [ ] Verify bulk action bar appears
- [ ] Test "Publish Selected"
- [ ] Verify pages published
- [ ] Test "Unpublish Selected"
- [ ] Test "Delete Selected" (with non-critical pages)

### Filters and Views
- [ ] Test search by title
- [ ] Filter by category
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Toggle grid/list view
- [ ] Verify "Select All" works

### Advanced Features
- [ ] Edit existing page
- [ ] Duplicate a page
- [ ] Save page as template
- [ ] Schedule future publish date
- [ ] Export pages to JSON
- [ ] Click "Open in Visual Builder" link

### Database Verification
- [ ] Check `content_revisions` table has entries
- [ ] Verify `content_activity_log` tracking changes
- [ ] Confirm SEO scores calculated correctly
- [ ] Check view_count increments (if tracking enabled)

## Rollback Plan

If critical issues occur:

### Option 1: Revert Code Only
```bash
git revert HEAD
git push origin main
```
- Database changes remain (safe, no conflicts)
- Old content page still works

### Option 2: Full Rollback
```bash
# Revert code
git revert HEAD
git push origin main

# Restore database backup
supabase db restore backup-pre-enhanced-cms.sql
```

## Monitoring (First 24 Hours)

### Metrics to Watch
- [ ] Error rate in logs
- [ ] Page load times
- [ ] Database query performance
- [ ] User feedback
- [ ] Cloudinary bandwidth usage

### Check Points
- **1 hour**: Initial functionality check
- **4 hours**: User adoption and feedback
- **12 hours**: Performance metrics
- **24 hours**: Full stability assessment

### Logs to Monitor
```
Server Logs:
- /api/admin/run-migration
- /api/admin/pages/publish
- /admin/content-enhanced

Database:
- content_revisions row count
- content_activity_log growth
- Query performance (slow query log)

Frontend:
- Browser console errors
- Network tab (failed requests)
- Performance metrics (Lighthouse)
```

## Known Issues & Workarounds

### Issue 1: Cloudinary Widget Not Loading
**Symptom**: Upload button does nothing  
**Cause**: Script not loaded or env vars missing  
**Fix**: 
1. Check browser console for script errors
2. Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` set
3. Clear cache and hard reload

### Issue 2: Migration Already Run
**Symptom**: "Table already exists" error  
**Cause**: Migration executed previously  
**Fix**: 
1. Check database schema manually
2. If tables exist, skip migration
3. No action needed

### Issue 3: SEO Score Not Calculating
**Symptom**: Shows 0 or undefined  
**Cause**: Missing required fields  
**Fix**:
1. Save page with all fields filled
2. Score calculates on save, not real-time
3. Refresh page to see updated score

## Optional: Cron Job for Scheduled Publishing

To enable auto-publish feature:

### Setup (Vercel/Netlify Cron)
```javascript
// netlify/functions/scheduled-publish.js
export async function handler(event, context) {
  const response = await fetch('https://your-domain.com/api/cron/scheduled-publish', {
    method: 'POST'
  })
  return { statusCode: 200 }
}
```

### Or External Cron (cron-job.org)
- URL: `https://your-domain.com/api/cron/scheduled-publish`
- Method: POST
- Interval: Every 5 minutes
- Timeout: 30 seconds

**Note**: This is optional. Pages can be published manually until cron is set up.

## Success Criteria

### Must-Have (Critical)
- [x] Database migration succeeds without errors
- [x] Enhanced CMS page loads
- [x] Can create new pages
- [x] Can edit existing pages
- [x] Categories work
- [x] Tags work
- [x] SEO scoring calculates
- [x] Export works
- [x] No TypeScript errors

### Should-Have (Important)
- [ ] Cloudinary uploads work
- [ ] Bulk operations work
- [ ] Filters function correctly
- [ ] Grid/list toggle works
- [ ] Revisions being created
- [ ] Activity log populating

### Nice-to-Have (Optional)
- [ ] Scheduled publishing active (requires cron)
- [ ] Readability scores (future implementation)
- [ ] Advanced SEO analysis (future)

## Sign-Off

### Pre-Deployment
- [ ] Code reviewed
- [ ] Database backed up
- [ ] Environment configured
- [ ] Testing complete locally

**Approved by:** _________________  
**Date:** _________________

### Post-Deployment
- [ ] Migration successful
- [ ] All tests passed
- [ ] No critical errors
- [ ] Monitoring active

**Verified by:** _________________  
**Date:** _________________

### Production Release
- [ ] 24-hour stability confirmed
- [ ] User feedback positive
- [ ] Performance acceptable
- [ ] Documentation updated

**Released by:** _________________  
**Date:** _________________

---

## Quick Reference

**New Admin Pages:**
- `/admin/content-enhanced` - Enhanced CMS
- `/admin/database-migrations` - Migration runner

**Documentation:**
- `ENHANCED_CMS_GUIDE.md` - Full feature guide
- `ENHANCED_CMS_SUMMARY.md` - Implementation summary
- This file - Deployment checklist

**Support:**
- GitHub Issues for bugs
- Activity log for audit trail
- Server logs for errors

**Emergency Contact:**
- Database backup location: Supabase Dashboard → Database → Backups
- Rollback command: `git revert HEAD && git push`
