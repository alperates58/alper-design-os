---
name: alper-pattern-graph
description: Navigates and applies the 28 technology-independent UX patterns (Gantt, Dense Grid, Command Palette, etc.). Use when selecting optimal layout and interaction patterns for complex workflows. Do not use for compiling blueprints into concrete react or blade syntax (use alper-cross-stack-rendering).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
mcpTools:
  - recommend_ux_patterns
  - search_design_patterns
  - search_patterns
  - inspect_pattern
relatedSkills:
  - alper-ui-blueprint
  - alper-domain-intelligence
  - alper-design-language
---

# Alper UX Pattern Graph Skill

## PURPOSE
Navigates the knowledge graph of 28 canonical technology-independent UX patterns (Split-Pane, Gantt, Dense DataGrid, Command Palette, Master-Detail, etc.), recommending optimal interaction patterns based on data density.

## USE WHEN
- Selecting optimal layout and interaction patterns for complex workflows.
- Designing expert user interfaces requiring fast keyboard navigation and dense information displays.
- Looking up interaction rules and state contracts for standard enterprise UI patterns.

## DO NOT USE WHEN
- Compiling blueprints into concrete React or Blade syntax (use alper-cross-stack-rendering).
- Tuning SQL queries (use alper-sql-performance).
- Conducting security threat modeling (use alper-security-audit).

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
1. Match user workflow requirements against UX pattern graph.
2. Retrieve pattern specifications (regions, states, keyboard triggers, accessibility constraints).
3. Recommend complementary pattern combinations (e.g. Master-Detail + Command Palette).
4. Supply pattern contracts to alper-ui-blueprint.

## DECISION RULES
- Ergonomic Rule: High-density operational domains require keyboard shortcut support on all core patterns.
- Never recommend mobile-first drawer patterns for multi-monitor desktop operator workflows.

## MCP TOOL STRATEGY
- `recommend_ux_patterns`: Canonical handler for recommend ux patterns. Always pass required schema arguments; handle return states deterministically.
- `search_design_patterns`: Canonical handler for search design patterns. Always pass required schema arguments; handle return states deterministically.
- `search_patterns`: Canonical handler for search patterns. Always pass required schema arguments; handle return states deterministically.
- `inspect_pattern`: Canonical handler for inspect pattern. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: 28 technology-independent canonical UX patterns, ergonomics standards, and interaction guidelines.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of non-standard interaction models or complex multi-pane layouts.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- UXPatternRecommendationList with pattern contracts and ergonomic requirements.

## HANDOFF / RELATED SKILLS
- `alper-ui-blueprint`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-domain-intelligence`: Downstream or sibling capability for PRODUCT_DISCOVERY operations.
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
