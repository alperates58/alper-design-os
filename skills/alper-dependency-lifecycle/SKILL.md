---
name: alper-dependency-lifecycle
description: DEPRECATED - Superseded by alper-supply-chain-security. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-supply-chain-security
capabilityFamily: SECURITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - CONTINUOUS_GOVERNANCE
  - MODERNIZATION
mcpTools: []
relatedSkills:
  - alper-supply-chain-security
---

# alper-dependency-lifecycle (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-dependency-lifecycle` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-supply-chain-security`** instead.

## Rationalization & Remediation Context
Merged into alper-supply-chain-security to unify SemVer upgrade policies and SBOM tracking.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-supply-chain-security`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
