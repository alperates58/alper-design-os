---
name: alper-performance-engineering
description: Enforces Core Web Vitals (LCP, INP, CLS), asset budgets, pagination, and DevTools trace analysis. Use when auditing page speed, bundle sizes, and core web vitals. Do not use for diagnosing database query plans (use alper-sql-performance).
status: ACTIVE
capabilityFamily: PERFORMANCE_RELIABILITY
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - generate_qa_report
relatedSkills:
  - alper-browser-qa
  - alper-sql-performance
---

# Alper Performance Engineering Skill

## PURPOSE
Audits and optimizes frontend web performance against Google Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), enforcing bundle size budgets, font loading strategies, and sub-second interaction responsiveness.

## USE WHEN
- Auditing page speed, bundle sizes, and Core Web Vitals.
- Investigating layout shifts (CLS), long tasks causing high input delay (INP), or slow rendering (LCP).
- Enforcing JavaScript asset budgets in build pipelines.

## DO NOT USE WHEN
- Diagnosing database query plans (use alper-sql-performance).
- Designing database schemas (use alper-database-designer).
- Writing backend API controllers (use alper-api-designer).

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
1. Capture Lighthouse performance audit and DevTools performance trace.
2. Analyze Core Web Vitals (LCP, INP, CLS) and long-task waterfalls.
3. Audit bundle sizes and identify unoptimized third-party scripts.
4. Formulate prioritized performance remediations (code splitting, lazy loading, font preloading).

## DECISION RULES
- Core Web Vitals Thresholds: LCP must be under 2.5s, INP under 200ms, and CLS under 0.1 for production release.
- Performance claims require measured before/after trace evidence.

## MCP TOOL STRATEGY
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Google Core Web Vitals (LCP, INP, CLS), Lighthouse performance audits, and Chrome DevTools traces.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of bundle budget exemptions or performance optimization trade-offs.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `PERFORMANCE_TRACE`, `BROWSER_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- PerformanceAuditReport with Core Web Vitals breakdown and optimization recommendations.

## HANDOFF / RELATED SKILLS
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
- `alper-sql-performance`: Downstream or sibling capability for DATA_ENGINEERING operations.
