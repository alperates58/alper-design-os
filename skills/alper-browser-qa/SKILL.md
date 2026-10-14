---
name: alper-browser-qa
description: Orchestrates Playwright E2E and Chrome DevTools runtime inspection, console errors, and cross-browser testing. Use when generating or running playwright e2e tests for user journeys. Do not use for designing database tables or sql migrations (use alper-database-designer).
status: ACTIVE
capabilityFamily: QA_TESTING
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - generate_playwright_test
  - generate_qa_report
relatedSkills:
  - alper-visual-regression
  - alper-accessibility-testing
  - alper-testing-strategy
---

# Alper Browser QA & E2E Skill

## PURPOSE
Orchestrates end-to-end browser testing and runtime inspection using Playwright and Chrome DevTools, generating resilient accessible role-based tests, capturing network waterfalls, and auditing console exceptions across 4 viewports.

## USE WHEN
- Generating or running Playwright E2E tests for user journeys.
- Inspecting live browser runtime for console errors, unhandled promise rejections, or 4xx/5xx network failures.
- Validating responsive layouts across 4 standard viewports (390px, 768px, 1440px, 1920px).

## DO NOT USE WHEN
- Designing database tables or SQL migrations (use alper-database-designer).
- Analyzing server-side SQL query execution plans (use alper-sql-performance).
- Creating product discovery profiles (use alper-greenfield-product-analysis).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## DETERMINISTIC BROWSER QA & PLAYWRIGHT SPECIFICATION
- **Accessible Role Locators**: Playwright tests must prioritize user-facing accessible locators (`getByRole`, `getByLabel`, `getByText`) over fragile CSS selectors.
- **Canonical Viewport Matrix**: Verifies responsive behavior across 4 standard viewports: 390x844 (Mobile), 768x1024 (Tablet), 1440x900 (Desktop Dense), 1920x1080 (Wide).
- **Runtime Telemetry Auditing**: Captures and inspects console warnings/errors, unhandled rejections, and 4xx/5xx network failures during test execution.
- **Visual Regression Baseline**: Establishes deterministic visual diff baselines with strict pixel comparison thresholds.

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
1. Ingest user journey specification or target URL/route.
2. Generate deterministic Playwright test code using accessible role locators (getByRole, getByLabel).
3. Execute test suite headlessly across configured viewport matrix.
4. Capture console error logs, network traces, and failure screenshots.
5. Output structured QAReport.

## DECISION RULES
- Accessible Locators Rule: Tests must use getByRole, getByLabel, or getByText; fragile CSS/XPath locators are prohibited.
- Zero Console Errors: Uncaught runtime exceptions in browser console fail the QA gate.

## MCP TOOL STRATEGY
- `generate_playwright_test`: Canonical handler for generate playwright test. Always pass required schema arguments; handle return states deterministically.
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Playwright automation APIs, Chrome DevTools Protocol, and W3C accessible locator practices.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Human review of visual discrepancy reports or E2E failure video recordings.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `BROWSER_TEST`, `VISUAL_DIFF`, `RUNTIME_CHECK`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.
- Expected Artifact Evidence: `browser-console-log`, `network-har-trace`, `playwright-test-trace`.

## OUTPUT CONTRACT
- PlaywrightTestScript, BrowserExecutionLog, and ComprehensiveQAReport.

## HANDOFF / RELATED SKILLS
- `alper-visual-regression`: Downstream or sibling capability for QA_TESTING operations.
- `alper-accessibility-testing`: Downstream or sibling capability for QA_TESTING operations.
- `alper-testing-strategy`: Downstream or sibling capability for QA_TESTING operations.
