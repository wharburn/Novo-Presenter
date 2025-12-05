'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import PitchDeck from '@/components/PitchDeck'
import ChatInterface from '@/components/ChatInterface'
import LanguageSelector from '@/components/LanguageSelector'
import StartButton from '@/components/StartButton'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'pt'>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasIntroduced, setHasIntroduced] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  return (
    <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          {!hasStarted && (
            <StartButton onClick={() => setHasStarted(true)} />
          )}
        </div>
        <Header />
        <div className="flex-1 flex justify-end">
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 h-full px-4 sm:px-6 lg:px-8">
            <div className="flex-1 relative min-h-0 pl-0">
              <div className="absolute left-0 top-2 z-10">
                <Avatar isSpeaking={isSpeaking} />
              </div>
              
              <PitchDeck 
                language={language} 
                currentSlide={currentSlide}
                onSlideChange={setCurrentSlide}
              />
            </div>
            
            <div className="w-full lg:w-96 flex-shrink-0 h-64 lg:h-full pr-0">
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
        </div>
      </div>
    </main>
  )
}
