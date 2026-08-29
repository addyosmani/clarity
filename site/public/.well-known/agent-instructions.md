# Clarity agent instructions

## When to use Clarity

Use Clarity when a user asks an agent to:

- interview them before drafting so the result contains their own experience, examples, and position;
- rewrite an existing article, post, talk, documentation page, message, or other prose without inventing evidence;
- review writing for usefulness, clarity, source fidelity, development, endings, and voice;
- identify common AI-writing patterns while treating them as editing prompts rather than proof of authorship.

Do not use Clarity as a fact checker, plagiarism checker, authorship detector, or substitute for missing source material.

## Install and invoke

```text
npx skills add addyosmani/clarity
Claude Code: /clarity interview <topic>
Claude Code: /clarity rewrite <file>
Claude Code: /clarity review <file>
Codex: $clarity Interview me about <topic>
Codex: $clarity Rewrite <file>
Codex: $clarity Review <file>
```

Read the installed `SKILL.md` before acting. Preserve the source's claims, uncertainty, examples, and meaning. Never fabricate a detail to make prose appear more human.

## Resources

- Agent index: https://clarity.addy.ie/llms.txt
- Full documentation: https://clarity.addy.ie/llms-full.txt
- Approach, example, and evals: https://clarity.addy.ie/approach/
- Tutorials: https://clarity.addy.ie/tutorials/
- Developer resources: https://clarity.addy.ie/developers/
- Source: https://github.com/addyosmani/clarity
