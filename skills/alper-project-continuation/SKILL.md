---
name: alper-project-continuation
description: Enables truthful project onboarding and continuity for new agent sessions by reading durable intelligence, repository completeness, active risks, and verification debt.
---

# Alper Project Continuation Skill

Enables any new AI coding session or agent to understand the project's verified historical context, current architecture completeness, active constraints, and unverified areas without relying on fabricated defaults or unverified inferences.

## Core Responsibilities

1. **Truthful Session Briefing**:
   - Synthesizes executive briefing from durable `.alper-design-os/project-intelligence/` artifacts: Project Identity, Architecture Completeness (`COMPLETE | PARTIAL | EMPTY`), Active Constraints, Open Risks, and Recent Decisions.
   - Explicitly surfaces `NOT_INITIALIZED` or `INSUFFICIENT_DATA` states instead of assuming default routes, tables, or health scores.
2. **Provenance-Aware Context Selection**:
   - Distinguishes `VERIFIED` user-confirmed business rules and ADRs from `UNVERIFIED` or `PROPOSED` system inferences so inferred rules are never treated as unbreakable user mandates.
3. **Verification Debt & Unknown Areas Visibility**:
   - Surfaces `unknownAreas` from the architecture graph and `NOT_VERIFIED` snapshot fingerprints so missing verification evidence is visible across turns.
4. **Living Document Sync & Conflict Check**:
   - Runs `detect_knowledge_conflicts` to compare living documents (`PROJECT.md`, `DECISIONS.md`, `INVARIANTS.md`) and ADRs against actual repository facts.

## Associated MCP Tools
- `load_project_intelligence`: Retrieves project summary, decisions, business rules, and snapshots.
- `build_task_context`: Extracts scoped, provenance-tagged context for specific user tasks.
- `detect_knowledge_conflicts`: Flags drift between living docs, ADRs, and repository code facts.
- `evaluate_project_knowledge_health`: Reports truthful knowledge coverage and readiness.
