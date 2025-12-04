const fs = require('fs')
const path = require('path')

console.log('🔍 NoVo Presentation App Test\n')

let hasErrors = false

console.log('1️⃣  Checking environment variables...')
const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  console.log('   ✓ .env.local found')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const requiredKeys = [
    'ANTHROPIC_API_KEY',
    'ELEVENLABS_API_KEY',
    'DEEPGRAM_API_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'UPSTASH_VECTOR_REST_URL',
    'UPSTASH_VECTOR_REST_TOKEN'
  ]
  
  requiredKeys.forEach(key => {
    if (envContent.includes(`${key}=`) && !envContent.includes(`${key}=your_`)) {
      console.log(`   ✓ ${key} is set`)
    } else {
      console.log(`   ✗ ${key} is missing or not configured`)
      hasErrors = true
    }
  })
} else {
  console.log('   ✗ .env.local not found')
  hasErrors = true
}

console.log('\n2️⃣  Checking avatar files...')
const avatarRest = path.join(__dirname, 'public/avatar_rest.gif')
const avatarSpeak = path.join(__dirname, 'public/avatar_speak.gif')

if (fs.existsSync(avatarRest)) {
  const size = fs.statSync(avatarRest).size
  console.log(`   ✓ avatar_rest.gif found (${(size / 1024 / 1024).toFixed(2)} MB)`)
} else {
  console.log('   ✗ avatar_rest.gif not found')
  hasErrors = true
}

if (fs.existsSync(avatarSpeak)) {
  const size = fs.statSync(avatarSpeak).size
  console.log(`   ✓ avatar_speak.gif found (${(size / 1024 / 1024).toFixed(2)} MB)`)
} else {
  console.log('   ✗ avatar_speak.gif not found')
  hasErrors = true
}

console.log('\n3️⃣  Checking slide images...')
const languages = ['en', 'pt']
languages.forEach(lang => {
  const slidesDir = path.join(__dirname, 'public/slides', lang)
  if (fs.existsSync(slidesDir)) {
    const files = fs.readdirSync(slidesDir)
      .filter(file => file.match(/\.(png|jpg|jpeg|webp)$/i))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0')
        const numB = parseInt(b.match(/\d+/)?.[0] || '0')
        return numA - numB
      })
    
    if (files.length > 0) {
      console.log(`   ✓ ${lang.toUpperCase()}: ${files.length} slides found`)
      console.log(`      First: ${files[0]}, Last: ${files[files.length - 1]}`)
    } else {
      console.log(`   ✗ ${lang.toUpperCase()}: No slides found`)
      hasErrors = true
    }
  } else {
    console.log(`   ✗ ${lang.toUpperCase()}: slides/${lang} directory not found`)
    hasErrors = true
  }
})

console.log('\n4️⃣  Checking pitch deck files...')
const enDeck = path.join(__dirname, 'data/Copy of Copy of NoVo Travel Assistant Pitch Deck Eng.pptx')
const ptDeck = path.join(__dirname, 'data/Copy of Copy of NoVo Travel Assistant Pitch Deck PRT.pptx')

if (fs.existsSync(enDeck)) {
  console.log('   ✓ English pitch deck found')
} else {
  console.log('   ✗ English pitch deck not found')
  hasErrors = true
}

if (fs.existsSync(ptDeck)) {
  console.log('   ✓ Portuguese pitch deck found')
} else {
  console.log('   ✗ Portuguese pitch deck not found')
  hasErrors = true
}

console.log('\n5️⃣  Checking dependencies...')
const packageJson = require('./package.json')
const nodeModules = path.join(__dirname, 'node_modules')
if (fs.existsSync(nodeModules)) {
  console.log('   ✓ node_modules directory exists')
  const requiredDeps = [
    '@anthropic-ai/sdk',
    '@upstash/redis',
    '@upstash/vector',
    '@deepgram/sdk',
    'next',
    'react'
  ]
  
  requiredDeps.forEach(dep => {
    const depPath = path.join(nodeModules, dep)
    if (fs.existsSync(depPath)) {
      console.log(`   ✓ ${dep} installed`)
    } else {
      console.log(`   ✗ ${dep} not installed`)
      hasErrors = true
    }
  })
} else {
  console.log('   ✗ node_modules not found. Run: npm install')
  hasErrors = true
}

console.log('\n6️⃣  Checking API endpoints...')
const chatRoute = path.join(__dirname, 'src/app/api/chat/route.ts')
const slidesRoute = path.join(__dirname, 'src/app/api/slides/route.ts')

if (fs.existsSync(chatRoute)) {
  console.log('   ✓ /api/chat route exists')
} else {
  console.log('   ✗ /api/chat route missing')
  hasErrors = true
}

if (fs.existsSync(slidesRoute)) {
  console.log('   ✓ /api/slides route exists')
} else {
  console.log('   ✗ /api/slides route missing')
  hasErrors = true
}

console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Tests failed. Please fix the issues above.')
  process.exit(1)
} else {
  console.log('✅ All checks passed!')
  console.log('\nNext steps:')
  console.log('1. Run: npm run setup:rag')
  console.log('2. Run: npm run dev')
  console.log('3. Visit: http://localhost:3000')
}
console.log('='.repeat(50))
