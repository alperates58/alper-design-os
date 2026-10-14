---
name: alper-decision-management
description: Manages Architecture Decision Records (ADR), superseding lifecycles, rejected alternatives, and maintains clear separation between human decisions and AI recommendations.
---

# Alper Decision Management Skill

Enforces first-class decision record (ADR) lifecycle management. Preserves architectural rationale, prevents silent decision overwriting, records rejected alternatives with reconsideration triggers, and strictly separates user decisions from AI recommendations.

## Core Responsibilities

1. **ADR Lifecycle Governance**:
   - Manages statuses: `PROPOSED`, `ACCEPTED`, `REJECTED`, `SUPERSEDED`, `DEPRECATED`.
   - Never overwrites historical decisions: superseding creates explicit `supersedes` and `supersededBy` bi-directional pointers.
2. **Authority & Attribution**:
   - Strictly distinguishes `USER_DECISION`, `SYSTEM_RECOMMENDATION`, `RESEARCH_FINDING`, and `IMPLEMENTATION_FACT`.
   - AI recommendations cannot masquerade as user decisions.
3. **Rejected Alternatives Tracking**:
   - Documents discarded options (`RejectedAlternative`) along with empirical reasons and conditions under which the option may be reconsidered.
4. **Living Documentation Projection**:
   - Generates and synchronizes `DECISIONS.md` from structured records.

## Associated MCP Tools
- `record_project_decision`: Creates or supersedes ADRs with secret redaction and attribution.
- `detect_knowledge_conflicts`: Detects divergence between accepted ADRs and actual codebase facts.
