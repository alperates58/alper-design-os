---
name: alper-secure-coding
description: Enforces proactive secure coding practices based on OWASP Top 10 2025, ASVS 5.0, and engineering policies. Use when establishing secure coding standards and engineering policies for a project. Do not use for fixing visual button padding or responsive css layouts (use alper-design-repair).
status: ACTIVE
capabilityFamily: SECURITY
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - generate_engineering_policy
  - create_auth_model
relatedSkills:
  - alper-security-audit
  - alper-api-security
  - alper-secret-management
---

# Alper Secure Coding Skill

## PURPOSE
Enforces proactive secure coding standards based on OWASP ASVS 5.0, OWASP Top 10 2025, and CWE Top 25, generating stack-aware security policies covering input validation, parameterized queries, and auth token lifetimes.

## USE WHEN
- Establishing secure coding standards and engineering policies for a project.
- Writing or reviewing authentication, authorization, or session handling code.
- Enforcing parameterized database queries, CSRF protections, and secure cookie directives.

## DO NOT USE WHEN
- Fixing visual button padding or responsive CSS layouts (use alper-design-repair).
- Searching for design tokens and icon libraries (use alper-source-intelligence).
- Tuning database indexing (use alper-sql-performance).

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
1. Ingest target stack and security level requirements (ASVS L1, L2, L3).
2. Generate stack-aware EngineeringPolicy covering injection, auth, cryptography, and headers.
3. Formulate secure coding directives for developers and CI/CD pipelines.
4. Output EngineeringPolicyDocument.

## DECISION RULES
- SQL Injection Zero Tolerance: Parameterized queries or type-safe ORM query builders are mandatory.
- Secure Cookie Directives: All session cookies must enforce HttpOnly, Secure, and SameSite=Strict/Lax.

## MCP TOOL STRATEGY
- `generate_engineering_policy`: Canonical handler for generate engineering policy. Always pass required schema arguments; handle return states deterministically.
- `create_auth_model`: Canonical handler for create auth model. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: OWASP Top 10 2025, OWASP ASVS 5.0, OWASP Cheat Sheet Series, and CWE Top 25.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator approval for security policy modifications or rule exemptions.

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
- EngineeringPolicyDocument and SecurityComplianceChecklist.

## HANDOFF / RELATED SKILLS
- `alper-security-audit`: Downstream or sibling capability for SECURITY operations.
- `alper-api-security`: Downstream or sibling capability for SECURITY operations.
- `alper-secret-management`: Downstream or sibling capability for SECURITY operations.
