'use client'

import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  minHeight?: string
  placeholder?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  minHeight = '300px',
  placeholder = 'Write your content using Markdown...'
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex bg-gray-50 border-b px-4 py-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1 rounded ${
              mode === 'edit'
                ? 'bg-white shadow-sm border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-pressed={mode === 'edit'}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 rounded ${
              mode === 'preview'
                ? 'bg-white shadow-sm border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-pressed={mode === 'preview'}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1 rounded ${
              mode === 'split'
                ? 'bg-white shadow-sm border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-pressed={mode === 'split'}
            title="Edit and preview side-by-side"
          >
            Split
          </button>
        </div>
      </div>
      
      <div className="relative" style={{ minHeight }}>
        {mode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="border-r">
              <textarea
                value={value}
                onChange={handleChange}
                className="w-full h-full p-4 focus:outline-none font-mono"
                style={{ minHeight, resize: 'vertical' }}
                placeholder={placeholder}
                aria-label="Markdown editor"
              />
            </div>
            <div className="prose prose-sm max-w-none p-4 overflow-y-auto" style={{ minHeight }} aria-live="polite">
              {value ? (
                <ReactMarkdown>{value}</ReactMarkdown>
              ) : (
                <p className="text-gray-400 italic">{placeholder}</p>
              )}
            </div>
          </div>
        ) : mode === 'preview' ? (
          <div className="prose prose-sm max-w-none p-4 overflow-y-auto" style={{ minHeight }} aria-live="polite">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">{placeholder}</p>
            )}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={handleChange}
            className="w-full h-full p-4 focus:outline-none font-mono"
            style={{ minHeight, resize: 'vertical' }}
            placeholder={placeholder}
            aria-label="Markdown editor"
          />
        )}
      </div>
    </div>
  )
}
