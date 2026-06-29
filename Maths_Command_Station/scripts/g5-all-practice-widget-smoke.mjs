/**
 * All-practice browser smoke + interaction audit.
 *
 * Scope:
 * - prep-practice.html through year6-practice.html
 * - best-effort single interaction for each detected widget/tool
 * - console/page error capture
 *
 * Exit policy:
 * - FAIL on page load failures, console/page errors, or hard interaction failures
 * - NOT_COVERED widgets are reported but do not fail the run
 */
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const TARGET_PAGES = [
  'prep-practice.html',
  'year1-practice.html',
  'year2-practice.html',
  'year3-practice.html',
  'year4-practice.html',
  'year5-practice.html',
  'year6-practice.html',
];

const WIDGETS = [
  'number-track',
  'number-line',
  'ten-frame',
  'place-value-blocks',
  'fraction-bars',
  'array-builder',
  'counters',
  'number-pad',
  'analog-clock',
  'ruler',
  'balance-scale',
  'capacity-jug',
  'coordinate-plotter',
  'shape-builder',
  'transform-board',
  'pattern-blocks',
  'sorting-table',
  'column-graph',
  'marble-bag',
  'spinner',
];

function emptyCoverageState() {
  const state = {};
  WIDGETS.forEach((w) => {
    state[w] = 'NOT_COVERED';
  });
  state['prompt-audio'] = 'NOT_COVERED';
  return state;
}

async function detectWidgets(page) {
  return page.evaluate(() => {
    const has = (sel) => !!document.querySelector(sel);
    const widgets = [];
    if (has('.mcs-number-track')) widgets.push('number-track');
    if (has('.mcs-number-line')) widgets.push('number-line');
    if (has('.mcs-ten-frame')) widgets.push('ten-frame');
    if (has('.mcs-place-value-blocks')) widgets.push('place-value-blocks');
    if (has('.mcs-fraction-bars')) widgets.push('fraction-bars');
    if (has('.mcs-array-builder')) widgets.push('array-builder');
    if (has('.mcs-counters')) widgets.push('counters');
    if (has('.mcs-number-pad')) widgets.push('number-pad');
    if (has('.mcs-analog-clock')) widgets.push('analog-clock');
    if (has('.mcs-ruler')) widgets.push('ruler');
    if (has('.mcs-balance-scale')) widgets.push('balance-scale');
    if (has('.mcs-capacity-jug')) widgets.push('capacity-jug');
    if (has('.mcs-coordinate-plotter') || has('.mcs-alpha-grid')) widgets.push('coordinate-plotter');
    if (has('.mcs-shape-builder')) widgets.push('shape-builder');
    if (has('.mcs-transform-board')) widgets.push('transform-board');
    if (has('.mcs-pattern-blocks')) widgets.push('pattern-blocks');
    if (has('.mcs-sorting-table')) widgets.push('sorting-table');
    if (has('.mcs-column-graph')) widgets.push('column-graph');
    if (has('.mcs-marble-bag')) widgets.push('marble-bag');
    if (has('.mcs-spinner-widget')) widgets.push('spinner');
    return widgets;
  });
}

async function clickCenter(page, selector) {
  const loc = page.locator(selector).first();
  if ((await loc.count()) === 0) return false;
  const box = await loc.boundingBox();
  if (!box) return false;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  return true;
}

async function tryClick(page, selector) {
  const loc = page.locator(selector).first();
  if ((await loc.count()) === 0) return false;
  await loc.click({ timeout: 1500 });
  return true;
}

