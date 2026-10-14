---
name: alper-safe-refactor
description: DEPRECATED - Superseded by alper-refactoring-strategy. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-refactoring-strategy
capabilityFamily: MODERNIZATION
userFacing: false
mcpTools: []
relatedSkills:
  - alper-refactoring-strategy
---

# alper-safe-refactor (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-safe-refactor` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-refactoring-strategy`** instead.

## Rationalization & Remediation Context
Merged into alper-refactoring-strategy to eliminate split-brain refactoring guidance.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-refactoring-strategy`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
