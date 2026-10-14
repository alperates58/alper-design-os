---
name: alper-release-safety
description: Canary rollouts, feature flags, DB backwards compatibility, and automated release gates. Use when evaluating release gates prior to deployment. Do not use for writing frontend html/css (use alper-design-repair).
status: ACTIVE
capabilityFamily: PERFORMANCE_RELIABILITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_release_gates
relatedSkills:
  - alper-independent-review
  - alper-evidence-review
---

# Alper Release Safety Skill

## PURPOSE
Evaluates automated release gates, configures OpenFeature feature flags, coordinates canary rollouts, and ensures zero-downtime database and API backwards compatibility before production deployment.

## USE WHEN
- Evaluating release gates prior to deployment.
- Configuring feature flags for dark launching and progressive rollouts.
- Designing rollback automation and canary traffic shifting schedules.

## DO NOT USE WHEN
- Writing frontend HTML/CSS (use alper-design-repair).
- Designing database tables (use alper-database-designer).
- Conducting raw product briefs (use alper-greenfield-product-analysis).

## MODE APPLICABILITY
- Supported Modes: **CONTINUOUS_GOVERNANCE**.
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
1. Ingest test results, security scan findings, and visual verification evidence.
2. Evaluate against configured ReleaseGatePolicy (Zero Critical/High issues).
3. Verify database migration backwards compatibility.
4. Output ReleaseGateEvaluation verdict.

## DECISION RULES
- Gating Invariant: Any failing security gate or unverified critical test blocks release.
- Feature flags must specify default fallback behavior in the event of flag provider outage.

## MCP TOOL STRATEGY
- `evaluate_release_gates`: Canonical handler for evaluate release gates. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Continuous Delivery principles (Dave Farley), OpenFeature standard, canary deployment patterns, and automated release gates.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator sign-off before initiating production canary rollout or altering feature flag state.

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
- ReleaseGateEvaluationVerdict and DeploymentReadinessReport.

## HANDOFF / RELATED SKILLS
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-evidence-review`: Downstream or sibling capability for GOVERNANCE operations.