const INTERACTIONS = {
  'number-track': async (page) =>
    (await tryClick(page, '.mcs-number-track button')) ||
    (await clickCenter(page, '.mcs-number-track-board')),
  'number-line': async (page) =>
    (await tryClick(page, '.mcs-number-line-hop-btn')) ||
    (await clickCenter(page, '.mcs-number-line-board')),
  'ten-frame': async (page) =>
    (await tryClick(page, '.mcs-ten-frame-replay')) ||
    (await clickCenter(page, '.mcs-ten-frame-board, .mcs-ten-frame-double-board')),
  'place-value-blocks': async (page) =>
    (await tryClick(page, '.mcs-place-value-blocks-btn')) ||
    (await clickCenter(page, '.mcs-place-value-blocks-board')),
  'fraction-bars': async (page) =>
    (await tryClick(page, '.mcs-fraction-bars-reset')) ||
    (await clickCenter(page, '.mcs-fraction-bars-board')),
  'array-builder': async (page) => clickCenter(page, '.mcs-array-builder-board, .mcs-array-builder'),
  'counters': async (page) =>
    (await tryClick(page, '.mcs-counters-reset')) ||
    (await clickCenter(page, '.mcs-counters-board')),
  'number-pad': async (page) => tryClick(page, '.mcs-number-pad-key'),
  'analog-clock': async (page) => clickCenter(page, '.mcs-analog-clock-board'),
  ruler: async (page) => clickCenter(page, '.mcs-ruler-board'),
  'balance-scale': async (page) => clickCenter(page, '.mcs-balance-scale-board'),
  'capacity-jug': async (page) => clickCenter(page, '.mcs-capacity-jug-board'),
  'coordinate-plotter': async (page) =>
    clickCenter(page, '.mcs-coordinate-plotter-board, .mcs-alpha-grid-board'),
  'shape-builder': async (page) => clickCenter(page, '.mcs-shape-builder-board'),
  'transform-board': async (page) =>
    (await tryClick(page, '.mcs-transform-btn')) || (await clickCenter(page, '.mcs-transform-board-canvas')),
  'pattern-blocks': async (page) =>
    (await tryClick(page, '.mcs-pattern-blocks-reset')) || (await clickCenter(page, '.mcs-pattern-blocks-board')),
  'sorting-table': async (page) =>
    (await tryClick(page, '.mcs-sorting-table-reset')) || (await clickCenter(page, '.mcs-sorting-table-board')),
  'column-graph': async (page) =>
    (await tryClick(page, '.mcs-column-graph-step')) || (await clickCenter(page, '.mcs-column-graph-board')),
  'marble-bag': async (page) => clickCenter(page, '.mcs-marble-bag-board'),
  spinner: async (page) =>
    (await tryClick(page, '.mcs-run-trials-btn')) || (await clickCenter(page, '.mcs-spinner-visual')),
};

async function tickQuestionFlow(page) {
  const submit = page.locator('#btn-prac-submit');
  const next = page.locator('#btn-prac-next');
  if ((await submit.count()) && (await submit.isVisible())) {
    try {
      await submit.click({ timeout: 1500 });
      await page.waitForTimeout(250);
    } catch {}
  }
  if ((await next.count()) && (await next.isVisible())) {
    try {
      await next.click({ timeout: 1500 });
      await page.waitForTimeout(350);
    } catch {}
  }
}

