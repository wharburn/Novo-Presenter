import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Deepgram API key not configured' },
      { status: 500 }
    )
  }

  // Return the API key as a token for WebSocket authentication
  // In production, you might want to create a temporary token via Deepgram's API
  return NextResponse.json({ token: apiKey })
}

