# Calibration

Anti-slop advice is easy to over-apply. Push the rules to their limit and you get prose that is
tight, trimmed, unhedged, and specific in every sentence, which is exactly what a competent
model editor also produces. The corrections below are measured, and several of them contradict
rules that circulate as absolutes.

Two bodies of evidence sit behind this file:

```txt
A. Eighteen full-length checks against a leading AI-text classifier, August 2026, run on one
   article at publish length with a human-written control.
B. Paired A/B evals of borrowed anti-slop rules against a held-out set, run across three
   models with apply and judge separated, published by the anti-slop-writing project.
```

Where they disagree with a popular rule, the measurement wins.

---

## 1. The law: authorship share dominates everything else

Across fifteen full-length drafts in eight registers, the classifier's human percentage tracked
the share of words the author actually wrote, close to linearly.

| Author share of words | Result |
|---|---|
| 0% | 89–100% machine |
| ~40% | 71–81% machine |
| ~55% | 56% machine |
| ~68% | 79% human |
| ~75% | 81% human |
| 100% | 100% human |

Register, structure, lint compliance, and literary quality moved results within roughly ten
points of that line. Authorship share moved them by eighty.

**The controlled pair.** The same true story, told twice. Version A: the author's real
situation, motivation, audience, and analytical framework given to the model, and the model
worded it. Version B: the author's own dictated words, cut and reordered, never smoothed, used
as the spine, with a compact model-written research block in the middle.

```txt
Version A: 100% machine, identical to fully invented content.
Version B: 79% human, with the model block correctly localized in the middle.
```

```txt
Provenance works as tokens, never as information.
```

Telling the model why you are writing changes nothing. Giving it your sentences changes
everything. Budget effort accordingly, and treat any editing-only plan that promises a human
result as unmeasured optimism.

**Practical consequence.** The classifier scores per span, so in a mixed document the author's
paragraphs come back clean and the model's come back flagged. That is the honest shape of a
co-written artifact, not a failure. Do not try to smear the model block through the piece to
hide it.

---

## 2. Never perform humanness

Every attempt to simulate human texture scored worse than a clean draft, and three of them
tripped the classifier's dedicated warning for text that shows signs of deliberate
humanization.

| Attempt | Result |
|---|---|
| Real typos, missing apostrophes, comma splices injected | 92% machine, plus the humanization warning |
| Question-and-answer rewrite | 95% machine, plus the warning |
| Telegraphic notes, compressed to fragments | 100% machine, plus the warning |
| Staged messy-draft-then-revise pipeline, run by the model | 100% machine |
| Casual first-person voice with swearing and a war story, over the same structure | 100% machine |

Two things follow. Stylization toward mess and stylization toward terseness both read as
trying to hide, and a warning that reads as deliberate evasion is a worse outcome than an
honest machine verdict, because it misrepresents who wrote the thing.

And: a casual costume does not cover a machine skeleton. Voice, profanity, and a personal story
laid over triads, balanced parallelism, and a vague anecdote still read as generated. Change
the structure, not the register.

**Banned outright:** injected typos, fake dictation markers, forced slang, deliberate grammar
errors, simulated drafting process, fabricated mess of any kind.

---

## 3. The numeric targets

These come from comparing model drafts against a human-written control on the same subject.
Every one of them is a two-sided target. Overshooting is a failure in the same direction as
undershooting.

**Read this before using any number below.** The control was a single text: a conversational
personal note. The targets describe that register and generalise badly outside it. Measured
against the BBC Earth *Being Human* essay, a piece of confident broadcast prose that a
classifier scored fully human, four of the five targets read "off":

| | BBC essay | target | verdict |
|---|---|---|---|
| body sentence CV | 0.515 | > 0.60 | off |
| hedge + booster / 100 | 0.79 | 3.5-4.5 | off by a factor of four |
| anchors / 100 | 2.48 | 3-4 | off |
| triads | 5 | low | off |
| sentences past 40 words | 2 | 0 | off |

That piece is good writing. So the numbers below are register-bound, not laws. Conversational
and reflective prose hedges; declarative, broadcast, and promotional prose does not, and
forcing hedges into it makes it worse. Use the targets to notice a habit in prose of the same
register as the control. Never use them to grade a piece.

### 3.1 Sentence-length variance

The one signal that tracked the classifier monotonically across five full-length drafts.

```txt
Target: coefficient of variation of sentence length above 0.60,
        measured only on sentences of 8 or more words.
```

Measured: CV 0.425 → 95% machine, 0.455 → 100%, 0.462 → 100%, 0.469 → 92%, 0.797 → 89%.

The eight-word floor matters. Dropping a one-line paragraph or a section-break fragment into
the piece inflates the headline number while the sustained prose underneath stays uniform. It
buys reader-facing variance a classifier's window never sees. The variance has to live inside
the paragraphs, between full-length sentences.

### 3.2 Hedge density

```txt
Target: 3.5–4.5 hedge or booster words per 100 words, in conversational or reflective prose.
        Confident declarative prose runs far lower and is not wrong to.
```

The human control ran at 4.29 per 100. Drafts written to "cut every hedge and every -ly word"
landed at 0.98–2.18, which is how you get prose cleaner than any person wrote, reading exactly
that way.

So "cut the hedges" means: cut hedges that hide a claim you could state plainly. Keep the ones
that are how a person actually talks. "can be really valuable", "we might", "sometimes",
"often", "tends to" all belong in human prose.

