# Roadmap — ALPER DESIGN OS

This document maintains the canonical, truthful progress status of **ALPER DESIGN OS** across all development and qualification phases.

Per our core principle **NO CLAIM WITHOUT EVIDENCE**, all phases are categorized into **COMPLETED**, **IN PROGRESS**, or **DEFERRED**.

---

## 🟢 COMPLETED (Phases 0 through Phase 2)

### Phase 2: Premium Design Intelligence, Agent Engineering & Modernization Evolution
- [x] **Research & Capability Extraction**: 9 frontier repositories evaluated with exact commit SHAs (`obra/superpowers`, `Leonxlnx/taste-skill`, `addyosmani/agent-skills`, `juliusbrussee/caveman`, `Graphify-Labs/graphify`, `nextlevelbuilder/ui-ux-pro-max-skill`, `dietrichgebert/ponytail`, `multica-ai/andrej-karpathy-skills`, `mattpocock/skills`) and 9 enterprise UI systems documented in `docs/research/phase-2-capability-matrix.md`.
- [x] **Art Direction Engine**: Multi-profile candidate generation (3 distinct candidates for substantial UI tasks, 1 for trivial repairs) across 9 canonical profiles with typed `DesignDirectionCandidate` contracts and multi-dimensional scoring.
- [x] **UI Design Knowledge & Recommendation Engine**: Searchable rules for categories, layout recipes, typography pairings, color palettes, and UX guidelines with justified scoring.
- [x] **Universal Light / Dark / System Theming**: Canonical 11-category semantic tokens (`CANONICAL_LIGHT_THEME`, `CANONICAL_DARK_THEME`) with WCAG 2.1 AA/AAA contrast formula, true semantic parity, and zero-FOUC SSR inline scripts.
- [x] **18 Component Recipes & Layout Reasoning**: 18 canonical UI component recipes and layout geometry reasoning with density allocation and Windows 125% DPI accessibility adjustments.
- [x] **Comprehensive Behavioral Preservation**: Extended preservation contracts freezing 100% of routes, user actions, form bindings, API endpoints, auth boundaries, database models, and public interfaces.
- [x] **Visual Repair Engine**: Surgical non-destructive repair for 5 common defect categories (fixed width overflow, low contrast text, irregular spacing, missing focus-visible indicators, unwrapped flex layouts).
- [x] **Adaptive Workflow Router**: Context-aware routing into `QUICK`, `STANDARD`, or `DEEP` execution modes with evidence gating.
- [x] **Canonical Glossary & Ambiguity Detection**: Explicit tracking of domain terms and strict separation of user-explicit vs agent-inferred requirements.
- [x] **Deterministic Project Graph V2**: AST extraction of file imports, module exports, shortest path traversal, god-node detection, blast radius calculations, and impacted test mapping with strict provenance tagging (`EXTRACTED` vs `INFERRED`).
- [x] **Bounded Context Compression**: High-fidelity log/JSON compression achieving 25-65% token savings while preserving 100% of failure traces and stack lines.
- [x] **Simplicity Guard**: Ponytail/Karpathy checks proactively blocking speculative wrapper classes and redundant external dependencies.
- [x] **Real Visual QA Runner & Isolated Certification**: Multi-viewport Playwright visual testing across 4 viewports in Light & Dark themes, verified on real before-and-after fixtures (`fixture-repair/` and `fixture-modernize/`) with 18 genuine PNG screenshots captured on disk.

