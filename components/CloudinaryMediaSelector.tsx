'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, Loader2, Search, Folder, Image as ImageIcon } from 'lucide-react'

interface CloudinaryMediaSelectorProps {
  onSelect: (url: string) => void
  onClose: () => void
  cloudName?: string
}

export default function CloudinaryMediaSelector({ 
  onSelect, 
  onClose,
  cloudName = 'studio37' 
}: CloudinaryMediaSelectorProps) {
  const [loading, setLoading] = useState(true)
  const [cloudinaryWidgetLoaded, setCloudinaryWidgetLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Load Cloudinary Upload Widget Script
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => setCloudinaryWidgetLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openCloudinaryWidget = () => {
    if (!(window as any).cloudinary) {
      alert('Cloudinary widget not loaded yet. Please try again.')
      return
    }

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: 'studio37_preset', // You'll need to create this in Cloudinary
        sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'],
        maxImageFileSize: 10000000, // 10MB
        maxImageWidth: 4000,
        maxImageHeight: 4000,
        cropping: true,
        croppingAspectRatio: null,
        croppingShowDimensions: true,
        folder: 'website',
        showAdvancedOptions: true,
        showCompletedButton: true,
        showUploadMoreButton: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0E2F5A',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Poppins',
              active: true
            }
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const url = result.info.secure_url
          onSelect(url)
          widget.close()
        }
      }
    )

    widget.open()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Select or Upload Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Quick Actions */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={openCloudinaryWidget}
              disabled={!cloudinaryWidgetLoaded}
              className="flex-1 px-6 py-8 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors flex flex-col items-center gap-3 disabled:opacity-50"
            >
              <Upload className="h-12 w-12 text-primary-600" />
              <div className="text-center">
                <div className="font-semibold text-lg">Upload New Image</div>
                <div className="text-sm text-gray-500">From your computer or cloud storage</div>
              </div>
            </button>

            <div className="flex-1 px-6 py-8 border-2 border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center gap-3">
              <Folder className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-700">Browse Media Library</div>
                <div className="text-sm text-gray-500">Coming soon - view all uploaded images</div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Image Upload Guidelines
            </h3>
            <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
              <li>Supported formats: JPG, PNG, GIF, WebP, SVG, AVIF</li>
              <li>Maximum file size: 10 MB</li>
              <li>Recommended dimensions: 1920x1080 or higher for best quality</li>
              <li>Images will be automatically optimized for web delivery</li>
              <li>Use cropping tool to adjust aspect ratio if needed</li>
            </ul>
          </div>

          {/* Cloudinary Management Link */}
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Advanced Media Management</h3>
            <p className="text-sm text-gray-600 mb-3">
              For advanced features like folders, transformations, and bulk operations, 
              use the Cloudinary console.
            </p>
            <a
              href={`https://console.cloudinary.com/console/${cloudName}/media_library`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Open Cloudinary Console
              <X className="h-4 w-4 rotate-45" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
