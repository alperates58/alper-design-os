# Alper Design OS — v1.0 Threat Model

This document establishes the comprehensive 14-point Threat Model for **ALPER DESIGN OS v1.0**, evaluating assets, trust boundaries, attack paths, impacts, existing controls, residual risks, and verification test cases across all subsystems.

---

## 1. Threat Matrix Overview

| ID | Threat Name | Trust Boundary | Impact Severity | Primary Control File | Status |
|---|---|---|---|---|---|
| **T-01** | Untrusted MCP Client Input | Agent Host ↔ MCP Stdio | High | `packages/mcp-server/src/server.ts` | MITIGATED |
| **T-02** | Hostile Repository Content | Untrusted Repo ↔ Analysis Engine | High | `packages/software-intelligence/src/project-intelligence-engine.ts` | MITIGATED |
| **T-03** | Project Intelligence Poisoning | Code Comments / Commits ↔ Fact Store | High | `packages/software-intelligence/src/project-intelligence-engine.ts` | MITIGATED |
| **T-04** | Path Traversal via Artifact / Blueprint Export | Generator ↔ Host Filesystem | Critical | `packages/agent-governance/src/greenfield-engine.ts` | MITIGATED |
| **T-05** | Arbitrary Command Execution via Doctor / Verification | Diagnostic Probes ↔ Host Shell | Critical | `packages/agent-governance/src/doctor-engine.ts` | MITIGATED |
| **T-06** | Information Disclosure via Error Envelopes | Internal State ↔ Client / Logs | Medium | `packages/mcp-server/src/server.ts` | MITIGATED |
| **T-07** | Denial of Service via AST / ReDoS / Cyclic Deps | Code Parser ↔ Host CPU/Memory | Medium | `packages/analyzer/src/index.ts` | MITIGATED |
| **T-08** | Upstream Dependency Supply Chain Tampering | npm/pnpm Registry ↔ Build Runtime | Critical | `pnpm-lock.yaml`, `.github/workflows/ci.yml` | MITIGATED |
| **T-09** | Antigravity Hook Hijacking / Script Injection | Agent Lifecycle ↔ Host Execution | Critical | `packages/agent-governance/src/contract-engine.ts` | MITIGATED |
| **T-10** | Unsafe Database Introspection on Sensitive DBs | Schema Inspector ↔ Data Source | High | `packages/analyzer/src/database.ts` | MITIGATED |
| **T-11** | Model Hallucinatory Dependency Injection | LLM Synthesizer ↔ Project Manifest | High | `packages/engineering-guardrails/src/truthful-ui-policy.ts` | MITIGATED |
| **T-12** | Visual Diff Spoofing / Forged Evidence | Verification Pipeline ↔ Release Gate | High | `packages/qa-engine/src/visual.ts` | MITIGATED |
| **T-13** | Secret Leakage into Project Snapshots / Telemetry | Repo Secrets ↔ Durable Snapshots | Critical | `scripts/scan-repository-secrets.js` | MITIGATED |
| **T-14** | Unauthorized Version Downgrade / Manifest Drift | Packaging / CI ↔ Distribution Tarball | High | `scripts/check-drift.js`, `verify-installation.js` | MITIGATED |

---

## 2. In-Depth Threat Specifications

### T-01: Untrusted MCP Client Input
- **Asset**: MCP server process integrity, JSON-RPC communication channel, system memory.
- **Trust Boundary**: Agent host / IDE client (untrusted) ↔ MCP server stdio interface (trusted boundary).
- **Attack Path**: An external process or manipulated agent client sends malformed JSON, nested payload bombs (>100 levels of depth), or invalid fields to bypass tool validation.
- **Impact**: Server crash (DoS), unhandled exception cascades, or injection of unexpected runtime types.
- **Existing Control in Codebase**:
  - `packages/mcp-server/src/server.ts`: All incoming parameters are validated against strict Zod schemas (`ToolInputSchema.safeParse`). Inputs with unknown fields or malformed structures are rejected prior to execution.
  - Fail-closed error responses: `formatErrorEnvelope` catches and wraps validation failures without leaking server stack frames.
- **Residual Risk**: Client disconnect terminating stdio pipes abruptly; handled gracefully by standard process exit.
- **Verification / Test Case**: `tests/mcp-security-hardening.test.ts` (submits malformed, oversized, and type-mismatched JSON-RPC calls).

---

