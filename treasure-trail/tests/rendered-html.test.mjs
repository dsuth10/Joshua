import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("release bundle contains the Treasure Trail campaign", async () => {
  const assetsRoot = new URL("../dist/server/ssr/assets/", import.meta.url);
  const pageAsset = (await readdir(assetsRoot)).find((file) => /^page-.*\.js$/.test(file));
  assert.ok(pageAsset, "built page asset is present");
  const [server, page] = await Promise.all([
    readFile(new URL("../dist/server/index.js", import.meta.url), "utf8"),
    readFile(new URL(pageAsset, assetsRoot), "utf8"),
  ]);

  assert.match(server, /Treasure Trail — Number Facts Expedition/);
  assert.match(server, /Choose your path\. Master every trail\./);
  assert.match(page, /Choose your path/);
  assert.match(page, /Every stop contains at least 12 varied questions/);
  assert.match(page, /Adventure/);
  assert.match(page, /Museum/);
  assert.doesNotMatch(page, /Your site is taking shape|codex-preview/i);
});

test("campaign source includes mastery, persistence and recovery systems", async () => {
  const [page, campaign, questions, hosting, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/game/campaign.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/game/questions.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(campaign, /MINIMUM_NODE_QUESTIONS = 12/);
  assert.match(campaign, /volcano-route/);
  assert.match(campaign, /temple-route/);
  assert.match(campaign, /allOf:\["volcano-route","temple-route"\]/);
  assert.match(questions, /missing-factor/);
  assert.match(questions, /missing-divisor/);
  assert.match(questions, /remediationOf/);
  assert.match(page, /\/api\/profile/);
  assert.match(page, /GearShop/);
  assert.match(page, /BaseCampMuseum/);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(css, /\.tt-adventure-map/);
});
