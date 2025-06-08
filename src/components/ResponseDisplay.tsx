'use client'

export default function ResponseDisplay({ response }: { response: string | null }) {
  if (!response) return null
  return (
    <div className="border p-4 mt-4 whitespace-pre-wrap">
      {response}
    </div>
  )
}
