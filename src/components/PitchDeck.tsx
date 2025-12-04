'use client'

import { useState, useEffect } from 'react'

interface PitchDeckProps {
  language: 'en' | 'pt'
  currentSlide: number
  onSlideChange: (slide: number) => void
}

export default function PitchDeck({ language, currentSlide, onSlideChange }: PitchDeckProps) {
  const [slides, setSlides] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSlides = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/slides?language=${language}`)
        const data = await response.json()
        setSlides(data.slides || [])
      } catch (error) {
        console.error('Error loading slides:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSlides()
  }, [language])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-96 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-3 sm:mb-4">
      <div className="bg-white rounded-lg shadow-xl p-2 sm:p-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {slides[currentSlide] ? (
            <img 
              src={slides[currentSlide]} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Slide {currentSlide + 1}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2 sm:mt-4 gap-2">
          <button
            onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-3 sm:px-6 py-1.5 sm:py-2 bg-[#5DADE2] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4A9FD5] transition-colors font-medium text-xs sm:text-base"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          
          <span className="text-gray-600 font-medium text-xs sm:text-base">
            {currentSlide + 1} / {slides.length || 1}
          </span>
          
          <button
            onClick={() => onSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide >= slides.length - 1}
            className="px-3 sm:px-6 py-1.5 sm:py-2 bg-[#5DADE2] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4A9FD5] transition-colors font-medium text-xs sm:text-base"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
