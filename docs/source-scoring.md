# Multi-Dimensional Source Scoring & Recommendation Rationale

## Overview

Recommending a design system or component library is a critical architectural decision. A poor choice can lead to accessibility lawsuits, severe bundle bloat, copyleft licensing conflicts, or unmaintained abandonware.

**Alper Design OS — Phase 1D** introduces a transparent, multi-dimensional scoring and explanation engine that evaluates candidates against real project constraints.

---

## 1. Multi-Criteria Scoring Formula

The default ranking model computes a composite score between `0` and `100` using weighted dimensions:

$$\text{FinalScore} = \sum_{k} (w_k \times S_k)$$

| Dimension | Default Weight | Criteria Evaluated |
|---|---|---|
| **Trust & Authority** ($S_{\text{trust}}$) | **20%** | Corporate backing, community adoption, security history, open-source longevity. |
| **Accessibility Compliance** ($S_{\text{a11y}}$) | **20%** | Verified WCAG 2.1 AA/AAA support, keyboard APG adherence, ARIA attribute completeness. |
| **Stack Compatibility** ($S_{\text{stack}}$) | **15%** | Native language/framework alignment, modern tooling (Vite, Next.js, TypeScript). |
| **Maintenance Quality** ($S_{\text{maint}}$) | **15%** | Release cadence, issue triage velocity, Git commit freshness, deprecation notices. |
| **Documentation Quality** ($S_{\text{doc}}$) | **15%** | Interactive sandboxes, copy-paste snippets, design token specs, migration guides. |
| **Domain Compatibility** ($S_{\text{domain}}$) | **10%** | Alignment with target domain (Fintech, Industrial, Healthcare, E-Commerce). |
| **License Permissiveness** ($S_{\text{lic}}$) | **5%** | Permissive MIT/Apache-2.0 vs copyleft GPL or restricted commercial locks. |

### Dynamic Domain Tuning
When evaluating **High-Density**, **Industrial Operational**, or **Fintech** applications, weights automatically adjust:
- **Trust & Accessibility** scale up to **25%** each.
- **Domain Alignment** scales up to **20%**.
- Superficial visual marketing features are deprioritized in favor of keyboard performance and virtualization.

---

## 2. Structured "WHY" Explanations

Every recommendation returns a structured explanation schema (`RecommendationExplanationSchema`):

```typescript
export interface RecommendationExplanation {
  sourceId: string;
  sourceName: string;
  compositeScore: number;
  primaryRecommendationReason: string;
  scoreBreakdown: {
    domainSuitability: number;
    stackCompatibility: number;
    accessibilityScore: number;
    maintenanceScore: number;
    trustScore: number;
  };
  highlights: string[];
  caveats: string[];
}
```

### Example Recommendation Rationale (Fintech Console):
- **Candidate:** `IBM Carbon Design System`
- **Primary Reason:** "Premier enterprise design system engineered specifically for dense data environments, keyboard accessibility, and complex workflows."
- **Highlights:**
  - High domain alignment (95%) with FINTECH and capital markets data density.
  - Robust accessibility foundation verified at WCAG 2.1 AA standard.
  - Active enterprise backing from IBM Open Source and Linux Foundation.
- **Caveats:**
  - Noticeable CSS footprint; ensure modular tree-shaking is enabled in build pipeline.

---

## 3. Design System Conflict Resolution Engine

Different authoritative design systems sometimes advocate opposing design paradigms:

| Topic | Conflict / Debate | Chosen Resolution in Alper Design OS | Rationale |
|---|---|---|---|
| **Form Labels** | Material Design M3 (Floating labels) vs Polaris / GOV.UK (Static top labels) | **Static Top Labels** | Floating labels disappear during auto-fill, complicate translation, and cause accessibility issues in high-stakes forms. |
| **Table Pagination** | Carbon (Explicit server-side pagination) vs Modern Web (Infinite scroll) | **Server-Side Pagination** | Infinite scroll breaks keyboard access to the footer, prevents row indexing, and impedes auditability. |
| **Status Indicators** | PatternFly (Shape + Color) vs Generic Web (Color only) | **Shape + Color Redundancy** | Satisfies WCAG 1.4.1 (Use of Color), ensuring accessibility for colorblind users. |
| **Modal Hierarchy** | Carbon (No stacked modals) vs Generic (Nested modals) | **Slide-Over Drawer for Sub-Tasks** | Stacking modals produces focus trap bugs and disorients users regarding parent state. |
