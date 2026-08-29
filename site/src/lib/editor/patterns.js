// Detection engine for AI writing tells + Hemingway-style readability.
// Pure functions, no DOM. analyze(text) -> { marks, stats, sentences }.
//
// Two complementary layers, shown as review signals rather than authorship
// verdicts:
//  1. Surface tells   — vocabulary, phrases and formulaic structures you can
//                       point at (word/phrase lists + regex).
//  2. Statistical observations — distributional properties such as
//                       sentence-length variation (burstiness), lexical
//                       diversity (MATTR), and n-gram repetition. These can
//                       prompt a review, but do not establish authorship.
//
// Sources distilled into the lists and thresholds below:
//  - Wikipedia: Signs of AI writing (WikiProject AI Cleanup)
//  - github.com/hardikpandya/stop-slop  (phrases.md, structures.md)
//  - github.com/blader/humanizer        (33 patterns)
//  - Emi & Spero 2024, "Technical Report on the Pangram AI-Generated Text
//    Classifier" (arXiv:2402.14873) — segment scoring, hard-negative mining.
//  - Kobak et al. 2025, "Delving into LLM-assisted writing… through excess
//    vocabulary" (Science Advances) — empirical excess-word lists; the 2024
//    pivot from flowery nouns toward style verbs.
//  - "The Last Fingerprint: How Markdown Training Shapes LLM Prose"
//    (arXiv:2603.27006) — frequency evidence for repeated dash rhythm. The
//    editor deliberately does not treat a single dash or useful markdown as a
//    tell.
//  - Stylometric detection literature: sentence-length CV (burstiness),
//    type-token ratio / MATTR, function-word and n-gram distributions.

// ---- Word-level tells ------------------------------------------------------

// Overused AI vocabulary + the filler intensifiers people pile on
// ("actually", "honestly", "basically"…). Each occurrence is flagged.
export const AI_WORDS = [
  // inflated / "AI vocabulary"
  "delve", "delves", "delved", "delving", "tapestry", "testament", "beacon",
  "realm", "realms", "embark", "embarks", "embarked", "embarking", "unleash",
  "unleashing", "unleashed", "unlock", "unlocks", "unlocking", "harness",
  "harnessing", "harnessed", "leverage", "leverages", "leveraging", "foster",
  "fosters", "fostering", "cultivate", "cultivates", "cultivating", "showcase",
  "showcases", "showcasing", "showcased", "garner", "garners", "garnered",
  "underscore", "underscores", "underscored", "underscoring", "elevate",
  "elevates", "elevating", "intricate", "intricacies", "intricacy",
  "multifaceted", "nuanced", "holistic", "robust", "seamless", "seamlessly",
  "streamline", "streamlined", "streamlining", "myriad", "plethora", "profound",
  "profoundly", "paramount", "pivotal", "crucial", "vital", "vibrant",
  "bustling", "boasts", "boasting", "transformative", "groundbreaking",
  "revolutionize", "revolutionizing", "resonate", "resonates", "resonating",
  "illuminate", "illuminating", "encompass", "encompasses", "encompassing",
  "meticulous", "meticulously", "commendable", "noteworthy", "interplay",
  "synergy", "synergies", "captivate", "captivating", "evoke", "evokes",
  "trove", "supercharge", "turbocharge", "paradigm", "delineate",
  // empirically-confirmed 2024–25 excess vocabulary (Kobak et al., Science
  // Advances) — the documented pivot toward flowery *style verbs*
  "surpass", "surpasses", "surpassing", "surpassed", "bolster", "bolsters",
  "bolstering", "bolstered", "catalyze", "catalyzes", "catalyzing", "catalyzed",
  "ingenious", "grapple", "grapples", "grappling", "grappled", "spearhead",
  "spearheads", "spearheading", "spearheaded", "boast", "boasted", "enhance",
  "enhances", "enhancing", "enhanced", "amplify", "amplifies", "amplifying",
  "amplified", "exemplify", "exemplifies", "exemplifying", "align", "aligns",
  "aligning", "versatile", "innovative", "notable", "comprehensive",
  "comprehensively", "ecosystem", "ecosystems", "landscape", "milestone",
  "milestones",
  // filler intensifiers / hedges (overuse tells)
  "actually", "honestly", "basically", "essentially", "literally", "genuinely",
  "truly", "simply", "really", "arguably", "undoubtedly", "frankly",
  "admittedly", "fundamentally", "inherently", "crucially", "importantly",
  "interestingly", "ironically", "remarkably",
];

