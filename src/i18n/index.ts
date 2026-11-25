// Tiny translation helper.
// Every piece of on-screen text goes through t("some.key").
// To add Korean later: create ko.json and add it to `translations` below.
import en from './en.json';

const translations: Record<string, any> = { en };

// The language currently shown. Milestone 6 will let the user change this.
let currentLanguage = 'en';

export function setLanguage(lang: string) {
  if (translations[lang]) currentLanguage = lang;
}

// Walk through the JSON using a key like "welcome.title"
function lookup(lang: string, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<any>((obj, part) => (obj ? obj[part] : undefined), translations[lang]);
  return typeof value === 'string' ? value : undefined;
}

// t("result.welcomeTo", { town: "Lipa City" }) -> "Welcome to Lipa City"
export function t(key: string, params?: Record<string, string | number>): string {
  // Fall back to English, then to the key itself, so a missing word never crashes the app.
  let text = lookup(currentLanguage, key) ?? lookup('en', key) ?? key;
  if (params) {
    for (const name of Object.keys(params)) {
      text = text.split(`{{${name}}}`).join(String(params[name]));
    }
  }
  return text;
}
