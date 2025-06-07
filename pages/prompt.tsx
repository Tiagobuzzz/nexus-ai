import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PromptPage() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/result',
      query: { prompt },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Envie seu prompt</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        cols={40}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
