'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  source?: string
  lead_score: number
  score_details?: Record<string, number>
  budget_range?: string
  service_interest?: string
  event_date?: string
  created_at: string
  last_activity_at?: string
}

interface ScoreRanges {
  hot: number
  warm: number
  cold: number
}

export default function LeadScoringPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [scoreRanges, setScoreRanges] = useState<ScoreRanges>({ hot: 0, warm: 0, cold: 0 })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [minScoreFilter, setMinScoreFilter] = useState(0)
  const [sortBy, setSortBy] = useState('lead_score')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        minScore: minScoreFilter.toString(),
        sortBy,
        sortOrder
      })
      
      const res = await fetch(`/api/admin/leads-scored?${params}`)
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      
      if (data.success) {
        setLeads(data.leads || [])
        setScoreRanges(data.scoreRanges || { hot: 0, warm: 0, cold: 0 })
        setError(null)
      } else {
        throw new Error(data.error || 'Failed to load')
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      const res = await fetch('/api/admin/leads-scored', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert(`Successfully recalculated ${data.count} lead scores!`)
        fetchLeads()
      }
    } catch (e: any) {
      alert('Failed to recalculate scores: ' + e.message)
    } finally {
      setRecalculating(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [statusFilter, minScoreFilter, sortBy, sortOrder])

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50'
    if (score >= 40) return 'text-orange-600 bg-orange-50'
    return 'text-blue-600 bg-blue-50'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return '🔥 Hot'
    if (score >= 40) return '☀️ Warm'
    return '❄️ Cold'
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Back to Admin</Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Lead Scoring Dashboard</h1>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition text-sm font-medium"
          >
            {recalculating ? 'Recalculating...' : '🔄 Recalculate All Scores'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Score Distribution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-4xl font-bold">{scoreRanges.hot}</div>
            <div className="text-red-100 text-sm mt-1">Hot Leads (70+)</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">☀️</div>
            <div className="text-4xl font-bold">{scoreRanges.warm}</div>
            <div className="text-orange-100 text-sm mt-1">Warm Leads (40-69)</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">❄️</div>
            <div className="text-4xl font-bold">{scoreRanges.cold}</div>
            <div className="text-blue-100 text-sm mt-1">Cold Leads (0-39)</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Score</label>
              <input
                type="number"
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(parseInt(e.target.value) || 0)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="lead_score">Lead Score</option>
                <option value="created_at">Created Date</option>
                <option value="last_activity_at">Last Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
            Error loading leads: {error}
          </div>
        )}

        {/* Leads Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Event Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(lead.lead_score)}`}>
                          <span>{lead.lead_score}</span>
                          <span className="text-xs">{getScoreLabel(lead.lead_score).split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/leads?id=${lead.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.source || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.service_interest || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lead.budget_range || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.event_date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.last_activity_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No leads found matching your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
