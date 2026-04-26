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
    const body = await req.json()

    // 1. Get existing content so we can merge, not overwrite
    const { data: existing } = await supabase
      .from('content')
      .select('data')
      .eq('id', 'main')
      .single()

    const existingData = existing?.data || {}

    // 2. Deep merge — top-level spread, with nested objects preserved
    const merged = {
      ...existingData,
      ...body,
      hero: {
        ...existingData.hero,
        ...body.hero,
      },
      testimonials: {
        ...existingData.testimonials,
        ...body.testimonials,
        items:
          body.testimonials?.items ||
          existingData.testimonials?.items ||
          [],
      },
    }

    // Normalise featuredWork: accept array or slot-keyed object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeFeatured = (fw: any) => {
      if (!fw) return [];
      if (Array.isArray(fw)) return fw;
      return [fw.slot1 || {}, fw.slot2 || {}, fw.slot3 || {}, fw.slot4 || {}];
    };
    merged.featuredWork = normalizeFeatured(merged.featuredWork);

    // 3. Save merged result
    const { error } = await supabase
      .from('content')
      .upsert({ id: 'main', data: merged })

    if (error) {
      return Response.json({ error: 'Save failed' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
