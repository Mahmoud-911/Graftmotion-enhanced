import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ GET (read data)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error) {
      return Response.json({ error: 'Failed to fetch' }, { status: 500 });
    }

    return Response.json(data?.data || {});
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// ✅ POST (save data)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error } = await supabase
      .from('content')
      .upsert({
        id: 'main',
        data: body,
      });

    if (error) {
      return Response.json({ error: 'Failed to save' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}