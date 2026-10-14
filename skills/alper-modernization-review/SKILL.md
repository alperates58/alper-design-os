---
name: alper-modernization-review
description: Evaluates modernization PRs, enforces scope guard, truthful UI, and human visual approval. Use when concluding a modernization stage and evaluating whether exit criteria are satisfied. Do not use for initial task intake and planning (use alper-modernization-planner).
status: ACTIVE
capabilityFamily: MODERNIZATION
userFacingType: INTERNAL_ORCHESTRATION
userFacing: false
modeApplicability:
  - MODERNIZATION
mcpTools:
  - evaluate_modernization_completion
  - manage_human_visual_approval
relatedSkills:
  - alper-modernization-planner
  - alper-behavior-preservation
  - alper-independent-review
---

# Alper Modernization Review Skill

## PURPOSE
Internal gatekeeper that validates staged modernization deliverables against stage exit criteria, behavioral preservation baselines, and human visual approvals before stage completion.

## USE WHEN
- Concluding a modernization stage and evaluating whether exit criteria are satisfied.
- Verifying that visual modernizations did not introduce functional regressions.
- Managing human visual sign-off packages for modernized user interfaces.

## DO NOT USE WHEN
- Initial task intake and planning (use alper-modernization-planner).
- Standalone security vulnerability auditing (use alper-security-audit).
- Reviewing non-modernization general bugfix PRs (use alper-independent-review).

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
1. Collect staged code diffs and verification evidence.
2. Validate stage deliverables against declared ModernizationStage exit criteria.
3. Verify behavioral preservation contract via automated comparison.
4. Request human visual approval for UI changes.
5. Emit stage completion verdict.

## DECISION RULES
- A modernization stage cannot be marked complete if any behavioral contract baseline fails.
- Human visual approval is mandatory for stages modifying core application shell or design tokens.

## MCP TOOL STRATEGY
- `evaluate_modernization_completion`: Canonical handler for evaluate modernization completion. Always pass required schema arguments; handle return states deterministically.
- `manage_human_visual_approval`: Canonical handler for manage human visual approval. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: ModernizationStage exit criteria, BehavioralContract invariants, and git diff artifacts.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Human visual sign-off on modernized UI screens and theme changes.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `VISUAL_DIFF`, `BROWSER_TEST`, `INTEGRATION_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ModernizationStageCompletionReport and VisualApprovalArtifact.

## HANDOFF / RELATED SKILLS
- `alper-modernization-planner`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-behavior-preservation`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
