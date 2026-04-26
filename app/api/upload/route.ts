import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";

// Netlify serverless max: allow up to 60 s for large video uploads
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_TYPES = new Set(["video/mp4", "video/webm"]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported type "${file.type}". Only mp4 and webm are allowed.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 100 MB.` },
        { status: 413 }
      );
    }

    // Read once into a Uint8Array — no Buffer conversion overhead
    const bytes = new Uint8Array(await file.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "graftmotion",
          chunk_size: 6 * 1024 * 1024, // 6 MB chunks — stable for serverless
          timeout: 120000,              // 120 s Cloudinary-side timeout
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            return reject(error ?? new Error("Cloudinary returned no result"));
          }
          resolve(uploadResult);
        }
      );
      stream.end(bytes);
    });

    return NextResponse.json({
      secure_url: result.secure_url,
      url: result.secure_url, // backward-compat with admin panel
      public_id: result.public_id,
      duration: result.duration ?? null,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
