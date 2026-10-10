# Canonical Design Language

## 1. Overview
Alper Design OS features a technology-neutral **Canonical Design Language** that bridges the gap between high-level product intent and low-level stack code. Rather than assuming React or Tailwind CSS as defaults, Alper Design OS expresses interfaces through structured canonical models:

```
PRODUCT CONTEXT
  -> UX INTENT
  -> DESIGN TOKENS
  -> LAYOUT
  -> PATTERNS
  -> COMPONENT BLUEPRINTS
  -> INTERACTION CONTRACT
  -> TARGET STACK RENDERER
```

## 2. Technology-Neutral Principles
- **No Framework Colonization:** If the project is Laravel, render native Blade. If it is ASP.NET Core, render native Razor. Never force React onto non-React stacks.
- **Continuous Personality Axes:** Replace buzzwords like "modern" and "clean" with 6 quantitative axes (-100 to +100).
- **Three-Level Token Hierarchy:** Primitives, Semantics, and Components, supporting Light, Dark, and High-Contrast modes with DTCG compliance.
- **Rhythmic Spacing Scale:** 4px baseline rhythm avoiding arbitrary magic pixel values.
- **First-Class Accessibility:** WCAG 2.2 AA compliance baked into component blueprints by construction.
