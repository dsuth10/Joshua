/**
 * TEMPLATE — Lesson NN screenshot capture.
 *
 * Copy to Units/English/English_Unit_2/Unit_Plan/_scripts/capture_lesson_NN_screenshots.js
 * then edit:
 *   - ARCHIVE_ROOT  (point at the archive folder for this lesson)
 *   - OUT_DIR       (Lesson_NN_Screenshots/)
 *   - ENTRY         (hub index.html or specific sub-page)
 *   - aspects[]     (selector + filename for each slide image)
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

// ==== EDIT PER LESSON =====================================================
const ARCHIVE_ROOT = path.resolve(__dirname, "../../Cyclones");               // e.g. ../../Floods
const OUT_DIR      = path.resolve(__dirname, "../Lesson_NN_Screenshots");    // replace NN
const ENTRY        = "/index.html";                                          // or /Cyclone_Tracy/index.html
const aspects = [
  // { file: "hero.png",         selector: "header#main-nav + section" },
  // { file: "stats.png",        selector: "section.stats-strip" },
  // { file: "section_1.png",    selector: "section#about" },
];
// ==========================================================================

const PORT = 9876;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".json": "application/json",
};

function safePath(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p === "/" || p === "") p = "/index.html";
  const full = path.join(ARCHIVE_ROOT, p.replace(/^\/+/, ""));
  return full.startsWith(ARCHIVE_ROOT) ? full : null;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const full = safePath(req.url || "/");
      if (!full || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.writeHead(404); res.end(); return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(full).toLowerCase()] || "application/octet-stream" });
      fs.createReadStream(full).pipe(res);
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function revealAll(page) {
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible")));
  await page.waitForTimeout(800);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  await page.goto(`http://127.0.0.1:${PORT}${ENTRY}`, { waitUntil: "networkidle" });
  await revealAll(page);

  for (const a of aspects) {
    const loc = page.locator(a.selector).first();
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await revealAll(page);
    await loc.screenshot({ path: path.join(OUT_DIR, a.file) });
    console.log("Captured", a.file);
  }

  await page.screenshot({ path: path.join(OUT_DIR, "full_page.png"), fullPage: true });
  await browser.close();
  server.close();
  console.log("Done. Output:", OUT_DIR);
}

main().catch((e) => { console.error(e); process.exit(1); });
