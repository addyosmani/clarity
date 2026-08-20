# The tell catalog

Every entry has the same shape: the pattern, why it fails, when it is earned, and the fix.

Read the "earned" line before you cut anything. These are hypotheses, not verdicts. A detector
hit that the surrounding prose already pays for is a keep, and you should say why you kept it.
The failure mode of every anti-slop list in circulation is a writer applying it as a ban and
producing a new, equally uniform register.

Sections:

```txt
1. Substance tells      the ones that matter most
2. Structure tells      document and paragraph shape
3. Sentence tells       cadence, relation, and syntax
4. Word tells           vocabulary and phrases
5. Format tells         markup habits
6. Artifact tells       chatbot residue
7. What not to flag     false-positive restraint
```

---

## 1. Substance tells

### 1.1 Inflated significance in place of mechanism

The strongest and most common failure. The sentence asserts that something matters instead of
showing what it does.

```txt
Watch: underscores the importance of, plays a crucial role, marks a pivotal moment,
       represents a shift, a testament to, highlights the significance of, reflects a
       broader trend, setting the stage for, leaves an indelible mark
Why:   the claim of magnitude is doing the work the evidence should do
Earned: when the surrounding sentences already supply the mechanism, the failure mode, the
        measurement, or the boundary that makes the term true
Fix:   state the mechanism and let the reader compute the importance
```

```txt
Before: The 1989 founding marked a pivotal moment in the evolution of regional statistics.
After:  The institute was founded in 1989, part of a wider decentralization of Spanish
        administrative functions.

Before: This underscores the importance of durable execution.
After:  The workflow can fail on step 4, retry only step 4, and keep the earlier outputs.
```

**The flatten test.** Write out the version of the line with the cadence removed and the claim
preserved. If the residual still names an actor, a mechanism, or a limit, the idea was carrying
it. If it collapses into something generic, the rhythm was.

### 1.2 Vague sources

```txt
Watch: experts argue, observers have noted, industry reports suggest, some critics say,
       studies show, it is widely believed, several publications
Why:   an unfalsifiable claim wearing the costume of a citation
Earned: never, as written. Either the source exists and can be named, or the claim goes.
Fix:   name the source, or cut the claim. Do not invent a source to satisfy this rule.
```

### 1.3 Rung-1 specificity

An anecdote or example that has the grammar of a specific and the content of an abstraction.
"A package that would have made our code vulnerable to bad input" is not a specific; it is
"dependency risk" with more words. See the ladder in `SKILL.md`.

```txt
Fix: name it, or cut the example. A blurred anecdote is worse than no anecdote, because it
     costs the reader time and returns nothing.
```

### 1.4 Superficial -ing analysis

```txt
Watch: highlighting..., underscoring..., reflecting..., symbolizing..., contributing to...,
       fostering..., showcasing..., ensuring..., encompassing...
Why:   a participial tail bolted onto a plain fact to make it sound analyzed
Earned: when the clause states a real consequence the reader could not infer
Fix:   delete the tail, or promote it to a full clause with a subject and evidence
```

```txt
Before: The temple is blue, green, and gold, symbolizing Texas bluebonnets and the Gulf,
        reflecting the community's deep connection to the land.
After:  The temple is painted blue, green, and gold, colors chosen to evoke Texas bluebonnets
        and the Gulf.
```

### 1.5 Name-dropping as evidence

Listing well-known publications, follower counts, or logos to establish that something matters.
Keep a citation that carries content ("she argued in the FT that the cap would not bind").
Cut a list that only signals status.

### 1.6 Answering objections nobody raised, rejecting options nobody would pick

```txt
Watch: I'm not saying, this isn't really about, to be clear, don't get me wrong, some might
       say X but, a tempting approach would be, one might be tempted to, you might think X
Why:   usually a fossil of an earlier draft. It defends against a reader who does not exist.
Earned: when the objection is attributed, or is one a real reader in this audience holds and
        the text then answers in full. In a design doc, a genuinely considered alternative.
Fix:   state the real claim directly. One rejected option can be legitimate; three short
       unrelated rejections in a row are a drafting artifact.
```