// Transition words. Only flagged when piled up (>= TRANSITION_MIN times), per
// the false-positive guidance: one "however" is not a tell.
export const AI_TRANSITIONS = [
  "however", "moreover", "furthermore", "additionally", "consequently",
  "therefore", "thus", "hence", "nevertheless", "nonetheless", "accordingly",
  "subsequently", "conversely", "notably", "ultimately",
];
export const TRANSITION_MIN = 3;

// Non-adverb words that end in "ly" — never flag these as adverbs.
export const ADVERB_STOP = new Set([
  "actually", "honestly", "really", "simply", "apply", "supply", "reply",
  "comply", "imply", "rely", "multiply", "early", "only", "family", "ally",
  "bully", "rally", "tally", "jelly", "belly", "fully", "hourly", "daily",
  "weekly", "monthly", "yearly", "ugly", "holy", "italy", "july", "likely",
  "lonely", "lovely", "lively", "friendly", "deadly", "costly", "elderly",
  "orderly", "ghostly", "homely", "timely", "monopoly", "anomaly", "assembly",
  "panoply", "wobbly", "bubbly", "knobbly", "fly", "ply", "sly", "wholly",
]);

// Weakeners / qualifiers (Hemingway "qualifier" category).
export const WEAKENERS = [
  "very", "quite", "rather", "somewhat", "fairly", "pretty", "just", "kind of",
  "sort of", "a bit", "a little", "perhaps", "maybe", "possibly", "presumably",
  "relatively", "slightly", "almost", "virtually", "mostly",
];

// Complex phrases with a simpler alternative (Hemingway "use simpler").
export const COMPLEX = {
  "a number of": "some, many",
  "a majority of": "most",
  "a sufficient amount of": "enough",
  "an abundance of": "plenty of",
  "at this point in time": "now",
  "at the present time": "now",
  "point in time": "time",
  "in order to": "to",
  "in the event that": "if",
  "due to the fact that": "because",
  "for the purpose of": "to",
  "in spite of the fact that": "although",
  "with regard to": "about",
  "in regards to": "about",
  "with the exception of": "except",
  "a large number of": "many",
  "the majority of": "most",
  "utilize": "use",
  "utilizes": "uses",
  "utilized": "used",
  "utilizing": "using",
  "facilitate": "help",
  "endeavor": "try",
  "commence": "start",
  "terminate": "end",
  "ascertain": "find out",
  "numerous": "many",
  "subsequent": "next",
  "prior to": "before",
  "subsequent to": "after",
  "in conjunction with": "with",
  "in the near future": "soon",
  "on a regular basis": "regularly",
  "is able to": "can",
  "are able to": "can",
  "has the ability to": "can",
  "have the ability to": "can",
  "a variety of": "various",
  "whether or not": "whether",
  "each and every": "each",
};

// ---- Phrase-level tells ----------------------------------------------------

