/**
 * Icon generation script for GRAFTMOTION.
 *
 * Usage:
 *   1. Save your logo as scripts/logo-source.png
 *   2. Run: node scripts/generate-icons.mjs
 *
 * Outputs:
 *   app/icon.png          512×512  — Next.js auto-uses as <link rel="icon">
 *   app/apple-icon.png    180×180  — Next.js auto-uses as apple-touch-icon
 *   app/favicon.ico       48×48    — browser tab fallback (Next.js serves from /app)
 *   public/icon-192.png   192×192  — Android / PWA
 *   public/icon-32.png     32×32   — small favicon
 *   public/icon-16.png     16×16   — tiny favicon
 */

import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "logo-source.png");

// Padding: 10% on each side so the G breathes inside the icon frame
const PADDING_PCT = 0.10;

async function padAndResize(size) {
  const innerSize = Math.round(size * (1 - PADDING_PCT * 2));
  const pad = Math.round(size * PADDING_PCT);

  return sharp(SOURCE)
    .resize(innerSize, innerSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // transparent padding
    })
    .extend({
      top: pad, bottom: pad, left: pad, right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ quality: 95, compressionLevel: 9 });
}

async function generate() {
  console.log("Generating icons from:", SOURCE);

  mkdirSync(join(ROOT, "app"), { recursive: true });
  mkdirSync(join(ROOT, "public"), { recursive: true });

  const targets = [
    { path: join(ROOT, "app", "icon.png"),         size: 512 },
    { path: join(ROOT, "app", "apple-icon.png"),   size: 180 },
    { path: join(ROOT, "public", "icon-192.png"),  size: 192 },
    { path: join(ROOT, "public", "icon-32.png"),   size: 32  },
    { path: join(ROOT, "public", "icon-16.png"),   size: 16  },
  ];

  for (const { path: outPath, size } of targets) {
    await (await padAndResize(size)).toFile(outPath);
    console.log(`  ✓ ${outPath.replace(ROOT, "").replace(/\\/g, "/")}  (${size}×${size})`);
  }

  // favicon.ico — 48×48 embedded inside an ICO wrapper
  // Sharp can't write .ico directly, so we write a 48px PNG to /app/favicon.ico
  // (Next.js App Router serves any file named favicon.ico from /app as the favicon)
  const icoBuffer = await (await padAndResize(48)).toBuffer();
  writeFileSync(join(ROOT, "app", "favicon.ico"), icoBuffer);
  console.log("  ✓ /app/favicon.ico  (48×48 PNG, served as ICO)");

  console.log("\nDone! All icons generated.");
}

generate().catch((err) => {
  console.error("Icon generation failed:", err.message);
  console.error("Make sure scripts/logo-source.png exists.");
  process.exit(1);
});
