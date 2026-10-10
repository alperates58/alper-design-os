---
name: alper-source-intelligence
description: Discovers, inspects, and normalizes authoritative design systems, headless UI primitives, icon libraries, charts, and data grids using typed metadata V2 schemas.
---

# Alper Source Intelligence

This skill discovers and inspects authoritative design systems, component libraries, and visual foundations across the global open-source ecosystem.

## Workflow

1. **Taxonomy Classification**:
   - Classify candidate source into one of 23 typed categories (`DESIGN_SYSTEM`, `COMPONENT_LIBRARY`, `HEADLESS_UI`, `DATA_GRID`, `CHART_LIBRARY`, `ICON_LIBRARY`, etc.).
2. **Metadata Inspection**:
   - Inspect maintainer, license, TypeScript support, dark mode, design token compatibility, and WCAG accessibility conformance.
3. **Dependency & Blast Radius Analysis**:
   - Evaluate dependency footprint, bundle weight (KB), and runtime performance cost before introducing into codebase.
4. **Integration Mode Selection**:
   - Decide integration strategy: `REFERENCE`, `KNOWLEDGE`, `DIRECT_CODE`, `ADAPTER`, or `REGISTRY`.