async function runPage(pageName, browser) {
  const url = pathToFileURL(join(root, pageName)).href;
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message || e}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });

  const coverage = emptyCoverageState();
  const interactionFailures = [];
  let loadOk = true;

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    loadOk = false;
    errors.push(`load-failure: ${String(e.message || e)}`);
  }

  if (loadOk) {
    await page.waitForTimeout(1000);
    const tabs = page.locator('.selector-tab');
    const tabCount = await tabs.count();

    for (let ti = 0; ti < tabCount; ti += 1) {
      const tab = tabs.nth(ti);
      const disabled = await tab.isDisabled().catch(() => false);
      if (disabled) continue;
      await tab.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(350);

      for (let q = 0; q < 5; q += 1) {
        if ((await page.locator('#btn-prompt-audio').count()) > 0) {
          const audioBtn = page.locator('#btn-prompt-audio');
          if (await audioBtn.isVisible().catch(() => false)) {
            await audioBtn.click({ timeout: 1200 }).catch(() => {});
            coverage['prompt-audio'] = 'COVERED';
          }
        }

        const seen = await detectWidgets(page);
        for (const widget of seen) {
          if (coverage[widget] === 'COVERED' || coverage[widget] === 'FAILED_INTERACTION') continue;
          const handler = INTERACTIONS[widget];
          if (!handler) continue;
          try {
            const ok = await handler(page);
            if (ok) {
              coverage[widget] = 'COVERED';
            } else if (coverage[widget] !== 'COVERED') {
              coverage[widget] = 'NOT_COVERED';
            }
          } catch (e) {
            coverage[widget] = 'FAILED_INTERACTION';
            interactionFailures.push(`${widget}: ${String(e.message || e)}`);
          }
        }

        await tickQuestionFlow(page);
      }
    }
  }

  await page.close();
  return { pageName, url, loadOk, errors, coverage, interactionFailures };
}

function summarize(results) {
  const widgetSummary = emptyCoverageState();
  Object.keys(widgetSummary).forEach((k) => {
    widgetSummary[k] = 'NOT_COVERED';
  });

  let hardFailCount = 0;
  for (const r of results) {
    if (!r.loadOk || r.errors.length > 0) hardFailCount += 1;
    if (r.interactionFailures.length > 0) hardFailCount += 1;
    Object.entries(r.coverage).forEach(([widget, status]) => {
      if (status === 'FAILED_INTERACTION') widgetSummary[widget] = 'FAILED_INTERACTION';
      else if (status === 'COVERED' && widgetSummary[widget] === 'NOT_COVERED') widgetSummary[widget] = 'COVERED';
    });
  }

  return { hardFailCount, widgetSummary };
}

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.log('FAIL — playwright not installed');
    process.exit(1);
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const results = [];

  for (const pageName of TARGET_PAGES) {
    // eslint-disable-next-line no-await-in-loop
    const res = await runPage(pageName, browser);
    results.push(res);
  }

  await browser.close();

  for (const r of results) {
    console.log(`=== ${r.pageName} ===`);
    console.log(`URL: ${r.url}`);
    console.log(`${r.loadOk ? 'PASS' : 'FAIL'} — page load`);
    if (r.errors.length) {
      console.log(`FAIL — console/page errors (${r.errors.length})`);
      r.errors.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
    } else {
      console.log('PASS — no console/page errors');
    }
    if (r.interactionFailures.length) {
      console.log(`FAIL — interaction failures (${r.interactionFailures.length})`);
      r.interactionFailures.slice(0, 10).forEach((e) => console.log(`  - ${e}`));
    } else {
      console.log('PASS — no hard interaction failures');
    }
    const covered = Object.entries(r.coverage)
      .filter(([, status]) => status === 'COVERED')
      .map(([k]) => k);
    console.log(`Covered on page (${covered.length}): ${covered.join(', ') || 'none'}`);
    console.log('');
  }

  const { hardFailCount, widgetSummary } = summarize(results);
  console.log('=== Widget Coverage Summary ===');
  Object.entries(widgetSummary).forEach(([widget, status]) => {
    console.log(`${status} — ${widget}`);
  });
  const notCovered = Object.entries(widgetSummary)
    .filter(([, s]) => s === 'NOT_COVERED')
    .map(([k]) => k);
  if (notCovered.length) {
    console.log('\nUncovered widgets/tools:');
    notCovered.forEach((w) => console.log(`- ${w}`));
  }

  console.log('\n=== Final Result ===');
  if (hardFailCount > 0) {
    console.log(`FAIL — ${hardFailCount} hard failure group(s) detected`);
    process.exitCode = 1;
  } else {
    console.log('PASS — all pages loaded cleanly and no hard interaction failures');
    process.exitCode = 0;
  }
}

main();

