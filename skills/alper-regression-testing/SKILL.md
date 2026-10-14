---
name: alper-regression-testing
description: Orchestrates selective smoke and regression test suites safeguarding critical business funnels. Use when executing targeted regression testing after a code repair or modernization stage. Do not use for conducting product discovery briefs (use alper-greenfield-product-analysis).
status: ACTIVE
capabilityFamily: QA_TESTING
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - generate_qa_report
  - detect_regression
relatedSkills:
  - alper-change-impact-analysis
  - alper-browser-qa
  - alper-behavior-preservation
---

# Alper Regression Testing Skill

## PURPOSE
Selects and executes targeted smoke and regression test suites based on change impact analysis, ensuring high-risk business funnels remain operational without running exhaustive full-suite test cycles.

## USE WHEN
- Executing targeted regression testing after a code repair or modernization stage.
- Selecting optimal test subsets matching modified files to minimize CI execution time.
- Validating critical checkout, login, or scheduling funnels after updates.

## DO NOT USE WHEN
- Conducting product discovery briefs (use alper-greenfield-product-analysis).
- Designing design tokens (use alper-design-language).
- Auditing software supply chains (use alper-supply-chain-security).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Target application route or staging URL.
- User journey flow specifications and acceptance criteria.
- Configured test runners (Playwright, Vitest) and viewport matrix (390px, 768px, 1440px).

## PROJECT INTELLIGENCE LOADING
**Status: REQUIRED**
This skill strictly requires reading durable project memory from `.alper-design-os/project/` (manifest, architecture graph, ADRs, behavioral contracts) before planning or executing actions. Missing memory triggers explicit initialization or drift detection.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Ingest list of modified files from git diff.
2. Query change impact graph to select affected test suites.
3. Run selected regression and smoke tests.
4. Evaluate results and emit regression verdict.

## DECISION RULES
- Zero Regression Tolerated: Any failure in a previously passing test fails the regression gate.
- Critical business funnels must be included in regression validation whenever upstream services change.

## MCP TOOL STRATEGY
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.
- `detect_regression`: Canonical handler for detect regression. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Regression test selection algorithms (RTS), affected module graphs, and smoke suite definitions.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator sign-off if known non-critical regressions are temporarily waived.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `TEST_RESULT`, `UNIT_TEST`, `INTEGRATION_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- RegressionTestReport with executed test list and pass/fail summary.

## HANDOFF / RELATED SKILLS
- `alper-change-impact-analysis`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
- `alper-behavior-preservation`: Downstream or sibling capability for MODERNIZATION operations.
