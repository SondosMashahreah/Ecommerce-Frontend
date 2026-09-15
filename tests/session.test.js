import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { getSessionToken, readGuestSession, mergeGuestSession, signOut } from '../src/services/session';
import { getCart, getFavorites, getOrders, signinUser } from '../src/services/api';

const key = 'store.guest.session.v1';
const token = (seconds) => `test.${btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000) + seconds }))}.test`;
const session = () => ({ access_token: token(1800), refresh_token: token(86400), token_type: 'bearer' });
const response = (data, status=200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });

beforeEach(() => { localStorage.clear(); vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('persistent guest sessions', () => {
  it('opens the public storefront with an empty basket without creating a user', async () => {
    expect(await getCart()).toEqual([]);
    expect(await getFavorites()).toEqual([]);
    expect(await getOrders()).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('creates exactly one guest for concurrent shopping requests', async () => {
    const saved = session(); fetch.mockResolvedValue(response(saved));
    expect(await Promise.all([getSessionToken(), getSessionToken(), getSessionToken()])).toEqual(Array(3).fill(saved.access_token));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/api/v1/auth/guest');
    expect(readGuestSession()).toEqual(saved);
  });
  it('uses a persisted guest identity on return without another creation', async () => {
    const saved=session(); localStorage.setItem(key,JSON.stringify(saved));
    expect(await getSessionToken()).toBe(saved.access_token);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('silently renews an expired access token while retaining the guest identity', async () => {
    const saved={...session(),access_token:token(-120)}; localStorage.setItem(key,JSON.stringify(saved));
    const renewed=session();fetch.mockResolvedValue(response(renewed));
    expect(await getSessionToken()).toBe(renewed.access_token);
    expect(fetch.mock.calls[0][0]).toMatch(/auth\/refresh$/);
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({refresh_token:saved.refresh_token});
  });
  it('preserves the guest token through a server outage', async () => {
    const saved={...session(),access_token:token(-120)};localStorage.setItem(key,JSON.stringify(saved));
    fetch.mockResolvedValue(response({},503));
    await expect(getSessionToken()).rejects.toThrow('Could not restore');
    expect(readGuestSession()).toEqual(saved);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('refuses guest creation when the browser cannot persist its token', async () => {
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Storage denied');});
    await expect(getSessionToken()).rejects.toThrow('Allow browser storage');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('merges the guest before completing sign-in, then consumes its local token', async () => {
    const saved=session();localStorage.setItem(key,JSON.stringify(saved));
    const account={access_token:'account-access',refresh_token:'account-refresh'};
    fetch.mockResolvedValueOnce(response(account)).mockResolvedValueOnce(response({merged:true}));
    expect(await signinUser({email:'customer@example.com',password:'test'})).toEqual(account);
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer account-access');
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({refresh_token:saved.refresh_token});
    expect(readGuestSession()).toBeNull();
  });
  it('retains guest data when merging fails so retry cannot lose the cart', async () => {
    const saved=session();localStorage.setItem(key,JSON.stringify(saved));fetch.mockResolvedValue(response({},500));
    await expect(mergeGuestSession('account-access')).rejects.toThrow('Could not transfer');
    expect(readGuestSession()).toEqual(saved);
  });
  it('uses account credentials while signed in and never exposes them after logout', async () => {
    const saved=session();localStorage.setItem(key,JSON.stringify(saved));
    localStorage.setItem('access_token','account-access');localStorage.setItem('refresh_token','account-refresh');
    expect(await getSessionToken()).toBe('account-access');
    signOut();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(await getSessionToken()).toBe(saved.access_token);
  });
});
