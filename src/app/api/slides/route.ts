import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'en'

    const slidesDir = path.join(process.cwd(), 'public', 'slides', language)
    
    if (!fs.existsSync(slidesDir)) {
      return NextResponse.json({ slides: [] })
    }

    const files = fs.readdirSync(slidesDir)
      .filter(file => file.match(/\.(png|jpg|jpeg|webp)$/i))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0')
        const numB = parseInt(b.match(/\d+/)?.[0] || '0')
        return numA - numB
      })

    const slides = files.map(file => `/slides/${language}/${file}`)

    return NextResponse.json({ slides })
  } catch (error) {
    console.error('Slides API error:', error)
    return NextResponse.json({ slides: [] })
  }
}
