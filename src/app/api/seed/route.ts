import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const KNOWLEDGE_DATA = [
  'EcoPulse is a gamified application that helps you track and reduce your carbon footprint. You earn Eco Points by logging eco-friendly activities like taking public transit, eating vegan, or saving energy.',
  'Taking public transportation instead of driving a car can reduce your daily carbon emissions by up to 45%.',
  'A plant-based (vegan) diet can reduce your food-related carbon footprint by up to 73% compared to a heavy meat-eating diet.',
  'Transportation is one of the largest sources of greenhouse gas emissions globally. Choosing to walk, bike, or take the bus has a massive positive impact.',
  "Heating and cooling accounts for roughly half of a home's energy use. Turning down your thermostat by just 1 degree can save a significant amount of energy over a year.",
  'Fast fashion contributes heavily to water pollution and carbon emissions. Buying second-hand clothes or wearing what you already own reduces your shopping footprint.',
  'Streaming video and cloud storage consume energy from data centers. Periodically deleting unused files and lowering stream quality on small screens can reduce digital emissions.',
  'In EcoPulse, logging an activity where you avoided emissions (like biking instead of driving) gives you Eco Points. Honest logging of unavoidable emissions also gives a small amount of points to encourage transparency.',
  'You can join a Clan in EcoPulse to combine your Eco Points with others and compete on the Clan Leaderboard.',
  'Challenges in EcoPulse are daily, weekly, or seasonal tasks. Completing them grants a large bonus of Eco Points.',
  "Your Level in EcoPulse increases as you gain more Eco Points. You start as a 'Seedling' and can grow your rank over time.",
  "Leafy is the official EcoPulse AI assistant. Leafy's goal is to be sweet, encouraging, and helpful, providing advice on how to live sustainably.",
]

export async function GET(req: Request) {
  try {
    // 0. Authorization check
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }
    // 1. Generate embeddings for all facts in the knowledge base
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('gemini-embedding-2'),
      values: KNOWLEDGE_DATA,
    })

    // 2. Prepare rows for Supabase insertion
    const rows = KNOWLEDGE_DATA.map((content, index) => ({
      content,
      metadata: { source: 'seed_script' },
      embedding: embeddings[index],
    }))

    // 3. Clear existing knowledge base to prevent duplicates
    await supabase.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // 4. Insert new embeddings
    const { error } = await supabase.from('knowledge_base').insert(rows)

    if (error) {
      console.error('Error inserting into Supabase:', error)
      return new Response('Database Error: ' + error.message, { status: 500 })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully seeded ${rows.length} facts into the knowledge base.`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: unknown) {
    console.error('Seed API Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response('Internal Server Error: ' + message, { status: 500 })
  }
}
