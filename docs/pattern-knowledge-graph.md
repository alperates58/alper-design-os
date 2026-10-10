# Pattern Knowledge Graph (28 Technology-Independent UX Patterns)

## Overview

The **Pattern Knowledge Graph** models 28 fundamental, technology-independent user experience patterns. Unlike component libraries that prescribe a specific framework or DOM structure, the Pattern Knowledge Graph formalizes:

- **User Intent & Problem Formulation**
- **When to Use & When to Avoid**
- **Information Density & Interaction Complexity**
- **Keyboard Navigation Requirements (WAI-ARIA APG)**
- **Responsive Mobile Strategies**
- **Accessibility Notes (WCAG 2.1 AA / AAA)**
- **Cross-Pattern Relationships**
- **Candidate Design Sources & Implementations**

---

## Pattern Taxonomy

| Category | Patterns |
|---|---|
| **CONTAINER & SURFACES** | `APP_SHELL`, `MODAL`, `DRAWER`, `SPLIT_PANE` |
| **NAVIGATION** | `SIDEBAR`, `TOP_NAV`, `WIZARD` |
| **COMMAND & INPUT** | `COMMAND_PALETTE`, `SEARCH`, `FORM`, `INLINE_EDIT` |
| **DATA DISPLAY & GRIDS** | `DATA_TABLE`, `DENSE_GRID`, `MASTER_DETAIL`, `TREE`, `KANBAN`, `CALENDAR`, `TIMELINE`, `CHART`, `KPI` |
| **FILTER & QUERY** | `FILTER_BAR` |
| **FEEDBACK & STATUS** | `NOTIFICATION`, `EMPTY_STATE`, `ERROR_STATE`, `LOADING_STATE` |
| **INTERACTION & ACTIONS**| `CONTEXT_MENU`, `BULK_ACTION`, `AUDIT_TRAIL` |

---

## Detailed Specifications (Selected Highlights)

### 1. `DENSE_GRID` (High-Density Analytical Data Grid)
- **Intent:** Render tens of thousands of real-time records with pinned columns, virtualization, multi-column sorting, and in-cell editing.
- **Appropriate When:** Manufacturing scheduling, financial blotters, logistics oversight.
- **Avoid When:** Simple marketing lists, low-density mobile apps.
- **Keyboard Requirements:** Roving `tabindex` across cells; `Arrow` keys navigate grid cells; `F2` or `Enter` toggles in-cell editor; `Escape` cancels edits.
- **Mobile Strategy:** Horizontal scroll container with frozen primary ID column or stacked card transformation.
- **Candidate Sources:** `src-carbon-design-system`, `src-ag-grid-community`, `src-tanstack-table`.

### 2. `COMMAND_PALETTE` (Global Keyboard Quick Switcher)
- **Intent:** Instant modal quick-switcher allowing power users to search views, navigate routes, and trigger actions using fuzzy keyboard queries.
- **Appropriate When:** Enterprise portals with >50 deep destinations, developer tools.
- **Avoid When:** Touch-only kiosk interfaces, read-only landing pages.
- **Keyboard Requirements:** `Cmd/Ctrl + K` or `/` opens palette; `ArrowUp/Down` selects items; `Enter` executes action; `Escape` closes dialog.
- **Accessibility:** Declares `role="combobox"` with `aria-expanded` and `aria-activedescendant`.
- **Candidate Sources:** `src-shadcn-ui`, `src-radix-ui`, `src-github-primer`.

### 3. `MASTER_DETAIL` (Split Master-Detail View)
- **Intent:** Display a primary entity collection alongside a persistent or contextual detail view to eliminate page reload latency.
- **Appropriate When:** Email clients, CRM contact exploration, ticket triage.
- **Avoid When:** Isolated standalone entities with independent life cycles.
- **Keyboard Requirements:** `Tab` moves focus between master list and detail pane; `Arrow` keys traverse master list items.
- **Mobile Strategy:** Collapses into a drill-down navigation stack with back button.
- **Candidate Sources:** `src-atlassian-design-system`, `src-patternfly`, `src-microsoft-fluent`.

### 4. `AUDIT_TRAIL` (Append-Only Event Ledger)
- **Intent:** Render tamper-evident chronological records of system actions, user mutations, and approval events.
- **Appropriate When:** Regulated fintech, healthcare records, security consoles.
- **Avoid When:** Ephemeral consumer messaging, unauthenticated websites.
- **Keyboard Requirements:** Filterable by timestamp range via keyboard inputs; expandable row details.
- **Accessibility:** Declares semantic `<ol>` or `role="feed"` with screen-reader timestamps.
- **Candidate Sources:** `src-carbon-design-system`, `src-patternfly`.

---

## Pattern Recommendation Engine

The graph automatically suggests patterns based on the detected `ProductUXProfile`:

```typescript
import { patternKnowledgeGraph } from '@alper-design-os/source-intelligence';

const patterns = patternKnowledgeGraph.recommendForContext({
  domain: 'Fintech capital markets',
  density: 'HIGH',
  isEnterprise: true
});

// Recommended: [APP_SHELL, DENSE_GRID, COMMAND_PALETTE, FILTER_BAR, AUDIT_TRAIL]
```
