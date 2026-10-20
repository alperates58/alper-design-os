# Changelog — Alper Design OS

All notable changes to **ALPER DESIGN OS** are documented in this file, adhering to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-rc.1] - 2026-10-20 (Phase 1K: One-Shot Stabilization, Installer Hardening & V1.0 Release Readiness)

### Added
- **Windows Portability with Native `fileURLToPath`**: Standardized all ESM direct-execution checks across `bootstrap.js`, `doctor.js`, `register-mcp.js`, `safe-update.js`, `verify-generated-builds.js`, `package-distribution.js`, and `install-from-repo.js` on `fileURLToPath(import.meta.url)`, resolving silent execution failures in paths containing spaces, non-ASCII characters, and Turkish Unicode (`KİŞİSEL PROJELER`).
- **Restricted ExecutionPolicy Bypass Prevention & CMD Wrappers**: Provided native `.cmd` wrappers (`bootstrap.cmd`, `doctor.cmd`, `scripts/bootstrap.cmd`, `scripts/doctor.cmd`, `scripts/safe-update.cmd`, `scripts/install-windows.cmd`) allowing seamless execution under Windows PowerShell 5.1/7 Restricted ExecutionPolicy without requiring policy changes or administrative elevation.
- **Automated Monorepo Junction Recovery**: Implemented `verifyNodeModulesIntegrity` in `bootstrap.js` to automatically catch stale or broken junctions after workspace relocation and execute safe frozen reinstall.
- **Canonical 10-Stage Agent Installation Contract**: Formalized the verified agent installation lifecycle: `INSPECT → SELECT DESTINATION → CLONE/UPDATE → BOOTSTRAP → BUILD → TEST → REGISTER → DOCTOR → MCP HANDSHAKE → REPORT` in `INSTALL_AGENT.md` and `INSTALL.md`.
- **Global Antigravity MCP Integration Hardening**: Hardened `registerMcp` to safely preserve existing third-party servers (`playwright`, `chrome-devtools`, `postgres`, `redis`, `figma`), handle UTF-8 BOM, configure `ALPER_DESIGN_OS_HOME`, and keep external tool additions strictly opt-in.
- **Phase 1K Hardening Test Suite**: Added `tests/installer-hardening-and-safety-1k.test.ts` (16 tests) covering Unicode paths, repository relocation, idempotent installation, stdio JSON-RPC MCP handshake, token redaction, dirty worktree protection, and Windows CMD execution.

### Changed
- **Truthful Generated Build Matrix Reporting**: Refactored `verify-generated-builds.js` to report `PARTIALLY_VERIFIED` or `NOT_VERIFIED` truthfully when optional toolchains (.NET SDK / Composer) are missing on host, matching strict release gating and eliminating false PASS reporting.
- **Antigravity Host Runtime Verification**: Verified live tool invocation dispatching from Antigravity to local MCP server (`ANTIGRAVITY_MCP_RUNTIME = VERIFIED`).

---

## [1.0.0-rc.0] - 2026-10-14 (Phase 1J: Release Hardening & Red-Team Readiness)

### Added
- **14-Point Threat Model**: Complete threat surface audit in `docs/THREAT-MODEL-V1.md` covering client injection, repository poisoning, memory tampering, path traversal, RCE, supply chain attacks, and secret leaks.
- **MCP Security Audit**: Classification of all 124 canonical MCP tools into 5 strict risk tiers in `docs/MCP-SECURITY-AUDIT.md`.
- **Adversarial Resilience Tests**: Automated tests in `tests/adversarial-resilience.test.ts` verifying governance enforcement against hostile READMEs, code comments, fake test claims, and path traversal (`../../etc/passwd`, Windows reserved device names `CON`, `PRN`, `AUX`, `NUL`).
- **MCP Security Hardening Tests**: Automated tests in `tests/mcp-security-hardening.test.ts` testing schema fuzzing, 1MB+ string payloads, unexpected argument fields, shell injection sanitization, and Unicode edge cases.
- **Repository Secret Scanner**: Multi-pattern scanner in `scripts/scan-repository-secrets.js` inspecting tracked files and git commit history (`git log -p`) for AWS keys, GitHub tokens, Slack tokens, and private keys.
- **License Compliance Auditor**: Compliance verification in `scripts/audit-licenses.js` asserting permissive licensing across 100% of runtime dependencies.
- **SPDX 2.3 SBOM Generator**: Machine-readable SBOM generator in `scripts/generate-sbom.js` outputting `dist-release/sbom.spdx.json` with package checksums and relationships.
- **Independent Audit Briefing Package**: Comprehensive reviewer briefing in `docs/FINAL-INDEPENDENT-AUDIT-BRIEF.md` for external frontier model evaluations.
- **Performance & Reproducibility Specs**: Documentation in `docs/PERFORMANCE-BASELINE.md`, `docs/REPRODUCIBILITY.md`, and `docs/UPGRADE-ROLLBACK.md`.

### Changed
- **Real Laravel Framework Validation**: Removed fake version fallback from generated Laravel scaffold. Required real Composer autoloading and `Illuminate\Foundation\Application` boot, guarded by negative bootstrap verification.
- **Exact .NET 8 SDK Pinning**: Pinned generated ASP.NET Razor projects to `8.0.406` via `global.json` with `rollForward: latestMajor`, differentiating exact .NET 8 CI compilation from host forward-compatibility.
- **CI Supply Chain Pinning**: Pinned all 6 GitHub Actions in `.github/workflows/ci.yml` to immutable full commit SHAs with comments.
- **Dependency Hardening**: Upgraded test harness to `vitest@3.2.7` and pinned `tinypool` override to `^2.1.2`, completely eliminating all critical CVE advisories.

---

## [0.1.0] - 2026-10-14 (Phases 1A through 1I)

### Phase 1I: CI/CD, Portability, Bootstrap & Distribution V1
- Implemented zero-configuration bootstrap CLI `scripts/bootstrap.js`, `bootstrap.ps1`, `bootstrap.sh`.
- Created cross-platform System Health Diagnostic `scripts/doctor.js` with `--preflight`, `--quick`, and `--json` modes.
- Automated MCP registration via `scripts/register-mcp.js` supporting Antigravity IDE and Claude Desktop.
- Established 7-job multi-OS CI matrix across Ubuntu, Windows, and macOS on Node 20.x and 22.x.
- Enforced deterministic pnpm package management with frozen lockfiles.

### Phase 1H.2 & 1H.2B: Skill Architecture Remediation & Semantic Truth Pass
- Consolidated legacy skills down to 55 canonical active skills and 19 formal deprecations across 9 capability families.
- Implemented 4-tier progressive disclosure: Metadata -> Instructions -> References -> Scripts.
- Aligned evidence taxonomy to production `EvidenceKind` schema, eliminating pseudotypes.
- Removed generic textbook boilerplate; enforced capability-specific reasoning per skill.

### Phase 1H.1: Architecture Integrity Remediation
- Grounded greenfield generation and project intelligence in real verified facts rather than ungrounded heuristics.
- Enforced strict requirement boundary contracts and architectural invariants.
- Eradicated cross-domain semantic contamination.

### Phase 1A-1G: Core Platform Engine Development
- Built multi-stack rendering engines for React TypeScript, Laravel Blade, ASP.NET Razor, and Plain Web.
- Developed canonical design token compiler based on DTCG / W3C token standards.
- Created 124 canonical MCP tool handlers across discovery, blueprinting, QA, security, and project intelligence.
- Implemented project intelligence durable memory and ADR decision lifecycle management.
