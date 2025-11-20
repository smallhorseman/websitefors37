'use client'

import React, { useState } from 'react'

/**
 * AI Block Suggestions Component - Phase 5
 * 
 * Provides AI-powered block recommendations for page building.
 * Can be integrated into any admin page editor.
 */

interface BlockSuggestion {
  block: string
  props: Record<string, any>
  rationale: string
  category: 'hero' | 'content' | 'media' | 'social' | 'conversion'
}

interface AIBlockSuggestionsProps {
  pageType: string
  industry?: string
  currentBlocks?: string[]
  onInsertBlock?: (block: string, props: Record<string, any>) => void
  className?: string
}

export default function AIBlockSuggestions({
  pageType,
  industry = 'photography',
  currentBlocks = [],
  onInsertBlock,
  className = ''
}: AIBlockSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<BlockSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
    hero: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🎬' },
    content: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '📝' },
    media: { bg: 'bg-green-100', text: 'text-green-700', icon: '🖼️' },
    social: { bg: 'bg-pink-100', text: 'text-pink-700', icon: '💬' },
    conversion: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🎯' }
  }

  const fetchSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai/block-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType,
          industry,
          currentBlocks,
          maxSuggestions: 4
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setIsOpen(true)
    } catch (err: any) {
      console.error('AI suggestions error:', err)
      setError(err.message || 'Failed to generate suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsert = (suggestion: BlockSuggestion) => {
    if (onInsertBlock) {
      onInsertBlock(suggestion.block, suggestion.props)
    }
    // Close modal after inserting
    setIsOpen(false)
  }

  const copyToClipboard = (suggestion: BlockSuggestion) => {
    // Generate MDX code
    const propsStr = Object.entries(suggestion.props)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`
        } else if (typeof value === 'boolean') {
          return `${key}={${value}}`
        } else {
          return `${key}={${JSON.stringify(value)}}`
        }
      })
      .join('\n  ')
    
    const mdxCode = `<${suggestion.block}\n  ${propsStr}\n/>`
    
    navigator.clipboard.writeText(mdxCode)
    alert('Block code copied to clipboard!')
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={fetchSuggestions}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span className="text-xl">✨</span>
            <span>Get AI Suggestions</span>
          </>
        )}
      </button>

      {/* Error Display */}
      {error && !isOpen && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Suggestions Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">✨</span>
                    AI Block Suggestions
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Suggested for your <span className="font-semibold">{pageType}</span> page
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Suggestions Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              {suggestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No suggestions available</p>
                  <p className="text-sm mt-2">Try adjusting your page type or current blocks</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {suggestions.map((suggestion, index) => {
                    const categoryStyle = categoryColors[suggestion.category] || categoryColors.content
                    
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-white"
                      >
                        {/* Block Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${categoryStyle.bg} ${categoryStyle.text} flex items-center justify-center text-xl`}>
                              {categoryStyle.icon}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {suggestion.block.replace(/Block$/, '')}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text} font-medium`}>
                                {suggestion.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rationale */}
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {suggestion.rationale}
                        </p>

                        {/* Props Preview */}
                        <div className="mb-4 bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                            Suggested Props
                          </p>
                          <div className="text-sm space-y-1 font-mono text-gray-700">
                            {Object.entries(suggestion.props).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-purple-600">{key}:</span>
                                <span className="truncate">
                                  {typeof value === 'string' 
                                    ? `"${value.length > 40 ? value.substring(0, 40) + '...' : value}"` 
                                    : JSON.stringify(value)}
                                </span>
                              </div>
                            ))}
                            {Object.keys(suggestion.props).length > 3 && (
                              <div className="text-gray-500 text-xs">
                                + {Object.keys(suggestion.props).length - 3} more props
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {onInsertBlock && (
                            <button
                              onClick={() => handleInsert(suggestion)}
                              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                            >
                              Insert Block
                            </button>
                          )}
                          <button
                            onClick={() => copyToClipboard(suggestion)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Code
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Powered by Google Gemini AI • Suggestions are contextual and may need adjustments
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
