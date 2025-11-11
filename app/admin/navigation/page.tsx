'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Menu, 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  ExternalLink,
  Star,
  AlertCircle
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  visible: boolean
  highlighted?: boolean
  icon?: string
}

export default function NavigationEditor() {
  const [items, setItems] = useState<NavigationItem[]>([])
  const [originalItems, setOriginalItems] = useState<NavigationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    loadNavigation()
  }, [])

  const loadNavigation = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('navigation_items')
        .single()

      if (error) throw error

      const navItems = (data?.navigation_items || []) as NavigationItem[]
      const sorted = navItems.sort((a, b) => a.order - b.order)
      setItems(sorted)
      setOriginalItems(JSON.parse(JSON.stringify(sorted)))
    } catch (e: any) {
      console.error('Load error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to load navigation' })
      
      // Fallback to default nav
      const defaultNav: NavigationItem[] = [
        { id: 'home', label: 'Home', href: '/', order: 1, visible: true },
        { id: 'gallery', label: 'Gallery', href: '/gallery', order: 2, visible: true },
        { id: 'services', label: 'Services', href: '/services', order: 3, visible: true },
        { id: 'blog', label: 'Blog', href: '/blog', order: 4, visible: true },
        { id: 'about', label: 'About', href: '/about', order: 5, visible: true },
        { id: 'contact', label: 'Contact', href: '/contact', order: 6, visible: true },
        { id: 'book', label: 'Book a Session', href: '/book-a-session', order: 7, visible: true, highlighted: true },
      ]
      setItems(defaultNav)
      setOriginalItems(JSON.parse(JSON.stringify(defaultNav)))
    } finally {
      setLoading(false)
    }
  }

  const saveNavigation = async () => {
    setSaving(true)
    setMessage(null)
    try {
      // Re-order items based on current array order
      const reorderedItems = items.map((item, index) => ({
        ...item,
        order: index + 1
      }))

      // Settings is a singleton table - just update the first/only row
      // First, try to get the existing row
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (existing) {
        // Update using the actual ID we got back
        const { error } = await supabase
          .from('settings')
          .update({ navigation_items: reorderedItems })
          .match({ id: existing.id })
        
        if (error) throw error
      } else {
        // No settings row exists, insert one
        const { error } = await supabase
          .from('settings')
          .insert([{ navigation_items: reorderedItems }])
        
        if (error) throw error
      }

      setItems(reorderedItems)
      setOriginalItems(JSON.parse(JSON.stringify(reorderedItems)))
      setMessage({ type: 'success', text: '✅ Navigation saved successfully!' })
    } catch (e: any) {
      console.error('Save error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to save navigation' })
    } finally {
      setSaving(false)
    }
  }

  const addItem = () => {
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '/',
      order: items.length + 1,
      visible: true
    }
    setItems([...items, newItem])
    setEditingId(newItem.id)
  }

  const deleteItem = (id: string) => {
    if (confirm('Delete this menu item?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const toggleVisibility = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    ))
  }

  const toggleHighlight = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, highlighted: !item.highlighted } : item
    ))
  }

  const updateItem = (id: string, field: keyof NavigationItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...items]
    const draggedItem = newItems[draggedIndex]
    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    
    setItems(newItems)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const hasChanges = JSON.stringify(items) !== JSON.stringify(originalItems)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Menu className="h-6 w-6 text-amber-600" />
              Navigation Editor
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your site navigation menu
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadNavigation}
              disabled={loading}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Reload
            </button>

            <button
              onClick={saveNavigation}
              disabled={!hasChanges || saving}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-4xl mx-auto px-6 mt-4">
          <div
            className={`rounded-lg border px-4 py-3 text-sm flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {message.text}
          </div>
        </div>
      )}

      {/* Warning for unsaved changes */}
      {hasChanges && (
        <div className="max-w-4xl mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <strong>Unsaved changes:</strong> Click "Save Changes" to update your navigation menu.
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : (
          <>
            {/* Add Button */}
            <div className="mb-4">
              <button
                onClick={addItem}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 text-gray-600 hover:text-amber-700 flex items-center gap-2 w-full justify-center transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Menu Item
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${!item.visible ? 'border-gray-300 bg-gray-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <button
                      className="mt-2 cursor-move text-gray-400 hover:text-gray-600"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="h-5 w-5" />
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      {editingId === item.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Menu Label"
                          />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => updateItem(item.id, 'href', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
                            placeholder="/page-url"
                          />
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                          >
                            Done Editing
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingId(item.id)}
                          className="cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-amber-600">
                              {item.label}
                            </h3>
                            {item.highlighted && (
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 font-mono flex items-center gap-1">
                            {item.href}
                            <ExternalLink className="h-3 w-3" />
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHighlight(item.id)}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          item.highlighted ? 'text-amber-600' : 'text-gray-400'
                        }`}
                        title={item.highlighted ? 'Remove highlight' : 'Highlight (CTA button)'}
                      >
                        <Star className={`h-5 w-5 ${item.highlighted ? 'fill-amber-600' : ''}`} />
                      </button>

                      <button
                        onClick={() => toggleVisibility(item.id)}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          item.visible ? 'text-green-600' : 'text-gray-400'
                        }`}
                        title={item.visible ? 'Hide from menu' : 'Show in menu'}
                      >
                        {item.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded hover:bg-red-50 text-red-600"
                        title="Delete menu item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                  <Menu className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No menu items yet</p>
                  <p className="text-sm text-gray-500 mt-1">Click "Add Menu Item" to get started</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <h4 className="font-semibold mb-2">💡 Tips:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Drag items to reorder them</li>
                <li>Click on an item to edit its label and URL</li>
                <li>Use the eye icon to show/hide items without deleting them</li>
                <li>Use the star icon to highlight important CTAs (shown as buttons)</li>
                <li>Changes take effect immediately after saving</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
