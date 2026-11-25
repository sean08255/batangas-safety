// All 34 cities and towns of Batangas province.
// lat/lng are APPROXIMATE town centers (good enough to find the nearest town).
// `covered: true` means the town is one of the 5 pilot towns for emergency info (Milestone 2).
// To cover another town later, just change covered to true.

export type Town = {
  id: string;
  name: string; // name shown on screen
  lat: number;
  lng: number;
  covered: boolean;
  aliases?: string[]; // other names a phone's map service might return
};

export const TOWNS: Town[] = [
  { id: 'agoncillo', name: 'Agoncillo', lat: 13.9333, lng: 120.9239, covered: false },
  { id: 'alitagtag', name: 'Alitagtag', lat: 13.8686, lng: 121.0036, covered: false },
  { id: 'balayan', name: 'Balayan', lat: 13.9439, lng: 120.733, covered: false },
  { id: 'balete', name: 'Balete', lat: 13.9475, lng: 121.0961, covered: false },
  { id: 'batangas-city', name: 'Batangas City', lat: 13.7565, lng: 121.0583, covered: false },
  { id: 'bauan', name: 'Bauan', lat: 13.7928, lng: 121.0069, covered: false },
  { id: 'calaca', name: 'Calaca', lat: 13.9311, lng: 120.8131, covered: false },
  { id: 'calatagan', name: 'Calatagan', lat: 13.8325, lng: 120.6317, covered: false },
  { id: 'cuenca', name: 'Cuenca', lat: 13.9, lng: 121.05, covered: false },
  { id: 'ibaan', name: 'Ibaan', lat: 13.8167, lng: 121.1333, covered: false },
  { id: 'laurel', name: 'Laurel', lat: 14.05, lng: 120.9167, covered: false },
  { id: 'lemery', name: 'Lemery', lat: 13.8833, lng: 120.9167, covered: true },
  { id: 'lian', name: 'Lian', lat: 14.0333, lng: 120.65, covered: false },
  { id: 'lipa', name: 'Lipa City', lat: 13.9411, lng: 121.1631, covered: true },
  { id: 'lobo', name: 'Lobo', lat: 13.65, lng: 121.2167, covered: false },
  { id: 'mabini', name: 'Mabini', lat: 13.7167, lng: 120.9167, covered: true, aliases: ['Anilao'] },
  { id: 'malvar', name: 'Malvar', lat: 14.04, lng: 121.155, covered: false },
  { id: 'mataasnakahoy', name: 'Mataasnakahoy', lat: 13.9667, lng: 121.1, covered: false },
  { id: 'nasugbu', name: 'Nasugbu', lat: 14.0722, lng: 120.6314, covered: true },
  { id: 'padre-garcia', name: 'Padre Garcia', lat: 13.875, lng: 121.215, covered: false },
  { id: 'rosario', name: 'Rosario', lat: 13.8461, lng: 121.2072, covered: false },
  { id: 'san-jose', name: 'San Jose', lat: 13.875, lng: 121.1, covered: false },
  { id: 'san-juan', name: 'San Juan', lat: 13.8272, lng: 121.3975, covered: false },
  { id: 'san-luis', name: 'San Luis', lat: 13.85, lng: 120.9333, covered: false },
  { id: 'san-nicolas', name: 'San Nicolas', lat: 13.9333, lng: 120.95, covered: false },
  { id: 'san-pascual', name: 'San Pascual', lat: 13.8, lng: 121.0333, covered: false },
  { id: 'santa-teresita', name: 'Santa Teresita', lat: 13.8583, lng: 120.9, covered: false },
  { id: 'santo-tomas', name: 'Santo Tomas', lat: 14.1078, lng: 121.1417, covered: false },
  { id: 'taal', name: 'Taal', lat: 13.8833, lng: 120.9333, covered: true },
  { id: 'talisay', name: 'Talisay', lat: 14.0833, lng: 121.0167, covered: false },
  { id: 'tanauan', name: 'Tanauan City', lat: 14.085, lng: 121.1497, covered: false },
  { id: 'taysan', name: 'Taysan', lat: 13.7833, lng: 121.1833, covered: false },
  { id: 'tingloy', name: 'Tingloy', lat: 13.6333, lng: 120.8667, covered: false, aliases: ['Maricaban'] },
  { id: 'tuy', name: 'Tuy', lat: 14.0167, lng: 120.7333, covered: false },
];
