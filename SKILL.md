---
name: clarity
description: Draft, rewrite, and review prose so it carries a real point of view and does not read like generic model output. Use when the user asks to make writing sound less AI-generated or less generic, to humanize or de-slop a draft, to write a blog post, essay, newsletter, README, talk intro, launch copy, or documentation that has to be good, or when a draft is technically correct but says nothing only its author could say. Runs a perspective interview before drafting, keeps the author's own sentences as the spine, edits by earned-or-unearned judgment instead of blanket bans, and refuses to fabricate specifics or perform humanness.
license: MIT
compatibility: Agent Skills clients including Claude Code, Codex, OpenCode, Gemini CLI, and Pi.
metadata:
  version: "1.0.0"
---

# Clarity

Most bad writing produced with an agent is not ungrammatical. It is correct, fluent, well
organized, and empty. It could have been written about any company, by any author, in any
year. That is the failure this skill exists to catch, and every rule below serves it.

The premise, in one line:

```txt
Writing reads as a person's when it carries information only that person had.
Everything else is surface.
```

Surface work still matters, and this skill does plenty of it. But run it in the right order.
A draft with nothing in it cannot be rescued by deleting its adverbs.

## Load references on demand

```txt
references/interview.md    — the perspective extraction protocol. Read before drafting anything
                             substantial from scratch, or when a draft is fluent but hollow.
references/tells.md        — the full pattern catalog with earned/unearned adjudication.
                             Read for any real edit pass or review.
references/calibration.md  — measured targets and the overcorrection traps. Read before you
                             start cutting hedges, adverbs, dashes, or passives at scale.
references/critique.md     — review output format and worked before/after examples.
                             Read when the user wants a critique rather than a rewrite.
```

## Pick the mode

| Situation | Mode | Where to start |
|---|---|---|
| The piece does not exist yet | **Co-write** | Interview first. Do not draft. |
| A draft exists and needs to be better | **Rewrite** | Substance gate, then the edit pass. |
| The user wants feedback, not a new file | **Review** | `references/critique.md` format. |

When the mode is ambiguous, ask once, in one sentence. Then commit.

---

## Gate 0: the substance gate

Run this before any stylistic edit, in every mode. Three questions about the draft or the
brief:

```txt
1. What does this say that is not the consensus view of anyone who has read three
   articles on the topic?
2. What in here could be wrong? Name the specific claim a reader could check and dispute.
3. Which sentences could only have been written by this author?
```

If the honest answers are "nothing," "nothing," and "none," the problem is not the prose.

**The failed-gate rule, which every mode in this skill defers to.** Report the diagnosis first,
in two or three sentences, naming what the piece is missing. Offer the extraction interview in
`references/interview.md`. Then, if the author still wants the edit, do it in full and say what
it bought and what it did not. Never silently polish a hollow draft, because the polish is what
makes it look finished. And never withhold the work because the diagnosis was unwelcome. Report,
deliver, label.

### The only-you test

Apply per paragraph. Could this paragraph appear, near-verbatim, in someone else's piece on
the same subject? If yes, it is filler even when every word of it is true. Cut it, or replace
it with the thing the author knows that the other writer does not.

### The ladder of specificity

Most "be specific" advice fails because writers climb one rung and stop. The rungs:

```txt
Rung 0  abstraction     "Teams struggle with dependency risk."
Rung 1  category        "We once installed a package that made us vulnerable."
Rung 2  instance        "A transitive dependency of a lint plugin started
                         exfiltrating env vars in a patch release."
Rung 3  named instance  "event-stream, November 2018, eight million weekly
                         downloads, and the payload only fired inside Copay."
```

Rung 1 is the trap. It has the grammar of a specific but the content of an abstraction, and
it reads exactly like Rung 0. Anything load-bearing needs Rung 2 or better.

**The honesty limit, which overrides the ladder.** Never invent a Rung 3. Do not manufacture a
name, number, date, quote, benchmark, or remembered incident to satisfy a specificity target.
When only the author holds the detail, leave a marked slot and say what is missing:

```txt
[TK: which package, and roughly when?]
```

A cut is better than a fabrication. A slot is better than a cut. A hypothetical clearly framed
as hypothetical is fine; a fake memory in the author's voice is not.

---

## Mode: co-write

The single highest-leverage finding behind this skill, measured across eighteen full-length
checks against a leading AI-text classifier in August 2026:

```txt
The share of words the author actually wrote predicted the outcome almost linearly.
Register, structure, lint compliance, and literary quality moved it by about ten points.
Authorship share moved it by eighty.
```

And the sharper version of the same result, from a controlled pair on the same true story:

```txt
Provenance works as tokens, never as information.
```

