// The shape of one emergency contact. Every contact in the app uses this same shape.
export type Contact = {
  id: string;
  name: string;
  phone: string | null; // null = we have not found a number yet (no call button is shown)
  address: string | null; // null = address not found yet
  mapQuery: string | null; // text sent to Google Maps search (needs internet)
  verified: boolean; // true only after YOU have checked it
  lastVerified: string | null; // date you checked it, like "2026-11-20"
  source: string; // where the information came from
  note?: string; // anything the user should know about this entry
};

// All the emergency info for one town. Same structure for every town.
export type TownEmergency = {
  townId: string; // matches the id in towns.ts
  hospitals: Contact[];
  police: Contact[];
  fire: Contact[];
  mdrrmo: Contact[]; // local disaster risk reduction office
};
