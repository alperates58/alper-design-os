# ALPER DESIGN OS — PHASE 2 DESIGN INTELLIGENCE SPECIFICATION
**Phase:** Phase 2 (Premium Design Intelligence, Agent Engineering & Modernization Evolution)  
**Status:** IMPLEMENTED & VERIFIED  

---

## 1. Overview & Architectural Philosophy

Phase 2 elevates ALPER DESIGN OS from a generic assistant into a sophisticated, context-aware design operating system. It rejects the monotonous "AI aesthetic" (repetitive rounded cards, random purple gradients, unreadable low-contrast grays, gratuitous animations) in favor of purposeful, domain-grounded engineering design.

The system is built on four core capabilities:
1. **Art Direction Engine (A1)**: Converts product/domain context into visually differentiated design direction candidates, selecting the optimal direction with mathematical scoring and transparent tradeoffs.
2. **UI Design Knowledge & Recommendation Engine (A2)**: Curated, searchable knowledge base of domain rules, layout blueprints, typography pairings, and UX guidelines with justified scoring and explainability.
3. **Universal Light / Dark / System Theming (A3)**: Canonical semantic token model with bidirectional mathematical contrast validation (WCAG 2.1 AA/AAA), SSR hydration safety, and reduced-motion enforcement.
4. **Component & Layout Intelligence (A4)**: 18 canonical UI component recipes and a layout reasoning layer accounting for viewport geometry, data density, and Windows 125% DPI display scaling.

---

## 2. Supported Design Direction Profiles (A1)

| Profile Type | Primary Target Domain | Layout Composition | Density | Key Visual Semantics |
|---|---|---|---|---|
| `PREMIUM_SAAS` | B2B SaaS, Analytics | `FLUID_WORKSPACE` | Comfortable (48px) | Subtle 1px borders, royal blue accents, crisp metric cards |
| `ENTERPRISE_ERP` | Supply Chain, ERP, Inventory | `MASTER_DETAIL_SPLIT` | Compact (36px) | Structured sidebar, tabular lining figures, amber/slate status |
| `DATA_DENSE_OPERATIONS` | Operations, Telemetry, Trading | `MULTI_PANE_DOCK` | Compact (36px) | Maximum screen utilization, monospaced numerals, zero decorative padding |
| `DEVELOPER_WORKSPACE` | Terminal, IDE, Code Tools | `MULTI_PANE_DOCK` | Compact (32px) | Dark zinc surface, cyan accent, split tree/terminal panels |
| `CONSUMER_MARKETPLACE` | E-commerce, Gaming Deals | `FEED_STREAM_HERO` | Comfortable (48px) | Visual card hierarchy, strikethrough pricing, trust badges |
| `GAMING_PLATFORM` | Gaming portals, Esports | `FEED_STREAM_HERO` | Comfortable (48px) | High-contrast dark surfaces, neon/amber badges, media cards |
| `EDITORIAL_CONTENT` | Publications, Long-form Docs | `CENTERED_CONTAINER` | Spacious (60px) | 68ch reading measure, serif/sans pairing, generous leading |
| `MINIMAL_PRODUCTIVITY` | Linear tools, Note apps | `CENTERED_CONTAINER` | Comfortable (44px) | Monochrome, command palette dominant, zero distraction |
| `INDUSTRIAL_APS_MES` | Factory MES, APS Scheduling | `GANTT_TIMELINE_MATRIX`| Compact (36px) | Unambiguous status colors (running/idle/fault), touch & keyboard targets |

### Candidate Generation & Evaluation
For substantial design tasks, the engine generates 3 distinct candidates (e.g. Primary profile, High-Density Operational alternative, and Focused Linear alternative). It calculates a multi-dimensional suitability score:
$$\text{Score} = w_1 \cdot \text{WorkflowFit} + w_2 \cdot \text{DensityAlignment} + w_3 \cdot \text{A11yConfidence} + w_4 \cdot \text{BrandFit} + w_5 \cdot \text{CognitiveLoad}$$
The winning candidate is selected with an explicit textual justification and documented rejection reasons for the alternatives. For trivial visual repairs, the engine operates in single-candidate mode to conserve agent context.

---

## 3. UI Design Knowledge Base & Scoring (A2)

The `DesignKnowledgeEngine` maintains curated domain knowledge rules derived from industry gold standards (Fluent 2, SAP Fiori, ISA-101, VS Code, Baymard Institute, and Butterick Practical Typography).

