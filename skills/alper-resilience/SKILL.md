---
name: alper-resilience
description: DEPRECATED - Superseded by alper-reliability. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-reliability
capabilityFamily: PERFORMANCE_RELIABILITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools: []
relatedSkills:
  - alper-reliability
---

# alper-resilience (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-resilience` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-reliability`** instead.

## Rationalization & Remediation Context
Merged into alper-reliability to unify system resilience, fault tolerance, and SLO governance.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-reliability`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
