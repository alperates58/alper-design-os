# Known Limitations — Alper Design OS v1.0

This document defines the truthful, immutable record of known limitations, deferred qualifications, and platform scope boundaries for **ALPER DESIGN OS v1.0.0-rc.1** (Phase 1K Release Candidate).

Per our core architectural principle **NO CLAIM WITHOUT EVIDENCE**, all verification debts and environment constraints are explicitly declared below.

---

## 1. Verification Debt & Integration Status

### ANTIGRAVITY_MCP_RUNTIME = VERIFIED
- **Status**: **VERIFIED**
- **Evidence**: Live tool invocation of `get_design_tokens` via Antigravity host runtime successfully dispatched to local `packages/mcp-server/dist/index.js`, returning valid compiled W3C DTCG tokens. Global configuration in `%USERPROFILE%\.gemini\config\mcp_config.json` confirmed loaded with canonical 124 tools.

### ANTIGRAVITY_HOST_HOOK_INTEGRATION = NOT_VERIFIED
- **Status**: **NOT_VERIFIED**
- **Description**: Antigravity lifecycle hooks (`hooks.json` and `scripts/guard-destructive-command.js`) are structurally verified, syntactically valid, and pass all static mock execution tests (`HOOK_SCRIPT_RUNTIME = VERIFIED`, `HOOK_STATIC_CONFIG = VERIFIED`). However, runtime invocation triggered by an automatic IDE event is not yet verified in a live desktop session.
- **Resolution Plan**: Validate in live Antigravity IDE operator test harness once IDE hook lifecycle event firing is publicly documented.

### REAL_PROJECT_VALIDATION = DEFERRED_BY_USER
- **Status**: **DEFERRED_BY_USER** (Carried Verification Debt)
- **Description**: Greenfield project generation has structural, syntax, and build-level verification across all 4 supported technology stacks (`REACT_TYPESCRIPT`, `LARAVEL_BLADE`, `ASPNET_RAZOR`, and `PLAIN_HTML_CSS_JS`). However, end-to-end operational validation against real enterprise industrial projects (APS Finite Scheduling, MES Shop Floor Execution, WMS Inventory Logistics) was explicitly deferred by the user until Phase 2.
- **Resolution Plan**: Phase 2 Domain Expansion will execute end-to-end integration benchmarks on complex operational datasets.

### INDEPENDENT_AUDIT = PENDING
- **Status**: **PENDING**
- **Description**: The briefing package `docs/FINAL-INDEPENDENT-AUDIT-BRIEF.md` is prepared for evaluation by an external frontier model (e.g., Gemini 4 Argon or Claude 3.5 Sonnet). No independent model evaluation has been executed yet in this session.

---

## 2. Environment & Toolchain Qualification Matrix

### OPERATING_SYSTEM_MATRIX
- **Windows (x64)**: Fully qualified locally and on GitHub Actions (`windows-latest`). Windows Unicode paths (such as `KİŞİSEL PROJELER`), space-containing directories, and `.cmd` execution under Restricted ExecutionPolicy are verified.
- **Linux (Ubuntu 22.04 / 24.04)**: Fully qualified in GitHub Actions CI matrix across Node 20.x, Node 22.x, .NET 8.0 SDK, and PHP 8.3 & Composer.
- **macOS (Sonoma / Sequoia)**: Verified via GitHub Actions CI matrix (`macos-latest`) for core TypeScript compilation, test execution, and packaging. Native desktop GUI application testing on macOS is not qualified.

### GENERATED_PROJECT_BUILD_MATRIX
- **PLAIN_HTML_CSS_JS**: `VERIFIED` on all hosts (Node `--check` + HTML structure check).
- **REACT_TYPESCRIPT**: `VERIFIED` on all hosts (Vite 5.x + strict TypeScript build).
- **LARAVEL_BLADE**: Real Laravel 11 scaffold without fake fallbacks. PHP syntax + negative bootstrap guard verified locally. Full Composer install and real framework boot verified in CI Job B (`VERIFIED` in CI, `PARTIALLY_VERIFIED` locally when Composer dependencies are deferred).
- **ASPNET_RAZOR**: Exact .NET 8 SDK build (`global.json` pinned to `8.0.406`) verified in CI Job B (`VERIFIED` in CI, `PARTIALLY_VERIFIED` locally when host lacks .NET 8 SDK).

---

## 3. Scope & Non-Goals for v1.0

- **No Domain Packs**: APS, MES, and WMS domain-specific deep inference packs belong to Phase 2 and are not included in v1.0.
- **No Automatic Public Releases**: Distribution packaging prepares release candidate artifacts locally in `dist-release/`. Public GitHub Releases or git tags strictly require explicit user approval.
- **Strict Anti-Big-Bang Modernization**: Modernization engine defaults to incremental bridging and preservation contracts. Big-bang rewrites are prohibited unless explicitly authorized.
