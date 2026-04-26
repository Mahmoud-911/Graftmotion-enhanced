import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("id", { ascending: false });

  console.log("VIDEOS:", data);
  console.log("ERROR:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
