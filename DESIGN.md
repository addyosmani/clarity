# Design

<!-- impeccable:design-schema 1 -->

## Surface

`clarity.addy.ie`, one page. Mode: **Read**. The visitor is here to understand an argument
about writing and, if convinced, to run one command. Everything is subordinate to sustained
reading; the install block is the only Persuade moment and it sits above the fold so it never
has to compete with the prose again.

## World

Sibling to `skills.addy.ie`, not a twin. Confirmed with the user.

The family resemblance is the dark ground and Geist for chrome. The divergence is that this
page is *read*, not scanned, so a text face leads and the margin does the labelling. Where the
sibling site is a product surface built from cards, this one is a manual: one measured column,
information in the margin, and a running head that tells you where you are.

## Palette

Ground is `#0c0c0e`, one step off true black and warmed a few degrees. Pure black under a
serif at 19px is punishing over 2,000 words, and the warmth stops the text reading blue.

| Token | Value | Contrast on ground | Use |
|---|---|---|---|
| `--fg` | `#e9e6e1` | 15.7:1 | body prose |
| `--fg-muted` | `#a6a29b` | 7.69:1 | lede, quotes, secondary |
| `--fg-dim` | `#8b867f` | 5.41:1 | citations, numerals, fine print |
| `--fg-faint` | `#7f7a73` | 4.59:1 | margin labels |
| `--accent` | `#e0a35c` | 8.90:1 | section names, marks, caret |

One accent, and it is the mark an editor leaves in a margin. It never fills a surface; it
appears as a hairline, a numeral on hover, a section name, and the caret. Amber also separates
this site from the sibling's blue without leaving the family.

Every text colour was measured against the ground rather than chosen by eye. Three failed the
4.5:1 floor on the first build and were lifted.

## Type

- **Source Serif 4** for all reading matter. A real screen text face with proper italics, which
  the six pull quotes need.
- **Geist** for chrome, headings, and labels: the tie to the sibling site.
- **Geist Mono** for the install command only. Monospace here is code, not costume.

Measure is 40rem, which is 67 characters in Source Serif at 19px. Measured with canvas metrics,
not assumed: the first attempt at 34rem produced 57 characters, short of the 65–75 target.

Old-style numerals in prose, tabular lining numerals for the marginal rule numbers.

## Composition

A three-part grid: margin column (5.5rem), gutter (2.25rem), measure (40rem).

- Rule numerals live in the margin, right-aligned to the gutter, and warm to the accent on
  hover or when linked to directly.
- Section headings name their part once. The margin stays empty beside them; an eyebrow
  repeating the heading is a label, not information.
- Under 46rem the margin folds away, the numeral moves inline into the rule heading, and the
  install command shrinks until all 34 characters fit rather than truncating.

## Motion

One authored moment: the running head names the part you are inside, fading and rising as you
cross into it. `IntersectionObserver` with an asymmetric root margin so the name changes at the
point the reader would say they had arrived, not when the heading first clips the viewport.
Everything else is a 0.15–0.3s state change. Honours `prefers-reduced-motion`.

## Browser surfaces

Selection, caret, scrollbar, focus ring, and underline offset are all themed from the palette.
These ship with browser defaults that belong to no design system.

## Content authority

The essay, the eighteen rules, and the reading list are parsed from `README.md` at build time.
The site holds no copy of its own, and the build throws if it does not find exactly eighteen
rules in order. If the site and the README ever disagree, that is a bug with one fix.

## Accepted exception

The mechanical detector flags Geist as an overused face. Kept: the brief pinned the sibling
relationship, and Geist is what carries it. The page's own voice is Source Serif, which is
where the identity actually lives.
