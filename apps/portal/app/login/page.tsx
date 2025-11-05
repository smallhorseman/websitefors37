"use client"

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseAnon)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '/' } })
      if (error) throw error
      setMessage('Check your email for a login link!')
    } catch (err: any) {
      setMessage(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Client Login</h1>
      <form onSubmit={handleLogin} style={{ marginTop: 16, display: 'grid', gap: 12, maxWidth: 360 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Sending…' : 'Send Magic Link'}</button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  )
}
