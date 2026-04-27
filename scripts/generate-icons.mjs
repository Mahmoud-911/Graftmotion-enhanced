import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT   = join(__dirname, "..");
const SOURCE = join(ROOT, "public", "logo.png");

// Logo already has built-in padding + background — keep extra padding minimal
const PAD = 0.05;

async function make(size, outPath) {
  const inner = Math.round(size * (1 - PAD * 2));
  const pad   = Math.round(size * PAD);

  await sharp(SOURCE)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 255, g: 140, b: 0, alpha: 1 }, // match orange bg
    })
    .extend({
      top: pad, bottom: pad, left: pad, right: pad,
      background: { r: 255, g: 140, b: 0, alpha: 1 },
    })
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(outPath);

  console.log(`✓ ${outPath.replace(ROOT, "").replace(/\\/g, "/")}  (${size}×${size})`);
}

mkdirSync(join(ROOT, "app"),    { recursive: true });
mkdirSync(join(ROOT, "public"), { recursive: true });

await make(512, join(ROOT, "app",    "icon.png"));
await make(180, join(ROOT, "app",    "apple-icon.png"));
await make(192, join(ROOT, "public", "icon-192.png"));
await make(32,  join(ROOT, "public", "icon-32.png"));
await make(16,  join(ROOT, "public", "icon-16.png"));

console.log("\nAll icons generated.");
