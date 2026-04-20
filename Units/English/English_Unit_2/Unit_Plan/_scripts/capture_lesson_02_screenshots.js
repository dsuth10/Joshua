/**
 * Serves Cyclones/ locally and captures hub + Cyclone Tracy sub-page screenshots for Lesson 2 slides.
 * Run from Unit_Plan/_scripts: node capture_lesson_02_screenshots.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const CYCLONES_ROOT = path.resolve(__dirname, "../../Cyclones");
const OUT_DIR = path.resolve(__dirname, "../Lesson_02_Screenshots");
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

/** Clip screenshot from top of start element to bottom of end element (page coordinates). */
async function screenshotBetween(page, outPath, startLocator, endLocator, pad = { top: 8, bottom: 12 }) {
  const top = await startLocator.boundingBox();
  const bottom = await endLocator.boundingBox();
  if (!top || !bottom) throw new Error("screenshotBetween: missing bounding box");
  const y = top.y - pad.top;
  const h = bottom.y + bottom.height - y + pad.bottom;
  const clip = { x: Math.max(0, top.x - 24), y: Math.max(0, y), width: top.width + 48, height: h };
  await page.screenshot({ path: outPath, clip });
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

  const editorial = page.locator("#cyclones .max-w-7xl > .mb-16.max-w-xl").first();
  await editorial.screenshot({ path: path.join(OUT_DIR, "hub_editorial_intro.png") });

  const cardGrid = page.locator("#cyclones .grid.grid-cols-1.lg\\:grid-cols-2").first();
  await cardGrid.screenshot({ path: path.join(OUT_DIR, "hub_card_grid.png") });

  const stats = page.locator("section.stats-strip").first();
  await stats.screenshot({ path: path.join(OUT_DIR, "hub_stats.png") });

  const about = page.locator("section#about").first();
  await about.screenshot({ path: path.join(OUT_DIR, "hub_about_evidence.png") });

  // Cyclone Tracy sub-page
  const tracyUrl = `http://127.0.0.1:${PORT}/Cyclone_Tracy/index.html`;
  await page.goto(tracyUrl, { waitUntil: "networkidle" });
  await revealAll(page);

  const tracyHero = page.locator("body > header.relative").first();
  await tracyHero.screenshot({ path: path.join(OUT_DIR, "tracy_hero.png") });

  const article = page.locator("article.editorial-main");
  const introStart = article.locator("p.drop-cap").first();
  const introEnd = article.locator("p").nth(2);
  await introStart.scrollIntoViewIfNeeded();
  await revealAll(page);
  await screenshotBetween(page, path.join(OUT_DIR, "tracy_intro.png"), introStart, introEnd);

  const hSound = page.getByRole("heading", { name: "The Sound of Destruction" });
  const hNavy = page.getByRole("heading", { name: "Operation Navy Help" });
  await hSound.scrollIntoViewIfNeeded();
  await revealAll(page);
  await screenshotBetween(page, path.join(OUT_DIR, "tracy_section_sound.png"), hSound, hNavy, {
    top: 6,
    bottom: 4,
  });

  const lastArticleP = article.locator("> p").last();
  await hNavy.scrollIntoViewIfNeeded();
  await lastArticleP.scrollIntoViewIfNeeded();
  await revealAll(page);
  await screenshotBetween(page, path.join(OUT_DIR, "tracy_section_navy.png"), hNavy, lastArticleP);

  const sidebar = page.locator("aside.editorial-sidebar-right").first();
  await sidebar.scrollIntoViewIfNeeded();
  await revealAll(page);
  await sidebar.screenshot({ path: path.join(OUT_DIR, "tracy_sidebar_facts.png") });

  await browser.close();
  server.close();

  console.log("Screenshots written to", OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
