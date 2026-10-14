---
name: alper-ai-coding-safety
description: DEPRECATED - Superseded by alper-secure-coding. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-secure-coding
capabilityFamily: SECURITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
mcpTools: []
relatedSkills:
  - alper-secure-coding
---

# alper-ai-coding-safety (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-ai-coding-safety` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-secure-coding`** instead.

## Rationalization & Remediation Context
Merged into alper-secure-coding and AGENTS.md durable rules to eliminate fragmented AI safety advice.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-secure-coding`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
