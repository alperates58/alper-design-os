# Alper Design OS — Truthful UI Policy & Content Integrity Specification (Phase 1E.7)

## 1. Overview & Rationale

Modern AI-assisted user interface development frequently suffers from the "synthetic facade" anti-pattern:
- Dashboards display operational metrics ("99.99% Uptime", "42ms Latency", "1,420 Active Devices") with zero authentic telemetry streams.
- Client applications fetch missing endpoints (e.g. `/api/missing-telemetry-endpoint`), silently swallow errors, and continue presenting static mock figures as live state.
- Semantic indicators mislead operators (e.g., degraded or error conditions styled with success-green tokens, or inverted trend glyphs).
- Pages accumulate excessive visual clutter and irrelevant decorative widgets that obscure critical tasks.

The **Truthful UI Policy & Content Integrity Framework (Phase 1E.7)** establishes mathematical and behavioral contracts ensuring that all visual elements truthfully reflect their underlying data realities.

---

## 2. Core Pillars of Truthful UI

### Pillar I: Data Provenance Model
Every data point rendered on a screen must declare its provenance lineage:
- **`originType`**:
  - `AUTHORITATIVE_API`: Authenticated production REST/gRPC backend.
  - `TELEMETRY_STREAM`: Cryptographically signed, real-time device stream (MQTT, WebSocket).
  - `DATABASE_RECORD`: Primary transactional store record.
  - `DERIVED_COMPUTATION`: Computed metric from known data lineage.
  - `CACHE_SNAPSHOT`: Validated cache layer with active TTL.
  - `SYNTHETIC_MOCK`: Explicit test fixture or benchmark seed (requires visible label).
  - `STATIC_FIXTURE`: Immutable design mockup asset.
  - `USER_INPUT`: Unvalidated client form input.
  - `UNVERIFIED_ESTIMATE`: Heuristic estimation.
  - `FABRICATED_UNGROUNDED`: Ungrounded or hallucinated data (**strictly blocked**).

- **`freshness`**: `LIVE`, `NEAR_REALTIME`, `CACHED`, `STALE`, `EXPIRED`, `SYNTHETIC`.

### Pillar II: Source Authority Classification
Sources are categorized into strict Authority Tiers:
1. `AUTHORITATIVE_SYSTEM` (Score: 95–100): Production databases and authenticated broker channels.
2. `VERIFIED_EXTERNAL` (Score: 90–95): Trusted third-party platforms with valid TLS (Stripe, GitHub, AWS).
3. `DERIVED_ANALYTICS` (Score: 80–90): Verified data warehouses and ETL pipelines.
4. `PROVISIONAL_CACHE` (Score: 70–80): Read replicas and edge caches within TTL limits.
5. `SYNTHETIC_MOCK` (Score: 60–75): Permitted only in development/benchmark environments with explicit labels.
6. `UNVERIFIED_USER_INPUT` (Score: 40–60): Requires server-side validation.
7. `HALLUCINATED_OR_FABRICATED` (Score: 0): Quarantined and blocked by release gates.

### Pillar III: Page Intent & Information Relevance
A user interface is governed by its declared **Page Intent**:
- `OPERATIONAL_MONITORING`: High-frequency, low-latency telemetry; zero decorative filler.
- `EXECUTIVE_DECISION`: Aggregated business KPIs; clear historical trend provenance.
- `DATA_ENTRY_TRANSACTION`: Deterministic input fields; zero ambient distractors.
- `EXPLORATORY_ANALYTICS`: Interactive slice-and-dice data grids.
- `CONFIGURATION_ADMIN`: High-criticality settings and security audit logs.
- `DIAGNOSTIC_INVESTIGATION`: Root-cause anomaly logs and timeline correlation.
- `DEMO_SHOWCASE`: Permitted mock data with visible simulation banners.

**Information Relevance Criteria**:
- `relevanceScore` (0–100)
- `signalToNoiseRatio` (0.0–1.0)
- `cognitiveLoadImpact` (`LOW`, `MEDIUM`, `HIGH`, `EXCESSIVE`)
- Redundancy evaluation (`UNIQUE`, `COMPLEMENTARY`, `DUPLICATE`, `CONTRADICTORY`)

### Pillar IV: Human Visual Approval Gate
Automated tests (headless browsers, lints, snapshots) cannot replace human visual verification for critical UI systems.
- State Machine: `NOT_REVIEWED` -> `IN_REVIEW` -> `APPROVED` | `REJECTED` | `CHANGES_REQUESTED`.
- **Anti-Tamper Bot Guard**: CI runners, bots, and automated AI agents are programmatically blocked from setting status `APPROVED`. Authentic human reviewer identity and review criteria verification are mandatory.

---

## 3. CONTENT_TRUTH_PASS Governance Release Gate

The `CONTENT_TRUTH_PASS` gate evaluates:
1. Zero ungrounded telemetry streams.
2. Complete data provenance metadata on all metric cards, charts, and grids.
3. Prominent labeling of any simulated or synthetic fixture.
4. Semantic color alignment (e.g. failure != green).
5. Alignment between components and stated Page Intent.
6. Human visual sign-off verification when required.

Verdicts:
- `CONTENT_TRUTH_PASS`: All criteria satisfied; release permitted.
- `CONTENT_TRUTH_WARN`: Non-blocking heuristic warnings; manual verification advised.
- `CONTENT_TRUTH_FAIL`: Critical policy violations; pipeline blocked immediately.
