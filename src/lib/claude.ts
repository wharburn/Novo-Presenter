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
  console.log('chatWithClaude called with:', { message, language, currentSlide })
  console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY)
  console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10))
  
  const slideInfo = currentSlide === 0 
    ? "You are presenting the COVER SLIDE (introduction). After introducing yourself and the presentation, include [NEXT_SLIDE] to move to slide 1."
    : `You are presenting SLIDE ${currentSlide} of the pitch deck. This is slide number ${currentSlide} out of 10 content slides.

SLIDE MAPPING:
- Slide 0: Cover/Introduction (NoVo Travel Assistant logo)
- Slide 1: THE PROBLEM (AI not being used effectively)
- Slide 2: THE SOLUTION (NoVo as conversational AI assistant)
- Slides 3-10: Additional pitch deck content

Current slide you're presenting: Slide ${currentSlide}`

  const systemPrompt = language === 'en'
    ? `You are NoVo, an AI presentation assistant for NoVo Travel Assistant. You are presenting to potential investors.

${slideInfo}

Your role:
- Present each slide by reading out ALL the text and key points visible on the slide
- Explain what the slide shows in detail
- Answer questions when asked, then continue the presentation
- Be professional, enthusiastic, and knowledgeable
- After explaining each slide thoroughly, automatically move to the next by including [NEXT_SLIDE]

Relevant context from pitch deck and company documents:
${ragContext}

IMPORTANT: 
- Use all the information provided in the context above, even if it's in a different language. Translate and present it naturally in English.
- Read out the complete content of the current slide, including titles, subtitles, bullet points, and key data
- Make sure to verbalize everything that appears on the slide
- Format your response with **HEADING** for slide titles and **Label:** text for bullet points

PRESENTATION FLOW:
- If the user asks a question, answer it clearly and briefly, then indicate you'll continue: include [NEXT_SLIDE] at the end
- If continuing the presentation, READ OUT the complete slide content (titles, points, data) and explain it, then include [NEXT_SLIDE] to move forward
- When you want to go to a specific slide, include [GOTO_SLIDE:X] where X is the slide number.`
    : `Você é a NoVo, uma assistente de apresentação de IA para o NoVo Travel Assistant. Você está apresentando para potenciais investidores.

${slideInfo}

Seu papel:
- Apresentar cada slide lendo TODO o texto e pontos-chave visíveis no slide
- Explicar o que o slide mostra em detalhe
- Responder perguntas quando perguntado, depois continuar a apresentação
- Ser profissional, entusiasmada e conhecedora
- Após explicar cada slide completamente, avançar automaticamente para o próximo incluindo [NEXT_SLIDE]

Contexto relevante do pitch deck e documentos da empresa:
${ragContext}

IMPORTANTE: 
- Use todas as informações fornecidas no contexto acima, mesmo que estejam em outro idioma. Traduza e apresente naturalmente em Português.
- Leia o conteúdo completo do slide atual, incluindo títulos, subtítulos, pontos e dados principais
- Certifique-se de verbalizar tudo que aparece no slide
- Formate sua resposta com **TÍTULO** para títulos de slide e **Rótulo:** texto para pontos

FLUXO DA APRESENTAÇÃO:
- Se o usuário fizer uma pergunta, responda claramente e brevemente, depois indique que continuará: inclua [NEXT_SLIDE] no final
- Se continuar a apresentação, LEIA o conteúdo completo do slide (títulos, pontos, dados) e explique, depois inclua [NEXT_SLIDE] para avançar
- Quando quiser ir para um slide específico, inclua [GOTO_SLIDE:X] onde X é o número do slide.`

  const messages = [
    ...conversationHistory.slice(-10),
    { role: 'user', content: message },
  ]

  console.log('Calling Anthropic API with model: claude-sonnet-4-5')
  
  try {
    const response = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages as any,
    })

    console.log('Anthropic API response received')
    
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
  } catch (error: any) {
    console.error('Anthropic API error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw error
  }
}
