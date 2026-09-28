import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://adaraai.xyz").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const newsSource = readFileSync(join(root, "src/data/news.ts"), "utf8");
const newsPosts = [...newsSource.matchAll(/slug:\s*"([^"]+)",\s*date:\s*"[^"]*",\s*isoDate:\s*"([^"]+)"/g)].map(
  ([, slug, isoDate]) => ({ path: `/news/${slug}`, lastmod: isoDate, priority: "0.7", changefreq: "monthly" }),
);

const docsSource = readFileSync(join(root, "src/docs/DocsRouter.tsx"), "utf8");
const docsPages = [...docsSource.matchAll(/<Route path="([a-z0-9-]+)"/g)].map(([, slug]) => ({
  path: `/docs/${slug}`,
  lastmod: today,
  priority: slug === "introduction" || slug === "quickstart" ? "0.8" : "0.6",
  changefreq: "weekly",
}));

const latestNews = newsPosts.map((p) => p.lastmod).sort().at(-1) ?? today;

const pages = [
  { path: "/", lastmod: today, priority: "1.0", changefreq: "weekly" },
  { path: "/news", lastmod: latestNews, priority: "0.8", changefreq: "weekly" },
  ...newsPosts,
  ...docsPages,
  { path: "/privacy", lastmod: today, priority: "0.3", changefreq: "yearly" },
  { path: "/terms", lastmod: today, priority: "0.3", changefreq: "yearly" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${pages.length} URLs (${newsPosts.length} news, ${docsPages.length} docs)`);
