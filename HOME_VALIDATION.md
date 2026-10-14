# EV BİLGİSAYARI DOĞRULAMA KILAVUZU (HOME_VALIDATION.md)

Bu doküman, şirket bilgisayarında (Docker ve canlı pilot servisleri bulunmayan ortamda) tamamlanan **FAZ 1E.7** mimari geliştirmelerinin ardından, **EV BİLGİSAYARINDA** (Docker Desktop, Playwright ve canlı container ortamı bulunan makinede) çalıştırılacak çalışma zamanı ve görsel doğrulama adımlarını içerir.

Şirket ortamında statik olarak doğrulanmış ve runtime aşaması **`DEFERRED_HOME_RUNTIME_VALIDATION`** olarak işaretlenmiş tüm maddeler burada test edilmelidir.

---

## 1. Ev Bilgisayarı Ön Koşul Kontrolleri

Ev bilgisayarında terminali açıp aşağıdaki servislerin ayakta olduğunu doğrulayın:

```bash
# 1. Docker Desktop çalışıyor mu?
docker info

# 2. Port çakışması ve Track Trace Direction B servisleri (43100 / 43101)
# Port 3000 yasağının devam ettiğini, yalnızca 127.0.0.1 üzerinde 42100-43101 aralığının kullanıldığını teyit edin.
netstat -ano | grep 43100
netstat -ano | grep 43101
```

---

## 2. Depo Güncelleme ve Bağımlılık Senkronizasyonu

```bash
cd ~/path/to/alper-design-os
git pull origin main
pnpm install
```

---

## 3. Çalıştırılacak Doğrulama Adımları

### Adım 3.1: Tüm Test Paketini Çalıştırın
Tüm 17 test dosyasının (349 test, 58 modernization engine testi) geçtiğini doğrulayın:
```bash
npm test
```

### Adım 3.2: Track Trace Direction B Container Pilotunu Başlatın
Track Trace pilot container'larını izole köprü ağında ayağa kaldırın:
```bash
docker compose -f docker-compose.benchmark.yml up -d
```
Container sağlık durumunu kontrol edin:
```bash
docker ps --filter "name=alper_benchmark"
```

### Adım 3.3: Canlı Telemetry ve Port Doğrulaması (Ports 43100 / 43101)
Track Trace Direction B telemetry akışlarını ve endpoint'lerini canlı olarak test edin:
```bash
# Telemetry health endpoint
curl -I http://127.0.0.1:43100/api/status
curl -I http://127.0.0.1:43101/api/telemetry/live
```
*Not: `/api/missing-telemetry-endpoint` gibi sahte/kırık endpoint'lerin UI tarafında yakalanıp [SIMULATED] veya hata durumuyla dürüstçe karşılandığını teyit edin.*

### Adım 3.4: Playwright Gerçek Çoklu Viewport Ekran Görüntüleri
Headless veya headed modda 4 ana viewport için gerçek screenshot alın:
```bash
# 390x844 (Mobile), 768x1024 (Tablet), 1440x900 (Desktop), 1920x1080 (Wide)
node benchmarks/runner/browser-benchmark.js
```
Ekran görüntülerinin `benchmarks/artifacts/screenshots/` altına kaydedildiğini ve hiçbir yapay / sahte screenshot üretilmediğini inceleyin.

### Adım 3.5: Chrome DevTools Protocol Canlı İncelemesi
Remote debugging portu açık Chrome oturumu ile network waterfall ve console hata loglarını inceleyin:
```bash
# Chrome DevTools denetimi
node benchmarks/runner/mcp-smoke-test.js
```

### Adım 3.6: Uçtan Uca Benchmark & Clean Room Runner
Docker clean-room ortamında tam benchmark döngüsünü koşturun:
```bash
npm run benchmark
```

---

## 4. İnsan Görsel Onayı (Human Visual Approval Sign-Off)

Ev bilgisayarında gerçek browser ekran görüntüleri incelendikten sonra, İnsan Görsel Onay Kaydı şu kriterlere göre güncellenmelidir:

1. **Layout Stability:** Viewport değişimlerinde yatay taşma (overflow) veya bozulma yok.
2. **Typography Scale:** Metin hiyerarşisi net, kontrast WCAG 2.2 AA (4.5:1) üzerinde.
3. **Truthful UI Semantics:** Hata/uyarı durumlarında yeşil renk kullanılmamış; sentetik mock veriler `[MOCK DATA]` etiketiyle ayrılmış.
4. **Data Provenance:** Canlı göstergeler gerçek backend/telemetry kaynaklarına bağlı.

