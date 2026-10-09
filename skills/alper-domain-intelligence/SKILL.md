---
name: alper-domain-intelligence
description: Analyzes software domains, business context, personas, information density, and user workflows before proposing any UI or architecture. Produces a typed ProductUXProfile.
---

# Alper Domain Intelligence

This skill extracts deep domain context and UX requirements from any software concept or brief.

## Workflow

1. **Domain Classification**:
   - Classify the domain: `B2B_ENTERPRISE`, `INDUSTRIAL_OPERATIONAL`, `B2C_CONSUMER`, `DEVELOPER_TOOL`, `FINTECH`, `HEALTHCARE`.
   - Identify domain-specific constraints (e.g. finite capacity, real-time alerts, strict regulatory compliance).

2. **Persona & Jobs-to-be-Done (JTBD)**:
   - Identify primary user personas, their goals, stress points, and mental models.
   - Map critical daily workflows and primary jobs.

3. **Density & Interaction Profile**:
   - Determine information density:
     - `EXTREME`: Real-time telemetry, multi-resource Gantt, financial trading desks.
     - `HIGH`: Operational scheduling (APS), ERP tables, warehouse management.
     - `MEDIUM`: Standard SaaS, CRM dashboards.
     - `SPACIOUS`: Consumer web, marketing portals, mobile-first apps.
   - Determine interaction style: `KEYBOARD_FIRST`, `HYBRID_MOUSE_KEYBOARD`, `TOUCH_OPTIMIZED`, `GUIDED_WIZARD`.

4. **Visual & Layout Patterns**:
   - Map domain needs to core UX patterns (Split panes, Gantt charts, high-density grids, context menus, filter drawers).

5. **Generate `ProductUXProfile`**:
   - Output structured, typed JSON schema representing the full UX blueprint.
