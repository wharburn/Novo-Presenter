export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="px-6 py-3 bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A9FD5] transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
