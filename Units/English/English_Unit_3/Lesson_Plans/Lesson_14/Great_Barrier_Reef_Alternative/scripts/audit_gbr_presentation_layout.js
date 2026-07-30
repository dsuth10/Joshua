const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const lessonDir = path.resolve(__dirname, "..");
const presentationPath = path.join(
  lessonDir,
  "Lesson_14_GBR_Persuasive_Presentation.html"
);
const screenshotDir = path.resolve(
  lessonDir,
  "../../../../../../output/playwright/gbr-presentation-qa"
);

async function inspectViewport(page, width, height) {
  await page.setViewportSize({ width, height });
  const results = [];

  for (let index = 0; index < 16; index += 1) {
    const result = await page.evaluate((slideIndex) => {
      const slides = [...document.querySelectorAll(".slide")];
      slides.forEach((slide, index) =>
        slide.classList.toggle("active", index === slideIndex)
      );
      const slide = slides[slideIndex];
      const body = slide.querySelector(".slide-body");
      const slideRect = slide.getBoundingClientRect();
      const visibleChildren = [...slide.children].filter((child) => {
        const style = getComputedStyle(child);
        return style.display !== "none" && style.position !== "absolute";
      });
      const childBounds = visibleChildren.map((child) => {
        const rect = child.getBoundingClientRect();
        return {
          className: child.className,
          top: Math.round(rect.top - slideRect.top),
          bottom: Math.round(rect.bottom - slideRect.top),
        };
      });

      return {
        slide: slideIndex + 1,
        horizontalOverflow: slide.scrollWidth - slide.clientWidth,
        verticalOverflow: slide.scrollHeight - slide.clientHeight,
        bodyOverflow: body ? body.scrollHeight - body.clientHeight : 0,
        childBounds,
      };
    }, index);
    results.push(result);
  }

  const failures = results.filter(
    (result) =>
      result.horizontalOverflow > 1 ||
      result.verticalOverflow > 1 ||
      result.bodyOverflow > 1 ||
      result.childBounds.some((bound) => bound.top < -1 || bound.bottom > height - 64)
  );

  return { width, height, results, failures };
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(pathToFileURL(presentationPath).href, { waitUntil: "networkidle" });
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
    });

    const sourceAudit = await page.evaluate(() => {
      const taskNotes = [...document.querySelectorAll(".slide")].filter((slide) =>
        slide.dataset.notes?.includes("STUDENT TASK")
      );
      return {
        slideCount: document.querySelectorAll(".slide").length,
        taskPanels: document.querySelectorAll(".task-panel").length,
        taskNotes: taskNotes.length,
        unloadedImages: [...document.images]
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
      };
    });

    const audits = [
      await inspectViewport(page, 1920, 1080),
      await inspectViewport(page, 1280, 720),
    ];

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.evaluate(() => {
      show(2);
    });
    await page.screenshot({
      path: path.join(screenshotDir, "mission-slide.png"),
    });

    await page.locator("#notesBtn").click();
    const notesAudit = await page.evaluate(() => {
      const notes = document.querySelector("#notes");
      const text = document.querySelector("#notesText")?.textContent || "";
      return {
        open: notes?.classList.contains("open"),
        horizontalOverflow: notes ? notes.scrollWidth - notes.clientWidth : null,
        hasAllFields: ["DO:", "WORK:", "RECORD:", "FINISH:", "CHECK:"].every(
          (field) => text.includes(field)
        ),
      };
    });
    await page.screenshot({
      path: path.join(screenshotDir, "mission-notes-open.png"),
    });

    const failedViewports = audits.filter((audit) => audit.failures.length);
    if (
      sourceAudit.slideCount !== 16 ||
      sourceAudit.taskPanels !== 0 ||
      sourceAudit.taskNotes !== 15 ||
      sourceAudit.unloadedImages.length ||
      failedViewports.length ||
      !notesAudit.open ||
      notesAudit.horizontalOverflow > 1 ||
      !notesAudit.hasAllFields ||
      errors.length
    ) {
      throw new Error(
        JSON.stringify(
          { sourceAudit, failedViewports, notesAudit, errors },
          null,
          2
        )
      );
    }

    console.log("PASS: 16 slides checked at 1920x1080 and 1280x720.");
    console.log("PASS: no projected task panels; 15 task blocks moved into notes.");
    console.log("PASS: Notes popup opens with all five task fields and no horizontal overflow.");
    console.log(`Screenshots: ${screenshotDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
