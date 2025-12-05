'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseWakeWordOptions {
  wakeWord?: string
  onWakeWordDetected: () => void
  onTranscript: (transcript: string, isFinal: boolean) => void
  onListeningComplete: (fullTranscript: string) => void
  silenceTimeout?: number // ms of silence before considering speech complete
}

interface UseWakeWordReturn {
  isListening: boolean
  isAwake: boolean
  currentTranscript: string
  error: string | null
  startListening: () => Promise<void>
  stopListening: () => void
}

export function useWakeWord({
  wakeWord = 'novo',
  onWakeWordDetected,
  onTranscript,
  onListeningComplete,
  silenceTimeout = 2000,
}: UseWakeWordOptions): UseWakeWordReturn {
  const [isListening, setIsListening] = useState(false)
  const [isAwake, setIsAwake] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fullTranscriptRef = useRef<string>('')
  const isAwakeRef = useRef(false)

  // Store callbacks in refs to avoid dependency issues
  const onWakeWordDetectedRef = useRef(onWakeWordDetected)
  const onTranscriptRef = useRef(onTranscript)
  const onListeningCompleteRef = useRef(onListeningComplete)

  useEffect(() => {
    onWakeWordDetectedRef.current = onWakeWordDetected
    onTranscriptRef.current = onTranscript
    onListeningCompleteRef.current = onListeningComplete
  }, [onWakeWordDetected, onTranscript, onListeningComplete])

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer()
    if (isAwakeRef.current) {
      silenceTimerRef.current = setTimeout(() => {
        // User has stopped speaking
        const transcript = fullTranscriptRef.current.trim()
        console.log('[WakeWord] Silence detected, transcript:', transcript)
        if (transcript) {
          onListeningCompleteRef.current(transcript)
        }
        // Reset state
        setIsAwake(false)
        isAwakeRef.current = false
        fullTranscriptRef.current = ''
        setCurrentTranscript('')
      }, silenceTimeout)
    }
  }, [silenceTimeout, clearSilenceTimer])

  const stopListening = useCallback(() => {
    clearSilenceTimer()
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
    
    setIsListening(false)
    setIsAwake(false)
    isAwakeRef.current = false
    fullTranscriptRef.current = ''
    setCurrentTranscript('')
  }, [clearSilenceTimer])

  const startListening = useCallback(async () => {
    // Prevent multiple starts
    if (socketRef.current || isListening) {
      console.log('[WakeWord] Already listening, skipping start')
      return
    }

    try {
      setError(null)
      console.log('[WakeWord] Starting wake word detection...')

      // Get Deepgram token from our API
      const tokenRes = await fetch('/api/deepgram-token')
      if (!tokenRes.ok) {
        throw new Error('Failed to get Deepgram token')
      }
      const { token } = await tokenRes.json()
      console.log('[WakeWord] Got Deepgram token')

      // Get microphone access
      console.log('[WakeWord] Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      })
      streamRef.current = stream
      console.log('[WakeWord] Microphone access granted')

      // Connect to Deepgram WebSocket
      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?` +
        `model=nova-2&` +
        `language=en&` +
        `smart_format=true&` +
        `interim_results=true&` +
        `utterance_end_ms=1500&` +
        `vad_events=true&` +
        `endpointing=300`,
        ['token', token]
      )
      socketRef.current = socket

      socket.onopen = () => {
        console.log('[WakeWord] Deepgram WebSocket connected - listening for "novo"')
        setIsListening(true)

        // Start sending audio
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        })
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data)
          }
        }

        mediaRecorder.start(250) // Send audio every 250ms
      }

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === 'Results') {
          const transcript = data.channel?.alternatives?.[0]?.transcript || ''
          const isFinal = data.is_final

          if (transcript) {
            console.log('[WakeWord] Heard:', transcript, '(final:', isFinal, ')')
            const lowerTranscript = transcript.toLowerCase()

            // Check for wake word if not already awake
            if (!isAwakeRef.current && lowerTranscript.includes(wakeWord.toLowerCase())) {
              console.log('[WakeWord] *** WAKE WORD DETECTED! ***')
              isAwakeRef.current = true
              setIsAwake(true)
              onWakeWordDetectedRef.current()

              // Extract text after the wake word
              const wakeWordIndex = lowerTranscript.indexOf(wakeWord.toLowerCase())
              const afterWakeWord = transcript.substring(wakeWordIndex + wakeWord.length).trim()
              if (afterWakeWord) {
                fullTranscriptRef.current = afterWakeWord
                setCurrentTranscript(afterWakeWord)
              }
              resetSilenceTimer()
            } else if (isAwakeRef.current) {
              // Accumulate transcript after wake word
              if (isFinal) {
                fullTranscriptRef.current += ' ' + transcript
                setCurrentTranscript(fullTranscriptRef.current.trim())
              } else {
                setCurrentTranscript(fullTranscriptRef.current + ' ' + transcript)
              }
              onTranscriptRef.current(transcript, isFinal)
              resetSilenceTimer()
            }
          }
        }

        if (data.type === 'UtteranceEnd' && isAwakeRef.current) {
          console.log('[WakeWord] Utterance end detected')
          resetSilenceTimer()
        }
      }

      socket.onerror = (err) => {
        console.error('[WakeWord] WebSocket error:', err)
        setError('Connection error')
        stopListening()
      }

      socket.onclose = (event) => {
        console.log('[WakeWord] WebSocket closed, code:', event.code)
        setIsListening(false)
        socketRef.current = null
      }

    } catch (err) {
      console.error('[WakeWord] Failed to start:', err)
      setError(err instanceof Error ? err.message : 'Failed to start listening')
      stopListening()
    }
  }, [wakeWord, resetSilenceTimer, stopListening, isListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  return {
    isListening,
    isAwake,
    currentTranscript,
    error,
    startListening,
    stopListening,
  }
}

