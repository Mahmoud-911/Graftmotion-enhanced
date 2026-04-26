import { readFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json')

async function readLocalContent() {
  const raw = await readFile(CONTENT_PATH, 'utf-8')
  return JSON.parse(raw)
}

export async function GET() {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('content')
      .select('data')
      .eq('id', 'main')
      .single()

    if (!error && data?.data) {
      return Response.json(data.data)
    }
  } catch {
    // fall through
  }

  // 2. Fall back to content.json (bundled with the deployment)
  try {
    return Response.json(await readLocalContent())
  } catch {
    return Response.json({}, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const incoming = await req.json()

    const defaultContent = {
      site: {
        title: 'GRAFTMOTION',
        subtitle: 'Reliable direction-aligned videos. Guaranteed.',
        email: 'graftmotionfx@gmail.com',
        ctaText: 'Work With Me',
        ctaUrl: 'https://www.instagram.com/graftmotion.vfx/'
      },
      hero: {
        videoUrl: incoming?.hero?.videoUrl || ''
      },
      clients: [
        { name: 'Bokeh Labs',       logo: '' },
        { name: 'Movo Gym Tracker', logo: '' },
        { name: 'Spotup',           logo: '' },
        { name: 'High End Dubai',   logo: '' }
      ],
      featuredWork: [
        { title: 'Spotup Ad',     videoUrl: '' },
        { title: 'Carloop',       videoUrl: '' },
        { title: 'UI Animation',  videoUrl: '' },
        { title: 'Discord Promo', videoUrl: '' }
      ],
      testimonials: {
        featuredImage: '',
        items: [
          { quote: 'Great work!',    image: '' },
          { quote: 'Amazing edits!', image: '' }
        ]
      },
      moreWork: [
        { title: 'Project 1', videoUrl: '' },
        { title: 'Project 2', videoUrl: '' },
        { title: 'Project 3', videoUrl: '' }
      ]
    }

    const body = { ...defaultContent, ...incoming }

    const { error } = await supabase
      .from('content')
      .upsert({ id: 'main', data: body })

    if (error) {
      return Response.json({ error: 'Failed to save' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
