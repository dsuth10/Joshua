const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const lessonDir = path.resolve(__dirname, "..");
const presentationPath = path.join(
  lessonDir,
  "Lesson_14_GBR_Year3_Presentation.html"
);
const screenshotDir = path.resolve(
  lessonDir,
  "..",
  ".qa",
  "year3-presentation"
);

async function inspectViewport(page, width, height) {
  await page.setViewportSize({ width, height });
  const results = [];
  const slideCount = await page.locator(".slide").count();

  for (let index = 0; index < slideCount; index += 1) {
    const result = await page.evaluate((slideIndex) => {
      window.show(slideIndex);
      const slide = document.querySelectorAll(".slide")[slideIndex];
      const slideBody = slide.querySelector(".slide-body");
      const slideRect = slide.getBoundingClientRect();
      const visibleElements = [...slide.querySelectorAll("h1,h2,h3,p,li,button,img,.question-bar,.shared")]
        .filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        })
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            className: element.className,
            top: Math.round(rect.top - slideRect.top),
            left: Math.round(rect.left - slideRect.left),
            bottom: Math.round(rect.bottom - slideRect.top),
            right: Math.round(rect.right - slideRect.left),
          };
        });

      return {
        slide: slideIndex + 1,
        horizontalOverflow: slide.scrollWidth - slide.clientWidth,
        verticalOverflow: slide.scrollHeight - slide.clientHeight,
        bodyOverflow: slideBody ? slideBody.scrollHeight - slideBody.clientHeight : 0,
        visibleElements,
      };
    }, index);
    results.push(result);
  }

  const failures = results.filter(
    (result) =>
      result.horizontalOverflow > 1 ||
      result.verticalOverflow > 1 ||
      result.bodyOverflow > 1 ||
      result.visibleElements.some(
        (item) =>
          item.top < -1 ||
          item.left < -1 ||
          item.bottom > height - 58 ||
          item.right > width + 1
      )
  );

  return { width, height, failures };
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
      if (document.fonts?.ready) await document.fonts.ready;
    });

    const sourceAudit = await page.evaluate(() => {
      const slides = [...document.querySelectorAll(".slide")];
      return {
        slideCount: slides.length,
        taskPanels: document.querySelectorAll(".task-panel").length,
        notesWithAllFields: slides.filter((slide) =>
          ["DO:", "WORK:", "RECORD:", "FINISH:", "CHECK:"].every((field) =>
            (slide.dataset.notes || "").includes(field)
          )
        ).length,
        unloadedImages: [...document.images]
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
      };
    });

    const viewports = [
      await inspectViewport(page, 1920, 1080),
      await inspectViewport(page, 1280, 720),
      await inspectViewport(page, 1366, 768),
    ];

    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.evaluate(() => window.show(5));
    const claimChoices = page.locator('[data-choice-group="reef-claim"] .choice');
    await claimChoices.nth(0).click();
    const incorrectFeedback = await page
      .locator('[data-choice-group="reef-claim"] + .feedback')
      .textContent();
    await claimChoices.nth(1).click();
    const correctFeedback = await page
      .locator('[data-choice-group="reef-claim"] + .feedback')
      .textContent();
    await page.locator("#resetBtn").click();
    const resetChoiceCount = await page.locator(".slide.active .choice.correct, .slide.active .choice.incorrect").count();

    await page.evaluate(() => window.show(6));
    await page.locator('[data-reveal="bleachReveal"]').click();
    const revealShown = await page.locator("#bleachReveal").evaluate((node) => node.classList.contains("shown"));
    await page.locator("#resetBtn").click();
    const revealReset = await page.locator("#bleachReveal").evaluate((node) => !node.classList.contains("shown"));

    await page.evaluate(() => window.show(12));
    await page.locator("#timerStart").click();
    await page.waitForTimeout(1150);
    const timerMoved = (await page.locator("#timerDisplay").textContent()) !== "08:00";
    await page.locator("#timerReset").click();
    const timerReset = (await page.locator("#timerDisplay").textContent()) === "08:00";

    await page.evaluate(() => window.show(0));
    await page.keyboard.press("ArrowRight");
    const keyboardMoved = await page.evaluate(() =>
      document.querySelectorAll(".slide")[1].classList.contains("active")
    );

    await page.locator("#notesBtn").click();
    const notesAudit = await page.evaluate(() => {
      const panel = document.querySelector("#notes");
      const text = document.querySelector("#notesText")?.textContent || "";
      return {
        open: panel.classList.contains("open"),
        horizontalOverflow: panel.scrollWidth - panel.clientWidth,
        hasAllFields: ["DO:", "WORK:", "RECORD:", "FINISH:", "CHECK:"].every((field) =>
          text.includes(field)
        ),
      };
    });
    await page.locator("#notesClose").click();

    for (let index = 0; index < sourceAudit.slideCount; index += 1) {
      await page.evaluate((slideIndex) => window.show(slideIndex), index);
      await page.screenshot({
        path: path.join(
          screenshotDir,
          `slide-${String(index + 1).padStart(2, "0")}.png`
        ),
      });
    }

    const failedViewports = viewports.filter((item) => item.failures.length);
    const interactionAudit = {
      incorrectFeedback,
      correctFeedback,
      resetChoiceCount,
      revealShown,
      revealReset,
      timerMoved,
      timerReset,
      keyboardMoved,
    };

    if (
      sourceAudit.slideCount !== 15 ||
      sourceAudit.taskPanels !== 0 ||
      sourceAudit.notesWithAllFields !== 15 ||
      sourceAudit.unloadedImages.length ||
      failedViewports.length ||
      !incorrectFeedback?.includes("Try again") ||
      !correctFeedback?.includes("Yes.") ||
      resetChoiceCount !== 0 ||
      !revealShown ||
      !revealReset ||
      !timerMoved ||
      !timerReset ||
      !keyboardMoved ||
      !notesAudit.open ||
      notesAudit.horizontalOverflow > 1 ||
      !notesAudit.hasAllFields ||
      errors.length
    ) {
      throw new Error(
        JSON.stringify(
          {
            sourceAudit,
            failedViewports,
            interactionAudit,
            notesAudit,
            errors,
          },
          null,
          2
        )
      );
    }

    console.log("PASS: 15 slides checked at 1920x1080, 1280x720 and 1366x768.");
    console.log("PASS: notes, keyboard navigation, feedback, retry, reset, reveal and timer paths.");
    console.log(`Screenshots: ${screenshotDir}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

