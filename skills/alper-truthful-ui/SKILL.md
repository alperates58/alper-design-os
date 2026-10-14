---
name: alper-truthful-ui
description: First-class truthful UI governance: data provenance, page intent, source authority, and content truth gate. Use when auditing dashboard screens to ensure kpis, charts, and progress bars have authentic data provenance. Do not use for tuning sql query execution plans (use alper-sql-performance).
status: ACTIVE
capabilityFamily: TRUTHFUL_UI
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - evaluate_truthful_ui
  - audit_data_provenance
  - evaluate_page_intent
  - audit_information_relevance
  - classify_source_authority
  - evaluate_content_truth_gate
relatedSkills:
  - alper-design-critic
  - alper-database-designer
  - alper-evidence-review
---

# Alper Truthful UI & Data Provenance Skill

## PURPOSE
Enforces the universal invariant: NO CLAIM WITHOUT EVIDENCE in user interfaces. Audits visual dashboards, charts, and metrics to ensure all displayed statistics trace to authentic database or API sources rather than hallucinated dummy values.

## USE WHEN
- Auditing dashboard screens to ensure KPIs, charts, and progress bars have authentic data provenance.
- Eliminating misleading UI health scores (e.g. hardcoded 90% test coverage) or fake metric cards.
- Evaluating page intent to ensure every visual widget directly serves declared user jobs-to-be-done.

## DO NOT USE WHEN
- Tuning SQL query execution plans (use alper-sql-performance).
- Running penetration tests (use alper-security-audit).
- Scaffolding raw project files (use alper-greenfield-generator).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## TRUTHFUL UI ENGINEERING & PROVENANCE
- **Data Provenance Tracing**: Every KPI metric, chart series, and data-grid column must trace to an authentic backend entity or API contract.
- **Prohibition of Hallucinated Data**: Strictly forbid hardcoded placeholder statistics (e.g. fake "98% Quality Score") without telemetry evidence.
- **Truthful Empty States**: In the absence of live backend records, render explicit, helpful empty states rather than mock data.
- **Operational Density**: Align component visual density with user operational roles (high density for desktop operations, readable summary for executive overviews).

## REQUIRED CONTEXT
- UI wireframes, page layouts, component markup, or browser DOM.
- Design token definitions (tokens.json, tokens.css) and theme configurations.
- Stated user personas and target operational density.

## PROJECT INTELLIGENCE LOADING
**Status: CONDITIONAL**
Consults `.alper-design-os/project/` if persistent project memory has been initialized. For clean-sheet greenfield tasks prior to blueprinting, intelligence loading is optional and initializes upon completion.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Trace every KPI, table column, and chart metric to backend entity or API contract.
2. Flag any hardcoded dummy statistic presented as authentic operational data.
3. Audit page intent: verify layout aligns with declared user jobs-to-be-done without decorative bloat.
4. Evaluate Content Truth Gate: missing data must render as truthful empty state rather than simulated numbers.
5. Output TruthfulUIAuditReport.

## DECISION RULES
- Zero Hallucinated Metrics: Never hardcode simulated health scores or statistics without telemetry evidence.
- Truthful Empty States: When backend data is missing or empty, render an explicit, clear empty state.

## MCP TOOL STRATEGY
- `evaluate_truthful_ui`: Canonical handler for evaluate truthful ui. Always pass required schema arguments; handle return states deterministically.
- `audit_data_provenance`: Canonical handler for audit data provenance. Always pass required schema arguments; handle return states deterministically.
- `evaluate_page_intent`: Canonical handler for evaluate page intent. Always pass required schema arguments; handle return states deterministically.
- `audit_information_relevance`: Canonical handler for audit information relevance. Always pass required schema arguments; handle return states deterministically.
- `classify_source_authority`: Canonical handler for classify source authority. Always pass required schema arguments; handle return states deterministically.
- `evaluate_content_truth_gate`: Canonical handler for evaluate content truth gate. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Data provenance graph, database entity contracts, API schemas, and page intent definitions.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review when ungrounded metrics or placeholder numbers are flagged on production screens.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- TruthfulUIAuditReport, DataProvenanceMap, and ContentTruthGateEvaluation.

## HANDOFF / RELATED SKILLS
- `alper-design-critic`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-database-designer`: Downstream or sibling capability for DATA_ENGINEERING operations.
- `alper-evidence-review`: Downstream or sibling capability for GOVERNANCE operations.
