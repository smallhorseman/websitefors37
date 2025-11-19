"use client"

import React from 'react'
import Link from 'next/link'

/**
 * Simple test page to verify the inline editor works
 * Visit /admin/editor-test to try it
 */
export default function EditorTestPage() {
  const [showOverlay, setShowOverlay] = React.useState(false)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Editor Test Page</h1>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Step 1: Check if overlay toggle works</h2>
          <button 
            onClick={() => setShowOverlay(!showOverlay)}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            {showOverlay ? 'Hide' : 'Show'} Overlay
          </button>
          {showOverlay && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              ✓ Overlay is working! Client-side rendering OK.
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Step 2: Try the editor form</h2>
          <Link 
            href="/admin/editor?block=HeroBlock&id=hero&path=/"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Open Editor Form
          </Link>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Step 3: Visit homepage with ?edit=1</h2>
          <Link 
            href="/?edit=1"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Go to Homepage (edit mode)
          </Link>
          <p className="text-sm text-gray-600 mt-2">You should see Edit badges on Hero and Calculator blocks</p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="font-semibold mb-2">Troubleshooting</h2>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>If no Edit badges appear: Check browser console (F12) for errors</li>
            <li>If editor form doesn't load: Check /admin/editor URL works</li>
            <li>If save fails: Check Supabase page_configs table exists</li>
            <li>Only pages with HeroBlock or PricingCalculatorBlock show Edit badges currently</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
