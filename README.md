# Nexus Cross AI

This is a minimal prototype for the Nexus Cross AI project using Next.js, Firebase and the OpenAI API.
It now includes a very small usage counter and a dropdown to choose between AI models.
Only the OpenAI option is fully functional – the others return placeholder text.
Each authenticated user can see their request history stored in Firestore.

## Development

1. Copy `.env.example` to `.env.local` and fill in your keys.
2. Install dependencies with `npm install` (requires internet access).
3. Run the development server:

```bash
npm run dev
```

The app provides a simple textarea to submit a prompt. It calls a serverless
function that forwards the prompt to GPT‑4 and shows a **Gold** styled result.
Anonymous authentication is used and each interaction is stored in Firestore.

Due to environment limitations this repository does not include `node_modules`.
