// Numbers that apply everywhere: national emergency lines and embassies.
// Everything here is verified: false until YOU check it.
// Embassy details were taken from each embassy's own website in Nov 2026,
// except the US number (see its note).
import { Contact } from './types';

export const NATIONAL: Contact[] = [
  {
    id: 'national-911',
    name: 'National Emergency Hotline (911)',
    phone: '911',
    address: null,
    mapQuery: null,
    verified: false,
    lastVerified: null,
    source: 'Philippine national emergency number (travel guide listing)',
    note: 'Police, fire and medical emergencies nationwide.',
  },
  {
    id: 'national-redcross',
    name: 'Philippine Red Cross Emergency',
    phone: '143',
    address: null,
    mapQuery: null,
    verified: false,
    lastVerified: null,
    source: 'Travel guide listing (philippinestravelguides.com)',
  },
];

export const EMBASSIES: Contact[] = [
  {
    id: 'embassy-us',
    name: 'United States Embassy',
    phone: '+63 2 5301 2000',
    address: '1201 Roxas Boulevard, Manila',
    mapQuery: 'U.S. Embassy Manila, 1201 Roxas Boulevard',
    verified: false,
    lastVerified: null,
    source: 'Travel guide listing and travel.state.gov (the two disagree)',
    note: 'An older US State Dept page lists +63 2 301 2000, after hours extension 0. Check the embassy website.',
  },
  {
    id: 'embassy-kr',
    name: 'Korean Embassy',
    phone: '+63 2 8856 9210',
    address: '122 Upper McKinley Road, McKinley Town Center, Fort Bonifacio, Taguig City',
    mapQuery: 'Embassy of the Republic of Korea, McKinley Town Center, Taguig',
    verified: false,
    lastVerified: null,
    source: 'mofa.go.kr (Korean Embassy Philippines page)',
  },
  {
    id: 'embassy-kr-afterhours',
    name: 'Korean Embassy, after-hours emergency',
    phone: '+63 917 817 5703',
    address: null,
    mapQuery: null,
    verified: false,
    lastVerified: null,
    source: 'mofa.go.kr (Korean Embassy Philippines page)',
    note: 'After working hours only. Not for visa questions.',
  },
  {
    id: 'embassy-jp',
    name: 'Japanese Embassy',
    phone: '+63 2 8551 5710',
    address: '2627 Roxas Boulevard, Pasay City',
    mapQuery: 'Embassy of Japan, 2627 Roxas Boulevard, Pasay City',
    verified: false,
    lastVerified: null,
    source: 'ph.emb-japan.go.jp (Embassy of Japan page)',
    note: 'Main trunk line. No separate emergency number was listed on the page.',
  },
  {
    id: 'embassy-cn',
    name: 'Chinese Embassy, consular protection',
    phone: '+63 2 8231 1033',
    address: '1235 Acacia Street, Dasmarinas Village, Makati City',
    mapQuery: 'Embassy of China, 1235 Acacia Street, Dasmarinas Village, Makati',
    verified: false,
    lastVerified: null,
    source: 'ph.china-embassy.gov.cn (Chinese Embassy contact page)',
    note: 'Consular assistance line for Chinese nationals.',
  },
];
