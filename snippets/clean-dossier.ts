/**
 * Excerpt from Channelsmith (packages/director/src/longform.ts).
 * Shown for illustration only. The full source code is available at https://store.mikodes.com/p/channelsmith/
 *
 * After the research step, Claude returns a dossier: sources plus facts that cite them by number.
 * This keeps only sources that were really retrieved during the run (or given by the channel owner),
 * renumbers them from 1, remaps the facts, and moves any fact left without a source into the gaps,
 * where the script writer is told not to use it as a fact.
 */

export const NOTES_URL = 'notes:channel-owner';

/** URL identity for "was this page really retrieved" (scheme, www, trailing slash and fragment ignored). */
export function urlKey(u: string): string {
  try {
    const x = new URL(u.trim());
    return (x.hostname.replace(/^www\./, '').toLowerCase() + x.pathname.replace(/\/+$/, '') + x.search).toLowerCase();
  } catch { return u.trim().toLowerCase(); }
}

type WebSource = { url: string; title: string };
type DossierSource = { n: number; url: string; title: string; publisher?: string };
type DossierFact = { id: string; text: string; source: number[] };
type Dossier = { summary: string; facts: DossierFact[]; sources: DossierSource[]; gaps: string[] };
type RawDossier = {
  summary: string;
  facts: { text: string; source: number[] }[];
  sources: { n: number; url: string; title: string; publisher?: string }[];
  gaps: string[];
};

export function cleanDossier(raw: RawDossier, allowed: Map<string, WebSource>, webOn: boolean): { dossier: Dossier; dropped: string[] } {
  const dropped: string[] = [];
  const map = new Map<number, number>();
  const sources: DossierSource[] = [];
  const byKey = new Map<string, number>();
  for (const s of raw.sources) {
    const key = urlKey(s.url);
    const hit = allowed.get(key) ?? (s.url === NOTES_URL ? allowed.get(urlKey(NOTES_URL)) : undefined);
    if (!hit) { dropped.push(s.url); continue; }
    const had = byKey.get(key);
    if (had) { map.set(s.n, had); continue; }
    const n = sources.length + 1;
    sources.push({ n, url: hit.url === NOTES_URL ? NOTES_URL : (s.url.trim() || hit.url), title: (s.title || hit.title || hit.url).slice(0, 300), ...(s.publisher ? { publisher: s.publisher } : {}) });
    byKey.set(key, n); map.set(s.n, n);
  }
  const gaps = [...raw.gaps];
  const facts: DossierFact[] = [];
  for (const f of raw.facts) {
    const src = [...new Set(f.source.map(n => map.get(n)).filter((n): n is number => !!n))];
    if (!src.length) { gaps.push(`Unverified (no retrieved source): ${f.text}`); continue; }
    facts.push({ id: `f${facts.length + 1}`, text: f.text, source: src });
  }
  if (webOn && !sources.length) gaps.unshift('No source was retrieved from the web; nothing in this topic is verified yet.');
  return { dossier: { summary: raw.summary, facts, sources, gaps }, dropped };
}
