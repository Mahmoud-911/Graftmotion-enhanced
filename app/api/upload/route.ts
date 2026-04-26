// Upload is now handled client-side via direct Cloudinary unsigned upload.
// This route is no longer used and kept only to avoid 404s from stale requests.
export async function POST() {
  return Response.json(
    { error: "This upload endpoint has been deprecated. Use direct Cloudinary upload from the frontend." },
    { status: 410 }
  );
}
