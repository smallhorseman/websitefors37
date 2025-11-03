import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { getClientIp, rateLimit } from '@/lib/rateLimit'
import { createSession } from '@/lib/authSession'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic input validation
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Rate limit by client IP (5 attempts per 5 minutes)
    const ip = getClientIp(request.headers)
    const rl = rateLimit(`login:${ip}`, { limit: 5, windowMs: 5 * 60 * 1000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      return new NextResponse(JSON.stringify({ error: 'Too many attempts. Try again later.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter)
        }
      })
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Query admin user from database
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Determine if hash is bcrypt or legacy/plain
    const hash: string | null = user.password_hash || null
    let passwordMatch = false

    if (hash && typeof hash === 'string' && hash.startsWith('$2')) {
      // Modern bcrypt hash
      passwordMatch = await bcrypt.compare(password, hash)
    } else if (hash && typeof hash === 'string') {
      // Legacy plaintext -> migrate on successful match
      if (password === hash) {
        const newHash = await bcrypt.hash(password, 12)
        await supabase
          .from('admin_users')
          .update({ password_hash: newHash })
          .eq('id', user.id)
        passwordMatch = true
      }
    }

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a strong session token stored server-side (hashed)
    const ip = getClientIp(request.headers)
    const userAgent = request.headers.get('user-agent') || undefined
    const session = await createSession({ userId: user.id, ip, userAgent })
    if (!session) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Set HTTP-only cookie with the opaque token
    const cookieStore = await cookies()
    cookieStore.set('admin_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000),
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
