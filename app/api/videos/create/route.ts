export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    { error: "Videos API not available — Supabase has been removed." },
    { status: 410 }
  );
}
