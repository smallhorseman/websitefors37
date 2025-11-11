'use client'

import React from 'react'
import { X, ExternalLink, Monitor, Tablet, Smartphone } from 'lucide-react'

interface PagePreviewModalProps {
  slug: string
  onClose: () => void
}

export default function PagePreviewModal({ slug, onClose }: PagePreviewModalProps) {
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const deviceDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Page Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDevice('desktop')}
                className={`px-3 py-1 rounded ${device === 'desktop' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                title="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`px-3 py-1 rounded ${device === 'tablet' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                title="Tablet"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`px-3 py-1 rounded ${device === 'mobile' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                title="Mobile"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto flex justify-center items-start">
          <div 
            className="bg-white shadow-lg transition-all duration-300"
            style={{
              width: deviceDimensions[device].width,
              height: deviceDimensions[device].height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe
              src={`/${slug}?preview=true`}
              className="w-full h-full border-0"
              title="Page Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
