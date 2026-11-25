// Reads the official pages and pulls out the few facts we need.
// Rule: if a page does not look the way we expect, say "unknown" and send people to the
// official link. Never guess.

export type TaalResult =
  | { ok: true; level: number; bulletinDate: string | null }
  | { ok: false; error: string };

// Turn HTML into plain text with single spaces.
export function toText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// PHIVOLCS bulletin list page has: "Alert Level Status: Taal - 1 Kanlaon - 2 ..."
// and "Taal Volcano Summary of 24Hr Observation 25 November 2026 12:00 AM".
export function parseTaal(html: string): TaalResult {
  const text = toText(html);
  const m = text.match(/Alert Level Status:[\s\S]*?\bTaal\s*-\s*(\d)\b/i);
  if (!m) return { ok: false, error: 'Taal alert level not found on the PHIVOLCS page' };
  const level = Number(m[1]);
  if (!Number.isInteger(level) || level < 0 || level > 5) {
    return { ok: false, error: `Taal level out of range: ${level}` };
  }
  const d = text.match(
    /Taal Volcano Summary of 24Hr Observation\s+(\d{1,2} [A-Za-z]+ \d{4})(?:\s+(\d{1,2}:\d{2} [AP]M))?/i
  );
  return { ok: true, level, bulletinDate: d ? (d[2] ? `${d[1]} ${d[2]}` : d[1]) : null };
}

// 'none'  = the page clearly says nothing is issued
// 'check' = anything else: something may be active, or the page changed. Open the official page.
export type PageStatus = 'none' | 'check';

// PAGASA Southern Luzon regional page. Batangas is in this region.
export function parseRain(html: string): PageStatus | null {
  const text = toText(html);
  if (!/Rainfall Warning/i.test(text)) return null; // page changed
  return /no Heavy Rainfall Warning (?:is |was )?Issued/i.test(text) ? 'none' : 'check';
}

// PAGASA tropical cyclone bulletin page.
export function parseTyphoon(html: string): PageStatus | null {
  const text = toText(html);
  if (!/Tropical Cyclone/i.test(text)) return null; // page changed
  return /No Active Tropical Cyclone within the Philippine Area of Responsibility/i.test(text)
    ? 'none'
    : 'check';
}

// PAGASA general weather advisory page.
export function parseAdvisory(html: string): PageStatus | null {
  const text = toText(html);
  if (!/Weather Advisory/i.test(text)) return null;
  return /no Weather Advisory (?:is |was )?issued/i.test(text) ? 'none' : 'check';
}