MCP üzerinden veya doğrudan test/script ile onay kaydetme örneği:
```ts
import { recordVisualReview } from '@alper-design-os/agent-governance';

// Sadece gerçek insan incelemesi sonrasında:
const approval = recordVisualReview(currentRecord, {
  status: 'APPROVED',
  reviewedBy: 'Alper Ates (Lead Designer & Engineer)',
  viewportsReviewed: ['390x844', '768x1024', '1440x900', '1920x1080'],
  notes: 'Ev PC runtime ve görsel doğrulaması başarıyla tamamlandı.',
  criteriaChecked: {
    layoutStability: true,
    typographyHierarchy: true,
    colorContrast: true,
    responsiveFidelity: true,
    truthfulnessVisualAffordance: true
  }
});
```

---

## 5. Özet Tablo: Doğrulama Durum Matrisi

| Doğrulama Maddesi | Şirket PC Durumu | Ev PC Hedef Durumu |
|---|---|---|
| Faz 1E.7 Mimarisi & Kodları | **PASS** | PASS (Entegre) |
| Truthful UI Policy & Engine | **PASS** | PASS (Entegre) |
| Data Provenance Modeli | **PASS** | PASS (Entegre) |
| Page Intent & Relevance Modelleri | **PASS** | PASS (Entegre) |
| Source Authority Classification | **PASS** | PASS (Entegre) |
| Human Visual Approval Gate Kodları | **PASS** | Gerçek İnsan İncelemesi Bekliyor |
| CONTENT_TRUTH_PASS Gate Entegrasyonu | **PASS** | PASS |
| MCP Tool Sözleşmeleri (110 Tool) | **PASS (72 Tests)** | PASS |
| Faz 1F.0 Modernization Engine Foundation | **PASS (20 Tests)** | PASS (Entegre) |
| Faz 1F.0.1 Synthetic End-to-End Drill & Hotfix | **PASS (12 Tests)** | PASS (Entegre) |
| Faz 1F.0.2 Evidence Provenance & Anti-Inflation | **PASS (14 Tests)** | PASS (Entegre) |
| Faz 1F.0.2.1 Evidence Taxonomy & Gate Assurance | **PASS (12 Tests)** | PASS (Entegre) |
| Faz 1G New Project Generation Engine V1 | **PASS (20 Tests, 13 New Tools)** | PASS (Entegre) |
| Greenfield Requirements & Traceability Matrix (RTM) | **PASS (100% Traceability)** | PASS (Entegre) |
| Greenfield Anti-Overengineering Guardrails (No Microservices Default) | **PASS (Complexity <= 3)** | PASS (Entegre) |
| Greenfield Multi-Stack Scaffolding (React, Blade, Razor, Plain) | **PASS (Buildable Emitted Projects)** | PASS (Entegre) |
| Multi-Stack Drill (React, Blade, Razor, Plain-Web) | **PASS (4 Workspaces)** | PASS (Entegre) |
| Native Stack Preservation (Zero Colonization) | **PASS** | PASS (Entegre) |
| Security Invariant Preservation (@csrf / AntiForgery) | **PASS** | PASS (Entegre) |
| Dependency Governance (Zero Creep Across 4 Stacks) | **PASS** | PASS (Entegre) |
| Behavioral Baseline & Regression Guard | **PASS** | PASS (Entegre) |
| Preservation Contract Engine | **PASS** | PASS (Entegre) |
| Change Classification (KEEP/IMPROVE/REPLACE/DEFER/REMOVE) | **PASS** | PASS (Entegre) |
| Modernization Strategy (Bridge first-class, no Big Bang) | **PASS** | PASS (Entegre) |
| Scope Guard & Boundary (Page cannot silently expand to App) | **PASS** | PASS (Entegre) |
| Existing Design System & Duplicate Detection | **PASS** | PASS (Entegre) |
| Dependency Governance (Anti-Creep) | **PASS** | PASS (Entegre) |
| Legacy Fixtures Pristine Baseline | **PASS (Unchanged)** | PASS (Entegre) |
| Statik Telemetry Audit (Direction B) | **PASS (Statik)** | Canlı Endpoint Doğrulaması |
| Track Trace Docker Pilotu | `DEFERRED_BY_USER` | Canlı Container Çalıştırma |
| Playwright Gerçek Ekran Görüntüleri | `DEFERRED_BY_USER` | Canlı Screenshot Üretimi |
| Chrome DevTools Remote Debugging | `DEFERRED_BY_USER` | Canlı CDP İncelemesi |

