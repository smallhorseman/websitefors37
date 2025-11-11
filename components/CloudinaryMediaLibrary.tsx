'use client'

import { useEffect, useRef } from 'react'

interface CloudinaryMediaLibraryProps {
  cloudName?: string
  apiKey?: string
  onSelect: (result: { url: string; public_id: string; format: string }) => void
  onClose: () => void
  multiple?: boolean
  defaultTransformations?: string
}

// Cloudinary Media Library integration
// Requires: <script src="https://media-library.cloudinary.com/global/all.js"></script> in your HTML head
export default function CloudinaryMediaLibrary({
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmjxho2rl',
  apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || 'vUNjMPwdih0k4Y_I9sEPjnNTlZo',
  onSelect,
  onClose,
  multiple = false,
  defaultTransformations = 'f_auto,q_auto,w_1200'
}: CloudinaryMediaLibraryProps) {
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Check if Cloudinary Media Library is loaded
    if (typeof window === 'undefined' || !(window as any).cloudinary) {
      console.error('Cloudinary Media Library not loaded. Add script to your page: https://media-library.cloudinary.com/global/all.js')
      return
    }

    const ml = (window as any).cloudinary.createMediaLibrary(
      {
        cloud_name: cloudName,
        api_key: apiKey,
        multiple,
        max_files: multiple ? 10 : 1,
        insert_caption: 'Select',
        default_transformations: [[{ quality: 'auto', fetch_format: 'auto' }]],
        inline_container: '#cloudinary-widget-container',
      },
      {
        insertHandler: (data: any) => {
          const assets = data.assets || []
          if (assets.length > 0) {
            const asset = assets[0]
            // Build Cloudinary URL with transformations
            const url = `https://res.cloudinary.com/${cloudName}/image/upload/${defaultTransformations}/${asset.public_id}.${asset.format}`
            onSelect({
              url,
              public_id: asset.public_id,
              format: asset.format
            })
          }
          ml.hide()
        },
      }
    )

    widgetRef.current = ml
    ml.show()

    return () => {
      if (widgetRef.current) {
        widgetRef.current.hide()
      }
    }
  }, [cloudName, apiKey, multiple, defaultTransformations, onSelect])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Media from Cloudinary</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="cloudinary-widget-container" className="flex-1 overflow-auto" />
      </div>
    </div>
  )
}
