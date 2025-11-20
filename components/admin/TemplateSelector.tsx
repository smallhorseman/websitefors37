'use client'

import React, { useState } from 'react'
import { 
  getAllTemplates, 
  getTemplatesByCategory, 
  getTemplateById,
  generateMDXFromTemplate,
  type PageTemplate 
} from '@/lib/blockTemplates'

/**
 * Template Selector Component - Phase 6
 * 
 * Provides visual interface for browsing and inserting pre-configured block templates.
 * Supports both full page templates and individual section templates.
 */

interface TemplateSelectorProps {
  onSelectTemplate?: (template: PageTemplate, mdx: string) => void
  onInsertMDX?: (mdx: string) => void
  className?: string
  filterCategory?: 'page' | 'section' | 'all'
}

export default function TemplateSelector({
  onSelectTemplate,
  onInsertMDX,
  className = '',
  filterCategory = 'all'
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'page' | 'section' | 'all'>(filterCategory)
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null)

  const templates = selectedCategory === 'all' 
    ? getAllTemplates() 
    : getTemplatesByCategory(selectedCategory)

  const handleUseTemplate = (template: PageTemplate) => {
    const mdx = generateMDXFromTemplate(template)
    
    if (onSelectTemplate) {
      onSelectTemplate(template, mdx)
    }
    
    if (onInsertMDX) {
      onInsertMDX(mdx)
    }
    
    setIsOpen(false)
    setPreviewTemplate(null)
  }

  const copyToClipboard = (template: PageTemplate) => {
    const mdx = generateMDXFromTemplate(template)
    navigator.clipboard.writeText(mdx)
    alert('Template code copied to clipboard!')
  }

  const getCategoryColor = (category: 'page' | 'section') => {
    return category === 'page' 
      ? { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
      : { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition ${className}`}
      >
        <span className="text-xl">📋</span>
        <span>Use Template</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">📋</span>
                    Page & Section Templates
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose from pre-built templates to jumpstart your page
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

              {/* Category Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Templates
                </button>
                <button
                  onClick={() => setSelectedCategory('page')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === 'page'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📄 Full Pages
                </button>
                <button
                  onClick={() => setSelectedCategory('section')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === 'section'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📦 Sections
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const colorScheme = getCategoryColor(template.category)
                  
                  return (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition bg-white group"
                    >
                      {/* Preview */}
                      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                        {template.preview}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {template.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${colorScheme.bg} ${colorScheme.text} font-medium whitespace-nowrap ml-2`}>
                            {template.category}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Block Count */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          <span>{template.blocks.length} blocks</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUseTemplate(template)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                          >
                            Use Template
                          </button>
                          <button
                            onClick={() => setPreviewTemplate(template)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {templates.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No templates found</p>
                  <p className="text-sm mt-2">Try selecting a different category</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Templates are customizable after insertion • Edit props to match your content
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Preview Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">{previewTemplate.preview}</span>
                    {previewTemplate.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {previewTemplate.description}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Block List */}
            <div className="p-6 overflow-y-auto flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Included Blocks ({previewTemplate.blocks.length})
              </h4>
              <div className="space-y-3">
                {previewTemplate.blocks.map((block, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h5 className="font-bold text-gray-900">
                        {block.block.replace(/Block$/, '')}
                      </h5>
                    </div>
                    <div className="ml-11 text-sm text-gray-600 space-y-1">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(block.props).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-blue-600 font-medium">{key}:</span>
                            <span className="truncate">
                              {typeof value === 'string' && value.length > 30
                                ? value.substring(0, 30) + '...'
                                : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {Object.keys(block.props).length > 4 && (
                        <div className="text-gray-500 text-xs mt-2">
                          + {Object.keys(block.props).length - 4} more props
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Footer */}
            <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
              <button
                onClick={() => handleUseTemplate(previewTemplate)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Use This Template
              </button>
              <button
                onClick={() => copyToClipboard(previewTemplate)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
