# ALPER DESIGN OS

> **"Understand the product before designing the interface."**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE_POLICY.md)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![Antigravity Plugin Ready](https://img.shields.io/badge/Antigravity-Native%20Plugin-emerald.svg)](plugin.json)

ALPER DESIGN OS is not just a UI component library. It is an AI-native, technology-agnostic Design & UX Development Operating System designed to understand software domains, analyze user workflows and operational context, make world-class UX/UI architecture decisions, design new projects, and modernize legacy enterprise applications.

---

## Core Pillars

1. **Technology Agnostic**: Decouples design tokens, layout paradigms, UX patterns, and domain intelligence from framework code through a unified **Adapter Architecture** supporting:
   - HTML / CSS / JavaScript
   - JavaScript
   - TypeScript
   - React
   - React + TypeScript
   - PHP
   - Laravel / Blade
   - ASP.NET / Razor
2. **Domain Intelligence First**: Never creates UI code blindly. Analyzes domain classification, operator personas, information density, interaction styles, and critical workflows to generate a typed `ProductUXProfile`.
3. **Three Operating Modes**:
   - `NEW`: Greenfield architecture from domain understanding and user ergonomics.
   - `REPAIR`: Surgical remediation preserving existing tech stack and styling.
   - `MODERNIZE`: Staged, non-destructive 4-phase modernization from legacy code to modern design tokens and accessible grids.
4. **Engineering Guardrails Layer**: Technology-agnostic quality profiles, STRIDE threat models, stack-aware security policies (TS/JS, PHP, Laravel, ASP.NET), and strict release gates (blocking on CRITICAL/HIGH vulnerabilities, secret leaks, and exploitable dependencies).
5. **Browser, QA & Verification Engine**: Official Chrome DevTools MCP & Microsoft Playwright MCP integration with role separation, resilient accessible-role locators, runtime console/network failure inspection, visual regression with human review gates, and transparent QA reporting.
6. **Software Engineering Intelligence Layer**: Architecture style detection (11 styles), ADR generation, database migration safety (SAFE/REVIEW/DANGEROUS), N+1 query loop detection, OpenTelemetry observability with PII scrubbing, and OpenAPI/AsyncAPI breaking change evaluation.
7. **Antigravity Native Plugin**: Ships complete with 38 `skills/`, `agents/`, `rules/`, `mcp_config.json`, and an official 29-tool TypeScript MCP server.
8. **DTCG Design Tokens**: 100% compliant with the Design Tokens Community Group specification, compile-ready for Style Dictionary.

---

## Directory Structure

```text
alper-design-os/
├── plugin.json                 # Antigravity Plugin Manifest (38 Skills Registered)
├── mcp_config.json             # Local MCP Server Registration
├── hooks.json                  # Antigravity Lifecycle Hooks
├── pnpm-workspace.yaml         # Monorepo Workspace Configuration
│
├── scripts/                    # Portable Automation & Health Scripts
│   ├── install-windows.ps1     # Portable Windows Installer (alper + chrome-devtools + playwright)
│   ├── update.ps1              # One-Click Git & Build Updater
│   ├── doctor.ps1              # PowerShell System Diagnostics & Verification
│   ├── doctor.js               # Node.js Cross-Platform Health Check
│   └── register-mcp.js         # Cross-Platform MCP Server Registration
│
├── skills/                     # 38 Antigravity Skills
│   ├── alper-design-new/       # Greenfield Product Design Workflow
│   ├── alper-design-repair/    # Surgical UX/UI Repair Workflow
│   ├── alper-design-modernize/ # 4-Phase Legacy Modernization Workflow
│   ├── alper-domain-intelligence/ # Domain & Workflow Extraction
│   ├── alper-secure-coding/    # OWASP ASVS & Top 10 Secure Coding
│   ├── alper-security-audit/   # Passive Vulnerability Audit & Gates
│   ├── alper-api-security/     # OWASP API Security Top 10
│   ├── alper-ai-coding-safety/ # AI Coding Hallucination & Supply Chain Defense
│   ├── alper-code-quality/     # Typed Linting & Complexity Controls
│   ├── alper-performance-engineering/ # Core Web Vitals & Budgets
│   ├── alper-reliability/      # SLI/SLO & Circuit Breakers
│   ├── alper-supply-chain-security/   # NIST SSDF, SLSA & CycloneDX SBOM
│   ├── alper-dependency-hygiene/      # CVE Audits & Lockfile Hygiene
│   ├── alper-secret-management/       # Zero-Tolerance Secret Leak Scanning
│   ├── alper-testing-strategy/ # Test Pyramid Synthesis
│   ├── alper-observability/    # OpenTelemetry Traces, Metrics & PII Scrubbing
│   ├── alper-browser-qa/       # Master Browser QA Orchestration
│   ├── alper-playwright-testing/ # Role-Based Playwright E2E Tests
│   ├── alper-runtime-debugging/ # Chrome DevTools Runtime Exception & Network Debugging
│   ├── alper-visual-regression/ # Multi-Viewport & Theme Visual Diffing
│   ├── alper-accessibility-testing/ # axe-core & Keyboard Operability Audits
│   ├── alper-performance-testing/ # Lighthouse & Trace Bottleneck Profiling
│   ├── alper-api-testing/      # Contract, Schema & Negative Testing
│   ├── alper-contract-testing/ # Pact Consumer-Driven Contracts
│   ├── alper-load-testing/     # Grafana k6 Throughput & Stress Testing
│   ├── alper-regression-testing/ # Targeted Funnel Smoke & Regression Suites
│   ├── alper-cross-browser-testing/ # Chromium, Firefox, WebKit & Mobile
│   ├── alper-architecture/     # Style Discovery & Subsystem Boundaries
│   ├── alper-architecture-audit/ # Coupling & Circular Dependency Detection
│   ├── alper-refactoring-strategy/ # Strangler Fig & Branch-by-Abstraction
│   ├── alper-database-engineering/ # Schema Design & Connection Pools
│   ├── alper-sql-performance/  # N+1 Query & Keyset Pagination Diagnostics
│   ├── alper-migration-safety/ # Expand/Contract & DDL Risk Analysis
│   ├── alper-data-integrity/   # ACID & Idempotency Key Governance
│   ├── alper-api-architecture/ # OpenAPI/AsyncAPI & Breaking Changes
│   ├── alper-resilience/       # Bulkheads & Graceful Degradation
│   ├── alper-release-safety/   # OpenFeature Flags & Zero-Downtime Rollouts
│   └── alper-dependency-lifecycle/ # Renovate & Dependency Governance
│
├── design-core/                # Technology-Agnostic Design Engine
│   ├── src/domain/             # 15 Domain Benchmarks & ProductUXProfile Engine
│   ├── src/tokens/             # DTCG Tokens & Style Dictionary Compiler
│   ├── src/layout/             # Multi-Pane Workbench & DataGrid Layouts
│   ├── src/ux-patterns/        # Core UX Patterns (Gantt, DataGrid, SplitPane, etc.)
│   ├── src/interactions/       # Keyboard Shortcuts & Navigation Ergonomics
│   └── src/accessibility/      # WCAG 2.1 AA/AAA Rules & Screen Reader Specs
│
├── adapters/                   # Stack Adapters (Contract-Driven)
│   ├── contract/               # Common AdapterContract & BaseAdapter Class
│   ├── generic-web/            # Web Standards (Vanilla HTML5, CSS Variables)
│   ├── html-css-js/            # Semantic HTML5 + CSS3 + ES6 JS
│   ├── react/                  # React (JavaScript / JSX)
│   ├── react-typescript/       # React + TypeScript (Strict Mode)
│   ├── php/                    # Native PHP Views & Templates
│   ├── laravel-blade/          # Laravel Blade Components & Alpine.js
│   └── aspnet-razor/           # ASP.NET Core Razor Pages & Blazor
│
├── packages/
│   ├── analyzer/               # Read-Only Stack Detector & UI/A11y Auditor
│   ├── source-intelligence/    # 48 Authoritative Sources & Multi-Criteria Ranking
│   ├── engineering-guardrails/ # Quality Profiles, Threat Models & Safe Scanner
│   ├── qa-engine/              # Playwright, DevTools, Visual Diff & QA Reporter
│   ├── software-intelligence/  # Architecture, Database, Observability & API Governance
│   └── mcp-server/             # TypeScript MCP Server with 29 Typed Tools
│
├── tests/                      # Automated Vitest Suite (130+ Tests across 11 Suites)
│   ├── fixtures/domains/       # 15 Domain Benchmarks (APS, CRM, Hospital, PMS, POS, WMS, Fintech, etc.)
│   ├── domain-benchmark-15.test.ts
│   ├── source-intelligence.test.ts
│   ├── engineering-guardrails.test.ts
│   ├── qa-engine.test.ts
│   ├── software-intelligence.test.ts
│   └── mcp-server.test.ts
│
└── docs/                       # Architectural Documentation
    ├── product-ux-profile.md   # Schema Specification & Theory
    ├── adapter-contract.md     # Extension Guide for New Frameworks
    └── mcp-tools.md            # MCP Tool Schemas & Input/Output Contracts
```

---

## Second PC Installation (İkinci Bilgisayara Kurulum)

Kurulum tamamen taşınabilir (portable) olarak tasarlanmıştır. Hiçbir script içinde kullanıcı adı veya sabit absolute path bulunmaz. `ALPER_DESIGN_OS_HOME` ortam değişkeni dinamik olarak çözülür.

### 1. Ön Koşullar
- **Windows 10 / 11**
- **Node.js (v20 veya v24 LTS)**: [nodejs.org](https://nodejs.org/)
- **Git for Windows**: [git-scm.com](https://git-scm.com/)

### 2. Projeyi Klonlayın
```powershell
cd $env:USERPROFILE\Desktop
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
```

### 3. Tek Komutla Otomatik Kurulum
PowerShell veya terminalinizi açıp kurulumu tamamlayın:
```bash
npm run build && node scripts/register-mcp.js
```
Veya PowerShell kullanıcıları için:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows.ps1
```

Bu script otomatik olarak:
1. `ALPER_DESIGN_OS_HOME` kullanıcı ortam değişkenini mevcut klasöre ayarlar.
2. Node.js ve Git kontrollerini yapar; bağımlılıkları derler.
3. `.env.example` dosyasından `.env` dosyasını oluşturur.
4. Monorepo paket bağımlılıklarını kurar ve tüm TypeScript paketlerini derler (`npm run build`).
5. Antigravity global MCP konfigürasyonunu (`~/.gemini/config/mcp_config.json`) otomatik olarak günceller ve 3 sunucuyu kaydeder:
   - `alper-design-os` (29 typed tool içeren yerel mimari ve UX sunucusu)
   - `chrome-devtools` (`chrome-devtools-mcp@latest`)
   - `playwright` (`@playwright/mcp@latest`)

### 4. Sağlık Taraması (Doctor)
Kurulumun eksiksiz olduğunu doğrulamak için:
```bash
npm run doctor
```

---

## Doğrulama & Test

Vitest ile monorepo genelindeki 133+ testi çalıştırmak için:
```bash
npm run test
```

Test kapsamı:
- **15 Domain Benchmark**: APS, CRM, Hospital, Hotel PMS, Restaurant POS, Warehouse WMS, Banking, Streaming, E-commerce, School Management, Fleet Logistics, Legal Case Management, Accounting, Cybersecurity Dashboard, IoT Monitoring.
- **Source Intelligence**: 48 yetkili kaynak (OWASP, NIST, CWE, OpenSSF, Google, Microsoft, PHP-FIG, Laravel, typescript-eslint, PHPStan, OpenTelemetry, CycloneDX, SLSA, Pact, k6 vb.) katalog araması, ağırlıklı skorlama ve lisans denetimi.
- **Engineering Guardrails**: Stack-aware quality profilleri, STRIDE tehdit modelleme, pasif SAST/secret taraması ve release gate blocker kuralları.
- **Browser & QA Engine**: Playwright test üretimi, Chrome DevTools runtime denetimi, görsel regresyon insan onayı ve eksik alanları şeffaf listeleyen `QA_REPORT.md` üretimi.
- **Software Intelligence**: Mimari tip tespiti, ADR oluşturma, veritabanı N+1 tespiti, migrasyon risk sınıflandırması ve OpenAPI breaking change denetimi.
- **MCP Sunucusu**: 29 aracın tamamının tip güvenli sözleşme testleri.

---

## Lisans & Güvenlik İlkeleri
- Kod tabanı **MIT Lisansı** altındadır.
- **Sır Güvenliği**: API anahtarları veya kişisel sırlar repository'ye commit edilmez (`.gitignore` korumalıdır).
- **Tarama Güvenliği**: Aktif güvenlik taramaları (DAST) varsayılan olarak engellidir; yalnızca localhost/staging hedeflerinde ve açık kullanıcı onayı ile çalışabilir.
- **Doğrulama Şeffaflığı**: Test edilmeyen hiçbir akış veya yetenek sahte olarak "PASS" raporlanmaz; QA raporlarında "UNVERIFIED" olarak açıkça listelenir.

