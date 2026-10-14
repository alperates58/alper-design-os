---
name: alper-git-safety
description: Prevents destructive Git commands (reset --hard, force push) and manages checkpoint plans. Use when creating a git stash or branch checkpoint before executing high-risk code changes. Do not use for designing ui components or stylesheets (use alper-design-language).
status: ACTIVE
capabilityFamily: GOVERNANCE
userFacingType: INTERNAL_ORCHESTRATION
userFacing: false
modeApplicability:
  - MODERNIZATION
  - REPAIR
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - create_checkpoint_plan
relatedSkills:
  - alper-change-planner
  - alper-scope-guard
  - alper-independent-review
---

# Alper Git Safety Skill

## PURPOSE
Protects the repository against accidental data loss by blocking destructive Git commands, creating pre-modification stash checkpoints, and preparing rollback scripts.

## USE WHEN
- Creating a git stash or branch checkpoint before executing high-risk code changes.
- Intercepting destructive commands (git reset --hard, git push --force, git clean -fd).
- Preparing automated rollback scripts for multi-step refactoring operations.

## DO NOT USE WHEN
- Designing UI components or stylesheets (use alper-design-language).
- Deriving functional product requirements (use alper-requirements-engineering).
- Executing browser E2E tests (use alper-browser-qa).

## MODE APPLICABILITY
- Supported Modes: **MODERNIZATION**, **REPAIR**, **CONTINUOUS_GOVERNANCE**.
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
1. Check git status to ensure working tree cleanliness or active stash availability.
2. Create temporary safety checkpoint (stash or checkpoint branch).
3. Formulate rollback script with inverse operations.
4. Intercept and block prohibited commands via hooks.json guard.

## DECISION RULES
- Hard Reset Block: Commands matching git reset --hard or git clean -fd are blocked by default.
- Checkpoint Prerequisite: High-risk changes must have an active checkpoint before execution.

## MCP TOOL STRATEGY
- `create_checkpoint_plan`: Canonical handler for create checkpoint plan. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Git status, reflog, stash list, and working tree index.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Explicit operator authorization for destructive git actions (hard reset, force push, clean -fd).

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
- CheckpointPlan with checkpoint identifier and rollback shell instructions.

## HANDOFF / RELATED SKILLS
- `alper-change-planner`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-scope-guard`: Downstream or sibling capability for GOVERNANCE operations.
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
