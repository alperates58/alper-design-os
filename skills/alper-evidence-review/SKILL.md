---
name: alper-evidence-review
description: Universal invariant: NO CLAIM WITHOUT EVIDENCE across 13 concrete evidence kinds. Use when validating completion claims ("production ready", "100% tested", "responsive fixed"). Do not use for synthesizing product requirements (use alper-requirements-engineering).
status: ACTIVE
capabilityFamily: GOVERNANCE
userFacingType: INTERNAL_ORCHESTRATION
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - create_verification_plan
  - normalize_verification_evidence
  - evaluate_completion_claim
relatedSkills:
  - alper-independent-review
  - alper-change-planner
---

# Alper Evidence Review Skill

## PURPOSE
Enforces the core architectural invariant: NO CLAIM WITHOUT EVIDENCE. Normalizes evidence artifacts into the canonical EvidenceKind taxonomy and verifies that completion claims are backed by authentic proof.

## USE WHEN
- Validating completion claims ("Production Ready", "100% Tested", "Responsive Fixed").
- Normalizing raw command stdout, test reports, or screenshots into EvidenceItems.
- Creating a gate-specific verification plan.

## DO NOT USE WHEN
- Synthesizing product requirements (use alper-requirements-engineering).
- Editing CSS or design tokens (use alper-design-language).
- Diagnosing slow database queries (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Define required EvidenceKinds for target quality gate.
2. Ingest raw execution artifacts (test logs, build output, screenshots).
3. Normalize into typed EvidenceItems with timestamps and confidence scores.
4. Evaluate completion claims: missing evidence strictly resolves to NOT_VERIFIED.

## DECISION RULES
- NO CLAIM WITHOUT EVIDENCE: Missing evidence resolves to NOT_VERIFIED, never to PASS.
- Heuristic or static analysis cannot satisfy gates requiring RUNTIME_CHECK or BROWSER_TEST.

## MCP TOOL STRATEGY
- `create_verification_plan`: Canonical handler for create verification plan. Always pass required schema arguments; handle return states deterministically.
- `normalize_verification_evidence`: Canonical handler for normalize verification evidence. Always pass required schema arguments; handle return states deterministically.
- `evaluate_completion_claim`: Canonical handler for evaluate completion claim. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: 13 concrete EvidenceTypes, EvidenceKind taxonomy, and verification logs.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Human review validation when required by gate-specific assurance policy.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `UNIT_TEST`, `INTEGRATION_TEST`, `RUNTIME_CHECK`, `BROWSER_TEST`, `VISUAL_DIFF`, `HUMAN_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- Normalized EvidenceBatch and GateVerificationResult.

## HANDOFF / RELATED SKILLS
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-change-planner`: Downstream or sibling capability for GOVERNANCE operations.
