// A small, medium-aware review layer distilled from the Clarity writing skill.
// Unlike the AI-tell highlighter, these checks do not claim to measure
// authorship or collapse writing quality into a score. They surface observable
// risks and leave genuinely editorial decisions as judgment prompts.

export const MEDIUMS = {
  essay: {
    label: "Essay / article",
    opening: "Give the reader a reason to continue, then make the direction clear.",
    development: "Each paragraph should advance, complicate, support, or qualify the previous one.",
    ending: "End with the consequence, decision, or earned implication, not a recap template.",
  },
  documentation: {
    label: "Documentation",
    opening: "State what the reader can accomplish and any prerequisite they need.",
    development: "Prefer scannable steps, headings, examples, and exact names over continuous prose.",
    ending: "Leave the reader with a verified result, next step, or troubleshooting route.",
  },
  reference: {
    label: "Report / reference",
    opening: "Lead with scope, finding, or decision context.",
    development: "Keep claims traceable to evidence and distinguish fact, inference, and recommendation.",
    ending: "State the implication or decision without overstating certainty.",
  },
  academic: {
    label: "Academic",
    opening: "Establish the question, gap, and contribution at the appropriate level of caution.",
    development: "Keep claims attributable and preserve necessary qualifications and field terminology.",
    ending: "Separate results, limitations, and implications.",
  },
  legal: {
    label: "Legal / policy",
    opening: "State scope, authority, and the issue under consideration.",
    development: "Preserve defined terms, qualifications, and exact relationships; clarity does not mean casualness.",
    ending: "Make obligations, exceptions, and next actions explicit.",
  },
  marketing: {
    label: "Marketing",
    opening: "Lead with a concrete audience problem or benefit you can support.",
    development: "Connect benefits to mechanisms or evidence; avoid unsupported superlatives.",
    ending: "Use one clear, proportionate call to action.",
  },
  message: {
    label: "Email / message",
    opening: "Put the reason for writing early.",
    development: "Keep context proportional to the ask and make ownership clear.",
    ending: "End with the specific response or next step you need.",
  },
  ui: {
    label: "UI copy",
    opening: "Name the state or action in the user's language.",
    development: "Prefer short, actionable wording; preserve terms the interface already uses.",
    ending: "Make the next action and consequence unambiguous.",
  },
  speech: {
    label: "Talk / speech",
    opening: "Earn attention aloud and orient the audience quickly.",
    development: "Use signposts people can follow once; test cadence by speaking it.",
    ending: "Land one memorable consequence or invitation.",
  },
  narrative: {
    label: "Narrative",
    opening: "Create curiosity, tension, voice, or scene without forcing an essay thesis.",
    development: "Protect deliberate ambiguity, rhythm, and character voice while removing accidental confusion.",
    ending: "Resolve or sharpen the intended emotional and thematic effect.",
  },
};

const LONGFORM = new Set(["essay", "reference", "academic", "marketing", "speech", "narrative"]);

