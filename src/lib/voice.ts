// TTS Provider type
export type TTSProvider = 'elevenlabs' | 'hume'

// Get the configured TTS provider (default to ElevenLabs)
export function getTTSProvider(): TTSProvider {
  const provider = process.env.TTS_PROVIDER?.toLowerCase()
  if (provider === 'hume') return 'hume'
  return 'elevenlabs'
}

// Generate speech using ElevenLabs
async function generateSpeechElevenLabs(text: string): Promise<string> {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key not configured')
    return ''
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'
  console.log('Generating speech with ElevenLabs, voice:', voiceId)

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('ElevenLabs API error:', response.status, errorText)
    return ''
  }

  const audioBuffer = await response.arrayBuffer()
  const base64Audio = Buffer.from(audioBuffer).toString('base64')
  console.log('ElevenLabs audio generated, length:', base64Audio.length)

  return `data:audio/mpeg;base64,${base64Audio}`
}

// Generate speech using Hume AI Octave TTS
async function generateSpeechHume(text: string, description?: string): Promise<string> {
  if (!process.env.HUME_API_KEY) {
    console.error('Hume API key not configured')
    return ''
  }

  console.log('Generating speech with Hume AI Octave TTS')

  // Build the request body
  const requestBody: {
    utterances: Array<{
      text: string
      voice?: { name: string }
      description?: string
    }>
    format: { type: string }
    num_generations: number
  } = {
    utterances: [
      {
        text,
        // Use a predefined voice for instant mode (lower latency)
        voice: { name: process.env.HUME_VOICE_NAME || 'KORA' },
      }
    ],
    format: { type: 'mp3' },
    num_generations: 1
  }

  // Add description for more emotive speech if provided
  if (description) {
    requestBody.utterances[0].description = description
  }

  const response = await fetch('https://api.hume.ai/v0/tts', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': process.env.HUME_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Hume AI API error:', response.status, errorText)
    return ''
  }

  const data = await response.json()

  if (!data.generations || data.generations.length === 0) {
    console.error('Hume AI returned no generations')
    return ''
  }

  const base64Audio = data.generations[0].audio
  console.log('Hume AI audio generated, duration:', data.generations[0].duration, 's')

  return `data:audio/mpeg;base64,${base64Audio}`
}

// Main speech generation function - routes to configured provider
export async function generateSpeech(
  text: string,
  language: string,
  options?: {
    provider?: TTSProvider
    description?: string  // For Hume AI emotive voice
  }
): Promise<string> {
  try {
    const provider = options?.provider || getTTSProvider()

    if (provider === 'hume') {
      return await generateSpeechHume(text, options?.description)
    }

    return await generateSpeechElevenLabs(text)
  } catch (error) {
    console.error('Speech generation error:', error)
    return ''
  }
}

// Generate emotive speech specifically using Hume AI
// This can be used for Q&A responses where emotion matters
export async function generateEmotiveSpeech(
  text: string,
  emotion?: string
): Promise<string> {
  // Build a description based on the emotion
  const description = emotion
    ? `Speak with ${emotion} emotion, warm and engaging tone`
    : 'Warm, friendly, and engaging professional voice'

  return generateSpeech(text, 'en', {
    provider: 'hume',
    description
  })
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    return ''
  } catch (error) {
    console.error('Transcription error:', error)
    return ''
  }
}
