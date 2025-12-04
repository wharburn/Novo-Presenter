interface StartButtonProps {
  onClick: () => void
}

export default function StartButton({ onClick }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-8 top-1/2 transform -translate-y-1/2 
                 px-12 py-4 text-xl font-semibold
                 bg-white text-[#5DADE2] 
                 rounded-full shadow-lg
                 border-2 border-[#5DADE2]
                 hover:bg-[#5DADE2] hover:text-white
                 transition-all duration-300
                 hover:shadow-xl hover:scale-105"
    >
      Start
    </button>
  )
}
