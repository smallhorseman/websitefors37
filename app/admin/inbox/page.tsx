'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MessageSquare, Send, Search, Archive, Tag, Phone, User } from 'lucide-react'

interface Conversation {
  id: string
  contact_name: string | null
  contact_phone: string
  lead_id: string | null
  status: string
  unread_count: number
  last_message_at: string
  last_message_preview: string | null
  last_message_direction: string | null
}

interface Message {
  id: string
  body: string
  direction: 'inbound' | 'outbound'
  created_at: string
  is_read: boolean
  status: string
}

export default function InboxPage() {
  const supabase = createClientComponentClient()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [])

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      markAsRead(selectedConversation.id)
    }
  }, [selectedConversation])

  async function loadConversations() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sms_conversations')
      .select('*')
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })

    if (!error && data) {
      setConversations(data)
    }
    setLoading(false)
  }

  async function loadMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('sms_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
      // Scroll to bottom
      setTimeout(() => {
        const container = document.getElementById('messages-container')
        if (container) container.scrollTop = container.scrollHeight
      }, 100)
    }
  }

  async function markAsRead(conversationId: string) {
    await supabase.rpc('mark_conversation_messages_read', {
      p_conversation_id: conversationId
    })
    // Refresh conversation list to update unread counts
    loadConversations()
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const response = await fetch('/api/inbox/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          to: selectedConversation.contact_phone,
          message: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage('')
        loadMessages(selectedConversation.id)
        loadConversations()
      } else {
        alert('Failed to send message')
      }
    } catch (error) {
      console.error('Send error:', error)
      alert('Error sending message')
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.contact_phone.includes(searchQuery) ||
    conv.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col bg-white">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations</div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b text-left hover:bg-gray-50 transition ${
                  selectedConversation?.id === conv.id ? 'bg-amber-50 border-l-4 border-l-amber-600' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      {conv.contact_name ? (
                        <span className="text-sm font-medium text-amber-700">
                          {conv.contact_name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {conv.contact_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">{conv.contact_phone}</div>
                    </div>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="bg-amber-600 text-white text-xs rounded-full px-2 py-1">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {conv.last_message_direction === 'inbound' && '← '}
                  {conv.last_message_preview}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(conv.last_message_at).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  {selectedConversation.contact_name ? (
                    <span className="text-lg font-medium text-amber-700">
                      {selectedConversation.contact_name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation.contact_name || 'Unknown Contact'}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedConversation.contact_phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Archive className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      msg.direction === 'outbound'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-gray-900 border'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.body}</p>
                    <p className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-amber-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString()}
                      {msg.direction === 'outbound' && ` • ${msg.status}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Send Box */}
            <div className="bg-white border-t p-4">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="px-6 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
