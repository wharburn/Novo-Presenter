const fs = require('fs')
const path = require('path')
const pdfParse = require('pdf-parse')
const { Index } = require('@upstash/vector')

// Load environment variables from .env or .env.local
require('dotenv').config({ path: '.env' })
if (!process.env.UPSTASH_VECTOR_REST_URL) {
  require('dotenv').config({ path: '.env.local' })
}

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdfParse(dataBuffer)
  return data.text
}

function chunkText(text, maxLength = 800) {
  // Split by paragraphs first, then by sentences if needed
  const paragraphs = text.split(/\n\n+/)
  const chunks = []
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    const trimmedPara = paragraph.trim()
    if (!trimmedPara) continue

    if ((currentChunk + '\n\n' + trimmedPara).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = trimmedPara
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + trimmedPara : trimmedPara
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

async function setupRAG() {
  console.log('Setting up RAG database for NoVo AI...\n')
  console.log('Vector URL:', process.env.UPSTASH_VECTOR_REST_URL ? '✓ Found' : '✗ Missing')
  console.log('Vector Token:', process.env.UPSTASH_VECTOR_REST_TOKEN ? '✓ Found' : '✗ Missing')
  console.log('')

  const dataDir = path.join(__dirname, '../data')
  const pdfFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.pdf'))

  console.log(`Found ${pdfFiles.length} PDF files to index:\n`)

  let totalChunks = 0

  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(dataDir, pdfFile)
    console.log(`📄 Processing: ${pdfFile}`)

    try {
      const text = await extractTextFromPDF(pdfPath)
      const chunks = chunkText(text, 800)

      // Detect language from filename
      const isPT = pdfFile.toLowerCase().includes('prt') ||
                   pdfFile.toLowerCase().includes('port') ||
                   pdfFile.toLowerCase().includes('português')
      const primaryLanguage = isPT ? 'pt' : 'en'

      console.log(`   Language: ${primaryLanguage.toUpperCase()}, Chunks: ${chunks.length}`)

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkId = `${primaryLanguage}-${pdfFile.replace(/[^a-zA-Z0-9]/g, '_')}-${i}`

        // Index in primary language
        await index.upsert({
          id: chunkId,
          data: chunk,
          metadata: {
            text: chunk,
            language: primaryLanguage,
            source: pdfFile,
            chunkIndex: i,
            totalChunks: chunks.length,
          },
        })

        // Also index in the other language for cross-language retrieval
        const secondaryLanguage = primaryLanguage === 'en' ? 'pt' : 'en'
        await index.upsert({
          id: `${secondaryLanguage}-${pdfFile.replace(/[^a-zA-Z0-9]/g, '_')}-${i}`,
          data: chunk,
          metadata: {
            text: chunk,
            language: secondaryLanguage,
            source: pdfFile,
            chunkIndex: i,
            totalChunks: chunks.length,
            crossLanguage: true,
          },
        })

        totalChunks++
      }

      console.log(`   ✓ Indexed ${chunks.length} chunks (both EN and PT)\n`)
    } catch (error) {
      console.error(`   ✗ Error: ${error.message}\n`)
    }
  }

  console.log('═'.repeat(50))
  console.log(`✅ RAG setup complete!`)
  console.log(`   Total documents: ${pdfFiles.length}`)
  console.log(`   Total chunks indexed: ${totalChunks * 2} (bilingual)`)
  console.log('═'.repeat(50))
}

setupRAG().catch(console.error)
