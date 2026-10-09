# Adapter Contract & Extension Guide

## Architectural Purpose
Alper Design OS is strictly technology-agnostic. Design tokens, UX patterns, accessibility rules, and domain intelligence reside in `@alper-design-os/design-core`, completely decoupled from specific frontend frameworks.

The **Adapter Architecture** bridges Design Core with concrete software stacks:
- HTML / CSS / JavaScript
- JavaScript
- TypeScript
- React
- React + TypeScript
- PHP
- Laravel / Blade
- ASP.NET / Razor

---

## Adapter Contract Definition

Every adapter implements the `AdapterContract` interface defined in `@alper-design-os/adapter-contract`:

```typescript
export interface AdapterContract {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly targetExtensions: string[];
  readonly supportedModes: ('NEW' | 'REPAIR' | 'MODERNIZE')[];

  getCapabilities(): AdapterCapabilities;
  detect(files: ProjectFile[]): StackDetectionMatch;
  generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]>;
  renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]>;
  mapTokens(format: TokenOutputFormat): Promise<AdapterArtifact[]>;
  recommendModernization(files: ProjectFile[]): ModernizationStrategy;
}
```

### Key Responsibilities
1. **`detect(files: ProjectFile[])`**:
   Heuristically inspects directory files to determine if the project uses this stack, returning confidence from 0.0 to 1.0.

2. **`generateScaffold(options: ScaffoldOptions)`**:
   Produces the base application shell, master layout, and dependency configuration tailored to the host framework.

3. **`renderComponent(pattern: UXPatternSpec, options: RenderOptions)`**:
   Translates a technology-agnostic UX Pattern (such as `gantt-timeline` or `dense-datagrid`) into idiomatic framework code (e.g., TSX component, Blade view component, or Blazor Razor component).

4. **`mapTokens(format: TokenOutputFormat)`**:
   Compiles DTCG tokens into the framework's preferred style format (CSS custom properties, SCSS variables, Tailwind theme, or TypeScript objects).

5. **`recommendModernization(files: ProjectFile[])`**:
   Generates a non-destructive 4-phase incremental modernization plan.

---

## Adding a New Adapter

To add a new adapter (e.g., `adapters/vue` or `adapters/django`):
1. Create directory `adapters/<adapter-name>/`.
2. Implement class extending `BaseAdapter`.
3. Register the adapter instance in `AdapterRegistry.getInstance()`.
4. Add unit test in `tests/adapters.test.ts`.
