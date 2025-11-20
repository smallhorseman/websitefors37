'use client'

import React, { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import BlockLibrary from './BlockLibrary'
import Canvas from './Canvas'
import PropertiesPanel from './PropertiesPanel'

/**
 * Visual Page Builder - Phase 8
 * 
 * Drag-and-drop WYSIWYG editor for building pages with blocks.
 * Features:
 * - Draggable block library with 28+ blocks
 * - Sortable canvas with live preview
 * - Properties panel for editing block props
 * - Real-time MDX generation
 * - Save/publish functionality
 */

export interface BlockInstance {
  id: string
  type: string
  props: Record<string, any>
}

interface VisualEditorProps {
  pageSlug: string
  initialBlocks?: BlockInstance[]
  onSave?: (blocks: BlockInstance[], mdx: string) => Promise<void>
}

export default function VisualEditor({
  pageSlug,
  initialBlocks = [],
  onSave,
}: VisualEditorProps) {
  const [blocks, setBlocks] = useState<BlockInstance[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    // If dragging from library (adding new block)
    if (active.id.toString().startsWith('library-')) {
      const blockType = active.id.toString().replace('library-', '')
      const newBlock: BlockInstance = {
        id: `block-${Date.now()}`,
        type: blockType,
        props: getDefaultPropsForBlock(blockType),
      }

      // Insert at the position where it was dropped
      const overIndex = blocks.findIndex(b => b.id === over.id)
      if (overIndex !== -1) {
        const newBlocks = [...blocks]
        newBlocks.splice(overIndex + 1, 0, newBlock)
        setBlocks(newBlocks)
      } else {
        setBlocks([...blocks, newBlock])
      }

      setSelectedBlockId(newBlock.id)
      return
    }

    // If reordering existing blocks
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        setBlocks(arrayMove(blocks, oldIndex, newIndex))
      }
    }
  }, [blocks])

  // Update selected block props
  const handleUpdateBlock = useCallback((blockId: string, newProps: Record<string, any>) => {
    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b
    ))
  }, [blocks])

  // Delete block
  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId))
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null)
    }
  }, [blocks, selectedBlockId])

  // Duplicate block
  const handleDuplicateBlock = useCallback((blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId)
    if (blockIndex === -1) return

    const blockToDuplicate = blocks[blockIndex]
    const newBlock: BlockInstance = {
      id: `block-${Date.now()}`,
      type: blockToDuplicate.type,
      props: { ...blockToDuplicate.props },
    }

    const newBlocks = [...blocks]
    newBlocks.splice(blockIndex + 1, 0, newBlock)
    setBlocks(newBlocks)
    setSelectedBlockId(newBlock.id)
  }, [blocks])

  // Generate MDX from blocks
  const generateMDX = useCallback(() => {
    return blocks
      .map(block => {
        const props = Object.entries(block.props)
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => {
            if (typeof value === 'string' && value.includes('\n')) {
              return `  ${key}={\`${value}\`}`
            }
            if (typeof value === 'boolean') {
              return `  ${key}={${value}}`
            }
            if (typeof value === 'number') {
              return `  ${key}={${value}}`
            }
            return `  ${key}="${value}"`
          })
          .join('\n')

        return `<${block.type}${props ? '\n' + props : ''}\n/>`
      })
      .join('\n\n')
  }, [blocks])

  // Save page
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const mdx = generateMDX()
      await onSave?.(blocks, mdx)
      alert('Page saved successfully!')
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Visual Editor</h1>
          <span className="text-sm text-gray-500">/{pageSlug}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {showPreview ? '✏️ Edit' : '👁️ Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : '💾 Save'}
          </button>
          <button
            onClick={() => {
              const mdx = generateMDX()
              navigator.clipboard.writeText(mdx)
              alert('MDX copied to clipboard!')
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            📋 Copy MDX
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Block Library Sidebar */}
          <BlockLibrary />

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <SortableContext
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <Canvas
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onDeleteBlock={handleDeleteBlock}
                onDuplicateBlock={handleDuplicateBlock}
                showPreview={showPreview}
              />
            </SortableContext>
          </div>

          {/* Properties Panel */}
          {selectedBlock && !showPreview && (
            <PropertiesPanel
              block={selectedBlock}
              onUpdate={(newProps) => handleUpdateBlock(selectedBlock.id, newProps)}
              onClose={() => setSelectedBlockId(null)}
            />
          )}

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-amber-500">
                <div className="text-sm font-medium text-gray-900">
                  {activeId.toString().replace('library-', '').replace('block-', '')}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Empty State */}
      {blocks.length === 0 && !showPreview && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Building</h2>
            <p className="text-gray-600">
              Drag blocks from the left sidebar to begin creating your page
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get default props for a block type
function getDefaultPropsForBlock(blockType: string): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    HeroBlock: {
      title: 'Welcome to Our Studio',
      subtitle: 'Capturing life\'s precious moments',
      buttonText: 'Book Now',
      buttonLink: '/contact',
      variant: 'default',
    },
    TextBlock: {
      content: '<p>Add your content here...</p>',
      alignment: 'left',
    },
    ImageBlock: {
      src: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
      alt: 'Beautiful image',
      caption: 'Image caption',
    },
    ServicesGridBlock: {
      heading: 'Our Services',
      subheading: 'Professional photography services',
    },
    TestimonialsBlock: {
      heading: 'What Our Clients Say',
    },
    GalleryHighlightsBlock: {
      heading: 'Featured Work',
    },
    CTABannerBlock: {
      title: 'Ready to Book?',
      subtitle: 'Let\'s create something beautiful together',
      buttonText: 'Get Started',
      buttonLink: '/contact',
    },
    FAQBlock: {
      heading: 'Frequently Asked Questions',
    },
  }

  return defaults[blockType] || {}
}
