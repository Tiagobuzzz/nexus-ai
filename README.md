# Nexus Cross AI

![License: Proprietary](https://img.shields.io/badge/License-Proprietary-blue.svg)

This is a minimal prototype for the Nexus Cross AI project using Next.js, Firebase and multiple LLM APIs.
The app features a freemium/premium toggle with usage limits and a dropdown to choose between AI modes.
OpenAI, Claude and Gemini integrations are supported when the respective API keys are configured.
Each authenticated user can see their request history stored in Firestore including the chosen mode and tier.

## Development

1. Copy `.env.example` to `.env.local` and fill in your OpenAI, Anthropic and Gemini keys along with Firebase config.
2. Install dependencies with `npm install` (requires internet access).
3. Run the development server:

```bash
npm run dev
```

The app now starts with a minimal landing screen. After clicking **Start Chat**
users can submit prompts and select single, duo or trio AI modes. Requests are
sent to the backend which orchestrates the chosen models and returns the
result or a synthesized answer.
Anonymous authentication is used and each interaction is stored in Firestore.

Due to environment limitations this repository does not include `node_modules`.

## License

This project is released under a proprietary license. See [LICENSE](LICENSE) for details.
