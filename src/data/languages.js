// The set of languages the app currently supports.
// Adding a new language only means adding one entry here — see README for details.
// `emptyStateText` is shown on the Public View, in that language itself,
// when a keyword has no translation yet — so a Persian reader sees a
// Persian sentence instead of an English one.
export const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    emptyStateText: 'Not translated yet',
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    dir: 'rtl',
    emptyStateText: 'هنوز ترجمه نشده است',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    emptyStateText: 'لم تتم الترجمة بعد',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    emptyStateText: 'Pas encore traduit',
  },
]

export const DEFAULT_LANGUAGE_CODE = 'fa'

export function getLanguage(code) {
  return LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0]
}