**Do not read this as "cut the counterargument."** The opposite failure is more common in
practice and worse: a piece that never meets the strongest objection to itself. A real
objection, one a named person or a real segment of the audience actually holds, earns its own
paragraph near the end, where it gets answered or conceded. That paragraph makes the piece
more credible, not less.

The distinction is the source. An objection someone holds is reporting. An objection invented
so the writer can defeat it is the same move as an invented statistic, and it fails the same
way. When you cannot name who holds it, cut it.

### 1.7 Relentless balance

No opinion, no discomfort, no stake. "There are arguments on both sides." A piece with no
position is not neutral, it is empty, and voicelessness is itself one of the loudest tells.

```txt
Fix: take a position, or state precisely which way the author leans and what makes them
     uneasy about it. "Mixed feelings" beats "a balanced view". Where the author has not
     given you a position, ask for one rather than manufacturing it.
```

### 1.8 Padding

Two sources, and neither is "nothing to say."

```txt
Writing to a length.   A piece that needed 900 words is delivered at 1,500 because 1,500
                       looked serious. Symptoms: a paragraph restating the previous one in
                       new words, an example that proves what the last example proved, a
                       caveat nobody needed.
Writing to a form.     An introduction that introduces nothing and a conclusion that
                       concludes nothing, present because posts are supposed to have them.
                       Same for a "background" section nobody asked for.
```

```txt
Test:  does this sentence leave the reader holding more than the one before it? Restating,
       throat-clearing, and announcing what you are about to say all fail it.
Fix:   cut, and let the piece be short. Do not redistribute the words elsewhere.
Note:  a deliberate restatement for emphasis is fine once. A rhythm of restatement is not.
```

### 1.9 Coin-and-define

Naming your own concept and then defining it, often in italics on first use. "Let's call this
answerability." "This is where back-pressure comes in. Back-pressure is..."

```txt
Why:   reads like a glossary entry, and the ceremony of naming stands in for the work of
       showing the idea operating. The label is a claim that the idea is important enough to
       need one.
Earned: when the term already exists in the trade, in which case use it in passing and never
        announce it; or when the piece genuinely returns to the coinage three or four times
        and needs a handle
Fix:   drop the label and let the idea work unnamed. If the piece survives without the term,
       the term was decoration.
```

```txt
Before: Let's call this answerability: the property that someone can be asked why the system
        did what it did, and can answer.
After:  Someone has to be able to say why the system did that, and be right.
```

### 1.10 Abstract-noun pile-ups and lazy extremes

```txt
Watch: correctness, maintainability, security, performance, cost efficiency, and
       comprehensibility. Six things nobody can picture, in a row.
Why:   the list gestures at completeness while giving the reader nothing to see. Length is
       standing in for evidence.
Fix:   one concrete thing a reader can picture beats six abstractions. Name the one that
       actually bit you.
```

The same failure in miniature is the lazy extreme. "Every team", "always", "never",
"everyone", "nobody" doing the work a real quantity should do.

```txt
Before: Every team struggles with this, and reviews never catch it.
After:  Both teams I have watched try this missed it in review, twice.
```

If the real quantity is unknown, say the smaller true thing, or leave a `[TK: how many?]`.
Do not swap one sweeping claim for another.

---

## 2. Structure tells

### 2.1 The rule of three

Balanced triads and parallel stacks: "independent enough, cheap enough, difficult enough";
"intent, architecture, and taste"; "talks, panels, and networking opportunities".

```txt
Why:   real enumeration is lumpy. Three is the shape a model reaches for when it wants
       completeness without commitment.
Earned: when the three members are distinct, named, and concrete enough to picture, such as
        three real mechanisms or three real events in sequence. Enumeration is not the tell.
        The tell is the balanced abstract triad that exists to sound complete.
Fix:   cut to two, push to four, or turn the list into a sentence with a subject and a verb
```

### 2.2 Tidy topic sentence plus mic-drop closer

Thesis, elaboration, zinger. Paragraph after paragraph, the same arc.

```txt
Fix: break the shape. Open on the example. Bury the point in the middle. Let a paragraph
     stop on a plain clause. No paragraph should end on a line built to be quoted, and this
     one has no allowance: the single quotable line permitted in 2.10 may sit anywhere except
     at a paragraph ending, where the shape is the tell.
```

### 2.3 Symmetrical paragraphs and parallel headings

