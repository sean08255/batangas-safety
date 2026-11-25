// Cloudflare Worker.
//  - Every 15 minutes: read the PAGASA pages (rain, typhoon) and save them.
//  - POST /ingest/taal: GitHub Actions sends the Taal level here (the PHIVOLCS site has a
//    broken certificate chain that Cloudflare cannot read, so GitHub reads it for us).
//  - GET /alerts: the app reads everything.
import { PageStatus, parseAdvisory, parseRain, parseTyphoon } from './parse.ts';

export interface Env {
  ALERTS: KVNamespace;
  INGEST_SECRET: string; // set with: npx wrangler secret put INGEST_SECRET
}

const PAGES = {
  rain: 'https://pagasa.dost.gov.ph/regional-forecast/slprsd',
  advisory: 'https://pagasa.dost.gov.ph/weather/weather-advisory',
  typhoon: 'https://pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin',
};

// Official pages people can open themselves.
const LINKS = {
  phivolcs: 'https://www.phivolcs.dost.gov.ph/',
  rain: 'https://pagasa.dost.gov.ph/regional-forecast/slprsd',
  typhoon: 'https://pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin',
};

type PagasaSection = {
  status: 'none' | 'check' | 'error';
  checkedAt: string | null; // when we last got a good reading
  message?: string;
  sourceName: 'PAGASA';
  sourceUrl: string;
};

type TaalSection = {
  status: 'ok' | 'unverified' | 'error';
  level: number | null;
  bulletinDate: string | null;
  checkedAt: string | null;
  message?: string;
  sourceName: 'PHIVOLCS';
  sourceUrl: string;
};

// What the app receives.
export type AlertsPayload = {
  fetchedAt: string; // most recent good reading of any source
  taal: TaalSection;
  rain: PagasaSection;
  typhoon: PagasaSection;
};

const KEY_PAGASA = 'pagasa'; // { rain, typhoon }
const KEY_TAAL = 'taal';
const UA = 'Mozilla/5.0 (compatible; BatangasSafetyResearch/1.0)';

async function getHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// Read one or more PAGASA pages. If any page says "check", the result is "check".
// If any page cannot be read or does not look right, the result is "error".
async function readPagasa(
  pages: { url: string; parse: (html: string) => PageStatus | null }[],
  sourceUrl: string,
  now: string,
  prevCheckedAt: string | null
): Promise<PagasaSection> {
  // Keep the old time on failure so the app can tell how old the last good reading is.
  const section: PagasaSection = { status: 'error', checkedAt: prevCheckedAt, sourceName: 'PAGASA', sourceUrl };
  try {
    const results = await Promise.all(pages.map(async (p) => p.parse(await getHtml(p.url))));
    if (results.includes(null)) {
      section.message = 'PAGASA page did not look as expected';
    } else {
      section.status = results.includes('check') ? 'check' : 'none';
      section.checkedAt = now;
    }
  } catch (e) {
    section.message = `Could not reach PAGASA: ${(e as Error).message}`;
  }
  return section;
}

async function refreshPagasa(env: Env): Promise<void> {
  const now = new Date().toISOString();
  const prev = await env.ALERTS.get<{ rain: PagasaSection; typhoon: PagasaSection }>(KEY_PAGASA, 'json');
  const rain = await readPagasa(
    [
      { url: PAGES.rain, parse: parseRain },
      { url: PAGES.advisory, parse: parseAdvisory },
    ],
    LINKS.rain,
    now,
    prev?.rain.checkedAt ?? null
  );
  const typhoon = await readPagasa(
    [{ url: PAGES.typhoon, parse: parseTyphoon }],
    LINKS.typhoon,
    now,
    prev?.typhoon.checkedAt ?? null
  );
  await env.ALERTS.put(KEY_PAGASA, JSON.stringify({ rain, typhoon }));
}

// Save a Taal reading sent by GitHub Actions. Returns an error text, or null if saved.
async function saveTaal(env: Env, body: any): Promise<string | null> {
  const level = body?.level;
  if (!Number.isInteger(level) || level < 0 || level > 5) return 'level must be a whole number from 0 to 5';
  const bulletinDate = typeof body.bulletinDate === 'string' ? body.bulletinDate.slice(0, 60) : null;

  const prev = await env.ALERTS.get<TaalSection>(KEY_TAAL, 'json');
  // Safety check: a jump of 3+ levels between two readings is almost certainly a misread.
  // The next reading with the same level confirms it.
  const lastLevel = prev?.status === 'ok' ? prev.level : null;
  const jump = lastLevel !== null && Math.abs(level - lastLevel) >= 3;

  const taal: TaalSection = {
    status: jump ? 'unverified' : 'ok',
    level,
    bulletinDate,
    checkedAt: new Date().toISOString(),
    sourceName: 'PHIVOLCS',
    sourceUrl: LINKS.phivolcs,
  };
  if (jump) taal.message = `Level jumped from ${lastLevel} to ${level}. Waiting for confirmation.`;
  await env.ALERTS.put(KEY_TAAL, JSON.stringify(taal));
  return null;
}

// Put the saved pieces together for the app.
async function buildPayload(env: Env): Promise<AlertsPayload> {
  const pagasa = await env.ALERTS.get<{ rain: PagasaSection; typhoon: PagasaSection }>(KEY_PAGASA, 'json');
  const savedTaal = await env.ALERTS.get<TaalSection>(KEY_TAAL, 'json');

  const empty = (url: string): PagasaSection => ({
    status: 'error', checkedAt: null, message: 'No data yet', sourceName: 'PAGASA', sourceUrl: url,
  });
  const rain = pagasa?.rain ?? empty(LINKS.rain);
  const typhoon = pagasa?.typhoon ?? empty(LINKS.typhoon);
  const taal: TaalSection = savedTaal ?? {
    status: 'error', level: null, bulletinDate: null, checkedAt: null,
    message: 'No Taal reading received yet', sourceName: 'PHIVOLCS', sourceUrl: LINKS.phivolcs,
  };

  // Newest good reading. If there is none at all, use the epoch so the app shows "unable to check".
  const times = [rain.checkedAt, typhoon.checkedAt, taal.checkedAt]
    .filter((x): x is string => !!x)
    .sort();
  return { fetchedAt: times.length ? times[times.length - 1] : new Date(0).toISOString(), taal, rain, typhoon };
}

export default {
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(refreshPagasa(env));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
    const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

    // GitHub Actions sends the Taal reading here. Needs the secret key.
    if (url.pathname === '/ingest/taal') {
      if (request.method !== 'POST') return json({ error: 'use POST' }, 405);
      const auth = request.headers.get('Authorization') ?? '';
      if (!env.INGEST_SECRET || auth !== `Bearer ${env.INGEST_SECRET}`) return json({ error: 'not allowed' }, 401);
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'bad JSON' }, 400);
      }
      const err = await saveTaal(env, body);
      return err ? json({ error: err }, 400) : json({ ok: true });
    }

    // Open /refresh to read PAGASA now instead of waiting for the 15-minute timer.
    // Limited to once a minute so nobody can use it to hammer the PAGASA website.
    if (url.pathname === '/refresh') {
      const last = await env.ALERTS.get('lastManualRefresh');
      if (!last || Date.now() - Number(last) > 60000) {
        await env.ALERTS.put('lastManualRefresh', String(Date.now()));
        await refreshPagasa(env);
      }
    } else if (!(await env.ALERTS.get(KEY_PAGASA))) {
      ctx.waitUntil(refreshPagasa(env)); // first ever request: fill PAGASA data
    }
    return json(await buildPayload(env));
  },
};
