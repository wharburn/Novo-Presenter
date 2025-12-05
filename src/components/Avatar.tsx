import Image from 'next/image'

interface AvatarProps {
  isSpeaking: boolean
  hasStarted?: boolean
}

export default function Avatar({ isSpeaking, hasStarted = false }: AvatarProps) {
  return (
    <div className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-xl border-4 border-white ${hasStarted ? 'animate-avatar-rise' : ''}`}>
      <Image
        src={isSpeaking ? '/avatar_speak.gif' : '/avatar_rest.gif'}
        alt="NoVo Avatar"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>
  )
}
