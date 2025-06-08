'use client'

import { useState, useEffect, useRef } from 'react'
import { signInAnonymously, User } from 'firebase/auth'
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { initFirebase } from '../firebaseConfig'

const { auth, db } = initFirebase()

export default function Home() {
  const [started, setStarted] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [mode, setMode] = useState('gold')
  const [tier, setTier] = useState('freemium')
  const [history, setHistory] = useState<any[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [usage, setUsage] = useState(0)
  const usageLimit = tier === 'freemium' ? 5 : Infinity
  const resultRef = useRef<HTMLDivElement | null>(null)

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
      body: JSON.stringify({ prompt, mode, tier })
    })
    const data = await res.json()
    setResponse(data)
    setLoading(false)
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    if (user) {
      await addDoc(collection(db, 'history'), {
        uid: user.uid,
        prompt,
        mode,
        tier,
        result: data,
        ts: Date.now(),
      })
      setHistory([
        { prompt, result: data, mode, tier, ts: Date.now() },
        ...history,
      ])
      setUsage(usage + 1)
    }
  }

  if (!started) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold">Talk to AI. Smarter. Together.</h1>
        <p className="text-lg">Get combined insights from top AI models.</p>
        <p className="text-sm text-gray-500">Powered by Multiple AI Models</p>
        <button onClick={() => setStarted(true)} className="bg-blue-600 text-white px-6 py-2 rounded">
          Start Chat
        </button>
      </main>
    )
  }

  const colorMap: Record<string, string> = {
    gold: 'border-yellow-400',
    silver: 'border-gray-300',
    bronze: 'border-amber-700',
    duo: 'border-blue-400',
    trio: 'border-purple-500',
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 space-y-4">
      <h1 className="text-3xl font-bold">Nexus Cross AI</h1>
      <div className="flex flex-col w-full max-w-xl space-y-2">
        <select
          className="border p-2"
          value={tier}
          onChange={(e) => {
            setTier(e.target.value)
            setUsage(0)
          }}
        >
          <option value="freemium">Freemium</option>
          <option value="premium">Premium</option>
        </select>
        <select
          className="border p-2"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="gold">Gold (GPT-4o)</option>
          <option value="silver" disabled={tier === 'freemium'}>Silver (Claude)</option>
          <option value="bronze" disabled={tier === 'freemium'}>Bronze (Gemini)</option>
          <option value="duo" disabled={tier === 'freemium'}>Duo (GPT + Claude)</option>
          <option value="trio" disabled={tier === 'freemium'}>Trio (All Models)</option>
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
          Ask Now
        </button>
        <p className="text-sm text-gray-600">
          Usage: {usage}/{usageLimit === Infinity ? '∞' : usageLimit}
        </p>
        {usage >= usageLimit && usageLimit !== Infinity && (
          <p className="text-red-500">Free limit reached. <a href="#" className="underline">Upgrade to premium</a></p>
        )}
      </div>
      {loading && (
        <p className="loading-dots mt-4">Cross-AI discussion in progress<span>.</span><span>.</span><span>.</span></p>
      )}
      {response && (
        <div ref={resultRef} className={`border-2 p-4 mt-4 w-full max-w-xl space-y-4 ${colorMap[mode]}`}> 
          {response.parts && (
            <div className="space-y-2">
              {response.parts.gold && (
                <div className="border p-2">
                  <p className="text-sm font-semibold">Gold Response</p>
                  <p>{response.parts.gold}</p>
                </div>
              )}
              {response.parts.silver && (
                <div className="border p-2">
                  <p className="text-sm font-semibold">Silver Response</p>
                  <p>{response.parts.silver}</p>
                </div>
              )}
              {response.parts.bronze && (
                <div className="border p-2">
                  <p className="text-sm font-semibold">Bronze Response</p>
                  <p>{response.parts.bronze}</p>
                </div>
              )}
            </div>
          )}
          <div>
            <p className="font-bold mb-2">{response.parts ? 'Synthesized Result:' : 'Result:'}</p>
            <p>{response.parts ? response.final : response.result}</p>
            {response.parts && (
              <p className="text-xs text-gray-500 mt-1">Synthesized from multiple AI minds</p>
            )}
          </div>
        </div>
      )}
      {history.length > 0 && (
        <div className="w-full max-w-xl mt-6">
          <h2 className="text-xl font-semibold mb-2">History</h2>
          <ul>
            {history.map((h, i) => (
              <li key={i} className="border p-2 mb-2">
                <p className="font-semibold">{h.prompt}</p>
                <p className="text-sm text-gray-500 mb-1">Mode: {h.mode} – Tier: {h.tier}</p>
                <p>{h.result.parts ? h.result.final : h.result.result}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
