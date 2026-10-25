// Site content lives in /content as JSON and Markdown so it can be edited
// through Pages CMS (see .pages.yml). Everything is bundled at build time.
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import site from '../content/site.json';
import capabilities from '../content/capabilities.json';
import principles from '../content/principles.json';
import roadmap from '../content/roadmap.json';
import team from '../content/team.json';

export { site, capabilities, principles, roadmap, team };

/** Resolve a CMS media path (e.g. "/media/x.jpg") against the deployed base URL. */
export function asset(path: string | undefined | null): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '');
}

export interface Update {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  cover: string;
  html: string;
}

const files = import.meta.glob('../content/updates/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseUpdate(path: string, raw: string): (Update & { draft: boolean }) | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  const meta = (match ? parseYaml(match[1]) : {}) ?? {};
  const body = match ? match[2] : raw;
  const slug = path.split('/').pop()!.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (!meta.title) return null;
  const date = meta.date instanceof Date ? meta.date.toISOString().slice(0, 10) : String(meta.date ?? '');
  return {
    slug,
    title: String(meta.title),
    date,
    category: String(meta.category ?? 'Update'),
    summary: String(meta.summary ?? ''),
    cover: String(meta.cover ?? ''),
    draft: Boolean(meta.draft),
    html: marked.parse(body, { async: false }),
  };
}

export const updates: Update[] = Object.entries(files)
  .map(([path, raw]) => parseUpdate(path, raw))
  .filter((u): u is Update & { draft: boolean } => u !== null && !u.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}
