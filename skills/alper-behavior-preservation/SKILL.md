---
name: alper-behavior-preservation
description: Enforces preservation contract, freezes behavioral baselines, routes, DB invariants, and auth. Use when establishing automated regression guardrails prior to modifying legacy code. Do not use for creating new greenfield requirements (use alper-requirements-engineering).
status: ACTIVE
capabilityFamily: MODERNIZATION
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
mcpTools:
  - create_preservation_contract
  - create_behavioral_baseline
  - detect_regression
relatedSkills:
  - alper-modernization-planner
  - alper-modernization-review
  - alper-contract-testing
---

# Alper Behavioral Preservation Skill

## PURPOSE
Extracts and freezes behavioral contracts (HTTP routes, status codes, payload shapes, database constraints, auth sessions) before modernization edits begin, detecting any regression.

## USE WHEN
- Establishing automated regression guardrails prior to modifying legacy code.
- Freezing existing API endpoints, request/response formats, and database invariants.
- Verifying that modernization edits have zero impact on backend business logic.

## DO NOT USE WHEN
- Creating new greenfield requirements (use alper-requirements-engineering).
- Executing single-line CSS visual tweaks (use alper-design-repair).
- Running external penetration testing (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**.
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
1. Scan legacy codebase for HTTP endpoints, route parameters, and auth guards.
2. Record behavioral baseline snapshots into .alper-design-os/project/.
3. Formulate BehavioralPreservationContract specifying frozen invariants.
4. Execute comparison checks after modernization stages to verify 100% behavioral parity.

## DECISION RULES
- Zero tolerated behavioral breakage: Any alteration to route parameters or response schemas flags a regression.
- Legacy quirks that clients depend on must be preserved unless an explicit ADR supersedes them.

## MCP TOOL STRATEGY
- `create_preservation_contract`: Canonical handler for create preservation contract. Always pass required schema arguments; handle return states deterministically.
- `create_behavioral_baseline`: Canonical handler for create behavioral baseline. Always pass required schema arguments; handle return states deterministically.
- `detect_regression`: Canonical handler for detect regression. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Existing project route tables, OpenAPI/HTTP contracts, session models, and database schemas.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator confirmation if legacy quirk must be deliberately broken or preserved.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `INTEGRATION_TEST`, `UNIT_TEST`, `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- BehavioralPreservationContract, BaselineSnapshot, and RegressionAuditReport.

## HANDOFF / RELATED SKILLS
- `alper-modernization-planner`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-modernization-review`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-contract-testing`: Downstream or sibling capability for QA_TESTING operations.
