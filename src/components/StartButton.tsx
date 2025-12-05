interface StartButtonProps {
  onClick: () => void
}

export default function StartButton({ onClick }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="py-2 rounded-lg font-medium transition-all text-sm sm:text-base w-24 border-2
                 bg-[#5DADE2] text-white hover:bg-[#4A9FD5] border-[#5DADE2]
                 animate-pulse"
    >
      Start
    </button>
  )
}
