// Correctness checks for the AI-tell + readability engine.
// Run: node apps/ai-writing-editor/patterns.test.mjs
import { analyze } from "../../src/lib/editor/patterns.js";

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) failures++;
}
const cats = (r) => r.marks.map((m) => m.cat);
const textsOf = (r, cat) => r.marks.filter((m) => m.cat === cat).map((m) => m.text);

// --- AI words / intensifiers
let r = analyze("Honestly, we should delve into this vibrant tapestry. Actually, it's basically robust.");
check("flags 'delve'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("delve"));
check("flags 'honestly'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("honestly"));
check("flags 'actually'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("actually"));
check("flags 'basically'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("basically"));
check("flags 'tapestry'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("tapestry"));
check("aiTells counted", r.stats.aiTells >= 5);

// --- AI phrases
r = analyze("It's worth noting that this plays a crucial role. I hope this helps! Let me dive into it.");
check("flags 'it's worth noting'", textsOf(r, "phrase").some((t) => /worth noting/i.test(t)));
check("flags 'plays a crucial role'", textsOf(r, "phrase").some((t) => /crucial role/i.test(t)));
check("flags 'i hope this helps'", textsOf(r, "phrase").some((t) => /hope this helps/i.test(t)));

// --- phrase suppresses inner word (no double count of 'crucial')
r = analyze("This plays a crucial role here.");
check("'crucial' not double-flagged inside phrase", textsOf(r, "aiword").length === 0);

// --- Structures
r = analyze("It's not just a tool, it's a revolution.");
check("negative parallelism flagged", cats(r).includes("structure"));

r = analyze("The system is fast — and shipped on time.");
check("a single em dash is not treated as an AI tell", !r.marks.some(m=>m.label==="Dash cluster"));
r = analyze("One — aside. Two — aside. Three — aside.");
check("a cluster of em dashes is reviewable", r.marks.filter(m=>m.label==="Dash cluster").length === 3);

r = analyze("The design is engaging, inspiring, and empowering for everyone here.");
check("rule of three flagged", r.marks.some((m) => m.label === "Rule of three"));
check("rule of three guidance is contextual", r.marks.find((m) => m.label === "Rule of three").tip.includes("Keep it"));

r = analyze("They expanded the park, highlighting the city's growth over time.");
check("editorial -ing tail flagged", r.marks.some((m) => m.label === "Editorial -ing tail"));

// --- Transitions: gated by frequency
r = analyze("However, we shipped it. The plan worked.");
check("single transition NOT flagged", !cats(r).includes("transition"));
r = analyze("However, we shipped. Moreover, it worked. Furthermore, users liked it. Additionally, sales rose.");
check("piled-up transitions flagged", cats(r).includes("transition"));

// --- Hemingway: adverbs, passive, complex, hard sentences
r = analyze("The report was carefully written by the committee.");
check("adverb 'carefully' flagged", textsOf(r, "adverb").map(s=>s.toLowerCase()).includes("carefully"));
check("passive voice flagged", cats(r).includes("passive"));

r = analyze("We utilize this in order to facilitate the work.");
check("complex 'utilize' flagged", textsOf(r, "complex").map(s=>s.toLowerCase()).includes("utilize"));
check("complex 'in order to' flagged", textsOf(r, "complex").some(t=>/in order to/i.test(t)));
check("'utilize' has suggestion", r.marks.find(m=>m.cat==="complex"&&/utilize/i.test(m.text)).suggestion === "use");

r = analyze("The committee, which had been convened under considerable political pressure from numerous competing stakeholders, deliberated extensively.");
check("very long dense sentence flagged hard/veryhard", r.marks.some((m) => m.cat === "hard" || m.cat === "veryhard"));

// --- false positives: clean human sentence
r = analyze("I made coffee. The dog barked. We left for the train.");
check("clean text has no AI tells", r.stats.aiTells === 0);
check("clean text low score", r.stats.score < 10);
check("'only' not flagged as adverb", !textsOf(r, "adverb").includes("only"));

// --- stats sanity
r = analyze("The cat sat on the mat. It was warm.");
check("word count correct", r.stats.words === 9);
check("sentence count correct", r.stats.sentences === 2);
check("grade is a number", Number.isFinite(r.stats.grade));

// --- refreshed excess vocabulary (empirical 2024–25 style verbs)
r = analyze("We aim to bolster and surpass results and catalyze an ingenious ecosystem.");
check("flags 'bolster'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("bolster"));
check("flags 'surpass'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("surpass"));
check("flags 'catalyze'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("catalyze"));
check("flags 'ecosystem'", textsOf(r, "aiword").map(s=>s.toLowerCase()).includes("ecosystem"));

// --- useful document structure is not treated as an AI tell
r = analyze("## Setup\n\n- Install the package\n- Run the test\n- Check the output", { medium: "documentation" });
check("documentation headings and lists are preserved", r.stats.aiTells === 0);
r = analyze("This is **bold** text in a sentence for testing.");
check("markdown bold is not an AI tell", !r.marks.some((m) => m.format === true));

// --- statistical signals: always present, correct keys
r = analyze("Short text.");
const sigKeys = r.stats.signals.map((s) => s.key).sort().join(",");
check("signals present with expected keys", sigKeys === "burstiness,diversity,repetition");
check("short text -> burstiness n/a", r.stats.signals.find((s)=>s.key==="burstiness").verdict === "na");

// --- burstiness: uniform sentence lengths read as low-variation (ai/mixed)
const uniform = Array.from({length: 8}, () => "The team shipped the update on time today.").join(" ");
r = analyze(uniform);
check("uniform sentence lengths flagged for review",
  ["high","review"].includes(r.stats.signals.find((s)=>s.key==="burstiness").verdict));

// --- burstiness: varied sentence lengths read as human
const varied = "Yes. The committee, after weeks of heated and circular debate that satisfied almost nobody, finally reached a compromise on the budget. It held. Barely. Then everyone went home for the long weekend, exhausted but quietly relieved that the ordeal was over at last.";
r = analyze(varied);
check("varied sentence lengths report low concern",
  r.stats.signals.find((s)=>s.key==="burstiness").verdict === "low");

// --- descriptive signals never silently change the surface-pattern score
const even = [
  "Ada packed the small blue case before sunrise.",
  "Ben checked the old road map before breakfast.",
  "Cara filled the metal flask before leaving.",
  "Drew locked the back garden gate before noon.",
  "Eli folded the thick wool blanket before lunch.",
  "Faye counted the loose change before boarding.",
].join(" ");
r = analyze(even);
check("low sentence variation remains descriptive", ["high","review"].includes(r.stats.signals.find((s)=>s.key==="burstiness").verdict));
check("statistical observations do not raise the score", r.stats.score === 0);

// --- expanded high-signal cliche coverage
r = analyze("Sit with that. Here's the twist: turns out the only result that matters is trust.");
check("contemporary cliche phrases are covered", textsOf(r, "phrase").some((t) => /sit with that/i.test(t)));
check("only-X-that-matters structure is covered", r.marks.some((m) => m.label === "Only X that matters"));

// --- no overlapping marks crash on empty / weird input
check("empty input ok", analyze("").stats.words === 0);
check("whitespace input ok", analyze("   \n\n  ").stats.words === 0);
check("empty input has signals array", Array.isArray(analyze("").stats.signals));

console.log(failures ? `\n${failures} FAILED` : "\nAll passed");
process.exit(failures ? 1 : 0);
