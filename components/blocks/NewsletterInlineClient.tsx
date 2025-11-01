"use client"

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewsletterInlineClient({ heading, subheading, disclaimer }: { heading?: string, subheading?: string, disclaimer?: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!name || !email || !phone) {
      setError('Please fill in name, email, and phone.')
      return
    }
    setIsSubmitting(true)
    try {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          name,
          email,
          phone,
          service_interest: 'newsletter_subscription',
          budget_range: '10% discount offer',
          source: 'newsletter_inline',
          status: 'new',
          notes: 'Subscribed to newsletter via inline form'
        }])
      if (dbError) throw dbError
      setSuccess('Thanks for subscribing! Check your email for your 10% discount.')
      setName(''); setEmail(''); setPhone('')
    } catch (err) {
      console.error('Newsletter subscribe error:', err)
      setError('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {(heading || subheading) && (
        <div className="text-center mb-4">
          {heading && <h3 className="text-2xl font-bold text-gray-900">{heading}</h3>}
          {subheading && <p className="text-gray-600 mt-1">{subheading}</p>}
        </div>
      )}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-3 text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded p-3 mb-3 text-sm">{success}</div>}
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
        <input className="border rounded px-3 py-2" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} disabled={isSubmitting} />
        <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={isSubmitting} />
        <input className="border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} disabled={isSubmitting} />
        <div className="md:col-span-3 text-center">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</button>
        </div>
      </form>
      {disclaimer && <p className="text-xs text-gray-500 mt-2 text-center">{disclaimer}</p>}
    </div>
  )
}
