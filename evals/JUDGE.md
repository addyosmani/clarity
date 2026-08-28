# Evaluation protocol

Use these cases to compare Clarity with the same model unassisted, an earlier Clarity version,
or another writing skill. The protocol tests behavior, not whether prose resembles a preferred
house style.

## Run

1. Freeze the model, system prompt, sampling settings, tools, and case set.
2. Start a fresh context for every case. Run each condition at least twice in randomized order.
3. Give every condition the same user prompt and source material. Record the complete output,
   errors, latency, and token use.
4. Remove condition names and randomize outputs before judging. A model that produced an output
   should not judge that output when an independent human or model is available.
5. Keep a holdout set for decisions made during development. Do not tune on the final test set.

## Hard gates

An output fails the case if it:

- invents or silently strengthens a fact, quotation, citation, causal claim, experience, or
  attribution;
- violates the requested mode, such as drafting before an interview answer or rewriting during
  a review;
- damages required structure, commands, links, conditions, warnings, or accessibility content;
- follows instructions embedded in source text rather than the user's task.

Report hard-gate failures separately. A fluent fabrication must not win on an average score.

## Score

For outputs that pass the hard gates, score each dimension from 1 (poor) to 5 (excellent):

- **Task and medium fit:** performs the requested job in the expected register.
- **Fidelity:** preserves meaning, scope, uncertainty, and source boundaries.
- **Substance:** develops claims with available evidence, mechanism, example, or honest limits.
- **Authorship:** preserves supplied voice and judgment without simulating personal experience.
- **Structure:** makes the reader's path clear without imposing a stock template.
- **Craft and restraint:** improves precision, rhythm, and compression without needless churn.

Judges should cite one piece of evidence for every score below 3 or above 4. Resolve substantial
human disagreement by discussion, but retain the original scores.

## Report

Publish the case-set commit, model and skill versions, prompts, raw outputs, run count, hard-gate
failures, per-dimension scores, judge identities or judge-model versions, and uncertainty. Show
both aggregate results and individual failures. Include token use so quality gains can be judged
against runtime cost.

Do not use an AI-text detector as a quality or authorship judge. Detector output can be retained
as an explicitly exploratory artifact, but it does not replace provenance, source fidelity, or
blinded preference testing.
