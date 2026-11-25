// Gets the latest alert data from our backend and decides if it is fresh enough to show.
import { ALERTS_URL, MAX_ALERT_AGE_MINUTES } from '../config';

// Same shape the backend sends (see backend/src/index.ts).
export type PagasaSection = {
  status: 'none' | 'check' | 'error';
  checkedAt: string | null;
  message?: string;
  sourceName: 'PAGASA';
  sourceUrl: string;
};

export type Alerts = {
  fetchedAt: string;
  taal: {
    status: 'ok' | 'unverified' | 'error';
    level: number | null;
    bulletinDate: string | null;
    checkedAt: string | null;
    message?: string;
    sourceName: 'PHIVOLCS';
    sourceUrl: string;
  };
  rain: PagasaSection;
  typhoon: PagasaSection;
};

// Official pages, used when we cannot show data.
export const OFFICIAL_LINKS = {
  phivolcs: 'https://www.phivolcs.dost.gov.ph/',
  pagasa: 'https://www.pagasa.dost.gov.ph/',
};

// Returns the alerts, or throws if the backend cannot be reached or sends nonsense.
export async function fetchAlerts(): Promise<Alerts> {
  if (!ALERTS_URL) throw new Error('not configured');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${ALERTS_URL.replace(/\/$/, '')}/alerts`, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data?.taal || !data?.rain || !data?.typhoon || !data?.fetchedAt) throw new Error('bad data');
    return data as Alerts;
  } finally {
    clearTimeout(timer);
  }
}

// True if the time is recent enough to count as current.
export function isFresh(iso: string | null): boolean {
  if (!iso) return false;
  const age = Date.now() - new Date(iso).getTime();
  return Number.isFinite(age) && age >= -5 * 60000 && age <= MAX_ALERT_AGE_MINUTES * 60000;
}

// "25 Nov 2026, 3:15 PM" in Philippine time.
export function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
