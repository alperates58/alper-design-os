---
name: alper-decision-management
description: Durable ADR lifecycle management and bidirectional superseding with provenance checks. Use when documenting a key architectural decision (e.g. database choice, framework migration, auth strategy). Do not use for diagnosing query execution plans (use alper-sql-performance).
status: ACTIVE
capabilityFamily: PROJECT_INTELLIGENCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - record_project_decision
  - generate_adr
relatedSkills:
  - alper-project-intelligence
  - alper-architecture
  - alper-change-planner
---

# Alper Decision Management Skill

## PURPOSE
Formulates, records, and manages Architecture Decision Records (ADRs) with bidirectional superseding, ensuring architectural choices are never silently rewritten.

## USE WHEN
- Documenting a key architectural decision (e.g. database choice, framework migration, auth strategy).
- Superseding an existing ADR with a new architectural direction.
- Reviewing historical design decisions and rejected alternatives.

## DO NOT USE WHEN
- Diagnosing query execution plans (use alper-sql-performance).
- Scaffolding raw boilerplate files (use alper-greenfield-generator).
- Running accessibility audits (use alper-accessibility-testing).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: REQUIRED**
This skill strictly requires reading durable project memory from `.alper-design-os/project/` (manifest, architecture graph, ADRs, behavioral contracts) before planning or executing actions. Missing memory triggers explicit initialization or drift detection.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Formulate problem context, decision drivers, and considered alternatives.
2. Generate structured ADR following canonical format (Context, Decision, Consequences).
3. If replacing an existing decision, establish bidirectional link (supersedes / superseded_by).
4. Commit ADR markdown to .alper-design-os/project/decisions/.

## DECISION RULES
- Never silently overwrite an existing ADR: Must mark previous decision as SUPERSEDED with clear rationale.
- Record consequences transparently: Both positive benefits and negative trade-offs must be stated.

## MCP TOOL STRATEGY
- `record_project_decision`: Canonical handler for record project decision. Always pass required schema arguments; handle return states deterministically.
- `generate_adr`: Canonical handler for generate adr. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: ADR standards (Michael Nygard format), Git commit history, and architectural invariants.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Human approval before superseding or deprecating established architectural decisions.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ArchitectureDecisionRecord (ADR) file and updated decision catalog.

## HANDOFF / RELATED SKILLS
- `alper-project-intelligence`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-architecture`: Downstream or sibling capability for ARCHITECTURE operations.
- `alper-change-planner`: Downstream or sibling capability for GOVERNANCE operations.
