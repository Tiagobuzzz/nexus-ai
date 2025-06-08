'use client'

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <h1 className="text-4xl font-bold">Talk to AI. Smarter. Together.</h1>
      <p className="text-lg text-gray-600">Get combined insights from top AI models.</p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={onStart}
      >
        Start Chat
      </button>
    </div>
  )
}
