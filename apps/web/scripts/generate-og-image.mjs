import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200;
const H = 630;

const background = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="115%" r="85%">
      <stop offset="0%" stop-color="#5b3a7a"/>
      <stop offset="45%" stop-color="#0b1020"/>
      <stop offset="80%" stop-color="#000"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#fff">Data and tools that make AI</text>
  <text x="80" y="385" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#fff">understand Africa.</text>
  <text x="80" y="460" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#ffffffb3">In its languages, its logic, and its lived reality.</text>
  <text x="80" y="560" font-family="Courier New, monospace" font-size="22" letter-spacing="6" fill="#f5a35c">ADARA AI LAB</text>
</svg>`);

const logo = await sharp(join(root, "public/assets/adara-logo-on-dark.png"))
  .resize({ height: 72 })
  .toBuffer();

await sharp(background)
  .composite([{ input: logo, top: 90, left: 80 }])
  .png()
  .toFile(join(root, "public/og-image.png"));

console.log("og-image.png written");
