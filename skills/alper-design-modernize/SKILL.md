---
name: alper-design-modernize
description: DEPRECATED - Superseded by alper-modernization-planner. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-modernization-planner
capabilityFamily: MODERNIZATION
userFacing: false
mcpTools: []
relatedSkills:
  - alper-modernization-planner
---

# alper-design-modernize (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-design-modernize` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-modernization-planner`** instead.

## Rationalization & Remediation Context
Phase 0 fixed 4-phase shell rewrite path superseded by Phase 1F Modernization Engine.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-modernization-planner`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
