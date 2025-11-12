'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface AnalyticsData {
  leads: {
    total: number
    last30: number
    growthRate: string
    bySource: Record<string, number>
    byStatus: {
      new: number
      contacted: number
      qualified: number
      converted: number
    }
    conversionRate: number
    scoreDistribution: {
      hot: number
      warm: number
      cold: number
    }
    monthlyTrend: Array<{ month: string; leads: number }>
  }
  appointments: {
    total: number
    upcoming: number
    completed: number
    cancelled: number
    last30: number
  }
  blog: {
    total: number
    published: number
    totalViews: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics')
      if (!res.ok) throw new Error('Failed to fetch')
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.error)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-6 py-4">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Back to Admin</Link>
          <h1 className="text-2xl font-bold mt-2">Analytics Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            Error loading analytics: {error}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const maxTrendValue = Math.max(...data.leads.monthlyTrend.map(d => d.leads), 1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Back to Admin</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Analytics Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold">{data.leads.total}</div>
            <div className="text-blue-100 text-sm mt-1">Total Leads</div>
            <div className="mt-3 text-sm">
              <span className={`font-semibold ${parseFloat(data.leads.growthRate) >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {parseFloat(data.leads.growthRate) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(data.leads.growthRate))}%
              </span> vs last period
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold">{data.leads.conversionRate}%</div>
            <div className="text-green-100 text-sm mt-1">Conversion Rate</div>
            <div className="mt-3 text-sm text-green-100">
              {data.leads.byStatus.converted} converted leads
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold">{data.appointments.upcoming}</div>
            <div className="text-purple-100 text-sm mt-1">Upcoming Appointments</div>
            <div className="mt-3 text-sm text-purple-100">
              {data.appointments.total} total appointments
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold">{data.blog.totalViews.toLocaleString()}</div>
            <div className="text-orange-100 text-sm mt-1">Blog Views</div>
            <div className="mt-3 text-sm text-orange-100">
              {data.blog.published} published posts
            </div>
          </div>
        </div>

        {/* Lead Score Distribution */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Temperature</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{data.leads.scoreDistribution.hot}</div>
              <div className="text-sm text-gray-600">🔥 Hot Leads (70+)</div>
              <div className="mt-2 bg-red-100 h-2 rounded-full">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.leads.scoreDistribution.hot / data.leads.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{data.leads.scoreDistribution.warm}</div>
              <div className="text-sm text-gray-600">☀️ Warm Leads (40-69)</div>
              <div className="mt-2 bg-orange-100 h-2 rounded-full">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.leads.scoreDistribution.warm / data.leads.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{data.leads.scoreDistribution.cold}</div>
              <div className="text-sm text-gray-600">❄️ Cold Leads (0-39)</div>
              <div className="mt-2 bg-blue-100 h-2 rounded-full">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.leads.scoreDistribution.cold / data.leads.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Lead Trend</h2>
            <div className="flex items-end justify-between gap-2 h-48">
              {data.leads.monthlyTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '150px' }}>
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500"
                      style={{ height: `${(item.leads / maxTrendValue) * 100}%`, minHeight: item.leads > 0 ? '8px' : '0' }}
                      title={`${item.leads} leads`}
                    />
                  </div>
                  <div className="text-xs text-gray-600 font-medium">{item.month}</div>
                  <div className="text-xs text-gray-900 font-bold">{item.leads}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leads by Status */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Status Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(data.leads.byStatus).map(([status, count]) => {
                const percentage = (count / data.leads.total) * 100
                const colors: Record<string, string> = {
                  new: 'bg-blue-500',
                  contacted: 'bg-yellow-500',
                  qualified: 'bg-purple-500',
                  converted: 'bg-green-500'
                }
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                      <span className="text-sm font-bold text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`${colors[status]} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Leads by Source */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Lead Sources</h2>
            <div className="space-y-3">
              {Object.entries(data.leads.bySource)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([source, count]) => {
                  const percentage = (count / data.leads.total) * 100
                  return (
                    <div key={source}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{source}</span>
                        <span className="text-sm font-bold text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Appointments Summary */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Appointments Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700">{data.appointments.completed}</div>
                <div className="text-sm text-green-600 mt-1">Completed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-700">{data.appointments.upcoming}</div>
                <div className="text-sm text-blue-600 mt-1">Upcoming</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-700">{data.appointments.cancelled}</div>
                <div className="text-sm text-red-600 mt-1">Cancelled</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-700">{data.appointments.last30}</div>
                <div className="text-sm text-purple-600 mt-1">Last 30 Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
