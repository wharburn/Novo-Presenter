'use client'

import { VoiceProvider, useVoice, VoiceReadyState } from '@humeai/voice-react'
import { useEffect, useState } from 'react'

interface VoiceChatProps {
  accessToken: string
  configId: string
  language: 'en' | 'pt'
  onMessage?: (text: string, role: 'user' | 'assistant') => void
  onStateChange?: (isActive: boolean) => void
}

function VoiceChatInner({
  accessToken,
  configId,
  language,
  onMessage,
  onStateChange
}: VoiceChatProps) {
  const { connect, disconnect, readyState, messages, isMuted, mute, unmute } = useVoice()
  const [isStarted, setIsStarted] = useState(false)

  const isConnected = readyState === VoiceReadyState.OPEN

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(isConnected)
  }, [isConnected, onStateChange])

  // Process messages from EVI
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
      if (lastMessage.type === 'user_message' && lastMessage.message?.content) {
        onMessage?.(lastMessage.message.content, 'user')
      } else if (lastMessage.type === 'assistant_message' && lastMessage.message?.content) {
        onMessage?.(lastMessage.message.content, 'assistant')
      }
    }
  }, [messages, onMessage])

  const handleStart = async () => {
    try {
      // Get the CLM endpoint URL for RAG-powered responses with language parameter
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || ''

      const clmUrl = baseUrl ? `${baseUrl}/api/hume-clm?language=${language}` : undefined

      console.log('[VoiceChat] Connecting with CLM URL:', clmUrl, 'language:', language)

      // System prompt based on language
      const systemPrompt = language === 'pt'
        ? 'Você é NoVo, uma assistente de IA brasileira. SEMPRE responda em português brasileiro. Nunca responda em inglês. Você acabou de apresentar um pitch deck para investidores e agora está em uma sessão de perguntas e respostas.'
        : 'You are NoVo, an AI assistant. You just finished presenting an investor pitch deck and are now in a Q&A session.'

      // Connect with auth token, config ID, custom language model, and language settings
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: configId,
        ...(clmUrl && {
          customLanguageModel: {
            url: clmUrl,
          }
        }),
        // Set session settings for language and system prompt
        sessionSettings: {
          language: language === 'pt' ? 'pt' : 'en',
          systemPrompt: systemPrompt,
        }
      })
      setIsStarted(true)
    } catch (error) {
      console.error('[VoiceChat] Connection error:', error)
    }
  }

  const handleEnd = () => {
    disconnect()
    setIsStarted(false)
  }

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="text-center text-gray-600 mb-4">
          {language === 'en'
            ? "Ready for a voice conversation? Click the button below to start talking with NoVo."
            : "Pronto para uma conversa por voz? Clique no botão abaixo para começar a falar com NoVo."}
        </div>
        <button
          type="button"
          onClick={handleStart}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5DADE2] to-[#3498DB] text-white rounded-full hover:from-[#4A9FD5] hover:to-[#2980B9] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          {language === 'en' ? 'Start Voice Chat' : 'Iniciar Chat por Voz'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Voice activity indicator */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
        isConnected ? 'bg-gradient-to-r from-[#5DADE2] to-[#3498DB] animate-pulse' : 'bg-gray-300'
      }`}>
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>

      <div className="text-center text-gray-600">
        {isConnected
          ? (language === 'en' ? "I'm listening... just speak naturally!" : "Estou ouvindo... fale naturalmente!")
          : (language === 'en' ? "Connecting..." : "Conectando...")}
      </div>

      {/* Control buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => isMuted ? unmute() : mute()}
          className={`p-3 rounded-full transition-all ${
            isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={handleEnd}
          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
          title="End conversation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Recent messages */}
      {messages.length > 0 && (
        <div className="w-full max-h-40 overflow-y-auto mt-4 space-y-2">
          {messages.slice(-4).map((msg, idx) => {
            if (msg.type !== 'user_message' && msg.type !== 'assistant_message') return null
            const isUser = msg.type === 'user_message'
            return (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm ${
                  isUser ? 'bg-[#5DADE2] text-white ml-8' : 'bg-gray-100 text-gray-800 mr-8'
                }`}
              >
                {msg.message?.content}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function VoiceChat(props: VoiceChatProps) {
  return (
    <VoiceProvider>
      <VoiceChatInner {...props} />
    </VoiceProvider>
  )
}

