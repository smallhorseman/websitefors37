'use client'

import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EnhancedContentManagement from '@/components/EnhancedContentManagement'
import { RefreshCw } from 'lucide-react'

export default function ContentAdminUnified() {
  const supabase = createClientComponentClient()

  // Booking background image URL setting (from basic content page)
  const [bookingBgUrl, setBookingBgUrl] = useState('')
  const [savingBgUrl, setSavingBgUrl] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('id, book_session_bg_url')
          .maybeSingle()
        if (error) throw error
        setBookingBgUrl(data?.book_session_bg_url || '')
      } catch (err: any) {
        setSettingsError(err.message || 'Failed to load settings')
      }
    }
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveBookingBgUrl = async () => {
    setSavingBgUrl(true)
    setSettingsError(null)
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .maybeSingle()
      if (fetchErr) throw fetchErr

      if (existing?.id) {
        const { error } = await supabase
          .from('settings')
          .update({ book_session_bg_url: bookingBgUrl, updated_at: new Date().toISOString() })
          .match({ id: existing.id })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([{ book_session_bg_url: bookingBgUrl }])
        if (error) throw error
      }
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to save background image URL')
    } finally {
      setSavingBgUrl(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Booking Page Background Image Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Book a Session Background Image</h2>
          <button
            onClick={saveBookingBgUrl}
            disabled={savingBgUrl}
            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${savingBgUrl ? 'animate-spin' : ''}`} />
            {savingBgUrl ? 'Saving...' : 'Save'}
          </button>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          value={bookingBgUrl}
          onChange={e => setBookingBgUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          placeholder="Paste image URL here"
        />
        {settingsError && <div className="mt-2 text-red-600 text-sm">{settingsError}</div>}
        {bookingBgUrl && (
          <div className="mt-4">
            <span className="block text-xs text-gray-500 mb-1">Preview:</span>
            <img src={bookingBgUrl} alt="Booking background preview" className="rounded-lg max-h-48 border" />
          </div>
        )}
      </div>

      {/* Enhanced CMS */}
      <EnhancedContentManagement />
    </div>
  )
}
