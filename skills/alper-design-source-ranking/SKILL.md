---
name: alper-design-source-ranking
description: DEPRECATED - Superseded by alper-source-intelligence. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-source-intelligence
capabilityFamily: SOURCE_INTELLIGENCE
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools: []
relatedSkills:
  - alper-source-intelligence
---

# alper-design-source-ranking (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-design-source-ranking` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-source-intelligence`** instead.

## Rationalization & Remediation Context
Merged into alper-source-intelligence which houses the weighted multi-criteria ranking engine.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-source-intelligence`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
