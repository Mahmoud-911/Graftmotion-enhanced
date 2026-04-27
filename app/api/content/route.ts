export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { readFile } from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");
const NO_CACHE = { headers: { "Cache-Control": "no-store" } };

async function fetchFromFirestore() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID not set");

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/content/main`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error(`Firestore REST ${res.status}`);

  const firestoreDoc = await res.json();
  const jsonStr = firestoreDoc?.fields?.json?.stringValue;
  if (!jsonStr) throw new Error("No content in Firestore document");

  return JSON.parse(jsonStr);
}

export async function GET() {
  // 1. Try Firestore
  try {
    const content = await fetchFromFirestore();
    return Response.json(content, NO_CACHE);
  } catch (err) {
    console.error("Firestore GET error:", err);
  }

  // 2. Fallback — content.json bundled with the deployment
  try {
    const raw = await readFile(CONTENT_PATH, "utf-8");
    return Response.json(JSON.parse(raw), NO_CACHE);
  } catch {
    return Response.json({}, { status: 200, ...NO_CACHE });
  }
}

// Admin saves directly to Firestore — this endpoint no longer accepts POSTs.
export async function POST() {
  return Response.json(
    { error: "Content is now saved directly to Firestore from the admin panel." },
    { status: 410 }
  );
}
