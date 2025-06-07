# Nexus Cross AI

This is a minimal prototype for the Nexus Cross AI project using Next.js, Firebase and multiple LLM APIs.
The app features a freemium/premium toggle with usage limits and a dropdown to choose between AI models.
OpenAI, Claude and Gemini integrations are supported when the respective API keys are configured.
Each authenticated user can see their request history stored in Firestore including the selected model and tier.

## Development

1. Copy `.env.example` to `.env.local` and fill in your OpenAI, Anthropic and Gemini keys along with Firebase config.
2. Install dependencies with `npm install` (requires internet access).
3. Run the development server:

```bash
npm run dev
```

The app provides a simple textarea to submit a prompt. It calls a serverless
function that forwards the prompt to GPT‑4 and shows a **Gold** styled result.
Anonymous authentication is used and each interaction is stored in Firestore.

Due to environment limitations this repository does not include `node_modules`.
