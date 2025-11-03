# Security Audit Report — Studio37 Website

Date: 2025-11-02

## Summary

We performed a focused security audit after suspicious activity. The largest risk was that admin routes were effectively unprotected at the edge. We restored and strengthened server-side protections, implemented secure password verification, introduced database-backed session tokens, and added lightweight rate limiting on auth endpoints.

Status: Immediate risks mitigated. No malware or injected code found.

---

## Key Changes (Implemented)

1. Hardened middleware for admin access

- File: `middleware.ts`
- Change: Require presence of `admin_session` cookie for `/admin` routes (excluding `/login` and `/setup-admin`), and removed broad `Access-Control-Allow-Origin: *` header. Keeps minimal security headers.

1. Secure password verification and migration

- File: `app/api/auth/login/route.ts`
- Change: Switched to `bcryptjs.compare()` for verification. If a legacy plaintext `password_hash` is detected and matches, it is migrated to a bcrypt hash on successful login.
- Added input validation and improved cookie flags (HttpOnly, Secure in prod, SameSite=Strict).

1. Strong, database-backed session tokens

- File: `lib/authSession.ts` (new)
- File: `supabase/admin_sessions.sql` (new)
- File: `lib/auth.ts` (updated)
- Change: Login now creates a cryptographically random token. Only the SHA-256 hash is stored in the `admin_sessions` table. `getAdminUser()` validates tokens by hash, checks expiration and revocation, and joins to `admin_users`.

1. Logout revocation

- File: `app/api/auth/logout/route.ts`
- Change: Revokes the server-side session (marks `revoked=true`) before deleting the cookie.

1. Lightweight rate limiting

- File: `lib/rateLimit.ts` (new)
- Files: `app/api/auth/login/route.ts`, `app/api/auth/session/route.ts`
- Change: IP-based limits to reduce brute force and abuse.

1. Dependency

- File: `package.json`
- Change: Added `bcryptjs`.

---

## Findings

- Admin protection gap: Active middleware didn’t enforce auth on `/admin`. Fixed.
- No malicious code: No obfuscation, evals, or suspicious injections found.
- Password handling: Previously compared plaintext; now uses bcrypt with auto-migration.
- Sessions: Previously cookie stored user id; now uses opaque token with hashed DB storage.
- Secrets: No hardcoded keys found; env usage looks correct.
- Config: Reasonable security headers; can be tightened further via CSP if needed.

---

## Remaining Risks & Recommendations (Prioritized)

1. Session rotation and activity tracking

- Rotate tokens periodically and/or update `last_used_at` on successful validations.
- Add a cleanup job for expired sessions (SQL or scheduled function).

1. Expand rate limiting

- Move rate limits to a shared store (Redis/Upstash) for consistency across instances and cold starts.
- Add limits to sensitive write endpoints beyond auth.

1. Re-enable secrets scanning

- Netlify: Set `SECRETS_SCAN_SMART_DETECTION_ENABLED = "true"` in `netlify.toml` to catch accidental leaks.

1. Tighten CSP

- Add a stricter Content Security Policy once all allowed domains are enumerated. Consider nonce/sha-based script policies.

1. RLS policies review (Supabase)

- Confirm appropriate RLS policies for `admin_users` and `admin_sessions`. If using the anon key on server, ensure policies allow necessary server-side operations securely (or use a service role).

1. Administrative safeguards

- Consider account lockout after repeated failed logins (per account), and audit logging for admin actions.

---

## How to Apply the DB Changes

Run the SQL at `supabase/admin_sessions.sql` in the Supabase SQL editor or your migration system to create the `admin_sessions` table and indexes.

---

## How to Verify

- Attempt to visit an `/admin` route without logging in: you should be redirected to `/login`.
- Log in with valid credentials:
  - A new session row should appear in `admin_sessions` with a `token_hash` and a future `expires_at`.
  - Cookie `admin_session` should be set (HttpOnly, SameSite=Strict, Secure in production).
- Repeated failed login attempts should eventually return HTTP 429 with `Retry-After`.
- Logout should revoke the session row (set `revoked=true`) and clear the cookie.

---

## Rollback Plan (If Needed)

- Middleware: Restore `middleware.backup.ts` behavior or previous `middleware.ts` (not recommended).
- Auth: Revert `app/api/auth/login/route.ts`, `lib/auth.ts`, and remove `lib/authSession.ts`. Clear `admin_sessions` table.

Note: Rolling back will reintroduce prior risks. Prefer forward fixes over rollback.

---

## Next Steps We Can Implement Quickly

- Add token rotation + `last_used_at` updates.
- Create a small SQL cleanup script and (optionally) a scheduled job to remove expired sessions.
- Switch rate limiting to a shared store for production reliability.
- Enable Netlify secrets scanning and draft a stricter CSP.

If you want any of the above implemented now, say the word and I’ll wire it up.
