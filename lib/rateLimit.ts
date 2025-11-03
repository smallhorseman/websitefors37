// Simple in-memory IP-based rate limiter for serverless functions
// Note: Memory resets between cold starts. Good enough as a lightweight guard.

export type RateLimitOptions = {
  limit: number // allowed requests within the window
  windowMs: number // time window in milliseconds
}

type Entry = {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export function getClientIp(headers: Headers): string {
  const xfwd = headers.get('x-forwarded-for') || ''
  const real = headers.get('x-real-ip') || ''
  const ip = xfwd.split(',')[0].trim() || real || 'unknown'
  return ip
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions) {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // Initialize or reset window
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (entry.count < limit) {
    entry.count += 1
    store.set(key, entry)
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
  }

  // Blocked
  return { allowed: false, remaining: 0, resetAt: entry.resetAt }
}
