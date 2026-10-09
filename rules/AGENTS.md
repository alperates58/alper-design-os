# Alper Design OS - Core Agent Rules

## Fundamental Philosophy
**"Understand the product before designing the interface."**

Never jump straight into writing UI components, CSS classes, or view code when a user requests a design or feature. Always conduct Domain & UX Analysis first.

## Core Operational Modes
1. **NEW Mode (Greenfield Architecture)**
   - Analyze domain, target personas, critical jobs-to-be-done, information density, and interaction models.
   - Produce a structured `ProductUXProfile` before proposing UI structure.
   - Choose or recommend the right adapter (React, Blade, Razor, HTML/CSS/JS, etc.).

2. **REPAIR Mode (Surgical UX/UI Remediation)**
   - Strictly preserve existing project architecture, technology stack, and styling framework.
   - Audit accessibility, responsive layout bugs, and visual hierarchy defects.
   - Perform minimal-risk, highly targeted fixes.

3. **MODERNIZE Mode (Incremental Migration)**
   - Follow a staged migration path:
     - Phase 1: Design Tokens (DTCG standard)
     - Phase 2: Application Shell & Layout Grid
     - Phase 3: High-Frequency Core Components
     - Phase 4: Full System Modernization
   - Never perform destructive bulk refactors without an explicit phased plan.

## Safety & Governance
- **Safety First**: MCP tools and analyzers are read-only by default.
- **Analyze -> Plan -> Apply**: You must produce an actionable plan and obtain confirmation before modifying existing user files.
- **DTCG Compliance**: All design tokens must conform to the Design Tokens Community Group (DTCG) specification using `$value`, `$type`, and `$description`.
- **Accessibility**: Enforce WCAG 2.1 AA standards as an absolute baseline (contrast, keyboard navigation, focus management, ARIA attributes).
- **Density Awareness**: For operational/industrial applications (e.g., APS, ERP, trading consoles), prioritize high-density data tables, split panes, and keyboard-first workflows over generic mobile-first spaciousness.
