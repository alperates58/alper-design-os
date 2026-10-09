# Alper Design OS - MCP Tools Reference

The Alper Design MCP server exposes 15 strongly typed tools to Antigravity and any MCP-compliant client.

## Security & Safety Model
- **Read-Only by Default**: Tools inspect, analyze, and plan without modifying project files directly.
- **Analyze -> Plan -> Apply Separation**: Any mutation must be planned via `create_design_plan` and reviewed by the user.

---

## Tool Catalog

### 1. `analyze_project`
- **Description**: Comprehensive inspection of an existing codebase: stack detection, UI health audit, WCAG accessibility violations.
- **Input**: `{ projectPath: string }`

### 2. `detect_stack`
- **Description**: Fast heuristics to identify languages, frameworks, styling tools, package managers, and recommended adapter.
- **Input**: `{ projectPath: string }`

### 3. `understand_product`
- **Description**: Infuses product brief with Domain Intelligence and generates a validated `ProductUXProfile`.
- **Input**: `{ productName: string, description: string, domain?: string, targetUsers?: string[], keyFeatures?: string[] }`

### 4. `research_domain`
- **Description**: Extracts deep domain context, mental models, typical workflows, and density requirements for any domain query.
- **Input**: `{ domainQuery: string }`

### 5. `recommend_ux_patterns`
- **Description**: Recommends UX patterns matched to information density and interaction style.
- **Input**: `{ density?: "EXTREME"|"HIGH"|"MEDIUM"|"SPACIOUS", interactionStyle?: string }`

### 6. `search_design_patterns`
- **Description**: Searches the core UX patterns registry (Gantt, DataGrid, SplitPanes, ContextMenu, etc.).
- **Input**: `{ query: string }`

### 7. `search_components`
- **Description**: Queries component implementations for a specific UX pattern across adapters.
- **Input**: `{ patternId: string, adapterId?: string }`

### 8. `get_design_tokens`
- **Description**: Compiles technology-agnostic DTCG tokens into `css`, `scss`, `typescript`, or `tailwind-json`.
- **Input**: `{ format: "css"|"scss"|"typescript"|"tailwind-json" }`

### 9. `create_design_plan`
- **Description**: Produces a structured 4-phase design execution plan for NEW, REPAIR, or MODERNIZE workflows.
- **Input**: `{ mode: "NEW"|"REPAIR"|"MODERNIZE", productName: string, adapterId: string, briefOrProfile: object }`

### 10. `audit_existing_ui`
- **Description**: Audits stylesheets and markup for hardcoded colors, broken layouts, and token inconsistency.
- **Input**: `{ projectPath: string }`

### 11. `audit_accessibility`
- **Description**: Audits HTML and component markup for WCAG 2.1 AA/AAA compliance issues.
- **Input**: `{ projectPath: string, targetLevel?: "WCAG_2_1_AA"|"WCAG_2_1_AAA" }`

### 12. `audit_responsive`
- **Description**: Checks media queries, flex/grid rules, and viewport adaptability.
- **Input**: `{ projectPath: string }`

### 13. `recommend_modernization`
- **Description**: Generates a staged 4-phase modernization strategy for legacy codebases.
- **Input**: `{ projectPath: string, targetAdapter?: string }`

### 14. `search_public_apis`
- **Description**: Discovers verified public APIs from the local discovery index.
- **Input**: `{ query: string, category?: string }`

### 15. `search_mcp_servers`
- **Description**: Discovers verified MCP servers from the local awesome-mcp-servers index.
- **Input**: `{ query: string, category?: string }`
