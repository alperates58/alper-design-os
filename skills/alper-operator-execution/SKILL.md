---
name: alper-operator-execution
description: Deterministic corporate execution fallback: manual run bundle generation (RUN.ps1), evidence verification, and browser runtime resolution. Use when running in restricted corporate or offline developer environments where automated shell/browser execution is blocked. Do not use for designing ui page layouts (use alper-ui-blueprint).
status: ACTIVE
capabilityFamily: OPERATOR_EXECUTION
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - create_manual_run_bundle
  - verify_manual_run_evidence
  - resolve_browser_runtime
  - run_operator_doctor
  - create_environment_profile
  - detect_tool_capabilities
relatedSkills:
  - alper-evidence-review
  - alper-greenfield-generator
---

# Alper Operator Assisted Execution Skill

## PURPOSE
Provides deterministic corporate execution fallbacks for restricted or air-gapped developer environments, generating self-contained manual run bundles (RUN.ps1), verifying run evidence, and running environment diagnostics.

## USE WHEN
- Running in restricted corporate or offline developer environments where automated shell/browser execution is blocked.
- Generating standalone RUN.ps1 scripts for operators to build, test, and package applications locally.
- Verifying and normalizing run-evidence.json artifacts produced by operator execution.

## DO NOT USE WHEN
- Designing UI page layouts (use alper-ui-blueprint).
- Normalizing database schemas (use alper-database-designer).
- Writing application product requirements (use alper-requirements-engineering).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## AIR-GAPPED & ASSISTED EXECUTION PROTOCOL
- **Deterministic Script Generation**: Emits reproducible `RUN.ps1` and `RUN.sh` run bundles for environments where direct sandbox execution is restricted.
- **Toolchain Diagnostics**: Executes `run_operator_doctor` to probe local compiler, runtime, and package manager availability (Node, npm, dotnet, PHP, Composer, Docker).
- **Destructive Command Interception**: Strictly halts and flags commands matching dangerous patterns (e.g. `rm -rf /`, `rmdir /s /q`, `git reset --hard`, `git push --force`).
- **Evidence Verification**: Ingests operator execution output and normalizes evidence into structured verification records.

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
1. Diagnose local environment profile and detect installed toolchains (Node, dotnet, PHP, Docker).
2. Generate self-contained RUN.ps1 script with prerequisite checks and test runner commands.
3. Package run bundle into project root or .alper-design-os/bundles/.
4. Provide clear execution instructions to the operator.
5. Ingest and verify generated run-evidence.json upon completion.

## DECISION RULES
- Air-Gap Resilience: Generated run bundles must be completely self-contained and require no external internet access.
- Evidence Integrity: Ingested run evidence must report authentic process exit codes and execution logs.

## MCP TOOL STRATEGY
- `create_manual_run_bundle`: Canonical handler for create manual run bundle. Always pass required schema arguments; handle return states deterministically.
- `verify_manual_run_evidence`: Canonical handler for verify manual run evidence. Always pass required schema arguments; handle return states deterministically.
- `resolve_browser_runtime`: Canonical handler for resolve browser runtime. Always pass required schema arguments; handle return states deterministically.
- `run_operator_doctor`: Canonical handler for run operator doctor. Always pass required schema arguments; handle return states deterministically.
- `create_environment_profile`: Canonical handler for create environment profile. Always pass required schema arguments; handle return states deterministically.
- `detect_tool_capabilities`: Canonical handler for detect tool capabilities. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Local toolchain discovery (Node, dotnet, PHP, Composer, Docker), PowerShell standards, and offline run contracts.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of generated RUN.ps1 script before local execution in air-gapped environment.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `RUNTIME_CHECK`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ManualRunBundle (RUN.ps1), EnvironmentProfile, and VerifiedRunEvidenceReport.

## HANDOFF / RELATED SKILLS
- `alper-evidence-review`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-greenfield-generator`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