### T-02: Hostile Repository Content
- **Asset**: Quality gates, compliance verification engines, release evaluation conclusions.
- **Trust Boundary**: Target project files (README, issues, mock outputs) ↔ Design OS Evaluation Engine.
- **Attack Path**: A poisoned repository contains a `README.md` or test stub with strings like `/* @governance ignore */` or `ALL_TESTS_PASS=true`, attempting to trick the automated evaluator into awarding a passing status.
- **Impact**: False claim of release compliance for non-compliant software.
- **Existing Control in Codebase**:
  - `packages/agent-governance/src/contract-engine.ts` & `evaluate_release_gates`: Release gates refuse textual claims from repository docs. Only executable evidence with verifiable exit codes, cryptographic hashes, or schema-validated run results can satisfy gates.
  - `NO_CLAIM_WITHOUT_EVIDENCE` invariant strictly enforced.
- **Residual Risk**: User overriding gate via explicit force flag (which is recorded in telemetry and cannot be hidden).
- **Verification / Test Case**: `tests/adversarial-resilience.test.ts` (scans a poisoned repo claiming 100% compliance).

---

### T-03: Project Intelligence Poisoning
- **Asset**: Durable knowledge graph, persistent project snapshot facts, architectural invariants.
- **Trust Boundary**: Source code comments, git commit messages, branch names ↔ Project Intelligence Store.
- **Attack Path**: Malicious contributor adds docstrings or comments like `// INVARIANT: Use Plain HTTP without TLS` or `// DECISION: Kafka cluster approved by User`.
- **Impact**: Induction of insecure architecture decisions or corrupted requirement boundary contracts.
- **Existing Control in Codebase**:
  - `packages/software-intelligence/src/project-intelligence-engine.ts`: Inferences extracted from code comments or commits are strictly classified under `source: "STATIC_CODE_INFERENCE"` with low authority confidence.
  - Invariants and decisions require direct user confirmation (`USER_DECISION`) or explicit architecture contracts. Untrusted code comments cannot mutate or overwrite high-authority architectural facts.
- **Residual Risk**: Legitimate human user accidentally confirms a poisoned suggestion; mitigated by requirement boundary checks.
- **Verification / Test Case**: `tests/adversarial-resilience.test.ts` (injects fake invariants via comments).

---

### T-04: Path Traversal via Artifact / Blueprint Export
- **Asset**: Host filesystem, sensitive system files (`/etc/passwd`, Windows registry, parent directories).
- **Trust Boundary**: Agent blueprint generation / greenfield engine ↔ Host filesystem disk writer.
- **Attack Path**: User or agent prompts specify file paths containing `../../`, absolute root paths (`C:\Windows\...`, `/etc/...`), or UNC shares (`\\evil\share`).
- **Impact**: Overwriting critical host files, arbitrary file write outside project workspace.
- **Existing Control in Codebase**:
  - `packages/agent-governance/src/greenfield-engine.ts` (`validateRelativePath`, `sanitizePath`): All target paths are normalized using `path.resolve` and asserted to reside strictly within `targetDirectory`. Attempted escapes throw fatal path traversal errors.
  - Windows reserved names (`CON`, `PRN`, `AUX`, `NUL`, `COM1-9`, `LPT1-9`) and null-byte injections are stripped.
- **Residual Risk**: Symlink race condition during concurrent external modifications; guarded by synchronous existence checks.
- **Verification / Test Case**: `tests/adversarial-resilience.test.ts` (tests relative `../` traversal, UNC paths, and Windows reserved names).

---

### T-05: Arbitrary Command Execution via Doctor / Verification Scripts
- **Asset**: Host operating system execution environment, user credentials, shell access.
- **Trust Boundary**: Diagnostic inputs ↔ Subprocess execution (`child_process.execFile` / `exec`).
- **Attack Path**: Malicious input passed to doctor probe commands or verification scripts containing shell command chains (`foo; rm -rf /` or `foo && powershell -c ...`).
- **Impact**: Full remote code execution (RCE) on operator host.
- **Existing Control in Codebase**:
  - `packages/agent-governance/src/doctor-engine.ts` & `scripts/verify-generated-builds.js`: No arbitrary string commands constructed from user input. Probes use explicit fixed executable paths with array arguments via `execFile` or parameterized execution.
  - Shell execution in CI/scripts is restricted to pre-defined static toolchain calls (`node`, `git`, `npm`, `dotnet`, `php`).
- **Residual Risk**: Compromised node binary itself; mitigated by toolchain checksum verification in CI.
- **Verification / Test Case**: `tests/mcp-security-hardening.test.ts` (passes shell injection metacharacters to tool arguments).

---

