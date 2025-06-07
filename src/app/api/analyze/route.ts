import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })

export async function POST(req: NextRequest) {
  const { prompt, model } = await req.json()
  if (!prompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
  }

  const selected = model || 'openai'

  if (selected === 'openai') {
    const chat = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
    })
    const result = chat.choices[0].message.content
    return NextResponse.json({ result })
  }

  if (selected === 'claude') {
    return NextResponse.json({ result: 'Claude integration coming soon.' })
  }

  if (selected === 'gemini') {
    return NextResponse.json({ result: 'Gemini integration coming soon.' })
  }

  return NextResponse.json({ error: 'Unknown model' }, { status: 400 })
}
