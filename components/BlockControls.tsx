'use client'

import React from 'react'
import { GripVertical, Settings, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'

export interface BlockControlsProps {
  blockType: string
  blockLabel?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onAddBefore?: () => void
  onAddAfter?: () => void
  isFirst?: boolean
  isLast?: boolean
  showSettings?: boolean
  children?: React.ReactNode
}

export default function BlockControls({
  blockType,
  blockLabel,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
  onAddBefore,
  onAddAfter,
  isFirst = false,
  isLast = false,
  showSettings = false,
  children
}: BlockControlsProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return (
    <div className="relative group">
      {/* Top Add Button (appears on hover) */}
      {onAddBefore && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={onAddBefore}
            className="bg-primary-600 text-white rounded-full p-2 shadow-lg hover:bg-primary-700 transition-all hover:scale-110"
            title="Add block above"
            aria-label="Add block above"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Block Container */}
      <div className="relative border-2 border-transparent hover:border-primary-300 rounded-lg transition-all">
        {/* Control Bar (appears on hover) */}
        <div className="absolute -top-3 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 flex items-center justify-between">
            {/* Left: Drag Handle + Label */}
            <div className="flex items-center gap-2">
              <button
                className="cursor-move touch-none p-1 hover:bg-gray-700 rounded transition"
                title="Drag to reorder"
                aria-label="Drag to reorder block"
              >
                <GripVertical className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium">
                {blockLabel || blockType}
              </span>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Move Up */}
              {onMoveUp && !isFirst && (
                <button
                  onClick={onMoveUp}
                  className="p-2 hover:bg-gray-700 rounded transition touch-action-none"
                  title="Move up"
                  aria-label="Move block up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              )}

              {/* Move Down */}
              {onMoveDown && !isLast && (
                <button
                  onClick={onMoveDown}
                  className="p-2 hover:bg-gray-700 rounded transition touch-action-none"
                  title="Move down"
                  aria-label="Move block down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}

              {/* Settings */}
              {(onEdit || showSettings) && (
                <button
                  onClick={() => {
                    setSettingsOpen(!settingsOpen)
                    if (onEdit) onEdit()
                  }}
                  className={`p-2 hover:bg-gray-700 rounded transition touch-action-none ${
                    settingsOpen ? 'bg-gray-700' : ''
                  }`}
                  title="Block settings"
                  aria-label="Block settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              )}

              {/* Delete */}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 hover:bg-red-600 rounded transition touch-action-none"
                  title="Delete block"
                  aria-label="Delete block"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Block Content */}
        <div className="relative">
          {children}
        </div>

        {/* Settings Panel (collapsible) */}
        {settingsOpen && showSettings && (
          <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Block Settings</h4>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close settings"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
            {/* Settings content would go here */}
            <div className="text-sm text-gray-600">
              Settings for {blockLabel || blockType} block
            </div>
          </div>
        )}
      </div>

      {/* Bottom Add Button (appears on hover) */}
      {onAddAfter && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={onAddAfter}
            className="bg-primary-600 text-white rounded-full p-2 shadow-lg hover:bg-primary-700 transition-all hover:scale-110"
            title="Add block below"
            aria-label="Add block below"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// Utility component for touch-friendly control buttons
export function TouchButton({
  onClick,
  icon,
  label,
  variant = 'default',
  className = ''
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  variant?: 'default' | 'primary' | 'danger'
  className?: string
}) {
  const variantClasses = {
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all touch-action-none active:scale-95 ${variantClasses[variant]} ${className}`}
      title={label}
      aria-label={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
