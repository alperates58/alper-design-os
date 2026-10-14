---
name: alper-architecture-audit
description: DEPRECATED - Superseded by alper-architecture. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-architecture
capabilityFamily: ARCHITECTURE
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools: []
relatedSkills:
  - alper-architecture
---

# alper-architecture-audit (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-architecture-audit` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-architecture`** instead.

## Rationalization & Remediation Context
Merged into alper-architecture which provides comprehensive architectural analysis and boundary audits.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-architecture`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