Telling the model the author's real situation, motivation, audience, and framework, then
letting the model word it, scored the same as fully invented content. The same material in the
author's own unsmoothed sentences read as the author's. So the workflow is not "gather context,
then generate." It is "gather sentences, then arrange."

**Steps:**

1. **Interview.** Run `references/interview.md`. Ask the author to talk, not to type notes.
   One take. No tidying.
2. **Collect prior writing.** Old posts, internal notes, coined definitions, lists they have
   already published. These slot in verbatim and count fully as theirs. Link out to them.
3. **Build the spine from the author's words, edited only by cutting and reordering.** Never
   paraphrase, never smooth conversational grammar, never fix a half-finished thought into a
   clean one. Rewording the author's content in your tokens destroys the whole value of having
   collected it.
4. **Keep your own contribution a bounded, visible minority.** Research, citations, definitions,
   comparisons, data compression. Target 25% of total words or less, kept in delimited sections
   rather than sprinkled sentence by sentence, so a reader can see which part is which. Verify
   every fact and every URL.
5. **Cut your own prose first.** Length trades against authorship share. Every extra paragraph
   you write dilutes the piece.
6. **Apply the edit pass to your block only.** The author's spine is not yours to improve.

If the author gives you less than roughly 300 words, ask one follow-up (a specific example
usually pulls the most), then work with what you have and tell them plainly what the smaller
share buys.

**Zero author input.** Offer the interview first, and say plainly what the piece loses without
it. If the author declines, write the draft anyway and label it: this is a model draft in the
author's register, not the author's writing, and the provenance note should say so. The thing
this mode will not do is hand that draft over as though it were theirs. Refusing to write it at
all is not the rule, and never was.

---

## Mode: rewrite

1. Run **Gate 0**. If the draft is hollow, apply the failed-gate rule: report, offer the
   interview, and edit anyway if that is what the author wants, labelled for what it is.
2. **Calibrate the voice.** If the user supplies a sample of their own writing, read it first
   and extract sentence-length distribution, punctuation habits, paragraph shape, opinion
   density, recurring phrases, register, and the words they avoid. A sample outranks every
   default in this skill. If they say "stuff," do not promote it to "elements." If their sample
   uses em dashes at a steady rate, keep them at that rate.
3. **Preserve every claim.** You may cut dull passages, expand useful ones, merge or split
   paragraphs, and restructure. You may not lose a fact or add one. A fact is something a
   reader could check. An assertion of significance with no evidence, an appeal to unnamed
   experts, a status-signalling list of publications, and a rejected option the piece never
   returns to are none of them facts, so the tells that say cut those are not asking you to
   drop information. When you are unsure which kind of sentence you have, keep it and flag it.
4. Run the **edit pass** below.
5. Run the **self-check** on your own output before returning it.

---

## The edit pass

Ordered. Earlier items change what later items are looking at.

```txt
 1. Delete the generic opening. Start at the first sentence that carries information.
 2. Replace claims of importance with the mechanism that earns them.
    "This underscores the importance of durable execution."
    → "When step 4 fails, the workflow retries step 4 alone and keeps what steps 1 to 3
       already produced."
    The mechanism has to come from the source. If the draft never says what durable execution
    does here, you cannot supply it: ask the author, or cut the sentence. Every "after" example
    in this skill assumes the facts were already on the page.
 3. Name the actor. An abstract noun may not perform a human act. Decisions do not emerge,
    cultures do not shift, data does not tell us. Someone decided, someone changed how they
    work, someone read the chart. If no one specific fits, use "you" and put the reader in
    the seat. The exception, and it is a real one: keep a passive when the actor is genuinely
    unknown or beside the point, and the object is the topic. Do not drive passives to zero.
 4. Climb the specificity ladder on every load-bearing claim. Rung 2 minimum, or a TK slot.
 5. Cut the superficial -ing tails: "highlighting the...", "underscoring its...",
    "reflecting the community's deep connection to...". They add cadence, not content.
 6. Break the triads. Real lists are lumpy: two things, or five, or one. When you catch a
    balanced three, cut to two or push to four, or turn it into a sentence with a subject.
 7. Kill the contrastive scaffolding, and note that it has two halves with two different
    budgets. The lexical pivots go to zero: "not simply", "not merely", "not solely", "not
    necessarily", "rather than", "as opposed to", "even as", and the "X changes; the Y
    remains" semicolon shape. The rhetorical frame, "not X but Y" and "isn't the problem,
    Y is", is allowed once in a whole piece, and only when the negation carries information
    the reader already holds. Otherwise state Y.
 8. Cut the answers to objections nobody raised, and the rejections of options nobody would
    pick. "I'm not saying X" and "a tempting approach would be Y, but" are usually fossils of
    an earlier draft.
 9. Name the relation between sentences instead of implying it with rhythm. Prefer
    subordination when the relation is load-bearing: because, although, once, where, so that,
    which means. Keep parataxis when sequence or speed is the point, and keep at most one
    earned instance per piece.
10. Fix the paragraph joins. Each paragraph should answer the previous one's question or make
    the next one necessary. If the headings are doing all the organizing, add a hinge sentence
    that names the relation, and make the hinge factual rather than grand.
11. Vary rhythm inside the paragraphs, between full-length sentences. A one-line paragraph
    buys reader-facing variance that a classifier's window never sees, and it is not a
    substitute for real variance in the body.
12. Rewrite the ending hardest. This is where the signal leaks: the summary, the widened
    claim, the send-off, the line built to be quoted. A good ending returns to the concrete
    thing the piece has been carrying, admits the limit, and stops. No "In conclusion", no
    "Ultimately", no vague optimism about the future.
13. Strip the artifacts: chatbot pleasantries, prompt echoes, knowledge-cutoff disclaimers,
    title-case headings, decorative emoji, bold-label bullet lists, a first sentence that
    only restates its own heading.
14. Re-read for the words. `references/tells.md` has the catalog. Treat every hit as a
    hypothesis, not a verdict.
```

