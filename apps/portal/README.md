# Studio37 Client Portal (apps/portal)

Minimal Next.js 14 App Router scaffold for the Client Portal.

- Auth: Supabase OTP login (email link)
- Shared: Uses `@studio37/shared` for future types/utils
- Build: Lint/TS errors ignored during build; CI should typecheck separately

## Dev

```bash
npm install
npm run dev --workspace=portal
```

Ensure env vars are set (or use placeholders):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
