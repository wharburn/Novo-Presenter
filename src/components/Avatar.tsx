import Image from 'next/image'

interface AvatarProps {
  isSpeaking: boolean
}

export default function Avatar({ isSpeaking }: AvatarProps) {
  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-xl border-4 border-white">
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