Every paragraph within twenty words of the same length. Every heading the same grammatical
shape. The evenness itself is the signal.

### 2.4 The stock outlook section

```txt
Watch: Despite these challenges..., Challenges and Legacy, Future Outlook, Looking ahead,
       X continues to thrive, exciting times lie ahead
Why:   an outline slot filled with vague claims instead of facts
Fix:   name the specific challenge with its consequence, or delete the section
```

### 2.5 The generic conclusion

The ending is where the signal leaks hardest, because that is where a writer reaches for the
summary and the widened claim.

```txt
A conclusion should:
  return to the concrete thing the piece has been carrying
  admit the limit or the scope
  say what transfers
  stop
It should not:
  summarize what the reader just read
  widen into a thesis that would fit any piece in this category
  end on optimism about the future
```

```txt
Weak:   A benchmark is stronger when you can inspect the run that produced it.
Better: Because the pelican project is small enough to inspect and strange enough to
        remember, it works as a carrier for the larger claim: a benchmark is stronger when
        you can inspect the run that produced it.
```

Give the last paragraph the roughest edit, not the most polish.

### 2.6 Flow by adjacency

Paragraphs that sit beside each other in a plausible order without any stated relation. Each
one is locally clear; the sequence reads as a list.

```txt
Diagnosis: the headings are doing all the organizing; the reader understands every paragraph
           but cannot predict why the next one follows
Fix:       add a hinge sentence naming the relation, and keep it factual rather than grand
```

| Relation | Form |
|---|---|
| Cause | `Because X, Y.` |
| Contrast | `Although X, Y.` |
| Dependency | `Without X, Y cannot happen.` |
| State change | `Once X is visible, Y becomes inspectable.` |
| Scope change | `At that level, Y stops being A and behaves like B.` |
| Level of detail | `The same object at three resolutions: A, B, C.` |
| Carrier to claim | `Because the example is small and memorable, it can carry the claim.` |

### 2.7 Broken unity

A piece that switches its footing partway through, usually without the writer noticing.

```txt
Pronoun:  first person for three sections, then an impersonal observer, then back
Tense:    past for the story, present for the analysis, sliding between them mid-paragraph
Mood:     casual and joking early, formal and hedged later, as the writer got tired
Distance: "I watched the deploy fail" beside "organizations often experience deployment
          friction", in the same argument
```

```txt
Why:   readers track footing below the level of attention, and a switch registers as
       something being wrong without their being able to say what. Long generated drafts
       drift this way by default, because each section is composed against its own local
       context rather than the whole.
Earned: a deliberate shift, signposted or obvious, such as dropping from narrative into a
        short technical aside and back
Fix:   pick the pronoun, the tense, and the register once, then enforce them across the
       piece. When the draft has drifted, decide which footing the best sections use and
       move the others to it. Do not average the two.
```

Check the seams first: section openings, and any paragraph written in a different sitting.

### 2.8 Meta-narration

```txt
Watch: the rest of this essay, let me walk you through, in this section we'll, as we'll see,
       let's dive in, here's what you need to know, without further ado
Why:   the piece announces its structure instead of moving
Fix:   delete. The heading already did this job.
```

### 2.9 The narrator from a distance

Floating above the scene and reporting on humanity in general, instead of putting the reader
in the room where the thing happens.

```txt
Watch: Nobody designed this. People tend to. This happens because. Teams often find
       themselves. In many organizations.
Why:   the armchair-sociologist voice. It costs nothing to write and commits to nothing.
Earned: in genuinely general writing, where the claim really is about a population and the
        evidence supports it
Fix:   put the reader in the seat. "You don't sit down one day and decide to skip the
       migration" beats "Nobody designed this."
```

"You", not "People". A scene, not a view from the clouds.

### 2.10 The quotable line

A line built to be extracted: the aphorism, the pull-quote, the closing beat that would look
good on a slide.

```txt
Why:   a line engineered for quotation is a line engineered for cadence, and cadence is
       usually what it is carrying instead of a claim. Run the flatten test on it. This is
       also the shape a model produces when asked to end a paragraph well.
Earned: once in a piece, when the line is the actual thesis and the piece has paid for it,
        and never as a paragraph ending (see 2.2)
Fix:   rewrite it flatter. State the same thing in a plain clause and see whether it still
       lands. If it does, keep the plain version.
```

