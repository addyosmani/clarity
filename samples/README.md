# Samples

Two short essays, each in the state an agent produced it and again after a pass with this
skill. Both drafts and both rewrites were written by a model, not by a person. Nobody is
claiming the rewrites are good essays. They are here so you can see which specific things the
pass changes, and, more usefully, which ones it cannot.

```txt
what-it-means-to-be-human.before.md    asked for a short essay, no other instruction
what-it-means-to-be-human.after.md     the same brief, run through the skill
how-ai-works.before.md                 asked for a short explainer, no other instruction
how-ai-works.after.md                  the same brief, run through the skill
```

Reproduce the numbers below with:

```bash
python3 ../scripts/strip_markdown.py what-it-means-to-be-human.before.md | python3 ../scripts/prose_stats.py -
```

## What the linter says

| | words | sentence CV | hedge/100 | anchors/100 | must-be-zero | triads | stock phrases | false agency |
|---|---|---|---|---|---|---|---|---|
| human, before | 491 | 0.358 | 2.04 | 2.44 | 2 | 5 | 3 | 2 |
| human, after | 439 | 0.441 | 2.05 | 4.33 | 0 | 2 | 0 | 0 |
| AI, before | 502 | 0.400 | 3.19 | 5.58 | 5 | 2 | 4 | 2 |
| AI, after | 496 | 0.377 | 1.81 | 2.02 | 0 | 0 | 0 | 0 |

The must-be-zero column counts hedge-and-booster in one sentence, participial openers, and
contrastive pivots. Both rewrites clear it. Both also lose the stock openers ("At its core",
"In today's", "It's worth noting", "Let's dive into") and the abstract nouns performing human
acts ("the conversation moves forward", "The data tells us").

Two numbers went the wrong way, and they are worth more than the ones that went right.
Sentence variance in the AI explainer fell slightly, and hedge density in both rewrites sits
below the 3.5 to 4.5 band that real prose occupies. At 450 words these figures are noisy, and
the skill's own calibration reference warns against tuning a draft until every box is green:
a draft that hits every target can still be empty. They are reported here unfixed for that
reason.

## What actually changed

The before drafts fail in the same place, which is not the sentences.

**The essay on being human** opens on "In today's rapidly evolving technological landscape".
It attributes its central claim to "Experts argue" and supports its one empirical statement
with "Studies show". It closes on "the future belongs to those who can hold both technological
progress and human values in the same hand." Not one sentence in it could be checked or
disputed. The rewrite gives it a position to defend and replaces every unsourced gesture with
something a reader can look up: Goodall at Gombe in 1960, Kanzi and the lexigram board, Nagel's
bat paper in 1974, Bronnie Ware's palliative-care notes. The "Studies show" sentence about
purpose and longevity was cut. That is what the skill asks for when a citation cannot be
named and the writer will not invent one.

**The AI explainer** was more salvageable, because the subject has facts in it. The before
draft says a neural network is "inspired by the structure of the human brain" and works "like
a factory assembly line", which explains nothing and is the kind of analogy that survives
because it sounds like teaching. The rewrite names the mechanism instead: the 2017 transformer
paper, attention as a learned weighted blend over the context, the two training phases, and
why neither of them optimises for truth. The single most useful addition is the tokenizer,
which the before draft never mentions and which is the actual reason a model that writes
working code miscounts the letters in "strawberry".

## What the pass could not fix

Neither essay has an author. That is the honest limit of this demonstration and the reason the
directory exists.

The skill's first gate asks who the reader is, what one arguable point the piece makes, and
which sentences could only have been written by this author. For both drafts the third answer
is none, and no amount of editing changes it. The rewrites replace generic assertion with
checkable public fact, which is a real improvement and the most a rewrite can do on its own.
What they cannot supply is the thing that makes writing worth reading: the number you measured,
the argument you had, the belief you have changed. When the skill hits a draft like this it is
supposed to say so before it starts editing, and offer the interview in `references/interview.md`
instead.

So read these as a demonstration of the surface half of the job. The essay on being human still
reads as an essay by nobody in particular, because it is one. The explainer holds up better,
since a technical subject lets verifiable detail stand in for personal material for a while.
That difference between the two files is the point of the sample set.
