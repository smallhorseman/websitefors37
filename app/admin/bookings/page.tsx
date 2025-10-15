'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/lib/supabase'
import { Loader2, Calendar, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react'

export default function AdminBookingsPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('start_time', { ascending: false })
      if (error) throw error
      setAppointments(data || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const updateStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) return alert('Failed to update')
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this appointment?')) return
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) return alert('Failed to delete')
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Bookings</h1>
        <button className="border rounded px-3 py-1" onClick={fetchAppointments}>Refresh</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div className="flex items-center text-gray-600"><Loader2 className="h-5 w-5 animate-spin mr-2"/> Loading…</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> {new Date(a.start_time).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3"/> {a.duration_minutes} min</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-gray-600">{a.email}</div>
                    {a.phone && <div className="text-sm text-gray-600">{a.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {a.type === 'consultation' ? 'Consultation' : (a.package_name || a.package_key)}
                  </td>
                  <td className="px-4 py-3">{a.duration_minutes} min</td>
                  <td className="px-4 py-3">{a.price_cents ? `$${(a.price_cents/100).toFixed(0)}` : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${a.status==='scheduled'?'bg-blue-100 text-blue-700':a.status==='completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="text-green-700" title="Mark completed" onClick={()=>updateStatus(a.id,'completed')}><CheckCircle className="h-5 w-5"/></button>
                    <button className="text-yellow-700" title="Cancel" onClick={()=>updateStatus(a.id,'cancelled')}><XCircle className="h-5 w-5"/></button>
                    <button className="text-red-700" title="Delete" onClick={()=>remove(a.id)}><Trash2 className="h-5 w-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
