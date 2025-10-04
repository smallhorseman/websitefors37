import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are a helpful assistant for Studio 37, a professional photography studio. 

Our services include:
- Wedding Photography: Capturing your special day with artistic excellence
- Portrait Sessions: Individual, family, and professional headshots
- Event Photography: Corporate events, parties, and celebrations
- Commercial Photography: Product, business, and marketing photography

Key information:
- We're located and serve the local area
- We offer both indoor studio sessions and on-location shoots
- Our pricing varies by service type and package
- We provide both digital and print options
- Consultations are always free
- We have flexible scheduling including weekends

Keep responses helpful, professional, and concise. If asked about specific pricing, suggest they fill out our contact form for a personalized quote. Always encourage them to book a free consultation.`

export async function POST(request: Request) {
  console.log('Chat API called')
  
  try {
    const { message } = await request.json()
    console.log('Received message:', message)

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'Chat service is not configured properly' },
        { status: 500 }
      )
    }

    console.log('API key found, initializing Gemini...')
    
    // Initialize Gemini with the correct model name
    const genAI = new GoogleGenerativeAI(apiKey)
    // Use the updated model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`

    console.log('Generating response...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const botMessage = response.text()
    
    console.log('Response generated successfully')

    return NextResponse.json({ message: botMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    // More specific error handling
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { message: "I'm having trouble with the AI service. Please contact us directly at your convenience." },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "I'm having trouble responding right now. Please contact us directly for assistance." },
      { status: 500 }
    )
  }
}
