---
name: alper-registry-discovery
description: Discovers, searches, and inspects components and blocks from the shadcn registry ecosystem and curated community UI registries.
---

# Alper Registry Discovery

This skill enables copy-paste component discovery and dependency resolution across modern UI registries.

## Workflow

1. **Registry Exploration**:
   - Query registered component catalogs (official shadcn/ui, Magic UI, Aceternity, Kokonut).
   - Filter by framework and free-tier accessibility.
2. **Component & Block Search**:
   - Search components by category, keyword, or design pattern requirement (`data-table`, `bento-grid`, `animated-beam`).
3. **Dependency Graph Resolution**:
   - Map runtime npm dependencies (`framer-motion`, `@tanstack/react-table`) and inter-component dependencies (`button`, `dialog`).
   - Guard against duplicate transitive styling engines or conflicting token namespaces.
4. **Selective Adoption**:
   - Install required source files directly into project workspace with full code ownership.
