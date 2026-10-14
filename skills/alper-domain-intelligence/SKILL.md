---
name: alper-domain-intelligence
description: Provides operational domain intelligence across 15 industries without hardcoding APS terminology. Use when deconstructing domain-specific workflows (e.g. warehouse picking routes, icu telemetry, cold-chain monitoring). Do not use for writing css, design tokens, or visual styling (use alper-design-language).
status: ACTIVE
capabilityFamily: PRODUCT_DISCOVERY
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
mcpTools:
  - research_domain
  - understand_product
relatedSkills:
  - alper-greenfield-product-analysis
  - alper-requirements-engineering
  - alper-pattern-graph
---

# Alper Domain Intelligence Skill

## PURPOSE
Injects authentic domain realities, constraints, information density targets, and user mental models across manufacturing, logistics, healthcare, retail, fintech, and 10 other verticals.

## USE WHEN
- Deconstructing domain-specific workflows (e.g. warehouse picking routes, ICU telemetry, cold-chain monitoring).
- Selecting appropriate interaction densities (high-density tables vs spacious cards).
- Preventing generic SaaS anti-patterns from being applied to industrial software.

## DO NOT USE WHEN
- Writing CSS, design tokens, or visual styling (use alper-design-language).
- Designing database schemas and foreign keys (use alper-database-designer).
- Executing static code analysis or security scans (use alper-security-audit).

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
1. Match domain brief to target vertical in 15-industry benchmark database.
2. Identify domain operational constraints (e.g. latency budgets, finite capacity, offline resilience).
3. Formulate ProductUXProfile defining information density and ergonomic targets.
4. Recommend domain-appropriate UX patterns.

## DECISION RULES
- Reject generic SaaS tropes for high-throughput enterprise domains.
- Ensure domain neutrality: never force APS/manufacturing terms into fintech, healthcare, or retail briefs.

## MCP TOOL STRATEGY
- `research_domain`: Canonical handler for research domain. Always pass required schema arguments; handle return states deterministically.
- `understand_product`: Canonical handler for understand product. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: 15 industry operational benchmarks, domain terminology lexicons, and ergonomic studies.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator validation of specialized industry constraints (e.g. regulatory, SLA compliance).

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` or `BLOCKED_BY_AMBIGUITY`.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ProductUXProfile with domain classification, operational constraints, and ergonomic requirements.

## HANDOFF / RELATED SKILLS
- `alper-greenfield-product-analysis`: Downstream or sibling capability for PRODUCT_DISCOVERY operations.
- `alper-requirements-engineering`: Downstream or sibling capability for GREENFIELD_ENGINEERING operations.
- `alper-pattern-graph`: Downstream or sibling capability for DESIGN_UX operations.
