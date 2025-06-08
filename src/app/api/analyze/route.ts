import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const anthropicApi = 'https://api.anthropic.com/v1/messages'
const geminiApi =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function POST(req: NextRequest) {
  const { prompt, mode, tier } = await req.json()
  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
  }

  const selected = mode || 'gold'

  if (tier === 'freemium' && selected !== 'gold') {
    return NextResponse.json(
      { error: 'Freemium users can only access the Gold model' },
      { status: 403 }
    )
  }

  const callOpenAI = async (p: string) => {
    const chat = await openai.chat.completions.create({
      messages: [{ role: 'user', content: p }],
      model: 'gpt-4o',
    })
    return chat.choices[0].message.content as string
  }

  const callClaude = async (p: string) => {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('Anthropic API key missing')
    }
    const res = await fetch(anthropicApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: p,
          },
        ],
      }),
    })
    const data = await res.json()
    return data?.content?.[0]?.text || 'No response from Claude.'
  }

  const callGemini = async (p: string) => {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Gemini API key missing')
    }
    const res = await fetch(`${geminiApi}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: p }],
            role: 'user',
          },
        ],
      }),
    })
    const data = await res.json()
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response from Gemini.'
    )
  }

  if (selected === 'gold') {
    const result = await callOpenAI(prompt)
    return NextResponse.json({ result })
  }

  if (selected === 'silver') {
    const result = await callClaude(prompt)
    return NextResponse.json({ result })
  }

  if (selected === 'bronze') {
    const result = await callGemini(prompt)
    return NextResponse.json({ result })
  }

  if (selected === 'duo') {
    const [gold, silver] = await Promise.all([
      callOpenAI(prompt),
      callClaude(prompt),
    ])
    const final = await callOpenAI(
      `Combine these answers into one helpful response.\nGPT: ${gold}\nClaude: ${silver}`
    )
    return NextResponse.json({ parts: { gold, silver }, final })
  }

  if (selected === 'trio') {
    const [gold, silver, bronze] = await Promise.all([
      callOpenAI(prompt),
      callClaude(prompt),
      callGemini(prompt),
    ])
    const final = await callOpenAI(
      `Combine these answers into one helpful response.\nGPT: ${gold}\nClaude: ${silver}\nGemini: ${bronze}`
    )
    return NextResponse.json({ parts: { gold, silver, bronze }, final })
  }

  return NextResponse.json({ error: 'Unknown model' }, { status: 400 })
}
