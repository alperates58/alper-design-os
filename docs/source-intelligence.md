# Design Source Intelligence V2 & Knowledge Ingestion

## Overview

**Alper Design OS — Phase 1D** introduces a technology-independent, multi-layered **Design Source Intelligence** engine designed to discover, inspect, classify, normalize, score, and index design systems, component libraries, UI registries, icons, charts, data grids, and AI prompt skills across the global open-source and free design ecosystem.

The system enforces a strict **discovery-first** philosophy:
```
DISCOVER → INSPECT → CLASSIFY → NORMALIZE → SCORE → LICENSE → INDEX → (ADAPT / IMPLEMENT)
```

No code is copied blindly into a project without evaluating licensing, dependency overhead, accessibility guarantees, and architectural blast radius.

---

## 1. Source Taxonomy (23 Types)

The Source Intelligence taxonomy categorizes all ingested artifacts into 23 strictly validated types:

| Taxonomy Type | Description | Representative Examples |
|---|---|---|
| `DESIGN_SYSTEM` | Full cross-functional design system with foundations & guidelines | IBM Carbon, Material Design (M3), Atlassian, Microsoft Fluent |
| `COMPONENT_LIBRARY` | Concrete UI component package with built-in styling | Mantine, MUI, Ant Design, Chakra UI, PrimeReact |
| `COMPONENT_REGISTRY` | Copy-paste code distribution registry | shadcn/ui official, Magic UI, Aceternity UI, Kokonut UI |
| `HEADLESS_UI` | Unstyled accessible behavioral primitives | Radix UI, React Aria, Ariakit, Headless UI |
| `ACCESSIBILITY_LIBRARY` | Specialized accessibility standards & testing engines | axe-core, WCAG 2.1/2.2 specifications |
| `UX_PATTERN_LIBRARY` | Reusable mental models and interaction flows | PatternFly patterns, GOV.UK design patterns |
| `DESIGN_TOKEN_SYSTEM` | Platform-agnostic design token formats & transformers | W3C Design Tokens, Style Dictionary |
| `ICON_LIBRARY` | Consistent SVG glyph families with tree-shaking support | Lucide Icons, Heroicons, Material Symbols, Tabler, Phosphor |
| `DATA_GRID` | High-density analytical and flat table engines | AG Grid (Community), TanStack Table (v8) |
| `CHART_LIBRARY` | Data visualization and telemetry rendering libraries | Apache ECharts, Recharts, Chart.js |
| `FORM_LIBRARY` | Form state, schema validation, and rendering engines | React Hook Form, Formik, Zod Form Adapter |
| `TABLE_LIBRARY` | Lightweight semantic tabular layout components | HTML Table Primitives, TanStack Table |
| `LAYOUT_LIBRARY` | Structural layout engines (split pane, dockable frames) | React Mosaic, Allotment, GridStack |
| `ANIMATION_LIBRARY` | Physics-based and declarative motion systems | Framer Motion, Motion One, AutoAnimate |
| `VISUALIZATION_LIBRARY`| Node graphs, flow diagrams, and tree visualizers | React Flow, D3.js |
| `AI_SKILL` | Curated, security-audited Antigravity / LLM prompt skills | Verified UI design skills, auditing skills |
| `PROMPT_LIBRARY` | Structured multi-turn agent system prompts | Design system prompt engineering templates |
| `MCP_SERVER` | Model Context Protocol servers for runtime orchestration | Postgres MCP, Chrome DevTools, Playwright |
| `REFERENCE_IMPLEMENTATION`| Production-grade open-source application blueprints | Supabase Studio, Grafana Frontend |
| `DESIGN_GUIDELINE` | Authoritative accessibility & usability documentation | Nielsen Norman Group, USWDS Standards |
| `FRONTEND_FRAMEWORK` | Target rendering and UI composition frameworks | React, Vue 3, Svelte, Angular, Vanilla JS |
| `CSS_FRAMEWORK` | Utility and styling runtimes | Tailwind CSS, CSS Modules, StyleX |
| `THEME_SYSTEM` | Dynamic color token and theme distribution systems | Radix Themes, DaisyUI |

---

## 2. Source Metadata V2 Schema

Every registered source is validated against `SourceMetadataV2Schema` containing over 40 typed properties:

