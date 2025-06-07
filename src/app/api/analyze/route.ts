import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const anthropicApi = 'https://api.anthropic.com/v1/messages'
const geminiApi =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function POST(req: NextRequest) {
  const { prompt, model, tier } = await req.json()
  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
  }

  const selected = model || 'openai'

  if (tier === 'freemium' && selected !== 'openai') {
    return NextResponse.json(
      { error: 'Freemium users can only access the OpenAI model' },
      { status: 403 }
    )
  }

  if (selected === 'openai') {
    const chat = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
    })
    const result = chat.choices[0].message.content
    return NextResponse.json({ result })
  }

  if (selected === 'claude') {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key missing' },
        { status: 500 }
      )
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
            content: prompt,
          },
        ],
      }),
    })
    const data = await res.json()
    const result = data?.content?.[0]?.text || 'No response from Claude.'
    return NextResponse.json({ result })
  }

  if (selected === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key missing' },
        { status: 500 }
      )
    }
    const res = await fetch(`${geminiApi}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user',
          },
        ],
      }),
    })
    const data = await res.json()
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
    return NextResponse.json({ result })
  }

  return NextResponse.json({ error: 'Unknown model' }, { status: 400 })
}
