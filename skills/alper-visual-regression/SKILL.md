---
name: alper-visual-regression
description: Evaluates pixel and DOM visual diffs across 4 responsive viewports and light/dark themes. Use when verifying that styling or token refactorings did not alter visual appearance. Do not use for tuning sql queries (use alper-sql-performance).
status: ACTIVE
capabilityFamily: QA_TESTING
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
mcpTools:
  - generate_qa_report
relatedSkills:
  - alper-browser-qa
  - alper-design-critic
  - alper-design-repair
---

# Alper Visual Regression Skill

## PURPOSE
Compares visual rendering snapshots against approved baselines across mobile, tablet, and desktop viewports in light and dark modes, flagging unintended layout shifts and pixel regressions for human visual review.

## USE WHEN
- Verifying that styling or token refactorings did not alter visual appearance.
- Capturing multi-viewport visual baselines before executing modernization stages.
- Generating visual diff packages for human visual sign-off.

## DO NOT USE WHEN
- Tuning SQL queries (use alper-sql-performance).
- Testing API contract endpoints (use alper-contract-testing).
- Generating database blueprints (use alper-database-designer).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Target application route or staging URL.
- User journey flow specifications and acceptance criteria.
- Configured test runners (Playwright, Vitest) and viewport matrix (390px, 768px, 1440px).

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Capture baseline screenshot across viewport matrix (390, 768, 1440, 1920px).
2. Apply candidate code modifications.
3. Capture current rendering screenshot under identical conditions.
4. Compute pixel difference and highlighted diff image.
5. Submit diffs exceeding threshold for human visual approval.

## DECISION RULES
- Human Visual Sign-off: Automated tests cannot self-approve visual diffs exceeding 0.1% change; human approval is required.
- Multi-Viewport Requirement: Visual assertions must be validated across at least mobile and desktop viewports.

## MCP TOOL STRATEGY
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Pixelmatch / Playwright visual snapshot comparison, DOM tree diffing, and CSS media query matrices.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- MANDATORY human visual approval on any detected pixel diff exceeding tolerance threshold.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `VISUAL_DIFF`, `SCREENSHOT`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- VisualDiffArtifactCollection and VisualRegressionAuditReport.

## HANDOFF / RELATED SKILLS
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
- `alper-design-critic`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-design-repair`: Downstream or sibling capability for REPAIR operations.
