---
name: alper-design-new
description: Greenfield product design workflow. Takes product concept, runs domain intelligence, selects appropriate adapter, generates design tokens and architectural design plans.
---

# Alper Design OS - NEW Mode

Used when bootstrapping a new product, system, or module from scratch.

## Step-by-Step Procedure

1. **Understand Product & Domain**:
   - Invoke `understand_product` or `research_domain` MCP tools.
   - Clarify domain constraints (e.g. manufacturing scheduling, financial trading, developer tooling).
   - Produce a validated `ProductUXProfile`.

2. **Select Stack Adapter**:
   - Match technology requirements to available adapters:
     - `generic-web` (vanilla standards-based)
     - `html-css-js` (HTML5 + CSS3 + JS)
     - `react` (JavaScript React)
     - `react-typescript` (strict TypeScript React)
     - `php` (native PHP templates)
     - `laravel-blade` (Laravel + Blade components)
     - `aspnet-razor` (ASP.NET Core Razor Pages / Blazor)

3. **Compile Design Tokens**:
   - Query `get_design_tokens` for base, semantic, and density-tuned tokens.
   - Compile into adapter-compatible format (CSS variables, SCSS, Tailwind config, TS tokens).

4. **Recommend UX Patterns**:
   - Query `recommend_ux_patterns` with the `ProductUXProfile`.
   - Incorporate required patterns (e.g. split panes, dense grids, Gantt timeline, shortcut managers).

5. **Generate Design Plan**:
   - Call `create_design_plan` to outline file scaffolding, component hierarchy, accessibility rules, and token wiring.
   - Present plan to user for review before writing files.
