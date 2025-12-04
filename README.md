# NoVo Presentation Chatbot

AI-powered presentation assistant with real-time voice capabilities for investor presentations.

## Features

- Real-time voice conversation (Hume AI + ElevenLabs + Deepgram)
- RAG-powered knowledge base from pitch deck
- Multi-language support (English & Portuguese)
- Session memory with Upstash Redis
- Vector search with Upstash Vector
- Animated avatar during speech

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your API keys

3. Place pitch decks in `data/` folder:
   - English: `Copy of Copy of NoVo Travel Assistant Pitch Deck Eng.pptx`
   - Portuguese: `Copy of Copy of NoVo Travel Assistant Pitch Deck PRT.pptx`

4. Place avatar files in `public/`:
   - `avatar.png` (static)
   - `avatar.gif` (animated during speech)

5. Initialize RAG database:
```bash
npm run setup:rag
```

6. Run development server:
```bash
npm run dev
```

## Deployment to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Add environment variables from `.env`
4. Deploy

## Tech Stack

- Next.js + React
- Anthropic Claude (LLM)
- Hume AI (Voice emotion)
- ElevenLabs (TTS)
- Deepgram (STT)
- Upstash Redis (Session cache)
- Upstash Vector (RAG)
