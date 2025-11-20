'use client'

import React, { useState } from 'react'
import { BlockInstance } from './VisualEditor'

/**
 * Properties Panel - Phase 8
 * 
 * Dynamic form for editing selected block properties in real-time.
 * Provides intuitive controls for different prop types.
 */

interface PropertiesPanelProps {
  block: BlockInstance
  onUpdate: (newProps: Record<string, any>) => void
  onClose: () => void
}

export default function PropertiesPanel({
  block,
  onUpdate,
  onClose,
}: PropertiesPanelProps) {
  const [localProps, setLocalProps] = useState(block.props)

  const handleChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value }
    setLocalProps(newProps)
    onUpdate(newProps)
  }

  const handleAddProp = (key: string, value: any) => {
    handleChange(key, value)
  }

  // Get prop definitions for the block type
  const propDefinitions = getPropsForBlockType(block.type)

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">⚙️ Properties</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          aria-label="Close properties"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Block Type Badge */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getBlockIcon(block.type)}</span>
          <div>
            <div className="text-sm font-bold text-gray-900">{block.type}</div>
            <div className="text-xs text-gray-500">Block ID: {block.id.slice(-8)}</div>
          </div>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {propDefinitions.map(prop => (
          <PropertyField
            key={prop.key}
            prop={prop}
            value={localProps[prop.key]}
            onChange={(value) => handleChange(prop.key, value)}
          />
        ))}

        {/* Add Custom Property */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              const key = prompt('Property name:')
              if (key) {
                const value = prompt('Property value:')
                if (value !== null) {
                  handleAddProp(key, value)
                }
              }
            }}
            className="w-full px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100"
          >
            + Add Custom Property
          </button>
        </div>

        {/* Current Props JSON */}
        <details className="pt-4 border-t border-gray-200">
          <summary className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900">
            View Raw JSON
          </summary>
          <pre className="mt-2 p-2 text-xs bg-gray-900 text-green-400 rounded overflow-x-auto">
            {JSON.stringify(localProps, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}

interface PropDefinition {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'url'
  description?: string
  options?: { value: string; label: string }[]
  placeholder?: string
}

function PropertyField({
  prop,
  value,
  onChange,
}: {
  prop: PropDefinition
  value: any
  onChange: (value: any) => void
}) {
  switch (prop.type) {
    case 'boolean':
      return (
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-gray-700">{prop.label}</span>
          </label>
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )

    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.label}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="">Select...</option>
            {prop.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )

    case 'number':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.label}
          </label>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={prop.placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )

    case 'textarea':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.label}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={prop.placeholder}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
          />
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )

    case 'color':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.label}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )

    case 'url':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.label}
          </label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={prop.placeholder || 'https://...'}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )

    default: // text
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {prop.label}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={prop.placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          {prop.description && (
            <p className="mt-1 text-xs text-gray-500">{prop.description}</p>
          )}
        </div>
      )
  }
}

// Get property definitions for each block type
function getPropsForBlockType(blockType: string): PropDefinition[] {
  const commonProps: PropDefinition[] = [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
  ]

  const blockProps: Record<string, PropDefinition[]> = {
    HeroBlock: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Main headline' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Supporting text' },
      { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Get Started' },
      { key: 'buttonLink', label: 'Button Link', type: 'url', placeholder: '/contact' },
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'minimal', label: 'Minimal' },
          { value: 'overlay', label: 'Overlay' },
          { value: 'split', label: 'Split' },
        ],
      },
      { key: 'backgroundImage', label: 'Background Image', type: 'url' },
    ],
    TextBlock: [
      { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Add HTML content...' },
      {
        key: 'alignment',
        label: 'Alignment',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
    ],
    ImageBlock: [
      { key: 'src', label: 'Image URL', type: 'url', placeholder: 'https://...' },
      { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description' },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'width', label: 'Width', type: 'number' },
      { key: 'height', label: 'Height', type: 'number' },
    ],
    CTABannerBlock: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonLink', label: 'Button Link', type: 'url' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    ],
    ButtonBlock: [
      { key: 'text', label: 'Text', type: 'text', placeholder: 'Click Me' },
      { key: 'link', label: 'Link', type: 'url', placeholder: '/page' },
      {
        key: 'variant',
        label: 'Variant',
        type: 'select',
        options: [
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
        ],
      },
    ],
  }

  return blockProps[blockType] || commonProps
}

function getBlockIcon(blockType: string): string {
  const icons: Record<string, string> = {
    HeroBlock: '🎯',
    TextBlock: '📝',
    ImageBlock: '🖼️',
    CTABannerBlock: '📣',
    ButtonBlock: '🔘',
  }
  return icons[blockType] || '📦'
}
