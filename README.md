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
4. **Antigravity Native Plugin**: Ships complete with `skills/`, `agents/`, `rules/`, `mcp_config.json`, and an official 15-tool TypeScript MCP server.
5. **DTCG Design Tokens**: 100% compliant with the Design Tokens Community Group specification, compile-ready for Style Dictionary.

---

## Directory Structure

```text
alper-design-os/
├── plugin.json                 # Antigravity Plugin Manifest
├── mcp_config.json             # Local MCP Server Registration
├── hooks.json                  # Antigravity Lifecycle Hooks
├── pnpm-workspace.yaml         # Monorepo Workspace Configuration
│
├── scripts/                    # Portable Automation & Health Scripts
│   ├── install-windows.ps1     # Portable Windows Installer
│   ├── update.ps1              # One-Click Git & Build Updater
│   └── doctor.ps1              # System Diagnostics & Verification
│
├── skills/                     # Antigravity Skills
│   ├── alper-design-new/       # Greenfield Product Design Workflow
│   ├── alper-design-repair/    # Surgical UX/UI Repair Workflow
│   ├── alper-design-modernize/ # 4-Phase Legacy Modernization Workflow
│   └── alper-domain-intelligence/ # Domain & Workflow Extraction
│
├── agents/                     # Antigravity Specialized Agents
│   ├── ux-architect.md         # Layouts, Density, and System Architecture
│   ├── design-token-specialist.md # DTCG Tokens & Style Dictionary
│   ├── legacy-modernizer.md    # Phased Enterprise Modernization
│   └── domain-researcher.md    # Operational Workflows & Persona Research
│
├── rules/                      # Antigravity Always-On Rules
│   └── AGENTS.md               # Core Tenets & Safety Rules
│
├── design-core/                # Technology-Agnostic Design Engine
│   ├── src/domain/             # Domain Intelligence & ProductUXProfile Schema
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
├── registry/                   # Adapter Factory & Auto-Detection Registry
│
├── sources/                    # Discovery & Index Catalogs
│   ├── schema.ts               # Normalized Catalog Schema
│   ├── apis/                   # Public APIs Discovery Index
│   └── mcp/                    # Awesome MCP Servers Discovery Index
│
├── packages/
│   ├── analyzer/               # Read-Only Stack Detector & UI/A11y Auditor
│   └── mcp-server/             # TypeScript MCP Server with 15 Typed Tools
│
├── tests/                      # Automated Vitest Suite
│   ├── fixtures/aps/           # Industrial APS Manufacturing Test Fixture
│   ├── domain-intelligence.test.ts
│   ├── project-analyzer.test.ts
│   ├── adapters.test.ts
│   ├── design-tokens.test.ts
│   ├── sources-catalog.test.ts
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
PowerShell'i açın ve kurulum script'ini çalıştırın:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows.ps1
```

Bu script otomatik olarak:
1. `ALPER_DESIGN_OS_HOME` kullanıcı ortam değişkenini mevcut klasöre ayarlar.
2. Node.js ve Git kontrollerini yapar; gerekiyorsa `pnpm`'i global kurar.
3. `.env.example` dosyasından `.env` dosyasını oluşturur.
4. Monorepo paket bağımlılıklarını (`pnpm install`) kurar.
5. Tüm paketleri ve MCP sunucusunu derler (`pnpm run build`).
6. Test paketini (`pnpm test`) çalıştırır.
7. Antigravity global MCP konfigürasyonunu (`~/.gemini/config/mcp_config.json`) otomatik veya yedekli olarak günceller.

### 4. Sağlık Taraması (Doctor)
Kurulumun eksiksiz olduğunu doğrulamak için:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\doctor.ps1
```

### 5. Güncelleme (Update)
İlerleyen dönemde yeni sürümleri tek komutla çekip derlemek için:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
```

---

## Antigravity Entegrasyonu

Alper Design OS, Antigravity ile hem **Native Plugin** hem de **Local MCP Server** olarak çalışır.

1. **Antigravity Plugin Olarak**:
   Proje kökündeki `plugin.json`, Antigravity tarafından doğrudan bir plugin bundle olarak tanınır. Skills, agents ve rules otomatik olarak etkinleşir.

2. **MCP Sunucusu Olarak**:
   `mcp_config.json` içinde tanımlı MCP sunucusu, Antigravity'ye 15 güçlü araç sağlar:
   - `analyze_project` & `detect_stack`: Proje yığınını ve mevcut durumunu analiz eder.
   - `understand_product` & `research_domain`: Domain Intelligence çalıştırarak `ProductUXProfile` üretir.
   - `recommend_ux_patterns` & `search_design_patterns`: Yüksek veri yoğunluğu ve etkileşim stiline uygun pattern'ler önerir.
   - `get_design_tokens`: DTCG uyumlu token'ları CSS, SCSS, TS veya Tailwind formatında derler.
   - `create_design_plan`: Güvenli, read-only plan üretir (Analiz → Plan → Uygulama).
   - `audit_existing_ui`, `audit_accessibility`, `audit_responsive`: Mevcut UI/a11y/responsive sorunlarını denetler.
   - `recommend_modernization`: Aşamalı modernizasyon yol haritası sunar.
   - `search_public_apis` & `search_mcp_servers`: API ve MCP kataloglarında arama yapar.

---

## Test & Doğrulama

Vitest ile test paketini çalıştırmak için:
```powershell
pnpm test
```

Test kapsamı:
- **APS Domain Test Fixture**: İmalat çizelgeleme (APS) domain'inin tam analizi (finite capacity, planner persona, Gantt, bottleneck, what-if, split-pane vb.).
- **Adapters**: 7 adapter'ın kontrat uyumluluğu.
- **DTCG Tokens**: Token formatının ve derleyicinin doğrulanması.
- **Analyzer & Auditor**: Stack tespiti, UI ve a11y denetimleri.
- **Catalogs**: API ve MCP discovery katalog şemalarının doğrulanması.
- **MCP Server**: 15 MCP aracının sözleşme testleri.

---

## Lisans & Gizlilik
- Kod tabanı **MIT Lisansı** altındadır.
- API anahtarları veya kişisel sırlar repository'ye commit edilmez (`.gitignore` korumalıdır).
