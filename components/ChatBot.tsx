'use client'

import React, { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
  timestamp: Date
}

interface LeadData {
  name?: string
  email?: string
  phone?: string
  service?: string
  budget?: string
  timeline?: string
  message?: string
}

interface ChatFlowStep {
  text: string
  field: string | null
  next: string | null
  options?: string[]
}

const CHAT_FLOW: Record<string, ChatFlowStep> = {
  initial: {
    text: "Hi! I'm here to help you with your photography needs. What's your name?",
    field: 'name',
    next: 'service'
  },
  service: {
    text: "Nice to meet you! What type of photography service are you looking for?",
    field: 'service',
    options: ['Wedding', 'Portrait', 'Event', 'Commercial', 'Other'],
    next: 'budget'
  },
  budget: {
    text: "Great choice! What's your budget range for this project?",
    field: 'budget',
    options: ['Under $1,000', '$1,000 - $2,500', '$2,500 - $5,000', 'Over $5,000'],
    next: 'timeline'
  },
  timeline: {
    text: "When are you planning to have this photography session?",
    field: 'timeline',
    options: ['ASAP', 'Within a month', '1-3 months', '3+ months'],
    next: 'email'
  },
  email: {
    text: "Almost done! What's your email so we can send you a detailed quote?",
    field: 'email',
    next: 'phone'
  },
  phone: {
    text: "And a phone number where we can reach you?",
    field: 'phone',
    next: 'message'
  },
  message: {
    text: "Is there anything specific you'd like us to know about your project?",
    field: 'message',
    next: 'complete'
  },
  complete: {
    text: "Thank you! We'll be in touch within 24 hours with a personalized quote.",
    field: null,
    next: null
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState<keyof typeof CHAT_FLOW>('initial')
  const [leadData, setLeadData] = useState<LeadData>({})
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startChat = () => {
    setIsOpen(true)
    setMessages([{
      id: '1',
      text: CHAT_FLOW.initial.text,
      sender: 'bot',
      timestamp: new Date()
    }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const currentFlow = CHAT_FLOW[currentStep]
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Update lead data
    if (currentFlow.field) {
      setLeadData(prev => ({ ...prev, [currentFlow.field as string]: inputValue }))
    }

    // Clear input
    setInputValue('')

    // Move to next step
    if (currentFlow.next) {
      const nextStep = currentFlow.next as keyof typeof CHAT_FLOW
      setCurrentStep(nextStep)
      
      // Add bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: CHAT_FLOW[nextStep].text,
          sender: 'bot',
          timestamp: new Date()
        }])
      }, 500)

      // If we're complete, submit to CRM
      if (nextStep === 'complete') {
        await submitToCRM()
      }
    }
  }

  const handleOptionClick = (option: string) => {
    setInputValue(option)
    handleSubmit(new Event('submit') as any)
  }

  const submitToCRM = async () => {
    setIsSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          service_interest: leadData.service?.toLowerCase(),
          budget_range: leadData.budget,
          message: `Timeline: ${leadData.timeline}\n\nAdditional notes: ${leadData.message || 'None'}`,
          status: 'new'
        }])

      if (error) throw error
    } catch (error) {
      console.error('Error submitting lead:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, there was an error submitting your information. Please try again or contact us directly.",
        sender: 'bot',
        timestamp: new Date()
      }])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={startChat}
            className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">Let's Chat About Your Project</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-700 p-1 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Options buttons */}
              {CHAT_FLOW[currentStep].options && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {CHAT_FLOW[currentStep].options!.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            {currentStep !== 'complete' && (
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type={currentStep === 'email' ? 'email' : currentStep === 'phone' ? 'tel' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSubmitting}
                    className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}