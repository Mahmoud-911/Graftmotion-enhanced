import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const raw = await readFile(CONTENT_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Ensure data directory exists
    await mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    await writeFile(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save content:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

/*
 * DEPLOYMENT NOTE
 * ────────────────────────────────────────────────────────────────
 * Local dev: reads/writes data/content.json via the Node.js fs module.
 *
 * When you deploy (Vercel, Railway, etc.) the file system is ephemeral,
 * so swap these implementations:
 *
 *   GET  → query your database (MongoDB, Supabase, PlanetScale, etc.)
 *   POST → upsert a document / row in that database
 *
 * A minimal Supabase swap looks like:
 *   const { data } = await supabase.from('content').select('*').single()
 *   await supabase.from('content').upsert({ id: 1, ...body })
 * ────────────────────────────────────────────────────────────────
 */
