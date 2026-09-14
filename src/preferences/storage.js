export function readPreference(key, fallback, allowed) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch { return fallback; }
}
export function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Private browsing may block storage. */ }
}
