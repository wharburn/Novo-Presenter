import Image from 'next/image'

export default function Header() {
  return (
    <header className="text-center flex-shrink-0 py-2">
      <Image 
        src="/NovoPresent.png" 
        alt="NoVo Present" 
        width={400} 
        height={80}
        className="mx-auto"
        priority
      />
    </header>
  )
}
