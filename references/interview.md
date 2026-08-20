# The perspective interview

The purpose of this protocol is to get material into the piece that the model could not have
produced. Not context about the author, which is worthless as input. Their actual sentences.

The measured basis for that distinction: in a controlled pair on the same true story, feeding
the model the author's real situation, motivation, audience, and analytical framework, and
letting the model word it, produced text indistinguishable from fully invented content. The
same story in the author's own dictated words, cut and reordered but never smoothed, read as
the author's throughout. Same facts, same argument, same person, opposite result.

```txt
The unit of transfer is the sentence, not the fact.
```

So the interview is not a briefing. You are collecting raw language.

---

## Which interview to run

| Situation | Run |
|---|---|
| Nothing written yet | **The full interview.** Before any drafting. |
| Draft exists, fails Gate 0 | **The extraction interview.** Targeted at the hollow parts. |
| Draft exists and is good | **The gap interview.** Three or four questions, at most. |

---

## The full interview

Send this to the author close to verbatim. Adapt the bracketed parts to the topic.

> **Before I write anything, talk to me for three to five minutes. Dictate it if you can, or
> stream-type it. One take. Don't fix your grammar, don't restart sentences, don't organize
> it. The repetitions and the half-finished thoughts are the most useful thing you will give
> me, and if you tidy them I lose them.**
>
> **Cover whatever subset of this you actually have:**
>
> 1. **What happened?** What made you want to write this *this week*. The conversation, the
>    thing you read, the bug, the meeting, the moment. The trigger, not the topic.
> 2. **Who are you arguing with?** Who have you been talking to about this lately, and what
>    are they getting wrong, or worried about, or repeating that annoys you?
> 3. **Picture one reader.** Name someone specific you want to reach, not a category. What do
>    they already know about this, what are they wrong about, and what should be different
>    for them on Monday?
> 4. **Say the argument out loud.** Explain it the way you would to a colleague at lunch, in
>    the words you actually use when you talk about it, including the framework or the phrase
>    you always reach for.
> 5. **Two or three real examples from your own work.** With the real names, numbers, dates,
>    and outcomes. [The repo, the incident, the customer, the migration.] If a detail is one
>    you would not publish, skip the whole example rather than blurring it.
> 6. **What would you concede under questioning?** Where you are unsure, the counterargument
>    you take seriously, the thing you have changed your mind about.
> 7. **What do you believe here that most people in your field don't?** Even if you can only
>    half-defend it.
>
> **Don't summarize. Don't polish. Ramble.**

Also collect, and this is worth as much as the dictation:

```txt
Prior writing on the topic: old posts, internal docs, talk notes, a thread, a list they
already made, a definition they coined. These slot in verbatim, count fully as their words,
and can be linked out to.
```

### If the answer is thin

One follow-up, not five. The probes that reliably produce the most usable material, in rough
order of yield:

```txt
"Tell me about the last time this actually bit you. What broke, and what did you do about it?"
"What's the thing you say about this in meetings that you've never written down?"
"Who disagrees with you on this, and what's their best argument?"
"What did you think about this two years ago that you no longer think?"
"What's the number? Even roughly."
"What's the part of this that you find genuinely annoying?"
```

Then work with what you have, and tell the author plainly what a smaller share means: the
piece will read more like a model wrote it, because more of it will have been.

---

## The extraction interview

For a draft that is fluent and empty. Do not ask the author to review the whole thing. Find
the three or four paragraphs carrying the argument, and ask about those specifically.

For each hollow paragraph, ask one of:

```txt
"This paragraph says [claim]. What's your evidence, and how sure are you?"
"You've written 'teams often struggle with X'. Which team, and what happened?"
"This is the consensus position. What's yours?"
"Is there a version of this where you're wrong? What would that look like?"
"What would you cut from this piece that everyone else would keep?"
```

That last one is the most efficient question in this file. It surfaces a real editorial
opinion in a single answer, and an editorial opinion is a point of view.

---

## The gap interview

For a good draft with two or three soft spots. Batch the questions and make each one
answerable in a sentence:

```txt
Section 3 leans on "most teams". How many teams have you seen do this, and where?
The example in section 5 could be anyone's. Do you have your own version of it?
The ending currently restates the thesis. What do you actually want the reader to do
  differently on Monday?
```

---

## Turning answers into prose

1. **The dictation is the spine, verbatim.** Edit by cutting and reordering. Remove direct
   address to you and true repetition. Keep the conversational grammar, the false start that
   went somewhere, the aside in parentheses, the word they invented, the slightly wrong
   preposition. Those are the parts that make it theirs.
2. **Do not smooth.** Smoothing an author's sentence into an even one is the exact operation
   that erases its provenance. When a sentence reads as a person thinking, keep it even if a
   style rule says trim it.
3. **Quote their prior writing verbatim** wherever it fits, and link to the source.
4. **Your contribution goes in delimited blocks**, and stays a minority of the words. Research,
   citations, definitions, comparisons, the compressed version of a paper. Label the section
   so a reader can tell which part is which.
5. **Never write their memory for them.** If the interview did not produce a detail the
   paragraph needs, leave `[TK: ...]` naming exactly what to ask.

---

## What the interview is not for

Do not use the answers as *steering* while you generate. That is the failure case measured
above: absorbing the author's situation and re-expressing it in model words produces the same
output as inventing it. The answers are source text. Paste them in and cut, do not read them
and write.

And do not simulate this process. A staged pipeline where the model writes a deliberately
messy draft and then revises it toward "human" scores worse than a clean draft and reads as
performance. Every stage of a simulated process samples from the same generator. Nothing from
outside the model ever enters the text unless a person puts it there.
