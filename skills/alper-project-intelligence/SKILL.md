---
name: alper-project-intelligence
description: Version-controlled project memory in .alper-design-os/project, architecture graph, and knowledge health. Use when initializing persistent project memory for a repository. Do not use for styling ui components or tokens (use alper-design-language).
status: ACTIVE
capabilityFamily: PROJECT_INTELLIGENCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - GREENFIELD
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - initialize_project_intelligence
  - load_project_intelligence
  - record_business_rule
  - build_project_architecture_graph
  - create_project_snapshot
  - detect_knowledge_conflicts
  - evaluate_project_knowledge_health
  - record_project_invariant
relatedSkills:
  - alper-decision-management
  - alper-project-continuation
  - alper-change-impact-analysis
---

# Alper Project Intelligence Skill

## PURPOSE
Initializes, maintains, and audits durable project memory in .alper-design-os/project/, building code-grounded architecture graphs, recording provenanced business rules, and preventing agent amnesia.

## USE WHEN
- Initializing persistent project memory for a repository.
- Recording confirmed business rules, technical invariants, or architectural constraints.
- Auditing project knowledge health and resolving conflicting assumptions.

## DO NOT USE WHEN
- Styling UI components or tokens (use alper-design-language).
- Running browser integration test suites (use alper-browser-qa).
- Executing single-line CSS fixes (use alper-design-repair).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.

## DURABLE PROJECT MEMORY & GRAPH EXTRACTION
- **Storage Location**: Reads and maintains durable state in `.alper-design-os/project/` (manifest.json, architecture-graph.json, adrs/).
- **Authentic Graph Construction**: Scans actual source ASTs, package manifests, and route definitions; never invents imaginary architecture nodes.
- **Zero Hallucinated Health Scores**: Health metrics, test coverage, and documentation scores must derive from genuine static analysis and test runner outputs.
- **Knowledge Drift Detection**: Identifies discrepancies between committed code and documented architecture, surfacing drift warnings to operators.

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
1. Inspect .alper-design-os/project/ directory structure.
2. Parse codebase AST to build or update ProjectArchitectureGraph.
3. Record business rules with explicit provenance (DERIVED vs USER_CONFIRMED).
4. Detect contradictory knowledge claims or stale invariants.
5. Evaluate truthful project knowledge health score.

## DECISION RULES
- Provenance Rule: An inferred business rule must NEVER be recorded as USER_CONFIRMED without operator consent.
- Zero Secret Storage: All tokens, passwords, and connection strings must be redacted before saving.

## MCP TOOL STRATEGY
- `initialize_project_intelligence`: Canonical handler for initialize project intelligence. Always pass required schema arguments; handle return states deterministically.
- `load_project_intelligence`: Canonical handler for load project intelligence. Always pass required schema arguments; handle return states deterministically.
- `record_business_rule`: Canonical handler for record business rule. Always pass required schema arguments; handle return states deterministically.
- `build_project_architecture_graph`: Canonical handler for build project architecture graph. Always pass required schema arguments; handle return states deterministically.
- `create_project_snapshot`: Canonical handler for create project snapshot. Always pass required schema arguments; handle return states deterministically.
- `detect_knowledge_conflicts`: Canonical handler for detect knowledge conflicts. Always pass required schema arguments; handle return states deterministically.
- `evaluate_project_knowledge_health`: Canonical handler for evaluate project knowledge health. Always pass required schema arguments; handle return states deterministically.
- `record_project_invariant`: Canonical handler for record project invariant. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Version-controlled repository metadata in .alper-design-os/project/, AST analysis, and ADRs.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review and confirmation when resolving conflicting business rules.

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
- Updated ProjectSnapshot, ArchitectureGraph, and KnowledgeHealthReport.

## HANDOFF / RELATED SKILLS
- `alper-decision-management`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-project-continuation`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-change-impact-analysis`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
