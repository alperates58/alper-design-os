---
name: alper-database-engineering
description: DEPRECATED - Superseded by alper-database-designer. Do not use for new tasks.
status: DEPRECATED
deprecated: true
replacement: alper-database-designer
capabilityFamily: DATA_ENGINEERING
userFacing: false
mcpTools: []
relatedSkills:
  - alper-database-designer
---

# alper-database-engineering (DEPRECATED)

> [!WARNING]
> **This skill is permanently deprecated and has been superseded.**
> Do not use `alper-database-engineering` in new agent prompts, workflows, or context routing.

## Superseded By
Use **`alper-database-designer`** instead.

## Rationalization & Remediation Context
Merged into alper-database-designer to consolidate schema and relational database modeling.

## Migration Instruction
- Redirect all routing decisions, prompt triggers, and execution flows to **`alper-database-designer`**.
- This skill exists purely for historical tracking and is excluded from active context routing in `packages/agent-governance/src/context-router.ts`.
