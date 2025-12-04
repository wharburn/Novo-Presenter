# Deployment Guide for Render

## Prerequisites

1. GitHub repository with your code
2. All API keys from `.env.example`
3. Pitch deck slides exported as images (PNG/JPG)
4. Avatar files: `avatar.png` and `avatar.gif`

## Steps

### 1. Prepare Slide Images

Export your PowerPoint slides as images:
- Open each PPTX file
- File → Export → Save as Images
- Save English slides to: `public/slides/en/` (name them: slide-1.png, slide-2.png, etc.)
- Save Portuguese slides to: `public/slides/pt/` (name them: slide-1.png, slide-2.png, etc.)

### 2. Add Avatar Files

Place your avatar files in the `public/` directory:
- `public/avatar.png` - Static avatar image
- `public/avatar.gif` - Animated avatar for when speaking

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 4. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: novo-presentation
   - **Environment**: Node
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`
   - **Instance Type**: Starter (or higher)

### 5. Add Environment Variables

In Render dashboard, add all variables from `.env.example`:

```
ANTHROPIC_API_KEY=sk-ant-...
HUME_API_KEY=...
ELEVENLABS_API_KEY=...
DEEPGRAM_API_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
UPSTASH_VECTOR_REST_URL=...
UPSTASH_VECTOR_REST_TOKEN=...
NODE_ENV=production
```

### 6. Deploy

Click "Create Web Service" and wait for deployment to complete.

## Getting API Keys

### Anthropic Claude
1. Visit: https://console.anthropic.com/
2. Create account → API Keys → Create Key

### Hume AI
1. Visit: https://www.hume.ai/
2. Sign up → Get API Key

### ElevenLabs
1. Visit: https://elevenlabs.io/
2. Sign up → Profile → API Key
3. Get Voice ID from Voice Library

### Deepgram
1. Visit: https://deepgram.com/
2. Sign up → API Keys → Create Key

### Upstash Redis
1. Visit: https://console.upstash.com/
2. Create Redis Database
3. Copy REST URL and Token

### Upstash Vector
1. In Upstash Console, create Vector Index
2. Dimension: 1536 (for text embeddings)
3. Copy REST URL and Token

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Setup RAG database
npm run setup:rag

# Run development server
npm run dev
```

Visit http://localhost:3000

## Troubleshooting

### Slides not showing
- Ensure slide images are in `public/slides/en/` and `public/slides/pt/`
- Check file names: slide-1.png, slide-2.png, etc.

### Avatar not animating
- Verify `avatar.png` and `avatar.gif` exist in `public/`
- Check GIF file is valid and animated

### Voice not working
- Verify ElevenLabs API key and Voice ID
- Check browser console for errors
- Test audio playback in browser

### RAG not responding
- Run `npm run setup:rag` to index pitch decks
- Verify Upstash Vector credentials
- Check Upstash Vector index dimension (should be 1536)
