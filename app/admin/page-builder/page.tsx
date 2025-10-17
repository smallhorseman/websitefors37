'use client'

import { useState, useEffect } from 'react'
import VisualEditor from '@/components/VisualEditor'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PageBuilderPage() {
  const [components, setComponents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [slug] = useState('visual-page') // You can make this dynamic

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    try {
      const { data, error } = await supabase
        .from('page_configs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data?.data?.components) {
        setComponents(data.data.components)
      }
    } catch (e) {
      console.error('Failed to load page:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (newComponents: any[]) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('page_configs')
        .upsert({
          slug,
          data: { components: newComponents }
        })

      if (error) throw error

      alert('Page saved successfully!')
      setComponents(newComponents)
    } catch (e) {
      console.error('Failed to save:', e)
      alert('Failed to save page')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Admin
        </Link>
        <h1 className="text-xl font-bold">Visual Page Builder</h1>
        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative">
        <VisualEditor
          initialComponents={components}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
