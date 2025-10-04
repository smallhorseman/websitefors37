'use client'

import React, { useState, useEffect } from 'react'
import { Users, FileText, Settings, X, Mail, Phone, Calendar, DollarSign, MessageSquare, Trash2, Edit, PhoneCall, MessageCircle, Loader2, Plus, Clock } from 'lucide-react'

const Images = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  service_interest: string
  budget_range?: string
  event_date?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  created_at: string
  notes?: string
}

interface CommunicationLog {
  id: string
  lead_id: string
  type: 'email' | 'phone' | 'sms' | 'note' | 'meeting' | 'other'
  subject?: string
  content: string
  direction?: 'inbound' | 'outbound' | 'internal'
  created_at: string
  created_by?: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [logs, setLogs] = useState<CommunicationLog[]>([])
  const [newLog, setNewLog] = useState({
    type: 'note' as CommunicationLog['type'],
    subject: '',
    content: '',
    direction: 'outbound' as CommunicationLog['direction']
  })

  const fetchLeads = async () => {
    try {
      setError(null)
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched leads:', data)
      setLeads(data || [])
    } catch (error: any) {
      console.error('Error fetching leads:', error)
      setError(error.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, status: status as Lead['status'] } : lead
      ))
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead status')
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    setIsDeleting(id)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setLeads(prev => prev.filter(lead => lead.id !== id))
      setShowLeadModal(false)
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert('Failed to delete lead')
    } finally {
      setIsDeleting(null)
    }
  }

  const updateLeadNotes = async () => {
    if (!selectedLead) return
    
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', selectedLead.id)

      if (error) throw error
      
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, notes } : lead
      ))
      setSelectedLead({ ...selectedLead, notes })
      setShowNotesModal(false)
      setNotes('')
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes')
    }
  }

  const fetchCommunicationLogs = async (leadId: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const addCommunicationLog = async () => {
    if (!selectedLead || !newLog.content.trim()) return

    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('communication_logs')
        .insert([{
          lead_id: selectedLead.id,
          type: newLog.type,
          subject: newLog.subject,
          content: newLog.content,
          direction: newLog.direction,
          created_by: 'admin'
        }])

      if (error) throw error

      // Refresh logs
      await fetchCommunicationLogs(selectedLead.id)
      
      // Reset form
      setNewLog({
        type: 'note',
        subject: '',
        content: '',
        direction: 'outbound'
      })
      setShowLogModal(false)

      // Update lead status if it's new
      if (selectedLead.status === 'new') {
        await updateLeadStatus(selectedLead.id, 'contacted')
      }
    } catch (error) {
      console.error('Error adding log:', error)
      alert('Failed to add communication log')
    }
  }

  const logCommunication = async (lead: Lead, type: CommunicationLog['type'], content: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')

      await supabase
        .from('communication_logs')
        .insert([{
          lead_id: lead.id,
          type,
          content,
          direction: 'outbound',
          created_by: 'admin'
        }])

      if (lead.status === 'new') {
        await updateLeadStatus(lead.id, 'contacted')
      }
    } catch (error) {
      console.error('Error logging communication:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const viewLeadDetails = async (lead: Lead) => {
    setSelectedLead(lead)
    setShowLeadModal(true)
    await fetchCommunicationLogs(lead.id)
  }

  const openNotesModal = (lead: Lead) => {
    setSelectedLead(lead)
    setNotes(lead.notes || '')
    setShowNotesModal(true)
  }

  const getLogIcon = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'sms': return <MessageCircle className="h-4 w-4" />
      case 'meeting': return <Calendar className="h-4 w-4" />
      case 'note': return <MessageSquare className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getLogColor = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'email': return 'text-blue-600'
      case 'phone': return 'text-green-600'
      case 'sms': return 'text-purple-600'
      case 'meeting': return 'text-orange-600'
      case 'note': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Studio 37 Admin Dashboard</h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading data:</p>
            <p>{error}</p>
            <button onClick={fetchLeads} className="text-red-600 underline mt-2">
              Try again
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="text-2xl font-bold mt-2">{leads.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
            <p className="text-2xl font-bold mt-2 text-blue-600">
              {leads.filter(l => l.status === 'new').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Qualified</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">
              {leads.filter(l => l.status === 'qualified').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Converted</h3>
            <p className="text-2xl font-bold mt-2 text-purple-600">
              {leads.filter(l => l.status === 'converted').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'leads' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Lead Management</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="ml-2">Loading leads...</span>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No leads yet. They'll appear here when customers submit forms or use the chat.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quick Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.name}
                                </div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.service_interest}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.budget_range || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(lead.status)}`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => viewLeadDetails(lead)}
                                  className="text-primary-600 hover:text-primary-900"
                                  title="View details"
                                >
                                  <Settings className="h-4 w-4" />
                                </button>
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Send email"
                                >
                                  <Mail className="h-4 w-4" />
                                </a>
                                {lead.phone && (
                                  <>
                                    <a
                                      href={`tel:${lead.phone}`}
                                      className="text-green-600 hover:text-green-900"
                                      title="Call"
                                    >
                                      <PhoneCall className="h-4 w-4" />
                                    </a>
                                    <a
                                      href={`sms:${lead.phone}`}
                                      className="text-purple-600 hover:text-purple-900"
                                      title="Send text"
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                    </a>
                                  </>
                                )}
                                <button
                                  onClick={() => openNotesModal(lead)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Add/edit notes"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Content Management</h2>
                <p className="text-gray-600">Content editor coming soon...</p>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Gallery Management</h2>
                <p className="text-gray-600">Gallery manager coming soon...</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Settings</h2>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Details Modal */}
        {showLeadModal && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Lead Details</h3>
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-lg">{selectedLead.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p><span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(selectedLead.status)}`}>
                        {selectedLead.status}
                      </span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p>{selectedLead.email}</p>
                      </div>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p>{selectedLead.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service Interest</label>
                      <p className="capitalize">{selectedLead.service_interest}</p>
                    </div>
                    {selectedLead.budget_range && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Budget</label>
                          <p>{selectedLead.budget_range}</p>
                        </div>
                      </div>
                    )}
                    {selectedLead.event_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Event Date</label>
                          <p>{new Date(selectedLead.event_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-500">Message</label>
                    </div>
                    <p className="bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p>{new Date(selectedLead.created_at).toLocaleString()}</p>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Communication History */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Communication History</h4>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Log
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No communication history yet</p>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`${getLogColor(log.type)} mt-1`}>
                              {getLogIcon(log.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium capitalize">
                                  {log.type}
                                </span>
                                {log.direction && (
                                  <span className="text-xs text-gray-500 capitalize">
                                    ({log.direction})
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {new Date(log.created_at).toLocaleString()}
                                </span>
                              </div>
                              {log.subject && (
                                <p className="text-sm font-medium mb-1">{log.subject}</p>
                              )}
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">{log.content}</p>
                            </div>
                          </div>
                        </div>
                  ))
                )}
              </div>
            </div>
          </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => deleteLead(selectedLead.id)}
                disabled={isDeleting === selectedLead.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting === selectedLead.id ? 'Deleting...' : 'Delete Lead'}
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedLead.phone && (
                  <a
                    href={`tel:${selectedLead.phone}`}
                    onClick={() => logCommunication(selectedLead, 'phone', 'Outbound phone call')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Call
                  </a>
                )}
                <a
                  href={`mailto:${selectedLead.email}`}
                  onClick={() => logCommunication(selectedLead, 'email', 'Sent email')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Log Modal */}
      {showLogModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Add Communication Log</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newLog.type}
                  onChange={(e) => setNewLog({ ...newLog, type: e.target.value as CommunicationLog['type'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="note">Note</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="sms">Text Message</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                <select
                  value={newLog.direction}
                  onChange={(e) => setNewLog({ ...newLog, direction: e.target.value as CommunicationLog['direction'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                  <option value="internal">Internal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                <input
                  type="text"
                  value={newLog.subject}
                  onChange={(e) => setNewLog({ ...newLog, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief subject or title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea
                  value={newLog.content}
                  onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the communication..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addCommunicationLog}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={!newLog.content.trim()}
              >
                Add Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
