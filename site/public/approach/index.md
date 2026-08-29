# The Clarity approach

Clarity works on the source of a piece before polishing its surface. It asks what the reader needs, protects the author's facts and uncertainty, and uses an interview when the draft does not yet contain enough of the author.

## What makes it different

Clarity checks familiar AI-shaped phrases and structures, but treats them as prompts for judgment rather than proof of authorship. The medium changes the advice: an essay, research paper, runbook, and email should not be edited toward the same shape.

Source discipline is a hard boundary. Clarity marks a gap or asks the author rather than inventing a vivid detail. A writing sample can control cadence, vocabulary, and formality, but cannot supply facts or experiences for a new piece. Its small core routes to focused references only when the task needs them.

## When to use Clarity

Use Clarity when an AI agent needs to draft from an interview, rewrite an existing piece without inventing facts, or review a draft without changing it. It is designed for essays, articles, newsletters, documentation, talks, launch copy, and other reader-facing work where meaning and voice need to survive the edit.

Clarity covers the familiar territory of AI humanizers, anti-slop prompts, and Claude Code writing skills, but sets a broader target. It catches stock phrases and repetitive structures, then asks whether the draft has a real source, a useful claim, the right register, and something only this author could say. It never treats a detector score as proof of good writing.

## One essay, three times

The same brief, a short essay about what it means to be human, was written three ways.

1. The unedited agent draft is fluent but generic. It relies on stock openings, unnamed experts, unsupported gestures, and a conclusion that could fit almost any essay.
2. A Clarity rewrite removes the stock language, narrows claims to what the source supports, and makes uncertainty visible. It still lacks an author's private material.
3. The final version begins with a six-minute interview. The agent cuts, reorders, and lightly edits the transcript while preserving the author's examples and turns of thought.

The comparison shows the boundary of an editing skill: editing can improve a draft, but it cannot manufacture the experiences and judgments that make the writing belong to someone.

### Source files

- [All samples](https://github.com/addyosmani/clarity/tree/main/samples)
- [Interview transcript](https://github.com/addyosmani/clarity/blob/main/samples/what-it-means-to-be-human.transcript.txt)
- [Final interview version](https://github.com/addyosmani/clarity/blob/main/samples/what-it-means-to-be-human.after-interview.md)
- [Pangram comparison result](https://www.pangram.com/history/a211e4fd-4b3f-4d2f-a2d2-726a96323949?ucc=NTu9jwxRrgn)

## What the evals cover

The repository contains eleven behavioural cases covering factual fidelity, medium fit, false positives, authorship boundaries, mode boundaries, and instructions embedded in source text.

Four failures are hard gates: invented or strengthened facts, violation of the requested mode, damage to required structure, and obedience to instructions embedded in source material. Outputs that pass are scored on task and medium fit, fidelity, substance, authorship, structure, and craft.

The protocol freezes the model and settings, uses fresh randomized contexts, blinds condition names, retains failures, and records token use. Clarity has evaluation infrastructure, but does not claim a benchmark win before comparable results are published with model versions, raw outputs, multiple runs, judges, scores, and failures.

- [Evaluation cases](https://github.com/addyosmani/clarity/blob/main/evals/cases.json)
- [Blinded judging protocol](https://github.com/addyosmani/clarity/blob/main/evals/JUDGE.md)

## Questions people ask

### What is the Clarity AI writing skill?

Clarity is an open-source Agent Skill that helps an AI agent draft, rewrite, review, or co-write prose. It starts with reader needs, source material, and the job of the piece before polishing sentences.

### Is Clarity an AI humanizer or AI detector?

Clarity can find and revise familiar AI writing patterns, but it is not an authorship detector and does not promise undetectable text. Its goal is clearer, more specific writing that preserves facts, uncertainty, medium, and the author's voice.

### Which AI agents can use Clarity?

Clarity can be installed in Claude Code, Codex, and other agents that support skill instructions. The repository also includes optional command wrappers for its interview, rewrite, and review modes.

### What kinds of writing can Clarity help with?

Clarity supports essays, articles, newsletters, documentation, talks, launch copy, email, UI text, academic prose, and other reader-facing writing. Its advice changes with the medium instead of forcing every draft into one house style.

### Does Clarity have evals?

Yes. The public suite has eleven behavioural cases covering factual fidelity, medium fit, authorship boundaries, false positives, mode boundaries, and resistance to instructions hidden in source text. Clarity does not yet claim a benchmark win.

### Is the Clarity Writing Editor private?

Yes. The browser editor runs its checks locally and does not upload the draft. It reviews AI writing tells, readability, repetition, passive voice, and broader Clarity questions.

Return to the [Clarity agent index](https://clarity.addy.ie/llms.txt).
