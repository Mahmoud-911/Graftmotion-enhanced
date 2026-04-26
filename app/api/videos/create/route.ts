import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: Record<string, string | undefined>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, category, video_url, thumbnail_url, date, public_id, duration } = body;

  const { data, error } = await supabase
    .from("videos")
    .insert([
      {
        id: Date.now(),
        title,
        category: category ?? null,
        video_url,
        thumbnail_url: thumbnail_url ?? null,
        date: date ?? null,
        public_id: public_id ?? null,
        duration: duration ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Failed to create video:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
