---
name: alper-security-audit
description: Passive security audits, STRIDE threat models, and release gate evaluation. Use when auditing a repository for security vulnerabilities, misconfigurations, and owasp top 10 risks. Do not use for styling ui components or tokens (use alper-design-language).
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
  - run_safe_security_scan
  - generate_threat_model
  - evaluate_release_gates
  - detect_tool_capabilities
relatedSkills:
  - alper-secure-coding
  - alper-api-security
  - alper-supply-chain-security
  - alper-secret-management
---

# Alper Security Audit Skill

## PURPOSE
Performs passive, read-only static security audits, generates STRIDE threat models, scans for hardcoded credentials, and evaluates vulnerability findings against release gates without active network intrusion.

## USE WHEN
- Auditing a repository for security vulnerabilities, misconfigurations, and OWASP Top 10 risks.
- Generating a STRIDE threat model (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation).
- Evaluating security findings against release gate policies before deployment.

## DO NOT USE WHEN
- Styling UI components or tokens (use alper-design-language).
- Running active network attacks or penetration testing without explicit written authorization.
- Diagnosing database query latency (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## ASSESSMENT BOUNDARIES: PASSIVE VS ACTIVE
- **PASSIVE AUDITING (Default)**: Static analysis, AST pattern matching, dependency lockfile vulnerability scanning, STRIDE threat modeling, and configuration inspection. Executed automatically without external side-effects.
- **ACTIVE SECURITY TESTING (Restricted)**: DAST, fuzzing, port scanning, or vulnerability exploitation against live environments. Strictly FORBIDDEN without explicit written operator authorization.

## STRIDE THREAT MODELING RUBRIC
- **Spoofing**: Authentication token validation, session fixation guards, signature verification.
- **Tampering**: Parameterized queries, CSRF token validation, integrity hashes.
- **Repudiation**: Immutable audit logging, correlation IDs, non-repudiation of transactions.
- **Information Disclosure**: Secret scanning, exception sanitization, PII redaction, CORS restriction.
- **Denial of Service**: Rate limiting, request payload size limits, resource timeouts.
- **Elevation of Privilege**: Object-level authorization (BOLA/IDOR defense), RBAC checks.

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
1. Enforce PASSIVE / READ-ONLY mode: scan source files, configs, and dependencies statically.
2. Generate STRIDE threat model identifying system trust boundaries and attack surfaces.
3. Execute safe static security scan (checking for secrets, injection, insecure dependencies).
4. Evaluate findings against release gates (CRITICAL and HIGH block release).
5. Output SecurityAuditReport with remediations.

## DECISION RULES
- Passive Safety Rule: All automated audits are strictly PASSIVE and read-only. Active testing requires explicit operator authorization.
- Release Blocker: Any unmitigated CRITICAL or HIGH severity finding blocks release gate PASS.
- Never include UI visual approval checkpoints in security auditing.

## MCP TOOL STRATEGY
- `run_safe_security_scan`: Canonical handler for run safe security scan. Always pass required schema arguments; handle return states deterministically.
- `generate_threat_model`: Canonical handler for generate threat model. Always pass required schema arguments; handle return states deterministically.
- `evaluate_release_gates`: Canonical handler for evaluate release gates. Always pass required schema arguments; handle return states deterministically.
- `detect_tool_capabilities`: Canonical handler for detect tool capabilities. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: OWASP Top 10 2025, STRIDE threat modeling methodology, CVE/NVD databases, and ASVS 5.0 verification rules.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- MANDATORY written operator authorization before executing active penetration scans or live probing.

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
- SecurityAuditReport, STRIDEThreatModel, and ReleaseGateEvaluationResult.

## HANDOFF / RELATED SKILLS
- `alper-secure-coding`: Downstream or sibling capability for SECURITY operations.
- `alper-api-security`: Downstream or sibling capability for SECURITY operations.
- `alper-supply-chain-security`: Downstream or sibling capability for SECURITY operations.
- `alper-secret-management`: Downstream or sibling capability for SECURITY operations.
