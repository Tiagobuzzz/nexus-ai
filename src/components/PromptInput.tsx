'use client'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  prompt: string
  setPrompt: Dispatch<SetStateAction<string>>
  mode: string
  setMode: Dispatch<SetStateAction<string>>
  onSubmit: () => void
  disabled?: boolean
}

export default function PromptInput({
  prompt,
  setPrompt,
  mode,
  setMode,
  onSubmit,
  disabled,
}: Props) {
  return (
    <div className="space-y-2 w-full">
      <select
        className="border p-2 w-full"
        value={mode}
        onChange={e => setMode(e.target.value)}
      >
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="bronze">Bronze</option>
        <option value="duo">Duo</option>
        <option value="trio">Trio</option>
      </select>
      <textarea
        className="border rounded w-full p-2 min-h-[100px]"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={onSubmit}
        disabled={disabled}
      >
        Ask
      </button>
    </div>
  )
}
