#!/usr/bin/env python3
"""
prose_stats.py — locate writing habits. Diagnostic only.

This script deliberately reports no composite score and no verdict. A stylometric
composite run over texts with classifier verdicts attached came out inverted: the
genuinely human control scored "riskiest" in the original exploratory corpus. The
runtime skill therefore treats these measurements as diagnostics, not targets.
A single number invites optimizing toward the machine register, so there is not one
here.

Read the output as a map of where to look. Every hit is a hypothesis. Open the
paragraph and decide, using the contextual tests in references/edit.md.

Usage:
    python3 prose_stats.py draft.txt
    python3 prose_stats.py draft.txt --json
    python3 strip_markdown.py draft.md | python3 prose_stats.py -
"""

import json
import re
import statistics
import sys

# ---------------------------------------------------------------- lexicons
# Time-dated search lexicons. These drift with language and model generations; an
# absence is not a pass, and a match is not a defect without context.

HEDGES = {
    "may", "might", "could", "perhaps", "possibly", "likely", "generally",
    "typically", "often", "usually", "tends", "tend", "suggests", "suggest",
    "appears", "appear", "seems", "seem", "arguably", "relatively", "somewhat",
    "potentially", "presumably", "largely", "broadly", "commonly", "roughly",
    "sometimes", "mostly", "probably", "fairly", "can", "would", "maybe",
    "basically", "quite", "pretty", "really", "almost", "occasionally",
    "apparently", "supposedly", "unclear", "unsure",
}

HEDGE_PHRASES = [
    "kind of", "sort of", "a bit", "i think", "i guess", "i suspect",
    "more or less", "pretty much", "at least in", "in practice", "or so",
    "if anything", "for the most part", "as far as i",
]

BOOSTERS = {
    "crucial", "crucially", "essential", "essentially", "vital", "key",
    "significant", "significantly", "robust", "powerful", "remarkable",
    "remarkably", "notable", "notably", "critical", "critically", "profound",
    "profoundly", "compelling", "paramount", "pivotal", "important",
    "importantly", "substantial", "substantially", "transformative",
    "groundbreaking", "invaluable", "seamless", "seamlessly",
}

SIGNPOSTS = {
    "moreover", "furthermore", "additionally", "consequently", "therefore",
    "thus", "however", "notably", "importantly", "ultimately", "indeed",
    "similarly", "conversely", "nevertheless", "nonetheless", "accordingly",
    "hence", "overall", "instead", "meanwhile", "crucially", "essentially",
}

CLOSERS = [
    "in conclusion", "in summary", "to sum up", "to summarize", "in short",
    "all in all", "in essence", "taken together", "at the end of the day",
]

OPENER_PHRASES = [
    "in today's", "in the realm of", "when it comes to", "at its core",
    "it's worth noting", "it is worth noting", "it's important to note",
    "it is important to note", "in a world where", "the reality is",
    "here's the thing", "let's dive", "let's explore", "let's break this down",
    "here's what you need to know", "without further ado", "let me be clear",
    "the uncomfortable truth", "make no mistake", "let that sink in",
]

LEXIS = [
    "delve", "tapestry", "a testament to", "testament to", "underscore",
    "underscores", "underscoring", "showcase", "showcases", "showcasing",
    "leverage", "foster", "fosters", "fostering", "bolster", "garner",
    "navigating the", "ever-evolving", "landscape of", "a myriad of",
    "plays a crucial role", "plays a vital role", "plays a key role",
    "shed light on", "the world of", "intricate", "multifaceted",
    "meticulous", "utilize", "facilitate", "cornerstone", "interplay",
    "deep dive", "double down", "circle back", "lean into", "game-changer",
]

CONTRASTIVE = [
    re.compile(r"\brather than\b", re.I),
    re.compile(r"\bnot simply\b", re.I),
    re.compile(r"\bnot merely\b", re.I),
    re.compile(r"\bnot necessarily\b", re.I),
    re.compile(r"\bnot solely\b", re.I),
    re.compile(r"\bas opposed to\b", re.I),
    re.compile(r"\beven as\b", re.I),
    re.compile(r"\bnot just\b[^.?!]{0,60}\bbut\b", re.I),
    re.compile(r"\bnot only\b[^.?!]{0,60}\bbut\b", re.I),
    re.compile(r"\bisn'?t\b[^.?!]{0,40}\bit'?s\b", re.I),
    re.compile(r"\bis not\b[^.?!]{0,40}\bit is\b", re.I),
    re.compile(r"\bthe question is ?n'?t\b", re.I),
    re.compile(r";\s+the\s+[^.?!;]{1,45}\bremains?\b", re.I),
]

COPULA = re.compile(
    r"\b(serves as|stands as|represents|marks a|features a|boasts|offers a)\b", re.I
)

FALSE_AGENCY = re.compile(
    r"\b(the (decision|culture|conversation|complaint|data|market|industry|"
    r"technology|process|architecture)\s+"
    r"(emerges?|shifts?|moves?|tells?|rewards?|demands?|becomes?|drives?|"
    r"speaks?|listens?|decides?|wants?))\b",
    re.I,
)

