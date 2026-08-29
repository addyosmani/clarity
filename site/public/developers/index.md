# Clarity by Addy Osmani: developer resources

Clarity is an open-source Agent Skill and browser writing editor created and maintained by Addy Osmani.

## Install

```text
npx skills add addyosmani/clarity
```

The installed package exposes `SKILL.md`, optional command wrappers, editing and interview references, evaluation cases, and diagnostic scripts. Start with `SKILL.md`; it routes agents to the smallest relevant reference.

## Interfaces

- Agent Skill source: https://github.com/addyosmani/clarity
- Browser editor: https://clarity.addy.ie/app/
- Agent index: https://clarity.addy.ie/llms.txt
- Agent instructions: https://clarity.addy.ie/.well-known/agent-instructions.md
- Behavioural evaluations: https://github.com/addyosmani/clarity/tree/main/evals
- Approach, worked example, and eval details: https://clarity.addy.ie/approach/
- Review, rewrite, and interview tutorials: https://clarity.addy.ie/tutorials/

Clarity does not currently expose an HTTP API, OpenAPI specification, authentication flow, or MCP server. The supported interfaces are the installable Agent Skill and the client-side browser editor.

## Ownership and licence

- Maintainer: Addy Osmani, https://addyosmani.com
- Repository: https://github.com/addyosmani/clarity
- Licence: MIT
