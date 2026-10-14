---
name: alper-greenfield-generator
description: Orchestrates master greenfield project generation, implementation plans, code scaffolding across 4 production stacks, and evidence-backed completion evaluation.
---

# Alper Greenfield Generator Skill

Orchestrates the greenfield development lifecycle from validated discovery to runnable codebase across React + TypeScript, Laravel Blade, ASP.NET Razor, and Plain HTML/CSS/JS while enforcing the universal invariant: **NO CLAIM WITHOUT EVIDENCE**.

## Pipeline Position
`DISCOVERY READY -> PROJECT BLUEPRINT -> IMPLEMENTATION PLAN -> SCAFFOLD -> BUILD/RUN -> EVIDENCE VERIFY`

## Core Responsibilities
1. **Downstream Discovery Guard**:
   - Never bypass clarification: if `profile.discoveryReadiness.state !== 'READY'` or `create_database_blueprint` / `create_page_inventory` returns `status: 'NEEDS_CLARIFICATION'`, halt blueprint/scaffolding and return the prioritized `clarifyingQuestions` to the user.
   - Ensure derived `acceptanceCriteria` start in `DEFINED` / `NOT_VERIFIED` (`verified: false`) until real verification evidence is recorded.
2. **Master Blueprint & Stack-Aware Assembly**:
   - Synthesize requirements, architecture (supporting `MONOLITH`, `MODULAR_MONOLITH`, `CLIENT_SERVER`, `SERVICE_ORIENTED`, `MICROSERVICES`, `STATIC_FIRST`), stack (marking unrequested stack choices as `REVERSIBLE_ASSUMPTION`), grounded database entities, API, auth, and page inventory into `NewProjectBlueprint`.
3. **Multi-Stack Buildable Scaffolding**:
   - Generate genuine, buildable project structures:
     - `REACT_TYPESCRIPT`: Complete Vite structure (`package.json` with `@vitejs/plugin-react`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`, `src/styles/tokens.css`, `src/App.tsx`).
     - `LARAVEL_BLADE`: `composer.json`, `routes/web.php`, controllers, Blade views with `@csrf`, CSS bridge, and PHP/Composer Dockerfile when Docker is requested.
     - `ASPNET_RAZOR`: `App.csproj`, `Program.cs`, controllers, Razor views with `@Html.AntiForgeryToken()`, CSS tokens, and dotnet SDK/ASP.NET runtime Dockerfile when Docker is requested.
     - `PLAIN_HTML_CSS_JS`: `index.html`, semantic responsive layout, `styles.css`, vanilla `app.js` with zero npm dependencies, and `nginx:alpine` Dockerfile only when Docker is requested.
   - Omit `Dockerfile` and `docker-compose.yml` when `deploymentEnvironment` does not require Docker (e.g., `LOCAL_ONLY`, `STANDALONE_HOST`, `SERVERLESS`).
   - Report `filesGenerated` truthfully while keeping `buildStatus: 'NOT_VERIFIED'`, `buildable: false`, and `syntaxValid: false` until actual build/validation evidence is supplied.
4. **Evidence Taxonomy Verification**:
   - Evaluate completion via `evaluate_new_project_completion` strictly enforcing the Gate-Specific Evidence Taxonomy: missing evidence resolves to `NOT_VERIFIED`, failed evidence to `FAILED`, and `HUMAN_REVIEW` only satisfies gates whose policy explicitly allows it.

## Associated MCP Tools
- `create_project_blueprint`: Assembles master `NewProjectBlueprint` (blocks when discovery is incomplete).
- `create_project_implementation_plan`: Generates staged execution plan.
- `scaffold_new_project`: Emits concrete file tree to disk with truthful `buildStatus`.
- `evaluate_new_project_completion`: Validates quality gates strictly against qualifying evidence.
