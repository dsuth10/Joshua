const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const articleDir = path.resolve(__dirname, "..");
const inputPath = path.join(articleDir, "Lesson_14_GBR_Reading_Article.html");
const outputPath = path.join(articleDir, "Lesson_14_GBR_Reading_Article.pdf");

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
      deviceScaleFactor: 1,
    });

    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(pathToFileURL(inputPath).href, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
              })
        )
      );
      if (document.fonts?.ready) await document.fonts.ready;
    });

    const audit = await page.evaluate(() => {
      const pages = [...document.querySelectorAll(".page")];
      const unloadedImages = [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src"));
      const overflow = pages
        .map((page, index) => ({
          page: index + 1,
          horizontal: page.scrollWidth - page.clientWidth,
          vertical: page.scrollHeight - page.clientHeight,
        }))
        .filter((item) => item.horizontal > 1 || item.vertical > 1);
      return {
        pageCount: pages.length,
        unloadedImages,
        overflow,
      };
    });

    if (audit.pageCount !== 6) {
      throw new Error(`Expected 6 article pages, found ${audit.pageCount}.`);
    }
    if (audit.unloadedImages.length) {
      throw new Error(`Images failed to load: ${audit.unloadedImages.join(", ")}`);
    }
    if (audit.overflow.length) {
      throw new Error(`Page overflow detected: ${JSON.stringify(audit.overflow)}`);
    }
    if (consoleErrors.length) {
      throw new Error(`Browser console errors: ${consoleErrors.join(" | ")}`);
    }

    await page.pdf({
      path: outputPath,
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      outline: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    console.log(`Built ${outputPath}`);
    console.log(`Layout audit: ${audit.pageCount} pages, no overflow, all images loaded.`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
