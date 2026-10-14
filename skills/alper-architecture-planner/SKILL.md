---
name: alper-architecture-planner
description: DEPRECATED - Superseded by alper-architecture. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-architecture
capabilityFamily: ARCHITECTURE
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools: []
relatedSkills:
  - alper-architecture
---

# alper-architecture-planner (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-architecture-planner` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-architecture`** instead.

## Rationalization & Remediation Context
Merged into alper-architecture to eliminate duplicate architecture planning workflows.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-architecture`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
