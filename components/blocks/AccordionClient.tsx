'use client'

import React, { useState, useMemo } from 'react'

/**
 * Enhanced Accordion Component - Phase 7
 * 
 * FAQ accordion with multiple open support, icons, and search functionality.
 * Improves upon the basic FAQBlock with advanced features.
 */

interface AccordionItem {
  id?: string
  question: string
  answer: string
  icon?: string
  category?: string
}

interface AccordionClientProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  searchable?: boolean
  accentColor?: string
  style?: 'default' | 'bordered' | 'minimal'
  defaultOpen?: string[] // Array of item IDs to open by default
}

export default function AccordionClient({
  items,
  allowMultiple = false,
  searchable = false,
  accentColor = '#b46e14',
  style = 'default',
  defaultOpen = []
}: AccordionClientProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen))
  const [searchQuery, setSearchQuery] = useState('')

  // Add IDs to items if they don't have them
  const itemsWithIds = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`
    }))
  }, [items])

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return itemsWithIds
    }
    const query = searchQuery.toLowerCase()
    return itemsWithIds.filter(
      item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    )
  }, [itemsWithIds, searchQuery])

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      
      return newSet
    })
  }

  const getItemClasses = () => {
    if (style === 'bordered') {
      return 'border border-gray-200 rounded-lg overflow-hidden'
    }
    if (style === 'minimal') {
      return 'border-b border-gray-200 last:border-b-0'
    }
    return 'bg-white rounded-lg shadow-sm border border-gray-100'
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      {searchable && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
              style={{ 
                focusRing: accentColor,
                '--tw-ring-color': accentColor 
              } as any}
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>
      )}

      {/* Accordion Items */}
      <div className={`space-y-${style === 'minimal' ? '0' : '4'}`}>
        {filteredItems.map((item) => {
          const isOpen = openItems.has(item.id!)
          
          return (
            <div key={item.id} className={getItemClasses()}>
              <button
                onClick={() => toggleItem(item.id!)}
                className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {item.icon && (
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 pr-8">
                      {item.question}
                    </h3>
                    {item.category && (
                      <span 
                        className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: `${accentColor}20`, 
                          color: accentColor 
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  style={{ color: accentColor }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4">
                  <div 
                    className={`prose prose-sm max-w-none text-gray-700 ${
                      item.icon ? 'ml-11' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No questions found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
