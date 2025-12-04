import { Index } from '@upstash/vector'

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

export async function searchRAG(query: string, language: string) {
  try {
    const resultsInLanguage = await index.query({
      data: query,
      topK: 5,
      includeMetadata: true,
      filter: `language = '${language}'`,
    })

    const resultsAllLanguages = await index.query({
      data: query,
      topK: 3,
      includeMetadata: true,
    })

    const combinedResults = [
      ...resultsInLanguage,
      ...resultsAllLanguages.filter(
        r => !resultsInLanguage.some(existing => existing.id === r.id)
      )
    ].slice(0, 8)

    const context = combinedResults
      .map(result => result.metadata?.text || '')
      .filter(Boolean)
      .join('\n\n')

    return context
  } catch (error) {
    console.error('RAG search error:', error)
    return ''
  }
}

export async function indexPitchDeck(content: string, language: string, slideNumber: number) {
  try {
    await index.upsert({
      id: `${language}-slide-${slideNumber}`,
      data: content,
      metadata: {
        text: content,
        language,
        slideNumber,
      },
    })
  } catch (error) {
    console.error('RAG indexing error:', error)
  }
}