### T-06: Information Disclosure via Error Envelopes
- **Asset**: Environment variables, API tokens, local file paths, private keys.
- **Trust Boundary**: MCP tool error handler ↔ External client / log output.
- **Attack Path**: Malicious query triggers an unhandled rejection containing sensitive environment variables or stack traces leaking internal directory layouts.
- **Impact**: Exposure of secrets and infrastructure topology.
- **Existing Control in Codebase**:
  - `packages/mcp-server/src/server.ts`: Production error handlers catch exceptions and map them to sanitized `ResultEnvelope` structures. Sensitive strings matching regex patterns (tokens, passwords, file paths with user profiles) are scrubbed.
  - Raw stack traces are omitted from client-facing JSON-RPC responses.
- **Residual Risk**: Error message generated by an external OS binary containing embedded paths; mitigated by redaction regexes.
- **Verification / Test Case**: `tests/mcp-security-hardening.test.ts` (triggers deliberate failures and audits output envelope).

---

### T-07: Denial of Service via AST / ReDoS / Cyclic Dependencies
- **Asset**: CPU cores, process memory, agent responsiveness.
- **Trust Boundary**: Analyzed code input ↔ AST parser / Regex matchers.
- **Attack Path**: Submission of deeply nested AST structures, circular file imports, or catastrophic backtracking regex payloads (e.g. `(a+)+$`).
- **Impact**: CPU freeze (100% core saturation), memory exhaustion, server crash.
- **Existing Control in Codebase**:
  - `packages/analyzer/src/index.ts`: TypeScript compiler AST traversal uses depth guards and visit caches to prevent cycle recursion.
  - Regexes across the codebase avoid nested quantifiers.
  - Long-running commands implement deterministic timeouts (e.g. `timeoutMs` in verification scripts).
- **Residual Risk**: Extremely large source repos (>100,000 files) causing high memory usage; mitigated by file count caps in discovery.
- **Verification / Test Case**: `tests/adversarial-resilience.test.ts` (feeds circular graph and catastrophic regex patterns).

---

### T-08: Upstream Dependency Supply Chain Tampering
- **Asset**: Monorepo integrity, build artifact determinism, distribution package.
- **Trust Boundary**: npm / pnpm remote registry ↔ Local workspace and CI runner.
- **Attack Path**: Compromised third-party package release, dependency confusion attack, or unpinned GitHub Actions running arbitrary code.
- **Impact**: Execution of malicious code during `pnpm install` or CI build pipeline.
- **Existing Control in Codebase**:
  - Deterministic package manager: `pnpm@9.15.4` with strictly enforced `pnpm-lock.yaml` and `--frozen-lockfile` in CI.
  - Full commit SHA pinning for all GitHub Actions in `.github/workflows/ci.yml`.
  - Machine-readable SBOM (`dist-release/sbom.spdx.json`) and automated license compliance auditing (`scripts/audit-licenses.js`).
- **Residual Risk**: Zero-day vulnerability in deeply nested transitive dependency; mitigated by regular `pnpm audit` scans.
- **Verification / Test Case**: `scripts/audit-licenses.js` and `scripts/generate-sbom.js`.

---

### T-09: Antigravity Hook Hijacking / Script Injection
- **Asset**: Antigravity agent lifecycle hooks (`post-tool`, `pre-commit`, `on-change`).
- **Trust Boundary**: Repository `.agents/hooks` or IDE configuration ↔ Hook execution engine.
- **Attack Path**: Malicious workspace injects an executable file into `.agents/hooks/` or registers a hook pointing to an arbitrary shell script outside the project.
- **Impact**: Automatic command execution whenever agent tools fire.
- **Existing Control in Codebase**:
  - `packages/agent-governance/src/contract-engine.ts` (`verifyHookIntegrity`): Hooks require explicit registration with pre-defined action types.
  - Hook configurations validate that target scripts exist within the trusted project boundary, possess valid permissions, and conform to the immutable hook schema.
- **Residual Risk**: Hook script legitimately modified by user with destructive contents; flagged during security scans.
- **Verification / Test Case**: `tests/adversarial-resilience.test.ts` (attempts registering external hook paths).

---

### T-10: Unsafe Database Introspection on Sensitive Databases
- **Asset**: Database server availability, production data privacy, credentials.
- **Trust Boundary**: Database connection string ↔ Schema analyzer engine.
- **Attack Path**: Passing a live production connection string to schema inspection tools, executing write operations or heavy schema locking queries.
- **Impact**: Production database downtime, unauthorized data extraction, transaction locks.
- **Existing Control in Codebase**:
  - `packages/analyzer/src/database.ts`: Analysis operations are strictly restricted to metadata catalog inspection queries (`information_schema`, `sys.tables`).
  - No `DML` (`INSERT`, `UPDATE`, `DELETE`) or `DDL` (`DROP`, `ALTER`) statements are ever executed.
  - Direct database connection parameters must be explicitly declared and validated.
