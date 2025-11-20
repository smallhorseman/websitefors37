'use client'

import React, { useState } from 'react'

/**
 * Tabbed Content Component - Phase 7
 * 
 * Horizontal tabs with content switching.
 * Perfect for organizing related content without overwhelming users.
 */

interface Tab {
  id: string
  label: string
  icon?: string
  content: string // HTML string
}

interface TabbedContentClientProps {
  tabs: Tab[]
  defaultTab?: string
  accentColor?: string
  style?: 'default' | 'pills' | 'underline'
  alignment?: 'left' | 'center' | 'right'
}

export default function TabbedContentClient({
  tabs,
  defaultTab,
  accentColor = '#b46e14',
  style = 'default',
  alignment = 'left'
}: TabbedContentClientProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const activeTabContent = tabs.find(tab => tab.id === activeTab)

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  const getTabClasses = (isActive: boolean) => {
    const baseClasses = 'px-6 py-3 font-medium transition-all cursor-pointer'
    
    if (style === 'pills') {
      return `${baseClasses} rounded-full ${
        isActive
          ? 'text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`
    }
    
    if (style === 'underline') {
      return `${baseClasses} border-b-2 ${
        isActive
          ? 'border-current font-bold'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`
    }
    
    // default style
    return `${baseClasses} rounded-t-lg ${
      isActive
        ? 'text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`
  }

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div 
        className={`flex flex-wrap gap-2 mb-6 ${alignmentClasses[alignment]} ${
          style === 'underline' ? 'border-b border-gray-200' : ''
        }`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={getTabClasses(isActive)}
              style={
                isActive && (style === 'pills' || style === 'default')
                  ? { backgroundColor: accentColor }
                  : isActive && style === 'underline'
                  ? { color: accentColor, borderColor: accentColor }
                  : {}
              }
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTabContent && (
          <div
            className="prose prose-lg max-w-none animate-fadeIn"
            dangerouslySetInnerHTML={{ __html: activeTabContent.content }}
          />
        )}
      </div>
    </div>
  )
}
