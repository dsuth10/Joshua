/**
 * Serves Cyclones/ locally and captures hub-page aspect screenshots for Lesson 1 slides.
 * Run from Unit_Plan/_scripts: npm run capture
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const CYCLONES_ROOT = path.resolve(__dirname, "../../Cyclones");
const OUT_DIR = path.resolve(__dirname, "../Lesson_01_Screenshots");
const PORT = 9876;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

function safePath(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p === "/" || p === "") p = "/index.html";
  const rel = p.replace(/^\/+/, "");
  const full = path.join(CYCLONES_ROOT, rel);
  if (!full.startsWith(CYCLONES_ROOT)) return null;
  return full;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const full = safePath(req.url || "/");
      if (!full || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.writeHead(full && fs.existsSync(full) && fs.statSync(full).isDirectory() ? 403 : 404);
        res.end();
        return;
      }
      const ext = path.extname(full).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(full).pipe(res);
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function revealAll(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  });
  await page.waitForTimeout(800);
}

async function main() {
  if (!fs.existsSync(CYCLONES_ROOT)) {
    console.error("Cyclones folder not found:", CYCLONES_ROOT);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const base = `http://127.0.0.1:${PORT}/index.html`;
  await page.goto(base, { waitUntil: "networkidle" });
  await revealAll(page);

  // Aspect 1 — Hero (first full-screen section after header)
  const hero = page.locator("header#main-nav + section").first();
  await hero.screenshot({ path: path.join(OUT_DIR, "hero.png") });

  // Aspect 2 — Stats strip
  const stats = page.locator("section.stats-strip").first();
  await stats.screenshot({ path: path.join(OUT_DIR, "stats.png") });

  // Aspect 3 — Editorial intro ("Australian Cyclone Events" block)
  const editorial = page.locator("#cyclones .max-w-7xl > .mb-16.max-w-xl").first();
  await editorial.screenshot({ path: path.join(OUT_DIR, "editorial_intro.png") });

  // Aspect 4 — Card grid
  const cardGrid = page.locator("#cyclones .grid.grid-cols-1.lg\\:grid-cols-2").first();
  await cardGrid.screenshot({ path: path.join(OUT_DIR, "card_grid.png") });

  // Aspect 5 — Cyclone Tracy card
  const tracy = page.locator('a[href="Cyclone_Tracy/index.html"]').first();
  await tracy.screenshot({ path: path.join(OUT_DIR, "card_tracy.png") });

  // Aspect 6 — Understanding Cyclones Through Evidence (#about)
  const about = page.locator("section#about").first();
  await about.screenshot({ path: path.join(OUT_DIR, "section_1.png") });

  // Aspect 7a — Top navigation
  const nav = page.locator("header#main-nav").first();
  await nav.screenshot({ path: path.join(OUT_DIR, "nav_header.png") });

  // Aspect 7b — Footer quick links
  await page.locator("footer.site-footer").scrollIntoViewIfNeeded();
  await revealAll(page);
  const foot = page.locator("footer.site-footer").first();
  await foot.screenshot({ path: path.join(OUT_DIR, "footer_links.png") });

  // Reference: full hub scroll (optional, for teacher prep)
  await page.goto(base, { waitUntil: "networkidle" });
  await revealAll(page);
  await page.screenshot({
    path: path.join(OUT_DIR, "full_page.png"),
    fullPage: true,
  });

  await browser.close();
  server.close();

  console.log("Screenshots written to", OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
