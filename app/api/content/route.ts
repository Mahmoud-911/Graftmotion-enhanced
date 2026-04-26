export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json')

const NO_CACHE = { headers: { 'Cache-Control': 'no-store' } }

async function readContent() {
  const raw = await readFile(CONTENT_PATH, 'utf-8')
  return JSON.parse(raw)
}

export async function GET() {
  try {
    return Response.json(await readContent(), NO_CACHE)
  } catch {
    return Response.json({}, { status: 200, ...NO_CACHE })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Read existing data for deep merge
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existingData: Record<string, any> = {}
    try {
      existingData = await readContent()
    } catch {
      // file may not exist yet — start fresh
    }

    // Deep merge — preserve nested objects
    const merged = {
      ...existingData,
      ...body,
      hero: {
        ...(existingData.hero || {}),
        ...(body.hero || {}),
      },
      testimonials: {
        ...(existingData.testimonials || {}),
        ...(body.testimonials || {}),
        items:
          body.testimonials?.items ||
          existingData.testimonials?.items ||
          [],
      },
    }

    // Normalise featuredWork: accept array or slot-keyed object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeFeatured = (fw: any) => {
      if (!fw) return []
      if (Array.isArray(fw)) return fw
      return [fw.slot1 || {}, fw.slot2 || {}, fw.slot3 || {}, fw.slot4 || {}]
    }
    merged.featuredWork = normalizeFeatured(merged.featuredWork)

    await mkdir(path.dirname(CONTENT_PATH), { recursive: true })
    await writeFile(CONTENT_PATH, JSON.stringify(merged, null, 2), 'utf-8')

    return Response.json({ success: true })
  } catch (err) {
    console.error('Content save error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
