---
name: alper-existing-project-analysis
description: Analyzes existing codebases, detects stack, profiles debt, and maps critical workflows. Use when onboarding an existing codebase into alper design os. Do not use for scaffolding a new clean-sheet repository (use alper-greenfield-generator).
status: ACTIVE
capabilityFamily: EXISTING_PROJECT_ANALYSIS
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - MODERNIZATION
  - REPAIR
mcpTools:
  - profile_existing_project
  - analyze_project
  - detect_stack
  - audit_existing_ui
relatedSkills:
  - alper-modernization-planner
  - alper-design-repair
  - alper-behavior-preservation
---

# Alper Existing Project Analysis Skill

## PURPOSE
Performs passive static inspection of brownfield codebases, identifying framework stacks, styling systems, circular dependencies, technical debt, and missing test baselines.

## USE WHEN
- Onboarding an existing codebase into ALPER DESIGN OS.
- Detecting framework versions, styling paradigms, and architectural layers.
- Auditing existing UI markup for accessibility flaws, layout bugs, and deprecated dependencies.

## DO NOT USE WHEN
- Scaffolding a new clean-sheet repository (use alper-greenfield-generator).
- Making destructive code changes without an approved action plan (use alper-change-planner).
- Running active network security penetration tests (use alper-security-audit).

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
**Protocol: CLARIFY_AMBIGUITY**
If input requirements are incomplete, contradictory, or underspecified, formulate 3-5 prioritized clarifying questions for the operator. Derived criteria must remain in `DEFINED / NOT_VERIFIED` state until clarified.

## WORKFLOW
1. Read workspace file manifest and detect technology stack.
2. Profile code health, modular boundaries, and external dependencies.
3. Audit existing UI components and styling architecture.
4. Generate ExistingProjectProfile and initialize project architecture graph.

## DECISION RULES
- Strictly read-only: Never mutate workspace files during analysis.
- Empty repositories must truthfully report INSUFFICIENT_DATA rather than hallucinating health scores.

## MCP TOOL STRATEGY
- `profile_existing_project`: Canonical handler for profile existing project. Always pass required schema arguments; handle return states deterministically.
- `analyze_project`: Canonical handler for analyze project. Always pass required schema arguments; handle return states deterministically.
- `detect_stack`: Canonical handler for detect stack. Always pass required schema arguments; handle return states deterministically.
- `audit_existing_ui`: Canonical handler for audit existing ui. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Target project source code, package manifests (package.json, composer.json, csproj), and lockfiles.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator review of discovered tech debt hotspots and legacy architectural risks.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Discovery readiness evaluation returns `NEEDS_CLARIFICATION` or `BLOCKED_BY_AMBIGUITY`.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `STATIC_ANALYSIS`, `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- ExistingProjectProfile containing detected stack, health scores, and debt inventory.

## HANDOFF / RELATED SKILLS
- `alper-modernization-planner`: Downstream or sibling capability for MODERNIZATION operations.
- `alper-design-repair`: Downstream or sibling capability for REPAIR operations.
- `alper-behavior-preservation`: Downstream or sibling capability for MODERNIZATION operations.
