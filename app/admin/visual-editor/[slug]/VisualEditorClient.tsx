'use client'

import React from 'react'
import VisualEditor, { BlockInstance } from '@/components/builder/VisualEditor'

interface VisualEditorClientProps {
  pageSlug: string
  initialBlocks: BlockInstance[]
}

export default function VisualEditorClient({
  pageSlug,
  initialBlocks,
}: VisualEditorClientProps) {
  const handleSave = async (blocks: BlockInstance[], mdx: string) => {
    // Save to database via API
    const response = await fetch(`/api/pages/${pageSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks, mdx }),
    })

    if (!response.ok) {
      throw new Error('Failed to save page')
    }

    return response.json()
  }

  return (
    <VisualEditor
      pageSlug={pageSlug}
      initialBlocks={initialBlocks}
      onSave={handleSave}
    />
  )
}
