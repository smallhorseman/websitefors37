'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MobilePreviewToggle from '@/components/MobilePreviewToggle'
import BlockControls from '@/components/BlockControls'
import { Save, ArrowLeft, Loader2, Plus, Code, Layout } from 'lucide-react'

interface Block {
  id: string
  type: string
  label: string
  props: Record<string, any>
}

const AVAILABLE_BLOCKS = [
  { type: 'HeroBlock', label: 'Hero', icon: '🎯' },
  { type: 'TextBlock', label: 'Text', icon: '📝' },
  { type: 'ImageBlock', label: 'Image', icon: '🖼️' },
  { type: 'ButtonBlock', label: 'Button', icon: '🔘' },
  { type: 'ColumnsBlock', label: 'Columns', icon: '📊' },
  { type: 'GalleryHighlightsBlock', label: 'Gallery', icon: '🖼️' },
  { type: 'TestimonialsBlock', label: 'Testimonials', icon: '💬' },
  { type: 'ServicesGridBlock', label: 'Services', icon: '⚡' },
  { type: 'StatsBlock', label: 'Stats', icon: '📈' },
  { type: 'CTABannerBlock', label: 'CTA Banner', icon: '🎯' },
  { type: 'ContactFormBlock', label: 'Contact Form', icon: '✉️' },
  { type: 'FAQBlock', label: 'FAQ', icon: '❓' },
  { type: 'PricingTableBlock', label: 'Pricing', icon: '💰' },
  { type: 'SpacerBlock', label: 'Spacer', icon: '⬜' }
]

export default function BlockEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageId = searchParams?.get('id')
  
  const [blocks, setBlocks] = useState<Block[]>([])
  const [mode, setMode] = useState<'visual' | 'code'>('visual')
  const [rawContent, setRawContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showBlockPicker, setShowBlockPicker] = useState(false)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  
  // Page metadata
  const [pageTitle, setPageTitle] = useState('')
  const [pageSlug, setPageSlug] = useState('')

  // Load page content if editing existing page
  useEffect(() => {
    if (pageId) {
      loadPage(pageId)
    }
  }, [pageId])

  const loadPage = async (id: string) => {
    setLoading(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setPageTitle(data.title)
      setPageSlug(data.slug)
      setRawContent(data.content || '')
      
      // TODO: Parse MDX content into blocks
      // For now just store raw content
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load page' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Generate MDX from blocks or use raw content
      const content = mode === 'code' ? rawContent : generateMDXFromBlocks(blocks)
      
      const pageData = {
        title: pageTitle,
        slug: pageSlug,
        content,
        updated_at: new Date().toISOString()
      }

      let error
      if (pageId) {
        // Update existing page
        const result = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', pageId)
        error = result.error
      } else {
        // Create new page
        const result = await supabase
          .from('content_pages')
          .insert([{ ...pageData, published: false }])
        error = result.error
      }

      if (error) throw error

      setMessage({ type: 'success', text: 'Page saved successfully!' })
      
      // Revalidate the page
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: `/${pageSlug}` })
        })
      } catch (e) {
        console.warn('Failed to revalidate:', e)
      }

      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save page' })
    } finally {
      setSaving(false)
    }
  }

  const generateMDXFromBlocks = (blocks: Block[]): string => {
    // TODO: Convert blocks array to MDX string
    // For now return placeholder
    return rawContent || blocks.map(b => `<${b.type} />`).join('\n\n')
  }

  const addBlock = (blockType: string, index?: number) => {
    const blockConfig = AVAILABLE_BLOCKS.find(b => b.type === blockType)
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      label: blockConfig?.label || blockType,
      props: {}
    }
    
    if (index !== undefined) {
      const newBlocks = [...blocks]
      newBlocks.splice(index, 0, newBlock)
      setBlocks(newBlocks)
    } else {
      setBlocks([...blocks, newBlock])
    }
    setShowBlockPicker(false)
    setInsertIndex(null)
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return
    
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(targetIndex, 0, removed)
    setBlocks(newBlocks)
  }

  const deleteBlock = (index: number) => {
    if (confirm('Delete this block?')) {
      const newBlocks = blocks.filter((_, i) => i !== index)
      setBlocks(newBlocks)
    }
  }

  const openBlockPicker = (index?: number) => {
    setInsertIndex(index ?? blocks.length)
    setShowBlockPicker(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/content')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Back to content list"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col">
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Page Title"
              className="text-xl font-semibold border-none focus:ring-0 focus:outline-none p-0"
            />
            <input
              type="text"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              placeholder="page-slug"
              className="text-sm text-gray-500 border-none focus:ring-0 focus:outline-none p-0"
            />
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 ml-4">
            <button
              onClick={() => setMode('visual')}
              className={`px-4 py-2 rounded transition-all flex items-center gap-2 ${
                mode === 'visual'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Visual editor"
            >
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Visual</span>
            </button>
            <button
              onClick={() => setMode('code')}
              className={`px-4 py-2 rounded transition-all flex items-center gap-2 ${
                mode === 'code'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Code editor"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Code</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {message && (
            <div
              className={`text-sm px-3 py-2 rounded ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-2.5 flex items-center gap-2 min-h-[44px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'visual' && (
          <MobilePreviewToggle>
            <div className="min-h-screen">
              {blocks.length === 0 && (
                <div className="text-center py-16 px-6">
                  <Layout className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start Building Your Page</h2>
                  <p className="text-gray-600 mb-6">Add blocks to create your content. Drag to reorder.</p>
                  <button
                    onClick={() => openBlockPicker()}
                    className="btn-primary px-6 py-3 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Block
                  </button>
                </div>
              )}

              <div className="space-y-8 p-6">
                {blocks.map((block, index) => (
                  <BlockControls
                    key={block.id}
                    blockType={block.type}
                    blockLabel={block.label}
                    onMoveUp={() => moveBlock(index, 'up')}
                    onMoveDown={() => moveBlock(index, 'down')}
                    onDelete={() => deleteBlock(index)}
                    onAddBefore={() => openBlockPicker(index)}
                    onAddAfter={() => openBlockPicker(index + 1)}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    showSettings={true}
                  >
                    {/* Block preview */}
                    <div className="bg-white rounded-lg border-2 border-gray-200 min-h-[120px] flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{AVAILABLE_BLOCKS.find(b => b.type === block.type)?.icon || '📄'}</div>
                        <div className="text-lg font-medium text-gray-900">{block.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{block.type}</div>
                      </div>
                    </div>
                  </BlockControls>
                ))}
              </div>

              {blocks.length > 0 && (
                <div className="text-center py-8">
                  <button
                    onClick={() => openBlockPicker()}
                    className="btn-secondary px-6 py-3 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    Add Block
                  </button>
                </div>
              )}
            </div>
          </MobilePreviewToggle>
        )}

        {mode === 'code' && (
          <div className="h-full p-6 bg-white">
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="w-full h-full font-mono text-sm border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Enter MDX content here..."
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBlockPicker(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold">Choose a Block</h2>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {AVAILABLE_BLOCKS.map((block) => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type, insertIndex ?? undefined)}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <div className="text-4xl">{block.icon}</div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">{block.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
