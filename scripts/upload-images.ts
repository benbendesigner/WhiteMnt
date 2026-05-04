import fs from "fs";
import path from "path";
import { config as dotenvConfig } from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { v2 as cloudinary } from "cloudinary";

// Walk up from cwd to find .env.local / .env (handles running from worktree)
(function loadEnv() {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const local = path.join(dir, ".env.local");
    const base = path.join(dir, ".env");
    if (fs.existsSync(local)) dotenvConfig({ path: local });
    if (fs.existsSync(base)) dotenvConfig({ path: base });
    if (fs.existsSync(local) || fs.existsSync(base)) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
})();

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Remove trailing photo-sequence markers like "(1)", "(2)" before matching
function stripSequence(name: string): string {
  return name.replace(/[\(\[]\d+[\)\]]\s*$/, "").trim();
}

// Split into tokens on non-alphanumeric chars and also on letter↔digit boundaries
function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

// Compact form strips all separators — catches "panavise" ↔ "pana-vise"
function compact(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function scoreMatch(filename: string, title: string): number {
  const ft = tokenize(filename);
  const tt = new Set(tokenize(title));
  const overlap = ft.filter((t) => tt.has(t)).length;
  const tokenScore = overlap / ft.length;

  // Compact substring bonus: catches merged words like "panavise" ↔ "pana-vise"
  const fc = compact(filename);
  const tc = compact(title);
  const compactBonus = fc.length >= 6 && (fc.includes(tc) || tc.includes(fc)) ? 0.2 : 0;

  return Math.min(1, tokenScore + compactBonus);
}

const SCORE_THRESHOLD = 0.55;

async function main() {
  const folderArg = process.argv[2];
  if (!folderArg) {
    console.error("Usage: npm run upload-images -- /path/to/images");
    process.exit(1);
  }

  const folder = path.resolve(folderArg);
  if (!fs.existsSync(folder)) {
    console.error(`Folder not found: ${folder}`);
    process.exit(1);
  }

  const missing = [];
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && !process.env.CLOUDINARY_URL)
    missing.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or CLOUDINARY_URL");
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (missing.length) {
    console.error("Missing env vars:", missing.join(", "));
    process.exit(1);
  }

  // Always configure explicitly — SDK may have initialized before dotenv ran
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const machines = await prisma.machine.findMany({
    select: { id: true, slug: true, title: true, images: true },
  });

  // In-memory accumulator so multiple files for the same listing stack correctly
  type ImageEntry = { cloudinaryId: string; altText: string; sortOrder: number };
  const accumulated = new Map<string, ImageEntry[]>(
    machines.map((m) => [m.id, (m.images as ImageEntry[]) ?? []])
  );

  const files = fs
    .readdirSync(folder)
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log("No image files found in", folder);
    await pool.end();
    return;
  }

  console.log(`\nFound ${files.length} image(s) — scoring against ${machines.length} listings\n`);

  const results = { uploaded: 0, skipped: 0, errors: 0 };

  for (const filename of files) {
    const nameWithoutExt = stripSequence(filename.replace(/\.[^.]+$/, ""));

    // Score all machines and pick the best
    const scored = machines
      .map((m) => ({ machine: m, score: scoreMatch(nameWithoutExt, m.title) }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];

    if (!best || best.score < SCORE_THRESHOLD) {
      console.log(`  SKIP  ${filename}  (best match: "${best?.machine.title ?? "none"}" @ ${(best?.score ?? 0).toFixed(2)})`);
      results.skipped++;
      continue;
    }

    const { machine } = best;
    const filepath = path.join(folder, filename);

    try {
      // Read from the in-memory accumulator, not the stale initial fetch
      const current = accumulated.get(machine.id) ?? [];

      const upload = await cloudinary.uploader.upload(filepath, {
        folder: "machines",
        use_filename: true,
        unique_filename: true,
      });

      const updatedImages: ImageEntry[] = [
        ...current,
        {
          cloudinaryId: upload.public_id,
          altText: machine.title,
          sortOrder: current.length,
        },
      ];

      // Update both the DB and the in-memory accumulator
      accumulated.set(machine.id, updatedImages);
      await prisma.machine.update({
        where: { id: machine.id },
        data: { images: updatedImages },
      });

      console.log(
        `  OK    ${filename}  →  "${machine.title}"  (score: ${best.score.toFixed(2)}, id: ${upload.public_id})`
      );
      results.uploaded++;
    } catch (err) {
      console.error(`  ERROR ${filename}  —  ${(err as Error).message}`);
      results.errors++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Uploaded: ${results.uploaded}`);
  console.log(`  Skipped (no confident match): ${results.skipped}`);
  console.log(`  Errors: ${results.errors}`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
