---
name: alper-refactoring-strategy
description: Safe refactoring roadmaps using Strangler Fig, Branch-by-Abstraction, and ADR documentation. Use when decoupling tightly coupled monolithic modules or eliminating circular dependencies. Do not use for adding new product features or business requirements (use alper-requirements-engineering).
status: ACTIVE
capabilityFamily: MODERNIZATION
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
  - REPAIR
mcpTools:
  - generate_adr
  - create_action_plan
  - evaluate_change_risk
relatedSkills:
  - alper-modernization-planner
  - alper-behavior-preservation
  - alper-architecture
---

# Alper Refactoring Strategy Skill

## PURPOSE
Designs surgical, behavior-preserving refactoring roadmaps for technical debt remediation, modular decoupling, and pattern alignment using Strangler Fig and Branch-by-Abstraction.

## USE WHEN
- Decoupling tightly coupled monolithic modules or eliminating circular dependencies.
- Introducing abstractions or interfaces between legacy components and new implementations.
- Drafting Architecture Decision Records (ADRs) for significant code reorganizations.

## DO NOT USE WHEN
- Adding new product features or business requirements (use alper-requirements-engineering).
- Fixing an isolated CSS visual bug (use alper-design-repair).
- Running penetration tests (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: REQUIRED**
This skill strictly requires reading durable project memory from `.alper-design-os/project/` (manifest, architecture graph, ADRs, behavioral contracts) before planning or executing actions. Missing memory triggers explicit initialization or drift detection.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Identify refactoring target and map existing call graph.
2. Select refactoring technique (Branch-by-Abstraction, Extract Module, Parameterize).
3. Formulate risk-assessed ActionPlan with atomic, reversible steps.
4. Document rationale and tradeoffs in an Architecture Decision Record (ADR).

## DECISION RULES
- Refactoring must never change observable runtime behavior.
- Always maintain green test suites before, during, and after each atomic refactoring step.

## MCP TOOL STRATEGY
- `generate_adr`: Canonical handler for generate adr. Always pass required schema arguments; handle return states deterministically.
- `create_action_plan`: Canonical handler for create action plan. Always pass required schema arguments; handle return states deterministically.
- `evaluate_change_risk`: Canonical handler for evaluate change risk. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Martin Fowler Refactoring catalog, Strangler Fig pattern, and Branch-by-Abstraction architectures.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Architectural sign-off on major structural refactorings or pattern changes.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `UNIT_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- RefactoringRoadmap, AgentActionPlan, and ArchitectureDecisionRecord.

## HANDOFF / RELATED SKILLS
- `alper-modernization-planner`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-behavior-preservation`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-architecture`: Downstream or sibling capability for ARCHITECTURE operations.
