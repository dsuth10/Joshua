const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const lessonDir = path.resolve(__dirname, "..");
const inputPath = path.join(lessonDir, "Lesson_23_Borrow_Box_Reading_Article.html");
const outputPath = path.join(lessonDir, "Lesson_23_Borrow_Box_Reading_Article.pdf");

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(pathToFileURL(inputPath).href, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    const audit = await page.evaluate(() => ({
      pages: document.querySelectorAll(".page").length,
      overflow: [...document.querySelectorAll(".page")].map((p, i) => ({ page: i + 1, x: p.scrollWidth - p.clientWidth, y: p.scrollHeight - p.clientHeight })).filter(v => v.x > 1 || v.y > 1),
    }));
    if (audit.pages !== 2) throw new Error(`Expected two article pages, found ${audit.pages}.`);
    if (audit.overflow.length) throw new Error(`Article overflow: ${JSON.stringify(audit.overflow)}`);
    if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
    await page.pdf({ path: outputPath, format: "A4", preferCSSPageSize: true, printBackground: true, tagged: true, outline: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
    console.log(`Built ${outputPath}`);
    console.log("PASS: two A4 pages, no overflow, no browser errors.");
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
