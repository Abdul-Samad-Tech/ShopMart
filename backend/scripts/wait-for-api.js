/**
 * Blocks until the API health check passes, then exits so Vite can start.
 * Prevents Vite proxy ECONNREFUSED spam while MongoDB connects.
 */
const HEALTH_URL = process.env.API_HEALTH_URL || 'http://127.0.0.1:5000/api/health';
const MAX_ATTEMPTS = 120;
const INTERVAL_MS = 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  try {
    const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const body = await res.json();
      if (body?.ok) {
        console.log(`\n[web] API ready — starting Vite (waited ${attempt}s)\n`);
        process.exit(0);
      }
    }
  } catch {
    /* API not up yet */
  }

  if (attempt === 1) {
    console.log('[web] Waiting for API on http://127.0.0.1:5000 (MongoDB + demo users)…');
  }
  await sleep(INTERVAL_MS);
}

console.error(
  '\n[web] API did not become ready in time.\n' +
    '  • Check MONGODB_URI in .env\n' +
    '  • Run: npm run db:check\n' +
    '  • Then: npm run dev\n'
);
process.exit(1);
