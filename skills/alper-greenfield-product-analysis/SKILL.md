---
name: alper-greenfield-product-analysis
description: Evaluates raw product briefs, classifies request complexity, and checks discovery readiness. Use when a user provides a new product idea, brief, or request for clean-sheet software creation. Do not use for modifying or analyzing an existing codebase (use alper-existing-project-analysis or alper-modernization-planner).
status: ACTIVE
capabilityFamily: PRODUCT_DISCOVERY
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
mcpTools:
  - create_greenfield_project_profile
  - understand_product
  - research_domain
relatedSkills:
  - alper-domain-intelligence
  - alper-requirements-engineering
  - alper-greenfield-generator
---

# Alper Greenfield Product Analysis Skill

## PURPOSE
Evaluates raw product briefs, classifies complexity (Low/Medium/High/Extreme), identifies grounded business entities, and gates downstream engineering until discovery requirements are satisfied.

## USE WHEN
- A user provides a new product idea, brief, or request for clean-sheet software creation.
- Evaluating whether a prompt has sufficient technical grounding before scaffolding.
- Extracting primary business entities, operational roles, and core jobs-to-be-done.

## DO NOT USE WHEN
- Modifying or analyzing an existing codebase (use alper-existing-project-analysis or alper-modernization-planner).
- Generating concrete multi-stack code scaffolding (use alper-greenfield-generator).
- Fixing an isolated UI or accessibility defect (use alper-design-repair).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Raw product brief, problem statement, or functional specification.
- Target user roles, operational workflows, and domain constraints.
- Technology stack preferences or architectural invariants.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: CLARIFY_AMBIGUITY**
If input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in `DEFINED / NOT_VERIFIED` state until clarified.

## WORKFLOW
1. Ingest raw product brief and domain context.
2. Classify request complexity against architectural scope boudaries.
3. Evaluate DiscoveryReadiness (READY vs NEEDS_CLARIFICATION).
4. If ambiguous, formulate 3-5 prioritized clarifying questions.
5. Output structured GreenfieldProjectProfile.

## DECISION RULES
- If DiscoveryReadiness !== READY, downstream scaffolding is strictly blocked.
- Never invent unrequested business entities or database schemas; flag ambiguity as questions.
- Derive grounded operational roles rather than assuming generic Admin/User personas.

## MCP TOOL STRATEGY
- `create_greenfield_project_profile`: Canonical handler for create greenfield project profile. Always pass required schema arguments; handle return states deterministically.
- `understand_product`: Canonical handler for understand product. Always pass required schema arguments; handle return states deterministically.
- `research_domain`: Canonical handler for research domain. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Industry operational domain benchmarks, persona workflows, and business models.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of clarifying questions when DiscoveryReadiness is NEEDS_CLARIFICATION.

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
- GreenfieldProjectProfile with complexity score, entity map, and discovery readiness state.

## HANDOFF / RELATED SKILLS
- `alper-domain-intelligence`: Downstream or sibling capability for PRODUCT_DISCOVERY operations.
- `alper-requirements-engineering`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
- `alper-greenfield-generator`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
