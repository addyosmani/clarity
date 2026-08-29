// Correctness checks for the medium-aware Clarity review layer.
// Run: node apps/ai-writing-editor/clarity.test.mjs
import { analyzeClarity, MEDIUMS } from "../../src/lib/editor/clarity.js";

let failures = 0;
function check(name, cond) {
  console.log(`${cond ? "✓" : "✗"} ${name}`);
  if (!cond) failures++;
}
const byId = (r, id) => r.checks.find((c) => c.id === id);

check("offers several writing media", Object.keys(MEDIUMS).length >= 8);

let r = analyzeClarity("Studies show this is a crucial change.", { medium: "reference" });
check("flags vague attribution", byId(r, "sources").status === "issue");
check("flags importance without a mechanism", byId(r, "support").status === "issue");
check("does not claim to verify facts", /cannot verify facts/.test(byId(r, "sources").detail));

r = analyzeClarity("This matters because it cuts startup time by 40%, according to the benchmark.");
check("mechanism and evidence satisfy the wording check", byId(r, "support").status === "good");

const longOpening = `In today's fast-paced world, software changes quickly. ${"A concrete sentence adds context and explains what happened. ".repeat(24)}`;
r = analyzeClarity(longOpening, { medium: "essay" });
check("flags a stock long-form opening", byId(r, "opening").status === "issue");

r = analyzeClarity("# Install\n\n- Download the package\n- Run the command\n- Check the output", { medium: "documentation" });
check("documentation does not demand an essay opening", byId(r, "opening").status === "na");
check("documentation profile recommends useful structure", /headings/.test(r.profile.development));

const ordinary = `${"The team checked the result and wrote down what happened. ".repeat(20)} Plainly, the premise held.`;
r = analyzeClarity(ordinary);
check("ordinary Claude-list words do not trigger a cluster", !r.claudeSignal.active);
check("Claude-list matches never become issue marks", !r.checks.some((c) => c.id === "claude-cluster"));

const clustered = `${"The team checked the result and wrote down what happened. ".repeat(20)} The load-bearing backstop was re-verified with mutation-tested goldens and a tripwire.`;
r = analyzeClarity(clustered, { medium: "documentation" });
check("several rare supplied terms trigger an experimental cluster", r.claudeSignal.active);
check("Claude cluster is only a review prompt", byId(r, "claude-cluster").status === "review");
check("Claude cluster carries an authorship caveat", /not evidence of authorship/.test(byId(r, "claude-cluster").detail));

check("empty input is safe", analyzeClarity("").checks.length === 0);
check("unknown medium falls back safely", analyzeClarity("Some text.", { medium: "unknown" }).profile === MEDIUMS.essay);

console.log(failures ? `\n${failures} FAILED` : "\nAll passed");
process.exit(failures ? 1 : 0);
