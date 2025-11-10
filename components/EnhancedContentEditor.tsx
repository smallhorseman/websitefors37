'use client'

import React, { useState } from 'react'
import MobilePreviewToggle from '@/components/MobilePreviewToggle'
import BlockControls from '@/components/BlockControls'
import { Save, Eye, Code, Layout, Loader2 } from 'lucide-react'

interface Block {
  id: string
  type: string
  props: Record<string, any>
}

interface EnhancedContentEditorProps {
  initialContent?: string
  onSave?: (content: string) => Promise<void>
  pageSlug?: string
}

export default function EnhancedContentEditor({
  initialContent = '',
  onSave,
  pageSlug = 'preview'
}: EnhancedContentEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [mode, setMode] = useState<'visual' | 'code'>('visual')
  const [rawContent, setRawContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Parse MDX content into blocks (simplified - would need actual MDX parser)
  React.useEffect(() => {
    if (initialContent && mode === 'visual') {
      // TODO: Parse MDX into blocks array
      // For now, just store raw content
      setRawContent(initialContent)
    }
  }, [initialContent, mode])

  const handleSave = async () => {
    if (!onSave) return
    
    setSaving(true)
    setMessage(null)
    try {
      await onSave(rawContent)
      setMessage({ type: 'success', text: 'Content saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save content' })
    } finally {
      setSaving(false)
    }
  }

  const addBlock = (type: string, index?: number) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      props: {}
    }
    
    if (index !== undefined) {
      const newBlocks = [...blocks]
      newBlocks.splice(index, 0, newBlock)
      setBlocks(newBlocks)
    } else {
      setBlocks([...blocks, newBlock])
    }
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900" aria-level={2} role="heading">Content Editor</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
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
              className={`text-sm px-3 py-1 rounded ${
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
            className="btn-primary px-6 py-2 flex items-center gap-2 min-h-[44px]"
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
            <div className="p-6 space-y-6">
              {blocks.length === 0 && (
                <div className="text-center py-12">
                  <Layout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No blocks yet. Add your first block to get started.</p>
                  <button
                    onClick={() => addBlock('HeroBlock')}
                    className="btn-primary"
                  >
                    Add Hero Block
                  </button>
                </div>
              )}

              {blocks.map((block, index) => (
                <BlockControls
                  key={block.id}
                  blockType={block.type}
                  blockLabel={block.type.replace('Block', '')}
                  onMoveUp={() => moveBlock(index, 'up')}
                  onMoveDown={() => moveBlock(index, 'down')}
                  onDelete={() => deleteBlock(index)}
                  onAddBefore={() => addBlock('TextBlock', index)}
                  onAddAfter={() => addBlock('TextBlock', index + 1)}
                  isFirst={index === 0}
                  isLast={index === blocks.length - 1}
                  showSettings={true}
                >
                  {/* Block preview/render would go here */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[100px] flex items-center justify-center">
                    <div className="text-gray-500">
                      {block.type} Preview
                    </div>
                  </div>
                </BlockControls>
              ))}
            </div>
          </MobilePreviewToggle>
        )}

        {mode === 'code' && (
          <div className="h-full p-6">
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="w-full h-full font-mono text-sm border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter MDX content here..."
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
