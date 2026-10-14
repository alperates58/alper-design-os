---
name: alper-scope-guard
description: Enforces scope boundaries, prevents silent creep, and blocks uninvited modifications. Use when validating that a candidate file edit stays strictly within user-requested boundaries. Do not use for generating high-level product profiles (use alper-greenfield-product-analysis).
status: ACTIVE
capabilityFamily: GOVERNANCE
userFacingType: INTERNAL_ORCHESTRATION
userFacing: false
modeApplicability:
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_scope
relatedSkills:
  - alper-change-planner
  - alper-git-safety
  - alper-independent-review
---

# Alper Scope Guard Skill

## PURPOSE
Internal guardrail that intercepts and evaluates candidate file modifications, categorizing them into IN_SCOPE, REQUIRED_DEPENDENCY, OUT_OF_SCOPE, or FORBIDDEN to eliminate uninvited scope creep.

## USE WHEN
- Validating that a candidate file edit stays strictly within user-requested boundaries.
- Detecting uninvited changes to database migrations, package configs, or infrastructure files.
- Auditing working tree diffs prior to independent review.

## DO NOT USE WHEN
- Generating high-level product profiles (use alper-greenfield-product-analysis).
- Designing UI wireframes or blueprints (use alper-ui-blueprint).
- Running external security penetration tests (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Ingest candidate file path and active task scope.
2. Classify path against forbidden patterns (migrations, lockfiles, production configs).
3. Check if path is requested or a legitimate sub-dependency.
4. Emit scope verdict (ALLOW vs BLOCK).

## DECISION RULES
- Forbidden Path Rule: Unrequested edits to database migrations or package lockfiles are unconditionally BLOCKED.
- Zero Silent Expansion: Any file touched outside approved scope triggers an immediate alert.

## MCP TOOL STRATEGY
- `evaluate_scope`: Canonical handler for evaluate scope. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Current task brief, approved AgentActionPlan, and repository directory structure.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator permission if an out-of-scope dependency must genuinely be modified.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ScopeEvaluationResult (IN_SCOPE, REQUIRED_DEPENDENCY, OUT_OF_SCOPE, FORBIDDEN).

## HANDOFF / RELATED SKILLS
- `alper-change-planner`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-git-safety`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
