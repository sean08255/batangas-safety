// First-draft emergency data for the 5 pilot towns.
// IMPORTANT: everything is verified: false. Check each number yourself, then set
//   verified: true  and  lastVerified: 'YYYY-MM-DD'
// To add a town later, copy one block below and change the details.
import { Contact, TownEmergency } from './types';

const DOH_SOURCE = 'DoH hospital list (copy dated May 2018, batangashistory.date)';
const MISSING_SOURCE = 'No number found in public sources yet';

// Small helper so each hospital takes one short line.
function hospital(
  townId: string,
  townName: string,
  name: string,
  phone: string | null,
  note?: string
): Contact {
  return {
    id: `${townId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    phone,
    address: null, // the 2018 list had no addresses
    mapQuery: `${name}, ${townName}, Batangas`,
    verified: false,
    lastVerified: null,
    source: DOH_SOURCE,
    note,
  };
}

// For police, fire and disaster offices where we have no number yet.
function placeholder(townId: string, townName: string, kind: string, name: string): Contact {
  return {
    id: `${townId}-${kind}`,
    name,
    phone: null,
    address: null,
    mapQuery: `${name}, ${townName}, Batangas`,
    verified: false,
    lastVerified: null,
    source: MISSING_SOURCE,
    note: 'Number not found yet. Ask the town hall or look for an official page.',
  };
}

export const TOWN_EMERGENCY: TownEmergency[] = [
  {
    townId: 'nasugbu',
    hospitals: [
      hospital('nasugbu', 'Nasugbu', 'Apacible Memorial District Hospital', null),
      hospital('nasugbu', 'Nasugbu', 'Central Azucarrera Don Pedro Hospital', null),
      hospital('nasugbu', 'Nasugbu', 'Jabez Medical Center', '+63 43 416 0446'),
      hospital('nasugbu', 'Nasugbu', 'Metropolitan Medical Center, Nasugbu Branch', '+63 43 696 4374'),
    ],
    police: [placeholder('nasugbu', 'Nasugbu', 'police', 'Nasugbu Municipal Police Station')],
    fire: [placeholder('nasugbu', 'Nasugbu', 'fire', 'Nasugbu Fire Station (BFP)')],
    mdrrmo: [placeholder('nasugbu', 'Nasugbu', 'mdrrmo', 'Nasugbu MDRRMO (disaster office)')],
  },
  {
    townId: 'lemery',
    hospitals: [
      hospital('lemery', 'Lemery', 'Batangas Provincial Hospital', '+63 43 409 0573',
        'The 2018 list called this private. Please confirm what it is.'),
      hospital('lemery', 'Lemery', 'Lemery Doctors Medical Center', '+63 43 411 1531'),
      hospital('lemery', 'Lemery', 'Metro Lemery Medical Center', '+63 43 409 0480'),
      hospital('lemery', 'Lemery', 'Our Lady of Caysasay Medical Center', '+63 43 409 1888'),
      hospital('lemery', 'Lemery', 'St. Martin General Hospital', null,
        'The 2018 list spelled this "Hospitalc". Name may be slightly off.'),
    ],
    police: [placeholder('lemery', 'Lemery', 'police', 'Lemery Municipal Police Station')],
    fire: [placeholder('lemery', 'Lemery', 'fire', 'Lemery Fire Station (BFP)')],
    mdrrmo: [placeholder('lemery', 'Lemery', 'mdrrmo', 'Lemery MDRRMO (disaster office)')],
  },
  {
    townId: 'taal',
    hospitals: [
      hospital('taal', 'Taal', 'Assumpta Medical Hospital', null),
      hospital('taal', 'Taal', 'Taal Polymedic Hospital and Medical Center', null),
    ],
    police: [placeholder('taal', 'Taal', 'police', 'Taal Municipal Police Station')],
    fire: [placeholder('taal', 'Taal', 'fire', 'Taal Fire Station (BFP)')],
    mdrrmo: [placeholder('taal', 'Taal', 'mdrrmo', 'Taal MDRRMO (disaster office)')],
  },
  {
    townId: 'lipa',
    hospitals: [
      hospital('lipa', 'Lipa City', 'Lipa City District Hospital', '+63 43 455 3175'),
      hospital('lipa', 'Lipa City', 'Ospital ng Lipa', '+63 43 702 1805'),
      hospital('lipa', 'Lipa City', 'Mary Mediatrix Medical Center', '+63 43 773 6800'),
      hospital('lipa', 'Lipa City', 'Metro Lipa Medical Center', '+63 43 756 0549'),
      hospital('lipa', 'Lipa City', 'Lipa Medix Medical Center', '+63 43 756 3008'),
      hospital('lipa', 'Lipa City', 'N. L. Villa Memorial Medical Center', '+63 43 756 4871'),
      hospital('lipa', 'Lipa City', 'San Antonio Medical Center of Lipa', '+63 43 312 2003'),
      hospital('lipa', 'Lipa City', 'Divine Love General Hospital', null),
      hospital('lipa', 'Lipa City', 'Fernando Air Base Hospital', '+63 43 778 1810',
        'Air base hospital. Check if the public can use it.'),
    ],
    police: [placeholder('lipa', 'Lipa City', 'police', 'Lipa City Police Station')],
    fire: [placeholder('lipa', 'Lipa City', 'fire', 'Lipa City Fire Station (BFP)')],
    mdrrmo: [placeholder('lipa', 'Lipa City', 'mdrrmo', 'Lipa CDRRMO (disaster office)')],
  },
  {
    townId: 'mabini',
    hospitals: [
      hospital('mabini', 'Mabini', 'Mabini General Hospital', '+63 43 425 3204'),
      hospital('mabini', 'Mabini', 'Zigzag Hospital', null),
    ],
    police: [placeholder('mabini', 'Mabini', 'police', 'Mabini Municipal Police Station')],
    fire: [placeholder('mabini', 'Mabini', 'fire', 'Mabini Fire Station (BFP)')],
    mdrrmo: [placeholder('mabini', 'Mabini', 'mdrrmo', 'Mabini MDRRMO (disaster office)')],
  },
];

// Find the emergency info for a town. Returns null if we have none yet.
export function getTownEmergency(townId: string): TownEmergency | null {
  return TOWN_EMERGENCY.find((entry) => entry.townId === townId) ?? null;
}
