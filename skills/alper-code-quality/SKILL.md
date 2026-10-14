---
name: alper-code-quality
description: Enforces static analysis, typed linting (ESLint, PHPStan, Roslyn), and cognitive complexity limits. Use when running static analysis, typescript strict checking, or language linter passes. Do not use for executing browser ui tests (use alper-browser-qa).
status: ACTIVE
capabilityFamily: SECURITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - detect_tool_capabilities
  - evaluate_release_gates
relatedSkills:
  - alper-independent-review
  - alper-secure-coding
---

# Alper Code Quality Skill

## PURPOSE
Enforces code quality, typed linting, and cognitive complexity limits across supported languages, ensuring strict type-safety, zero linter errors, and low cognitive overhead.

## USE WHEN
- Running static analysis, TypeScript strict checking, or language linter passes.
- Auditing functions exceeding cognitive complexity limits (max complexity 15).
- Verifying clean static analysis evidence before release gate evaluation.

## DO NOT USE WHEN
- Executing browser UI tests (use alper-browser-qa).
- Designing relational schemas (use alper-database-designer).
- Planning product features (use alper-requirements-engineering).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Target source code repository, configuration files, and package manifests.
- Declared trust boundaries, authentication endpoints, and sensitive data flows.
- Environment classification (local development, staging, production).

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Detect installed linter tools (ESLint, PHPStan, Roslyn).
2. Execute typed static analysis in workspace.
3. Parse and categorize linter errors and warnings.
4. Evaluate cognitive complexity metrics on modified methods.
5. Output CodeQualityReport.

## DECISION RULES
- Zero Lint Errors: Code with blocking lint errors cannot pass release gates.
- Cognitive Complexity: Functions with complexity > 15 must be refactored into smaller helpers.

## MCP TOOL STRATEGY
- `detect_tool_capabilities`: Canonical handler for detect tool capabilities. Always pass required schema arguments; handle return states deterministically.
- `evaluate_release_gates`: Canonical handler for evaluate release gates. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Language-specific static analyzers (ESLint, PHPStan, Roslyn, Ruff) and cognitive complexity metrics.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- None required for standard static analysis runs.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.
- Active penetration or intrusive actions attempted without explicit operator authorization.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- CodeQualityAuditReport with linter output and complexity breakdown.

## HANDOFF / RELATED SKILLS
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-secure-coding`: Downstream or sibling capability for SECURITY operations.
