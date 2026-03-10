#!/usr/bin/env node

/**
 * Generates sitemap.xml from the package index.
 * Run: node scripts/generate-sitemap.mjs
 * Output: public/sitemap.xml
 */

const BASE_URL = "https://pkgx.dev";

async function main() {
  // Fetch package index
  const rsp = await fetch("https://pkgx.dev/pkgs/index.json");
  if (!rsp.ok) throw new Error(`Failed to fetch index: ${rsp.statusText}`);
  const packages = await rsp.json();

  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/pkgs/", priority: "0.9", changefreq: "daily" },
    { loc: "/tea", priority: "0.7", changefreq: "monthly" },
    { loc: "/coinlist", priority: "0.6", changefreq: "monthly" },
    { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
    { loc: "/terms-of-use", priority: "0.3", changefreq: "yearly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static pages
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Package pages
  for (const pkg of packages) {
    const project = pkg.project;
    if (!project) continue;

    xml += `  <url>
    <loc>${BASE_URL}/pkgs/${project}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  // Write to public/sitemap.xml
  const fs = await import("node:fs");
  const path = await import("node:path");
  const outPath = path.join(import.meta.dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");

  console.log(`Generated sitemap.xml with ${staticPages.length + packages.length} URLs`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
