/* Smoke check: drives the built app in headless Chrome and fails on any
   console warning/error. Usage: npm run build && node scripts/smoke-check.mjs */
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;
const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const problems = [];

function startPreview() {
  const child = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] },
  );
  child.stdout.on('data', () => {});
  child.stderr.on('data', (d) => process.stderr.write(d));
  return child;
}

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(URL);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await delay(250);
  }
  throw new Error('preview server did not start');
}

function textOf(el) {
  return el.evaluate((node) => node.textContent.trim());
}

const preview = startPreview();
let browser;
try {
  await waitForServer();
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'warning' || type === 'error') {
      problems.push(`console.${type}: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));

  await page.goto(URL, { waitUntil: 'networkidle0' });

  // --- initial render -------------------------------------------------------
  await page.waitForSelector('.task-card');
  const initialCards = await page.$$eval('.task-card', (els) => els.length);
  if (initialCards !== 7) problems.push(`expected 7 seed cards, got ${initialCards}`);

  // --- move a task right (reorders lists) -----------------------------------
  const firstTodoMoveRight = await page.$('.column:first-child .task-card button[aria-label*="right"]');
  await firstTodoMoveRight.click();
  await delay(50);

  // --- cycle a priority (reorders within column) ----------------------------
  await page.click('.task-card .priority-badge');
  await delay(50);

  // --- search filter --------------------------------------------------------
  await page.type('.filter-search', 'STATE');
  await delay(100);
  const filtered = await page.$$eval('.task-card', (els) => els.length);
  if (filtered !== 1) problems.push(`search 'STATE' expected 1 card, got ${filtered}`);
  await page.$eval('.filter-search', (el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await delay(100);

  // --- priority filter ------------------------------------------------------
  await page.select('.filter-priority', 'high');
  await delay(100);
  const highOnly = await page.$$eval('.priority-badge', (els) =>
    els.every((el) => el.textContent.trim() === 'high'),
  );
  if (!highOnly) problems.push('priority filter leaked non-high cards');
  await page.select('.filter-priority', 'all');
  await delay(100);

  // --- invalid form submit shows validation, adds nothing -------------------
  const before = await page.$$eval('.task-card', (els) => els.length);
  await page.type('#new-title', 'ab');
  await page.click('.btn-primary');
  await page.waitForSelector('#new-title-error');
  const afterInvalid = await page.$$eval('.task-card', (els) => els.length);
  if (afterInvalid !== before) problems.push('invalid submit added a task');

  // --- valid form submit ----------------------------------------------------
  await page.$eval('#new-title', (el) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, 'Smoke test task');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.click('.btn-primary');
  await delay(100);
  const afterValid = await page.$$eval('.task-card', (els) => els.length);
  if (afterValid !== before + 1) problems.push(`valid submit should add 1 card, got ${afterValid - before}`);

  // --- delete a task --------------------------------------------------------
  await page.click('.task-delete');
  await delay(100);
  const afterDelete = await page.$$eval('.task-card', (els) => els.length);
  if (afterDelete !== afterValid - 1) problems.push('delete did not remove a card');

  // --- persistence across reload -------------------------------------------
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.task-card');
  const afterReload = await page.$$eval('.task-card', (els) => els.length);
  if (afterReload !== afterDelete) {
    problems.push(`persistence broken: ${afterDelete} before reload, ${afterReload} after`);
  }

  // --- empty-state path (search for nothing) --------------------------------
  await page.type('.filter-search', 'zzz-no-match');
  await delay(100);
  const empty = await page.$('.empty-state');
  if (!empty) problems.push('empty state not shown for zero matches');
} finally {
  if (browser) await browser.close();
  preview.kill();
}

if (problems.length > 0) {
  console.error('SMOKE CHECK FAILED:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('SMOKE CHECK PASSED — zero console warnings/errors, all interactions OK');
