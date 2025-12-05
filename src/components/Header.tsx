'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

interface HeaderProps {
  onSkipToEnd?: () => void
}

export default function Header({ onSkipToEnd }: HeaderProps) {
  const pressTimer = useRef<NodeJS.Timeout | null>(null)
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const handlePressStart = () => {
    setIsHolding(true)
    setHoldProgress(0)

    // Update progress every 100ms
    progressInterval.current = setInterval(() => {
      setHoldProgress(prev => Math.min(prev + 1, 100))
    }, 100)

    // Trigger skip after 10 seconds
    pressTimer.current = setTimeout(() => {
      if (onSkipToEnd) {
        onSkipToEnd()
      }
      handlePressEnd()
    }, 10000)
  }

  const handlePressEnd = () => {
    setIsHolding(false)
    setHoldProgress(0)
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
  }

  return (
    <header className="flex-shrink-0 py-6">
      <div className="relative inline-block mx-auto">
        <Image
          src="/NovoPresent.png"
          alt="NoVo Present"
          width={400}
          height={80}
          className="mx-auto cursor-pointer select-none"
          style={{ width: '400px', height: 'auto' }}
          priority
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          draggable={false}
        />
        {isHolding && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5DADE2] to-[#3498DB] transition-all duration-100"
              style={{ width: `${holdProgress}%` }}
            />
          </div>
        )}
      </div>
    </header>
  )
}
