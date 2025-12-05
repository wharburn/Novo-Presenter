import Image from 'next/image'

export default function Header() {
  return (
    <header className="flex-shrink-0 py-6">
      <Image 
        src="/NovoPresent.png" 
        alt="NoVo Present" 
        width={400} 
        height={80}
        className="mx-auto"
        style={{ width: '400px', height: 'auto' }}
        priority
      />
    </header>
  )
}
