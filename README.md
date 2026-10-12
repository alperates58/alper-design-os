# ALPER DESIGN OS

> **"Arayüzü tasarlamadan önce ürünü, alanı ve operasyonel bağlamı anla."**

[![License: MIT](https://img.shields.io/badge/Lisans-MIT-blue.svg)](LICENSE_POLICY.md)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![Antigravity Plugin Ready](https://img.shields.io/badge/Antigravity-Native%20Plugin-emerald.svg)](plugin.json)
[![Tests: 326 Passed](https://img.shields.io/badge/Tests-326%20Passed%20(16%20Suites)-brightgreen.svg)](tests/)
[![MCP Server: 88 Tools](https://img.shields.io/badge/MCP%20Server-88%20Tools-purple.svg)](packages/mcp-server/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](scripts/)

**ALPER DESIGN OS**, sıradan bir arayüz bileşen kütüphanesi değildir. Yazılım alanlarını (domain) derinlemesine anlayan, kullanıcı iş akışlarını ve ergonomisini analiz eden, kurumsal seviyede mimari ve UX/UI kararları alan, sıfırdan ürün tasarlayan veya mevcut devasa sistemleri cerrahi/aşamalı olarak modernize eden **AI-Native, Teknoloji Bağımsız Tasarım ve UX Geliştirme İşletim Sistemi**'dir.

---

## 🌟 Temel Mimarî Sütunlar

1. **Teknoloji Bağımsız Tasarım (Technology Agnostic):**
   Tasarım tokenları, grid modelleri, erişilebilirlik ve UX desenleri framework kodundan tamamen ayrıştırılmıştır. Sözleşme tabanlı **Adaptör Mimarisi** ile tek bir mimari mantıktan 8 farklı teknolojiye derleme yapılır:
   * **HTML5 / CSS3 / ES6+ JavaScript**
   * **TypeScript**
   * **React (JSX)**
   * **React + TypeScript (Strict)**
   * **PHP (Native View/Template)**
   * **Laravel / Blade**
   * **ASP.NET Core / Razor Pages & Blazor**
   * **Generic Web (Vanilla Standartları)**

2. **Domain Intelligence (Alan İstihbaratı İlk İlkedir):**
   Asla körlemesine UI üretilmez. Ürünün alanı (APS Üretim Planlama, WMS Depo, Finans, Hastane vb.), operatör personelleri, bilgi yoğunluğu (Information Density) ve kritik iş akışları analiz edilerek tip güvenli bir `ProductUXProfile` oluşturulur.

3. **Üç Farklı Çalışma Modu:**
   * `NEW`: Alan istihbaratı ve operatör ergonomisi odaklı yeşil alan (greenfield) tasarımı.
   * `REPAIR`: Mevcut teknoloji ve tasarım dilini koruyarak yapılan cerrahi onarım.
   * `MODERNIZE`: Eski sistemleri bozmadan, 4 aşamalı aşamalı geçişle modern tasarım tokenlarına ve erişilebilir gridlere dönüştürme.

4. **Kanonik Tasarım Dili & UI Blueprint DSL:**
   Kullanıcı arayüzünü deklaratif JSON formatında tanımlayan `UI Blueprint DSL` ile tasarımlar modellenir; tek bir blueprint'ten farklı framework adaptörlerinde semantik eşdeğerlik (**Cross-Stack Parity**) garanti edilir.

5. **Gerçekçi UI Politikası & Veri Kaynağı Kanıtı (Truthful UI & Data Provenance):**
   Gerçek olmayan sahte telemetri, uydurma KPI veya kaynaksız metriklerin gösterilmesi engellenir. Veriler `PROVENANCE_SOURCE` (`AUTHORITATIVE`, `DERIVED`, `MOCK_SYNTHETIC`) seviyelerine göre açıkça etiketlenir ve `CONTENT_TRUTH_PASS` kapısı ile denetlenir.

6. **Operatör Destekli Çalışma (Operator-Assisted Execution):**
   Kurumsal güvenlik yazılımlarının (EDR/Xcitium) kısıtladığı ortamlarda agent-çocuk süreçlerini zorlamak yerine, güvenli `HUMAN_OPERATOR_EXECUTION` mimarisiyle PowerShell bundle'ları (`RUN.ps1`) üretir ve toplanan kanıtları matematiksel kesinlikle doğrular (`verifiedBy: ALPER_DESIGN_OS`).

7. **Akıllı Tarayıcı Çözümleyicisi (Browser Fallback Chain):**
   Kurumsal güvenlik politikalarının managed Chromium indirmelerini engellediği durumlarda otomatik olarak işletim sisteminde kurulu **Microsoft Edge** (`msedge`) veya Chrome'a düşer; Playwright E2E testlerini sıfır kesintiyle çalıştırır.

8. **Ajan Yönetişimi & Değişiklik Güvenliği (Agent Governance):**
   17 adımlı sıkı yaşam döngüsü, `AgentActionPlan`, etki alanı (blast radius) değerlendirmesi, yıkıcı komut koruması, bağımsız gözden geçirici kapısı ve kanıt temelli doğrulama.

9. **Model Context Protocol (MCP) Sunucusu:**
   Antigravity, Cursor, Claude Desktop ve VS Code ile entegre, **88 adet tip güvenli araç** barındıran resmi TypeScript MCP sunucusu.

---

## 📁 Proje Dizin Yapısı

```text
alper-design-os/
├── plugin.json                 # Antigravity Plugin Tanımı (38 Yetenek/Skill Kayıtlı)
├── mcp_config.json             # MCP Sunucu Konfigürasyonu
├── hooks.json                  # Yaşam Döngüsü Hook'ları
├── pnpm-workspace.yaml         # Monorepo Workspace Konfigürasyonu
│
├── scripts/                    # Otomasyon ve Sistem Sağlık Araçları
│   ├── install-windows.ps1     # Otomatik Windows Kurulum Scripti
│   ├── update.ps1              # Tek Tıkla Git & Derleme Güncelleyici
│   ├── doctor.js               # Çapraz Platform Sağlık ve Tanı Motoru (Adım 1-9)
│   ├── doctor.ps1              # PowerShell Sistem Tanı Scripti
│   ├── register-mcp.js         # Antigravity MCP Konfigürasyon Kaydedici
│   └── operator-runtime-check.js # Operatör Çalışma Zamanı Kanıt Toplayıcı
│
├── design-core/                # Teknoloji Bağımsız Tasarım Çekirdeği
│   ├── src/domain/             # 15 Alan Benchmark'ı & ProductUXProfile
│   ├── src/tokens/             # DTCG Tokenları (Style Dictionary Uyumlu)
│   ├── src/layout/             # Multi-Pane Workbench & DataGrid Layoutları
│   └── src/ux-patterns/        # 28 Kanonik UX Deseni (Gantt, SplitPane vb.)
│
├── adapters/                   # Framework Adaptörleri (Sözleşme Tabanlı)
│   ├── contract/               # Ortak AdapterContract & BaseAdapter
│   ├── html-css-js/            # Semantik HTML5 + CSS3 + ES6 JS
│   ├── react/                  # React (JSX)
│   ├── react-typescript/       # React + Strict TypeScript
│   ├── php/                    # Native PHP Şablonları
│   ├── laravel-blade/          # Laravel Blade + Alpine.js
│   └── aspnet-razor/           # ASP.NET Core Razor Pages & Blazor
│
├── packages/
│   ├── analyzer/               # Kod ve Stack Algılama, UI/A11y Statik Denetleyici
│   ├── agent-governance/       # 17 Adım Yaşam Döngüsü, Operatör Paketi, Truthful UI
│   ├── design-language/        # Kanonik Tasarım Dili, UI Blueprint DSL, Cross-Stack Render
│   ├── source-intelligence/    # 65+ Tasarım Sistemi, Registry Keşfi ve Skorlama
│   ├── engineering-guardrails/ # Kalite Profilleri, STRIDE Tehdit Modeli, Güvenli Tarama
│   ├── qa-engine/              # Playwright, DevTools, Görsel Regresyon, QA Raporlayıcı
│   ├── software-intelligence/  # Mimari Stil Tespiti, DB Migrasyon Riski, ADR Üretimi
│   └── mcp-server/             # 88 Tipli Araç İçeren Resmi MCP Sunucusu
│
├── tests/                      # 16 Test Süiti, 326 Otomatik Vitest Testi
│   ├── domain-benchmark-15.test.ts
│   ├── design-language.test.ts
│   ├── truthful-ui-governance.test.ts
│   ├── operator-assisted-execution.test.ts
│   ├── mcp-server.test.ts
│   └── ...
│
└── docs/                       # Mimari & Kullanım Dokümantasyonu
    ├── operator-assisted-execution.md
    ├── truthful-ui-policy.md
    ├── canonical-design-language.md
    └── product-ux-profile.md
```

---

## 🚀 Kurulum (Adım Adım)

Proje tamamen taşınabilir (portable) olarak tasarlanmıştır. Hiçbir yerde sabit kullanıcı adı veya işletim sistemine bağımlı mutlak yol bulunmaz.

### 1. Ön Koşullar
* **İşletim Sistemi:** Windows 10/11, macOS veya Linux
* **Node.js:** `v20.x` veya `v24.x LTS` ([nodejs.org](https://nodejs.org/))
* **Git:** [git-scm.com](https://git-scm.com/)
* *(İsteğe Bağlı)* Docker Desktop & Microsoft Edge (Playwright E2E testleri için)

### 2. Projeyi Klonlayın
```bash
git clone https://github.com/alperates58/alper-design-os.git
cd alper-design-os
```

### 3. Bağımlılıkları Yükleyin ve Derleyin
```bash
npm install
npm run build
```
*(Bu komut 19 monorepo paketini sırayla TypeScript ile derler ve `dist/` klasörlerini oluşturur).*

### 4. MCP Sunucusunu IDE / Asistanınıza Kaydedin
Antigravity veya MCP destekli araçlarınıza tek komutla bağlayın:
```bash
node scripts/register-mcp.js
```
*(Windows kullanıcıları alternatif olarak `.\scripts\install-windows.ps1` dosyasını da çalıştırabilir).*

### 5. Sistem Sağlık Taraması (Doctor)
Tüm bileşenlerin, derleme çıktılarının ve araçların eksiksiz olduğunu doğrulamak için:
```bash
npm run doctor
```

### 6. Tüm Testleri Çalıştırın
```bash
npm test
```
Tüm 16 test dosyasında **326 testin tamamının eksiksiz geçtiğini** görmelisiniz.

---

## 🛠️ MCP Sunucusu & 88 Güçlü Araç

`alper-design-os` MCP sunucusu 10 temel kategoride **88 adet tip güvenli araç** sunar:

| Kategori | Araç Sayısı | Öne Çıkan Araçlar |
| :--- | :---: | :--- |
| **Ürün & Alan Analizi** | 4 | `understand_product`, `research_domain`, `recommend_ux_patterns`, `search_design_patterns` |
| **Tasarım Token & Blueprint** | 9 | `get_design_tokens`, `create_page_blueprint`, `create_component_blueprint`, `create_app_shell_blueprint`, `render_blueprint`, `render_component`, `compare_renderer_parity` |
| **Statik UI & Modernizasyon** | 5 | `analyze_project`, `detect_stack`, `audit_existing_ui`, `audit_accessibility`, `recommend_modernization` |
| **Kaynak & Registry İstihbaratı** | 20 | `discover_design_sources`, `search_patterns`, `search_registries`, `recommend_chart_library`, `recommend_data_grid`, `explain_source_recommendation` |
| **Mühendislik & Güvenlik** | 7 | `generate_engineering_policy`, `evaluate_release_gates`, `generate_threat_model`, `detect_tool_capabilities`, `run_safe_security_scan` |
| **QA, Test & Playwright** | 4 | `generate_user_journeys`, `generate_playwright_test`, `generate_qa_report`, `generate_test_pyramid` |
| **Yazılım & Veritabanı Mimarisi** | 5 | `analyze_architecture`, `generate_adr`, `analyze_database_schema`, `evaluate_api_compatibility`, `classify_code_paths` |
| **Ajan Yönetişimi (Governance)** | 14 | `create_action_plan`, `evaluate_scope`, `evaluate_change_risk`, `create_checkpoint_plan`, `create_verification_plan`, `review_change`, `detect_regression` |
| **Truthful UI & Kanıt Şeffaflığı** | 6 | `evaluate_truthful_ui`, `audit_data_provenance`, `evaluate_page_intent`, `audit_information_relevance`, `classify_source_authority`, `manage_human_visual_approval` |
| **Operatör Yürütme Motoru** | 4 | `create_manual_run_bundle`, `verify_manual_run_evidence`, `resolve_browser_runtime`, `run_operator_doctor` |

---

## 💬 Örnek Promptlar (Kullanım Rehberi)

Aşağıdaki hazır promptları Antigravity, Cursor veya Claude arayüzünde doğrudan kullanabilirsiniz:

### 1. Yeni Ürün & Alan Analizi (NEW Modu)
```text
Yeni bir Endüstriyel Üretim Planlama Sistemi (APS - Advanced Planning & Scheduling) geliştiriyoruz.
Operatörler fabrika sahasındaki 40 tezgahın iş sıralamasını ve darboğazlarını saniyelik takip ediyor.
Lütfen 'understand_product' ve 'research_domain' araçlarını kullanarak:
1. Alan sınıflandırmasını ve bilgi yoğunluğunu (information density) belirle.
2. Bu operatörler için en uygun UX desenlerini (Gantt, Split Pane, Dense DataGrid) seç.
3. React + TypeScript ve Tailwind için UI Blueprint DSL tanımını üret.
```

### 2. Eski Kod Tabanını Aşamalı Modernleştirme (MODERNIZE Modu)
```text
Elimizde 2014 yılından kalma native PHP ve spaghetti jQuery ile yazılmış bir Müşteri Sipariş Yönetim ekranı var.
'recommend_modernization' ve 'audit_existing_ui' araçlarını çalıştırarak:
1. Mevcut ekranı bozmadan 4 aşamalı (Tokenization -> Layout Isolation -> Component Replacement -> Full Decoupling) geçiş planı hazırla.
2. Form girdilerini ve tabloları DTCG uyumlu CSS değişkenleriyle eşleştir.
3. Laravel Blade veya React TypeScript adaptörüne güvenli geçiş yol haritasını çıkar.
```

### 3. Cerrahi Arayüz Onarımı (REPAIR Modu)
```text
Mevcut projemizde mobil kırılma noktalarında (390px) veri tablomuz taşıyor ve form butonları ekran dışına kayıyor.
'audit_responsive' ve 'audit_accessibility' araçlarını kullanarak:
1. Yatay taşma (layout overflow) ve WCAG kontrast açıklarını tespit et.
2. Projenin mevcut CSS/Tailwind yapısını bozmadan cerrahi bir düzeltme öner.
3. Düzeltmenin yan etkilerini kontrol etmek için 'evaluate_scope' çalıştır.
```

### 4. Gerçekçi UI & Sahte Veri Tespiti (Truthful UI Audit)
```text
Projemizdeki lojistik takip panelinde gösterilen sıcaklık ve yakıt grafikleri gerçek sensör verisi mi yoksa uydurma random sayılar mı?
'audit_data_provenance' ve 'evaluate_truthful_ui' araçlarını kullanarak:
1. Tüm veri kaynaklarını (Authoritative, Derived, Mock Synthetic) sınıflandır.
2. Canlı donanım bağlantısı olmayan metrikleri 'SIMULATED_ESTIMATE' olarak açıkça etiketle.
3. 'CONTENT_TRUTH_PASS' onay kapısını çalıştırarak sahte telemetriyi engelle.
```

### 5. Veritabanı & Mimari Değişiklik Risk Denetimi
```text
Kullanıcı tablosuna 10 milyon kayıt içeren bir sistemde 'last_login_ip' kolonu eklemek ve indekslemek istiyoruz.
'analyze_database_schema' ve 'evaluate_change_risk' araçlarını kullanarak:
1. Bu DDL işleminin kilitlenme (table-lock) riskini ve geriye dönük uyumluluğunu değerlendir.
2. Sıfır kesinti (Zero-Downtime Expand/Contract) migrasyon stratejisi için ADR oluştur.
```

### 6. Operatör Destekli Güvenli Çalıştırma (HUMAN_OPERATOR_EXECUTION)
```text
Kurumsal bilgisayarda güvenlik kısıtlamaları nedeniyle doğrudan child-process çalıştıramıyoruz.
Lütfen 'create_manual_run_bundle' aracını kullanarak bir runtime doğrulama paketi hazırla:
- Bana çalıştırmam gereken tek '.\.alper-design-os\manual-runs\<run-id>\RUN.ps1' komutunu ver.
- Ben PowerShell'de çalıştırdıktan sonra 'verify_manual_run_evidence' ile toplanan gerçek Docker, Playwright Edge ve test kanıtlarını doğrula.
```

---

## 🔒 Güvenlik & Doğruluk Taahhüdü

* **Sıfır Sahte Doğrulama (No Fake Pass):** Gerçek bir tarayıcı veya container üzerinde test edilmeyen hiçbir özellik geçerli ("PASS") kabul edilmez; açıkça `UNVERIFIED` veya `DEFERRED` olarak etiketlenir.
* **Gizlilik ve Sır Maskeleme (Zero Secret Leak):** API anahtarları, JWT tokenlar, DB parolaları ve kurumsal veriler loglarda, testlerde ve commitlerde otomatik olarak `[REDACTED_*]` ile maskelenir.
* **Kurumsal Uyumluluk (No Security Bypass):** Hiçbir güvenlik servisini devre dışı bırakmaz, antivirüs/EDR bypass etmez veya yetki yükseltme (privilege escalation) yapmaz.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE_POLICY.md) ile lisanslanmıştır.
© 2026 Alper Ateş. Tüm hakları saklıdır.
