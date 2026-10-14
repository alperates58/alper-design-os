---
name: alper-secret-management
description: Zero-tolerance secret leak prevention, token/key scanning, and .env governance. Use when pre-commit and ci/cd secret scanning before code is pushed to remote repositories. Do not use for diagnosing slow database queries (use alper-sql-performance).
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
  - run_safe_security_scan
relatedSkills:
  - alper-security-audit
  - alper-secure-coding
  - alper-git-safety
---

# Alper Secret Management Skill

## PURPOSE
Enforces zero-tolerance credential leak prevention, scanning source code, git history, and configs for hardcoded API keys, private certificates, database passwords, and improper .env exposure.

## USE WHEN
- Pre-commit and CI/CD secret scanning before code is pushed to remote repositories.
- Auditing .gitignore files to ensure credential files (.env, id_rsa, *.pem) are excluded.
- Redacting credentials from logs, execution journals, and diagnostic traces.

## DO NOT USE WHEN
- Diagnosing slow database queries (use alper-sql-performance).
- Designing UI page layouts (use alper-ui-blueprint).
- Writing Playwright browser tests (use alper-browser-qa).

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
1. Scan workspace files with secret detection patterns and entropy analysis.
2. Verify that .env and credential files are listed in .gitignore.
3. If secrets are detected, immediately flag file and line number.
4. Enforce [REDACTED] masking on all output artifacts.

## DECISION RULES
- Zero Tolerance: Any committed private key, JWT secret, or API token blocks release immediately.
- Never echo or display detected secret values in audit reports or console logs.

## MCP TOOL STRATEGY
- `run_safe_security_scan`: Canonical handler for run safe security scan. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Secret detection regex patterns, Shannon entropy analysis, and .env governance best practices.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator notification and key rotation protocol upon detecting committed secrets.

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
- Expected Artifact Evidence: `trufflehog-gitleaks-log`, `entropy-scan-report`, `env-redaction-map`.

## OUTPUT CONTRACT
- SecretScanReport with redacted findings and remediation instructions.

## HANDOFF / RELATED SKILLS
- `alper-security-audit`: Downstream or sibling capability for SECURITY operations.
- `alper-secure-coding`: Downstream or sibling capability for SECURITY operations.
- `alper-git-safety`: Downstream or sibling capability for GOVERNANCE operations.
