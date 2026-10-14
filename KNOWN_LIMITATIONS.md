# Known Limitations — Alper Design OS v1.0

This document defines the truthful, immutable record of known limitations, deferred qualifications, and platform scope boundaries for **ALPER DESIGN OS v1.0.0-rc.1**.

Per our core architectural principle **NO CLAIM WITHOUT EVIDENCE**, all verification debts and environment constraints are explicitly declared below.

---

## 1. Deferred Qualifications

### REAL_PROJECT_VALIDATION = DEFERRED_BY_USER
- **Status**: **DEFERRED_BY_USER** (Carried Verification Debt)
- **Description**: Greenfield project generation has structural, syntax, and build-level verification across all 4 supported technology stacks (`REACT_TYPESCRIPT`, `LARAVEL_BLADE`, `ASPNET_RAZOR`, and `PLAIN_HTML_CSS_JS`). However, end-to-end operational validation against real enterprise industrial projects (APS Finite Scheduling, MES Shop Floor Execution, WMS Inventory Logistics) was explicitly deferred by the user until Phase 2.
- **Resolution Plan**: Phase 2 Domain Expansion will execute end-to-end integration benchmarks on complex operational datasets.

### ANTIGRAVITY_HOST_HOOK_INTEGRATION = NOT_VERIFIED
- **Status**: **NOT_VERIFIED**
- **Description**: Antigravity lifecycle hooks (`hooks.json` and `.agents/hooks/`) are structurally verified, syntactically valid, and pass all static mock execution tests (`HOOK_SCRIPT_RUNTIME = VERIFIED`, `HOOK_STATIC_CONFIG = VERIFIED`). However, runtime invocation triggered by a live host Antigravity IDE instance is not yet verified in a live desktop session.
- **Resolution Plan**: Validate in live Antigravity IDE operator test harness prior to general public release.

---

## 2. Environment & Toolchain Qualification Matrix

### OPERATING_SYSTEM_MATRIX
- **Windows (x64)**: Fully qualified locally and on GitHub Actions (`windows-latest`).
- **Linux (Ubuntu 22.04 / 24.04)**: Fully qualified in GitHub Actions CI matrix across Node 20.x, Node 22.x, .NET 8.0 SDK, and PHP 8.3.
- **macOS (Sonoma / Sequoia)**: Verified via GitHub Actions CI matrix (`macos-latest`) for core TypeScript compilation, test execution, and packaging. Native desktop GUI application testing on macOS is not qualified.

### LARAVEL_FRAMEWORK_BOOT
- **Status**: **VERIFIED_CI_ONLY**
- **Description**: The generated `LARAVEL_BLADE` project contains a real Laravel 11 framework entrypoint requiring `vendor/autoload.php`. On local developer hosts without Composer CLI, the test harness verifies PHP syntax (`php -l`) and executes the negative bootstrap guard (proving `artisan` safely fails closed when vendor dependencies are absent). Full `composer update` and `php artisan --version` (verifying real `Illuminate\Foundation\Application` boot) are qualified in CI Job B.

### .NET 8 EXACT SDK COMPATIBILITY
- **Status**: **VERIFIED_CI_ONLY**
- **Description**: The generated `ASPNET_RAZOR` project targets `net8.0` with `global.json` pinning `8.0.406` (`rollForward: latestMajor`). On developer hosts equipped with .NET 9+ SDK (e.g., .NET 9.0.314), the project compiles and builds cleanly under forward-compatibility mode (`DOTNET_8_TARGET_ON_NET9 = VERIFIED`). Exact .NET 8.0 SDK execution (`DOTNET_8_EXACT_MATCH = VERIFIED`) is qualified in GitHub Actions CI Job B (`dotnet-version: '8.0.x'`).

### DOCKER_BUILD_BENCHMARK
- **Status**: **VERIFIED_LOCAL**
- **Description**: Docker containerization profiles and Compose multi-container specifications are verified locally. GitHub Actions matrix jobs run containerless without Docker-in-Docker daemons.

---

## 3. Scope & Non-Goals for v1.0

- **No Domain Packs**: APS, MES, and WMS domain-specific deep inference packs belong to Phase 2 and are not included in v1.0.
- **No Automatic Public Releases**: Distribution packaging (`scripts/package-distribution.js`) prepares release candidate artifacts in `dist-release/`. Public GitHub Releases or git tags strictly require explicit user approval.
