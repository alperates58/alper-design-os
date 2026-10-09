---
name: alper-design-modernize
description: Controlled, phased migration of legacy codebases (PHP, ASP.NET, jQuery, legacy CSS) into modern design system standards.
---

# Alper Design OS - MODERNIZE Mode

Used when gradually upgrading a legacy system to modern design standards without breaking existing business logic.

## Four-Phase Modernization Roadmap

```text
Phase 1: Design Tokens Foundation
└── Extract hardcoded hex colors, pixel margins, and typography into DTCG tokens.
└── Introduce CSS Custom Properties without touching HTML/markup.

Phase 2: Shell & Global Grid
└── Standardize the application shell, navigation header, sidebar, and responsive breakpoints.

Phase 3: High-Frequency Core Components
└── Modernize buttons, forms, data tables, and modal dialogs using matching stack adapter.

Phase 4: Full System Modernization
└── Replace legacy component implementations with cohesive, accessible design patterns.
```

## Step-by-Step Procedure

1. **Stack & Legacy Assessment**:
   - Call `detect_stack` and `analyze_project`.
   - Call `recommend_modernization` to generate a phased strategy suited for the specific framework.

2. **Phase 1 Execution (Zero Markup Disruption)**:
   - Compile design tokens to CSS variables (`--color-*`, `--space-*`).
   - Map legacy class names or variables to the design token system.

3. **Incremental Component Refactor**:
   - Modernize one component family at a time with unit test verification.
