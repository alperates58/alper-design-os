# ALPER DESIGN OS — FAZ 1H.1: Architecture Integrity Remediation

## 1. Objective & Universal Invariant

Phase 1H.1 remediates all P0 findings from Independent Read-Only Audit A1 (`F-01`, `F-02`, `F-03`, `F-04`, `F-05`, `F-07`, `F-10`) before Skill Architecture consolidation begins.

Every layer of the system enforces the universal invariant:

> **NO CLAIM WITHOUT EVIDENCE.**
> Missing or undefined evidence resolves to `NOT_VERIFIED` or an explicit blocked/incomplete state (`NEEDS_CLARIFICATION`, `BLOCKED_BY_AMBIGUITY`, `NOT_INITIALIZED`, `INSUFFICIENT_DATA`) — never to `PASS` or `VERIFIED`.

---

## 2. Remediated Audit A1 Blockers

### F-01 — MCP Server Desynchronization
- **Root Cause**: `packages/mcp-server/src/tools/index.ts` defined 124 handlers while `packages/mcp-server/src/server.ts` maintained a separate hardcoded `TOOL_DEFINITIONS` list and `switch (name)` statement with only 97 tools, leaving Phase 1G (Greenfield) and Phase 1H (Project Intelligence) tools unexposed over MCP.
- **Remediation**:
  - Created `McpToolDefinition` and `createCanonicalToolDefinitions` in `packages/mcp-server/src/tools/definitions.ts` and exported `CANONICAL_TOOL_DEFINITIONS` and `canonicalToolRegistry` from `packages/mcp-server/src/tools/index.ts`.
  - Replaced the duplicated `TOOL_DEFINITIONS` and manual `switch (name)` in `packages/mcp-server/src/server.ts` with `canonicalToolRegistry`-driven `getToolDefinitions()`, `getRegisteredToolCount()`, and `dispatchCanonicalToolCall()`.
  - Synchronized compiled `packages/mcp-server/dist/` artifacts and added source-to-dist parity tests.

### F-02 — Self-Falsified Greenfield Verification
- **Root Cause**:
  1. `deriveRequirements` initialized `acceptanceCriteria` with `verified: true`.
  2. `evaluateNewProjectCompletion` marked gates with `undefined` evidence as `VERIFIED` with `HIGH` assurance.
  3. `scaffoldNewProject` hardcoded `buildable: true` and `syntaxValid: true` without running a build.
- **Remediation**:
  - `deriveRequirements` now initializes `acceptanceCriteria` with `verified: false`, `status: 'DEFINED'`, and `verificationStatus: 'NOT_VERIFIED'`.
  - `evaluateNewProjectCompletion` strictly enforces the Gate-Specific Evidence Taxonomy: missing evidence resolves to `NOT_VERIFIED` (`isComplete: false`), failed evidence resolves to `FAILED`, and `HUMAN_REVIEW` only satisfies gates whose policy explicitly allows it (`visualAI`, `ux`).
  - `scaffoldNewProject` reports `filesGeneratedCount > 0` with `buildStatus: 'NOT_VERIFIED'`, `buildable: false`, and `syntaxValid: false` unless `verifiedBuildEvidence` is supplied.

### F-03 — Hardcoded Project Intelligence
- **Root Cause**:
  1. `buildProjectArchitectureGraph` injected `AppCore`, `DataModule`, `inventory_items`, and `/api/v1/items` even on an empty directory.
  2. `initializeProjectIntelligence` and `createProjectSnapshot` populated fake routes (`['/dashboard', '/items', '/health']`) and fake fingerprints (`'fp-tables-users-items'`).
  3. `analyzeChangeImpact` returned hardcoded `DataModule` and `POST /api/v1/auth/login`.
  4. `evaluateProjectKnowledgeHealth` started at `let coverage = 90`, reporting `EXCELLENT` on an empty/uninitialized project.
- **Remediation**:
  - Added `discoverRepositoryArtifacts(baseDir)` in `packages/agent-governance/src/project-intelligence-engine.ts` to inspect real repository manifests, migrations/schemas, routes/controllers/OpenAPI specs, UI views/pages, CSS tokens, and tests.
  - `buildProjectArchitectureGraph` constructs nodes and edges only from real repository files and explicit `codeArtifacts`, returning `completeness: 'EMPTY'` on an empty directory.
  - `createProjectSnapshot` returns `routeInventory: []`, `apiInventory: []`, and `'NOT_VERIFIED'` fingerprints when artifacts are absent.
  - `analyzeChangeImpact` traverses real `ProjectArchitectureGraph` edges, ADRs, business rules, and invariants.
  - `evaluateProjectKnowledgeHealth` returns `NOT_INITIALIZED` (`0%`) when uninitialized and `INSUFFICIENT_DATA` (`0%`) when empty.

