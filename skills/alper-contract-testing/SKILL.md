---
name: alper-contract-testing
description: Pact consumer-driven contracts, API contract validation, and breaking change prevention. Use when verifying api request/response compatibility between frontend and backend services. Do not use for running visual ui layout checks (use alper-visual-regression).
status: ACTIVE
capabilityFamily: QA_TESTING
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_api_compatibility
relatedSkills:
  - alper-api-designer
  - alper-behavior-preservation
---

# Alper Contract Testing Skill

## PURPOSE
Enforces consumer-driven contract testing (Pact) and OpenAPI schema conformance, validating that frontend consumers and backend API providers remain mutually compatible without breaking payload contracts.

## USE WHEN
- Verifying API request/response compatibility between frontend and backend services.
- Detecting breaking schema changes in microservices or decoupled client-server architectures.
- Validating mock API providers against live OpenAPI specifications.

## DO NOT USE WHEN
- Running visual UI layout checks (use alper-visual-regression).
- Designing database tables (use alper-database-designer).
- Diagnosing slow SQL query plans (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **CONTINUOUS_GOVERNANCE**.
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
1. Ingest consumer expectations and provider OpenAPI specification.
2. Execute contract verification checking status codes, headers, and payload schemas.
3. Detect broken expectations (missing fields, type mutations, unhandled error responses).
4. Output ContractVerificationReport.

## DECISION RULES
- Breaking Change Rejection: Any change that removes a field or changes a type without versioning fails contract verification.
- Consumer expectations must be validated against both success and error responses.

## MCP TOOL STRATEGY
- `evaluate_api_compatibility`: Canonical handler for evaluate api compatibility. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Pact consumer-driven contracts standard, OpenAPI schema validation, and JSON Schema draft 2020-12.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator / API provider review when breaking contract changes are detected.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `API_CONTRACT_RESULT`, `INTEGRATION_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ContractVerificationReport with compatibility verdict and schema diffs.

## HANDOFF / RELATED SKILLS
- `alper-api-designer`: Downstream or sibling capability for API_ENGINEERING operations.
- `alper-behavior-preservation`: Downstream or sibling capability for MODERNIZATION operations.
