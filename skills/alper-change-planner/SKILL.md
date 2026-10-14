---
name: alper-change-planner
description: 17-step change lifecycle, AgentActionPlan generation, and blast radius assessment. Use when planning file modifications that touch multiple components, database schemas, or apis. Do not use for pure read-only codebase exploration or research (use alper-existing-project-analysis).
status: ACTIVE
capabilityFamily: GOVERNANCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - create_action_plan
  - evaluate_change_risk
  - classify_code_paths
  - create_execution_journal
  - route_context
  - route_tool
relatedSkills:
  - alper-scope-guard
  - alper-git-safety
  - alper-independent-review
  - alper-evidence-review
---

# Alper Change Planner Skill

## PURPOSE
Governs significant codebase mutations by producing typed AgentActionPlans with explicit scope bounds, 10-dimension risk evaluations, verification criteria, and rollback strategies.

## USE WHEN
- Planning file modifications that touch multiple components, database schemas, or APIs.
- Evaluating change risk across architecture, security, and dependency dimensions.
- Establishing an execution journal and rollback plan before modifying files.

## DO NOT USE WHEN
- Pure read-only codebase exploration or research (use alper-existing-project-analysis).
- Scaffolding a brand new greenfield project (use alper-greenfield-generator).
- Executing single-line CSS edits where ScopeGuard alone suffices (use alper-design-repair).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
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
1. Define objective and identify target files.
2. Classify code paths (IN_SCOPE, REQUIRED_DEPENDENCY, OUT_OF_SCOPE, FORBIDDEN).
3. Evaluate change risk across 10 dimensions.
4. Formulate AgentActionPlan with verification plan and rollback commands.
5. Initialize execution journal.

## DECISION RULES
- Mandatory Plan Rule: Never execute multi-file changes without an approved AgentActionPlan.
- High/Critical Risk Rule: Changes rated HIGH or CRITICAL require mandatory git checkpointing.

## MCP TOOL STRATEGY
- `create_action_plan`: Canonical handler for create action plan. Always pass required schema arguments; handle return states deterministically.
- `evaluate_change_risk`: Canonical handler for evaluate change risk. Always pass required schema arguments; handle return states deterministically.
- `classify_code_paths`: Canonical handler for classify code paths. Always pass required schema arguments; handle return states deterministically.
- `create_execution_journal`: Canonical handler for create execution journal. Always pass required schema arguments; handle return states deterministically.
- `route_context`: Canonical handler for route context. Always pass required schema arguments; handle return states deterministically.
- `route_tool`: Canonical handler for route tool. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: 17-step change lifecycle, git status, and risk evaluation matrix.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator approval of AgentActionPlan for HIGH and CRITICAL risk changes.

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
- AgentActionPlan with risk evaluation, verification criteria, and rollback strategy.

## HANDOFF / RELATED SKILLS
- `alper-scope-guard`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-git-safety`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-evidence-review`: Downstream or sibling capability for GOVERNANCE operations.