// Multi-word AI tells: openers, signposting, significance inflation,
// promotional puffery, clichés and chatbot artifacts.
export const AI_PHRASES = [
  // chatbot / collaboration artifacts
  "i hope this helps", "hope this helps", "i'd be happy to", "happy to help",
  "let me know if you", "feel free to", "great question", "you're absolutely right",
  "you're absolutely correct", "as an ai language model", "as a large language model",
  "as an ai", "it's worth noting", "it is worth noting", "it's important to note",
  "it is important to note", "it's important to remember", "it should be noted",
  "rest assured", "needless to say", "without a doubt", "it goes without saying",
  // signposting / announcements
  "let's dive in", "let's dive into", "dive into", "deep dive", "let's explore",
  "let's take a look", "let's break it down", "let's break this down", "buckle up",
  "without further ado", "here's the thing", "here's what you need to know",
  "in this article", "in this section", "by the end of this",
  // significance / legacy inflation
  "stands as a testament", "serves as a testament", "a testament to",
  "plays a crucial role", "plays a vital role", "plays a pivotal role",
  "plays a significant role", "plays a key role", "plays an important role",
  "plays a central role", "underscores the importance", "underscores the significance",
  "highlights the importance", "reflects a broader", "reflects the broader",
  "part of a broader", "marking a pivotal", "marks a pivotal", "a pivotal moment",
  "a turning point", "leaves a lasting", "leave a lasting impression", "indelible mark",
  "stand the test of time", "shaping the future", "setting the stage", "set the stage",
  "paving the way", "pave the way", "at the forefront", "the cornerstone of",
  "a cornerstone of", "a beacon of", "speaks volumes", "is poised to", "poised to become",
  // promotional / puffery
  "rich tapestry", "rich cultural heritage", "rich history", "breathtaking",
  "stunning natural beauty", "must-visit", "nestled in", "nestled within",
  "nestled among", "in the heart of", "boasts a", "vibrant culture", "diverse array",
  "wide array of", "wide range of", "a myriad of", "a plethora of", "a wealth of",
  "treasure trove", "hidden gem", "world-class", "second to none", "like never before",
  "unlock the power", "unleash the power", "the power of", "take it to the next level",
  // clichés / openers / filler
  "in today's fast-paced world", "in today's digital age", "in today's world",
  "in the modern world", "in the realm of", "in the world of", "in an era of",
  "in an era where", "in a world where", "when it comes to", "at the end of the day",
  "at its core", "more than just", "the bottom line", "first and foremost",
  "last but not least", "in conclusion", "in summary", "to sum up", "all in all",
  "all things considered", "on the other hand", "by and large", "needle in a haystack",
  "the fact of the matter", "the reality is", "the truth is", "make no mistake",
  "ever-evolving landscape", "ever-changing landscape", "the ever-evolving",
  "the ever-changing", "navigating the complexities", "navigate the complexities",
  "fast-paced world", "double-edged sword", "tip of the iceberg", "food for thought",
  "game changer", "game-changer", "paradigm shift", "low-hanging fruit",
  "move the needle", "circle back", "touch base", "on the same page",
  "think outside the box", "best of both worlds",
  // empirically-flagged AI multi-word tells (excess-vocabulary studies)
  "shed light on", "sheds light on", "it is worth mentioning",
  "it's worth mentioning", "worth mentioning", "ethical considerations",
  "ethical consideration", "at the intersection of", "the interplay between",
  "when we consider", "it is essential to", "it's essential to",
  "in recent years", "over the years", "one might argue", "a deep dive into",
  // High-signal contemporary cliches also covered by Simon Willison's focused
  // highlighter. Kept here because the surrounding editor adds context and
  // quality review rather than treating a match as an authorship verdict.
  "sit with that", "you already know", "the whole point", "the entire point",
  "the punchline is", "worth naming", "that's not nothing", "that is not nothing",
  "here's the twist", "here is the twist", "turns out", "let me be clear",
  "to be perfectly honest", "the only thing that matters", "that's the part",
  "that is the part", "fits in your head", "batteries included", "zero config",
  "sane defaults",
  "read that again", "let that sink in", "the part nobody tells you",
];

// ---- Structural tells (regex) ---------------------------------------------

