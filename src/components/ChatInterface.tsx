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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedIntro = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!hasIntroduced && !hasPlayedIntro.current) {
      hasPlayedIntro.current = true
      
      const introduction = language === 'en'
        ? "Hello! I'm NoVo, your AI presentation assistant. I'll be guiding you through the NoVo Travel Assistant pitch deck today. I'll walk you through our innovative travel solution, explain our business model, and answer any questions you have about our company and investment opportunity. Let's begin with our first slide!"
        : "Olá! Sou a NoVo, sua assistente de apresentação de IA. Vou guiá-lo através do pitch deck do NoVo Travel Assistant hoje. Vou mostrar nossa solução inovadora de viagem, explicar nosso modelo de negócio e responder a quaisquer perguntas que você tenha sobre nossa empresa e oportunidade de investimento. Vamos começar com nosso primeiro slide!"
      
      setMessages([{ role: 'assistant', content: introduction }])
      onIntroductionComplete()
      
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'introduce_and_start',
          language,
          currentSlide: 0,
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Audio response:', data)
          if (data.audioUrl) {
            console.log('Playing audio...')
            
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current = null
            }
            
            onSpeakingChange(true)
            const audio = new Audio(data.audioUrl)
            audioRef.current = audio
            
            audio.onended = () => {
              console.log('Audio ended')
              onSpeakingChange(false)
              audioRef.current = null
            }
            audio.onerror = (e) => {
              console.error('Audio playback error:', e)
              onSpeakingChange(false)
              audioRef.current = null
            }
            audio.play().catch(err => {
              console.error('Audio play failed:', err)
              onSpeakingChange(false)
              audioRef.current = null
            })
          } else {
            console.log('No audio URL in response')
          }
        })
        .catch(err => console.error('Introduction audio error:', err))
    }
  }, [hasIntroduced, language, onIntroductionComplete, onSpeakingChange])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

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

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
      <div className="bg-white rounded-lg shadow-xl p-2 sm:p-4">
        <div className="h-20 sm:h-28 overflow-y-auto mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center text-xs sm:text-sm">
              {language === 'en' 
                ? 'Ask me anything about NoVo Travel Assistant!' 
                : 'Pergunte-me qualquer coisa sobre o NoVo Travel Assistant!'}
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-1.5 sm:mb-2 p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm ${
                msg.role === 'user'
                  ? 'bg-[#5DADE2] text-white ml-auto max-w-[85%]'
                  : 'bg-gray-200 text-gray-800 mr-auto max-w-[85%]'
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'en' ? 'Type your question...' : 'Digite sua pergunta...'}
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2] text-xs sm:text-sm"
            disabled={isProcessing}
          />
          
          <button
            onClick={handleVoiceInput}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-base sm:text-lg ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            🎤
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim()}
            className="px-3 sm:px-6 py-1.5 sm:py-2 bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A9FD5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-xs sm:text-sm"
          >
            {language === 'en' ? 'Send' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
