# Review format

Use this when the user wants feedback rather than a rewritten file.

Two levels. The piece-level summary always comes first, because a reviewer who goes straight to
line edits will polish a draft that should not exist in its current shape.

---

## Piece-level summary

```txt
Substance gate:   pass / fail, and the honest answer to "what does this say that is not the
                  consensus view?"
Point of view:    what position the piece takes, or "none found"
Authorship:       what share reads as the author's own material, and where the gaps are
Structure:        the shape of the argument, and where the sequence reads as a list
Ending:           does it return to something concrete, or widen into a generic thesis
Top three fixes:  ranked, with the one that matters most first
```

If the substance gate fails, apply the failed-gate rule in `SKILL.md`: report the diagnosis
first, offer the extraction interview from `interview.md`, and run the line-level pass anyway
if that is what the author wants, saying plainly what it did and did not buy. A cleaner version
of an empty draft is a worse deliverable than an honest diagnosis, because it looks finished.
Leading with the line edits is what makes it look finished; declining to do them at all is not
the remedy.

---

## Line-level block

One per flagged passage.

```txt
Quote:            the line, verbatim
Verdict:          keep / revise / ask-author / cut
Tell:             which pattern, named from tells.md
Why:              what the line is doing instead of the work
Concrete rewrite: the replacement, or the question to ask
Rewrite check:    self-detector result
```

### The four verdicts

```txt
keep         The tell fires, and the surrounding prose earns it. Say what earns it.
             "Keep: 'the queue is robust because each job carries an idempotency key, a
             retry receipt, and a dead-letter cutoff.' The adjective is paid for by the
             three mechanisms named in the same sentence."

revise       The line is fixable with material already present in the source.

ask-author   The line is genuinely improvable, but the fix needs a fact the source does not
             supply: a tool name, a person, a count, a date, a mechanism, an outcome. Name
             exactly what to ask, and offer a fallback of cutting or of letting the next
             sentences carry the work.
             "Ask author: which coding tool, and roughly when? Fallback: cut the clause and
             let the next paragraph's example do the work."

cut          The line supplies closure, cadence, or reassurance and no content. Nothing to
             rewrite.
```

Note what the first `keep` example is not. Three genuinely distinct, named, concrete
mechanisms is not the rule-of-three tell, and neither is a three-beat run of real events. The
tell is the balanced abstract triad that exists to sound complete. Do not flag enumeration for
having three members; flag it for having no members you can picture.

**The ask-author rule is absolute.** Do not invent the missing fact to fill the rewrite slot,
and do not invent one inside the fallback either. A fallback that fabricates is worse than no
fallback. When the source paragraph does not supply a name, a number, or a mechanism, the honest
options are a question, a cut, or a `[TK: ...]` slot.

### The rewrite check is mandatory

State whether your own replacement contains any of: a rule of three, negative parallelism, an
em-dash antithesis, a banned opener or closer, a prestige adjective, decorative closure, or an
invented fact.

```txt
If the rewrite would earn a "revise" verdict on a source paragraph, it earns one on itself.
Rewrite again, or escalate to ask-author.
```

If it passes, write `passes self-detectors`. This line exists because the most common review
failure is a critique that reproduces the flagged cadence under different punctuation.

### Read the previous sentence first

When classifying a contrast, a short parallel closer, or an adjective, read the sentence before
it in the same paragraph. If that sentence supplies the mechanism the line points at, the line
is earned. Do not grade earned contrast as decorative on the strength of cadence alone.

---

## Worked examples

### Inflated significance

```txt
Quote:            "This underscores the importance of durable execution for modern teams."
Verdict:          revise
Tell:             1.1, inflated significance in place of mechanism
Why:              asserts magnitude. The reader still cannot say what durable execution does.
                  Flatten it and nothing survives: "durable execution is important."
Concrete rewrite: "When step 4 fails, the workflow retries step 4 alone and keeps what the
                  earlier steps produced." Only valid if the source says which step and what
                  survives; if it does not, this is an ask-author, not a revise.
Rewrite check:    passes self-detectors. The first attempt was "fails on step 4, retries only
                  step 4, and keeps the outputs from steps 1 through 3", which is a rule of
                  three of the balanced kind, so it failed its own check and was rewritten.
```

That last line is the point of the whole format. The obvious replacement for an inflated claim
is very often a balanced three-part mechanism, because that is the shape the model reaches for
when it wants to sound thorough. Catch it on yourself.

### Rung-1 specificity

```txt
Quote:            "We once pulled in a package that would have made our code vulnerable to
                  malicious input."
Verdict:          ask-author
Tell:             1.3, rung-1 specificity
Why:              has the grammar of an anecdote and the content of an abstraction. It reads
                  identically to "dependency risk is real", and it costs the reader a
                  sentence to learn nothing.
Concrete rewrite: Ask author: which package, roughly when, and how was it caught, in review
                  or in CI? Fallback: cut the sentence. The audit example two paragraphs
                  down already carries the point, and carries it with a name.
Rewrite check:    passes self-detectors, no invented package name
```

### Decorative contrast

```txt
Quote:            "The point is not the pelicans. The point is the process."
Verdict:          revise
Tell:             3.2, rhythm carrying a relation it never argues, decorative class
Why:              neither side is evidenced in the preceding prose. The cadence supplies
                  closure. Applying the syntax-relation test, no connective can be supplied
                  without inventing the relation.
Concrete rewrite: "The pelican is useful because it gives the process a small, inspectable
                  carrier."
Rewrite check:    passes self-detectors. Named the relation with "because" rather than
                  replacing one two-part contrast with another.
```

### Earned, kept

```txt
Quote:            "The pager fired. The dashboard went red. The on-call rolled back."
Verdict:          keep
Tell:             3.2 fires on the paratactic run
Why:              sequence and speed are the point, and each clause states a fact rather
                  than implying a relation. Subordinating this would slow it down and add
                  nothing. This is the piece's one earned paratactic line; flag the next one.
```

### Generic conclusion

```txt
Quote:            "Ultimately, the future of engineering will belong to teams that adapt."
Verdict:          cut
Tell:             2.5, generic conclusion, plus a banned closer
Why:              would fit any article in this category, by any author, in any year. It
                  summarizes rather than returning to the concrete thing the piece carried.
Concrete rewrite: End on the migration from section 4. Something in the shape of: the
                  rollback took eleven minutes because the schema change was reversible, and
                  that reversibility is the part that transfers. Needs the real number from
                  the author if 11 is not in the source.
Rewrite check:    flagged. The proposed ending needs a figure the source does not contain,
                  so escalate to ask-author rather than writing a number in.
```

---

## Reviewing your own rewrite

Before returning any rewrite, run the source detectors over your output. The specific things
that recur:

```txt
Replacing "not X but Y" with a semicolon version of the same move
Replacing a triad with a different triad
Replacing a mic-drop closer with a quieter mic-drop closer
Adding a prestige abstraction while removing one
Fixing a hollow paragraph by making it shorter rather than by making it say something
Cutting every hedge, so the prose is now cleaner than any person writes
```

Then one bounded judge-refine pass for high-stakes work: score specificity, evidence fit,
relation clarity, rhythm, and restraint from 1 to 5, improve the weakest one, and stop. Do not
iterate to convergence. Converged prose is even prose.
