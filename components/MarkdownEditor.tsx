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
  const [isPreview, setIsPreview] = useState(false)

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
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded ${
              !isPreview
                ? 'bg-white shadow-sm border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded ${
              isPreview
                ? 'bg-white shadow-sm border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
      
      <div className="relative" style={{ minHeight }}>
        {isPreview ? (
          <div className="prose prose-sm max-w-none p-4 overflow-y-auto" style={{ minHeight }}>
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
          />
        )}
      </div>
    </div>
  )
}
  )
}