```typescript
export interface SourceMetadataV2 {
  id: string;
  name: string;
  type: SourceType;
  description: string;
  homepage: string;
  repository?: string;
  documentation?: string;
  maintainer: string;
  license: string;
  licenseUrl?: string;
  version?: string;
  latestKnownVersion?: string;
  lastReleaseDate?: string;
  lastCommitDate?: string;
  lastChecked: string;
  stars?: number;
  forks?: number;
  openIssues?: number;
  archived?: boolean;
  maintenanceStatus: 'ACTIVE' | 'PERIODIC' | 'DORMANT' | 'DEPRECATED';

  // Multi-Framework Compatibility
  frameworks: string[];
  languages: string[];
  renderingModels: ('SPA' | 'SSR' | 'SSG' | 'ISLANDS' | 'SERVER_COMPONENTS')[];
  stylingModels: ('TAILWIND' | 'CSS_MODULES' | 'CSS_IN_JS' | 'UTILITY_CLASSES' | 'PLAIN_CSS' | 'DESIGN_TOKENS')[];

  // Feature Flags
  supportsReact: boolean;
  supportsVue: boolean;
  supportsSvelte: boolean;
  supportsAngular: boolean;
  supportsVanilla: boolean;
  supportsWebComponents: boolean;
  accessibilitySupport: 'WCAG_2_1_AA' | 'WCAG_2_1_AAA' | 'PARTIAL' | 'NOT_SPECIFIED';
  rtlSupport: boolean;
  darkMode: boolean;
  responsiveSupport: boolean;
  designTokens: boolean;
  typescriptSupport: boolean;

  // Domain Suitability Scores (0-100)
  enterpriseSuitability: number;
  consumerSuitability: number;
  dataDenseSuitability: number;
  mobileSuitability: number;
  dashboardSuitability: number;
  marketingSuitability: number;

  // Composite Quality & Trust Scores (0-100)
  trustScore: number;
  qualityScore: number;
  maintenanceScore: number;
  compatibilityScore: number;
  overallScore: number;

  // License & Permissiveness
  codeReuseAllowed: boolean;
  modificationAllowed: boolean;
  redistributionAllowed: boolean;
  attributionRequired: boolean;
}
```

---

## 3. Authoritative Sources Catalog (65 Ingested Sources)

The built-in catalog contains 65 production-grade sources across enterprise systems, headless primitives, component registries, icons, charts, and data grids:

- **Enterprise Design Systems:** IBM Carbon, Google Material M3, Microsoft Fluent 2, Atlassian Design System, Shopify Polaris, GitHub Primer, Adobe Spectrum, Red Hat PatternFly, UK Government GOV.UK, US Web Design System (USWDS), Salesforce Lightning (SLDS).
- **Headless UI Primitives:** Radix UI Primitives, React Aria (Adobe), Ariakit, Headless UI (Tailwind Labs).
- **Component Registries & Distribution:** shadcn/ui Official, Magic UI, Aceternity UI, Kokonut UI.
- **Component Libraries:** Mantine, Material UI (MUI), Ant Design, Chakra UI, PrimeReact, HeroUI, DaisyUI.
- **Data Grids:** TanStack Table v8 (100% Free Headless MIT), AG Grid Community (MIT Viewport Virtualization).
- **Chart & Telemetry Libraries:** Apache ECharts (Hardware Canvas/WebGL for >10k data points), Recharts (Declarative React SVG), Chart.js (Multi-framework Canvas).
- **Icon Systems:** Lucide Icons (SaaS/Enterprise/shadcn), Heroicons (Tailwind-native optical sizing), Google Material Symbols (Variable fonts), Tabler Icons (5200+ domain glyphs), Phosphor Icons (Duotone), Radix Icons (15x15 micro-grid).

---

## 4. Inverted Token Search Index

A high-performance in-memory search index tokenizes source titles, descriptions, categories, frameworks, and domain strengths into an inverted posting list:

```typescript
const searchIndex = new SourceSearchIndex(seedSources);
const results = searchIndex.search('dense industrial grid canvas', 10);
// Returns: AG Grid, Apache ECharts, IBM Carbon
```

Search executes in `<2ms` with zero remote HTTP dependency.

---

## 5. Offline Cache & Sync Engine

Sources are cached locally in `.alper-design-os/cache/sources/` with automated secret sanitization and rate-limit fallback:
- **Incremental Sync:** Performs lightweight HEAD requests for ETags; never clones full Git repositories or downloads heavy release zip files.
- **Rate-Limit Resilience:** When the GitHub API or registry endpoint returns HTTP 429, the engine automatically falls back to local cache without crashing or failing downstream validations.
- **Air-Gapped Operation:** Supports 100% offline environments (`options.offlineOnly: true`).
