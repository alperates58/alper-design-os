---
name: alper-source-intelligence
description: Discovers, inspects, ranks, and licenses 65+ authoritative design systems, primitives, and icon/chart libraries. Use when finding the best component library, icon system, or chart library for a project. Do not use for designing database tables or sql migrations (use alper-database-designer).
status: ACTIVE
capabilityFamily: SOURCE_INTELLIGENCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - discover_sources
  - search_sources
  - rank_sources
  - inspect_source
  - recommend_sources_for_product
  - recommend_sources_for_stack
  - check_source_license
  - discover_design_sources
  - search_design_sources
  - inspect_design_source
  - sync_design_sources
  - recommend_design_sources
  - recommend_icon_system
  - recommend_chart_library
  - recommend_data_grid
  - explain_source_recommendation
  - search_components
  - search_mcp_servers
relatedSkills:
  - alper-registry-discovery
  - alper-design-language
  - alper-supply-chain-security
---

# Alper Source Intelligence Skill

## PURPOSE
Searches, ranks, and inspects authoritative design systems, headless UI primitives, icon libraries, charts, and data grids using weighted multi-criteria ranking and license compliance checking.

## USE WHEN
- Finding the best component library, icon system, or chart library for a project.
- Evaluating design system licenses (MIT, Apache 2.0 vs copyleft GPL) and maintenance health.
- Inspecting technical metadata (bundle size, accessibility support, TypeScript quality) for candidate dependencies.

## DO NOT USE WHEN
- Designing database tables or SQL migrations (use alper-database-designer).
- Scaffolding raw project files (use alper-greenfield-generator).
- Fixing local CSS overflow bugs (use alper-design-repair).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Ingest product requirements, target framework, and license constraints.
2. Search catalog of 65+ authoritative design sources.
3. Rank candidates using 5-criteria weighted model (Adoption, A11y, Tokens, TS, License).
4. Check SPDX license compatibility and flag restrictions.
5. Output recommendation with explainability breakdown.

## DECISION RULES
- License Guard: Non-permissive licenses (GPL, AGPL) must be prominently flagged and require operator approval.
- Never recommend unmaintained or deprecated libraries when robust modern alternatives exist.

## MCP TOOL STRATEGY
- `discover_sources`: Canonical handler for discover sources. Always pass required schema arguments; handle return states deterministically.
- `search_sources`: Canonical handler for search sources. Always pass required schema arguments; handle return states deterministically.
- `rank_sources`: Canonical handler for rank sources. Always pass required schema arguments; handle return states deterministically.
- `inspect_source`: Canonical handler for inspect source. Always pass required schema arguments; handle return states deterministically.
- `recommend_sources_for_product`: Canonical handler for recommend sources for product. Always pass required schema arguments; handle return states deterministically.
- `recommend_sources_for_stack`: Canonical handler for recommend sources for stack. Always pass required schema arguments; handle return states deterministically.
- `check_source_license`: Canonical handler for check source license. Always pass required schema arguments; handle return states deterministically.
- `discover_design_sources`: Canonical handler for discover design sources. Always pass required schema arguments; handle return states deterministically.
- `search_design_sources`: Canonical handler for search design sources. Always pass required schema arguments; handle return states deterministically.
- `inspect_design_source`: Canonical handler for inspect design source. Always pass required schema arguments; handle return states deterministically.
- `sync_design_sources`: Canonical handler for sync design sources. Always pass required schema arguments; handle return states deterministically.
- `recommend_design_sources`: Canonical handler for recommend design sources. Always pass required schema arguments; handle return states deterministically.
- `recommend_icon_system`: Canonical handler for recommend icon system. Always pass required schema arguments; handle return states deterministically.
- `recommend_chart_library`: Canonical handler for recommend chart library. Always pass required schema arguments; handle return states deterministically.
- `recommend_data_grid`: Canonical handler for recommend data grid. Always pass required schema arguments; handle return states deterministically.
- `explain_source_recommendation`: Canonical handler for explain source recommendation. Always pass required schema arguments; handle return states deterministically.
- `search_components`: Canonical handler for search components. Always pass required schema arguments; handle return states deterministically.
- `search_mcp_servers`: Canonical handler for search mcp servers. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: 65+ curated design systems (Radix, Shadcn, Tailwind, MUI, Ant, Fluent), package registries, and SPDX license databases.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator approval when selecting dependencies with copyleft or restrictive licenses.

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
- SourceRecommendationList with ranking scores and license verification.

## HANDOFF / RELATED SKILLS
- `alper-registry-discovery`: Downstream or sibling capability for SOURCE_INTELLIGENCE operations.
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-supply-chain-security`: Downstream or sibling capability for SECURITY operations.
