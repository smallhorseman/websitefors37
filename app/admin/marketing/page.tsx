'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { EmailCampaign, SMSCampaign } from '@/lib/supabase'
import {
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'

type CampaignType = 'email' | 'sms'

export default function MarketingCampaignsPage() {
  const [campaignType, setCampaignType] = useState<CampaignType>('email')
  const [campaigns, setCampaigns] = useState<(EmailCampaign | SMSCampaign)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [sending, setSending] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [campaignType])

  const fetchCampaigns = async () => {
    try {
      setError(null)
      setLoading(true)

      const table = campaignType === 'email' ? 'email_campaigns' : 'sms_campaigns'
      const { data, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setCampaigns(data || [])
    } catch (err: any) {
      console.error('Error fetching campaigns:', err)
      setError(err.message || 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const sendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign? This cannot be undone.')) {
      return
    }

    setSending(campaignId)
    try {
      const res = await fetch(`/api/marketing/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: campaignType }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed to send campaign')
      }

      const result = await res.json()
      alert(
        `Campaign sent successfully!\n\nSent: ${result.campaign.sent_count}\nFailed: ${result.campaign.failed_count}`
      )
      fetchCampaigns()
    } catch (err: any) {
      alert(err.message || 'Failed to send campaign')
    } finally {
      setSending(null)
    }
  }

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const table = campaignType === 'email' ? 'email_campaigns' : 'sms_campaigns'
      const { error } = await supabase.from(table).delete().eq('id', campaignId)

      if (error) throw error
      fetchCampaigns()
    } catch (err: any) {
      alert(err.message || 'Failed to delete campaign')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'sending':
        return 'bg-yellow-100 text-yellow-800 animate-pulse'
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />
      case 'scheduled':
        return <Clock className="h-4 w-4" />
      case 'sending':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'sent':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Send email and SMS campaigns to your leads
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Campaign
        </button>
      </div>

      {/* Campaign Type Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setCampaignType('email')}
          className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
            campaignType === 'email'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <Mail className="h-5 w-5" />
          Email Campaigns
        </button>
        <button
          onClick={() => setCampaignType('sms')}
          className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 border-b-2 ${
            campaignType === 'sms'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          SMS Campaigns
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading campaigns...</span>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            {campaignType === 'email' ? (
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            ) : (
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {campaignType === 'email' ? 'Email' : 'SMS'} Campaigns Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first {campaignType === 'email' ? 'email' : 'SMS'} campaign to
              start engaging with your leads.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campaign.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {getStatusIcon(campaign.status)}
                      {campaign.status}
                    </span>
                  </div>

                  {campaignType === 'email' && 'subject' in campaign && (
                    <p className="text-sm text-gray-600 mb-3">
                      Subject: <span className="font-medium">{campaign.subject}</span>
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                        <Users className="h-4 w-4" />
                        Recipients
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {campaign.total_recipients}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
                        <Send className="h-4 w-4" />
                        Sent
                      </div>
                      <p className="text-xl font-bold text-blue-900">
                        {campaign.total_sent}
                      </p>
                    </div>

                    {campaignType === 'email' && 'total_opened' in campaign && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 text-xs mb-1">
                          <Eye className="h-4 w-4" />
                          Opened
                        </div>
                        <p className="text-xl font-bold text-green-900">
                          {campaign.total_opened}
                          {campaign.total_sent > 0 && (
                            <span className="text-sm font-normal text-green-700 ml-1">
                              ({Math.round((campaign.total_opened / campaign.total_sent) * 100)}%)
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {campaignType === 'email' && 'total_clicked' in campaign && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-600 text-xs mb-1">
                          <BarChart3 className="h-4 w-4" />
                          Clicked
                        </div>
                        <p className="text-xl font-bold text-purple-900">
                          {campaign.total_clicked}
                        </p>
                      </div>
                    )}

                    {campaignType === 'sms' && 'total_failed' in campaign && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 text-xs mb-1">
                          <XCircle className="h-4 w-4" />
                          Failed
                        </div>
                        <p className="text-xl font-bold text-red-900">
                          {campaign.total_failed}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                    {campaign.sent_at && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Sent: {new Date(campaign.sent_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => sendCampaign(campaign.id)}
                      disabled={sending === campaign.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {sending === campaign.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Send Now
                    </button>
                  )}
                  {campaign.status === 'draft' && (
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          type={campaignType}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchCampaigns()
          }}
        />
      )}
    </div>
  )
}

// Create Campaign Modal Component
function CreateCampaignModal({
  type,
  onClose,
  onSuccess,
}: {
  type: CampaignType
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html_content: '',
    text_content: '',
    message_body: '',
    target_type: 'all',
    target_criteria: {},
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ...formData,
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed to create campaign')
      }

      onSuccess()
    } catch (err: any) {
      alert(err.message || 'Failed to create campaign')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Create {type === 'email' ? 'Email' : 'SMS'} Campaign
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Spring 2025 Promotion"
            />
          </div>

          {type === 'email' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your session is ready!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HTML Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.html_content}
                  onChange={(e) =>
                    setFormData({ ...formData, html_content: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="<h1>Hello {{firstName}}!</h1><p>Your photos are ready...</p>"
                />
              </div>
            </>
          )}

          {type === 'sms' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Body * ({formData.message_body.length}/160 chars)
              </label>
              <textarea
                required
                rows={4}
                maxLength={320}
                value={formData.message_body}
                onChange={(e) =>
                  setFormData({ ...formData, message_body: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hi {{firstName}}! Your photos are ready at Studio37."
              />
              <p className="text-xs text-gray-500 mt-1">
                {Math.ceil(formData.message_body.length / 160)} SMS segment(s)
              </p>
            </div>
          )}

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <select
              value={formData.target_type}
              onChange={(e) =>
                setFormData({ ...formData, target_type: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Leads</option>
              <option value="segment">Specific Segment (coming soon)</option>
              <option value="individual">Individual Recipients (coming soon)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
