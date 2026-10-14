---
name: alper-continuous-improvement
description: Records lessons learned and produces governance improvement proposals with human approval gates. Use when capturing a concrete lesson learned following a debugging session or deployment failure. Do not use for directly writing application code or ui components (use stack-specific skills).
status: ACTIVE
capabilityFamily: PROJECT_INTELLIGENCE
userFacingType: USER_ENTRYPOINT
userFacing: true
modeApplicability:
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - record_lesson_learned
  - propose_improvement_candidate
relatedSkills:
  - alper-project-intelligence
  - alper-decision-management
  - alper-independent-review
---

# Alper Continuous Improvement Skill

## PURPOSE
Captures empirical engineering lessons from build failures, review rejections, and test breakdowns, drafting governance improvement proposals with strict project isolation.

## USE WHEN
- Capturing a concrete lesson learned following a debugging session or deployment failure.
- Proposing improvements to project invariants, lint rules, or verification checklists.
- Conducting post-implementation retrospectives.

## DO NOT USE WHEN
- Directly writing application code or UI components (use stack-specific skills).
- Scaffolding clean-sheet applications (use alper-greenfield-generator).
- Running automated security scans (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **CONTINUOUS_GOVERNANCE**.
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
1. Ingest incident details, root cause, and remediation steps.
2. Record LessonLearnedRecord scoped strictly to current project.
3. Formulate GovernanceImprovementProposal if systemic rule change is warranted.
4. Submit proposal to human operator for review.

## DECISION RULES
- Cross-Project Isolation: Project-specific lessons must NEVER be globally promoted without human authorization.
- Proposals must include verifiable evidence demonstrating the flaw in existing rules.

## MCP TOOL STRATEGY
- `record_lesson_learned`: Canonical handler for record lesson learned. Always pass required schema arguments; handle return states deterministically.
- `propose_improvement_candidate`: Canonical handler for propose improvement candidate. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: Execution journals, review findings, test failure logs, and post-mortem artifacts.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- Operator approval before promoting a project lesson to global engineering rules.

## STOP CONDITIONS
- Required context or prerequisite artifacts are missing.
- Tool execution reports critical validation or gate failure.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit code.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Canonical Evidence Kinds: `HEURISTIC_REVIEW`.
- Missing evidence strictly resolves to `VerificationStatus: NOT_VERIFIED`. Never emit fake PASS assertion.

## OUTPUT CONTRACT
- LessonLearnedRecord and GovernanceImprovementProposal.

## HANDOFF / RELATED SKILLS
- `alper-project-intelligence`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-decision-management`: Downstream or sibling capability for PROJECT_INTELLIGENCE operations.
- `alper-independent-review`: Downstream or sibling capability for GOVERNANCE operations.
