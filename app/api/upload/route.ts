import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("video") && !file.type.includes("image")) {
      return NextResponse.json(
        { error: `Unsupported type "${file.type}". Only images and videos are allowed.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 100 MB.` },
        { status: 413 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

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

    return NextResponse.json({
      secure_url: result.secure_url,
      url: result.secure_url,
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
