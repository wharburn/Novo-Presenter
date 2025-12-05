'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
        <p className="text-xl text-gray-600 mb-8">Something went wrong</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A9FD5] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
