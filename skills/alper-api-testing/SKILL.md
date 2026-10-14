---
name: alper-api-testing
description: DEPRECATED - Superseded by alper-contract-testing. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-contract-testing
capabilityFamily: QA_TESTING
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools: []
relatedSkills:
  - alper-contract-testing
---

# alper-api-testing (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-api-testing` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-contract-testing`** instead.

## Rationalization & Remediation Context
Merged into alper-contract-testing to unify API contract and functional validation.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-contract-testing`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
