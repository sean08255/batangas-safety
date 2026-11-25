// Quick check of the parsers against saved copies of the real pages.
// Run: node --experimental-strip-types src/parse.test.ts <bulletins.html> <slprsd.html> <typhoon.html>
import { readFileSync } from 'node:fs';
import { parseRain, parseTaal, parseTyphoon } from './parse.ts';

const [b, r, ty] = process.argv.slice(2).map((f) => readFileSync(f, 'utf8'));
console.log('taal', parseTaal(b));
console.log('rain', parseRain(r));
console.log('typhoon', parseTyphoon(ty));
console.log('garbage -> taal', parseTaal('<html>nothing</html>'));
console.log('garbage -> rain', parseRain('<html>nothing</html>'));