### Phase 1K: Stabilization, Installer Hardening & V1.0 Readiness
- [x] **Windows / Unicode Path Portability**: Migrated all direct-execution checks across scripts to `fileURLToPath(import.meta.url)`, resolving silent execution failures in paths with spaces and Unicode (`KİŞİSEL PROJELER`).
- [x] **Restricted PowerShell Execution Protection**: Created native `.cmd` wrappers (`bootstrap.cmd`, `doctor.cmd`, `scripts/*.cmd`) for seamless execution under Restricted ExecutionPolicy without bypassing system security.
- [x] **Moved Repository Recovery**: Added `verifyNodeModulesIntegrity` in `bootstrap.js` to automatically catch stale or broken junctions after workspace relocation and execute safe frozen reinstall.
- [x] **Canonical 10-Stage Agent Installation Contract**: Formalized `INSPECT → SELECT DESTINATION → CLONE/UPDATE → BOOTSTRAP → BUILD → TEST → REGISTER → DOCTOR → MCP HANDSHAKE → REPORT` for Antigravity agents.
- [x] **Antigravity MCP Integration Hardening**: Verified global configuration preservation (`mcp_config.json`), live host runtime (`ANTIGRAVITY_HOST_RUNTIME = VERIFIED`), and stdio JSON-RPC handshake across 124 tools.
- [x] **Truthful Generated Build Matrix Reporting**: Refactored `verify-generated-builds.js` to report `PARTIALLY_VERIFIED` truthfully when optional toolchains (.NET SDK / Composer) are missing on host.
- [x] **Automated Hardening Test Suite**: Added `tests/installer-hardening-and-safety-1k.test.ts` (16 tests), bringing the total test suite to 552 tests across 26 suites (100% passing).

### Phase 0: Foundations & Architecture
- [x] Monorepo layout with pnpm workspace and strict TypeScript composite build.
- [x] Antigravity native plugin integration (`plugin.json`, `mcp_config.json`, `hooks.json`, `rules/AGENTS.md`).
- [x] Initial design core (`@alper-design-os/design-core`) with DTCG tokens and Style Dictionary compiler.
- [x] Technology-agnostic adapter contract and 8 stack adapters (`generic-web`, `html-css-js`, `react`, `react-typescript`, `php`, `laravel-blade`, `aspnet-razor`, `contract`).
- [x] Initial domain intelligence engine and typed `ProductUXProfile` schema.

### Phase 1A–1E: Core Platform Engines & Capabilities
- [x] **28 Canonical UX Patterns**: Gantt timelines, Split Panes, High-Density DataGrids, Command Palettes, and Master-Detail workbenches.
- [x] **Source Intelligence V2**: 65+ authoritative design systems and registries (Ant, Carbon, Material, Atlassian, shadcn/ui, Magic UI) with automated licensing checks and weighted recommendation scoring.
- [x] **UI Blueprint DSL**: Declarative JSON representation of pages, components, and app shells with cross-stack parity compilation.
- [x] **Browser QA & Testing Engine**: Playwright test generation with accessible semantic role selectors, console error sniffing, and cross-browser matrices.
- [x] **Engineering Guardrails**: OWASP Top 10 2025 policies, STRIDE threat models, release gate evaluation, and zero-tolerance secret leak scanning.

### Phase 1F: Existing Project Modernization Engine
- [x] 10-stage modernization pipeline (`EXISTING PROJECT -> UNDERSTAND -> BASELINE -> PRESERVE -> CLASSIFY -> PLAN -> PROPOSE -> HUMAN SELECT -> APPLY -> VERIFY`).
- [x] Strict preservation contracts freezing backend logic, database schemas, and authentication boundaries.
- [x] 4-stage phased modernization strategy (Tokenization -> Layout Isolation -> Component Replacement -> Full Decoupling) with anti-big-bang guards.

### Phase 1G: Greenfield Generation Engine V1
- [x] End-to-end greenfield generation pipeline (`BRIEF -> PRODUCT -> DOMAIN -> RTM -> ARCHITECTURE -> DATA MODEL -> API MODEL -> UX -> DESIGN SYSTEM -> PLAN -> SCAFFOLD -> VERIFY`).
- [x] Complexity budget limiting small/internal apps to Monolith or Modular Monolith ($\le 3$).
- [x] Complete Requirements Traceability Matrix (RTM) linking 100% of functional requirements to architecture, database, API, UI, and test artifacts.
- [x] 8-state exhaustive page state modeling (`LOADING`, `EMPTY`, `SUCCESS`, `ERROR`, `PARTIAL`, `UNAUTHORIZED`, `FORBIDDEN`, `OFFLINE`).

