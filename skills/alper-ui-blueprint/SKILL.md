---
name: alper-ui-blueprint
description: Technology-neutral Page and Component Blueprint DSL modeling UI structure, state contracts, and accessibility by construction.
---

# Alper UI Blueprint DSL

## Purpose
The Alper UI Blueprint DSL models interface hierarchy and component behavior without framework-specific code. Blueprints describe content models, slots, props, state machines, and accessibility requirements that target renderers transform into production code.

## Key Blueprint Models
1. **Component Blueprint:**
   - 15 Canonical components: `BUTTON`, `INPUT`, `SELECT`, `CHECKBOX`, `RADIO`, `SWITCH`, `BADGE`, `ALERT`, `CARD`, `MODAL_DIALOG`, `DRAWER`, `TOOLTIP`, `DROPDOWN_MENU`, `DATA_TABLE`, `FILTER_BAR`.
   - Explicit state modeling: `DEFAULT`, `HOVER`, `FOCUS`, `ACTIVE`, `DISABLED`, `LOADING`, `ERROR`, `SUCCESS`, `EMPTY`, `SELECTED`.
2. **Page Blueprint:**
   - Regions: `PAGE_HEADER`, `TOOLBAR`, `FILTER_BAR`, `CONTENT_REGION`, `GRID_REGION`, `DETAIL_PANEL`, `ACTION_REGION`, `STATUS_REGION`.
3. **Application Shell Blueprint:**
   - Variants: `ENTERPRISE_DENSE`, `SAAS_STANDARD`, `CONSUMER_CONTENT`.
   - Structural regions: Sidebar, top navigation, breadcrumbs, command area, user menu, mobile drawer.

## Contracts Included in Every Blueprint
- **Interaction Contract:** Events, keyboard shortcuts, focus trapping, and state transition durations.
- **Responsive Contract:** Priority, collapse order, mobile drawer conversion, and touch targets.
- **Accessibility Contract:** WAI-ARIA role, accessible name strategy, keyboard navigation, and WCAG 2.2 AA compliance.
