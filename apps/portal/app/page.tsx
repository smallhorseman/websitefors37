import Link from 'next/link'

export default function PortalHome() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Studio37 Client Portal</h1>
      <p style={{ marginTop: 12 }}>Welcome! Sign in to view your galleries and bookings.</p>
      <div style={{ marginTop: 16 }}>
        <Link href="/login">Go to Login</Link>
      </div>
    </main>
  )
}