### Phase 1H: Project Intelligence & Durable Memory V1
- [x] Durable architectural fact store in `.alper-design-os/project/` with version-controlled state and zero secret storage.
- [x] ADR decision lifecycle management with bi-directional superseding.
- [x] Real codebase AST-derived `ProjectArchitectureGraph`, fingerprint snapshotting, and architectural drift detection.
- [x] Blast radius impact analysis calculating affected modules, entities, APIs, and tests.

### Phase 1H.1: Architecture Integrity Remediation
- [x] Universal `NO CLAIM WITHOUT EVIDENCE` enforcement across all engines.
- [x] Domain grounding eliminating synthetic entity hallucination; mandatory clarification flow on underspecified briefs.
- [x] Single source of truth for 124 MCP tools (`canonicalToolRegistry`) with automated schema generation.

### Phase 1H.2 & 1H.2B: Skill Architecture Remediation & Truth Pass
- [x] Skill consolidation into 55 canonical active skills and 19 formal deprecations across 17 bounded families.
- [x] 100% MCP tool accessibility (0 orphaned tools across the 124 canonical tools).
- [x] Elimination of split-brain routing and removal of legacy Phase 0 skills from routers.
- [x] Aligned evidence taxonomy to production `EvidenceKind` schema.

### Phase 1I: Portability, CI/CD, Bootstrap & Distribution V1
- [x] Pinned canonical package manager (`pnpm@9.15.4`) with frozen lockfile discipline.
- [x] Dual-mode system health diagnostic (`scripts/doctor.js`) with `--preflight`, `--quick`, and `--json`.
- [x] Two-tier GitHub Actions CI pipeline: Core Portability Matrix (6 jobs: Ubuntu, Windows, macOS x Node 20.x, 22.x) and Generated Project Native Build Matrix (.NET 8 SDK + PHP 8.3 & Composer).
- [x] Reproducible pre-v1 distribution packaging with SHA-256 checksums and SPDX 2.3 SBOM generation.

### Phase 1J: Release Hardening & Red-Team Security Readiness
- [x] 14-dimension threat model (`docs/THREAT-MODEL-V1.md`) and MCP tool risk classification (`docs/MCP-SECURITY-AUDIT.md`).
- [x] Adversarial resilience test suite (`tests/adversarial-resilience.test.ts`) enforcing release gates against prompt injection, hostile READMEs, and path traversal.
- [x] MCP schema fuzzing and input boundary protection (`tests/mcp-security-hardening.test.ts`).
- [x] Real Laravel 11 framework boot validation with negative bootstrap guards.
- [x] Pinned GitHub Actions to immutable full commit SHAs; resolved all critical dependency CVEs.

---

## 🟡 PENDING USER AUTHORIZATION & EXTERNAL AUDIT

- [ ] **Independent Frontier Model Audit**: Briefing package in `docs/FINAL-INDEPENDENT-AUDIT-BRIEF.md` ready for evaluation by an external frontier model (`INDEPENDENT_AUDIT = PENDING`).
- [ ] **Final v1.0.0 / v1.1.0 Release Authorization**: Awaiting explicit user approval before tagging or releasing a public release.

---

## 🔵 DEFERRED (Future Phases)

The following capabilities are explicitly deferred and will not be included in v1.0.0:

### 1. Real Industrial Enterprise Pilots (Phase 2)
- End-to-end operational benchmarks against live industrial ERP, APS, and WMS production datasets.
- Integration tests against high-throughput industrial IoT edge controllers.

### 2. Deep Domain Intelligence Models (Phase 2)
- Domain-specific inference models for Financial Trading & Risk blotters, Healthcare DICOM clinical viewers, and Telemetry Waterfall analyzers.
- Automated machine-assisted legacy CSS de-duplication engines.

### 3. Advanced Interactive Component Engine (Phase 2 / 3)
- Virtualized high-density DataGrid (50,000+ rows with column grouping and pinned columns).
- SVG/Canvas-accelerated Gantt timeline component with finite capacity scheduling.
- Antigravity UI Extension sidecar for live token preview.

### 4. Additional Framework Adapters (Phase 3)
- Vue 3 / Nuxt 3 Adapter.
- Svelte 5 / SvelteKit Adapter.
- Python (Django / Jinja2 / FastHTML) Adapter.
- Mobile / Native Adapters (React Native, Flutter).