### F-04 — Missing Discovery / Ambiguity Gate
- **Root Cause**: Ambiguous one-line prompts (e.g., `"Build me an APS"`) bypassed discovery and generated arbitrary CRUD blueprints.
- **Remediation**:
  - Implemented `RequestComplexityClassification` (`CLEAR_BOUNDED_TASK`, `STANDARD_PRODUCT`, `AMBIGUOUS_PRODUCT`, `HIGH_COMPLEXITY_PRODUCT`, `INSUFFICIENT_CONTEXT`) and first-class `DiscoveryReadiness` (`READY`, `NEEDS_CLARIFICATION`, `BLOCKED_BY_AMBIGUITY`) with progressive questioning (capped at 3–5 highest-impact questions).
  - Enforced the Downstream Discovery Guard in `createNewProjectBlueprint`, `createDatabaseBlueprint`, and `createPageInventory`.

### F-05 — Naive Entity/Database Generation & Broken Stack Scaffolds
- **Root Cause**:
  1. `createDatabaseBlueprint` took the first word of a job phrase (`"Manage orders"`) and pluralized the verb into table `"manages"`, or fell back to `PrimaryEntity` / `items` / `records`.
  2. `REACT_TYPESCRIPT` scaffolds omitted `index.html`, `src/main.tsx`, and `@vitejs/plugin-react`.
  3. Non-Node stacks (`LARAVEL_BLADE`, `ASPNET_RAZOR`, `PLAIN_HTML_CSS_JS`) received a Node `Dockerfile`, and Dockerfiles were generated even when `deploymentEnvironment` was `LOCAL_ONLY`.
- **Remediation**:
  - Implemented `extractGroundedDomainEntities` with `PROHIBITED_VERB_OR_GENERIC_ENTITIES` to strip action verbs and extract grounded domain nouns, returning `status: 'NEEDS_CLARIFICATION'` when no grounded entities exist in production mode.
  - Completed `REACT_TYPESCRIPT` Vite scaffold (`index.html`, `src/main.tsx`, `src/vite-env.d.ts`, `@vitejs/plugin-react`, valid `tsconfig.json`).
  - Added stack-native Docker templates (Node for React, PHP/Composer for Laravel Blade, dotnet SDK/ASP.NET runtime for Razor, `nginx:alpine` for Plain Web) generated only when `deploymentEnvironment` requires Docker.

### F-07 — MCP Handlers Dropping Declared Arguments
- **Root Cause**: Handlers such as `evaluate_release_gates`, `generate_adr`, `create_verification_plan`, `create_page_blueprint`, and `render_blueprint` accepted schema fields that were ignored in implementation.
- **Remediation**:
  - Wired `profile` policy overrides and `criticalTestsFailed` in `handleEvaluateReleaseGates`.
  - Wired `number` and `consequences.neutral` in `handleGenerateADR` and `createArchitectureDecisionRecord`.
  - Wired `isUI` and `isSecuritySensitive` in `handleCreateVerificationPlan` and `planPipeline`.
  - Wired `id` and `title` in `handleCreatePageBlueprint` and `blueprintId` resolution in `handleRenderBlueprint`.
  - Wired `DomainIntelligenceV2Engine` into `handleResearchDomain` and removed APS-specific terminology from generic `design-core` fallbacks.

### F-10 — Business-Rule Knowledge Poisoning
- **Root Cause**: `recordBusinessRule` used `input.source.includes('Alper')` to mark rules `VERIFIED`, allowing an unverified inference string like `"Inferred by model for Alper"` to become `VERIFIED` truth.
- **Remediation**:
  - Introduced `BusinessRuleSourceType` (`EXPLICIT_USER_SPECIFICATION`, `VERIFIED_CODE_FACT`, `APPROVED_REQUIREMENT`, `REGULATORY_SOURCE`, `AUTHORITATIVE_DOCUMENT`, `DOMAIN_RESEARCH`, `SYSTEM_INFERENCE`, `MODEL_INFERENCE`, `UNKNOWN`) and `evaluateBusinessRuleVerification`.
  - Removed all substring heuristics (`includes('Alper')`). Rules with inference/unknown source types or lacking user confirmation / evidence references remain `UNVERIFIED`.
