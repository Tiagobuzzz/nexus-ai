'use client'

export default function Loading({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null
  return <div className="mt-4 text-center">AI is thinking...</div>
}
