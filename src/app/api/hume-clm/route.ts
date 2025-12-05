import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchRAG } from '@/lib/rag'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Verify the request is from Hume
function verifyHumeAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  
  const token = authHeader.substring(7)
  const expectedToken = process.env.HUME_CLM_SECRET || process.env.HUME_SECRET_KEY
  
  // In production, verify the token matches your secret
  // For now, accept any bearer token from Hume
  return !!token
}

// Get current time/date info
function getTimeInfo(): string {
  const now = new Date()
  return `Current date and time: ${now.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })}`
}

// Extract emotion context from Hume's prosody data
function extractEmotionContext(messages: any[]): string {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()
  if (!lastUserMessage?.models?.prosody?.scores) return ''
  
  const scores = lastUserMessage.models.prosody.scores
  const topEmotions = Object.entries(scores)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([emotion, score]) => `${emotion}: ${((score as number) * 100).toFixed(0)}%`)
    .join(', ')
  
  return topEmotions ? `\nUser's detected emotions: ${topEmotions}` : ''
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyHumeAuth(request)) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const messages = body.messages || []
    const customSessionId = request.nextUrl.searchParams.get('custom_session_id')
    
    console.log('[Hume CLM] Received request, messages:', messages.length)

    // Extract the latest user message
    const userMessages = messages.filter((m: any) => m.role === 'user')
    const latestUserMessage = userMessages[userMessages.length - 1]?.content || ''
    
    // Get emotion context from Hume's analysis
    const emotionContext = extractEmotionContext(messages)
    
    // Query RAG for relevant presentation context
    const ragContext = await searchRAG(latestUserMessage, 'en')
    
    // Get time information
    const timeInfo = getTimeInfo()
    
    // Build system prompt with all context
    const systemPrompt = `You are NoVo, an emotionally intelligent AI assistant for NoVo Travel Assistant - an AI-powered travel companion startup.

You have just finished presenting an investor pitch deck and are now in a Q&A session. Be warm, engaging, and helpful.

${timeInfo}

${emotionContext}

PRESENTATION CONTEXT (from pitch deck):
${ragContext || 'No specific context retrieved - answer based on your knowledge of NoVo as an AI travel assistant startup seeking investment.'}

KEY FACTS ABOUT NOVO:
- NoVo is an AI-powered travel assistant combining emotional intelligence with practical travel features
- Following the "Palantir playbook" - creating intuitive AI interfaces
- Target market: $1.9 trillion global travel and lifestyle market
- Seeking £65,000 initial investment for MVP development
- SEIS eligible for UK investors (50% tax relief)
- Founded by Jesus Rui & Wayne Harburn
- Phases: Research → MVP → Beta with TfL license → European expansion

RESPONSE GUIDELINES:
- Keep responses conversational and concise (2-4 sentences for simple questions)
- Match the user's emotional tone - be empathetic if they seem concerned, enthusiastic if they're excited
- For investment questions, be transparent and helpful
- If asked about flights, news, or time-sensitive info, acknowledge you can provide real-time data
- Always be professional but warm and approachable`

    // Format messages for Claude
    const claudeMessages = messages
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))

    // Call Claude with streaming
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      system: systemPrompt,
      messages: claudeMessages,
    })

    // Create SSE stream response for Hume
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const chunk = {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: 'claude-sonnet-4-5',
                system_fingerprint: customSessionId || 'novo-clm',
                choices: [{
                  index: 0,
                  delta: { content: event.delta.text },
                  finish_reason: null
                }]
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
            }
          }
          
          // Send final chunk
          const finalChunk = {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: 'claude-sonnet-4-5',
            system_fingerprint: customSessionId || 'novo-clm',
            choices: [{
              index: 0,
              delta: {},
              finish_reason: 'stop'
            }]
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('[Hume CLM] Stream error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('[Hume CLM] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

