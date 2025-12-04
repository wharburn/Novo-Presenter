'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import PitchDeck from '@/components/PitchDeck'
import ChatInterface from '@/components/ChatInterface'
import LanguageSelector from '@/components/LanguageSelector'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'pt'>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasIntroduced, setHasIntroduced] = useState(false)

  return (
    <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
      <Header />
      <LanguageSelector language={language} onLanguageChange={setLanguage} />
      
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 relative">
          <div className="absolute left-4 sm:left-8 top-2 z-10">
            <Avatar isSpeaking={isSpeaking} />
          </div>
          
          <PitchDeck 
            language={language} 
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
          />
          
          <ChatInterface 
            language={language}
            onSpeakingChange={setIsSpeaking}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            hasIntroduced={hasIntroduced}
            onIntroductionComplete={() => setHasIntroduced(true)}
          />
        </div>
      </div>
    </main>
  )
}
