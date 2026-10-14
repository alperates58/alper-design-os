---
name: alper-load-testing
description: Benchmarks throughput and latency under stress with Grafana k6 under explicit operator approval. Use when benchmarking system throughput (req/s) and latency under anticipated operational load. Do not use for executing unauthorized load tests against production environments.
status: ACTIVE
capabilityFamily: PERFORMANCE_RELIABILITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - generate_qa_report
relatedSkills:
  - alper-performance-engineering
  - alper-reliability
---

# Alper Load Testing Skill

## PURPOSE
Generates and runs Grafana k6 performance benchmarks, stress tests, and spike tests under strict operator authorization, evaluating p95/p99 latency curves and breaking point throughput.

## USE WHEN
- Benchmarking system throughput (req/s) and latency under anticipated operational load.
- Testing auto-scaling thresholds and database connection pool saturation.
- Identifying performance bottlenecks under concurrency.

## DO NOT USE WHEN
- Executing unauthorized load tests against production environments.
- Writing single-unit UI tests (use alper-browser-qa).
- Styling CSS components (use alper-design-repair).

## MODE APPLICABILITY
- Supported Modes: **CONTINUOUS_GOVERNANCE**.
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
1. Obtain explicit written operator authorization for target environment and load parameters.
2. Generate Grafana k6 test script defining virtual users (VUs) and ramp-up stages.
3. Execute test run while monitoring server health.
4. Output LoadTestReport with throughput, error rates, and p95/p99 response times.

## DECISION RULES
- Authorization Mandatory: Running load tests without operator authorization is strictly forbidden.
- Auto-Abort: The load script must define auto-abort thresholds if error rate exceeds 5%.

## MCP TOOL STRATEGY
- `generate_qa_report`: Canonical handler for generate qa report. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Grafana k6 load test scripting, stress/spike testing models, and throughput latency curves.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- MANDATORY written operator authorization before executing stress or load tests against any environment.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `RUNTIME_CHECK`, `INTEGRATION_TEST`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.
- Expected Artifact Evidence: `k6-autocannon-summary-json`, `latency-histogram-p99`, `rps-throughput-log`.

## OUTPUT CONTRACT
- LoadBenchmarkReport with concurrency curves and latency percentiles.

## HANDOFF / RELATED SKILLS
- `alper-performance-engineering`: Downstream or sibling capability for PERFORMANCE_RELIABILITY operations.
- `alper-reliability`: Downstream or sibling capability for PERFORMANCE_RELIABILITY operations.
