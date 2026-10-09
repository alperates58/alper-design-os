# Architecture Overview - ALPER DESIGN OS

## Fundamental Principle
**"Understand the product before designing the interface."**

Design systems traditionally fail in enterprise software because they focus exclusively on atomic components (buttons, badges, inputs) while remaining oblivious to domain workflows, data density requirements, and operator ergonomics.

Alper Design OS separates software design into four distinct layers:

```text
┌─────────────────────────────────────────────────────────────┐
│                 Antigravity Native Layer                    │
│   (Skills, Specialized Agents, Rules, Hooks, MCP Server)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Domain Intelligence                      │
│ (Domain Classifier, JTBD, Operator Ergonomics, Density)     │
│             ==> Generates: ProductUXProfile                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Design Core (Agnostic)                   │
│   • DTCG Design Tokens (Color, Typography, Spacing, Radius) │
│   • Layout Archetypes (Workbench, Multi-Pane, Dense Grid)   │
│   • Core UX Patterns (Gantt, Virtualized Grid, Heatmaps)    │
│   • Interaction & Shortcut Engine                           │
│   • Accessibility Rules (WCAG 2.1 AA/AAA)                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     Adapter Architecture                    │
│ ┌───────────────┐ ┌───────────────┐ ┌─────────────────────┐ │
│ │  Generic Web  │ │  HTML/CSS/JS  │ │ React / TypeScript  │ │
│ └───────────────┘ └───────────────┘ └─────────────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ ┌─────────────────────┐ │
│ │  PHP Native   │ │ Laravel/Blade │ │ ASP.NET Core Razor  │ │
│ └───────────────┘ └───────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Antigravity Native Layer
Alper Design OS is packaged as a first-class Antigravity plugin:
- `plugin.json`: Metadata manifest for the Antigravity extension ecosystem.
- `skills/`: Standardized procedural runbooks for NEW, REPAIR, and MODERNIZE workflows.
- `agents/`: Purpose-built AI agents (UX Architect, Design Token Specialist, Legacy Modernizer, Domain Researcher).
- `rules/AGENTS.md`: Enforces mandatory domain analysis before writing UI code.
- `mcp_config.json`: Bridges the local TypeScript MCP server with 15 typed tools.

---

## 2. Domain Intelligence & ProductUXProfile
When given a product idea or brief, Alper Design OS never begins with UI mockups. Instead, it extracts:
- **Domain Classification**: Categorizes the software into industrial operational, enterprise B2B, fintech, healthcare, etc.
- **Operator Personas**: Deep-dives into operational pain points, hours spent on screens, and cognitive load.
- **Information Density**: Dynamically selects between EXTREME, HIGH, MEDIUM, and SPACIOUS density scales.
- **Interaction Style**: Evaluates keyboard-first hotkeys, mouse drag-and-drop, and context menus.
- **Critical Workflows**: Maps end-to-end task sequences with strict latency tolerances.

---

## 3. Design Core (Framework-Agnostic)
- **Design Tokens Community Group (DTCG)**: All tokens follow standard `$value`, `$type`, and `$description` semantics.
- **Token Compiler (Style Dictionary Architecture)**: Lossless compilation to CSS Custom Properties, SCSS variables, Tailwind theme configuration, and TypeScript constants.
- **Layout Engine**: Resolves complex responsive workbench multi-panes, splitters, headers, and status bars.
- **Core UX Patterns**: Declarative specifications for data-intensive components (Finite Capacity Gantt, High-Density DataGrid, Resizable SplitPanes, Bottleneck Heatmaps).

---

## 4. Adapter Architecture & Extensibility
Every supported framework implements `AdapterContract`:
```typescript
interface AdapterContract {
  id: string;
  name: string;
  getCapabilities(): AdapterCapabilities;
  detect(files: ProjectFile[]): StackDetectionMatch;
  generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]>;
  renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]>;
  mapTokens(format: TokenOutputFormat): Promise<AdapterArtifact[]>;
  recommendModernization(files: ProjectFile[]): ModernizationStrategy;
}
```

Adapters are registered via `AdapterRegistry.getInstance()`. To introduce support for Vue, Svelte, or Python/Django, only a single adapter class implementing this contract is required.

---

## 5. Security & Safety Model
- **Read-Only by Default**: File analyzers and MCP tools never mutate user code automatically.
- **Analyze → Plan → Apply**: The system mandates a reviewable plan before performing file modifications.
