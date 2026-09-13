// crypto.randomUUID() only exists in secure contexts (HTTPS or localhost).
// Opening the app over plain HTTP via a LAN IP — e.g. testing on a phone
// against a dev server's network address — is not a secure context, so
// crypto.randomUUID is undefined there and throws instead of returning
// a string. Fall back to a manual id so keyword creation never crashes.
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
