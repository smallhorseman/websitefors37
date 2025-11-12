'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Mail, MessageSquare, Loader2, Edit, Trash2, Save, X } from 'lucide-react'

type Template = any & { type: 'email' | 'sms' }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'email' | 'sms'>('email')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/marketing/templates')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load templates')
      setTemplates(json.templates || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const createTemplate = async (form: FormData) => {
    setCreating(true)
    try {
      const type = form.get('type') as 'email' | 'sms'
      const payload: any = {
        type,
        name: form.get('name'),
        slug: form.get('slug'),
        category: form.get('category') || 'general'
      }
      if (type === 'email') {
        payload.subject = form.get('subject')
        payload.html_content = form.get('html_content')
        payload.text_content = form.get('text_content') || ''
      } else {
        payload.message_body = form.get('message_body')
      }
      const res = await fetch('/api/marketing/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create template')
      setShowCreate(false)
      fetchTemplates()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setCreating(false)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return
    const res = await fetch(`/api/marketing/templates/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) return alert(json.error || 'Failed to delete')
    fetchTemplates()
  }

  const startEdit = (tpl: Template) => {
    setEditId(tpl.id)
    setEditData(tpl)
  }

  const saveEdit = async () => {
    if (!editId) return
    const res = await fetch(`/api/marketing/templates/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    })
    const json = await res.json()
    if (!res.ok) return alert(json.error || 'Failed to update')
    setEditId(null)
    fetchTemplates()
  }

  const filtered = templates.filter(t => t.type === activeType)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Manage email & SMS templates with variables.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" /> New Template
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveType('email')}
          className={`px-4 py-2 font-medium border-b-2 flex items-center gap-2 ${activeType==='email'?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Mail className="h-5 w-5" /> Email
        </button>
        <button
          onClick={() => setActiveType('sms')}
          className={`px-4 py-2 font-medium border-b-2 flex items-center gap-2 ${activeType==='sms'?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <MessageSquare className="h-5 w-5" /> SMS
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" /> Loading templates...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
          <p className="text-gray-600 mb-2">No {activeType.toUpperCase()} templates yet.</p>
          <button onClick={()=>setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create one</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(tpl => (
            <div key={tpl.id} className="bg-white border border-gray-200 rounded p-5 hover:shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {tpl.type==='email' ? <Mail className="h-4 w-4 text-blue-600" /> : <MessageSquare className="h-4 w-4 text-green-600" />}
                    <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{tpl.slug}</span>
                  </div>
                  {editId===tpl.id ? (
                    <div className="space-y-2 mt-2">
                      <input
                        className="w-full px-3 py-2 border rounded"
                        value={editData.name || ''}
                        onChange={e=>setEditData({...editData,name:e.target.value})}
                      />
                      {tpl.type==='email' ? (
                        <>
                          <input
                            className="w-full px-3 py-2 border rounded"
                            value={editData.subject || ''}
                            onChange={e=>setEditData({...editData,subject:e.target.value})}
                          />
                          <textarea
                            className="w-full px-3 py-2 border rounded font-mono text-sm"
                            rows={6}
                            value={editData.html_content || ''}
                            onChange={e=>setEditData({...editData,html_content:e.target.value})}
                          />
                        </>
                      ) : (
                        <textarea
                          className="w-full px-3 py-2 border rounded"
                          rows={4}
                          value={editData.message_body || ''}
                          onChange={e=>setEditData({...editData,message_body:e.target.value})}
                        />
                      )}
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1 text-sm"><Save className="h-4 w-4" /> Save</button>
                        <button onClick={()=>setEditId(null)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded flex items-center gap-1 text-sm"><X className="h-4 w-4" /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                      {tpl.type==='email' ? tpl.subject : tpl.message_body?.slice(0,160)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {editId!==tpl.id && (
                    <button onClick={()=>startEdit(tpl)} className="border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 flex items-center gap-1 text-sm"><Edit className="h-4 w-4" /> Edit</button>
                  )}
                  <button onClick={()=>deleteTemplate(tpl.id)} className="border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50 flex items-center gap-1 text-sm"><Trash2 className="h-4 w-4" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateTemplateModal
          type={activeType}
          onClose={()=>setShowCreate(false)}
          onCreate={createTemplate}
          creating={creating}
        />
      )}
    </div>
  )
}

function CreateTemplateModal({ type, onClose, onCreate, creating }: { type: 'email' | 'sms'; onClose: () => void; onCreate: (f: FormData) => void; creating: boolean }) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    onCreate(form)
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Create {type==='email'?'Email':'SMS'} Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-4">
          <input type="hidden" name="type" value={type} />
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input name="name" required className="w-full px-3 py-2 border rounded" placeholder="Welcome Email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input name="slug" required className="w-full px-3 py-2 border rounded" placeholder="welcome-email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input name="category" className="w-full px-3 py-2 border rounded" placeholder="onboarding" />
          </div>
          {type==='email' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <input name="subject" required className="w-full px-3 py-2 border rounded" placeholder="Welcome to Studio37" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">HTML Content *</label>
                <textarea name="html_content" required rows={8} className="w-full px-3 py-2 border rounded font-mono text-sm" placeholder="<h1>Hi {{firstName}}</h1>" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Content</label>
                <textarea name="text_content" rows={3} className="w-full px-3 py-2 border rounded text-sm" placeholder="Hi {{firstName}}" />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Message Body *</label>
              <textarea name="message_body" required rows={4} maxLength={320} className="w-full px-3 py-2 border rounded" placeholder="Hi {{firstName}} your session is confirmed" />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={creating} className="flex-1 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              {creating ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
