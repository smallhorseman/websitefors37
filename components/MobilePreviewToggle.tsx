'use client'

import React, { useState } from 'react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface MobilePreviewToggleProps {
  children: React.ReactNode
  defaultMode?: DeviceMode
  // Controlled mode props (optional). If provided, component becomes controlled.
  mode?: DeviceMode
  onModeChange?: (mode: DeviceMode) => void
  // When false, hides the built-in controls bar and only applies the device frame/constraints.
  showControls?: boolean
}

export default function MobilePreviewToggle({ 
  children, 
  defaultMode = 'desktop',
  mode: controlledMode,
  onModeChange,
  showControls = true,
}: MobilePreviewToggleProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState<DeviceMode>(defaultMode)
  const mode = controlledMode ?? uncontrolledMode

  const setMode = (next: DeviceMode) => {
    if (controlledMode !== undefined) {
      onModeChange?.(next)
    } else {
      setUncontrolledMode(next)
      onModeChange?.(next)
    }
  }

  const deviceStyles: Record<DeviceMode, { width: string; height: string }> = {
    desktop: { width: '100%', height: 'auto' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  }

  const currentStyle = deviceStyles[mode]

  return (
    <div className="flex flex-col h-full">
      {/* Device Toggle Bar */}
      {showControls && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Preview:</span>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('desktop')}
                className={`p-2 rounded transition-all ${
                  mode === 'desktop'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop view"
                aria-label="Desktop view"
              >
                <Monitor className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMode('tablet')}
                className={`p-2 rounded transition-all ${
                  mode === 'tablet'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet view (768px)"
                aria-label="Tablet view"
              >
                <Tablet className="h-5 w-5" />
              </button>
              <button
                onClick={() => setMode('mobile')}
                className={`p-2 rounded transition-all ${
                  mode === 'mobile'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile view (375px)"
                aria-label="Mobile view"
              >
                <Smartphone className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {mode === 'desktop' && 'Full width'}
            {mode === 'tablet' && '768 × 1024px'}
            {mode === 'mobile' && '375 × 667px'}
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8">
        <div className="mx-auto transition-all duration-300" style={{ maxWidth: currentStyle.width }}>
          {mode !== 'desktop' && (
            <div 
              className="bg-white rounded-lg shadow-2xl overflow-hidden mx-auto"
              style={{ 
                width: currentStyle.width,
                minHeight: currentStyle.height,
                border: '8px solid #1f2937',
                borderRadius: mode === 'mobile' ? '2rem' : '1rem'
              }}
            >
              {/* Device notch for mobile */}
              {mode === 'mobile' && (
                <div className="bg-gray-900 h-6 flex items-center justify-center">
                  <div className="bg-gray-800 rounded-full h-4 w-24"></div>
                </div>
              )}
              <div className="overflow-auto" style={{ height: mode === 'mobile' ? 'calc(667px - 1.5rem)' : currentStyle.height }}>
                {children}
              </div>
            </div>
          )}
          {mode === 'desktop' && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
