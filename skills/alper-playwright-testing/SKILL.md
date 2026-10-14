---
name: alper-playwright-testing
description: DEPRECATED - Superseded by alper-browser-qa. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-browser-qa
capabilityFamily: QA_TESTING
userFacing: false
mcpTools: []
relatedSkills:
  - alper-browser-qa
---

# alper-playwright-testing (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-playwright-testing` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-browser-qa`** instead.

## Rationalization & Remediation Context
Merged into alper-browser-qa which serves as the canonical Playwright testing orchestrator.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-browser-qa`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
