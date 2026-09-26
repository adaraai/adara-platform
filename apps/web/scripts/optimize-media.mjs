/**
 * Compress homepage images to WebP and re-encode videos for faster loads.
 * Writes *.min.mp4 so originals stay unlocked by the dev server.
 * Run: node scripts/optimize-media.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

const images = [
  { src: "assets/mission-voice.png", out: "assets/mission-voice.webp", width: 1200, quality: 78 },
  { src: "assets/trust-security.png", out: "assets/trust-security.webp", width: 1200, quality: 80 },
  { src: "assets/platform-bg.jpg", out: "assets/platform-bg.webp", width: 1920, quality: 72 },
  { src: "assets/news-bg.jpg", out: "assets/news-bg.webp", width: 1920, quality: 72 },
  { src: "assets/speech-banner.jpg", out: "assets/speech-banner.webp", width: 900, quality: 75 },
  { src: "assets/adara-logo-light.png", out: "assets/adara-logo-light.webp", width: 280, quality: 90 },
  { src: "assets/adara-logo-dark.png", out: "assets/adara-logo-dark.webp", width: 280, quality: 90 },
];

const videos = [
  {
    src: "assets/video/horizon-hero.mp4",
    out: "assets/video/horizon-hero.min.mp4",
    poster: "assets/video/horizon-hero-poster.webp",
    scale: "1280:-2",
    crf: "28",
    fps: "24",
  },
  {
    src: "assets/video/speech-card.mp4",
    out: "assets/video/speech-card.min.mp4",
    poster: "assets/video/speech-card-poster.webp",
    scale: "720:-2",
    crf: "30",
    fps: "24",
  },
  {
    src: "assets/video/products-card.mp4",
    out: "assets/video/products-card.min.mp4",
    poster: "assets/video/products-card-poster.webp",
    scale: "720:-2",
    crf: "30",
    fps: "24",
  },
];

function mb(file) {
  return (fs.statSync(file).size / (1024 * 1024)).toFixed(2);
}

async function optimizeImages() {
  for (const item of images) {
    const input = path.join(publicDir, item.src);
    const output = path.join(publicDir, item.out);
    if (!fs.existsSync(input)) {
      console.warn("skip missing", item.src);
      continue;
    }
    if (fs.existsSync(output) && fs.statSync(output).mtimeMs > fs.statSync(input).mtimeMs) {
      console.log(`img  ${item.out} up to date (${mb(output)}MB)`);
      continue;
    }
    await sharp(input)
      .resize({ width: item.width, withoutEnlargement: true })
      .webp({ quality: item.quality, effort: 6 })
      .toFile(output);
    console.log(`img  ${item.src} ${mb(input)}MB → ${item.out} ${mb(output)}MB`);
  }
}

async function makePoster(videoPath, posterRel) {
  if (!ffmpegPath) return;
  const posterPath = path.join(publicDir, posterRel);
  const posterJpg = `${posterPath}.tmp.jpg`;
  const result = spawnSync(
    ffmpegPath,
    ["-y", "-ss", "0.4", "-i", videoPath, "-frames:v", "1", "-q:v", "4", posterJpg],
    { stdio: "ignore" },
  );
  if (result.status !== 0 || !fs.existsSync(posterJpg)) return;
  await sharp(posterJpg)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(posterPath);
  fs.unlinkSync(posterJpg);
  console.log(`poster ${posterRel} ${mb(posterPath)}MB`);
}

async function compressVideo({ src, out, poster, scale, crf, fps }) {
  const input = path.join(publicDir, src);
  const outPath = path.join(publicDir, out);
  if (!fs.existsSync(input)) {
    console.warn("skip missing", src);
    return;
  }
  if (!ffmpegPath) {
    console.warn("ffmpeg-static missing; skip video compress");
    return;
  }

  if (fs.existsSync(outPath) && fs.statSync(outPath).mtimeMs > fs.statSync(input).mtimeMs) {
    console.log(`vid  ${out} up to date (${mb(outPath)}MB)`);
    if (poster && !fs.existsSync(path.join(publicDir, poster))) {
      await makePoster(outPath, poster);
    }
    return;
  }

  const before = mb(input);
  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-i",
      input,
      "-vf",
      `scale=${scale},fps=${fps}`,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      crf,
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      outPath,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    console.error("ffmpeg failed for", src);
    return;
  }

  console.log(`vid  ${src} ${before}MB → ${out} ${mb(outPath)}MB`);
  if (poster) await makePoster(outPath, poster);
}

async function main() {
  console.log("Optimizing images…");
  await optimizeImages();
  console.log("Compressing videos…");
  for (const v of videos) {
    await compressVideo(v);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