### Example: Enterprise ERP Recommendation
```json
{
  "id": "KB-ENT-ERP",
  "category": "ENTERPRISE",
  "productArchetype": "Enterprise ERP & Supply Chain",
  "recommendedLayout": "MASTER_DETAIL_SPLIT",
  "recommendedDensity": "COMPACT",
  "primaryPalette": "Slate Neutral & Amber Semantic",
  "typographyPairing": {
    "heading": "Inter, -apple-system, sans-serif",
    "body": "Inter, -apple-system, sans-serif",
    "mono": "\"SF Mono\", \"Segoe UI Mono\", monospace"
  },
  "navigationModel": "SIDEBAR_COLLAPSIBLE",
  "provenance": "Fluent 2 Web Standards & SAP Fiori Guidelines"
}
```

---

## 4. Universal Theme Engine & Contrast Contract (A3)

The semantic theme contract guarantees bidirectional consistency across Light and Dark themes.

### 11 Semantic Token Categories
1. **Palettes**: Primary, Secondary, Accent, Neutral.
2. **Surfaces**: Base, Default, Elevated, Muted, Subtle.
3. **Foreground**: Text Primary, Text Secondary, Text Muted, Text on Color.
4. **Borders**: Subtle, Default, Strong, Focus Ring.
5. **Interactive**: Hover, Active, Selected, Focus Ring, Disabled.
6. **Status**: Success, Warning, Destructive, Info (each with bg, text, border).
7. **Form Controls**: Input bg, border, text, placeholder, focus ring.
8. **Navigation & Overlays**: Nav bg, item hover, item active, dialog backdrop, modal box.
9. **Tables & DataGrid**: Header bg, row hover, row selected, cell border.
10. **Code & Editors**: Code bg, code text, code border.
11. **Feedback**: Loading spinner, empty state icon.

### Mathematical Contrast Calculation
Relative luminance $L$ is calculated per WCAG 2.1 specifications:
$$L = 0.2126 R + 0.7152 G + 0.0722 B$$
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
All text tokens are programmatically verified to satisfy $\ge 4.5:1$ (WCAG AA) and headline tokens $\ge 7.0:1$ (WCAG AAA).

### SSR Hydration Safety
To eliminate dark-mode flash of unstyled content (FOUC), `renderSSRThemeScript()` emits an inline, blocking script tag that inspects `localStorage` and `prefers-color-scheme` before the first paint:
```html
<script>(function(){try{var m=localStorage.getItem('alper-theme-preference');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=m==='dark'||(m!=='light'&&d)?'dark':'light';document.documentElement.setAttribute('data-theme',t);if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();</script>
```

---

## 5. 18 Canonical Component Recipes & Layout Reasoning (A4)

1. `navigationShell`: App navigation shell with collapsible side rail and responsive mobile sheet drawer.
2. `sidebarTopbar`: Global header, breadcrumbs, search shortcut, and user badge.
3. `toolbars`: Contextual action toolbar docked above tables or editors.
4. `buttonsActionMenus`: Primary, secondary, destructive buttons with split menu popovers.
5. `dataGrid`: Multi-column enterprise table with 36px/48px row heights and roving tabindex.
6. `formsValidation`: Accessible inputs, selects, and textareas with inline error states.
7. `searchFilters`: Instant search input with multi-select facet filter pills.
8. `dropdownsContextMenus`: Floating context menus with keyboard arrow traversal.
9. `dialogsDrawers`: Centered confirmation modals and right-side inspection drawers with focus traps.
10. `tabs`: Segmented tab switchers with URL sync.
11. `fileExplorersTrees`: Expandable hierarchical trees with ArrowRight/Left keyboard navigation.
12. `splitPanels`: Resizable panes with draggable splitters and touch-accessible hit targets.
13. `charts`: Accessible analytical charts with crosshair tooltips and tabular fallbacks.
14. `kpis`: Headline metric cards with trend badges (+12.4%) and comparison context.
15. `cards`: Structured content cards with max-card constraints to prevent card soup.
16. `pagination`: Page stepper, row-size dropdown, and total count indicator.
17. `notifications`: In-app alert banners and transient toast notifications.
18. `mobileNav`: Fixed bottom tab bar for handheld viewports (390px).

### Windows 125% DPI Scaling Awareness
On Windows desktop machines operating at 125% DPI scaling (effective logical viewport 1536×864 on 1080p monitors), usable vertical height is compressed by 20%. The layout reasoning engine automatically:
- Reduces application header height from 64px to 48px.
- Enforces compact table row heights (36px).
- Converts sidebars to collapsible icon rails below 1280px effective width.
- Preserves minimum 13px font sizes to maintain crisp font rendering without subpixel blur.
