'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import { BlockInstance } from './VisualEditor'

/**
 * Canvas Component - Phase 8
 * 
 * Droppable canvas area where blocks are arranged and previewed.
 * Supports drag-to-reorder and block selection.
 */

interface CanvasProps {
  blocks: BlockInstance[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onDeleteBlock: (blockId: string) => void
  onDuplicateBlock: (blockId: string) => void
  showPreview: boolean
}

function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  showPreview,
}: {
  block: BlockInstance
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  showPreview: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Block Controls (Edit Mode Only) */}
      {!showPreview && (
        <div
          className={`absolute -top-3 left-0 right-0 flex items-center justify-between px-3 py-1.5 bg-white rounded-t-lg border-2 transition-all ${
            isSelected ? 'border-amber-500 opacity-100' : 'border-gray-200 opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
              aria-label="Drag to reorder"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
              </svg>
            </button>
            <span className="text-xs font-semibold text-gray-700">{block.type}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Duplicate Button */}
            <button
              onClick={onDuplicate}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              aria-label="Duplicate block"
              title="Duplicate"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={onDelete}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
              aria-label="Delete block"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Block Preview */}
      <div
        onClick={!showPreview ? onSelect : undefined}
        className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
          showPreview
            ? 'border-transparent'
            : isSelected
            ? 'border-amber-500 shadow-lg'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <BlockPreview block={block} />
      </div>
    </div>
  )
}

function BlockPreview({ block }: { block: BlockInstance }) {
  // Render a simplified preview of the block
  // In production, this would render the actual block component
  const { type, props } = block

  return (
    <div className="p-6 min-h-[120px]">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{getBlockIcon(type)}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">{type}</h3>
          <div className="space-y-1">
            {Object.entries(props).slice(0, 3).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="font-medium text-gray-600">{key}:</span>{' '}
                <span className="text-gray-500">
                  {String(value).length > 40
                    ? String(value).substring(0, 40) + '...'
                    : String(value)}
                </span>
              </div>
            ))}
            {Object.keys(props).length > 3 && (
              <div className="text-xs text-gray-400">
                +{Object.keys(props).length - 3} more props
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDeleteBlock,
  onDuplicateBlock,
  showPreview,
}: CanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  })

  return (
    <div
      ref={setNodeRef}
      className="max-w-5xl mx-auto w-full min-h-full"
    >
      <div className="space-y-6">
        {blocks.map(block => (
          <SortableBlockItem
            key={block.id}
            block={block}
            isSelected={selectedBlockId === block.id}
            onSelect={() => onSelectBlock(block.id)}
            onDelete={() => onDeleteBlock(block.id)}
            onDuplicate={() => onDuplicateBlock(block.id)}
            showPreview={showPreview}
          />
        ))}

        {/* Drop Zone Indicator */}
        {blocks.length > 0 && !showPreview && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 hover:border-amber-400 hover:text-amber-600 transition-colors">
            Drop blocks here to add them to the bottom
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get icon for block type
function getBlockIcon(blockType: string): string {
  const icons: Record<string, string> = {
    HeroBlock: '🎯',
    TextBlock: '📝',
    ImageBlock: '🖼️',
    ServicesGridBlock: '🎁',
    TestimonialsBlock: '💬',
    GalleryHighlightsBlock: '🎨',
    CTABannerBlock: '📣',
    FAQBlock: '❓',
    ContactFormBlock: '✉️',
    VideoHeroBlock: '🎬',
    BeforeAfterSliderBlock: '↔️',
    TimelineBlock: '📅',
    MasonryGalleryBlock: '🧱',
    AnimatedCounterStatsBlock: '🔢',
    InteractiveMapBlock: '🗺️',
    FilterableGalleryBlock: '🔍',
    TabbedContentBlock: '📑',
    EnhancedAccordionBlock: '📋',
    StatsBlock: '📊',
    ButtonBlock: '🔘',
    ColumnsBlock: '⬜',
    SpacerBlock: '⬛',
    BadgesBlock: '🏆',
    SlideshowHeroBlock: '🎞️',
    WidgetEmbedBlock: '🔌',
    IconFeaturesBlock: '⭐',
    PricingTableBlock: '💰',
    PricingCalculatorBlock: '🧮',
    NewsletterBlock: '📮',
    LeadSignupBlock: '📧',
    SeoFooterBlock: '🔗',
    LogoBlock: '🎭',
  }

  return icons[blockType] || '📦'
}
