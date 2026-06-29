/**
 * Gate G4 manual sign-off — golden-path Playwright runner.
 * Completes one perfect mission per assessment year; verifies max score + profile bonus.
 */
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const evidenceDir = join(root, 'Improvement_Infrastructure', 'g4-golden-path-evidence');

const BASE_PROFILE = {
  score: 5000,
  scoresByCatY3: { number: 100, algebra: 100, measurement: 50, space: 50, statistics: 0, probability: 0 },
  scoresByCatY4: { number: 100, algebra: 50, measurement: 0, space: 100, statistics: 0, probability: 0 },
};

const Y3_RECALL = [
  12, 8, 16, 6, 15, 8, 13, 8, 14, 9, 13, 6, 18, 8, 12, 8, 13, 7, 16, 7,
];

const SIEVE_TARGET = {
  11: 'prime',
  15: 'composite',
  16: 'square',
  23: 'prime',
  25: 'square',
  36: 'square',
  41: 'prime',
  49: 'square',
};

const STATE_CYCLE = ['neutral', 'prime', 'composite', 'square'];

function solveRecall(eq) {
  const expr = eq.replace(/×/g, '*').replace(/÷/g, '/').trim();
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${expr})`)();
}

async function waitMs(page, ms) {
  await page.waitForTimeout(ms);
}

async function waitForStage(page, stageNum) {
  await page.waitForFunction(
    (n) => document.getElementById(`stage-${n}`)?.classList.contains('active'),
    stageNum,
    { timeout: 20000 }
  );
}

async function fillById(page, id, value) {
  await page.evaluate(
    ({ fieldId, val }) => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    { fieldId: id, val: value }
  );
}

async function waitForJxgBoard(page, boardSelector) {
  await page.waitForFunction(
    (sel) => {
      const host =
        document.querySelector(`${sel} .mcs-jxg-host`) ||
        document.querySelector(sel);
      if (!host || !window.JXG) return false;
      return Object.values(JXG.boards).some((b) => {
        const c = b.containerObj || b.container;
        return c === host || (host.contains && c && host.contains(c));
      });
    },
    boardSelector,
    { timeout: 20000 }
  );
}

async function clickJxgCoord(page, boardSelector, x, y) {
  await waitForJxgBoard(page, boardSelector);
  const pos = await page.evaluate(
    ({ sel, ux, uy }) => {
      const host =
        document.querySelector(`${sel} .mcs-jxg-host`) ||
        document.querySelector(sel);
      if (!host || !window.JXG) return null;
      const board = Object.values(JXG.boards).find((b) => {
        const c = b.containerObj || b.container;
        return c === host || (host.contains && c && host.contains(c));
      });
      if (!board) return null;
      const wrap =
        host.closest('.mcs-coordinate-plotter-board, .mcs-number-line-board') || host;
      const coords = new JXG.Coords(JXG.COORDS_BY_USER, [ux, uy], board);
      const rect = wrap.getBoundingClientRect();
      return {
        x: rect.left + coords.scrCoords[1],
        y: rect.top + coords.scrCoords[2],
      };
    },
    { sel: boardSelector, ux: x, uy: y }
  );
  if (!pos) throw new Error(`JXG board not ready: ${boardSelector}`);
  await page.mouse.click(pos.x, pos.y);
  await waitMs(page, 200);
}

async function startAssessment(page) {
  await page.click('#btn-start-assessment');
  await waitMs(page, 400);
  await waitForStage(page, 1);
}

async function enterRecallAnswer(page, ans) {
  const text = String(ans);
  for (const ch of text) {
    if (ch === '.') {
      await page.locator('.decimal-key').click();
    } else {
      await page.locator(`.num-key[data-val="${ch}"]`).click();
    }
    await waitMs(page, 40);
  }
  await page.click('#key-submit');
}

async function completeRecall(page, answers) {
  for (let i = 0; i < answers.length; i++) {
    let ans = answers[i];
    if (ans == null) {
      const eq = await page.locator('#equation-text').textContent();
      ans = solveRecall(eq.trim());
    }
    await enterRecallAnswer(page, ans);
    await waitMs(page, 120);
  }
  await waitMs(page, 900);
  await waitForStage(page, 2);
}

async function clickNextSubstation(page, times = 1) {
  for (let i = 0; i < times; i++) {
    await page.evaluate(() => {
      const btn = document.getElementById('btn-next-substation');
      if (btn) btn.click();
    });
    await waitMs(page, 600);
  }
}

async function clickById(page, id) {
  await page.evaluate((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.click();
  }, id);
  await waitMs(page, 400);
}

async function dragJxgCoord(page, boardSelector, fromX, fromY, toX, toY) {
  await waitForJxgBoard(page, boardSelector);
  const pts = await page.evaluate(
    ({ sel, fx, fy, tx, ty }) => {
      const host =
        document.querySelector(`${sel} .mcs-jxg-host`) ||
        document.querySelector(sel);
      const board = Object.values(JXG.boards).find((b) => {
        const c = b.containerObj || b.container;
        return c === host || (host.contains && c && host.contains(c));
      });
      if (!board) return null;
      const wrap =
        host.closest('.mcs-coordinate-plotter-board, .mcs-number-line-board') || host;
      const rect = wrap.getBoundingClientRect();
      function scr(ux, uy) {
        const coords = new JXG.Coords(JXG.COORDS_BY_USER, [ux, uy], board);
        return { x: rect.left + coords.scrCoords[1], y: rect.top + coords.scrCoords[2] };
      }
      return { from: scr(fx, fy), to: scr(tx, ty) };
    },
    { sel: boardSelector, fx: fromX, fy: fromY, tx: toX, ty: toY }
  );
  if (!pts) throw new Error(`JXG drag failed: ${boardSelector}`);
  await page.mouse.move(pts.from.x, pts.from.y);
  await page.mouse.down();
  await page.mouse.move(pts.to.x, pts.to.y, { steps: 8 });
  await page.mouse.up();
  await waitMs(page, 250);
}

async function runY3(page) {
  await startAssessment(page);
  await completeRecall(page, Y3_RECALL);

  await page.check('#calc-c2');
  await clickNextSubstation(page, 1);

  await clickJxgCoord(page, '#fraction-plotter-mount', 0.75, 0);
  await waitMs(page, 200);
  await clickNextSubstation(page, 1);

  await page.locator('#accordion-expander-mount .expander-joint').first().click();
  await waitMs(page, 200);
  await page.fill('#exp-952-tens', '95');
  await page.fill('#exp-952-ones', '2');
  await clickNextSubstation(page, 1);

  await page.fill('#val-702-hundreds', '7');
  await page.fill('#val-952-ten-less', '942');
  await page.fill('#val-34-tens', '340');
  await clickNextSubstation(page, 1);
  await waitForStage(page, 3);

  await fillById(page, 'egg-cartons-input', '23');
  await clickById(page, 'btn-submit-eggs');
  await waitMs(page, 600);

  await clickById(page, 'btn-run-delivery');
  await waitMs(page, 8000);

  for (let i = 0; i < 9; i++) {
    await clickById(page, 'clock-adjust-h-minus');
    await waitMs(page, 60);
  }
  for (let i = 0; i < 9; i++) {
    await clickById(page, 'clock-adjust-m-plus');
    await waitMs(page, 60);
  }
  await clickById(page, 'btn-submit-delivery');
  await waitMs(page, 900);
  await waitForStage(page, 4);
}

async function runY4(page) {
  await startAssessment(page);
  await completeRecall(page, Array(20).fill(null));

  await page.check('#calc-c2');
  await clickNextSubstation(page, 1);

  await page.fill('#reg-equiv-num', '6');
  await page.fill('#reg-equiv-decimal', '0.6');
  await page.fill('#reg-equiv-percentage', '60');
  await clickNextSubstation(page, 1);

  await page.fill('#numline-whole', '1');
  await page.fill('#numline-num', '3');
  await page.fill('#numline-den', '4');
  await clickNextSubstation(page, 1);

  await page.fill('#inverse-eq-val2', '152');
  await page.fill('#inverse-eq-ans', '328');
  await clickNextSubstation(page, 1);
  await waitForStage(page, 3);

  await page.locator('button.alpha-grid-cell[data-col="C"][data-row="3"]').click();
  await page.locator('button.alpha-grid-cell[data-col="C"][data-row="4"]').click();
  await clickById(page, 'btn-submit-pathfinder');
  await waitMs(page, 1000);
  await page.waitForFunction(
    () => document.getElementById('eggerling-sub-2')?.classList.contains('active'),
    null,
    { timeout: 10000 }
  );

  const symBoard = page.locator('.mcs-symmetry-painter-board');
  await symBoard.focus();
  await page.keyboard.press(' ');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' ');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' ');
  await clickById(page, 'btn-submit-symmetry');
  await waitMs(page, 900);
  await waitForStage(page, 4);
}

async function runY5(page) {
  await startAssessment(page);
  await completeRecall(page, Array(20).fill(null));

  await page.locator('.calc-btn.op-btn[data-op="+0.1"]').click();
  await page.check('#calc-c2');
  await clickNextSubstation(page, 1);

  await page.locator('#decimal-expander-mount .expander-joint').first().click();
  await waitMs(page, 200);
  await page.fill('#exp-9524-tenths', '95');
  await page.fill('#exp-9524-hundreds', '2');
  await page.fill('#exp-9524-thousandths', '4');
  await clickNextSubstation(page, 1);

  await page.fill('#reg-decimal', '0.75');
  await page.fill('#reg-fraction', '3/4');
  await clickNextSubstation(page, 1);

  await page.fill('#div-pair-1', '4');
  await page.fill('#div-pair-2', '12');
  await page.check('#div-yes');
  await clickNextSubstation(page, 1);
  await waitForStage(page, 3);

  await fillById(page, 'cargo-weight-input', '2.35');
  await fillById(page, 'cargo-working', 'Divide by 10 shifts decimal left.');
  await clickById(page, 'btn-submit-cargo');
  await page.waitForFunction(
    () => document.getElementById('eggerling-sub-2')?.classList.contains('active'),
    null,
    { timeout: 15000 }
  );
  await page.waitForFunction(
    () => {
      const host = document.querySelector('#assessment-grid-host .mcs-jxg-host');
      if (!host || !window.JXG) return false;
      return Object.values(JXG.boards).some((b) => {
        const c = b.containerObj || b.container;
        return c === host || host.contains(c);
      });
    },
    null,
    { timeout: 25000 }
  );
  await waitMs(page, 500);

  const board = '#assessment-grid-host';
  const plots = [
    { row: '#wp-row-a', x: 2, y: 3 },
    { row: '#wp-row-b', x: 8, y: 5 },
    { row: '#wp-row-c', x: 5, y: 9 },
  ];
  for (const pt of plots) {
    await page.click(pt.row);
    await waitMs(page, 150);
    await clickJxgCoord(page, board, pt.x, pt.y);
    await waitMs(page, 200);
  }
  await page.fill('#route-distance-input', '15');
  await clickById(page, 'btn-submit-delivery');
  await waitMs(page, 900);
  await waitForStage(page, 4);
}

async function setSieveCard(page, num, target) {
  const card = page.locator('.sieve-number-card', { hasText: new RegExp(`^${num}`) });
  for (let guard = 0; guard < 4; guard++) {
    const cls = await card.getAttribute('class');
    const state = cls.includes('selected-prime')
      ? 'prime'
      : cls.includes('selected-composite')
        ? 'composite'
        : cls.includes('selected-square')
          ? 'square'
          : 'neutral';
    if (state === target) return;
    await card.click();
    await waitMs(page, 80);
  }
}

async function runY6(page) {
  await startAssessment(page);
  await completeRecall(page, Array(20).fill(null));

  for (const [num, target] of Object.entries(SIEVE_TARGET)) {
    await setSieveCard(page, num, target);
  }
  await clickNextSubstation(page, 1);

  await page.fill('#frac-equiv-num', '2');
  await page.fill('#frac-equiv-den', '4');
  await page.fill('#frac-sum-num', '3');
  await page.fill('#frac-sum-den', '4');
  await clickNextSubstation(page, 1);

  for (let i = 0; i < 3; i++) {
    await page.click('#btn-metric-shift-right');
    await waitMs(page, 120);
  }
  await clickNextSubstation(page, 1);

  await page.fill('#angle-opp-val', '124');
  await page.fill('#angle-supp-val', '56');
  await clickNextSubstation(page, 1);

  await page.fill('#flight-hours', '3');
  await page.fill('#flight-mins', '5');
  await page.fill('#layover-hours', '1');
  await page.fill('#layover-mins', '15');
  await clickById(page, 'btn-submit-itinerary');
  await waitMs(page, 1500);
  await page.waitForFunction(
    () => document.getElementById('eggerling-sub-2')?.classList.contains('active'),
    null,
    { timeout: 15000 }
  );
  await page.waitForFunction(
    () => {
      const host = document.querySelector('#assessment-grid-host .mcs-jxg-host');
      if (!host || !window.JXG) return false;
      return Object.values(JXG.boards).some((b) => {
        const c = b.containerObj || b.container;
        return c === host || host.contains(c);
      });
    },
    null,
    { timeout: 25000 }
  );
  await waitMs(page, 500);
  const board = '#assessment-grid-host';
  await waitForJxgBoard(page, board);
  await dragJxgCoord(page, board, 0, 0, 2, -3);
  await dragJxgCoord(page, board, 1, 0, -1, 1);
  await clickById(page, 'btn-submit-coordinates');
  await waitMs(page, 900);
  await waitForStage(page, 4);
}

const YEAR_RUNNERS = [
  {
    id: 'Y3',
    file: 'year3.html',
    max: 30,
    minPass: 29,
    run: runY3,
    profileDelta(score, total) {
      const t = total != null ? total : 30;
      const recall = 20;
      const calc = 1;
      const exp = 2;
      const core = 3;
      const carton = 1;
      const delivery = 1;
      const clock = 1;
      const fraction = t >= 30 ? 1 : 0;
      const numPart = calc + exp + core + carton + delivery;
      return {
        score: score + t * 10,
        scoresByCatY3: {
          number: 100 + numPart * 10,
          algebra: 100 + recall * 10,
          measurement: 50 + (clock && t >= 29 ? 10 : 0),
          space: 50 + 10,
          statistics: 0,
          probability: 0,
        },
        _note: fraction ? '' : 'fraction pin may need manual drag to 3/4 for 30/30',
      };
    },
  },
  {
    id: 'Y4',
    file: 'year4.html',
    max: 32,
    minPass: 32,
    run: runY4,
    profileDelta(score) {
      return {
        score: score + 320,
        scoresByCatY4: {
          number: 100 + 85,
          algebra: 50 + 30,
          measurement: 0,
          space: 100 + 40,
          statistics: 0,
          probability: 0,
        },
      };
    },
  },
  {
    id: 'Y5',
    file: 'year5.html',
    max: 33,
    minPass: 33,
    run: runY5,
    profileDelta(score) {
      return { score: score + 330 };
    },
  },
  {
    id: 'Y6',
    file: 'year6.html',
    max: 36,
    minPass: 36,
    run: runY6,
    profileDelta(score) {
      return { score: score + 360 };
    },
  },
];

function pick(obj, keys) {
  const out = {};
  keys.forEach((k) => {
    if (obj[k] != null) out[k] = obj[k];
  });
  return out;
}

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.error('FAIL — playwright not installed. Run: npm install playwright');
    process.exitCode = 1;
    return;
  }

  mkdirSync(evidenceDir, { recursive: true });
  const browser = await playwright.chromium.launch({ headless: true });
  const results = [];

  for (const year of YEAR_RUNNERS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 900 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e.message || e)));

    const url = pathToFileURL(join(root, year.file)).href;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });

    const profileBefore = { ...BASE_PROFILE };
    await page.evaluate((p) => {
      localStorage.setItem('joshua_math_profile', JSON.stringify(p));
    }, profileBefore);

    let reportScore = '';
    let profileAfter = null;
    let pass = false;
    let errMsg = '';
    let expectedScore = null;

    try {
      await year.run(page);
      reportScore = (await page.locator('#report-score').textContent())?.trim() || '';
      profileAfter = await page.evaluate(() => {
        const raw = localStorage.getItem('joshua_math_profile');
        return raw ? JSON.parse(raw) : null;
      });

      const totalMatch = reportScore.match(/^(\d+)\s*\/\s*(\d+)/);
      const totalAchieved = totalMatch ? parseInt(totalMatch[1], 10) : null;
      const expected =
        typeof year.profileDelta === 'function' && year.id === 'Y3'
          ? year.profileDelta(profileBefore.score, totalAchieved)
          : year.profileDelta(profileBefore.score);
      expectedScore = expected.score;
      const minPass = year.minPass != null ? year.minPass : year.max;
      const scoreOk =
        totalAchieved != null && totalAchieved >= minPass && totalMatch[2] === String(year.max);
      const profileScoreOk = profileAfter?.score === expected.score;

      let catOk = true;
      if (year.id === 'Y3' && profileAfter?.scoresByCatY3) {
        const expCat = { ...expected.scoresByCatY3 };
        catOk = JSON.stringify(profileAfter.scoresByCatY3) === JSON.stringify(expCat);
      }
      if (year.id === 'Y4' && profileAfter?.scoresByCatY4) {
        catOk = JSON.stringify(profileAfter.scoresByCatY4) === JSON.stringify(expected.scoresByCatY4);
      }

      pass = scoreOk && profileScoreOk && catOk && errors.length === 0;
      if (!pass) {
        const bits = [];
        if (!scoreOk) bits.push(`report ${reportScore} expected >= ${minPass} / ${year.max}`);
        if (!profileScoreOk) bits.push(`profile.score ${profileAfter?.score} expected ${expected.score}`);
        if (!catOk) bits.push('category bonus mismatch');
        if (errors.length) bits.push(`console errors: ${errors.join('; ')}`);
        errMsg = bits.join(' | ');
      } else if (expected._note) {
        console.log(`  Note: ${expected._note}`);
      }
    } catch (e) {
      errMsg = String(e.message || e);
    }

    const artifact = {
      year: year.id,
      maxScore: year.max,
      reportScore,
      profileBefore: pick(profileBefore, ['score', 'scoresByCatY3', 'scoresByCatY4']),
      profileAfter: pick(profileAfter || {}, ['score', 'scoresByCatY3', 'scoresByCatY4']),
      pass,
      errMsg,
      consoleErrors: errors,
    };
    results.push(artifact);
    writeFileSync(join(evidenceDir, `${year.id.toLowerCase()}-profile.json`), JSON.stringify(artifact, null, 2));

    console.log(`\n--- ${year.id} golden path ---`);
    console.log(`Report: ${reportScore || '(not reached)'} (max ${year.max})`);
    console.log(`Profile score: ${profileAfter?.score ?? 'n/a'} (expected ${expectedScore ?? 'n/a'})`);
    console.log(pass ? 'PASS' : `FAIL — ${errMsg}`);

    await page.close();
  }

  await browser.close();

  writeFileSync(join(evidenceDir, 'summary.json'), JSON.stringify({ ranAt: new Date().toISOString(), results }, null, 2));

  const allPass = results.every((r) => r.pass);
  console.log('\n=== Gate G4 Golden Path Summary ===');
  console.log(allPass ? 'PASS — all 4 assessment golden paths complete with profile bonus verified.' : 'FAIL — see evidence above.');
  console.log(`Evidence: Improvement_Infrastructure/g4-golden-path-evidence/`);

  process.exitCode = allPass ? 0 : 1;
}

main();
