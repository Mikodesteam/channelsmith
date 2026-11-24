/**
 * Excerpt from Channelsmith (packages/render/src/footage/net.ts).
 * Shown for illustration only. The full source code is available at https://store.mikodes.com/p/channelsmith/
 *
 * Footage is downloaded only from a short allowlist of provider media hosts over plain https on port 443,
 * with no credentials in the URL. A host that answers HTTP 429 is left alone for as long as it asks.
 */

/** Media hosts each provider serves files from. Nothing else is ever downloaded. */
export const MEDIA_HOSTS: Record<Exclude<Provider, 'upload'>, string[]> = {
  pexels: ['videos.pexels.com', 'images.pexels.com'],
  pixabay: ['cdn.pixabay.com', 'pixabay.com'],
  // originals and transcoded videos on upload., scaled photos on thumb. (the API's thumburl)
  wikimedia: ['upload.wikimedia.org', 'thumb.wikimedia.org'],
};

export const MAX_BYTES = { video: 400 * 1024 * 1024, photo: 40 * 1024 * 1024 } as const;
export const MAX_REDIRECTS = 3;

// …

/** Parse a URL and check it against the provider's media hosts; returns the URL or throws why not. */
export function checkMediaUrl(raw: string, provider: Provider): URL {
  if (provider === 'upload') throw new Error('Uploads are local files, not URLs');
  let u: URL;
  try { u = new URL(raw); } catch { throw new Error(`Footage URL is not valid: ${String(raw).slice(0, 120)}`); }
  if (u.protocol !== 'https:') throw new Error(`Footage URL must use https: ${u.protocol}//${u.host}`);
  if (u.username || u.password) throw new Error('Footage URL must not carry credentials');
  if (u.port && u.port !== '443') throw new Error(`Footage URL must use the standard https port, not ${u.port}`);
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  const allowed = MEDIA_HOSTS[provider] ?? [];
  if (!allowed.includes(host)) throw new Error(`Footage host ${host} is not an allowed ${provider} media host`);
  return u;
}


// …

/** Retry-After as seconds: a number of seconds or an HTTP date; null when absent or unreadable. */
export function retryAfterSeconds(v: string | null | undefined, now = Date.now()): number | null {
  const t = String(v ?? '').trim();
  if (!t) return null;
  if (/^\d+$/.test(t)) return Number(t);
  const d = Date.parse(t);
  return Number.isFinite(d) ? Math.max(0, Math.ceil((d - now) / 1000)) : null;
}
