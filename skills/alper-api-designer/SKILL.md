---
name: alper-api-designer
description: OpenAPI 3.1.0 REST API design, RFC 9457 Problem Details, pagination, and RBAC auth model. Use when designing rest api endpoints, schemas, parameters, and responses for greenfield or brownfield systems. Do not use for designing ui page layouts or css stylesheets (use alper-ui-blueprint or alper-design-language).
status: ACTIVE
capabilityFamily: API_ENGINEERING
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - create_api_blueprint
  - create_auth_model
  - evaluate_api_compatibility
  - search_public_apis
relatedSkills:
  - alper-api-security
  - alper-contract-testing
  - alper-database-designer
---

# Alper API Designer Skill

## PURPOSE
Designs clean, consistent, technology-neutral REST APIs following OpenAPI 3.1.0 specifications, standardizing RFC 9457 Problem Details, envelope formats, cursor/page pagination, and RBAC authorization models.

## USE WHEN
- Designing REST API endpoints, schemas, parameters, and responses for greenfield or brownfield systems.
- Specifying authentication mechanisms (JWT, session cookies, API keys) and role-based access control (RBAC).
- Evaluating API backwards compatibility and versioning strategies (v1, v2).

## DO NOT USE WHEN
- Designing UI page layouts or CSS stylesheets (use alper-ui-blueprint or alper-design-language).
- Tuning database indexing or query plans (use alper-sql-performance).
- Running Playwright browser UI automation (use alper-browser-qa).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: CLARIFY_AMBIGUITY**
If input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in `DEFINED / NOT_VERIFIED` state until clarified.

## WORKFLOW
1. Ingest domain entities and functional requirements.
2. Define resource endpoints following REST conventions (plural nouns, appropriate HTTP verbs).
3. Formulate strict request and response schemas using JSON Schema / OpenAPI 3.1.0.
4. Standardize error responses using RFC 9457 Problem Details.
5. Specify authentication and RBAC permission requirements per endpoint.

## DECISION RULES
- Standard Errors: All non-2xx responses must comply with RFC 9457 Problem Details specification.
- Breaking Change Guard: Removing fields or altering types on existing endpoints is strictly prohibited without versioning.

## MCP TOOL STRATEGY
- `create_api_blueprint`: Canonical handler for create api blueprint. Always pass required schema arguments; handle return states deterministically.
- `create_auth_model`: Canonical handler for create auth model. Always pass required schema arguments; handle return states deterministically.
- `evaluate_api_compatibility`: Canonical handler for evaluate api compatibility. Always pass required schema arguments; handle return states deterministically.
- `search_public_apis`: Canonical handler for search public apis. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: OpenAPI 3.1.0 specifications, RFC 9457 Problem Details, and RFC 6749 OAuth 2.0 / JWT standards.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of breaking API contract changes or auth model revisions.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` or `BLOCKED_BY_AMBIGUITY`.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.
- Expected Artifact Evidence: `openapi-3-1-spec-diff`, `api-contract-validation-report`.

## OUTPUT CONTRACT
- OpenAPI 3.1.0 Specification (ApiBlueprint) and AuthModelSpecification.

## HANDOFF / RELATED SKILLS
- `alper-api-security`: Downstream or sibling capability for SECURITY operations.
- `alper-contract-testing`: Downstream or sibling capability for QA_TESTING operations.
- `alper-database-designer`: Downstream or sibling capability for DATA_ENGINEERING operations.