**The once-per-piece budgets.** Three devices in this skill are capped rather than banned, and
they are easy to spend without noticing because each is capped in a different place. Count them
together on the finished draft:

```txt
one "not X but Y" frame, where the negation carries information         (edit pass 7, tells 3.1)
one earned paratactic run, where sequence or speed is the point         (edit pass 9, tells 3.2)
one quotable line, where it is the actual thesis and the piece paid    (tells 2.9)
```

Three is the ceiling for a whole piece, not a quota to fill. Spending zero of them is normal
and reads fine. And the quotable-line allowance never applies at a paragraph ending, where the
shape is the tell.

---

## Calibration: the traps on the other side

Overcorrection produces its own detectable register. These targets are measured, and several
of them contradict the blanket rules in circulation. Full detail and the evidence in
`references/calibration.md`.

```txt
Hedges     Do not cut to zero. Real authors hedge at roughly 3.5–4.5 hedge or booster words
           per 100. Drafts written to "cut every hedge" land near 1 and read cleaner than any
           human wrote. Cut hedges that hide a claim you could state; keep the ones that are
           how a person talks.
Anchors    Do not over-specify either. Roughly 3–4 concrete anchors per 100 words. Some
           paragraphs should carry no number at all. Wall-to-wall citation density is its own
           tell.
Cadence    Coefficient of variation of sentence length above 0.6, measured on sentences of
           eight words or more. Section-break one-liners inflate the headline number without
           fixing the body.
Bans       Blanket bans are wrong: on adverbs, passive voice, em dashes, Wh- openers,
           semicolons, and repetition. Each has earned uses. Judge earned vs decorative.
Boosters   Hedge and booster in the same sentence ("this may be a crucial signal") is the
           strongest single lexical tell. Get that co-occurrence to zero.
Mess       Never perform humanness. Injected typos, faked dictation markers, telegraphic
           fragment compression, and staged messy-draft pipelines all score worse than an
           honest clean draft, and they read as evasion.
Goodhart   Every enumerable target here can be hit exactly by a draft that is still empty.
           Use them to find real habits, never as a score to maximize.
Quality    Writing quality and machine-detectability are different axes. Apply craft because
           it makes the piece better, not as a tactic, and never make prose worse chasing a
           score.
```

---

## Never

```txt
Invent a fact, name, number, date, quote, citation, benchmark, or incident.
Attribute a claim to unnamed experts, observers, industry reports, or "some critics."
Write a remembered experience in the author's first person that they did not tell you.
Add typos, fake mess, or forced slang to look human.
Present a guess as a fact when the source is silent. Say the source is silent.
Rewrite a watched phrase inside a quotation, title, proper name, or example being discussed.
Hand back a model-written piece as though it were the author's own writing. Writing one is
  fine when they have declined the interview; presenting it unlabelled is not.
```

---

## Self-check before returning

```txt
Did I run the same detectors on my own output that I ran on the source? In particular, does
  my rewrite reuse a cadence I just flagged, under different punctuation?
Does every load-bearing claim sit at Rung 2 or above, or carry a TK slot?
Did I add or lose a single fact, number, name, date, quote, or citation?
Can I name, per paragraph, the relation to the paragraph before it?
Does the ending return to something concrete, or does it widen into a thesis that would fit
  any piece in this category?
Did I flatten each of my best lines and check that the residual claim still names an actor,
  a mechanism, or a limit? If the flattened version collapses, the rhythm was carrying it.
Did I overcorrect: zero hedges, zero dashes, zero passives, an anchor in every sentence?
Is there anything in here that only this author could have written?
```