**Read the two halves separately, because the guidance pulls in opposite directions.** The
target counts hedges and boosters together, and the rest of this skill tells you to cut
boosters. Both hold: reach 3.5 to 4.5 almost entirely on hedges, and let the booster count fall
toward the low single digits. A draft that hits the combined number by stacking "crucial" and
"significant" has hit the target in the wrong currency. `prose_stats.py` reports
`hedge_per_100` and `booster_per_100` separately for exactly this reason; read those two before
the combined figure.

### 3.3 Concrete anchor density

```txt
Target: 3–4 anchors per 100 words. Some paragraphs should carry none.
```

Anchors are numbers, dates, proper nouns, named systems, quoted lines. The human control sat at
2.86 per 100. Drafts written to "add specifics everywhere" reached 5.98. Wall-to-wall citation
density is its own tell, and it reads like a model trying to prove it did the reading.

### 3.4 Counts to drive to zero

```txt
Hedge and booster in the same sentence ("this may be a crucial signal")
Participial sentence openers ("Building on this,", "Drawing from the study,")
Contrastive pivots: rather than, not simply, not merely, not necessarily, not solely,
  as opposed to, even as, and the "X changes; the Y remains" semicolon shape
```

The human control had zero contrastive pivots. Drafts written against the strict "not X but Y"
rule alone still carried two or three of the wider family, because the strict rule does not
match them.

### 3.5 Signpost openers

```txt
Target: under 30% of sentences opening on a connective. Zero is normal and fine.
```

---

## 4. The overcorrection traps

### 4.1 Blanket bans are wrong

A paired A/B eval of borrowed blanket rules found the literal versions inert or harmful, and
the durable result was a regression guard locking in the opposite: keep earned passive voice,
earned adverbs, and earned Wh- openers.

```txt
Bans that do not survive testing:
  all adverbs
  all passive voice
  all em dashes
  all Wh- word sentence openers
  all semicolons
  all repetition
  all sentence fragments
```

Each has earned uses. The correct operation is adjudication, not deletion. `tells.md` gives the
earned test for each.

The em dash case is worth stating precisely, because it is the one people get wrong in both
directions. Do not ban it. Watch for decorative clusters where dashes supply emphasis rather
than bracketing a genuine aside or an inline definition. Keep at most one earned insertion per
sentence, spread them, and if the author's own writing sample uses dashes at a rate, match
that rate. An author whose house style bans them is a separate, and higher, authority.

### 4.2 The composite-score trap

A stylometric linter run over eight texts with classifier verdicts attached produced an
**inverted** composite. The genuinely human control had the highest risk score in the corpus.
The draft the classifier flagged hardest had the lowest.

```txt
Never optimize for a lower composite. On this material a falling composite means the prose is
drifting toward the machine register, not away from it.
```

This is why the script in `scripts/` reports individual features and refuses to produce a
single number.

### 4.3 Goodhart

Every enumerable target in this file can be hit exactly. A draft that met all of them still
scored 93% machine. The remaining distance was authorship, not editing. Use the numbers to find
genuine habits, then stop.

### 4.4 Quality and detectability are different axes

A draft written to Hemingway-bench standards, with economy, no quotable lines, the conclusion
stated once, and the reader trusted with the subtext, was the best prose of the project and
scored 96% machine. Meanwhile the text that scored 100% human is loose, slightly repetitive,
and hedged.

```txt
Apply craft because it makes the writing better. Never as a tactic. And never let a score
talk you into making the prose worse.
```

### 4.5 Controlled mess, on purpose

The texts that read as human were not flat. They were loose, parenthetical, hedged, and
self-correcting. Pushed to their limit, the anti-slop rules produce tight, trimmed, flat prose,
which is what a good model editor also produces.

So spare some texture on purpose. Read the list below as things to leave alone when an edit
rule wants to remove them, never as a menu of things to insert:

```txt
a scare-quote on one word
a bracketed aside
an "i.e." or a "(and a few other things)"
a slightly clumsy clause you would normally smooth
a piece of trade slang the author already uses
a word repeated because it is the right word
```

When the rules say cut and the line still sounds like a person thinking, keep it.

**The line between this and §2, stated once, because the two sections look contradictory and
are not.** Sparing texture that is already in the draft or in the author's own words is honest.
Inserting texture that was never there is the performance §2 bans, and it is the same operation
whichever direction it runs: a slang word the author would not use, a bracketed aside you
invented, a clumsy clause added for effect. If you are reaching for this list while writing
rather than while cutting, you are on the wrong side of it.

### 4.6 Short samples prove nothing

Every text that came back fully human in the corpus was short: 65, 88, 115 words, each carrying
the classifier's own low-confidence caveat. Every confident machine verdict was on text of 345
words and up.

```txt
Judge at publish length. A short passing sample is the classifier declining to commit, not the
prose winning. Chunking a long piece into small passes says nothing about the whole.
```

---

## 5. Process beats editing

The compressed version of everything above:

```txt
Detection is a process problem, not an editing problem.
The lever is how the draft was made, not how it was cleaned.
```

The pipeline that worked, and the only one that produced a majority-human result in seventeen
attempts:

```txt
1. The author talks first. Voice or stream-typed. One take is enough; 430 usable words came
   out of a single chat answer.
2. That material becomes the spine, cut and reordered, never smoothed.
3. The model's contribution stays a visibly minority block.
4. The author's existing published writing closes the piece verbatim.
```

Run by the person. Not performed by the model.
