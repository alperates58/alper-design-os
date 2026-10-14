---
name: alper-supply-chain-security
description: NIST SSDF, SLSA provenance, CycloneDX SBOM generation, dependency CVE hygiene, and SemVer lifecycle. Use when generating a cyclonedx sbom for release compliance. Do not use for fixing css visual bugs (use alper-design-repair).
status: ACTIVE
capabilityFamily: SECURITY
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_release_gates
  - run_safe_security_scan
relatedSkills:
  - alper-security-audit
  - alper-source-intelligence
---

# Alper Supply Chain Security Skill

## PURPOSE
Audits software supply chains, generating CycloneDX Software Bill of Materials (SBOM), scanning package lockfiles for known CVEs, and enforcing NIST SSDF / SLSA provenance standards.

## USE WHEN
- Generating a CycloneDX SBOM for release compliance.
- Scanning npm, composer, or NuGet dependencies for known CVE vulnerabilities.
- Reviewing SemVer dependency upgrade policies and lockfile integrity.

## DO NOT USE WHEN
- Fixing CSS visual bugs (use alper-design-repair).
- Designing relational database schemas (use alper-database-designer).
- Writing E2E browser tests (use alper-browser-qa).

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
1. Parse package manifests (package-lock.json, composer.lock, packages.lock.json).
2. Query vulnerability databases for known CVEs affecting declared versions.
3. Generate CycloneDX SBOM detailing component licenses and hashes.
4. Evaluate supply chain findings against release gate policies.

## DECISION RULES
- CRITICAL CVE Block: Dependencies with unmitigated CRITICAL severity CVEs block release.
- Lockfile Integrity: Direct edits to lockfiles without package manager resolution are forbidden.

## MCP TOOL STRATEGY
- `evaluate_release_gates`: Canonical handler for evaluate release gates. Always pass required schema arguments; handle return states deterministically.
- `run_safe_security_scan`: Canonical handler for run safe security scan. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: NIST SSDF (SP 800-218), SLSA Framework, CycloneDX SBOM standard, and OSV / GitHub Advisory Database.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator approval for major dependency upgrades with breaking changes or known CVE trade-offs.

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
- CycloneDX SBOM artifact and DependencyVulnerabilityReport.

## HANDOFF / RELATED SKILLS
- `alper-security-audit`: Downstream or sibling capability for SECURITY operations.
- `alper-source-intelligence`: Downstream or sibling capability for SOURCE_INTELLIGENCE operations.
