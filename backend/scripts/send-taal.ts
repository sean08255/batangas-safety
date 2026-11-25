// Run by GitHub Actions every 15 minutes.
// 1. Read the PHIVOLCS bulletin page (the missing certificate is supplied through
//    NODE_EXTRA_CA_CERTS, so the connection is still fully verified).
// 2. Pull out the Taal alert level.
// 3. Send it to our Cloudflare backend.
// Any failure exits with an error so GitHub marks the run red. The backend then simply
// stops getting fresh Taal data, and the app shows "unable to check" after 60 minutes.
import { parseTaal } from '../src/parse.ts';

const PAGE = 'https://wovodat.phivolcs.dost.gov.ph/bulletin/list-of-bulletin';
const { BACKEND_URL, INGEST_SECRET } = process.env;
if (!BACKEND_URL || !INGEST_SECRET) throw new Error('BACKEND_URL and INGEST_SECRET must be set');

const res = await fetch(PAGE, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BatangasSafetyResearch/1.0)' },
  signal: AbortSignal.timeout(30000),
});
if (!res.ok) throw new Error(`PHIVOLCS returned HTTP ${res.status}`);

const parsed = parseTaal(await res.text());
if (!parsed.ok) throw new Error(parsed.error);
console.log(`Taal level ${parsed.level}, bulletin ${parsed.bulletinDate}`);

const send = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/ingest/taal`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${INGEST_SECRET}` },
  body: JSON.stringify({ level: parsed.level, bulletinDate: parsed.bulletinDate }),
  signal: AbortSignal.timeout(30000),
});
if (!send.ok) throw new Error(`Backend returned HTTP ${send.status}: ${await send.text()}`);
console.log('Sent to backend:', await send.text());
