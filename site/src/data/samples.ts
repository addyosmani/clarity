/**
 * The three drafts are read from samples/ at build time, so the walkthrough
 * always shows exactly what the repository holds.
 */
import before from '../../../samples/what-it-means-to-be-human.before.md?raw';
import after from '../../../samples/what-it-means-to-be-human.after.md?raw';
import interviewed from '../../../samples/what-it-means-to-be-human.after-interview.md?raw';

export type Block =
  | { kind: 'p'; html: string }
  | { kind: 'ul'; items: string[] };

export interface Draft {
  id: string;
  blocks: Block[];
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/**
 * Drop the H1 and any subheadings; the walkthrough supplies its own headings.
 * The first draft contains a bullet list, which has to stay a list: collapsing
 * it into a paragraph leaves literal hyphens running through the prose.
 */
function body(raw: string): Block[] {
  const chunks = raw
    .split('\n')
    .filter((l) => !l.startsWith('#'))
    .join('\n')
    .split(/\n\s*\n/);

  const out: Block[] = [];
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => l.startsWith('- '))) {
      out.push({ kind: 'ul', items: lines.map((l) => esc(l.slice(2).trim())) });
    } else {
      out.push({ kind: 'p', html: esc(lines.join(' ')) });
    }
  }
  return out;
}

export const drafts: Record<string, Draft> = {
  before: { id: 'before', blocks: body(before) },
  after: { id: 'after', blocks: body(after) },
  interviewed: { id: 'interviewed', blocks: body(interviewed) },
};
