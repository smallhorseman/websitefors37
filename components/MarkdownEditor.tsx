'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  minHeight?: string
  placeholder?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  minHeight = '400px',
  placeholder = 'Write your content here using Markdown...'
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('edit')

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger 
              value="edit"
              className={`rounded-none border-r px-4 py-2 ${activeTab === 'edit' ? 'border-b-2 border-b-primary-500' : ''}`}
            >
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              className={`rounded-none px-4 py-2 ${activeTab === 'preview' ? 'border-b-2 border-b-primary-500' : ''}`}
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="mt-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 font-mono text-sm focus:outline-none resize-none"
            placeholder={placeholder}
            style={{ minHeight }}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div 
            className="prose max-w-none p-4 overflow-auto"
            style={{ minHeight }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">No content to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t p-3 bg-gray-50">
        <p className="text-xs text-gray-500">
          Supports Markdown: <code>#</code> for headers, <code>*</code> for italic, <code>**</code> for bold, 
          <code>`</code> for code, <code>```</code> for code blocks, <code>- </code> for lists, <code>1. </code> for numbered lists, 
          <code>[text](url)</code> for links, <code>![alt](imageUrl)</code> for images.
        </p>
      </div>
    </div>
  )
}
