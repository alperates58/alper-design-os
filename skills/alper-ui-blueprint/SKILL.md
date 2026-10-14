---
name: alper-ui-blueprint
description: Declarative UI Blueprint DSL for pages, components, and app shells with state contracts. Use when creating declarative pageblueprints and componentblueprints for application pages. Do not use for directly editing css classes or concrete html (use alper-cross-stack-rendering or alper-design-repair).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: INTERNAL_ORCHESTRATION
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - create_page_blueprint
  - create_component_blueprint
  - create_app_shell_blueprint
  - create_page_inventory
relatedSkills:
  - alper-pattern-graph
  - alper-cross-stack-rendering
  - alper-design-language
---

# Alper UI Blueprint DSL Skill

## PURPOSE
Internal DSL engine that models page layouts, responsive regions, navigation hierarchies, and component state machines in a technology-neutral declarative format prior to stack compilation.

## USE WHEN
- Creating declarative PageBlueprints and ComponentBlueprints for application pages.
- Defining app shell structures with responsive navigation, headers, and status bars.
- Establishing component state contracts (empty, loading, populated, error).

## DO NOT USE WHEN
- Directly editing CSS classes or concrete HTML (use alper-cross-stack-rendering or alper-design-repair).
- Designing backend database tables (use alper-database-designer).
- Diagnosing slow SQL queries (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- UI wireframes, page layouts, component markup, or browser DOM.
- Design token definitions (tokens.json, tokens.css) and theme configurations.
- Stated user personas and target operational density.

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Ingest page requirements and selected UX patterns.
2. Assemble declarative PageBlueprint defining layout regions and component hierarchy.
3. Specify state machines and accessibility roles for each component.
4. Output validated blueprint to downstream renderers.

## DECISION RULES
- Technology Neutrality: Blueprints must never contain stack-specific JSX or Blade directives.
- Every blueprint must define responsive behaviors across Mobile, Tablet, and Desktop.

## MCP TOOL STRATEGY
- `create_page_blueprint`: Canonical handler for create page blueprint. Always pass required schema arguments; handle return states deterministically.
- `create_component_blueprint`: Canonical handler for create component blueprint. Always pass required schema arguments; handle return states deterministically.
- `create_app_shell_blueprint`: Canonical handler for create app shell blueprint. Always pass required schema arguments; handle return states deterministically.
- `create_page_inventory`: Canonical handler for create page inventory. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Declarative UI Blueprint DSL specification, component state machines, and ARIA contracts.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Designer / architect review of master PageBlueprint before stack rendering.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- PageBlueprint, ComponentBlueprint, and AppShellBlueprint specifications.

## HANDOFF / RELATED SKILLS
- `alper-pattern-graph`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-cross-stack-rendering`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
