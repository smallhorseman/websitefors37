'use client'

import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'

/**
 * Block Library Sidebar - Phase 8
 * 
 * Draggable sidebar with all available blocks organized by category.
 * Users can drag blocks from here onto the canvas.
 */

interface BlockDefinition {
  type: string
  label: string
  icon: string
  description: string
  category: 'content' | 'media' | 'social' | 'conversion' | 'layout' | 'enhanced' | 'interactive'
}

const AVAILABLE_BLOCKS: BlockDefinition[] = [
  // Content Blocks
  { type: 'HeroBlock', label: 'Hero', icon: '🎯', description: 'Large header section with CTA', category: 'content' },
  { type: 'TextBlock', label: 'Text', icon: '📝', description: 'Rich text content', category: 'content' },
  { type: 'HeadingBlock', label: 'Heading', icon: '📰', description: 'Section heading', category: 'content' },
  
  // Media Blocks
  { type: 'ImageBlock', label: 'Image', icon: '🖼️', description: 'Single image with caption', category: 'media' },
  { type: 'GalleryHighlightsBlock', label: 'Gallery', icon: '🎨', description: 'Image gallery grid', category: 'media' },
  { type: 'MasonryGalleryBlock', label: 'Masonry Gallery', icon: '🧱', description: 'Pinterest-style gallery', category: 'media' },
  { type: 'FilterableGalleryBlock', label: 'Filterable Gallery', icon: '🔍', description: 'Gallery with category filters', category: 'interactive' },
  { type: 'SlideshowHeroBlock', label: 'Slideshow', icon: '🎞️', description: 'Rotating hero images', category: 'media' },
  { type: 'VideoHeroBlock', label: 'Video Hero', icon: '🎬', description: 'Hero with background video', category: 'media' },
  { type: 'BeforeAfterSliderBlock', label: 'Before/After', icon: '↔️', description: 'Image comparison slider', category: 'media' },
  
  // Layout Blocks
  { type: 'ColumnsBlock', label: 'Columns', icon: '⬜', description: '2-4 column layout', category: 'layout' },
  { type: 'SpacerBlock', label: 'Spacer', icon: '⬛', description: 'Vertical spacing', category: 'layout' },
  { type: 'ButtonBlock', label: 'Button', icon: '🔘', description: 'Call-to-action button', category: 'layout' },
  
  // Social Proof
  { type: 'TestimonialsBlock', label: 'Testimonials', icon: '💬', description: 'Client testimonials', category: 'social' },
  { type: 'StatsBlock', label: 'Stats', icon: '📊', description: 'Achievement statistics', category: 'social' },
  { type: 'AnimatedCounterStatsBlock', label: 'Counter Stats', icon: '🔢', description: 'Animated counters', category: 'social' },
  { type: 'BadgesBlock', label: 'Badges', icon: '🏆', description: 'Trust badges & awards', category: 'social' },
  
  // Conversion
  { type: 'CTABannerBlock', label: 'CTA Banner', icon: '📣', description: 'Call-to-action banner', category: 'conversion' },
  { type: 'ContactFormBlock', label: 'Contact Form', icon: '✉️', description: 'Lead capture form', category: 'conversion' },
  { type: 'LeadSignupBlock', label: 'Lead Signup', icon: '📧', description: 'Email capture popup', category: 'conversion' },
  { type: 'NewsletterBlock', label: 'Newsletter', icon: '📮', description: 'Newsletter signup', category: 'conversion' },
  { type: 'PricingTableBlock', label: 'Pricing Table', icon: '💰', description: 'Service pricing', category: 'conversion' },
  { type: 'PricingCalculatorBlock', label: 'Pricing Calculator', icon: '🧮', description: 'Interactive pricing', category: 'conversion' },
  
  // Enhanced Blocks
  { type: 'ServicesGridBlock', label: 'Services Grid', icon: '🎁', description: 'Service offerings', category: 'enhanced' },
  { type: 'IconFeaturesBlock', label: 'Icon Features', icon: '⭐', description: 'Features with icons', category: 'enhanced' },
  { type: 'TimelineBlock', label: 'Timeline', icon: '📅', description: 'Process timeline', category: 'enhanced' },
  { type: 'InteractiveMapBlock', label: 'Map', icon: '🗺️', description: 'Google Maps embed', category: 'enhanced' },
  { type: 'WidgetEmbedBlock', label: 'Widget', icon: '🔌', description: 'Third-party widgets', category: 'enhanced' },
  
  // Interactive Elements
  { type: 'FAQBlock', label: 'FAQ', icon: '❓', description: 'Frequently asked questions', category: 'interactive' },
  { type: 'EnhancedAccordionBlock', label: 'Accordion', icon: '📋', description: 'Searchable accordion', category: 'interactive' },
  { type: 'TabbedContentBlock', label: 'Tabs', icon: '📑', description: 'Tabbed content sections', category: 'interactive' },
  
  // SEO
  { type: 'SeoFooterBlock', label: 'SEO Footer', icon: '🔗', description: 'SEO-rich footer links', category: 'layout' },
  { type: 'LogoBlock', label: 'Logo', icon: '🎭', description: 'Brand logo', category: 'layout' },
]

const CATEGORY_LABELS: Record<string, string> = {
  content: 'Content',
  media: 'Media',
  layout: 'Layout',
  social: 'Social Proof',
  conversion: 'Conversion',
  enhanced: 'Enhanced',
  interactive: 'Interactive',
}

function DraggableBlock({ block }: { block: BlockDefinition }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${block.type}`,
    data: { blockType: block.type },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-amber-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{block.icon}</span>
        <span className="text-sm font-semibold text-gray-900">{block.label}</span>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">{block.description}</p>
    </div>
  )
}

export default function BlockLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter blocks by category and search
  const filteredBlocks = AVAILABLE_BLOCKS.filter(block => {
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group blocks by category
  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = []
    }
    acc[block.category].push(block)
    return acc
  }, {} as Record<string, BlockDefinition[]>)

  const categories = Object.keys(CATEGORY_LABELS)

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">📦 Blocks</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocks..."
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-1 text-xs font-medium rounded ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-xs font-medium rounded ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {selectedCategory === 'all' ? (
          // Show grouped by category
          Object.entries(groupedBlocks).map(([category, blocks]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="space-y-2">
                {blocks.map(block => (
                  <DraggableBlock key={block.type} block={block} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Show flat list for selected category
          <div className="space-y-2">
            {filteredBlocks.map(block => (
              <DraggableBlock key={block.type} block={block} />
            ))}
          </div>
        )}

        {filteredBlocks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No blocks found</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Drag blocks onto the canvas to add them to your page
        </p>
      </div>
    </div>
  )
}
