// All the "where am I?" logic lives here, away from the screens.
import * as Location from 'expo-location';
import { TOWNS, Town } from '../data/towns';
import { distanceKm } from './geo';

// If the nearest town center is farther than this, we say "outside Batangas".
const MAX_NEAREST_KM = 12;
// Give up waiting for GPS after this many milliseconds.
const GPS_TIMEOUT_MS = 20000;

// The possible outcomes of trying to find the user's town.
export type LocateResult =
  | { status: 'found'; town: Town }
  | { status: 'outside'; placeName: string | null }
  | { status: 'denied' }
  | { status: 'unavailable' };

// Make names comparable: "City of Lipa", "Lipa City" and "lipa" all become "lipa".
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove things like "(Capital)"
    .replace(/\bcity of\b|\bmunicipality of\b|\bcity\b/g, '')
    .replace(/\bsto\.?\s/g, 'santo ')
    .replace(/\bsta\.?\s/g, 'santa ')
    .replace(/[^a-z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Does a town match any of the place names the phone gave us?
function findTownByName(names: string[]): Town | undefined {
  const wanted = names.filter(Boolean).map(normalize);
  return TOWNS.find((town) => {
    const options = [town.name, ...(town.aliases ?? [])].map(normalize);
    return wanted.some((w) => options.includes(w));
  });
}

// Find the town whose center is closest to the GPS point.
function findNearestTown(lat: number, lng: number): { town: Town; km: number } {
  let best = { town: TOWNS[0], km: Infinity };
  for (const town of TOWNS) {
    const km = distanceKm({ lat, lng }, { lat: town.lat, lng: town.lng });
    if (km < best.km) best = { town, km };
  }
  return best;
}

// Wait for a promise, but stop waiting after `ms`.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// The main function: ask permission, get GPS, work out the town.
export async function locateTown(): Promise<LocateResult> {
  // 1. Permission
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') return { status: 'denied' };

  // 2. Is the phone's location switch on?
  const servicesOn = await Location.hasServicesEnabledAsync();
  if (!servicesOn) return { status: 'unavailable' };

  // 3. Get coordinates (fall back to the last known position if GPS is slow)
  let coords: { latitude: number; longitude: number } | null = null;
  try {
    const position = await withTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      GPS_TIMEOUT_MS
    );
    coords = position.coords;
  } catch {
    try {
      const last = await Location.getLastKnownPositionAsync();
      if (last) coords = last.coords;
    } catch {
      // ignore, handled below
    }
  }
  if (!coords) return { status: 'unavailable' };

  // 4. Ask the phone's map service what place this is (may fail offline, that's OK)
  let placeNames: string[] = [];
  let provinceNames: string[] = [];
  try {
    const places = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    const place = places[0];
    if (place) {
      placeNames = [place.city ?? '', place.district ?? '', place.name ?? ''];
      provinceNames = [place.subregion ?? '', place.region ?? ''];
    }
  } catch {
    // no internet or service problem: we will use the nearest-town fallback
  }

  // 5a. Match by name, but only if the phone did not say we are in a different province.
  const sayBatangas = provinceNames.some((p) => p.toLowerCase().includes('batangas'));
  const provinceKnown = provinceNames.some((p) => p.trim() !== '');
  const provinceOk = sayBatangas || !provinceKnown;
  if (provinceOk) {
    const byName = findTownByName(placeNames);
    if (byName) return { status: 'found', town: byName };
  }

  // 5b. Fallback: nearest town center, if it is close enough.
  const nearest = findNearestTown(coords.latitude, coords.longitude);
  if (nearest.km <= MAX_NEAREST_KM && (sayBatangas || !provinceKnown)) {
    return { status: 'found', town: nearest.town };
  }

  // 5c. Not in Batangas as far as we can tell.
  return { status: 'outside', placeName: placeNames.find((n) => n) || null };
}
