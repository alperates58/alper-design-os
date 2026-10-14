---
name: alper-greenfield-generator
description: Master greenfield orchestrator enforcing Discovery Gate, scaffold correctness, and completion contract. Use when user requests scaffolding a brand new, clean-sheet project across supported production stacks. Do not use for modifying or refactoring an existing repository (use alper-modernization-planner or alper-design-repair).
status: ACTIVE
capabilityFamily: GREENFIELD_ENGINEERING
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
mcpTools:
  - create_project_blueprint
  - create_project_implementation_plan
  - scaffold_new_project
  - evaluate_new_project_completion
  - recommend_stack
relatedSkills:
  - alper-requirements-engineering
  - alper-greenfield-product-analysis
  - alper-database-designer
  - alper-api-designer
---

# Alper Greenfield Project Generator Skill

## PURPOSE
Orchestrates the entire clean-sheet greenfield lifecycle across 4 production stacks (React+Vite, Laravel Blade, ASP.NET Razor, Plain HTML), enforcing discovery gates, reversible assumptions, and honest build verification.

## USE WHEN
- User requests scaffolding a brand new, clean-sheet project across supported production stacks.
- Assembling the master NewProjectBlueprint from requirements, architecture, schema, and UI inventories.
- Evaluating greenfield project completion against Gate-Specific Evidence Taxonomy.

## DO NOT USE WHEN
- Modifying or refactoring an existing repository (use alper-modernization-planner or alper-design-repair).
- Scaffolding before DiscoveryReadiness is formally evaluated and set to READY (use alper-greenfield-product-analysis).
- Diagnosing query bottlenecks in production databases (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## GREENFIELD LIFECYCLE PIPELINE
```
DISCOVERY (Product Analysis)
   ↓
DOMAIN RESEARCH (Operational Constraints)
   ↓
REQUIREMENTS & RTM (Acceptance Criteria in NOT_VERIFIED)
   ↓
ARCHITECTURE & STACK (Modular Monolith / Complexity <= 3)
   ↓
DATA / API / AUTH (3NF Blueprint & OpenAPI 3.1)
   ↓
UX BLUEPRINT (Technology-Neutral Page DSL)
   ↓
IMPLEMENTATION PLAN (7-Phase Staged Plan)
   ↓
SCAFFOLDING (Buildable Files on Disk)
   ↓
VERIFICATION (Evidence Taxonomy Validation)
```

## STACK SCAFFOLDING INVARIANTS
- **REACT_TYPESCRIPT**: Vite 5+, React 18+, TypeScript strict, `@vitejs/plugin-react`, DTCG tokens in `src/styles/tokens.css`.
- **LARAVEL_BLADE**: Laravel 11+, PHP 8.2+, explicit web routes, Blade templates with `@csrf`, CSRF headers.
- **ASPNET_RAZOR**: .NET 8/9 ASP.NET Core, `App.csproj`, Program.cs, Antiforgery middleware, Razor pages.
- **PLAIN_HTML_CSS_JS**: Zero-build vanilla HTML5, responsive CSS custom properties, vanilla DOM JS.
- **Docker Policy**: Omit Dockerfile / compose unless deployment target explicitly specifies Docker.
- **Build Status Invariant**: Scaffolding outputs `buildStatus: 'NOT_VERIFIED'` and `buildable: false` until authentic compiler evidence is captured.

## REQUIRED CONTEXT
- Raw product brief, problem statement, or functional specification.
- Target user roles, operational workflows, and domain constraints.
- Technology stack preferences or architectural invariants.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: STRICT_BLOCK**
If upstream discovery readiness check is `NEEDS_CLARIFICATION` or requirements are missing technical grounding, this skill MUST HALT immediately. Scaffolding, file generation, or destructive changes are categorically blocked until ambiguity is formally resolved.

## WORKFLOW
1. Verify DiscoveryReadiness === READY; if not, halt and return clarifying questions.
2. Assemble master ProjectBlueprint integrating stack, architecture, entities, APIs, and pages.
3. Formulate staged 7-phase ImplementationPlan.
4. Scaffold genuine, buildable project directory structure.
5. Report files generated with buildStatus: NOT_VERIFIED until authentic build evidence is captured.

## DECISION RULES
- Greenfield ONLY: Brownfield or partial rewrite requests must be routed to alper-modernization-planner.
- Build Truth Invariant: Generated files != BUILDABLE project. Never report buildable: true without compiler exit code 0 evidence.
- Omit Dockerfile/Compose when deploymentEnvironment is LOCAL_ONLY or STANDALONE.

## MCP TOOL STRATEGY
- `create_project_blueprint`: Canonical handler for create project blueprint. Always pass required schema arguments; handle return states deterministically.
- `create_project_implementation_plan`: Canonical handler for create project implementation plan. Always pass required schema arguments; handle return states deterministically.
- `scaffold_new_project`: Canonical handler for scaffold new project. Always pass required schema arguments; handle return states deterministically.
- `evaluate_new_project_completion`: Canonical handler for evaluate new project completion. Always pass required schema arguments; handle return states deterministically.
- `recommend_stack`: Canonical handler for recommend stack. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Official production stack templates (Vite React-TS strict, Laravel 11 Blade, ASP.NET Core 8/9 Razor, Plain HTML5).
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator sign-off on master ProjectBlueprint before scaffolding files to disk.
- Stack selection confirmation when unrequested choices are marked as REVERSIBLE_ASSUMPTION.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `BUILD_OUTPUT`, `STATIC_ANALYSIS`, `UNIT_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- Scaffolded project directory, Master ProjectBlueprint, and CompletionEvaluationReport.

## HANDOFF / RELATED SKILLS
- `alper-requirements-engineering`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
- `alper-greenfield-product-analysis`: Downstream or sibling capability for PRODUCT_DISCOVERY operations.
- `alper-database-designer`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-api-designer`: Downstream or sibling capability for API_ENGINEERING operations.