For high-stakes prose, add the bounded scoring pass in **Score before delivering** below.
That table is the skill's only rubric; score once, fix the weakest dimension once, and stop.

---

## Quick pass before delivering

Recall list. Run it top to bottom on the finished draft. Items marked with a target are
measured; the rest are judgement calls.

**Scope.** In co-write mode this list applies to your block, never to the author's spine. Their
half-finished thought, wrong preposition, and repeated word are the point. Running the checklist
over them is the one operation that reliably destroys the piece.

```txt
Substance
  Any paragraph that could appear in someone else's piece on this topic? Cut or replace it.
  Any load-bearing claim below Rung 2? Climb it, or leave a TK slot.
  Any number, name, or date in the last 300 words? If none, find one. Do not invent one.
  Any claim of importance without the mechanism beside it? Give the mechanism.
  Any anecdote that could belong to anyone? Cut it.
  Does the piece take a position, or report both sides and leave?

Structure
  Three of anything in a row? Make it two, or five, or a sentence with a subject.
  Any "not X, it's Y"? State Y, unless you are spending the one frame from the budget block.
  A coined term with a definition after it? Drop the ceremony.
  A paragraph ending on a line built to be quoted? Flatten it.
  Can you name the relation each paragraph has to the one before it?
  Did the ending get polished into a summary or a send-off? Rough it up and return to the
    concrete thing the piece was carrying.

Sentences
  An abstract noun doing a human act? Name the person, or use "you".
  Narrating from the clouds ("nobody designed this", "teams tend to")? Put the reader in
    the room.
  A lazy extreme (every, always, never) standing in for a quantity? Give the quantity.
  Six abstractions in a list? Replace with one thing the reader can picture.
  Hedge and booster in the same sentence? Rewrite it.                          target zero
  Sentence opening on a participial clause?                                    target zero
  Any of: rather than, not simply, not merely, as opposed to, even as?         target zero
  A "not X but Y" frame? One allowed per piece, and only if the negation informs.
  Three sentences of the same length in a row? Break one.

Measured
  Body sentence-length CV, on sentences of 8+ words                            target > 0.60
  Cadence masking (share of lines under 8 words)                               target < 0.05
  Hedge and booster words per 100                                              target 3.5-4.5
  Concrete anchors per 100                                                     target 3-4
  Sentences opening on a connective                                            target < 30%

Restraint
  Did you cut every hedge and every aside? Put the real ones back. Real means already
    present in the draft or in the author's own words. Inventing texture that was never
    there is the performance banned two lines down, not the fix for over-trimming.
  Did you ban a device rather than adjudicate it: adverbs, passives, dashes, Wh- openers,
    semicolons, repetition? Reconsider each on the earned test.
  Tempted to add typos, fake mess, or fragments to look human? Do not. It reads as evasion.
  Did an edit make the prose worse in service of a score? Revert it.
  Judging on a short excerpt? Judge at publish length.

Provenance
  In a co-written piece: what share is the author's own words, and is the model block still
    a visible minority you could point at?
  Any fabricated fact, name, number, date, quote, or memory? Remove it and leave a TK slot.
```

## Score before delivering

Five dimensions, one to ten each. Below 35 out of 50, revise.

| Dimension | Question |
|---|---|
| Substance | Does it say anything only this author could say? |
| Directness | Statements, or announcements? |
| Rhythm | Varied, or metronomic? |
| Trust | Does it respect the reader? |
| Restraint | Anything left to cut, and anything over-cut? |

Treat this as a stop condition, not an optimizer. Score once, fix the weakest dimension once,
and ship. Iterating a numeric score to convergence produces even prose, which is the thing you
were trying to avoid.

---

## Optional diagnostics

The scripts localize habits. They do not predict anything and produce no composite score, by
design: a composite invites optimizing toward the machine register.

```bash
python3 scripts/strip_markdown.py draft.md > /tmp/draft.txt
python3 scripts/prose_stats.py /tmp/draft.txt
```

Read the output as a map of where to look, and check it against the calibration targets above.
A flagged line is a hypothesis. Open the paragraph and decide.

## What to return

**Rewrite of pasted text.** The rewrite, then a short list of what you changed and any TK
slots the author needs to fill.

**File mode.** Write only the final prose to the file. Leave code blocks, frontmatter, data,
and link targets untouched. Summarize the changes in chat.

**Embedded mode.** When another task calls this skill, return only the final text.

**Review.** Use the format in `references/critique.md`.

**Co-write.** Return the draft plus a provenance note: roughly what share is the author's own
words, which sections are yours, and what still needs their input.
