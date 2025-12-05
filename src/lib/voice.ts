export async function generateSpeech(text: string, language: string): Promise<string> {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured')
      return ''
    }

    const voiceId = '21m00Tcm4TlvDq8ikWAM'
    
    console.log('Generating speech with ElevenLabs...')
    
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
    
    console.log('Audio generated successfully, length:', base64Audio.length)
    
    return `data:audio/mpeg;base64,${base64Audio}`
  } catch (error) {
    console.error('Speech generation error:', error)
    return ''
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    return ''
  } catch (error) {
    console.error('Transcription error:', error)
    return ''
  }
}
