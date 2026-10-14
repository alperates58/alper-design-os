---
name: alper-requirements-engineering
description: Derives functional/non-functional requirements, RTM, and manages acceptance criteria lifecycle. Use when transforming a product profile into formal functional and non-functional requirements. Do not use for performing high-level domain discovery before understanding the product (use alper-greenfield-product-analysis).
status: ACTIVE
capabilityFamily: GREENFIELD_ENGINEERING
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - derive_requirements
  - create_requirement_traceability
  - generate_user_journeys
relatedSkills:
  - alper-greenfield-product-analysis
  - alper-greenfield-generator
  - alper-browser-qa
---

# Alper Requirements Engineering Skill

## PURPOSE
Synthesizes functional and non-functional requirements, builds bidirectional RTM matrices, maps user journeys, and enforces the DEFINED -> NOT_VERIFIED acceptance criteria lifecycle.

## USE WHEN
- Transforming a product profile into formal functional and non-functional requirements.
- Establishing bidirectional traceability from user stories to database entities and tests.
- Creating end-to-end user journey flows with explicit state transitions.

## DO NOT USE WHEN
- Performing high-level domain discovery before understanding the product (use alper-greenfield-product-analysis).
- Directly emitting source code files to disk (use alper-greenfield-generator).
- Diagnosing database query latency (use alper-sql-performance).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**.
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
1. Ingest GreenfieldProjectProfile and user intent.
2. Derive functional requirements with unique IDs (FR-01, FR-02, etc.).
3. Formulate non-functional constraints (NFR-PERF, NFR-SEC, etc.).
4. Generate bidirectional RTM connecting requirements to planned modules and tests.
5. Initialize acceptance criteria strictly in DEFINED / NOT_VERIFIED state.

## DECISION RULES
- NO CLAIM WITHOUT EVIDENCE: All newly derived criteria must start in NOT_VERIFIED state.
- Every requirement must trace to at least one user journey and acceptance test.

## MCP TOOL STRATEGY
- `derive_requirements`: Canonical handler for derive requirements. Always pass required schema arguments; handle return states deterministically.
- `create_requirement_traceability`: Canonical handler for create requirement traceability. Always pass required schema arguments; handle return states deterministically.
- `generate_user_journeys`: Canonical handler for generate user journeys. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: IEEE 830 / ISO/IEC/IEEE 29148 requirements specifications and user story mapping standards.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review and approval of Requirements Traceability Matrix (RTM).

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` (for discovery-gated skills).
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- Structured RequirementsDocument, RTM traceability map, and UserJourneyCollection.

## HANDOFF / RELATED SKILLS
- `alper-greenfield-product-analysis`: Downstream or sibling capability for PRODUCT_DISCOVERY operations.
- `alper-greenfield-generator`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
- `alper-browser-qa`: Downstream or sibling capability for QA_TESTING operations.
