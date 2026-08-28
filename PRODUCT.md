# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 5, matching the sibling site skills.addy.ie: sitemap integration, Geist and Geist Mono
via Google Fonts, design tokens in a single global.css, static output. Confirmed by the user.

## Users

Developers and writers who use coding agents to draft or edit prose, and who have noticed that
the output is fluent and says nothing. They arrive from a link, a repo, or the skills.sh
listing, on desktop or phone, wanting two things in this order: to see whether the ideas are
worth their time, and to install the skill in one command.

A second, quieter audience reads the rules without ever installing anything. The eighteen rules
stand on their own as an essay about writing, and the site must work for someone who only wants
that.

## Product Purpose

`clarity` is an Agent Skill that drafts, rewrites, and reviews prose so it carries a point of
view instead of reading like generic model output. The site is its one public page: the essay
and the eighteen rules, with the install command near the top.

Success is a visitor who either runs `npx skills add addyosmani/clarity` or leaves having read
the rules and disagreed with at least one on purpose.

## Positioning

Most anti-slop tooling treats the symptom: em dashes, triads, stock phrases. Clarity's claim is
that the failure is emptiness with good posture, and that the fix is substance before surface.
Three things distinguish the approach:

- The skill interviews the author before drafting and records what came from the author, what
  the model supplied, and what remains unresolved. A sample essay and its source transcript ship
  together so that claim is inspectable.
- It treats common patterns as contextual diagnoses rather than universal defects. Useful
  qualification, concrete lists of three, predictable documentation headings, and passive voice
  can all be right for the job.
- It ships behavioral cases for fact preservation, mode boundaries, medium fit, authorship, and
  false positives, plus a blinded comparison protocol that reports token cost and failures.

## Constraints and facts to preserve

- Install command: `npx skills add addyosmani/clarity`. Modes: `/clarity interview|rewrite|review`.
- Repo: github.com/addyosmani/clarity. Site: clarity.addy.ie. Licence MIT.
- The eighteen rules and the essay are the author's own writing and are quoted verbatim on the
  site. Do not paraphrase, retitle, or reorder them.
- Quotations from Strunk & White, Zinsser, and Scott Adams appear in the rules and must keep
  their attributions.
- Accessibility: the site is mostly long-form reading. Real reading measure, honest contrast,
  and working keyboard focus are requirements, not polish.

## Open decisions

- Deploy target not yet chosen; the sibling site has no committed deploy config either.
- No OG image asset exists yet for clarity.addy.ie.
