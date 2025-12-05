'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  language: 'en' | 'pt'
  onSpeakingChange: (speaking: boolean) => void
  currentSlide: number
  onSlideChange: (slide: number) => void
  hasIntroduced: boolean
  onIntroductionComplete: () => void
}

export default function ChatInterface({ 
  language, 
  onSpeakingChange, 
  currentSlide,
  onSlideChange,
  hasIntroduced,
  onIntroductionComplete
}: ChatInterfaceProps) {
  const welcomeText = language === 'en'
    ? "Hello! I'm NoVo, the new personal assistant from Novocom Ai. Just press the start button when you are ready and we can begin to go through the presentation. It should not take longer than 5 minutes. You also can stop me and ask any questions you have at any time and I will try my best to answer them for you.\n\nWhenever you are ready…."
    : "Olá! Sou a NoVo, a nova assistente pessoal da Novocom Ai. Basta pressionar o botão iniciar quando estiver pronto e podemos começar a percorrer a apresentação. Não deve levar mais de 5 minutos. Você também pode me interromper e fazer qualquer pergunta que tiver a qualquer momento e farei o meu melhor para respondê-las.\n\nQuando estiver pronto…."
  
  const [messages, setMessages] = useState<Message[]>([])
  const [currentNarration, setCurrentNarration] = useState(welcomeText)
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedIntro = useRef(false)
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    
    setIsProcessing(true)
    console.log('Starting to present slide:', slideNumber)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'continue',
          language,
          currentSlide: slideNumber,
        }),
      })

      const data = await response.json()
      console.log('Received response for slide', slideNumber, ':', data)
      
      setCurrentNarration(data.message)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message 
      }])

      if (data.audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
        
        console.log('Playing audio for slide:', slideNumber)
        onSpeakingChange(true)
        const audio = new Audio(data.audioUrl)
        audioRef.current = audio
        
        audio.onended = () => {
          console.log('Audio ended for slide:', slideNumber)
          onSpeakingChange(false)
          audioRef.current = null
          
          if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current)
          }
          
          const nextSlide = data.nextSlide !== undefined ? data.nextSlide : slideNumber + 1
          console.log('Will advance to slide:', nextSlide, 'immediately')
          if (nextSlide < 11) {
            autoAdvanceTimerRef.current = setTimeout(() => {
              console.log('Auto-advancing to slide:', nextSlide)
              presentNextSlide(nextSlide)
            }, 200)
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

  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false)
      return
    }

    setIsRecording(true)
  }

  const formatTextWithBullets = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    
    lines.forEach((line, idx) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      // Check if line is just **text** (main heading)
      const mainHeadingMatch = trimmedLine.match(/^\*\*([^*]+)\*\*$/)
      if (mainHeadingMatch) {
        elements.push(
          <div key={idx} className="font-bold text-base mb-2 mt-3 first:mt-0">
            {mainHeadingMatch[1]}
          </div>
        )
        return
      }
      
      // Check if line has **text**: pattern (subheading with content)
      const subheadingMatch = trimmedLine.match(/^\*\*([^*]+)\*\*:\s*(.+)$/)
      if (subheadingMatch) {
        const subheading = subheadingMatch[1]
        const content = subheadingMatch[2]
        elements.push(
          <div key={idx} className="mb-2">
            <div className="font-semibold text-sm">{subheading}</div>
            <div className="text-sm ml-4">{content}</div>
          </div>
        )
        return
      }
      
      // Check if line starts with bullet point
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        const bulletText = trimmedLine.substring(1).trim()
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1 ml-2">
            <span className="text-[#5DADE2] font-bold mt-0.5">•</span>
            <span className="text-sm">{bulletText}</span>
          </div>
        )
        return
      }
      
      // Regular text
      elements.push(<div key={idx} className="text-sm my-1">{trimmedLine}</div>)
    })
    
    return elements
  }

  return (
    <div className="h-full flex flex-col bg-gray-200 rounded-lg">
      <div className="bg-gray-300 p-3 rounded-t-lg">
        <h3 className="text-center text-lg font-semibold text-gray-800">
          {language === 'en' ? 'Summarised text' : 'Texto resumido'}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {currentNarration ? (
          <div className="text-gray-800 text-base leading-relaxed">
            {formatTextWithBullets(currentNarration)}
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
            <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Your Questions:</p>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'en' ? 'Type your question...' : 'Digite sua pergunta...'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2] text-sm"
            disabled={isProcessing}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim()}
            className="px-4 py-2 bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A9FD5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm whitespace-nowrap"
          >
            {language === 'en' ? 'Send' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
