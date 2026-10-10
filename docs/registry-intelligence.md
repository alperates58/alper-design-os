# Component Registry Discovery & Ecosystem Intelligence

## Overview

Modern web frontend development has shifted from monolithic, black-box npm component libraries to **open copy-paste registries** (e.g. `shadcn/ui` ecosystem). The registry model grants full code ownership to developers, allowing direct modification of components inside the project's repository.

**Alper Design OS — Phase 1D** provides first-class discovery, indexing, and safety auditing for official and community component registries.

---

## 1. Supported Registry Architecture

Registries conform to `RegistrySourceSchema`:

```typescript
export interface RegistrySource {
  id: string;
  name: string;
  type: 'OFFICIAL' | 'COMMUNITY' | 'GITHUB_HOSTED' | 'NAMESPACE';
  registryUrl: string;
  homepage: string;
  description: string;
  registryFormat: 'SHADCN_V1' | 'SHADCN_V2' | 'CUSTOM_JSON';
  componentCount: number;
  blockCount: number;
  templateCount: number;
  requiresAuth: boolean;
  freeTier: boolean;
  license: string;
  lastChecked: string;
}
```

### Integrated Registries

1. **Official shadcn/ui Registry (`reg-shadcn-official`):**
   - Standard accessible UI primitives based on Radix UI and Tailwind CSS.
   - Includes primitives (`button`, `dialog`, `dropdown-menu`, `input`) and complex blocks (`data-table`).
2. **Magic UI Registry (`reg-magic-ui`):**
   - High-impact animated visual blocks and micro-interactions powered by Framer Motion.
   - Includes `animated-beam`, `bento-grid`, `marquee`, `globe`.
3. **Aceternity UI Registry (`reg-aceternity`):**
   - Expressive interactive showcase components with custom WebGL canvas shaders and 3D card effects.
4. **Kokonut UI Registry (`reg-kokonut`):**
   - Clean, lightweight modern components and dashboard cards designed for enterprise and SaaS.

---

## 2. Component & Block Manifests

Every component inside a registry is modeled as a `RegistryComponent`:

```typescript
export interface RegistryComponent {
  id: string;
  name: string;
  registryId: string;
  type: 'component' | 'block' | 'hook' | 'ui' | 'template';
  description: string;
  dependencies: string[];             // npm runtime dependencies (e.g. framer-motion)
  devDependencies: string[];          // npm dev dependencies
  registryDependencies: string[];      // inter-component dependencies (e.g. button, input)
  files: string[];                     // relative source files
  category?: string;
}
```

### Dependency Graph Auditing
Before suggesting any registry component, Alper Design OS audits the dependency graph to prevent:
- Heavy transitive npm dependencies that bloat bundle size.
- Conflicting styling engines (e.g. mixing styled-components with Tailwind).
- Missing sub-primitives (e.g. `data-table` requiring `button` and `dropdown-menu`).

---

## 3. Tool Invocations

Through the MCP server, agents discover and inspect registries dynamically:

```json
// Tool: search_registries
{
  "query": "animated",
  "freeTierOnly": true
}

// Tool: search_registry_components
{
  "query": "data-table",
  "registryId": "reg-shadcn-official"
}

// Tool: inspect_registry_component
{
  "registryId": "reg-shadcn-official",
  "componentId": "data-table"
}
```