Test: if you can imagine it on a conference slide with the author's name underneath, flatten
it.

---

## 3. Sentence tells

### 3.1 Negative parallelism

```txt
Watch: not X but Y, it's not just X it's Y, the question isn't X it's Y, X isn't the problem
       Y is, it's not merely X, not simply, not solely, rather than, as opposed to,
       stops being X and starts being Y, not a X. Not a Y. A Z.
Why:   the most model-coded move in circulation. It manufactures a reversal the reader did
       not need and buries Y inside a comparison.
Earned: the rhetorical frame ("not X but Y", "isn't the problem, Y is") is earned once per
        piece, when the negation carries information the reader actually holds and nothing
        plainer works. The lexical pivots below have no allowance at all; target zero.
Fix:   state Y on its own
```

The split matters, because the two halves have different budgets and are easy to confuse. The
frame is a rhetorical move you may spend once. The pivots are vocabulary, and the human control
in the calibration corpus used none of them.

Note the wide family. The strict "not only X but also Y" frame is easy to catch; the ones that
survive an edit pass are `rather than`, `not merely`, `as opposed to`, `even as`, and the
semicolon shape "the tooling changes; the substrate remains". Hunt those explicitly.

### 3.2 Rhythm carrying a relation it never argues

Short clauses set side by side, letting cadence imply cause, contrast, or consequence.

Classify before cutting:

```txt
Earned      both sides of the contrast are evidenced in the preceding prose. Keep, or use once.
Compressed  one side is evidenced, the other is a leap. Name the unsupported side directly.
Decorative  neither side is evidenced. The contrast supplies closure with no content. Cut.
```

```txt
Decorative: The point is not the pelicans. The point is the process.
Repaired:   The pelican is useful because it gives the process a small, inspectable carrier.
```

**The syntax-relation test.** Restate the implied relation in plain prose with a connective
(because, although, when, where, once, so that). If you cannot supply the connective without
inventing it, the syntax was standing in for a relation that was not there.

Prefer subordination when the relation matters. Two cautions: do not subordinate everything
into one connective-heavy sentence, which trades staccato for noun-heavy mush; and do not
apply the density check to a single earned instance. The failure is the piece leaning on the
same move four times, not any one short sentence.

### 3.3 Copula displacement

```txt
Watch: serves as, stands as, represents, marks, features, boasts, offers
Why:   a longer verb standing in for "is" or "has", which inflates without adding
Earned: when the verb is doing concrete work, enumerating, defining, or locating
Fix:   use "is" or a specific action verb
```

```txt
Before: Gallery 825 serves as LAAA's exhibition space and boasts over 3,000 square feet.
After:  Gallery 825 is LAAA's exhibition space. It has four rooms totaling 3,000 square feet.
```

### 3.4 Hedged symmetry

```txt
Watch: Whether you're X or Y, While X, Y is also important, on the one hand... on the other
Why:   addresses every reader and every value at once, and therefore commits to nobody
Earned: when it names a real branching condition with different downstream behavior
Fix:   pick the reader and name the tradeoff
```

### 3.5 False agency

An abstract noun performing a human act. Complaints do not become fixes, decisions do not
emerge, cultures do not shift, conversations do not move, data does not tell us, markets do
not reward. A machine may perform a machine act: a compiler rejects code.

```txt
Fix: name the person. "The team fixed it that week." If no one specific fits, use "you".
```

### 3.6 Passive voice and missing subjects

```txt
Why:   hides the actor and drains the sentence
Earned: when the actor is genuinely unknown, irrelevant, or the object is the real topic
        ("the release was pulled four hours later" is fine if who pulled it does not matter)
Fix:   find the actor and put them in front. Do not chase this to zero.
```

### 3.7 False ranges

```txt
Watch: from X to Y, where X and Y do not form a range
Before: from the singularity of the Big Bang to the enigmatic dance of dark matter
After:  the book covers the Big Bang, star formation, and current theories about dark matter
```

### 3.8 Synonym cycling and repeated openings

A model handles repetition by rule rather than by ear. It renames the same subject four ways
("the protagonist", "the main character", "the central figure", "the hero"), and separately it
starts run after run of sentences with the same subject.

