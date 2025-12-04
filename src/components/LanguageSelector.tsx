interface LanguageSelectorProps {
  language: 'en' | 'pt'
  onLanguageChange: (lang: 'en' | 'pt') => void
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-20">
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
          language === 'en'
            ? 'bg-[#5DADE2] text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="hidden sm:inline">English</span>
        <span className="sm:hidden">EN</span>
      </button>
      <button
        onClick={() => onLanguageChange('pt')}
        className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
          language === 'pt'
            ? 'bg-[#5DADE2] text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="hidden sm:inline">Português</span>
        <span className="sm:hidden">PT</span>
      </button>
    </div>
  )
}
