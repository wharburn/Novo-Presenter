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
      <Header />
      <LanguageSelector language={language} onLanguageChange={setLanguage} />
      
      <div className="flex-1 overflow-hidden pb-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex gap-4 h-full relative">
            {!hasStarted && (
              <StartButton onClick={() => setHasStarted(true)} />
            )}
            
            <div className="flex-1 relative">
              <div className="absolute left-4 sm:left-8 top-2 z-10">
                <Avatar isSpeaking={isSpeaking} />
              </div>
              
              <PitchDeck 
                language={language} 
                currentSlide={currentSlide}
                onSlideChange={setCurrentSlide}
              />
            </div>
            
            {hasStarted && (
              <div className="w-96 flex-shrink-0">
                <ChatInterface 
                  language={language}
                  onSpeakingChange={setIsSpeaking}
                  currentSlide={currentSlide}
                  onSlideChange={setCurrentSlide}
                  hasIntroduced={hasIntroduced}
                  onIntroductionComplete={() => setHasIntroduced(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
