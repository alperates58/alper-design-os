---
name: alper-regression-guard
description: DEPRECATED - Superseded by alper-behavior-preservation. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-behavior-preservation
capabilityFamily: MODERNIZATION
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
mcpTools: []
relatedSkills:
  - alper-behavior-preservation
---

# alper-regression-guard (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-regression-guard` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-behavior-preservation`** instead.

## Rationalization & Remediation Context
Merged into alper-behavior-preservation which provides the canonical behavioral baseline contract.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-behavior-preservation`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
