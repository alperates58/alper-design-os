---
name: alper-independent-review
description: Unbiased second-pass code and diff review across 12 objective quality dimensions. Use when conducting an objective pull request or working tree diff review. Do not use for writing code or implementing requested features (use implementer skills).
status: ACTIVE
capabilityFamily: GOVERNANCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - review_change
relatedSkills:
  - alper-evidence-review
  - alper-scope-guard
  - alper-security-audit
---

# Alper Independent Review Skill

## PURPOSE
Acts as an autonomous, unbiased second-pass reviewer that inspects git diffs and test results without relying on implementer self-assurances, issuing binding verdicts across 12 quality dimensions.

## USE WHEN
- Conducting an objective pull request or working tree diff review.
- Validating that changes meet quality, security, and scope invariants before merging.
- Issuing decisive verdicts (APPROVE, APPROVE_WITH_WARNINGS, REPAIR_REQUIRED, REJECT).

## DO NOT USE WHEN
- Writing code or implementing requested features (use implementer skills).
- Scaffolding initial project structures (use alper-greenfield-generator).
- Searching external UI libraries (use alper-source-intelligence).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
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
1. Extract unified git diff against base branch.
2. Evaluate diff across 12 dimensions (correctness, security, performance, accessibility, scope).
3. Inspect test execution evidence and static analysis reports.
4. Issue binding ReviewVerdict with prioritized deficiency list.

## DECISION RULES
- Anti-Bias Invariant: Never trust implementer verbal assurances; evaluate strictly on artifacts.
- Critical Flaw Rule: Any critical security defect or data loss risk results in immediate REJECT.

## MCP TOOL STRATEGY
- `review_change`: Canonical handler for review change. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Git diffs, linter outputs, test runner outputs, and 12-point objective review rubric.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of REJECT or REPAIR_REQUIRED review verdicts.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `UNIT_TEST`, `BROWSER_TEST`, `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- IndependentReviewVerdict with 12-dimension score and blocking defect checklist.

## HANDOFF / RELATED SKILLS
- `alper-evidence-review`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-scope-guard`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-security-audit`: Downstream or sibling capability for SECURITY operations.
