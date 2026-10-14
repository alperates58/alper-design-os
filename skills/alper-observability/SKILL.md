---
name: alper-observability
description: OpenTelemetry tracing, metrics, structured logging, correlation IDs, PII redaction, and track-trace telemetry. Use when instrumenting applications with opentelemetry tracing and structured logging. Do not use for styling ui components (use alper-design-language).
status: ACTIVE
capabilityFamily: PERFORMANCE_RELIABILITY
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - audit_track_trace_telemetry
relatedSkills:
  - alper-reliability
  - alper-release-safety
---

# Alper Observability & Telemetry Skill

## PURPOSE
Architects OpenTelemetry distributed tracing, Prometheus-compatible metrics, structured JSON logging, correlation ID propagation, automated PII redaction, and operational track-trace telemetry.

## USE WHEN
- Instrumenting applications with OpenTelemetry tracing and structured logging.
- Configuring correlation ID propagation across HTTP headers and async workers.
- Auditing operational track-trace telemetry for industrial or logistics workflows.

## DO NOT USE WHEN
- Styling UI components (use alper-design-language).
- Designing database normalization (use alper-database-designer).
- Running accessibility audits (use alper-accessibility-testing).

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
1. Configure OpenTelemetry SDK with tracer and meter providers.
2. Establish structured JSON logging format with correlation IDs (trace_id, span_id).
3. Enforce automated regex redaction on passwords, tokens, and PII fields.
4. Output ObservabilitySpecification.

## DECISION RULES
- PII Redaction Rule: Passwords, authorization tokens, credit cards, and PII must never be emitted into log streams.
- Correlation IDs must propagate across all inbound and outbound service requests.

## MCP TOOL STRATEGY
- `audit_track_trace_telemetry`: Canonical handler for audit track trace telemetry. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: OpenTelemetry specification, W3C Trace Context, structured JSON logging, and track-trace telemetry standards.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Privacy / security officer review of log redaction rules for PII compliance.

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
- ObservabilityArchitectureDocument and TelemetryConfiguration.

## HANDOFF / RELATED SKILLS
- `alper-reliability`: Downstream or sibling capability for PERFORMANCE_RELIABILITY operations.
- `alper-release-safety`: Downstream or sibling capability for PERFORMANCE_RELIABILITY operations.
