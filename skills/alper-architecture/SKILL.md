---
name: alper-architecture
description: Structural architecture discovery, style classification, subsystem boundaries, and stack recommendations. Use when selecting an architectural pattern for a greenfield system (defaulting to modular monolith). Do not use for executing single-line css or ui styling changes (use alper-design-repair).
status: ACTIVE
capabilityFamily: ARCHITECTURE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - analyze_architecture
  - generate_adr
  - recommend_architecture
  - recommend_stack
relatedSkills:
  - alper-decision-management
  - alper-greenfield-generator
  - alper-refactoring-strategy
---

# Alper Architecture Skill

## PURPOSE
Discovers existing architecture, classifies architectural styles (Monolith, Modular Monolith, Client-Server), defines subsystem boundaries, and enforces anti-overengineering complexity budgets.

## USE WHEN
- Selecting an architectural pattern for a greenfield system (defaulting to Modular Monolith).
- Analyzing subsystem boundaries and modular coupling in an existing repository.
- Recommending a technology stack grounded in team constraints and complexity budgets.

## DO NOT USE WHEN
- Executing single-line CSS or UI styling changes (use alper-design-repair).
- Writing raw SQL migrations or indexing (use alper-database-designer or alper-sql-performance).
- Running automated security vulnerability scans (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## ARCHITECTURAL DECISION DISCIPLINE & COMPLEXITY BUDGET
- **Architecture Decision Records (ADRs)**: Every foundational structural choice must be recorded as an ADR documenting context, options, decision, and consequences.
- **Complexity Budget Invariant**: Enforces a strict complexity budget (maximum score <= 3 for initial phase); rejects premature microservice or distributed decomposition.
- **Modular Monolith Baseline**: Defaults to clean modular monolith architecture with strict package/module boundaries before evaluating distributed services.
- **Backward Compatibility**: API changes must maintain backward compatibility; breaking changes require versioned migration paths.

## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: CLARIFY_AMBIGUITY**
If input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in `DEFINED / NOT_VERIFIED` state until clarified.

## WORKFLOW
1. Analyze project scale, domain complexity, and team capabilities.
2. Evaluate complexity budget (score <= 3 mandates Monolith or Modular Monolith).
3. Formulate subsystem boundaries and dependency directions.
4. Recommend grounded architecture style and stack.
5. Record decisions in an Architecture Decision Record.

## DECISION RULES
- Anti-Overengineering Rule: Prohibit microservices, event streaming, and Kubernetes for small-to-medium CRUD tools.
- All architectural choices without explicit user constraints must be tagged as REVERSIBLE_ASSUMPTION.

## MCP TOOL STRATEGY
- `analyze_architecture`: Canonical handler for analyze architecture. Always pass required schema arguments; handle return states deterministically.
- `generate_adr`: Canonical handler for generate adr. Always pass required schema arguments; handle return states deterministically.
- `recommend_architecture`: Canonical handler for recommend architecture. Always pass required schema arguments; handle return states deterministically.
- `recommend_stack`: Canonical handler for recommend stack. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Martin Fowler Architecture catalog, modular monolith principles, and complexity budget models.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator authorization for major irreversible architectural trade-offs (e.g. distributed vs monolith).

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ArchitectureRecommendationReport, SubsystemBoundaryMap, and initial ADR.

## HANDOFF / RELATED SKILLS
- `alper-decision-management`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-greenfield-generator`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
- `alper-refactoring-strategy`: Downstream or sibling capability for MODERNIZATION operations.
