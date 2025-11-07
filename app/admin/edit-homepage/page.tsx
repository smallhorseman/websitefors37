"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectEditHomepage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/live-editor')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-600">
        <div className="text-3xl mb-2">🏠</div>
        <p className="font-medium">Edit Homepage is no longer available.</p>
        <p className="text-sm">Redirecting to Live Page Editor…</p>
      </div>
    </div>
  )
}
