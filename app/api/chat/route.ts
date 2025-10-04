import { NextResponse } from 'next/server'

// Simple scripted responses for lead generation
const LEAD_GEN_FLOWS = {
  initial: {
    response: "Hi there! I'm Studio 37's virtual assistant. How can I help you today? Are you interested in wedding photography, portraits, events, or commercial photography?",
    next: "service"
  },
  service: {
    response: "Great choice! Our photographers specialize in capturing these moments perfectly. Would you like to know about our pricing options or book a consultation?",
    next: "interest"
  },
  interest: {
    response: "Wonderful! To provide you with the most accurate information, could you share a bit more about what you're looking for? This helps us prepare a personalized quote.",
    next: "contact"
  },
  contact: {
    response: "Thanks for sharing that! To discuss your project and provide a custom quote, we'd need to get your contact information. Would you like to leave your email or phone number?",
    next: "collect"
  },
  collect: {
    response: "Perfect! A member of our team will reach out to you within 24 hours with more information. Is there anything specific you'd like us to know before the consultation?",
    next: "final"
  },
  final: {
    response: "Thank you for your interest in Studio 37 Photography! We've recorded your information and will be in touch soon. We look forward to working with you to capture your special moments!",
    next: null
  },
  fallback: {
    response: "Thanks for your message! To better assist you, would you like to discuss your photography needs with our team? We can provide personalized information about our services and pricing.",
    next: "contact"
  }
}

// Track conversation state in memory (in production, use a proper database or session store)
const conversations = new Map()

export async function POST(request: Request) {
  try {
    const { message, sessionId } = await request.json()
    console.log('Received message:', message)

    // Create or retrieve conversation state
    let conversationState = conversations.get(sessionId) || { step: "initial", data: {} }
    
    // Simple keyword matching to determine flow
    const messageNormalized = message.toLowerCase()
    
    // Analyze message content to determine next response
    let response
    
    if (conversationState.step === "initial" || !conversationState.step) {
      if (messageNormalized.includes("wedding") || 
          messageNormalized.includes("portrait") || 
          messageNormalized.includes("event") || 
          messageNormalized.includes("commercial")) {
        response = LEAD_GEN_FLOWS.service.response
        conversationState.step = "service"
        
        // Store the service type
        if (messageNormalized.includes("wedding")) conversationState.data.service = "wedding"
        else if (messageNormalized.includes("portrait")) conversationState.data.service = "portrait"
        else if (messageNormalized.includes("event")) conversationState.data.service = "event"
        else if (messageNormalized.includes("commercial")) conversationState.data.service = "commercial"
      } else {
        response = LEAD_GEN_FLOWS.initial.response
      }
    } else if (conversationState.step === "service") {
      response = LEAD_GEN_FLOWS.interest.response
      conversationState.step = "interest"
    } else if (conversationState.step === "interest") {
      // Store any additional details
      conversationState.data.details = message
      response = LEAD_GEN_FLOWS.contact.response
      conversationState.step = "contact"
    } else if (conversationState.step === "contact") {
      // Try to extract email or phone
      const emailMatch = message.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/)
      const phoneMatch = message.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)
      
      if (emailMatch) conversationState.data.email = emailMatch[0]
      if (phoneMatch) conversationState.data.phone = phoneMatch[0]
      
      response = LEAD_GEN_FLOWS.collect.response
      conversationState.step = "collect"
      
      // Here you would normally save the lead to your database
      // saveLead(conversationState.data)
    } else if (conversationState.step === "collect") {
      // Store any final details
      conversationState.data.additionalInfo = message
      response = LEAD_GEN_FLOWS.final.response
      conversationState.step = "final"
      
      // Complete lead processing here
      // finalizeLeadInDatabase(sessionId, conversationState.data)
    } else {
      // Default response for any other state
      response = LEAD_GEN_FLOWS.fallback.response
    }
    
    // Save conversation state
    conversations.set(sessionId, conversationState)
    
    // If using the lead's name, personalize message
    if (conversationState.data.name) {
      response = response.replace("Hi there!", `Hi ${conversationState.data.name}!`)
    }
    
    // Log conversation state for debugging
    console.log('Conversation state:', conversationState)
    
    return NextResponse.json({ message: response })
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { message: "I'm having trouble responding right now. Please contact us directly for assistance." },
      { status: 500 }
    )
  }
}
