'use client'

import { useState, useEffect } from 'react'
import { signInAnonymously, User } from 'firebase/auth'
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { initFirebase } from '../firebaseConfig'

const { auth, db } = initFirebase()

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [model, setModel] = useState('openai')
  const [history, setHistory] = useState<any[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState(0)
  const usageLimit = 5

  useEffect(() => {
    const signInAndLoad = async () => {
      const cred = await signInAnonymously(auth)
      const u = cred.user
      setUser(u)
      const q = query(
        collection(db, 'history'),
        where('uid', '==', u.uid),
        orderBy('ts', 'desc')
      )
      const snap = await getDocs(q)
      const items = snap.docs.map(doc => doc.data())
      setHistory(items)
      setUsage(items.length)
    }
    signInAndLoad()
  }, [])

  const runAnalysis = async () => {
    if (usage >= usageLimit) {
      alert('Free usage limit reached. Please upgrade to continue.')
      return
    }
    setLoading(true)
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model })
    })
    const data = await res.json()
    setResponse(data.result)
    setLoading(false)
    if (user) {
      await addDoc(collection(db, 'history'), {
        uid: user.uid,
        prompt,
        result: data.result,
        ts: Date.now(),
      })
      setHistory([{ prompt, result: data.result, ts: Date.now() }, ...history])
      setUsage(usage + 1)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 space-y-4">
      <h1 className="text-3xl font-bold">Nexus Cross AI</h1>
      <div className="flex flex-col w-full max-w-xl space-y-2">
        <select
          className="border p-2"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="openai">OpenAI GPT-4o</option>
          <option value="claude">Claude (soon)</option>
          <option value="gemini">Gemini (soon)</option>
        </select>
        <textarea
          className="w-full p-2 border"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={runAnalysis}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Run Analysis
        </button>
        <p className="text-sm text-gray-600">Usage: {usage}/{usageLimit}</p>
        {usage >= usageLimit && (
          <p className="text-red-500">Free limit reached. <a href="#" className="underline">Upgrade to premium</a></p>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {response && (
        <div className="border-2 border-yellow-400 p-4 mt-4 w-full max-w-xl">
          <p className="font-bold mb-2">Result:</p>
          <p>{response}</p>
        </div>
      )}
      {history.length > 0 && (
        <div className="w-full max-w-xl mt-6">
          <h2 className="text-xl font-semibold mb-2">History</h2>
          <ul>
            {history.map((h, i) => (
              <li key={i} className="border p-2 mb-2">
                <p className="font-semibold">{h.prompt}</p>
                <p>{h.result}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
