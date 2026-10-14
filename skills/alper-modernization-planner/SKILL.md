---
name: alper-modernization-planner
description: Formulates staged modernization plans, change classification, and candidate design directions. Use when migrating a legacy application to modern styling, design tokens, or framework components. Do not use for building a clean-sheet greenfield app from scratch (use alper-greenfield-generator).
status: ACTIVE
capabilityFamily: MODERNIZATION
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
mcpTools:
  - create_modernization_intent
  - select_modernization_strategy
  - create_modernization_plan
  - create_modernization_stages
  - classify_existing_elements
  - recommend_modernization
relatedSkills:
  - alper-behavior-preservation
  - alper-modernization-review
  - alper-refactoring-strategy
---

# Alper Modernization Planner Skill

## PURPOSE
Engineers phased, non-destructive migration roadmaps for legacy codebases (e.g. PHP/Blade, ASP.NET WebForms/Razor), breaking migrations into incremental, continuously buildable stages.

## USE WHEN
- Migrating a legacy application to modern styling, design tokens, or framework components.
- Classifying hundreds of legacy elements into KEEP, IMPROVE, REPLACE, DEFER, or REMOVE.
- Formulating a multi-stage modernization roadmap with rollback safety checkpoints.

## DO NOT USE WHEN
- Building a clean-sheet greenfield app from scratch (use alper-greenfield-generator).
- Fixing a single isolated UI padding or button bug (use alper-design-repair).
- Executing uncoordinated bulk rewrites without behavioral baseline freezing.

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## MODERNIZATION REASONING & STRANGLER FIG DISCIPLINE
- **Strangler Fig Migration**: Deconstruct legacy applications incrementally by routing specific traffic slices to modernized services.
- **Anti-Corruption Layer (ACL)**: Define typed boundary adapters between legacy domain objects and modernized clean-architecture models.
- **Dual-Run & Canary Parity**: Run legacy and new components in parallel; compare output parity before retiring legacy execution paths.
- **Scope Isolation**: Restrict refactoring to declared bounded contexts; strictly prohibit opportunistic out-of-scope rewrites.
- **Zero Greenfield Scaffolding**: Modernization plans must never execute clean-sheet greenfield scaffolding over an existing repository.

## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: REQUIRED**
This skill strictly requires reading durable project memory from `.alper-design-os/project/` (manifest, architecture graph, ADRs, behavioral contracts) before planning or executing actions. Missing memory triggers explicit initialization or drift detection.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: CLARIFY_AMBIGUITY**
If input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in `DEFINED / NOT_VERIFIED` state until clarified.

## WORKFLOW
1. Ingest ExistingProjectProfile and operator modernization intent.
2. Classify candidate components and files across the 5 element classes.
3. Select modernization strategy (Design Tokens -> Shell -> Core Components -> Full Parity).
4. Generate multi-stage ModernizationPlan with explicit entry/exit criteria for each stage.
5. Hand off to alper-behavior-preservation to freeze baseline contracts.

## DECISION RULES
- Never propose wholesale rewrites when incremental strangler modernization is feasible.
- Every modernization stage must leave the codebase in a compilable, testable state.

## MCP TOOL STRATEGY
- `create_modernization_intent`: Canonical handler for create modernization intent. Always pass required schema arguments; handle return states deterministically.
- `select_modernization_strategy`: Canonical handler for select modernization strategy. Always pass required schema arguments; handle return states deterministically.
- `create_modernization_plan`: Canonical handler for create modernization plan. Always pass required schema arguments; handle return states deterministically.
- `create_modernization_stages`: Canonical handler for create modernization stages. Always pass required schema arguments; handle return states deterministically.
- `classify_existing_elements`: Canonical handler for classify existing elements. Always pass required schema arguments; handle return states deterministically.
- `recommend_modernization`: Canonical handler for recommend modernization. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Target modern framework standards, Design Token Community Group (DTCG) specs, and Strangler Fig patterns.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator sign-off on Element Classification Matrix (KEEP/IMPROVE/REPLACE/DEFER/REMOVE).
- Approval of ModernizationStages roadmap before stage execution.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` or `BLOCKED_BY_AMBIGUITY`.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `HEURISTIC_REVIEW`, `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ModernizationPlan, ElementClassificationMatrix, and ModernizationStage definitions.

## HANDOFF / RELATED SKILLS
- `alper-behavior-preservation`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-modernization-review`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-refactoring-strategy`: Downstream or sibling capability for MODERNIZATION operations.
