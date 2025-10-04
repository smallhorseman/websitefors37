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
    
    // Initialize Gemini with the latest model
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try different model names based on current availability
    const modelNames = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest', 
      'gemini-1.5-pro',
      'gemini-1.0-pro-latest',
      'gemini-1.0-pro'
    ]
    
    let botMessage = null
    let lastError = null
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        
        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`
        
        const result = await model.generateContent(prompt)
        const response = await result.response
        botMessage = response.text()
        
        console.log(`Success with model: ${modelName}`)
        break
      } catch (error) {
        console.error(`Failed with ${modelName}:`, error)
        lastError = error
      }
    }
    
    if (botMessage) {
      return NextResponse.json({ message: botMessage })
    } else {
      throw lastError || new Error('All models failed')
    }
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { message: "I'm having trouble responding right now. Please contact us directly for assistance." },
      { status: 500 }
    )
  }
}
