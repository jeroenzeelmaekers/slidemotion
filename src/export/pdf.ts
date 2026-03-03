// ---------------------------------------------------------------------------
// PDF exporter — uses Playwright to screenshot each step, combines with pdf-lib
// ---------------------------------------------------------------------------

import { chromium, type Page } from "playwright";
import { PDFDocument } from "pdf-lib";
import { writeFile } from "node:fs/promises";
import { SELECTORS, type ExportOptions } from "./types.js";

type SlidePosition = {
  readonly slide: number;
  readonly step: number;
};

/**
 * Export a running slidemotion presentation to PDF.
 *
 * The presentation must be served (e.g. `bun run dev`) and the URL
 * reachable from this process. Each visual state (slide + step combo)
 * becomes one page in the PDF.
 */
export async function exportToPDF(options: ExportOptions): Promise<void> {
  const {
    url,
    output,
    width = 1920,
    height = 1080,
    timeout = 10_000,
    settleDelay = 100,
  } = options;

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for the slidemotion root to appear
    await page.waitForSelector(SELECTORS.root, { timeout, state: "attached" });

    const pdfDoc = await PDFDocument.create();
    const screenshots: Array<Uint8Array> = [];

    // Capture first state
    await waitForIdle(page, timeout);
    await page.waitForTimeout(settleDelay);
    screenshots.push(new Uint8Array(await screenshotRoot(page)));

    // Advance through all states
    let guard = 0;
    const maxPages = 500; // safety limit

    while (guard < maxPages) {
      const before = await readPosition(page);
      await page.keyboard.press("ArrowRight");

      // Wait briefly for action to dispatch
      await page.waitForTimeout(50);

      // Wait for idle (animation complete)
      await waitForIdle(page, timeout);
      await page.waitForTimeout(settleDelay);

      const after = await readPosition(page);

      // If position didn't change, we've reached the end
      if (after.slide === before.slide && after.step === before.step) {
        break;
      }

      screenshots.push(new Uint8Array(await screenshotRoot(page)));
      guard++;
    }

    // Build PDF
    for (const png of screenshots) {
      const image = await pdfDoc.embedPng(png);
      const pdfPage = pdfDoc.addPage([image.width, image.height]);
      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    await writeFile(output, pdfBytes);

    console.log(`Exported ${screenshots.length} pages to ${output}`);
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function waitForIdle(page: Page, timeout: number): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const isIdle = await page.evaluate((sel) => {
      const root = document.querySelector(sel);
      return root !== null && root.hasAttribute("data-slidemotion-idle");
    }, SELECTORS.root);

    if (isIdle) return;
    await page.waitForTimeout(50);
  }
  throw new Error(`Timed out waiting for idle after ${timeout}ms`);
}

async function readPosition(page: Page): Promise<SlidePosition> {
  const result = await page.evaluate(
    (sel) => {
      const root = document.querySelector(sel.root);
      if (!root) return { slide: -1, step: -1 };
      return {
        slide: Number(root.getAttribute(sel.currentSlide) ?? -1),
        step: Number(root.getAttribute(sel.currentStep) ?? -1),
      };
    },
    SELECTORS,
  );
  return result;
}

async function screenshotRoot(page: Page): Promise<Buffer> {
  const root = page.locator(SELECTORS.root);
  return root.screenshot({ type: "png", animations: "disabled" });
}