PARTICIPIAL_HEADS = (
    "building", "drawing", "having", "given", "considering", "looking",
    "leveraging", "combining", "reflecting", "highlighting", "underscoring",
    "starting", "moving", "taking", "using", "adding", "focusing",
    "recognizing", "acknowledging", "understanding", "beginning", "turning",
    "returning", "stepping", "bearing", "armed", "faced", "based",
)
PARTICIPIAL = re.compile(
    r"^\s*(" + "|".join(PARTICIPIAL_HEADS) + r")\b[^,\n]{2,60},", re.I
)

TRIAD = re.compile(
    r"\b([A-Za-z][\w'-]*(?:[ \t]+[\w'-]+){0,2}),[ \t]+"
    r"([A-Za-z][\w'-]*(?:[ \t]+[\w'-]+){0,2}),[ \t]+"
    r"(?:and|or)[ \t]+([A-Za-z][\w'-]*(?:[ \t]+[\w'-]+){0,2})\b"
)

CHATBOT = [
    "i hope this helps", "let me know if", "would you like me to",
    "great question", "you're absolutely right", "certainly!", "of course!",
    "as of my last", "based on available information",
]

SENT_RE = re.compile(r'[^.!?]*[.!?]+["\')\]]?|\S[^.!?]*$', re.S)
WORD_RE = re.compile(r"[A-Za-z][A-Za-z'-]*")
DASH_RE = re.compile(r"—|–|(?<=\s)--(?=\s)|(?<=\s)-(?=\s)")
NUM_RE = re.compile(r"\b\d[\d,.]*\b|\b\d+%")
PROPER_RE = re.compile(r"\b[A-Z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*\b")
QUOTE_RE = re.compile(r'"[^"]{4,}"|“[^”]{4,}”')

BODY_MIN_WORDS = 8

COMMON_CAPS = {
    "The", "A", "An", "I", "It", "This", "That", "These", "Those", "But", "And",
    "Or", "So", "If", "When", "While", "You", "We", "They", "He", "She", "There",
    "What", "Why", "How", "Where", "Who", "Because", "Although", "Once", "For",
    "In", "On", "At", "To", "By", "As", "Not", "No", "Yes", "Every", "Most",
    "Some", "Each", "One", "Two", "Three", "After", "Before", "Then", "Now",
    "Here", "His", "Her", "Their", "Our", "Its", "My", "Do", "Does", "Did",
}


def sentences(text):
    return [m.group().strip() for m in SENT_RE.finditer(text) if m.group().strip()]


def paragraphs(text):
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def cv(values):
    vals = [v for v in values if v > 0]
    if len(vals) < 2:
        return 0.0
    mean = statistics.mean(vals)
    if mean == 0:
        return 0.0
    return statistics.pstdev(vals) / mean


def phrase_hits(text, phrases):
    low = text.lower()
    return sorted({p for p in phrases if p in low})


def regex_hits(text, regexes):
    out = []
    for rx in regexes:
        for m in rx.finditer(text):
            out.append(m.group().strip())
    return out


def count_anchors(text, sents):
    """Numbers, quoted strings, and proper nouns that are not sentence-initial."""
    anchors = len(NUM_RE.findall(text)) + len(QUOTE_RE.findall(text))
    for s in sents:
        words = s.split()
        for w in words[1:]:
            token = w.strip(".,;:!?()[]\"'")
            if not token:
                continue
            if token in COMMON_CAPS:
                continue
            if PROPER_RE.fullmatch(token) and not token.isupper() and len(token) > 1:
                anchors += 1
            elif token.isupper() and len(token) > 1 and token.isalpha():
                anchors += 1
    return anchors


