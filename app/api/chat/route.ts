import { NextResponse } from 'next/server'

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
  try {
    const { message } = await request.json()

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        message: "I'm currently unavailable. Please fill out our contact form and we'll get back to you soon!"
      })
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const botMessage = response.text()

    return NextResponse.json({ message: botMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { message: "I'm having trouble responding right now. Please contact us directly for assistance." },
      { status: 500 }
    )
  }
}
