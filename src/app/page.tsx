'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Avatar from '@/components/Avatar'
import PitchDeck from '@/components/PitchDeck'
import ChatInterface from '@/components/ChatInterface'
import LanguageSelector from '@/components/LanguageSelector'
import StartButton from '@/components/StartButton'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'pt'>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasIntroduced, setHasIntroduced] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [audioPrepared, setAudioPrepared] = useState(false)
  const [skipToEnd, setSkipToEnd] = useState(false)

  const handleSkipToEnd = () => {
    setHasStarted(true)
    setSkipToEnd(true)
  }

  useEffect(() => {
    const handleMouseMove = () => {
      if (!audioPrepared && !hasStarted) {
        setAudioPrepared(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [audioPrepared, hasStarted])

  return (
    <main className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="hidden lg:flex flex-1 pt-6">
            {!hasStarted ? (
              <StartButton onClick={() => setHasStarted(true)} />
            ) : (
              <div className="z-[9999]">
                <Avatar isSpeaking={isSpeaking} hasStarted={hasStarted} />
              </div>
            )}
          </div>
          <Header onSkipToEnd={handleSkipToEnd} />
          <div className="hidden lg:flex flex-1 justify-end pt-6">
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
        </div>

        <div className="flex lg:hidden justify-center gap-2 -mt-5">
          {!hasStarted ? (
            <StartButton onClick={() => setHasStarted(true)} />
          ) : (
            <div className="z-[9999]">
              <Avatar isSpeaking={isSpeaking} hasStarted={hasStarted} />
            </div>
          )}
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto pb-4">
          <div className="flex flex-col lg:flex-row gap-4 h-full px-4 sm:px-6 lg:px-8">
            <div className="flex-1 relative min-h-0 pl-0">
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
                hasStarted={hasStarted}
                skipToEnd={skipToEnd}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
