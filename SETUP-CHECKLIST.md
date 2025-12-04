# NoVo Presentation Setup Checklist

## Required Files

### 1. Avatar Images
- [ ] `public/avatar.png` - Static avatar
- [ ] `public/avatar.gif` - Animated avatar (shows when speaking)

### 2. Pitch Deck Slides

Export your PowerPoint files as images and place them here:

#### English Slides
- [ ] `public/slides/en/slide-1.png`
- [ ] `public/slides/en/slide-2.png`
- [ ] `public/slides/en/slide-3.png`
- [ ] ... (continue for all slides)

#### Portuguese Slides
- [ ] `public/slides/pt/slide-1.png`
- [ ] `public/slides/pt/slide-2.png`
- [ ] `public/slides/pt/slide-3.png`
- [ ] ... (continue for all slides)

**How to export slides as images:**
1. Open your PPTX file
2. Go to File → Export
3. Choose "Save as Images" or "PNG/JPEG"
4. Save all slides
5. Rename them sequentially: slide-1.png, slide-2.png, etc.

## API Keys Required

- [ ] Anthropic Claude API Key
- [ ] Hume AI API Key  
- [ ] ElevenLabs API Key + Voice ID
- [ ] Deepgram API Key
- [ ] Upstash Redis URL + Token
- [ ] Upstash Vector URL + Token

See `DEPLOYMENT.md` for links to get each API key.

## Setup Steps

1. [ ] Install dependencies: `npm install`
2. [ ] Copy `.env.example` to `.env.local`
3. [ ] Fill in all API keys in `.env.local`
4. [ ] Add avatar files to `public/`
5. [ ] Export and add slide images to `public/slides/en/` and `public/slides/pt/`
6. [ ] Run `npm run setup:rag` to index pitch deck content
7. [ ] Run `npm run dev` to test locally
8. [ ] Deploy to Render (see `DEPLOYMENT.md`)

## Testing Locally

```bash
npm run dev
```

Visit http://localhost:3000

- Click "Start" button
- Select language (English/Português)
- Avatar should be visible
- Slides should appear below avatar
- Chat interface at the bottom
- Type a question and send
- Avatar should animate when speaking
- Voice response should play
