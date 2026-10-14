---
name: alper-project-continuation
description: Truthful project onboarding for agent sessions via durable intelligence snapshots and drift detection. Use when a new agent conversation begins on an ongoing project. Do not use for starting a completely brand-new project with no prior history (use alper-greenfield-product-analysis).
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
  - build_task_context
  - detect_project_drift
  - load_project_intelligence
relatedSkills:
  - alper-project-intelligence
  - alper-change-planner
  - alper-evidence-review
---

# Alper Project Continuation Skill

## PURPOSE
Eliminates agent session amnesia by loading durable project snapshots, detecting codebase drift since the last session, and presenting active risks, incomplete tasks, and carried verification debt.

## USE WHEN
- A new agent conversation begins on an ongoing project.
- User asks "Continue where we left off yesterday" or resumes a multi-phase roadmap.
- Verifying if external git changes occurred while the agent was idle.

## DO NOT USE WHEN
- Starting a completely brand-new project with no prior history (use alper-greenfield-product-analysis).
- Executing single-block CSS repairs (use alper-design-repair).
- Conducting an isolated web search (use alper-source-intelligence).

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
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
1. Load canonical ProjectSnapshot from .alper-design-os/project/snapshot.json.
2. Compute current workspace hash and compare to snapshot to detect drift.
3. Assemble task context including active ADRs, incomplete plan steps, and verification debt.
4. Output truthful continuation brief.

## DECISION RULES
- Drift Rule: If repository drift is detected, flag modified files before executing subsequent actions.
- Debt Truth: Never hide carried verification debt; report active NOT_VERIFIED items prominently.

## MCP TOOL STRATEGY
- `build_task_context`: Canonical handler for build task context. Always pass required schema arguments; handle return states deterministically.
- `detect_project_drift`: Canonical handler for detect project drift. Always pass required schema arguments; handle return states deterministically.
- `load_project_intelligence`: Canonical handler for load project intelligence. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Snapshot history in .alper-design-os/project/, git log, and verification debt registry.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator acknowledgment if severe repository drift occurred between sessions.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ProjectContinuationBrief with drift status, active phase, and verification debt.

## HANDOFF / RELATED SKILLS
- `alper-project-intelligence`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-change-planner`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-evidence-review`: Downstream or sibling capability for GOVERNANCE operations.
