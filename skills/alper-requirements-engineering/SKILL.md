---
name: alper-requirements-engineering
description: Derives structured functional/non-functional requirements, business rules, acceptance criteria, user journeys, and enforces bidirectional traceability.
---

# Alper Requirements Engineering Skill

Formalizes unstructured expectations into traceable engineering requirements, eliminating scope creep and orphan features.

## Pipeline Position
`GREENFIELD PROFILE -> REQUIREMENTS DERIVATION -> TRACEABILITY MATRIX -> REQUIREMENT BOUNDARY`

## Core Responsibilities
1. **Requirements Formulation**:
   - Derive typed `FunctionalRequirement` entries with explicit priority (`MUST_HAVE`, `SHOULD_HAVE`, `COULD_HAVE`, `WONT_HAVE`).
   - Define measurable `NonFunctionalRequirement` entries (performance, accessibility, security, usability).
   - Formulate unambiguous `BusinessRule` invariants and Gherkin-style `AcceptanceCriterion`.
2. **Provenance & Source Authenticity**:
   - Every requirement must cite its origin: `EXPLICIT_USER_BRIEF`, `DOMAIN_INFERENCE`, `SECURITY_POLICY`, or `PLATFORM_BASELINE`.
   - Prevent hallucinated business rules; non-explicit rules must be flagged with confidence <= 0.8.
3. **Traceability Matrix Management**:
   - Link each requirement to architectural decisions, database entities, API endpoints, UI pages, and tests.
   - Guard against orphan requirements (requirements with no code or tests) and unexpected features (unrequested code).
4. **Requirement Boundary Contract**:
   - Freeze scope boundary contract to block feature creep during implementation.

## Associated MCP Tools
- `derive_requirements`: Extracts functional and non-functional requirements from profile and brief.
- `create_requirement_traceability`: Generates bidirectional matrix and detects orphan/unexpected items.
