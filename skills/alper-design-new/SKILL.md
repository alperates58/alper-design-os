---
name: alper-design-new
description: DEPRECATED - Superseded by alper-greenfield-generator. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-greenfield-generator
capabilityFamily: GREENFIELD_ENGINEERING
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
mcpTools: []
relatedSkills:
  - alper-greenfield-generator
---

# alper-design-new (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-design-new` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-greenfield-generator`** instead.

## Rationalization & Remediation Context
Phase 0 legacy workflow superseded by Phase 1G greenfield-generator and requirements-engineering.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-greenfield-generator`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
