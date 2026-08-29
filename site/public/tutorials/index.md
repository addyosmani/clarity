# Clarity tutorials

Three practical ways to use the Clarity Agent Skill with an existing draft in Claude Code or Codex. Each workflow keeps a different decision with the author.

## Install the skill

Run this once in a terminal:

```bash
npx skills add addyosmani/clarity
```

Open Claude Code or Codex in the directory that contains your draft. The examples use `/clarity` in Claude Code and `$clarity` in Codex. If a shortcut is unavailable, ask the agent in plain language to use the Clarity skill in the named mode.

The tutorials use a file named `incident-reviews.md`:

```md
# Why incident reviews matter

Incident reviews play a crucial role in modern engineering teams.
They provide valuable insights and help organisations learn from failure.
By fostering a culture of continuous improvement, teams can leverage
these reviews to build more resilient systems.

Ultimately, incident reviews are not just about looking back. They are
about creating a stronger and more collaborative future.
```

## 1. Review an existing draft

Use review mode when you want a diagnosis before deciding what should change. It does not modify the file.

Claude Code:

```txt
/clarity review incident-reviews.md
```

Codex:

```txt
$clarity Review incident-reviews.md. Do not modify the file.
```

Clarity identifies the job of the piece and its largest material problem before reporting passage-level findings. A typical finding is shaped like this:

```txt
Passage:      "Incident reviews play a crucial role..."
Verdict:      ask-author
Pattern:      Importance without mechanism
Suggestion:   Which review changed a decision, owner, or system?
Safety check: Needs author evidence. Do not invent the incident.
```

`ask-author` marks the edge of the source. Answer with a detail you are comfortable publishing, reject the question, or choose a plain fallback:

```txt
The trigger was three incident reviews in one quarter that all ended
with "improve monitoring." The third review changed when Priya asked
who would be paged if the same cache failed again. Keep this as a
review. Update the findings, but do not edit the file.
```

The author remains in control because review mode is diagnostic. Nothing is applied until the author requests a separate rewrite.

## 2. Rewrite an existing draft

Use rewrite mode when the source contains enough material and you want the agent to edit the named file. Put the draft in version control or make a copy first.

```bash
git status --short
git diff -- incident-reviews.md
```

In Claude Code:

```txt
/clarity rewrite incident-reviews.md

The reader is an engineering manager. Preserve the phrase "the review
became a status meeting," the date, Priya's quoted question, and every
link. If a stronger claim needs information outside the draft, ask me.
```

In Codex, begin the same request with `$clarity Rewrite`.

For a named file, Clarity writes the finished prose to that file and reports a short change note in chat. Inspect the result:

```bash
git diff --word-diff -- incident-reviews.md
```

Check that dates, numbers, quotations, links, attribution, scope, and uncertainty kept the same force. Protect any original line the edit polished flat. If the rewrite leaves an open question, make the next instruction narrow:

```txt
The number was 11 reviews, not 12. Restore "the review became a status
meeting" exactly as written. Apply only those two changes, then stop.
```

One rewrite, one source check, and one small correction pass is usually enough. Repeated polishing can flatten the prose into the agent's default voice.

## 3. Interview the author

Use interview mode when surface editing would produce cleaner emptiness. The existing draft becomes background, and the agent waits for the author's material before drafting.

Claude Code:

```txt
/clarity interview Why our incident reviews stopped working

Use incident-reviews.md as background. Interview me before drafting.
Keep the existing file unchanged.
```

Codex:

```txt
$clarity Interview me about why our incident reviews stopped working.
Read incident-reviews.md as background, but do not rewrite it yet.
```

Talk for three to five minutes, paste a rough transcript, or stream-type one take. Do not organise it first. A useful answer contains the incident, names, numbers, phrases, doubts, and changed beliefs the model cannot supply:

```txt
We ran 11 reviews before I noticed the pattern. The meeting had become
a status update for leadership. Priya interrupted the third cache
incident and asked, "Who gets paged next time?" Nobody could answer.
That was the moment the review became useful again...
```

Clarity may ask up to three questions about unsupported parts of the draft. Skip private details. The skill should leave `[TK: precise question]` rather than inventing an answer.

When the interview contains enough material, ask for a new file:

```txt
Use my answers to draft incident-reviews.interview.md. Keep the original
file. Preserve Priya's question verbatim. Show me any larger rewording
that changes the thought instead of silently applying it.
```

The handoff includes a provenance note:

```txt
Author material: The 11 reviews, the cache incident, Priya's question,
and the distinction between a review and a status meeting.
Model contribution: Organisation and connective prose.
Open items: [TK: what changed in the on-call runbook afterward?]
```

Read the new draft beside the transcript. Keep the phrases that still sound like the moment described. Answer an open item if it matters, or cut the sentence that needs it.

## Choose a mode

- Start with `review` when you want to understand the draft before changing it.
- Use `rewrite` when the source is sound and you are ready to inspect an edit.
- Choose `interview` when the draft lacks your examples, judgment, or language.

Read the [Clarity approach](https://clarity.addy.ie/approach/) for the reasoning behind these boundaries, or return to the [agent index](https://clarity.addy.ie/llms.txt).
