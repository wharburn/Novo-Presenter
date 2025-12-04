const fs = require('fs')
const path = require('path')
const PizZip = require('pizzip')
const pdfParse = require('pdf-parse')
const { Index } = require('@upstash/vector')

require('dotenv').config({ path: '.env.local' })

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

async function extractTextFromPPTX(filePath) {
  const content = fs.readFileSync(filePath, 'binary')
  const zip = new PizZip(content)
  
  let text = ''
  const slideFiles = Object.keys(zip.files).filter(name => 
    name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
  )
  
  slideFiles.forEach(fileName => {
    const slideXml = zip.files[fileName].asText()
    const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || []
    const slideText = textMatches
      .map(match => match.replace(/<\/?a:t>/g, ''))
      .join(' ')
    text += slideText + '\n\n'
  })
  
  return text
}

async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdfParse(dataBuffer)
  return data.text
}

function chunkText(text, maxLength = 500) {
  const sentences = text.split(/[.!?]+/)
  const chunks = []
  let currentChunk = ''
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence + '. '
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}

async function setupRAG() {
  console.log('Setting up RAG database...\n')
  
  const pitchDecks = [
    {
      path: path.join(__dirname, '../data/Copy of Copy of NoVo Travel Assistant Pitch Deck Eng.pptx'),
      language: 'en',
      type: 'pptx',
    },
    {
      path: path.join(__dirname, '../data/Copy of Copy of NoVo Travel Assistant Pitch Deck PRT.pptx'),
      language: 'pt',
      type: 'pptx',
    },
  ]

  for (const deck of pitchDecks) {
    console.log(`Processing ${deck.language.toUpperCase()} pitch deck...`)
    
    try {
      const text = await extractTextFromPPTX(deck.path)
      const chunks = text.split('\n\n').filter(chunk => chunk.trim().length > 0)
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        await index.upsert({
          id: `${deck.language}-slide-${i}`,
          data: chunk,
          metadata: {
            text: chunk,
            language: deck.language,
            slideNumber: i,
            source: 'pitch_deck',
          },
        })
        console.log(`  ✓ Indexed slide ${i + 1}`)
      }
      
      console.log(`✓ Completed ${deck.language.toUpperCase()} pitch deck\n`)
    } catch (error) {
      console.error(`✗ Error processing ${deck.language}:`, error.message)
    }
  }

  const pdfFiles = fs.readdirSync(path.join(__dirname, '../data'))
    .filter(file => file.endsWith('.pdf'))
  
  if (pdfFiles.length > 0) {
    console.log('Processing PDF documents...')
    
    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(__dirname, '../data', pdfFile)
      console.log(`\nProcessing ${pdfFile}...`)
      
      try {
        const text = await extractTextFromPDF(pdfPath)
        const chunks = chunkText(text, 500)
        
        const detectedLanguage = pdfFile.toLowerCase().includes('port') || pdfFile.toLowerCase().includes('prt') ? 'pt' : 'en'
        
        for (let i = 0; i < chunks.length; i++) {
          await index.upsert({
            id: `${detectedLanguage}-pdf-${pdfFile}-${i}`,
            data: chunks[i],
            metadata: {
              text: chunks[i],
              language: detectedLanguage,
              source: 'company_docs',
              filename: pdfFile,
              chunkIndex: i,
            },
          })
          
          if (detectedLanguage === 'en') {
            await index.upsert({
              id: `pt-pdf-${pdfFile}-${i}`,
              data: chunks[i],
              metadata: {
                text: chunks[i],
                language: 'pt',
                source: 'company_docs',
                filename: pdfFile,
                chunkIndex: i,
              },
            })
          } else {
            await index.upsert({
              id: `en-pdf-${pdfFile}-${i}`,
              data: chunks[i],
              metadata: {
                text: chunks[i],
                language: 'en',
                source: 'company_docs',
                filename: pdfFile,
                chunkIndex: i,
              },
            })
          }
          
          console.log(`  ✓ Indexed chunk ${i + 1}/${chunks.length} (both languages)`)
        }
        
        console.log(`✓ Completed ${pdfFile}`)
      } catch (error) {
        console.error(`✗ Error processing ${pdfFile}:`, error.message)
      }
    }
  }
  
  console.log('\n✅ RAG setup complete!')
}

setupRAG().catch(console.error)