export const AI_STRUCTURES = [
  {
    label: "Negative parallelism",
    tip: "“It's not just X, it's Y” - state the point directly.",
    re: /\b(?:it'?s|this is|that'?s) not (?:just|merely|only|simply)\b[^.?!;]{0,60}?[,;]?\s+(?:it'?s|but it'?s|it is)\b/gi,
  },
  {
    label: "Not only … but also",
    tip: "“Not only X but also Y” is an additive hedge. Simplify.",
    re: /\bnot only\b[^.?!]{0,70}?\bbut(?:\s+also)?\b/gi,
  },
  {
    label: "Not X but Y",
    tip: "Mechanical contrast. State Y directly.",
    re: /\bnot (?:just|simply|merely|only)\b[^.?!,;]{0,50}?\bbut(?: rather)?\b/gi,
  },
  {
    label: "Negation reframe",
    tip: "“isn't X, it's Y” - a formulaic reframe.",
    re: /\b(?:isn'?t|wasn'?t|aren'?t)\b[^.?!,;]{0,45}?,\s+(?:it'?s|they'?re|it is)\b/gi,
  },
  {
    label: "Editorial -ing tail",
    tip: "“, highlighting/underscoring…” tacks on fake depth.",
    re: /,\s+(?:highlighting|underscoring|emphasizing|reflecting|symbolizing|showcasing|ensuring|demonstrating|cultivating|fostering|contributing|representing|signaling|signifying|illustrating|reinforcing|cementing)\b/gi,
  },
  {
    label: "Rule of three",
    tip: "A polished triad can feel formulaic. Keep it when all three items earn their place.",
    re: /\b(\w+(?:ing|ly|tion|ity|ness|ment))(?:,)\s+(\w+(?:ing|ly|tion|ity|ness|ment)),?\s+and\s+(\w+(?:ing|ly|tion|ity|ness|ment))\b/gi,
  },
  {
    label: "Dash cluster",
    tip: "Several dashes can create a repeated aside rhythm. Keep the ones doing useful work; recast only the mechanical ones.",
    re: /\s[—–]\s|—|–|\s--\s/g,
    min: 3,
  },
  {
    label: "Stacked questions",
    tip: "Several rhetorical questions in a row can feel staged. Answer one or turn it into a direct claim.",
    re: /(?:^|[.!]\s+)(?:[^?!\n]{3,100}\?\s*){3,}/gm,
  },
  {
    label: "No X, no Y chain",
    tip: "A run of clipped negations can sound performative. Keep it if the cadence matters; otherwise state the positive condition.",
    re: /(?:^|[.!?]\s+|\n)no\s+[^.!?\n]{1,45}[.!?,;]\s+no\s+[^.!?\n]{1,45}(?=[.!?\n])/gim,
  },
  {
    label: "Repeated sentence opener",
    tip: "Repeated openings can create a templated rhythm. Keep deliberate anaphora; revise accidental repetition.",
    re: /(?:^|[.!?]\s+)([A-Z][\p{L}'’–-]+)\b[^.!?\n]{2,100}[.!?]\s+\1\b[^.!?\n]{2,100}[.!?]\s+\1\b/giu,
  },
  {
    label: "Only X that matters",
    tip: "This frame manufactures finality. Name the actual criterion unless it truly is the only one.",
    re: /\bthe only\s+[^.!?\n]{1,55}?\s+that matters\b/gi,
  },
  {
    label: "Imperative contrast",
    tip: "“Don’t X it; Y it” is a slogan frame. Keep it only when the compression earns its emphasis.",
    re: /\bdon['’]t\s+[\p{L}'’–-]+\s+(?:it|them)\s*[,;:.—-]\s*[\p{L}'’–-]+\s+(?:it|them)\b/giu,
  },
  {
    label: "Repeated denial",
    tip: "Repeated “did not” clauses can create synthetic suspense. State the relevant fact directly if the cadence is not intentional.",
    re: /\b(?:did not|didn['’]t)\b[^.!?\n]{1,55}[.!?]\s*(?:it |they |he |she |we )?(?:did not|didn['’]t)\b/gi,
  },
];

// Short human-readable meta for each category (used by the legend + issues).
export const CATEGORIES = {
  phrase:     { label: "AI phrases",      kind: "ai", tip: "Stock AI phrases, openers and clichés." },
  aiword:     { label: "AI words",        kind: "ai", tip: "Overused AI vocabulary and filler intensifiers." },
  structure:  { label: "Formulaic structures", kind: "ai", tip: "Constructions that are worth reviewing in context, not blanket bans." },
  transition: { label: "Piled-up transitions", kind: "ai", tip: "Transition words used too often." },
  veryhard:   { label: "Very hard sentence", kind: "read", tip: "Hard to read. Split it up." },
  hard:       { label: "Hard sentence",   kind: "read", tip: "Dense sentence. Consider shortening." },
  passive:    { label: "Passive voice",   kind: "read", tip: "Check whether the actor matters. Passive voice is useful when the action or result is the focus." },
  adverb:     { label: "Adverbs & weakeners", kind: "read", tip: "Check whether each modifier adds precision, voice, or necessary uncertainty." },
  complex:    { label: "Has a simpler alternative", kind: "read", tip: "A simpler word/phrase will do." },
};

// ---- Regex assembly --------------------------------------------------------

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function wordRe(words) {
  const alt = [...words].sort((a, b) => b.length - a.length).map(esc).join("|");
  return new RegExp(`\\b(?:${alt})\\b`, "giu");
}
function phraseRe(phrases) {
  const alt = [...phrases]
    .sort((a, b) => b.length - a.length)
    .map((p) => esc(p).replace(/ /g, "\\s+").replace(/'/g, "['’]"))
    .join("|");
  return new RegExp(`\\b(?:${alt})`, "giu");
}

const AI_WORDS_RE = wordRe(AI_WORDS);
const AI_TRANSITIONS_RE = wordRe(AI_TRANSITIONS);
const AI_PHRASES_RE = phraseRe(AI_PHRASES);
const COMPLEX_RE = phraseRe(Object.keys(COMPLEX));
const WEAKENERS_RE = phraseRe(WEAKENERS);
const ADVERB_RE = /\b[\p{L}]+ly\b/giu;
const PASSIVE_RE =
  /\b(?:am|is|are|was|were|be|been|being)\b(?:\s+\w+ly)?\s+(\w+ed|known|given|done|made|seen|born|built|held|kept|left|lost|met|paid|read|run|said|sold|sent|set|shown|told|won|written|drawn|driven|eaten|fallen|forgotten|gotten|hidden|proven|ridden|risen|shaken|spoken|stolen|thrown|worn|chosen|broken|frozen|grown|beaten|bound|found|ground|wound|brought|bought|caught|taught|fought|sought|dealt|felt|meant|spent)\b/gi;

// ---- Helpers ---------------------------------------------------------------

function collect(re, text, cat, cover, extra) {
  re.lastIndex = 0;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (m[0].length === 0) {
      re.lastIndex++;
      continue;
    }
    if (cover && covered(cover, start, end)) continue;
    out.push({ start, end, cat, text: m[0], ...(extra ? extra(m) : null) });
  }
  return out;
}
function covered(ranges, start, end) {
  for (const r of ranges) if (start < r.end && end > r.start) return true;
  return false;
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return word.length ? 1 : 0;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function splitSentences(text) {
  const out = [];
  const re = /[^.!?]*[.!?]+[\])'"”’]*\s*|[^.!?]+$/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    if (!raw.trim()) continue;
    out.push({ start: m.index, end: m.index + raw.length, text: raw });
  }
  return out;
}

// Hemingway-style per-sentence difficulty via Automated Readability Index.
function sentenceLevel(text) {
  const words = (text.match(/[\p{L}\p{N}'’-]+/gu) || []).length;
  const letters = (text.match(/[\p{L}\p{N}]/gu) || []).length;
  if (words < 14) return { words, level: 0 };
  const level = Math.round(4.71 * (letters / words) + 0.5 * words - 21.43);
  return { words, level };
}

// ---- Statistical signals ---------------------------------------------------
// Distributional measures that separate AI from human prose even when the
// surface vocabulary is clean. Each is gated on a minimum amount of text so
// short snippets stay "n/a" rather than producing noisy verdicts, and each
// returns a review level of "low" | "review" | "high" | "na".

const WORD_TOKEN_RE = /[\p{L}\p{N}'’-]+/gu;

function mean(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

// Words per sentence, ignoring empty fragments.
function sentenceWordCounts(sentences) {
  return sentences
    .map((s) => (s.text.match(WORD_TOKEN_RE) || []).length)
    .filter((n) => n > 0);
}

// Burstiness = coefficient of variation of sentence length. Human writing
// mixes short and long sentences (high CV ≈ 0.5–0.9); AI hovers near a median
// (low CV). Needs >= 5 sentences to be meaningful.
function burstiness(counts) {
  if (counts.length < 5) return null;
  const m = mean(counts);
  if (!m) return null;
  const variance = mean(counts.map((n) => (n - m) ** 2));
  return Math.sqrt(variance) / m;
}

// Moving-average type-token ratio (window 50) — a length-stable lexical
// diversity measure. Low MATTR means recycled vocabulary. Falls back to plain
// TTR for texts shorter than one window.
function mattr(tokens, window = 50) {
  if (tokens.length < 40) return null;
  const t = tokens.map((w) => w.toLowerCase());
  if (t.length <= window) return new Set(t).size / t.length;
  let sum = 0;
  let n = 0;
  for (let i = 0; i + window <= t.length; i++) {
    sum += new Set(t.slice(i, i + window)).size / window;
    n++;
  }
  return sum / n;
}

// Share of trigram occurrences that repeat an earlier trigram. Humans rarely
// echo exact 3-word sequences; AI does it more. Needs >= 60 words.
function repeatedTrigramRate(tokens) {
  if (tokens.length < 60) return null;
  const t = tokens.map((w) => w.toLowerCase());
  const seen = new Map();
  let total = 0;
  let repeats = 0;
  for (let i = 0; i + 3 <= t.length; i++) {
    const g = `${t[i]} ${t[i + 1]} ${t[i + 2]}`;
    total++;
    const c = (seen.get(g) || 0) + 1;
    seen.set(g, c);
    if (c > 1) repeats++;
  }
  return total ? repeats / total : null;
}

// Build the document-level signal list with human-readable verdicts. Thresholds
// are heuristic, chosen to lean conservative (avoid false "ai" calls).
function statisticalSignals(sentences, wordTokens) {
  const signals = [];
  const na = (key, label, detail) =>
    signals.push({ key, label, verdict: "na", display: "-", detail });

  // 1. Sentence-length variation (burstiness).
  const b = burstiness(sentenceWordCounts(sentences));
  if (b == null) {
    na("burstiness", "Sentence-length variation", "Need ≥ 5 sentences to judge rhythm.");
  } else {
    const verdict = b < 0.35 ? "high" : b < 0.5 ? "review" : "low";
    signals.push({
      key: "burstiness",
      label: "Sentence-length variation",
      verdict,
      value: b,
      display: b.toFixed(2),
      detail:
        verdict === "high"
          ? "Sentence lengths are unusually even. Read the passage aloud and revise only if the rhythm feels mechanical."
          : verdict === "review"
            ? "Sentence lengths are somewhat even; check cadence in context."
            : "Sentence lengths have a broad spread.",
    });
  }

  // 2. Lexical diversity (MATTR-50).
  const d = mattr(wordTokens);
  if (d == null) {
    na("diversity", "Lexical diversity", "Need ≥ 40 words to judge vocabulary spread.");
  } else {
    const verdict = d < 0.62 ? "high" : d < 0.7 ? "review" : "low";
    signals.push({
      key: "diversity",
      label: "Lexical diversity",
      verdict,
      value: d,
      display: d.toFixed(2),
      detail:
        verdict === "high"
          ? "Vocabulary repeats more than expected. Check for accidental repetition; do not replace clear terms merely to chase variety."
          : verdict === "review"
            ? "Moderate vocabulary spread. Repeated terms may be necessary for precision."
            : "Vocabulary has a broad spread.",
    });
  }

  // 3. Repeated 3-grams.
  const r = repeatedTrigramRate(wordTokens);
  if (r == null) {
    na("repetition", "Phrase repetition", "Need ≥ 60 words to check repeated phrasing.");
  } else {
    const verdict = r > 0.05 ? "high" : r > 0.02 ? "review" : "low";
    signals.push({
      key: "repetition",
      label: "Phrase repetition",
      verdict,
      value: r,
      display: `${(r * 100).toFixed(1)}%`,
      detail:
        verdict === "high"
          ? "Several 3-word sequences repeat. Check whether the repetition is structural, necessary, or accidental."
          : verdict === "review"
            ? "Some phrasing repeats."
            : "Little exact phrase repetition.",
    });
  }

  return signals;
}

// ---- Main ------------------------------------------------------------------

export function analyze(text, { medium = "essay" } = {}) {
  text = text || "";
  const marks = [];
  const cover = []; // phrase ranges suppress inner word-level dupes

  // 1. Phrases (highest priority; reserve their spans).
  const phrases = collect(AI_PHRASES_RE, text, "phrase");
  for (const p of phrases) {
    marks.push(p);
    cover.push({ start: p.start, end: p.end });
  }

  // 2. Structures.
  for (const s of AI_STRUCTURES) {
    const hits = collect(s.re, text, "structure");
    if (s.min && hits.length < s.min) continue;
    for (const hit of hits) {
      hit.label = s.label;
      hit.tip = s.tip;
      marks.push(hit);
    }
  }

  // 3. Complex phrases (skip inside AI phrases).
  for (const c of collect(COMPLEX_RE, text, "complex", cover)) {
    c.suggestion = COMPLEX[c.text.toLowerCase().replace(/\s+/g, " ")];
    marks.push(c);
  }

  // 4. AI words (skip inside AI phrases).
  const aiwords = collect(AI_WORDS_RE, text, "aiword", cover);
  const aiwordPos = new Set(aiwords.map((w) => w.start));
  marks.push(...aiwords);

  // 5. Transitions — only when piled up.
  const trans = collect(AI_TRANSITIONS_RE, text, "transition", cover);
  if (trans.length >= TRANSITION_MIN) marks.push(...trans);

  // 6. Adverbs (-ly, excluding stop list + anything already an AI word) + weakeners.
  for (const a of collect(ADVERB_RE, text, "adverb", cover)) {
    if (ADVERB_STOP.has(a.text.toLowerCase())) continue;
    if (aiwordPos.has(a.start)) continue;
    marks.push(a);
  }
  marks.push(...collect(WEAKENERS_RE, text, "adverb", cover));

  // 7. Passive voice.
  marks.push(...collect(PASSIVE_RE, text, "passive"));

  // 8. Sentences (background layer).
  const sentences = splitSentences(text);
  let hard = 0,
    veryhard = 0;
  for (const s of sentences) {
    const { level } = sentenceLevel(s.text);
    if (level >= 14) {
      marks.push({ start: s.start, end: s.end, cat: "veryhard" });
      veryhard++;
    } else if (level >= 10) {
      marks.push({ start: s.start, end: s.end, cat: "hard" });
      hard++;
    }
  }

  // ---- Stats ----
  const wordTokens = text.match(/[\p{L}\p{N}'’-]+/gu) || [];
  const words = wordTokens.length;
  const sentenceCount = sentences.length || (words ? 1 : 0);
  const syllables = wordTokens.reduce((n, w) => n + countSyllables(w), 0);
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim()).length;

  const counts = {};
  for (const k of Object.keys(CATEGORIES)) counts[k] = 0;
  for (const m of marks) if (m.cat in counts) counts[m.cat]++;

  const aiTells = counts.phrase + counts.aiword + counts.structure + counts.transition;

  // Flesch–Kincaid grade level for the headline readability number.
  let grade = 0;
  if (words && sentenceCount) {
    grade = 0.39 * (words / sentenceCount) + 11.8 * (syllables / words) - 15.59;
  }
  grade = Math.max(0, Math.round(grade));

  // Statistical (distributional) signals — the layer that catches AI text with
  // clean vocabulary. Computed document-wide, surfaced separately from marks.
  const signals = statisticalSignals(sentences, wordTokens);

  // Heuristic surface-pattern score (0–100). Statistical observations stay
  // separate: low rhythm or diversity can be appropriate and should not turn
  // into a hidden authorship penalty.
  const weighted =
    counts.aiword * 1 + counts.phrase * 2.5 + counts.structure * 2 + counts.transition * 1;
  const per100 = words ? (weighted / words) * 100 : 0;
  const lexScore = per100 * 5;

  const score = Math.min(100, Math.round(lexScore));

  const stats = {
    words,
    sentences: sentenceCount,
    paragraphs,
    syllables,
    readingTimeSec: Math.round((words / 200) * 60),
    grade,
    gradeLabel: grade <= 9 ? "Good" : grade <= 12 ? "OK" : "Hard to read",
    counts,
    aiTells,
    signals,
    score,
    scoreLabel:
      score < 10 ? "Few flagged patterns" : score < 30 ? "A few patterns" : score < 60 ? "Pattern cluster" : "Dense pattern cluster",
    medium,
    hard,
    veryhard,
  };

  return { marks, stats, sentences };
}
