'use client'

import { useState } from 'react'
import Landing from '../components/Landing'
import PromptInput from '../components/PromptInput'
import ResponseDisplay from '../components/ResponseDisplay'
import Loading from '../components/Loading'

export default function Home() {
  const [started, setStarted] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [mode, setMode] = useState('gold')
  const [loading, setLoading] = useState(false)

  const submitPrompt = async () => {
    setLoading(true)
    setResponse(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode }),
      })
      const data = await res.json()
      if (data.result) {
        setResponse(data.result)
      } else if (data.final) {
        setResponse(data.final)
      } else {
        setResponse('No response.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!started) {
    return <Landing onStart={() => setStarted(true)} />
  }

  return (
    <main className="flex flex-col items-center p-4">
      <div className="w-full max-w-xl">
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          mode={mode}
          setMode={setMode}
          onSubmit={submitPrompt}
          disabled={loading}
        />
        <Loading isLoading={loading} />
        <ResponseDisplay response={response} />
      </div>
    </main>
  )
}
