---
name: alper-greenfield-generator
description: Orchestrates master greenfield project generation, implementation plans, code scaffolding across 4 production stacks, and verification completion evaluation.
---

# Alper Greenfield Generator Skill

Orchestrates the entire greenfield development lifecycle from concept to runnable codebase across React + TypeScript, Laravel Blade, ASP.NET Razor, and Plain HTML/CSS/JS.

## Pipeline Position
`PROJECT BLUEPRINT -> IMPLEMENTATION PLAN -> SCAFFOLD -> RUN -> VERIFY`

## Core Responsibilities
1. **Master Blueprint Assembly**:
   - Synthesize requirements, architecture, stack, database, API, auth, and page inventory into a unified `NewProjectBlueprint`.
2. **Staged Implementation Planning**:
   - Create progressive execution stages: `STAGE_1_FOUNDATION`, `STAGE_2_DATA_MODEL`, `STAGE_3_API_SURFACE`, `STAGE_4_AUTH`, `STAGE_5_APP_SHELL`, `STAGE_6_CORE_WORKFLOW`, `STAGE_7_QA_HARDENING`.
3. **Multi-Stack Buildable Scaffolding**:
   - Generate genuine, buildable project structures:
     - `REACT_TYPESCRIPT`: Vite config, package.json, TypeScript configs, tokens.css, App.tsx, router, api client, components.
     - `LARAVEL_BLADE`: composer.json, routes/web.php, controllers, Blade views with `@csrf`, CSS bridge.
     - `ASPNET_RAZOR`: .csproj, Program.cs, controllers, Razor views with AntiForgery, site.css.
     - `PLAIN_HTML_CSS_JS`: index.html, semantic responsive layout, styles.css, vanilla app.js with zero framework dependencies.
   - Enforce Truthful UI (zero fake telemetry; all sample data explicitly labeled `[DEMO_DATA]`).
   - Include Dockerfile, docker-compose.yml, .env.example, and README.md.
4. **Evidence Taxonomy Verification**:
   - Evaluate completion via `evaluate_new_project_completion` using Evidence Taxonomy gates (`STATIC_ANALYSIS`, `UNIT_TEST`, `INTEGRATION_TEST`, `RUNTIME_CHECK`, `BROWSER_TEST`, `HUMAN_REVIEW`) and required assurance levels.

## Associated MCP Tools
- `create_project_blueprint`: Assembles master `NewProjectBlueprint`.
- `create_project_implementation_plan`: Generates staged execution plan.
- `scaffold_new_project`: Emits concrete file tree to disk.
- `evaluate_new_project_completion`: Validates quality gates without evidence inflation.
