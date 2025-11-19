import React from 'react'
import Link from 'next/link'
import EditorFormClient from './EditorFormClient'

export const dynamic = 'force-dynamic'

export default function EditorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inline Editor</h1>
        <p className="text-gray-600 mt-1">Use ?edit=1 on any page to reveal Edit badges, then click one to deep-link here. Below is a basic form for common blocks.</p>
      </div>

      <EditorFormClient />

      <div className="mt-6 flex gap-3">
        <Link href="/" className="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Go to site</Link>
        <Link href="/?edit=1" className="inline-block px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Preview with ?edit=1</Link>
      </div>
    </div>
  )
}
