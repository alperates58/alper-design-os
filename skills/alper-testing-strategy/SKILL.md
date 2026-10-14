---
name: alper-testing-strategy
description: Synthesizes project-appropriate test pyramids across Static, Unit, Integration, API, E2E, and Performance. Use when formulating a comprehensive testing strategy for a greenfield or modernization project. Do not use for writing individual playwright test scripts (use alper-browser-qa).
status: ACTIVE
capabilityFamily: QA_TESTING
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - generate_test_pyramid
  - generate_qa_report
relatedSkills:
  - alper-browser-qa
  - alper-contract-testing
  - alper-regression-testing
---

# Alper Testing Strategy Skill

## PURPOSE
Synthesizes balanced, cost-effective test pyramids (Static -> Unit -> Integration -> API -> E2E -> Performance) tailored to project risk, avoiding inverted ice-cream cone anti-patterns.

## USE WHEN
- Formulating a comprehensive testing strategy for a greenfield or modernization project.
- Allocating testing budgets across unit, integration, and end-to-end tiers.
- Auditing existing test distributions to eliminate redundant or slow test suites.

## DO NOT USE WHEN
- Writing individual Playwright test scripts (use alper-browser-qa).
- Designing database schemas (use alper-database-designer).
- Fixing CSS visual bugs (use alper-design-repair).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Target application route or staging URL.
- User journey flow specifications and acceptance criteria.
- Configured test runners (Playwright, Vitest) and viewport matrix (390px, 768px, 1440px).

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Analyze project criticality, change frequency, and deployment cadence.
2. Allocate test distribution percentages across 6 pyramid tiers.
3. Formulate TestPyramidSpecification defining toolchains for each tier.
4. Establish coverage targets and CI/CD execution pipeline order.

## DECISION RULES
- Pyramid Balance: Heavy reliance on slow E2E tests over fast unit/integration tests is rejected.
- Every critical user conversion funnel must have at least one integration or E2E smoke test.

## MCP TOOL STRATEGY
- `generate_test_pyramid`: Canonical handler for generate test pyramid. Always pass required schema arguments; handle return states deterministically.
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Test Pyramid principles (Martin Fowler), shift-left testing models, and coverage heuristics.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of testing pyramid budget and target coverage allocations.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- TestPyramidSpecification with tier distributions and tool recommendations.

## HANDOFF / RELATED SKILLS
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
- `alper-contract-testing`: Downstream or sibling capability for QA_TESTING operations.
- `alper-regression-testing`: Downstream or sibling capability for QA_TESTING operations.
