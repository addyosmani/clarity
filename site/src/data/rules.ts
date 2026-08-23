/**
 * The essay and the eighteen rules are parsed from the repository README at build
 * time. The site is not allowed to hold its own copy: if the two ever disagree,
 * that is a bug, so there is only one source.
 */
// Vite inlines the file at build time, resolved against this module's source
// path. Reading it from disk instead would depend on the working directory and
// on import.meta.url surviving bundling, neither of which holds on a CI builder.
import raw from '../../../README.md?raw';

export interface Rule {
  n: number;
  title: string;
  slug: string;
  blocks: Block[];
}
export type Block =
  | { kind: 'p'; html: string }
  | { kind: 'quote'; html: string; cite: string };

export interface Section {
  name: string;
  slug: string;
  rules: Rule[];
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Minimal inline markdown. The source uses only emphasis, code and links. */
function inline(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const lines = raw.split('\n');

/** The essay that opens the piece, between its heading and the first rule section. */
function readEssay(): Block[] {
  const start = lines.findIndex((l) => l.startsWith('## On writing that earns its reader'));
  const end = lines.findIndex((l) => l.trim() === '## Useful');
  return parseBlocks(lines.slice(start + 1, end));
}

function parseBlocks(chunk: string[]): Block[] {
  const out: Block[] = [];
  let para: string[] = [];
  let quote: string[] = [];
  const flushPara = () => {
    if (para.length) out.push({ kind: 'p', html: inline(para.join(' ').trim()) });
    para = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    const body = quote.filter((l) => !l.trim().startsWith('—'));
    const attr = quote.find((l) => l.trim().startsWith('—')) ?? '';
    out.push({
      kind: 'quote',
      html: inline(body.join(' ').replace(/\s+/g, ' ').trim()),
      cite: inline(attr.replace(/^\s*—\s*/, '').trim()),
    });
    quote = [];
  };
  for (const line of chunk) {
    const t = line.trim();
    if (t.startsWith('>')) {
      flushPara();
      const inner = t.replace(/^>\s?/, '');
      if (inner) quote.push(inner);
      continue;
    }
    if (!t || t === '---') {
      flushPara();
      flushQuote();
      continue;
    }
    flushQuote();
    para.push(t);
  }
  flushPara();
  flushQuote();
  return out;
}

function readSections(): Section[] {
  const names = ['Useful', 'Clear', 'Yours', 'Making it'];
  const sections: Section[] = [];
  for (let i = 0; i < names.length; i++) {
    const startIdx = lines.findIndex((l) => l.trim() === `## ${names[i]}`);
    const nextHeading = lines.findIndex(
      (l, idx) => idx > startIdx && /^## /.test(l),
    );
    const chunk = lines.slice(startIdx + 1, nextHeading);
    const rules: Rule[] = [];
    let cur: { n: number; title: string; body: string[] } | null = null;
    const push = () => {
      if (!cur) return;
      rules.push({
        n: cur.n,
        title: cur.title,
        slug: `rule-${cur.n}`,
        blocks: parseBlocks(cur.body),
      });
    };
    for (const line of chunk) {
      const m = line.match(/^### (\d+)\.\s+(.*)$/);
      if (m) {
        push();
        cur = { n: Number(m[1]), title: m[2].trim(), body: [] };
      } else if (cur) {
        cur.body.push(line);
      }
    }
    push();
    sections.push({ name: names[i], slug: slugify(names[i]), rules });
  }
  return sections;
}

/** The reading list at the foot of the README, kept in sync the same way. */
function readFurther(): { label: string; items: string[] }[] {
  const start = lines.findIndex((l) => l.trim() === '## Further reading');
  if (start === -1) return [];
  const chunk = lines.slice(start + 1);
  const groups: { label: string; items: string[] }[] = [];
  let cur: { label: string; items: string[] } | null = null;
  for (const line of chunk) {
    const t = line.trim();
    if (t.startsWith('MIT')) break;
    // Accept both heading forms the README uses: "**Books.**" with the period
    // inside the bold, and "**Essays and books**" without one.
    const head = t.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/);
    if (head) {
      cur = { label: head[1], items: [] };
      groups.push(cur);
      if (head[2]) cur.items.push(inline(head[2]));
      continue;
    }
    if (t.startsWith('- ')) {
      cur?.items.push(inline(t.slice(2)));
      continue;
    }
    if (t && cur && cur.items.length) {
      cur.items[cur.items.length - 1] += ' ' + inline(t);
    }
  }
  return groups;
}

export const further = readFurther();
export const essay = readEssay();
export const sections = readSections();
export const rules = sections.flatMap((s) => s.rules);

// Fail the build rather than ship a silently truncated page.
if (rules.length !== 18) {
  throw new Error(`Expected 18 rules parsed from README.md, found ${rules.length}`);
}
for (let i = 0; i < rules.length; i++) {
  if (rules[i].n !== i + 1) {
    throw new Error(`Rules out of order at index ${i}: got ${rules[i].n}`);
  }
}
