const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;
const GUEST_KEY = 'store.guest.session.v1';
let pendingGuest;

function accountToken() {
  try { return localStorage.getItem('access_token'); } catch { return null; }
}

export function isSignedIn() {
  return Boolean(accountToken());
}

export function readGuestSession() {
  try {
    const value = JSON.parse(localStorage.getItem(GUEST_KEY));
    return value?.access_token && value?.refresh_token ? value : null;
  } catch {
    return null;
  }
}

function isFresh(token) {
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(encoded)).exp * 1000 > Date.now() + 60000;
  } catch {
    return false;
  }
}

async function restoreGuest() {
  const session = readGuestSession();
  if (session && isFresh(session.access_token)) return session;
  // Check persistence before creating a server identity. A temporary outage must
  // never discard a saved token or create a replacement cart.
  try {
    localStorage.setItem('store.guest.storage-check', '1');
    localStorage.removeItem('store.guest.storage-check');
  } catch {
    throw new Error('Allow browser storage to keep your guest cart on this device.');
  }
  let response;
  if (session) {
    response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!response.ok && ![401, 403].includes(response.status)) {
      throw new Error('Could not restore your guest session. Please try again.');
    }
  }
  if (!response?.ok) {
    response = await fetch(`${API_URL}/auth/guest`, { method: 'POST' });
  }
  if (!response.ok) throw new Error('Could not start your guest session. Please try again.');
  const data = await response.json();
  if (!data.access_token || !data.refresh_token) throw new Error('Invalid guest session');
  localStorage.setItem(GUEST_KEY, JSON.stringify(data));
  return data;
}

export async function getSessionToken() {
  const token = accountToken();
  if (token) return token;
  if (!pendingGuest) {
    // One creation/refresh across tabs, including React StrictMode mounts.
    pendingGuest = (navigator.locks
      ? navigator.locks.request(GUEST_KEY, restoreGuest)
      : restoreGuest()).finally(() => { pendingGuest = null; });
  }
  const session = await pendingGuest;
  return accountToken() || session.access_token;
}

export function hasShoppingSession() {
  return isSignedIn() || Boolean(readGuestSession());
}

async function transferGuest(accountToken) {
  const session = readGuestSession();
  if (!session) return;
  const response = await fetch(`${API_URL}/auth/guest/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accountToken}` },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  // Invalid/expired guest credentials cannot be recovered; do not block account
  // sign-in forever. Network and server errors keep the token for a safe retry.
  if (!response.ok && response.status !== 401) throw new Error('Could not transfer your guest cart. Please sign in again.');
  localStorage.removeItem(GUEST_KEY);
}

export async function mergeGuestSession(accountToken) {
  if (pendingGuest) await pendingGuest;
  return navigator.locks
    ? navigator.locks.request(GUEST_KEY, () => transferGuest(accountToken))
    : transferGuest(accountToken);
}

export function notifySessionChange() {
  for (const event of ['authChanged', 'cartUpdated', 'favoritesUpdated']) {
    window.dispatchEvent(new Event(event));
  }
}

export function signOut() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  notifySessionChange();
}

window.addEventListener('storage', (event) => {
  if (!event.key || [GUEST_KEY, 'access_token', 'refresh_token'].includes(event.key)) notifySessionChange();
});
