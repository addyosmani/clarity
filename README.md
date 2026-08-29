# Clarity

Clear writing is a matter of understanding what your reader needs, and giving it to them in a way that they can understand.

`clarity` is also an Agent Skill that applies the rules below when you draft, rewrite, or review prose with a coding agent. To install it:

```bash
npx skills add addyosmani/clarity
```

Then pick a mode:

```txt
/clarity rewrite draft.md     it edits a draft you already have
/clarity review draft.md      it critiques and leaves your file alone
/clarity interview <topic>    it interviews you, then co-writes from what you said
```

[Full walkthrough below.](#three-ways-to-use-it) [`samples/`](samples/) has two essays before and after a pass, plus one built from an interview with its transcript.

The site has a fuller explanation of the [approach, worked example, and evaluation protocol](https://clarity.addy.ie/approach/).
It also has step-by-step [tutorials for review, rewrite, and interview mode](https://clarity.addy.ie/tutorials/)
in Claude Code and Codex.

Prefer working in the browser? The [Clarity Writing Editor](https://clarity.addy.ie/app/)
reviews AI writing tells, readability, and the broader Clarity questions without uploading your draft.

## On writing that earns its reader

A reader gives you their attention one sentence at a time. They take it back the moment a
sentence stops paying.

Structure, grammar, word choice, and rhythm all serve it.

Most advice about writing is advice about how to stop wasting that attention. Cut the adverb.
Use the short word. Name the actor. All of it is right, and all of it starts one step too late.
The fastest way to waste a reader's attention is to write something correct that they did not
need.

So the first work is not on the page. It is deciding who you are writing for, what they already
carry, and what they should be holding when they finish.

> Good writing is useful, clear, and yours.

What follows is what I have found to hold, and where I think the usual advice needs adjusting.

---

## Useful

### 1. Write for one person you can picture

A piece written by you, to a specific audience: a specific set of people, at a specific point in their lives, in a specific set of roles. It might be the engineer who's been writing software for three years and now wonders if they're keeping up well enough with AI. It might be you, back when you thought that you'd never write well enough for others to take your words seriously.

This is not hypothetical: you are, right now, writing. So consider that you are making some decisions. What's the best way to explain this stuff? What words should I use? Where should I start? Does this joke land? All these decisions become softer when you write to everyone. You know that you'll be helping someone at one end of the bell curve who needs clarity while frustrating someone at the other end who knows all that stuff already and is missing something subtler. But writing with deliberate direction helps you, and it helps your reader, see which part you need to land on.

> Your whole duty as a writer is to please and satisfy yourself, and the true writer always
> plays to an audience of one.
>
> — Strunk & White, *The Elements of Style*

### 2. Know what they bring, and what they need from you

Underlying both decisions and clarity is this: the reader has something in their head as they sit down to read. Some of it's correct, some of it's stale and outdated and needs replacing, and some of it's a misconception that you're writing to correct.

Throughout a single piece of writing you'll face two different questions: What context does the reader already have? and, crucially, What context does the reader need? The gap between those two answers defines the piece. That is to say, this is the main point where writers of technical material fail in their first draft: they go straight from the question they want to answer to the answer that they want to give, completely bypassing the reader-side question of what the reader actually knows already.

### 3. Decide what they take away

Your piece must center around a single thing. That thing should be stated in a sentence, ideally somewhere close to the beginning. (No, even now, you feel an internal twitch that says "I should start with the bigger picture before getting down to specifics," but just stick with it.) It should be stated in a way that someone could reasonably argue with.

That is to say, the difference is between subject and claim. A subject lets you talk about the subject as fully as you can, but risks slowly drifting away from your topic. A claim invites you to argue; it demands that you persuade.

> Every successful piece of nonfiction should leave the reader with one provocative thought
> that he or she didn't have before. Not two thoughts, or five, just one.
>
> — William Zinsser, *On Writing Well*

### 4. Say something only you could say

Doesn't this apply to everyone? A check you can do on each paragraph is: could this paragraph (nearly) word for word appear in someone else's article on the same subject? If something passes this test, then it's filler, even if it's well made.

What tends to survive the test is your stuff: specific observed details, measured numbers, incidents of which you were a party, lived arguments, changed beliefs.

This is the stuff that can't be borrowed. If your piece isn't full of it, then it's sourceless. It's why writing exists at all. A draft that lacks it has a sourcing problem, not a prose problem.

### 5. Make every sentence pay

Now, try this: each sentence should leave the reader with more than the prior one. Don't repeat the same point in different words. Don't throat-clear.

Most padding is caused not by not having enough to say, but by choosing to make a piece longer than is needed to make your point. The other source is writing that follows someone else's form expectations, such as writing an introduction that introduces nothing and writing a conclusion that concludes nothing.

So cut both causes of padding and move that beautiful, short piece in front of your reader. A short piece that lands beats a long piece that covers.

---

## Clear

### 6. Be specific enough to be wrong

Vague writing can't be verified, so it can't be trusted.

Try to be as specific as you can. Take a sentence like "a dependency that made us vulnerable." It has the grammar of a specific and the content of an abstraction, and it tells the reader nothing that "supply chain risk is real" did not already tell them. The obvious course of action is to name the package, to name the month, and to say how you caught it. When a writer fails to do so, they have written the abstraction with more words.

> Prefer the specific to the general, the definite to the vague, the concrete to the abstract.
>
> — Strunk & White, *The Elements of Style*

If you can't think of a verifiable example, then delete it rather than blurring it. If you can't think of a sensible example, then don't invent one, because when you fabricate a detail, you destroy any residual trust.

### 7. Put someone in the sentence

Give people agency. Decisions, cultures, and data don't act; people do.

Sentences like "bad things tend to happen in March" have no human actor. Find a more concrete subject. Try: "Most people find March a difficult month for things to go according to plan." Now you can see who is doing the action.

Use the second-person "you" when no specific person fits. It makes you engage the reader directly.

### 8. Use the plain word, and break the long sentence

Prefer shorter words and sentences rather than longer ones. Short words and single-idea sentences read more easily than long words and sentences that express more than one idea.

A simple style is the result of thorough thinking. Ornate prose often indicates that the writer still doesn't have a clear picture of what they are trying to say.

> Simple writing is persuasive. A good argument in five sentences will sway more people than a
> brilliant argument in a hundred sentences.
>
> — Scott Adams

### 9. Cut what does no work, then stop

When editing, flag every passage that you suspect might be superfluous. Then consider whether the piece still works without it. If it does, remove it.

Over-stripping qualifiers yields inhuman prose. True writing contains a certain amount of hedging to reflect the writer's own uncertainty.

Strip qualifiers that hide a claim. Keep those that honestly represent genuine uncertainty.

### 10. Say the relation instead of implying it

Putting two sentences next to each other can create a sense of logical connection between them based only on rhythm. "The benchmark is saturated. The model still fails in production." Is the second sentence the cause of the first, or the consequence? The rhythm implies an answer, and while you are reading it feels like reasoning.

Try to supply the word: *because*, *although*, *once*, *where*, *so that*. If you cannot supply it without inventing the relation, then the relation was never there.

*Although the benchmark is saturated, the model still fails in production, which means the benchmark has stopped measuring what ships.* Adding an explicit connector, such as *although*, as we did here, turns a mere juxtaposition into a real claim.

---

## Yours

### 11. Take a position, and say where it is weak

Presenting both sides without taking a position isn't balanced. It feels empty, and readers know you are evading.

State your leaning and say what makes you uneasy. Give the strongest real objection its own paragraph near the end. Answer or concede it. Conceding costs you nothing and gains you respect.

The objection has to be one that someone actually holds. Fabricating a weak opponent is as dishonest as inventing a statistic, and readers detect it quickly.

### 12. Write the way you would say it

Read a sentence aloud. If you would not say it to a colleague over lunch, you should not publish it.

This is why contractions, sentence-initial "but," and the first person are appropriate: writing is a transaction between two people, and hiding one of those people discards half the power.

> Never say anything in writing that you wouldn't comfortably say in conversation.
>
> — William Zinsser, *On Writing Well*

### 13. Do not perform

Avoid fake erudition or humility, or a voice that sounds rough or as if it were studied.

---

## Making it

### 14. Give the first sentence its one job

Make the reader want to hear the second sentence of the piece.

Effective openings are often a startling fact, a scene-setting description, a number, a provocative claim, or a leading question. A definition of the topic or an explanation of your intent will not work.

### 15. Make each paragraph earn the next

Each paragraph should answer the question the previous one raised or raise the question the next one will answer.

Test your progress by covering the page and seeing if you can predict what will follow. If your headings are doing all the work of organizing your ideas, your writing is merely a list of items that might be arranged in a table of contents.

### 16. Stop where the thought stops

When the point is made, stop.

Bad endings usually result from the writer's summarizing a litany of traps, pitfalls, and opportunities or from his or her offering the quotable line. A good ending often returns to a concrete item or circumstance from the story, states what will carry over, and stops. You may feel that it is abrupt and unfinished, but that is better than vague optimism.

### 17. Rewrite by cutting and reordering

Rewriting always means that you have moved the third paragraph to the top, deleted the proudest section of the first version, and found the true sentence buried inside the one you wrote.

Smoothing is not rewriting. Smoothing turns a rough authentic sentence into a bland one and polishes away the only interesting thing in your draft.

> Rewriting is the essence of writing well: it's where the game is won or lost.
>
> — William Zinsser, *On Writing Well*

### 18. Read it aloud

Reread every time before sending.

Your ear catches what a checklist misses: plodding paragraphs, breathless clauses, repetitive sentence shapes; where reading stumbles, the sentence is wrong.

---

## The skill in this repository

The skill asks substance questions before stylistic edits, treats the author's supplied
language as source material, adjudicates patterns in context instead of applying blanket bans,
and refuses to invent specifics.

```txt
SKILL.md                     the operating manual
commands/                    optional /clarity-interview, -rewrite, -review wrappers
references/interview.md      questions that get an author's own material onto the page
references/edit.md           editing diagnoses and fidelity safeguards
references/longform.md       positive craft for essays, articles, talks, and narrative
references/medium.md         exceptions for docs, academic, messages, UI, and other media
references/review.md         review format and verdicts
evals/cases.json             shared behavioral cases and preservation requirements
evals/JUDGE.md               blinded comparison protocol
scripts/prose_stats.py       diagnostic linter, with no composite score by design
scripts/strip_markdown.py    reduces a markdown draft to the prose a reader reads
scripts/validate_package.py  package, routing, sample, and eval validation
site/                        clarity.addy.ie, including the browser editor at /app/
```

### Three ways to use it

Once the skill is installed, `/clarity` takes the mode as its first word. Nothing else to set up.

```txt
/clarity interview why our incident reviews stopped working
/clarity rewrite draft.md
/clarity review draft.md
```

`interview` co-writes from nothing, `rewrite` edits a draft you already have, and `review`
gives you a critique and leaves your file alone. Drop the mode word and it will work out which
one you meant from what you gave it.

If you prefer the dedicated form, copy the wrappers in `commands/` and you get
`/clarity-interview`, `/clarity-rewrite` and `/clarity-review`:

```bash
cp commands/*.md ~/.claude/commands/
```

### What each mode does

**`/clarity review draft.md`** leads with the piece-level verdict, then goes line by line,
marking each one `keep`, `revise`, `ask-author`, or `cut`. The `ask-author` verdict is the
useful one: the line is fixable, but the fix needs a fact only you have, so it asks instead of
inventing.

**`/clarity rewrite draft.md`** diagnoses missing substance, wrong register, weak development,
and surface patterning in that order. Give it a sample of your own writing whenever you can. A
sample outranks every default in the skill, down to punctuation and degree of formality, but it
is never a source of facts for the new piece. See `samples/` for two fact-preserving
before-and-after pairs, plus an interview-built draft and its transcript.

**`/clarity interview <topic>`** is the part people miss, and it is where most of the value is.
On an empty page the skill asks you questions, and does not start writing.

It wants you to talk, in one take, without tidying, because it is after your sentences and not
your summary. The questions run roughly:

```txt
What happened this week that made you want to write this? The trigger, not the topic.
Who are you arguing with, and what are they getting wrong?
Picture one reader. What do they already know, and what should change for them on Monday?
Say the argument out loud, the way you'd say it to a colleague at lunch.
Two or three real examples from your own work, with the real numbers and names.
What would you concede under questioning?
What do you believe here that most people in your field don't?
```

Then it builds the piece around what you said. It protects distinctive phrases, mixed feelings,
and the order in which you discovered the idea. It may cut, reorder, and lightly edit for
comprehension; larger changes that would erase the thought stay visible for your judgment.
Anywhere it needs a detail only you have, it leaves a marked gap instead of inventing one:

```txt
[TK: how many reviews had you run before you noticed? Rough number is fine.]
```

If a draft already exists but says nothing, `/clarity rewrite` will explain the substance gap
and offer a shorter interview aimed at the hollow paragraphs:

```txt
Section 3 leans on "most teams". Which teams have you actually watched do this?
The example in section 5 could be anyone's. Do you have your own version of it?
The ending restates the thesis. What do you want the reader to do differently on Monday?
```

That last shape of question, *what would you cut from this that everyone else would keep*, tends
to produce more usable material than any other single prompt in the file.

### What that actually buys you

The interview gives the draft a source a model cannot supply on its own: your examples,
language, uncertainty, and editorial judgment. It does not guarantee a detector result, and a
detector result would not prove authorship or quality.

The sample directory includes the transcript beside the interview-built draft so the provenance
claim is inspectable. It also labels two model rewrites as such. The details are in
[`samples/README.md`](samples/README.md).

The skill's behavioral claims can be tested separately from its prose examples.
`evals/cases.json` defines factual-preservation, mode-boundary, medium-fit, false-positive, and
authorship cases. `evals/JUDGE.md` defines a blinded comparison against a baseline or competing
skill. Results should be published with model versions, prompts, outputs, judge identities, and
failures; the repository does not claim a benchmark win before those results exist.

### Linting

```bash
python3 scripts/strip_markdown.py draft.md | python3 scripts/prose_stats.py -
```

The output localizes habits and refuses to produce a score. Read it as a map of where to look.

---

## Further reading

**Books.** *On Writing Well* by William Zinsser, which is the one to read if you read one.
*The Elements of Style* by Strunk & White. *Several Short Sentences About Writing* by Verlyn
Klinkenborg, for the argument that the sentence is the unit of composition and everything else
follows from it.

**Essays and books**

- [On Writing Well](https://www.amazon.com/Writing-Well-Classic-Guide-Nonfiction/dp/0060891548),
  William Zinsser, the classic guide to writing well.
- [The Sense of Style](https://www.amazon.com/Sense-Style-Thinking-Writing-English/dp/0143127799),
  Steven Pinker, on how the brain reads and how that affects writing.
- [The Elements of Style](https://www.amazon.com/Elements-Style-William-Strunk-Jr/dp/020530902X),
  Strunk & White, the classic guide to writing well.
- [Principles of Writing Well](https://jlzych.com/writing/), Jeff Zych. A distillation of
  Zinsser and Strunk, and the cleanest single page on this subject I know.
- [Politics and the English Language](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/),
  George Orwell, on how vague writing and dishonest thinking feed each other.
- [The Day You Became a Better Writer](https://dilbertblog.typepad.com/the_dilbert_blog/2007/06/the_day_you_bec.html),
  Scott Adams. Six paragraphs, and the one about subject-verb-object earns the visit on its own.
- [Write Like You Talk](https://www.paulgraham.com/talk.html) and
  [Writing, Briefly](https://www.paulgraham.com/writing44.html), Paul Graham.
- [The Art of Omission](https://www.newyorker.com/magazine/2015/09/14/omission), John McPhee, on
  what leaving things out does to what stays.
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing),
  maintained by WikiProject AI Cleanup, built from thousands of real cleanups.

**Related projects.** 

[hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop),
[blader/humanizer](https://github.com/blader/humanizer), and
[adewale/anti-slop-writing](https://github.com/adewale/anti-slop-writing) are also worth looking at.

MIT.
