---
name: alper-ui-recipe
description: Canonical UI recipes defining standard layouts, responsive regions, and component interactions. Use when bootstrapping standard page structures using proven enterprise layout recipes. Do not use for creating database schemas (use alper-database-designer).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
mcpTools:
  - create_ui_recipe
relatedSkills:
  - alper-ui-blueprint
  - alper-pattern-graph
  - alper-design-language
---

# Alper UI Recipes Skill

## PURPOSE
Provides battle-tested, canonical UI recipe templates (e.g. Master-Detail Workbench, Analytics Dashboard, Form Wizard, Data Grid Table) ensuring standard layouts are constructed with ergonomic consistency.

## USE WHEN
- Bootstrapping standard page structures using proven enterprise layout recipes.
- Ensuring responsive multi-region layouts follow standardized breakpoint behaviors.
- Referencing component composition recipes.

## DO NOT USE WHEN
- Creating database schemas (use alper-database-designer).
- Running security vulnerability scans (use alper-security-audit).
- Fixing backend API endpoints (use alper-api-designer).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**.
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
1. Identify target layout recipe from task brief.
2. Configure recipe parameters (column counts, collapsible sidebar, toolbar actions).
3. Emit declarative recipe structure to alper-ui-blueprint.

## DECISION RULES
- Recipes must remain framework-neutral until rendered.
- Responsive folding rules must be specified for all grid regions.

## MCP TOOL STRATEGY
- `create_ui_recipe`: Canonical handler for create ui recipe. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Canonical UI recipe library, responsive grid standards, and multi-pane workbench layouts.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- None required for standard recipe retrieval.

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
- UIRecipeSpecification with region layouts and component slots.

## HANDOFF / RELATED SKILLS
- `alper-ui-blueprint`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-pattern-graph`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
