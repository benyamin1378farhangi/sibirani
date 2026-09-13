const STORAGE_KEY = 'sibirani.translations.v1'

// Reads the keyword list from localStorage.
// Falls back to `fallback` if the entry is missing, not valid JSON, or not an array —
// so a corrupted entry can never crash the app.
export function loadKeywords(fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    return parsed
  } catch (error) {
    console.warn('Failed to read translations from localStorage, using defaults.', error)
    return fallback
  }
}

export function saveKeywords(keywords) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords))
  } catch (error) {
    console.warn('Failed to persist translations to localStorage.', error)
  }
}