def analyze(text):
    sents = sentences(text)
    paras = paragraphs(text)
    words = WORD_RE.findall(text)
    n_words = len(words) or 1

    sent_lens = [len(WORD_RE.findall(s)) for s in sents]
    body_lens = [n for n in sent_lens if n >= BODY_MIN_WORDS]
    short_lens = [n for n in sent_lens if n < BODY_MIN_WORDS]

    lowered = [w.lower() for w in words]
    low_text = text.lower()
    n_hedge = sum(1 for w in lowered if w in HEDGES)
    n_hedge += sum(low_text.count(p) for p in HEDGE_PHRASES)
    n_boost = sum(1 for w in lowered if w in BOOSTERS)

    co_occur = []
    for s in sents:
        low = {w.lower() for w in WORD_RE.findall(s)}
        if low & HEDGES and low & BOOSTERS:
            co_occur.append(s[:110])

    signpost_openers = []
    participial_openers = []
    for s in sents:
        first = (WORD_RE.findall(s) or [""])[0].lower()
        if first in SIGNPOSTS:
            signpost_openers.append(s[:90])
        if PARTICIPIAL.match(s):
            participial_openers.append(s[:90])

    dashes = DASH_RE.findall(text)
    dash_clusters = [s[:110] for s in sents if len(DASH_RE.findall(s)) >= 2]

    anchors = count_anchors(text, sents)

    return {
        "size": {
            "words": len(words),
            "sentences": len(sents),
            "paragraphs": len(paras),
        },
        "cadence": {
            "body_sentence_cv": round(cv(body_lens), 3),
            "all_sentence_cv": round(cv(sent_lens), 3),
            "cadence_masking": round(
                len(short_lens) / len(sent_lens), 3) if sent_lens else 0.0,
            "paragraph_word_cv": round(
                cv([len(WORD_RE.findall(p)) for p in paras]), 3),
            "mean_body_sentence_words": round(
                statistics.mean(body_lens), 1) if body_lens else 0.0,
        },
        "density": {
            "hedge_booster_per_100": round((n_hedge + n_boost) / n_words * 100, 2),
            "hedge_per_100": round(n_hedge / n_words * 100, 2),
            "booster_per_100": round(n_boost / n_words * 100, 2),
            "anchors_per_100": round(anchors / n_words * 100, 2),
            "signpost_opener_share": round(
                len(signpost_openers) / len(sents), 3) if sents else 0.0,
        },
        "high_signal_clusters": {
            "hedge_booster_same_sentence": co_occur,
            "participial_openers": participial_openers,
            "contrastive_pivots": regex_hits(text, CONTRASTIVE),
        },
        "look_here": {
            "triads": [" / ".join(m) for m in TRIAD.findall(text)][:25],
            "copula_displacement": [m.group() for m in COPULA.finditer(text)],
            "false_agency": [m.group() for m in FALSE_AGENCY.finditer(text)],
            "signpost_openers": signpost_openers[:25],
            "dash_count": len(dashes),
            "multi_dash_sentences": dash_clusters,
            "overloaded_sentences": [
                f"({n}w) {t[:96]}" for t, n in
                sorted(((t, len(WORD_RE.findall(t))) for t in sents),
                       key=lambda x: -x[1]) if n > 40
            ],
            "stock_openers": phrase_hits(text, OPENER_PHRASES),
            "stock_closers": phrase_hits(text, CLOSERS),
            "model_lexis": phrase_hits(text, LEXIS),
            "chatbot_residue": phrase_hits(text, CHATBOT),
        },
    }


def report(stats):
    lines = []
    s = stats["size"]
    lines.append(
        f"{s['words']} words, {s['sentences']} sentences, {s['paragraphs']} paragraphs"
    )
    if s["words"] < 400:
        lines.append(
            "  note: under 400 words. Cadence and density figures are unstable at this "
            "length, and so is any judgement made from a short excerpt."
        )
    lines.append("")
    lines.append("MEASUREMENTS (descriptive, not targets)")
    lines.append(f"  body_sentence_cv           {stats['cadence']['body_sentence_cv']}")
    lines.append(f"  short_line_share           {stats['cadence']['cadence_masking']}")
    lines.append(f"  hedge_per_100              {stats['density']['hedge_per_100']}")
    lines.append(f"  booster_per_100            {stats['density']['booster_per_100']}")
    lines.append(f"  anchors_per_100            {stats['density']['anchors_per_100']}")
    lines.append(
        f"  signpost_opener_share      {stats['density']['signpost_opener_share']}"
    )
    lines.append("  Compare versions of the same piece; do not compare a draft to a universal norm.")
    if stats["cadence"]["cadence_masking"] > 0.15:
        lines.append(
            "  note: a third or more of the lines are under 8 words. If those are headings,"
        )
        lines.append(
            "        list items, or section breaks, read body_sentence_cv and ignore the mask."
        )

    lines.append("")
    lines.append("HIGH-SIGNAL CLUSTERS (inspect in context)")
    for key, items in stats["high_signal_clusters"].items():
        lines.append(f"  {key} ({len(items)})")
        for item in items[:8]:
            lines.append(f"      {item}")
        if len(items) > 8:
            lines.append(f"      ... {len(items) - 8} more")

    lines.append("")
    lines.append("LOOK HERE (hypotheses, not verdicts)")
    for key, items in stats["look_here"].items():
        if isinstance(items, int):
            lines.append(f"  {key}: {items}")
            continue
        if not items:
            continue
        lines.append(f"  {key} ({len(items)})")
        for item in items[:8]:
            lines.append(f"      {item}")
        if len(items) > 8:
            lines.append(f"      ... {len(items) - 8} more")

    lines.append("")
    lines.append("No composite score, by design. Counts locate passages; they do not grade prose.")
    lines.append("These numbers find habits. They do not tell you whether the piece is good,")
    lines.append("and they cannot tell you whether it says anything. Read the passage to decide.")
    return "\n".join(lines)


def main():
    args = [a for a in sys.argv[1:]]
    as_json = "--json" in args
    args = [a for a in args if not a.startswith("--")]
    if not args:
        print(__doc__)
        sys.exit(1)
    path = args[0]
    if path == "-":
        text = sys.stdin.read()
    else:
        with open(path, encoding="utf-8") as fh:
            text = fh.read()

    stats = analyze(text)
    if as_json:
        print(json.dumps(stats, indent=2))
    else:
        print(report(stats))


if __name__ == "__main__":
    main()
