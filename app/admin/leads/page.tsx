'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, Mail, Phone, MessageCircle, Edit, Settings, Calendar, DollarSign, MessageSquare, X, Plus, PhoneCall, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Lead, CommunicationLog } from '@/lib/supabase'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const itemsPerPage = 20

  const fetchLeads = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      
      // Build query
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
      
      // Apply status filter
      if (filter !== 'all') {
        query = query.eq('status', filter)
      }
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)
      
      const { data, error: fetchError, count } = await query
      
      if (fetchError) {
        console.error('Supabase error:', fetchError)
        throw fetchError
      }
      
      setLeads(data || [])
      setTotalCount(count || 0)
      setPageCount(Math.ceil((count || 0) / itemsPerPage))
      
      console.log('Fetched leads:', { data, count, filter })
    } catch (error: any) {
      console.error('Error fetching leads:', error)
      setError(error.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [currentPage, filter])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const updateLeadStatus = async (id: string, status: string) => {
    try {
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
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setLeads(prev => prev.filter(lead => lead.id !== id))
      setShowLeadModal(false)
      // Refresh to update counts
      fetchLeads()
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
      default: return <Settings className="h-4 w-4" />
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

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Lead Management</h1>
        <div className="flex space-x-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Leads</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
          <button
            onClick={fetchLeads}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            title="Refresh leads"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xs font-medium text-gray-500">Total Leads</h3>
          <p className="text-xl font-bold mt-1">{totalCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xs font-medium text-gray-500">New</h3>
          <p className="text-xl font-bold mt-1 text-blue-600">
            {leads.filter(l => l.status === 'new').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xs font-medium text-gray-500">Qualified</h3>
          <p className="text-xl font-bold mt-1 text-green-600">
            {leads.filter(l => l.status === 'qualified').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xs font-medium text-gray-500">Converted</h3>
          <p className="text-xl font-bold mt-1 text-purple-600">
            {leads.filter(l => l.status === 'converted').length}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error loading leads:</p>
          <p>{error}</p>
          <button onClick={fetchLeads} className="text-red-600 underline mt-2">
            Try again
          </button>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2">Loading leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No leads found{filter !== 'all' ? ` with status: ${filter}` : ''}.</p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')} 
                className="text-primary-600 underline mt-2"
              >
                Show all leads
              </button>
            )}
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
                    Actions
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
                          onClick={() => logCommunication(lead, 'email', 'Sent email')}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        {lead.phone && (
                          <>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-green-600 hover:text-green-900"
                              title="Call"
                              onClick={() => logCommunication(lead, 'phone', 'Outbound phone call')}
                            >
                              <PhoneCall className="h-4 w-4" />
                            </a>
                            <a
                              href={`sms:${lead.phone}`}
                              className="text-purple-600 hover:text-purple-900"
                              title="Send text"
                              onClick={() => logCommunication(lead, 'sms', 'Sent text message')}
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
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete lead"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Notes Modal */}
      {showNotesModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add notes about this lead..."
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateLeadNotes}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Save Notes
              </button>
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

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} leads
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter(page => {
                  const distance = Math.abs(page - currentPage)
                  return distance === 0 || distance === 1 || page === 1 || page === pageCount
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index] - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2 py-1">...</span>
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded-md ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    )
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
