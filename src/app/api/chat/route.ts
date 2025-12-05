import { NextRequest, NextResponse } from 'next/server'
import { chatWithClaude } from '@/lib/claude'
import { searchRAG } from '@/lib/rag'
import { saveToRedis, getFromRedis } from '@/lib/redis'
import { generateSpeech } from '@/lib/voice'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // Allow up to 30 seconds for API calls

export async function POST(request: NextRequest) {
  try {
    const { message, language, currentSlide, sessionId = 'default', textOnly = false, isQuestion = false } = await request.json()

    console.log('[Chat API] Request:', { message: message.substring(0, 50), language, currentSlide, textOnly, isQuestion })
    const startTime = Date.now()

    // Handle text-to-speech only requests (no AI generation)
    if (textOnly) {
      const audioUrl = await generateSpeech(message, language)
      console.log('[Chat API] TTS only completed in', Date.now() - startTime, 'ms')
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

    // For questions, run RAG search and history fetch in parallel
    const [ragContext, conversationHistory] = await Promise.all([
      searchRAG(message, language),
      getFromRedis(`chat:${sessionId}`) || Promise.resolve([])
    ])

    console.log('[Chat API] RAG + History fetched in', Date.now() - startTime, 'ms')

    const response = await chatWithClaude({
      message,
      language,
      currentSlide,
      ragContext,
      conversationHistory: conversationHistory || [],
      isQuestion, // Pass flag to Claude for shorter responses to questions
    })

    console.log('[Chat API] Claude responded in', Date.now() - startTime, 'ms')

    // Save history and generate speech in parallel
    const [audioUrl] = await Promise.all([
      generateSpeech(response.message, language),
      saveToRedis(`chat:${sessionId}`, [
        ...(conversationHistory || []),
        { role: 'user', content: message },
        { role: 'assistant', content: response.message }
      ])
    ])

    console.log('[Chat API] Total time:', Date.now() - startTime, 'ms')

    return NextResponse.json({
      message: response.message,
      nextSlide: response.nextSlide,
      audioUrl,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Chat API error:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to process message', details: errorMessage },
      { status: 500 }
    )
  }
}
