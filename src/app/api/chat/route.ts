import { NextRequest, NextResponse } from 'next/server'
import { chatWithClaude } from '@/lib/claude'
import { searchRAG } from '@/lib/rag'
import { saveToRedis, getFromRedis } from '@/lib/redis'
import { generateSpeech } from '@/lib/voice'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message, language, currentSlide, sessionId = 'default', textOnly = false } = await request.json()

    // Handle text-to-speech only requests (no AI generation)
    if (textOnly) {
      const audioUrl = await generateSpeech(message, language)
      return NextResponse.json({
        message,
        nextSlide: currentSlide,
        audioUrl,
      })
    }

    if (message === 'introduce_and_start') {
      const introText = language === 'en'
        ? "Hello! I'm NoVo, your AI presentation assistant. I'll be guiding you through the NoVo Travel Assistant pitch deck today. I'll walk you through our innovative travel solution, explain our business model, and answer any questions you have about our company and investment opportunity. Let's begin with our first slide!"
        : "Olá! Sou a NoVo, sua assistente de apresentação de IA. Vou guiá-lo através do pitch deck do NoVo Travel Assistant hoje. Vou mostrar nossa solução inovadora de viagem, explicar nosso modelo de negócio e responder a quaisquer perguntas que você tenha sobre nossa empresa e oportunidade de investimento. Vamos começar com nosso primeiro slide!"
      
      const audioUrl = await generateSpeech(introText, language)
      
      return NextResponse.json({
        message: introText,
        nextSlide: 0,
        audioUrl,
      })
    }

    const ragContext = await searchRAG(message, language)
    
    const conversationHistory = await getFromRedis(`chat:${sessionId}`) || []
    
    const response = await chatWithClaude({
      message,
      language,
      currentSlide,
      ragContext,
      conversationHistory,
    })

    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response.message }
    )
    await saveToRedis(`chat:${sessionId}`, conversationHistory)

    const audioUrl = await generateSpeech(response.message, language)

    return NextResponse.json({
      message: response.message,
      nextSlide: response.nextSlide,
      audioUrl,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    )
  }
}
