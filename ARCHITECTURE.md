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

## 5. Security, Governance & Safety Model (Phase 1B)
Alper Design OS operates as an autonomous, self-governing platform with strict boundaries:
- **Mandatory Action Planning**: No significant code modifications without an approved `AgentActionPlan` defining objectives, blast radius, verification steps, and rollback plans.
- **Scope Guard (Zero Silent Expansion)**: Files classified into `IN_SCOPE`, `REQUIRED_DEPENDENCY`, `OUT_OF_SCOPE`, or `FORBIDDEN`. Unsolicited changes to database schemas, APIs, or dependencies are blocked.
- **Change Risk & Blast Radius**: Evaluates 10 safety factors (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). `HIGH` and `CRITICAL` changes enforce mandatory checkpoints before mutation.
- **Git Safety Engine**: Detects dirty working trees, creates checkpoint branches, blocks destructive commands (`git reset --hard`, `git clean -fd`, `force push`) without explicit approval, and provides automated rollback scripts.
- **Independent Reviewer**: Code reviews are conducted against raw diffs, test outputs, browser logs, and security results—never trusting implementer self-assurances alone.
- **Evidence-Based Verification**: Supports 13 verified evidence types (`BUILD_OUTPUT`, `TEST_RESULT`, `SCREENSHOT`, `VISUAL_DIFF`, `CONSOLE_LOG`, `NETWORK_TRACE`, `PERFORMANCE_TRACE`, `ACCESSIBILITY_REPORT`, `SECURITY_REPORT`, `DATABASE_ANALYSIS`, `API_CONTRACT_RESULT`, `STATIC_ANALYSIS`, `GIT_DIFF`). Responsive PASS requires full 4-viewport validation (390x844, 768x1024, 1440x900, 1920x1080).
- **Claim Verification Policy**: Prohibits unbacked claims ("Tamamen test edildi", "Production ready", "Security sorunu yok"). Enforces `VERIFIED`, `PARTIALLY_VERIFIED`, `NOT_VERIFIED`, `NOT_APPLICABLE`, or `FAILED`.
- **Policy Engine Priority**:
  1. `USER_EXPLICIT_REQUIREMENT`
  2. `SECURITY_DATA_SAFETY` (Prevents user requests from violating safety)
  3. `PROJECT_RULES`
  4. `ALPER_DESIGN_OS_RULES`
  5. `FRAMEWORK_BEST_PRACTICES`
  6. `OPTIONAL_RECOMMENDATIONS`
- **Context & Tool Routing**: Selectively scopes context to conserve token budgets and routes to low-cost/read-only tools first.
- **Execution Journal**: Writes structured, secret-sanitized audit trails to `.alper-design-os/runs/<run-id>/`.

