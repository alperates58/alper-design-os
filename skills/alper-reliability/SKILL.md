---
name: alper-reliability
description: Defines SLIs/SLOs, circuit breakers, backoff strategies, bulkheads, and graceful degradation. Use when designing fault-tolerant client-server communication with graceful degradation. Do not use for fixing css visual styling (use alper-design-repair).
status: ACTIVE
capabilityFamily: PERFORMANCE_RELIABILITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_release_gates
relatedSkills:
  - alper-observability
  - alper-release-safety
---

# Alper Reliability & Resilience Skill

## PURPOSE
Architects system resilience patterns including circuit breakers, exponential backoff retries, bulkheads, fallback caches, and SLI/SLO error budget governance for distributed and client-server architectures.

## USE WHEN
- Designing fault-tolerant client-server communication with graceful degradation.
- Defining SLIs, SLOs, and availability targets for services.
- Configuring retry policies with exponential backoff and jitter.

## DO NOT USE WHEN
- Fixing CSS visual styling (use alper-design-repair).
- Designing database schemas (use alper-database-designer).
- Writing Playwright browser tests (use alper-browser-qa).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- Workspace root path and active git branch.
- Current task brief and AgentActionPlan.
- Relevant project files and configuration manifests.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Define service SLIs (latency, availability, error rate) and target SLOs.
2. Configure circuit breaker thresholds on external service integrations.
3. Implement retry policies with exponential backoff and jitter.
4. Output ReliabilityArchitectureSpecification.

## DECISION RULES
- Circuit Breaker Rule: External HTTP/API dependencies must have circuit breaker protections to prevent thread pool exhaustion.
- Retries must always include exponential backoff and randomized jitter to prevent thundering herd problems.

## MCP TOOL STRATEGY
- `evaluate_release_gates`: Canonical handler for evaluate release gates. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Google SRE Book (SLIs, SLOs, Error Budgets), Release It! design patterns (Circuit Breaker, Bulkhead, Fallback).
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator / SRE approval of SLI/SLO target definitions and error budget policies.

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
- ReliabilityArchitectureDocument and SLOSpecification.

## HANDOFF / RELATED SKILLS
- `alper-observability`: Downstream or sibling capability for PERFORMANCE_RELIABILITY operations.
- `alper-release-safety`: Downstream or sibling capability for PERFORMANCE_RELIABILITY operations.
