import Anthropic from '@anthropic-ai/sdk'

let anthropic: Anthropic | null = null

function getAnthropic() {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropic
}

interface ChatParams {
  message: string
  language: 'en' | 'pt'
  currentSlide: number
  ragContext: string
  conversationHistory: Array<{ role: string; content: string }>
}

export async function chatWithClaude({
  message,
  language,
  currentSlide,
  ragContext,
  conversationHistory,
}: ChatParams) {
  const systemPrompt = language === 'en'
    ? `You are NoVo, an AI presentation assistant for NoVo Travel Assistant. You are presenting to potential investors.

Your role:
- Guide investors through the pitch deck slides
- Answer questions about the business, market, technology, and investment opportunity
- Be professional, enthusiastic, and knowledgeable
- Reference specific slides when relevant
- Advance slides naturally during your presentation

Current slide: ${currentSlide}

Relevant context from pitch deck and company documents:
${ragContext}

IMPORTANT: Use all the information provided in the context above, even if it's in a different language. Translate and present it naturally in English.

When you want to move to the next slide, include [NEXT_SLIDE] in your response.
When you want to go to a specific slide, include [GOTO_SLIDE:X] where X is the slide number.`
    : `Você é a NoVo, uma assistente de apresentação de IA para o NoVo Travel Assistant. Você está apresentando para potenciais investidores.

Seu papel:
- Guiar investidores através dos slides do pitch deck
- Responder perguntas sobre o negócio, mercado, tecnologia e oportunidade de investimento
- Ser profissional, entusiasmada e conhecedora
- Referenciar slides específicos quando relevante
- Avançar slides naturalmente durante sua apresentação

Slide atual: ${currentSlide}

Contexto relevante do pitch deck e documentos da empresa:
${ragContext}

IMPORTANTE: Use todas as informações fornecidas no contexto acima, mesmo que estejam em outro idioma. Traduza e apresente naturalmente em Português.

Quando quiser avançar para o próximo slide, inclua [NEXT_SLIDE] na sua resposta.
Quando quiser ir para um slide específico, inclua [GOTO_SLIDE:X] onde X é o número do slide.`

  const messages = [
    ...conversationHistory.slice(-10),
    { role: 'user', content: message },
  ]

  const response = await getAnthropic().messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as any,
  })

  const content = response.content[0].type === 'text' 
    ? response.content[0].text 
    : ''

  let nextSlide = currentSlide
  let cleanedContent = content

  const nextSlideMatch = content.match(/\[NEXT_SLIDE\]/)
  if (nextSlideMatch) {
    nextSlide = currentSlide + 1
    cleanedContent = content.replace(/\[NEXT_SLIDE\]/g, '')
  }

  const gotoSlideMatch = content.match(/\[GOTO_SLIDE:(\d+)\]/)
  if (gotoSlideMatch) {
    nextSlide = parseInt(gotoSlideMatch[1])
    cleanedContent = content.replace(/\[GOTO_SLIDE:\d+\]/g, '')
  }

  return {
    message: cleanedContent.trim(),
    nextSlide,
  }
}
