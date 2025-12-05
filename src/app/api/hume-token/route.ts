import { NextResponse } from 'next/server'
import { fetchAccessToken } from 'hume'

export async function GET() {
  try {
    const apiKey = process.env.HUME_API_KEY
    const secretKey = process.env.HUME_SECRET_KEY

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        { error: 'Hume API credentials not configured' },
        { status: 500 }
      )
    }

    // Use Hume SDK to fetch access token
    const accessToken = await fetchAccessToken({
      apiKey: apiKey,
      secretKey: secretKey,
    })

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to get Hume access token' },
        { status: 500 }
      )
    }

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error('Hume token error:', error)
    return NextResponse.json(
      { error: 'Failed to get Hume access token' },
      { status: 500 }
    )
  }
}

