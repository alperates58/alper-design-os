---
name: alper-change-impact-analysis
description: Calculates blast radius, affected modules, database entities, APIs, and tests. Use when assessing the risk and scope of modifying a shared utility, database schema, or core service. Do not use for creating clean-sheet requirements on a non-existent repo (use alper-requirements-engineering).
status: ACTIVE
capabilityFamily: PROJECT_INTELLIGENCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - analyze_change_impact
relatedSkills:
  - alper-change-planner
  - alper-project-intelligence
  - alper-scope-guard
---

# Alper Change Impact Analysis Skill

## PURPOSE
Analyzes proposed code modifications against the codebase dependency graph to calculate the exact blast radius, identifying affected modules, dependent APIs, database models, and required test suites.

## USE WHEN
- Assessing the risk and scope of modifying a shared utility, database schema, or core service.
- Determining which unit and integration test suites must run to validate a proposed change.
- Preventing unintended cascading breaks across subsystem boundaries.

## DO NOT USE WHEN
- Creating clean-sheet requirements on a non-existent repo (use alper-requirements-engineering).
- Fixing an isolated button hover CSS state (use alper-design-repair).
- Searching external design system libraries (use alper-source-intelligence).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
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
1. Identify candidate files or symbols targeted for modification.
2. Traverse ProjectArchitectureGraph to find upstream and downstream dependents.
3. Map impact to database entities, public API contracts, and user-facing screens.
4. Calculate blast radius risk score (LOW, MEDIUM, HIGH, CRITICAL).
5. Output list of required verification suites.

## DECISION RULES
- If blast radius touches authentication, authorization, or payments, mark change as HIGH/CRITICAL.
- All directly and transitively affected modules must be included in the impact report.

## MCP TOOL STRATEGY
- `analyze_change_impact`: Canonical handler for analyze change impact. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: ProjectArchitectureGraph, import/export dependency trees, and database schema mappings.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review when change blast radius extends to CRITICAL infrastructure.

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
- ChangeImpactReport detailing affected files, risk score, and required test coverage.

## HANDOFF / RELATED SKILLS
- `alper-change-planner`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-project-intelligence`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-scope-guard`: Downstream or sibling capability for GOVERNANCE operations.
