# Studio37 App Ecosystem

Multi-app photography business platform built on Next.js and React Native, powered by Supabase.

## Project Structure

```
studio37-ecosystem/
├── apps/
│   ├── workflow/          # 📸 Expo app for on-site shoots (in progress)
│   ├── companion/         # 📱 Mobile admin dashboard (planned)
│   ├── client-portal/     # 🎯 Client photo access PWA (planned)
│   └── ai-platform/       # 🤖 AI tools SaaS (planned)
├── packages/
│   └── shared/            # ✅ Shared types, utilities, Supabase client
├── supabase/
│   └── migrations/        # ✅ Database schema with multi-app support
├── app/                   # ✅ Existing Next.js website (admin portal)
├── components/
├── lib/
└── public/
```

## What's Built (Phase 1 Complete ✅)

### Database Schema
**File:** `supabase/migrations/2025-11-04_app_ecosystem_schema.sql`

New tables supporting all 4 apps:
- `app_users` — Multi-app user management (admin, photographer, client, tenant_admin)
- `tenant_config` — White-label multi-tenancy support
- `shoots` — Core workflow entity with shot lists, equipment, GPS
- `shoot_photos` — Links gallery images to shoots
- `client_accounts` — Client Portal access management
- `ai_processing_jobs` — AI Platform job queue
- `app_sessions` — Cross-app session tracking
- `client_favorites` — Photo selection for clients

**Includes:**
- Row Level Security (RLS) policies
- Auto-updated timestamps
- Studio37 as default tenant
- Migration of existing `admin_users` to `app_users`

### Shared Package (@studio37/shared)
**Location:** `packages/shared/`

Provides:
- **TypeScript types** matching database schema
- **Supabase utilities** (client creation, tenant lookup, user helpers)
- **Common utilities** (validation, date formatting, shot list templates)
- **Constants** (shoot types, equipment categories, defaults)

Used by all apps to ensure type safety and code reuse.

### Mono-repo Configuration
- **Turborepo** for fast builds and dev server orchestration
- **Workspaces** for dependency hoisting
- **Parallel execution** of builds/lints across apps

## Next Steps (Phase 2: Workflow App)

### 1. Run Database Migration

Apply the new schema to your Supabase project:

```bash
# Via Supabase CLI (recommended)
supabase db push

# Or manually via Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Paste contents of supabase/migrations/2025-11-04_app_ecosystem_schema.sql
# 3. Run
```

Verify tables created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('app_users', 'shoots', 'tenant_config');
```

### 2. Install Dependencies

```bash
# From project root
npm install

# This will:
# - Install @ducanh2912/next-pwa (from earlier PWA setup)
# - Install turbo for mono-repo orchestration
# - Set up workspaces for packages/shared
```

### 3. Build Shared Package

```bash
cd packages/shared
npm install
npm run build
```

### 4. Initialize Workflow App (Next Session)

We'll scaffold the Expo app with:
- Supabase auth using existing `app_users` table
- Offline SQLite database
- Shoot management screens
- Shot checklist UI
- GPS tagging
- Photo upload queue

## Development Commands

### Existing Website
```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript validation
```

### Mono-repo (After Workflow App Added)
```bash
npm run dev                 # Run all apps in parallel
npm run web:dev             # Website only
npm run workflow:dev        # Workflow App only
npm run build               # Build all apps
```

### Shared Package
```bash
cd packages/shared
npm run dev          # Watch mode (rebuilds on change)
npm run build        # One-time build
npm run typecheck    # Validate types
```

## Environment Variables

### Existing (Already Configured)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### New (Add for Workflow App)
```bash
# Will be added in apps/workflow/.env
EXPO_PUBLIC_SUPABASE_URL=same_as_above
EXPO_PUBLIC_SUPABASE_ANON_KEY=same_as_above
```

## Architecture Decisions

### Why Mono-repo?
- **Shared types** ensure database/API consistency across apps
- **Single source of truth** for Supabase schema
- **Parallel development** of apps without code duplication
- **Easier deployments** (single CI/CD pipeline)

### Why Expo for Mobile?
- **Fast iteration** with hot reload and OTA updates
- **Cross-platform** (iOS + Android from one codebase)
- **Rich ecosystem** for camera, location, offline storage
- **Easy deployment** to TestFlight/Play Console

### Why Offline-First for Workflow App?
- **Shoot locations** often have poor/no network
- **Data safety** — photos saved locally before upload
- **Better UX** — no waiting for network requests
- **Background sync** when connection restored

## Roadmap

- [x] **Phase 1:** Database schema + shared package (DONE)
- [ ] **Phase 2:** Workflow App (Weeks 3-6)
  - [ ] Expo scaffold with Supabase auth
  - [ ] Offline SQLite + sync
  - [ ] Shoot CRUD screens
  - [ ] Shot checklist UI
  - [ ] GPS tagging + photo upload
- [ ] **Phase 3:** Mobile Companion (Weeks 7-9)
- [ ] **Phase 4:** Client Portal (Weeks 10-13)
- [ ] **Phase 5:** AI Platform (Weeks 14-18)
- [ ] **Phase 6:** Internal testing (6 months)
- [ ] **Phase 7:** Marketing launch

## Technical Stack

| Component | Technology |
|-----------|------------|
| **Web Admin** | Next.js 14 + TypeScript |
| **Mobile Apps** | Expo (React Native) |
| **Client Portal** | Next.js PWA |
| **AI Platform** | Next.js + Multi-tenancy |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + custom sessions |
| **Storage** | Supabase Storage + Cloudinary |
| **Payments** | Stripe (planned) |
| **Hosting** | Netlify (web), EAS (mobile) |
| **Mono-repo** | Turborepo |

## Contributing

This is an internal Studio37 project. Development priority:
1. Build features that solve immediate workflow pain
2. Test with real shoots before adding complexity
3. Validate with actual clients before building white-label

## License

Proprietary — Studio37 Photography © 2025
