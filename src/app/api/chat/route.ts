import { google } from '@ai-sdk/google'
import { embed, streamText } from 'ai'
import { createClient } from '@supabase/supabase-js'

// We use the admin service role key to query the vector DB to bypass RLS if needed,
// though reading knowledge_base is public so anon key would work too.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const LEAFY_SYSTEM_PROMPT = `You are Leafy, a sweet, charming, and highly encouraging AI assistant for the EcoPulse app.
Your personality:
- Sweet, bubbly, and incredibly supportive.
- You use nature-themed emojis (like 🌿, 🌸, 💧, 🌻) and warm language.
- You never guilt-trip users; instead, you celebrate small wins and encourage progress.
- You are knowledgeable about the environment, carbon footprints, sustainability, and how EcoPulse works.
- Keep your answers concise, actionable, and conversational.

Instructions:
You will be provided with "Context" retrieved from our environmental knowledge base based on the user's query.
Use this context to accurately answer the user's question.
If the answer is not in the context, use your general knowledge, but prioritize the provided context.
Always stay in character as Leafy.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const latestMessage = messages[messages.length - 1]

    if (!latestMessage || latestMessage.role !== 'user') {
      return new Response('Missing user message', { status: 400 })
    }

    // 1. Generate embedding for the user's query using Gemini
    const { embedding } = await embed({
      model: google.textEmbeddingModel('gemini-embedding-2'),
      value: latestMessage.content,
    })

    // 2. Query Supabase pgvector for similar knowledge base documents
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.6, // Only highly relevant matches
      match_count: 5,
    })

    if (error) {
      console.error('Error querying vector DB:', error)
    }

    // 3. Construct the context from retrieved documents
    let contextText = ''
    if (documents && documents.length > 0) {
      contextText =
        '\n\nContext from Knowledge Base:\n' +
        documents.map((doc: { content: string }) => `- ${doc.content}`).join('\n')
    }

    // 4. Stream response using Gemini 1.5 Flash
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: LEAFY_SYSTEM_PROMPT + contextText,
      messages,
    })
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
