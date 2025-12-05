'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { slideNarrations } from '@/data/slideNarrations'

// Dynamic import for VoiceChat to avoid SSR issues
const VoiceChat = dynamic(() => import('./VoiceChat'), { ssr: false })

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type PresentationState = 'IDLE' | 'PRESENTING' | 'FINISHED' | 'VOICE_QA'

interface ChatInterfaceProps {
  language: 'en' | 'pt'
  onSpeakingChange: (speaking: boolean) => void
  currentSlide: number
  onSlideChange: (slide: number) => void
  hasIntroduced: boolean
  onIntroductionComplete: () => void
  hasStarted: boolean
  skipToEnd?: boolean
}

export default function ChatInterface({
  language,
  onSpeakingChange,
  currentSlide,
  onSlideChange,
  hasIntroduced,
  onIntroductionComplete,
  hasStarted,
  skipToEnd
}: ChatInterfaceProps) {
  const welcomeText = language === 'en'
    ? "Hello! I'm NoVo, the new personal assistant from Novocom Ai. Just press the start button when you are ready and we can begin to go through the presentation.\n\n\nIt should not take longer than 5 minutes. At the end, we can have a conversation and I'll answer any questions you have.\n\n\nWhenever you are ready…."
    : "Olá! Sou a NoVo, a nova assistente pessoal da Novocom Ai. Basta pressionar o botão iniciar quando estiver pronto e podemos começar a percorrer a apresentação.\n\n\nNão deve levar mais de 5 minutos. No final, podemos conversar e responderei qualquer pergunta que você tiver.\n\n\nQuando estiver pronto…."

  const greetingText = language === 'en'
    ? "Nice to meet you, I am Novo and I will be taking you through the presentation. At the end, we'll have a chance to chat.\n\n\nLets begin…"
    : "Prazer em conhecê-lo, eu sou a Novo e vou levá-lo através da apresentação. No final, teremos a chance de conversar.\n\n\nVamos começar…"

  const [messages, setMessages] = useState<Message[]>([])
  const [currentNarration, setCurrentNarration] = useState(welcomeText)
  const [isProcessing, setIsProcessing] = useState(false)
  const [presentationState, setPresentationState] = useState<PresentationState>('IDLE')
  const [highlightedSection, setHighlightedSection] = useState<number>(-1)
  const [humeAccessToken, setHumeAccessToken] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Persistent Audio element for mobile compatibility - created on first user interaction
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioInitialized = useRef(false)
  const hasPlayedIntro = useRef(false)
  const hasPlayedGreeting = useRef(false)
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize persistent audio element (called on user interaction)
  const initializeAudio = useCallback(() => {
    if (!audioInitialized.current) {
      console.log('[Audio] Initializing persistent Audio element for mobile')
      const audio = new Audio()
      // Set playsInline attribute for iOS
      audio.setAttribute('playsinline', 'true')
      audio.setAttribute('webkit-playsinline', 'true')
      audioRef.current = audio
      // Play silent audio to unlock on mobile
      audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
      audio.play().then(() => {
        console.log('[Audio] Audio context unlocked')
      }).catch(() => {
        console.log('[Audio] Silent play failed, will retry on actual audio')
      })
      audioInitialized.current = true
    }
  }, [])

  // Hume EVI config ID from env
  const humeConfigId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || ''

  // Q&A end message - spoken by NoVo
  const qaEndMessage = language === 'en'
    ? "That's the end of the presentation! Click the button below to start a voice conversation with me."
    : "Esse é o fim da apresentação! Clique no botão abaixo para iniciar uma conversa por voz comigo."

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
        // Ensure audio element exists (reuse persistent element for mobile)
        if (!audioRef.current) {
          const audio = new Audio()
          audio.setAttribute('playsinline', 'true')
          audio.setAttribute('webkit-playsinline', 'true')
          audioRef.current = audio
        }

        const audio = audioRef.current
        audio.pause()
        audio.currentTime = 0

        console.log('Playing audio for slide:', slideNumber)

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
            onSpeakingChange(false)  // Stop avatar animation
            setPresentationState('FINISHED')
            setCurrentNarration(qaEndMessage)
          }
        }
        audio.onerror = (e) => {
          console.error('Audio error:', e)
          onSpeakingChange(false)
        }

        // Set source and play
        audio.src = data.audioUrl
        onSpeakingChange(true)
        audio.play().catch((err) => {
          console.error('Audio play failed:', err)
          onSpeakingChange(false)
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

      // Initialize persistent audio element on first user interaction (for mobile)
      initializeAudio()

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
            // Ensure audio element exists (reuse persistent element for mobile)
            if (!audioRef.current) {
              const audio = new Audio()
              audio.setAttribute('playsinline', 'true')
              audio.setAttribute('webkit-playsinline', 'true')
              audioRef.current = audio
            }

            const audio = audioRef.current
            audio.pause()
            audio.currentTime = 0

            audio.onended = () => {
              onSpeakingChange(false)

              // Start presenting slide 1 after greeting
              setTimeout(() => {
                presentNextSlide(1)
              }, 200)
            }

            audio.onerror = () => {
              onSpeakingChange(false)
            }

            // Set source and play
            audio.src = data.audioUrl
            onSpeakingChange(true)
            audio.play().catch(() => {
              onSpeakingChange(false)
            })
          }
        })
        .catch(err => console.error('Greeting error:', err))
    }
  }, [hasStarted, greetingText, language, onSpeakingChange, initializeAudio])

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

  // Handle skip to end (long press on logo)
  useEffect(() => {
    if (skipToEnd && presentationState !== 'FINISHED' && presentationState !== 'VOICE_QA') {
      console.log('Skipping to end of presentation...')

      // Cancel any pending auto-advance
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
        autoAdvanceTimerRef.current = null
      }

      // Stop any playing audio immediately
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
      }

      // Silence the avatar
      onSpeakingChange(false)
      setIsProcessing(false)
      setHighlightedSection(-1)

      // Set to last slide and finished state
      onSlideChange(11)
      setPresentationState('FINISHED')
      const skipMessage = language === 'en'
        ? "Presentation skipped. Ready for voice Q&A!"
        : "Apresentação pulada. Pronto para perguntas por voz!"
      setCurrentNarration(skipMessage)
    }
  }, [skipToEnd, presentationState, language, onSpeakingChange, onSlideChange])

  // Fetch Hume access token when presentation finishes
  useEffect(() => {
    if (presentationState === 'FINISHED' && !humeAccessToken) {
      console.log('[HumeEVI] Fetching access token for voice Q&A...')
      fetch('/api/hume-token')
        .then(res => res.json())
        .then(data => {
          if (data.accessToken) {
            setHumeAccessToken(data.accessToken)
            console.log('[HumeEVI] Access token received')
          }
        })
        .catch(err => console.error('[HumeEVI] Token error:', err))
    }
  }, [presentationState, humeAccessToken])

  // Handle messages from Hume EVI
  const handleVoiceMessage = useCallback((text: string, role: 'user' | 'assistant') => {
    setMessages(prev => [...prev, { role, content: text }])
    if (role === 'assistant') {
      setCurrentNarration(text)
    }
  }, [])

  // Handle voice chat state changes
  const handleVoiceStateChange = useCallback((isActive: boolean) => {
    if (isActive) {
      setPresentationState('VOICE_QA')
    }
  }, [])



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

      {/* Voice Chat Section - shows after presentation ends */}
      {(presentationState === 'FINISHED' || presentationState === 'VOICE_QA') && humeAccessToken && humeConfigId && (
        <div className="border-t border-gray-300 bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
          <VoiceChat
            accessToken={humeAccessToken}
            configId={humeConfigId}
            language={language}
            onMessage={handleVoiceMessage}
            onStateChange={handleVoiceStateChange}
          />
        </div>
      )}

      {/* Loading indicator for voice chat */}
      {presentationState === 'FINISHED' && !humeAccessToken && (
        <div className="p-4 border-t border-gray-300 bg-white rounded-b-lg text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-[#5DADE2] border-t-transparent rounded-full"></div>
            {language === 'en' ? 'Preparing voice chat...' : 'Preparando chat de voz...'}
          </div>
        </div>
      )}

      {/* Placeholder during presentation */}
      {presentationState !== 'FINISHED' && presentationState !== 'VOICE_QA' && (
        <div className="p-3 border-t border-gray-300 bg-white rounded-b-lg">
          <div className="text-center text-gray-400 text-sm py-2">
            {language === 'en'
              ? 'Voice Q&A will be available at the end of the presentation'
              : 'Perguntas por voz estarão disponíveis no final da apresentação'}
          </div>
        </div>
      )}
    </div>
  )
}
