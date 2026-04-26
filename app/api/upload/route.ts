import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: NextRequest) {
  console.log("UPLOAD ROUTE HIT");

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error("Failed to parse formData:", err);
    return NextResponse.json({ error: "Failed to parse request body" }, { status: 400 });
  }

  console.log("FormData keys:", [...formData.keys()]);

  // Accept File OR Blob — different runtimes return different types
  const entry = formData.get("file");
  console.log("File entry type:", typeof entry, entry?.constructor?.name);

  if (!entry || typeof entry === "string") {
    console.error("No file in FormData. Keys present:", [...formData.keys()]);
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = entry as Blob;
  console.log("File size:", blob.size, "| MIME type:", blob.type);

  if (blob.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }

  if (blob.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(blob.size / 1024 / 1024).toFixed(1)} MB). Max is 100 MB.` },
      { status: 413 }
    );
  }

  try {
    const bytes = new Uint8Array(await blob.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "graftmotion",
          chunk_size: 6 * 1024 * 1024,
          timeout: 120000,
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

    console.log("Upload successful:", result.secure_url);

    return NextResponse.json({
      url:         result.secure_url,
      secure_url:  result.secure_url,
      public_id:   result.public_id,
      duration:    result.duration ?? null,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