```txt
Fix: use one name for one thing, and repeat it. Deliberate repetition of a plain word is a
     quiet signal of a person writing. For repeated openings, merge the sentences or lead
     with the action. Do not ban the word; fix the sentence pattern.
```

### 3.9 Uniform hedging, and the booster stack

```txt
Hedges:   may, might, could, tends to, generally, typically, arguably, somewhat, relatively
Boosters: crucial, essential, vital, key, significant, robust, powerful, notable, critical,
          profound, compelling, paramount, pivotal, substantial
```

Constant hedging reads as a model. Constant boosting reads as marketing. A hedge and a booster
in the same sentence ("this may be a crucial signal") is the strongest lexical tell there is:
drive that co-occurrence to zero.

But do not cut hedges to zero. See `calibration.md`. Human prose hedges considerably more than
a de-slopped draft usually does.

### 3.10 Participial and signpost openers

```txt
Participial: "Building on this,", "Drawing from the study,", "Having established X,"
Signpost:    Moreover, Furthermore, Additionally, Consequently, Therefore, Nevertheless,
             In short, Instead, Ultimately, Overall, Notably, Importantly
Fix:   delete and let the sentences sit next to each other. One "however" is not a tell;
       a run of them is outline glue.
```

### 3.11 Dramatic fragmentation and forced punchlines

```txt
Before: Then AlphaEvolve arrived. It had no preference for symmetry. No aesthetic prior.
        No nostalgia for human taste. The old rules were gone.
After:  AlphaEvolve searched without favoring symmetry or human-looking designs, which made
        the older assumptions less useful.
```

One short sentence for emphasis is a normal device. A row of them is manufactured profundity.

### 3.12 The overloaded sentence

The mirror of 3.11. One sentence carrying three ideas where three sentences would carry one
each, usually held together by commas and "and" until the reader loses the subject.

```txt
Watch: sentences past ~40 words; three or more subordinate clauses; a subject and its verb
       separated by more than a dozen words
Why:   the reader has to hold the opening in memory while parsing the middle. Ornate
       construction is usually a sign the writer had not finished deciding what they meant.
Earned: a long sentence whose length enacts something, or a list the reader reads as a list
Fix:   find the period. Most overloaded sentences have two or three already implied in them.
```

Do not swap one uniform length for another. The goal is a mix, per 3.9 and the cadence
targets in `calibration.md`.

### 3.13 Formulaic sayings

```txt
Watch: X is the Y of Z, X becomes a trap, the language of, the currency of, the architecture
       of, X is not a tool but a mirror
Before: Symmetry is the language of trust.
After:  Symmetric layouts feel more predictable to most users.
```

### 3.14 Fake candor

```txt
Watch: Honestly?, Look,, Here's the thing, The thing is, Let's be honest, Real talk, I'll be
       blunt, Can we talk about
Why:   a staged pause before an ordinary point. The casual register does not redeem it.
Note:  "honestly" and "look" mid-sentence are ordinary. The tell is the standalone opener.
```

### 3.15 Pretend depth

```txt
Watch: the real question is, at its core, in reality, what really matters, fundamentally,
       the deeper issue, the heart of the matter, the uncomfortable truth is
Fix:   drop the frame and make the claim
```

---

## 4. Word tells

High-frequency model vocabulary. Treat as a lookup, not a ban list. These lists are dated
detectors and drift with model generations; `delve` is the cautionary example, common in 2024
output and much rarer by late 2025.

```txt
Nouns:      landscape (abstract), realm, tapestry, testament, interplay, intricacies,
            cornerstone, framework (as filler), journey, ecosystem (outside biology),
            insights (as filler), nuance
Verbs:      delve, leverage, foster, bolster, garner, showcase, underscore, highlight,
            emphasize, encompass, utilize, facilitate, navigate (figurative), unpack,
            resonate, elevate, streamline
Adjectives: pivotal, crucial, vital, intricate, meticulous, multifaceted, seamless,
            transformative, groundbreaking, vibrant, rich (figurative), robust (outside
            engineering), profound, comprehensive, invaluable, renowned, breathtaking
Adverbs:    additionally, ultimately, essentially, crucially, notably, importantly,
            fundamentally, inherently, inevitably, seamlessly, significantly
Openers:    In today's rapidly evolving landscape, In the realm of, When it comes to,
            At its core, It's worth noting that, It is important to note that, In a world
            where, At the end of the day, The reality is
Closers:    In conclusion, Overall, Ultimately, In essence, All in all, Taken together
Jargon:     navigate challenges, unpack the analysis, lean into, deep dive, double down,
            circle back, take a step back, moving forward, on the same page, game-changer
```

