---
name: alper-accessibility-testing
description: Audits WCAG 2.2 AA compliance, keyboard navigation, contrast ratios, and aria attributes. Use when auditing a web application for wcag 2.2 aa / section 508 accessibility compliance. Do not use for tuning sql performance (use alper-sql-performance).
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
  - audit_accessibility
  - generate_qa_report
relatedSkills:
  - alper-browser-qa
  - alper-design-language
  - alper-design-repair
---

# Alper Accessibility Testing Skill

## PURPOSE
Audits web user interfaces against the canonical WCAG 2.2 AA standard (supporting WCAG 2.1 AA compatibility), evaluating color contrast, focus-visible indicators, keyboard navigation, target sizes, and ARIA attributes.

## USE WHEN
- Auditing a web application for WCAG 2.2 AA / Section 508 accessibility compliance.
- Verifying keyboard tab order, focus traps in modals, and skip-to-content links.
- Checking touch target sizes (min 24x24px in WCAG 2.2) and accessible color contrast (4.5:1 / 3:1).

## DO NOT USE WHEN
- Tuning SQL performance (use alper-sql-performance).
- Designing backend API contracts (use alper-api-designer).
- Writing database migrations (use alper-migration-safety).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## CANONICAL ACCESSIBILITY STANDARD: WCAG 2.2 AA
- **Primary Target**: ALPER DESIGN OS standardizes on **WCAG 2.2 AA** (published October 2023).
- **Backward Compatibility**: Fully satisfies legacy WCAG 2.1 AA requirements as a strict subset.
- **Key Verification Areas**:
  - **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text and UI components/icons.
  - **Focus Appearance (2.4.11 / 2.4.13)**: Focus indicators must have high contrast and minimum 2px visible area.
  - **Target Size Minimum (2.5.8)**: Interactive targets must be at least 24x24px or have sufficient spacing.
  - **Dragging Movements (2.5.7)**: Single-pointer alternative required for any drag-and-drop workflow.
  - **Accessible Authentication (3.3.8)**: Cognitive tests (e.g. transcription) forbidden without alternative.
  - **Keyboard Navigation**: Complete tab order traversal without keyboard traps; modals must trap and restore focus.

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
1. Execute axe-core automated audit on rendered DOM.
2. Audit contrast ratios across light and dark modes against WCAG 2.2 AA thresholds.
3. Verify keyboard navigation flow (logical tab order, no keyboard traps, visible focus rings).
4. Verify target sizes meet WCAG 2.2 minimum spacing requirements.
5. Output AccessibilityReport with prioritized violations.

## DECISION RULES
- Canonical Target: The primary accessibility baseline for ALPER DESIGN OS is WCAG 2.2 AA.
- Critical A11y Violations (missing alt on images, low contrast text, broken focus trap) block release gate.

## MCP TOOL STRATEGY
- `audit_accessibility`: Canonical handler for audit accessibility. Always pass required schema arguments; handle return states deterministically.
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: W3C Web Content Accessibility Guidelines (WCAG 2.2 AA canonical standard, WCAG 2.1 AA compatibility), WAI-ARIA 1.2, and axe-core rule set.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of manual keyboard navigation verification and screen reader announcements.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `BROWSER_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.
- Expected Artifact Evidence: `axe-core-violations-json`, `wcag-2-2-aa-audit-report`, `aria-tree-snapshot`.

## OUTPUT CONTRACT
- AccessibilityAuditReport (WCAG 2.2 AA) with violation locations and code remedies.

## HANDOFF / RELATED SKILLS
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-design-repair`: Downstream or sibling capability for REPAIR operations.