const GENERIC_OPENING_RE = /\b(?:in today['’]s (?:fast-paced |digital )?world|in (?:the )?(?:modern world|digital age|ever-evolving landscape)|since the dawn of time|throughout human history|when it comes to|in this (?:article|essay|piece),? (?:we will|i will|we['’]ll|i['’]ll))\b/i;
const GENERIC_ENDING_RE = /\b(?:in conclusion|in summary|to sum up|all things considered|the future (?:looks|is) bright|only time will tell|as we move forward|the journey (?:doesn['’]t|does not) end here)\b/i;
const VAGUE_ATTRIBUTION_RE = /\b(?:studies (?:show|suggest|indicate)|research (?:shows|suggests|indicates)|experts (?:say|believe|argue|warn)|critics (?:say|argue|claim)|observers (?:say|note|believe)|many (?:people )?(?:say|believe|argue|think)|some (?:people )?(?:say|believe|argue|think)|it is widely (?:believed|accepted|known)|according to (?:research|experts|reports))\b/gi;
const IMPORTANCE_RE = /\b(?:important|crucial|vital|pivotal|transformative|groundbreaking|significant|essential|central|key|remarkable|unprecedented)\b/gi;
const MECHANISM_RE = /\b(?:because|by|through|which|so that|therefore|means|allows?|enables?|results? in|leads? to|causes?|prevents?|reduces?|increases?|measured|according to|for example|such as)\b/i;
const EXTREME_RE = /\b(?:always|never|everyone|nobody|impossible|guaranteed|completely|entirely|unprecedented)\b/gi;

// A deliberately conservative subset of the supplied Claude-frequency wall.
// These terms are not individually bad. A cluster is shown only as an
// experimental corpus signal and never changes the surface-tell score.
export const CLAUDE_CLUSTER_TERMS = [
  "load-bearing", "re-derived", "byte-identical", "mutation-checked",
  "mutation-verified", "mutation-tested", "re-verified", "re-measured",
  "byte-identity", "byte-for-byte", "vacuously", "short-circuits",
  "self-heals", "chokepoint", "backstop", "tripwire", "goldens",
  "unparseable", "papered over", "re-derive", "re-derives", "falsified",
  "provably", "restated", "ungated", "unit-tested", "machinery",
];

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CLAUDE_CLUSTER_RE = new RegExp(
  `\\b(?:${CLAUDE_CLUSTER_TERMS.map(esc).sort((a, b) => b.length - a.length).join("|")})\\b`,
  "giu",
);

function wordCount(text) {
  return (text.match(/[\p{L}\p{N}'’–-]+/gu) || []).length;
}

function matches(re, text) {
  re.lastIndex = 0;
  return [...text.matchAll(re)].map((m) => m[0]);
}

function sentenceContaining(text, index) {
  const left = Math.max(text.lastIndexOf(".", index - 1), text.lastIndexOf("!", index - 1), text.lastIndexOf("?", index - 1), text.lastIndexOf("\n", index - 1));
  const tails = [text.indexOf(".", index), text.indexOf("!", index), text.indexOf("?", index), text.indexOf("\n", index)].filter((n) => n >= 0);
  const right = tails.length ? Math.min(...tails) + 1 : text.length;
  return text.slice(left + 1, right).trim();
}

function importanceWithoutMechanism(text) {
  const out = [];
  IMPORTANCE_RE.lastIndex = 0;
  let m;
  while ((m = IMPORTANCE_RE.exec(text)) !== null) {
    const sentence = sentenceContaining(text, m.index);
    if (!MECHANISM_RE.test(sentence)) out.push(sentence || m[0]);
  }
  return [...new Set(out)];
}

function claudeCluster(text, words) {
  const found = matches(CLAUDE_CLUSTER_RE, text).map((s) => s.toLowerCase());
  const distinct = [...new Set(found)];
  const active = words >= 150 && distinct.length >= 4;
  return {
    active,
    count: found.length,
    distinct,
    detail: words < 150
      ? "Need at least 150 words before this corpus signal is useful."
      : active
        ? `${distinct.length} supplied Claude-frequency terms cluster here: ${distinct.slice(0, 8).join(", ")}. This is experimental, topic-sensitive, and not evidence of authorship.`
        : "No meaningful cluster from the supplied Claude-frequency vocabulary. Individual matches are intentionally ignored.",
  };
}

export function analyzeClarity(text, { medium = "essay" } = {}) {
  text = text || "";
  const profile = MEDIUMS[medium] || MEDIUMS.essay;
  const words = wordCount(text);
  if (!words) return { medium: MEDIUMS[medium] ? medium : "essay", profile, checks: [], summary: { issues: 0, reviews: 0 }, claudeSignal: claudeCluster(text, words) };

  const checks = [];
  const add = (id, title, status, detail, evidence = []) => checks.push({ id, title, status, detail, evidence });
  const longform = LONGFORM.has(medium) && words >= 120;

  add(
    "purpose",
    "Reader and outcome",
    "review",
    `${profile.opening} Check that the intended reader can tell what to understand, feel, decide, or do.`,
  );

  const vague = matches(VAGUE_ATTRIBUTION_RE, text);
  add(
    "sources",
    "Source fidelity",
    vague.length ? "issue" : "review",
    vague.length
      ? "Name the source or narrow the claim. The editor can spot vague attribution, but it cannot verify facts."
      : "Verify factual claims, quotations, names, numbers, and causal links against the source. The editor cannot do that for you.",
    vague,
  );

  const unsupported = importanceWithoutMechanism(text);
  add(
    "support",
    "Claims and support",
    unsupported.length ? "issue" : "good",
    unsupported.length
      ? "Importance language needs a mechanism, example, comparison, or evidence nearby. Remove it if the sentence works without it."
      : "No unsupported importance claim was obvious from the wording alone.",
    unsupported,
  );

  const extremes = matches(EXTREME_RE, text);
  if (extremes.length) {
    add(
      "extremes",
      "Overstated certainty",
      "review",
      "Check whether each absolute is earned. Keep it when the source supports it; otherwise narrow the claim.",
      extremes,
    );
  }

  const opening = text.trim().slice(0, 500).match(GENERIC_OPENING_RE)?.[0];
  add(
    "opening",
    "Opening",
    opening ? "issue" : longform ? "good" : "na",
    opening ? `${profile.opening} The current opening begins with a stock frame.` : longform ? profile.opening : "Opening review is reserved for longer forms in this medium.",
    opening ? [opening] : [],
  );

  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  add(
    "development",
    "Development",
    longform && paragraphs.length >= 3 ? "review" : "na",
    longform && paragraphs.length >= 3
      ? `${profile.development} For each paragraph, name the relation to the one before it.`
      : "Add more developed paragraphs before judging the argument or narrative arc.",
  );

  const endingText = text.trim().slice(-500);
  const ending = endingText.match(GENERIC_ENDING_RE)?.[0];
  add(
    "ending",
    "Ending",
    ending ? "issue" : longform ? "review" : "na",
    ending ? `${profile.ending} The current ending uses a stock conclusion.` : longform ? profile.ending : "Ending review is reserved for longer forms in this medium.",
    ending ? [ending] : [],
  );

  if (longform) {
    add("voice", "Voice and ownership", "review", "Ask: could only this author have written this? Preserve useful quirks, judgment, and specific experience instead of polishing everything flat.");
    add("readaloud", "Read aloud", "review", "Read the opening, transitions, and ending aloud. Fix accidental friction; keep deliberate rhythm and emphasis.");
  }

  const claudeSignal = claudeCluster(text, words);
  if (claudeSignal.active) {
    add("claude-cluster", "Claude vocabulary cluster", "review", claudeSignal.detail, claudeSignal.distinct);
  }

  return {
    medium: MEDIUMS[medium] ? medium : "essay",
    profile,
    checks,
    summary: {
      issues: checks.filter((c) => c.status === "issue").length,
      reviews: checks.filter((c) => c.status === "review").length,
    },
    claudeSignal,
  };
}