**Filler compression, always correct:**

```txt
in order to achieve this goal → to achieve this
due to the fact that         → because
at this point in time        → now
in the event that            → if
has the ability to           → can
it is important to note that → (delete)
```

**Hyphenation.** Models hyphenate compound modifiers everywhere. Keep the hyphen before a
noun ("a high-quality report"), drop it after ("the report is high quality").

---

## 5. Format tells

```txt
Bold sprinkled through prose without a reason
Vertical lists where every item is **Label:** followed by a sentence
Title Case In Headings, where the publication uses sentence case
Emoji as structural decoration on headings and bullets
Curly quotes where the target format uses straight ones
A heading followed by a one-line paragraph that restates the heading
Tables and bullets standing in for an argument that was never made
```

The bold-label list is worth calling out. It is the single most recognizable model formatting
habit, and it usually hides the fact that the three items have no relation to each other.
Convert to prose and the emptiness becomes visible.

```txt
Before: - **User Experience:** The user experience has been significantly improved.
        - **Performance:** Performance has been enhanced through optimized algorithms.
        - **Security:** Security has been strengthened with end-to-end encryption.
After:  The update redraws the settings screen, cuts cold-start time by using a warm cache,
        and adds end-to-end encryption for message bodies.
```

---

## 6. Artifact tells

```txt
Chatbot residue:  I hope this helps, Certainly!, Of course!, Great question, You're
                  absolutely right, Would you like me to, Let me know if
Prompt echo:      restating the instruction as the first paragraph
Cutoff hedges:    as of my last update, based on available information, while specific
                  details are limited
Speculative fill: likely grew up, it is believed that, appears to have been established
                  sometime in the 1990s, maintains a low profile
Sycophancy:       agreeing with or praising the reader before answering
Version talk:     describing what the previous implementation did, in docs that should
                  describe current behavior
```

When a source is silent, say the source is silent. Do not fill the gap with a plausible guess.

---

## 7. What not to flag

None of the following is evidence on its own. Flag a passage when several tells cluster, not
when one word appears.

```txt
Perfect grammar and consistent style. Professionals and edited writers exist.
Formal or academic vocabulary in general. Only the listed overused words count.
One "however", one "moreover", one em dash, one short emphatic sentence.
Curly quotes. Most editors and CMSes insert them automatically.
Em dashes at a steady rate in a writer whose own sample uses them.
Adverbs that carry meaning. "He answered immediately" is not slop.
Passive voice where the object is the topic or the actor is genuinely unknown.
A Wh- opener that is the clearest available construction.
Deliberate repetition of an opening for rhythm or pressure.
Real limits, disclaimers, scope statements, safety notices, corrections, and FAQ answers.
Real alternatives considered in a design doc, tutorial, or argument.
Unsourced claims. Most writing is unsourced.
Clean, complex formatting. Templates and visual editors produce that without any model.
Any watched phrase inside a quotation, title, proper name, or example under discussion.
Anything written before 30 November 2022.
```

**Human details to protect.** These carry the voice and should survive the edit:

```txt
Unusual, checkable, slightly excessive detail: "the lawyer who used to work upstairs from
  my dentist"
Mixed feelings and unresolved tension: "I think this is mostly good and it still bothers me
  and I can't fully say why"
Dated, era-bound references, slang, and in-jokes that belong to a specific year
Genuine asides, parentheticals, and self-corrections: "(I keep wanting to say almost here,
  but it really was certain)"
Real variance in sentence length
A word the author repeats because it is their word
A position stated without balance
Contractions. "It's" and "won't" and "can't" are how people talk. Prose that refuses them
  reads stiff, and expanding them to sound formal is an edit in the wrong direction.
A sentence opening on "But", "And", or "So". All three are ordinary, and "But" is the
  strongest word available at the head of a sentence.
```
