---
name: alper-registry-discovery
description: Discovers and inspects community blocks and component registries (shadcn/ui, Aceternity, Kokonut). Use when searching for ready-made shadcn/ui or community registry components (e.g. date-range picker, multi-select). Do not use for designing relational database schemas (use alper-database-designer).
status: ACTIVE
capabilityFamily: SOURCE_INTELLIGENCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - search_registries
  - search_registry_components
  - inspect_registry_component
  - inspect_alper_registry
relatedSkills:
  - alper-source-intelligence
  - alper-design-language
---

# Alper Registry Discovery Skill

## PURPOSE
Discovers, searches, and inspects modular UI blocks and components from the shadcn registry ecosystem and curated community registries, verifying component dependencies and styling compatibility.

## USE WHEN
- Searching for ready-made shadcn/ui or community registry components (e.g. date-range picker, multi-select).
- Inspecting component code and required sub-dependencies before installation.
- Finding specialized UI blocks for dashboard, auth, or settings pages.

## DO NOT USE WHEN
- Designing relational database schemas (use alper-database-designer).
- Analyzing legacy backend PHP/ASP code (use alper-existing-project-analysis).
- Running SQL performance diagnoses (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**.
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
1. Query registry index with target component name.
2. Inspect component schema, props, and dependency requirements.
3. Verify compatibility with existing design tokens and Tailwind config.
4. Output installation command and component code.

## DECISION RULES
- Audit dependencies: Flag any component requiring heavy unrequested external npm packages.
- Verify Tailwind / CSS custom property compatibility before recommending installation.

## MCP TOOL STRATEGY
- `search_registries`: Canonical handler for search registries. Always pass required schema arguments; handle return states deterministically.
- `search_registry_components`: Canonical handler for search registry components. Always pass required schema arguments; handle return states deterministically.
- `inspect_registry_component`: Canonical handler for inspect registry component. Always pass required schema arguments; handle return states deterministically.
- `inspect_alper_registry`: Canonical handler for inspect alper registry. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Shadcn UI registry index, community block registries, and npm metadata.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review before installing third-party community registry blocks.

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
- RegistryComponentInspectionReport and installation instructions.

## HANDOFF / RELATED SKILLS
- `alper-source-intelligence`: Downstream or sibling capability for SOURCE_INTELLIGENCE operations.
- `alper-design-language`: Downstream or sibling capability for DESIGN_UX operations.
