# Changelog — Alper Design OS

All notable changes to **ALPER DESIGN OS** are documented in this file, adhering to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0-alpha.1] - 2026-10-22 (Phase 2: Premium Design Intelligence, Agent Engineering & Modernization Evolution)

### Added
- **Workstream A: Premium Design Intelligence V2**:
  - `ArtDirectionEngine` (`packages/design-language/src/art-direction-engine.ts`): Native art direction reasoning engine supporting 9 industry profiles (Premium SaaS, Enterprise ERP, Data-Dense Operations, Developer Workspace, Consumer Marketplace, Gaming Platform, Editorial / Content, Minimal Productivity, Industrial APS / MES). Implements multi-dimensional scoring (semantic coherence, density fit, typography appropriateness, contrast index) and candidate generation (3 distinct candidates for substantial tasks, 1 for trivial visual repairs).
  - `DesignKnowledgeEngine` (`packages/design-language/src/design-knowledge-engine.ts`): Compact, searchable, curated knowledge base of domain rules, layout recipes, typography pairings, color palette strategies, and accessibility guidelines with justified scoring and source provenance.
  - Universal Canonical Semantic Theme Model (`packages/design-language/src/tokens-v2/universal-theme.ts`): Canonical 11-category semantic tokens (`CANONICAL_LIGHT_THEME`, `CANONICAL_DARK_THEME`) with WCAG 2.1 AA/AAA contrast formula, true semantic parity between light and dark modes, and zero-FOUC SSR inline script generation.
  - 18 Canonical UI Component Recipes (`packages/design-language/src/recipes/component-recipes.ts`): Formalized recipes for NavigationShell, SidebarTopbar, Toolbar, ButtonActionMenu, DataTableGrid, FormValidation, SearchFilter, DropdownContextMenu, DialogDrawer, Tabs, FileExplorerTree, SplitPanel, ChartDataViz, KpiMetricCard, CardContainer, PaginationControls, NotificationToast, and LoadingEmptyStates.
  - `LayoutReasoningEngine` (`packages/design-language/src/recipes/layout-reasoning.ts`): Layout geometry engine calculating content widths, density allocation, responsive breakpoints, mobile priority, and Windows 125% DPI accessibility adjustments (48px header, 36px table row height).

- **Workstream B: Modernize & Repair V2**:
  - Comprehensive Behavioral Preservation (`packages/agent-governance/src/behavioral-preservation.ts`): Extended with `extractComprehensivePreservationContract` and `verifyComprehensivePreservation` to freeze and audit 100% of routes, user actions, form bindings, API endpoints, auth boundaries, database models, and public interfaces with strict zero-regression guarantees.
  - Visual Repair Engine (`packages/agent-governance/src/visual-repair-engine.ts`): Automated AST/DOM-level defect detection and non-destructive surgical CSS repairs targeting 5 common UI defects: fixed width horizontal overflow, low contrast text, irregular spacing (7px/13px), missing focus-visible indicators, and unwrapped flex container overflow.

- **Workstream C: Agent Workflow Engine V2**:
  - Adaptive Workflow Router (`packages/agent-governance/src/adaptive-workflow.ts`): Dynamically routes execution into `QUICK`, `STANDARD`, or `DEEP` workflow modes based on scope, blast radius, and ambiguity, with strict evidence gate requirements.
  - Requirements Glossary & Ambiguity Detection (`packages/agent-governance/src/requirements-glossary.ts`): Canonical domain glossary manager with ambiguity detection and strict separation of user-explicit vs agent-inferred requirements.
  - Deterministic Project Graph V2 (`packages/agent-governance/src/project-graph-v2.ts`): Full AST extraction of file imports, module exports, and caller hierarchies; shortest path traversal, god-node detection, blast radius calculations, and impacted test mapping with strict provenance tagging (`EXTRACTED` vs `INFERRED`).
  - Context Compression Engine (`packages/agent-governance/src/context-compression.ts`): Bounded, high-fidelity log and JSON compression achieving 25-65% token savings while preserving 100% of failure traces and stack lines.

- **Workstream D: Simplicity Guard (Ponytail / Karpathy Standards)**:
  - `SimplicityGuard` (`packages/engineering-guardrails/src/simplicity-guard.ts`): Proactively blocks speculative wrapper classes, overly deep inheritance hierarchies, and redundant external dependencies (e.g., `lodash.get`) in favor of native ES syntax and cohesive single-purpose functions.

- **Workstream E & G: Real Visual QA & Isolated Certification**:
  - `VisualQARunner` (`packages/qa-engine/src/visual-qa-runner.ts`): Automated Playwright visual testing across 4 viewports (Mobile 390x844, Tablet 768x1024, Desktop 1440x900, Large Desktop 1920x1080) in both Light and Dark themes, backed by enterprise browser fallback chain (Chromium -> Microsoft Edge `msedge` -> Google Chrome `chrome`).
  - Isolated Certification Fixtures (`tests/fixtures/certification/`): Real automated before-and-after verification with 18 genuine PNG screenshots captured on disk, proving 0 horizontal overflow, WCAG 2.1 AA compliant contrast, full keyboard accessibility, and 100% functional preservation.

- **Research & Capability Extraction**:
  - `docs/research/phase-2-capability-matrix.md`: Exhaustive evaluation matrix covering 9 frontier open-source repositories with exact commit SHAs (`obra/superpowers`, `Leonxlnx/taste-skill`, `addyosmani/agent-skills`, `juliusbrussee/caveman`, `Graphify-Labs/graphify`, `nextlevelbuilder/ui-ux-pro-max-skill`, `dietrichgebert/ponytail`, `multica-ai/andrej-karpathy-skills`, `mattpocock/skills`) and 9 enterprise UI design systems.

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
