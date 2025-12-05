// Re-export the official Hume React SDK hooks for use in the app
// The ChatInterface will use VoiceProvider and useVoice directly

export { VoiceProvider, useVoice, VoiceReadyState } from '@humeai/voice-react'
export type { useVoice as UseVoiceHook } from '@humeai/voice-react'

