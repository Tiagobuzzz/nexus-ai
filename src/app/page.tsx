'use client'

import { useState } from 'react'
import { signInAnonymously } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { initFirebase } from '../firebaseConfig'

const { auth, db } = initFirebase()

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const runAnalysis = async () => {
    setLoading(true)
    await signInAnonymously(auth)
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setResponse(data.result)
    setLoading(false)
    await addDoc(collection(db, 'history'), { prompt, result: data.result, ts: Date.now() })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Nexus Cross AI</h1>
      <textarea className="w-full p-2 border mb-2" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={runAnalysis} className="bg-blue-500 text-white px-4 py-2" disabled={loading}>Run Analysis</button>
      {loading && <p>Loading...</p>}
      {response && (
        <div className="border-2 border-yellow-400 p-4 mt-4">
          <p className="font-bold">Gold Result:</p>
          <p>{response}</p>
        </div>
      )}
    </main>
  )
}
