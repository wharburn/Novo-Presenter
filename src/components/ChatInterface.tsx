'use client'

import { useState, useRef, useEffect } from 'react'
import { slideNarrations } from '@/data/slideNarrations'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type PresentationState = 'IDLE' | 'PRESENTING' | 'FINISHED' | 'PROCESSING'

interface ChatInterfaceProps {
  language: 'en' | 'pt'
  onSpeakingChange: (speaking: boolean) => void
  currentSlide: number
  onSlideChange: (slide: number) => void
  hasIntroduced: boolean
  onIntroductionComplete: () => void
  hasStarted: boolean
}

export default function ChatInterface({
  language,
  onSpeakingChange,
  currentSlide,
  onSlideChange,
  hasIntroduced,
  onIntroductionComplete,
  hasStarted
}: ChatInterfaceProps) {
  const welcomeText = language === 'en'
    ? "Hello! I'm NoVo, the new personal assistant from Novocom Ai. Just press the start button when you are ready and we can begin to go through the presentation.\n\n\nIt should not take longer than 5 minutes. At the end, you can ask me any questions you have and I will try my best to answer them for you.\n\n\nWhenever you are ready…."
    : "Olá! Sou a NoVo, a nova assistente pessoal da Novocom Ai. Basta pressionar o botão iniciar quando estiver pronto e podemos começar a percorrer a apresentação.\n\n\nNão deve levar mais de 5 minutos. No final, você pode me fazer qualquer pergunta que tiver e farei o meu melhor para respondê-las.\n\n\nQuando estiver pronto…."

  const greetingText = language === 'en'
    ? "Nice to meet you, I am Novo and I will be taking you through the presentation. Feel free to ask me any questions at the end.\n\n\nLets begin…"
    : "Prazer em conhecê-lo, eu sou a Novo e vou levá-lo através da apresentação. Sinta-se à vontade para me fazer perguntas no final.\n\n\nVamos começar…"
  
  const [messages, setMessages] = useState<Message[]>([])
  const [currentNarration, setCurrentNarration] = useState(welcomeText)
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [presentationState, setPresentationState] = useState<PresentationState>('IDLE')
  const [highlightedSection, setHighlightedSection] = useState<number>(-1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedIntro = useRef(false)
  const hasPlayedGreeting = useRef(false)
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Q&A end message
  const qaEndMessage = language === 'en'
    ? "That's the end of the presentation! Do you have any questions? Feel free to type them below and I'll do my best to answer."
    : "Esse é o fim da apresentação! Você tem alguma pergunta? Sinta-se à vontade para digitá-las abaixo e farei o meu melhor para responder."

  const presentNextSlide = async (slideNumber: number) => {
    console.log('presentNextSlide called with:', slideNumber, 'isProcessing:', isProcessing)
    if (slideNumber >= 11) {
      console.log('Reached end of presentation')
      return
    }

    if (isProcessing) {
      console.log('Already processing, skipping')
      return
    }

    console.log('Changing slide display to:', slideNumber)
    onSlideChange(slideNumber)

    // Get pre-loaded narration for this slide
    const narrations = slideNarrations[language]
    const narration = narrations.find(n => n.slide === slideNumber)

    if (!narration) {
      console.error('No narration found for slide:', slideNumber)
      return
    }

    // Immediately show the display text (no API call needed!)
    setCurrentNarration(narration.displayText)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: narration.displayText
    }])

    // Count content sections for highlighting (headings + bullet points)
    const sections = narration.displayText.split('\n').filter(line => {
      const trimmed = line.trim()
      return trimmed && (
        trimmed.match(/^\*\*[^*]+\*\*/) ||  // Headings
        trimmed.startsWith('•') ||
        trimmed.startsWith('-') ||
        (trimmed.length > 0 && !trimmed.match(/^\*\*/))  // Regular content
      )
    })
    setHighlightedSection(0) // Start with first section

    setIsProcessing(true)
    console.log('Starting to present slide:', slideNumber)

    try {
      // Only call API for TTS (text-to-speech) using the spoken text
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: narration.spokenText,
          language,
          currentSlide: slideNumber,
          textOnly: true, // Just generate TTS, no AI processing
        }),
      })

      const data = await response.json()
      console.log('Received TTS audio for slide', slideNumber)

      if (data.audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }

        console.log('Playing audio for slide:', slideNumber)
        onSpeakingChange(true)
        const audio = new Audio(data.audioUrl)
        audioRef.current = audio

        // Track audio progress for highlighting
        const numSections = sections.length
        audio.ontimeupdate = () => {
          if (audio.duration > 0) {
            const progress = audio.currentTime / audio.duration
            const currentSection = Math.min(
              Math.floor(progress * numSections),
              numSections - 1
            )
            setHighlightedSection(currentSection)
          }
        }

        audio.onended = () => {
          console.log('Audio ended for slide:', slideNumber)
          onSpeakingChange(false)
          audioRef.current = null
          setHighlightedSection(-1) // Reset highlighting

          if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current)
          }

          const nextSlide = slideNumber + 1
          console.log('Will advance to slide:', nextSlide)
          if (nextSlide < 11) {
            autoAdvanceTimerRef.current = setTimeout(() => {
              console.log('Auto-advancing to slide:', nextSlide)
              presentNextSlide(nextSlide)
            }, 200)
          } else {
            // Presentation finished - show Q&A message
            console.log('Presentation complete - entering Q&A mode')
            setPresentationState('FINISHED')
            setCurrentNarration(qaEndMessage)
          }
        }
        audio.onerror = (e) => {
          console.error('Audio error:', e)
          onSpeakingChange(false)
          audioRef.current = null
        }
        audio.play().catch((err) => {
          console.error('Audio play failed:', err)
          onSpeakingChange(false)
          audioRef.current = null
        })
      } else {
        console.log('No audio URL received for slide:', slideNumber)
      }
    } catch (error) {
      console.error('Error presenting slide:', error)
    } finally {
      setIsProcessing(false)
      console.log('Finished processing slide:', slideNumber)
    }
  }

  useEffect(() => {
    if (!hasIntroduced && !hasPlayedIntro.current) {
      hasPlayedIntro.current = true
      onIntroductionComplete()
      
      // Welcome text is already displayed from initial state
      // No need to play audio or change text
    }
  }, [hasIntroduced, onIntroductionComplete])

  useEffect(() => {
    if (hasStarted && !hasPlayedGreeting.current) {
      hasPlayedGreeting.current = true
      setCurrentNarration(greetingText)
      
      // Play greeting audio - textOnly mode to avoid AI generation
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: greetingText,
          language,
          currentSlide: 0,
          textOnly: true,
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.audioUrl) {
            onSpeakingChange(true)
            const audio = new Audio(data.audioUrl)
            audioRef.current = audio
            
            audio.onended = () => {
              onSpeakingChange(false)
              audioRef.current = null
              
              // Start presenting slide 1 after greeting
              setTimeout(() => {
                presentNextSlide(1)
              }, 200)
            }
            
            audio.onerror = () => {
              onSpeakingChange(false)
              audioRef.current = null
            }
            
            audio.play().catch(() => {
              onSpeakingChange(false)
              audioRef.current = null
            })
          }
        })
        .catch(err => console.error('Greeting error:', err))
    }
  }, [hasStarted, greetingText, language, onSpeakingChange])

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsProcessing(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language,
          currentSlide,
        }),
      })

      const data = await response.json()
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message 
      }])

      if (data.nextSlide !== undefined) {
        onSlideChange(data.nextSlide)
      }

      if (data.audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        
        onSpeakingChange(true)
        const audio = new Audio(data.audioUrl)
        audioRef.current = audio
        
        audio.onended = () => {
          onSpeakingChange(false)
          audioRef.current = null
          
          if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current)
          }
          if (data.nextSlide !== undefined && data.nextSlide < 10) {
            autoAdvanceTimerRef.current = setTimeout(() => {
              onSlideChange(data.nextSlide + 1)
            }, 3000)
          }
        }
        audio.onerror = () => {
          onSpeakingChange(false)
          audioRef.current = null
        }
        audio.play().catch(() => {
          onSpeakingChange(false)
          audioRef.current = null
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: language === 'en' 
          ? 'Sorry, I encountered an error. Please try again.' 
          : 'Desculpe, encontrei um erro. Por favor, tente novamente.'
      }])
    } finally {
      setIsProcessing(false)
    }
  }



  const formatTextWithBullets = (text: string, currentHighlight: number = -1) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let sectionIndex = 0  // Track which content section we're on

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) {
        elements.push(<div key={idx} className="h-4"></div>)
        return
      }

      // Determine if this is a content section (for highlighting)
      const isContentSection = trimmedLine.match(/^\*\*[^*]+\*\*/) ||
        trimmedLine.startsWith('•') ||
        trimmedLine.startsWith('-') ||
        trimmedLine.length > 0

      const isHighlighted = isContentSection && sectionIndex === currentHighlight
      const highlightClass = isHighlighted
        ? 'bg-yellow-100 border-l-4 border-yellow-400 pl-2 -ml-2 transition-all duration-300'
        : 'transition-all duration-300'

      // Check if line is just **text** (main heading)
      const mainHeadingMatch = trimmedLine.match(/^\*\*([^*]+)\*\*$/)
      if (mainHeadingMatch) {
        elements.push(
          <div key={idx} className={`font-bold text-base mb-2 mt-3 first:mt-0 ${highlightClass}`}>
            {mainHeadingMatch[1]}
          </div>
        )
        sectionIndex++
        return
      }

      // Check if line has **text**: pattern (subheading with content)
      const subheadingMatch = trimmedLine.match(/^\*\*([^*]+)\*\*:\s*(.+)$/)
      if (subheadingMatch) {
        const subheading = subheadingMatch[1]
        const content = subheadingMatch[2]
        elements.push(
          <div key={idx} className={`mb-2 ${highlightClass}`}>
            <div className="font-semibold text-sm">{subheading}</div>
            <div className="text-sm ml-4">{content}</div>
          </div>
        )
        sectionIndex++
        return
      }

      // Check if line starts with bullet point
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        const bulletText = trimmedLine.substring(1).trim()
        elements.push(
          <div key={idx} className={`flex items-start gap-2 my-1 ml-2 ${highlightClass}`}>
            <span className="text-[#5DADE2] font-bold mt-0.5">•</span>
            <span className="text-sm">{bulletText}</span>
          </div>
        )
        sectionIndex++
        return
      }

      // Regular text
      elements.push(<div key={idx} className={`text-sm my-1 ${highlightClass}`}>{trimmedLine}</div>)
      sectionIndex++
    })

    return elements
  }

  return (
    <div className="h-full flex flex-col bg-gray-200 rounded-lg">
      <div className="bg-gray-300 p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-center text-lg font-semibold text-gray-800 flex-1">
            {language === 'en' ? 'Text Output' : 'Texto resumido'}
          </h3>
          {/* Presentation state indicator */}
          {presentationState === 'FINISHED' && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {language === 'en' ? 'Q&A Mode' : 'Modo Q&A'}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {currentNarration ? (
        <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
          {formatTextWithBullets(currentNarration, highlightedSection)}
        </div>
        ) : (
          <p className="text-gray-400 text-center text-sm">
            {language === 'en'
              ? 'Click Start to begin the presentation'
              : 'Clique em Iniciar para começar a apresentação'}
          </p>
        )}

        {messages.filter(m => m.role === 'user').length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">
              {language === 'en' ? 'Your Questions:' : 'Suas Perguntas:'}
            </p>
            {messages.filter(m => m.role === 'user').slice(-3).map((msg, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 rounded bg-[#5DADE2] text-white text-sm"
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-300 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              presentationState === 'FINISHED'
                ? (language === 'en' ? 'Ask me any questions...' : 'Me faça qualquer pergunta...')
                : (language === 'en' ? 'Questions will be answered at the end' : 'As perguntas serão respondidas no final')
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2] text-sm"
            disabled={isProcessing || presentationState === 'PRESENTING'}
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim() || presentationState === 'PRESENTING'}
            className="px-4 py-2 bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A9FD5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm whitespace-nowrap"
          >
            {language === 'en' ? 'Send' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
