---
name: alper-api-security
description: OWASP API Top 10 defense, BOLA/IDOR prevention, rate limiting, and payload schema hardening. Use when auditing or implementing authorization checks on object-level resource identifiers (e.g. /api/orders/{id}). Do not use for designing frontend page layouts or buttons (use alper-ui-blueprint).
status: ACTIVE
capabilityFamily: SECURITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_release_gates
relatedSkills:
  - alper-api-designer
  - alper-secure-coding
  - alper-security-audit
---

# Alper API Security Skill

## PURPOSE
Hardens API endpoints against OWASP API Security Top 10 vulnerabilities, focusing on Broken Object Level Authorization (BOLA/IDOR), tenant isolation, strict request body validation, and rate limiting.

## USE WHEN
- Auditing or implementing authorization checks on object-level resource identifiers (e.g. /api/orders/{id}).
- Configuring rate limiting, payload size restrictions, and CORS policies.
- Preventing Broken Object Property Level Authorization (mass assignment vulnerabilities).

## DO NOT USE WHEN
- Designing frontend page layouts or buttons (use alper-ui-blueprint).
- Tuning database indexing (use alper-sql-performance).
- Searching icon libraries (use alper-source-intelligence).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **CONTINUOUS_GOVERNANCE**.
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
1. Review API endpoint definitions and controller handlers.
2. Verify tenant boundary checks: assert user owns requested resource ID on every query.
3. Verify request payload schema validation (prohibiting mass-assignment of sensitive fields).
4. Verify rate-limiting and security headers (CORS, CSP, HSTS).
5. Output APISecurityAudit.

## DECISION RULES
- BOLA Zero Tolerance: Never fetch resources solely by route ID without scoping query by authenticated tenant/user ID.
- Strict Schemas: Endpoints must explicitly whitelist allowed input properties (no open object binds).

## MCP TOOL STRATEGY
- `evaluate_release_gates`: Canonical handler for evaluate release gates. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: OWASP API Security Top 10 2023 (BOLA, Broken Auth, BOPLA, Resource Exhaustion) and RFC 6750.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Security review on rate limiting exceptions or tenant boundary logic changes.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `SECURITY_REPORT`, `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- APISecurityAuditReport and EndpointHardeningChecklist.

## HANDOFF / RELATED SKILLS
- `alper-api-designer`: Downstream or sibling capability for API_ENGINEERING operations.
- `alper-secure-coding`: Downstream or sibling capability for SECURITY operations.
- `alper-security-audit`: Downstream or sibling capability for SECURITY operations.