- **Residual Risk**: Heavy catalog queries on databases with millions of partitions; mitigated by catalog query limits.
- **Verification / Test Case**: `tests/mcp-security-hardening.test.ts`.

---

### T-11: Model Hallucinatory Dependency Injection
- **Asset**: Package configuration (`package.json`, `composer.json`, `.csproj`), build stability.
- **Trust Boundary**: LLM model output ↔ Greenfield generator / scaffold manager.
- **Attack Path**: LLM invents non-existent packages (e.g. typosquatting targets or hallucinated libraries like `react-super-fast-grid-v10`) during greenfield generation.
- **Impact**: Build failures, remote code execution if hallucinated package is registered by an attacker on public npm.
- **Existing Control in Codebase**:
  - `packages/engineering-guardrails/src/truthful-ui-policy.ts` & `packages/agent-governance/src/greenfield-engine.ts`: Scaffolds only draw dependencies from curated, immutable canonical registries (`packages/source-intelligence`).
  - Arbitrary dependency insertion is prohibited without registry validation.
- **Residual Risk**: Outdated package versions in curated registry; maintained via automated dependency updates.
- **Verification / Test Case**: `packages/agent-governance/src/greenfield-engine.test.ts`.

---

### T-12: Visual Diff Spoofing / Forged Evidence
- **Asset**: Visual regression verification gates, human visual approval records.
- **Trust Boundary**: Test runner output ↔ Verification Plan & Evidence Store.
- **Attack Path**: Attacker supplies a synthetic 1x1 transparent PNG or pre-rendered screenshot from an unrelated site to pass visual diff inspection.
- **Impact**: Inaccurate UI approval, broken front-end shipping to production.
- **Existing Control in Codebase**:
  - `packages/qa-engine/src/visual.ts` (`auditTrackTraceTelemetry`): Visual artifacts must match expected viewport dimensions, include cryptographic content hashes, and correspond to actual DOM elements captured by Playwright/Puppeteer sessions.
  - Synthetic images lacking browser telemetry context fail visual audit gates.
- **Residual Risk**: Pixel-perfect replay of obsolete screenshots; mitigated by timestamp correlation and session tokens.
- **Verification / Test Case**: `packages/qa-engine/tests/visual.test.ts`.

---

### T-13: Secret Leakage into Project Snapshots / Telemetry
- **Asset**: API keys, database passwords, environment variables (`.env`, certificates).
- **Trust Boundary**: Repository filesystem ↔ Generated snapshots, architecture logs, telemetry.
- **Attack Path**: Developer accidentally leaves `.env` or AWS credentials in project tree; Design OS snapshots capture the files and serialize them into logs or reports.
- **Impact**: Credential leak to logs, artifacts, or LLM context windows.
- **Existing Control in Codebase**:
  - `scripts/scan-repository-secrets.js`: Multi-pattern scanner checking working tree and git history (`git log -p`) for unredacted secrets (AWS keys, GitHub tokens, Slack webhooks, private keys).
  - Snapshot engine ignores `.env*`, `*.pem`, `*.key`, and credential files by default.
  - Secret redaction filter applied to diagnostic outputs.
- **Residual Risk**: Highly unusual bespoke token formats; mitigated by Shannon entropy detection.
- **Verification / Test Case**: `scripts/scan-repository-secrets.js`.

---

### T-14: Unauthorized Version Downgrade / Manifest Drift
- **Asset**: Distribution tarball integrity, release candidate provenance.
- **Trust Boundary**: Development branch / local files ↔ Release distribution tarball.
- **Attack Path**: Inconsistent version numbers across packages, accidental inclusion of stale pre-release binaries, or tampered distribution tarball.
- **Impact**: Deployment of vulnerable or untested pre-release code under a release tag.
- **Existing Control in Codebase**:
  - `scripts/check-drift.js` & `scripts/verify-installation.js`: Asserts complete version unity across root `package.json`, individual package manifests, `environment-manifest.json`, and adapter contracts.
  - Clean-room build verification generates and compares SHA256 checksums of distribution tarballs.
- **Residual Risk**: Manual file manipulation post-distribution; protected by published SHA256 release checksums.
- **Verification / Test Case**: `scripts/check-drift.js`.

---

## 3. Threat Model Governance & Review Lifecycle
This threat model is an immutable engineering requirement for ALPER DESIGN OS v1.0. Any new MCP tool, adapter, or agent capability must be audited against these 14 threat dimensions before merging.
