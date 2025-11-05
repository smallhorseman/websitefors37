# Studio37 Workflow App

React Native (Expo) mobile app for on-site photography shoot management.

## Features (MVP)

- ✅ Supabase authentication
- ✅ Offline-first SQLite database
- ✅ Shoot management (create, list, view)
- ✅ Shot checklist with progress tracking
- ✅ Equipment verification
- 🚧 GPS location tagging (next)
- 🚧 Photo upload queue (next)
- 🚧 Background sync (next)

## Setup

### 1. Install Dependencies

```bash
cd apps/workflow
npm install
```

### 2. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get these from your Next.js web app's .env.local
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Run the App

```bash
# Start Expo dev server
npm start

# Then press:
# i - iOS simulator
# a - Android emulator
# w - Web browser
```

## Architecture

### Offline-First Design

```
User creates shoot (no network)
    ↓
Save to local SQLite
    ↓
Add to sync queue
    ↓
When online → Background sync to Supabase
    ↓
Update local DB with server IDs
```

### Data Flow

1. **Local Database (SQLite)**
   - Primary data store while offline
   - Instant reads/writes
   - Sync queue for pending operations

2. **Supabase (PostgreSQL)**
   - Source of truth when online
   - Shared across all apps
   - RLS policies enforce tenant isolation

3. **Sync Strategy**
   - Pull on app launch
   - Push on network restore
   - Conflict resolution: server wins

## Project Structure

```
apps/workflow/
├── src/
│   ├── screens/          # UI screens
│   │   ├── LoginScreen.tsx
│   │   ├── ShootsListScreen.tsx
│   │   ├── ShootDetailScreen.tsx (stub)
│   │   └── CreateShootScreen.tsx
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client
│   │   └── database.ts   # SQLite operations
│   └── components/       # (empty, add as needed)
├── App.tsx               # Entry point
├── app.json              # Expo config
└── package.json
```

## Using Shared Package

Import types and utilities from `@studio37/shared`:

```typescript
import type { Shoot, AppUser } from '@studio37/shared'
import { formatShootDate, calculateShootProgress } from '@studio37/shared'
```

## Next Steps (Phase 2 Continuation)

### ShootDetailScreen (High Priority)
- [ ] Load shoot from local database
- [ ] Render shot checklist with checkboxes
- [ ] Equipment checklist
- [ ] Mark shots as complete
- [ ] Add notes to individual shots
- [ ] Show completion progress

### GPS & Location
- [ ] Get current location on mount
- [ ] Tag shoot with GPS coordinates
- [ ] Store location metadata with photos
- [ ] Display location on map

### Photo Upload
- [ ] Select photos from library
- [ ] Upload to Supabase Storage
- [ ] Link to shoot and shot list items
- [ ] Show upload progress
- [ ] Queue for background sync

### Background Sync
- [ ] Detect network changes
- [ ] Process sync queue automatically
- [ ] Handle conflicts
- [ ] Retry failed syncs

## Testing

### Test User Credentials

Use an admin user from your `admin_users` table (migrated to `app_users`).

Example:
```
Email: your_admin_email@example.com
Password: your_password
```

### Test Workflow

1. **Login** → Should show shoots list
2. **Create Shoot** → Tap + button
3. **Fill Form** → Title, type (wedding), date, location
4. **View Shoot** → Tap card → See details (stub for now)
5. **Offline Test** → Turn off wifi → Create shoot → Turn on wifi → Should sync

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in `apps/workflow/`
- Restart Expo dev server after creating `.env`

### SQLite errors
- Clear app data: `expo start --clear`
- Reinstall: `expo install expo-sqlite`

### Auth not working
- Check Supabase URL and anon key are correct
- Verify user exists in `app_users` table with `workflow: true` in `app_access`
- Check RLS policies allow reads for authenticated users

## Development Tips

- Use Expo Go app on physical device for best testing (camera, GPS)
- iOS Simulator works for UI but limited for photos/location
- Android emulator supports mock locations
- Web works for basic UI testing only

## Deployment

Build with EAS (Expo Application Services):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

TestFlight (iOS): Upload .ipa from EAS
Google Play (Android): Upload .aab from EAS

---

Built with ❤️ for Studio37 Photography
