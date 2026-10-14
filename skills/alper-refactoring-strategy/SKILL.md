---
name: alper-refactoring-strategy
description: Safe refactoring roadmaps using Strangler Fig, Branch-by-Abstraction, and ADR documentation. Use when executing modernization tasks for refactoring strategy. Do not use for unrelated capability domains or deprecated Phase 0 workflows.
status: ACTIVE
capabilityFamily: MODERNIZATION
userFacing: true
mcpTools:
  - generate_adr
  - create_action_plan
  - evaluate_change_risk
relatedSkills:
  - alper-modernization-planner
  - alper-behavior-preservation
  - alper-modernization-review
---

# Alper Refactoring Strategy Skill

## PURPOSE
Provides canonical, deterministic agent capability for **Refactoring Strategy** within the **MODERNIZATION** capability family.
Primary focus: Safe refactoring roadmaps using Strangler Fig, Branch-by-Abstraction, and ADR documentation.

## USE WHEN
- Initiating or progressing tasks requiring refactoring strategy capabilities.
- Operating within mode-specific pipelines requiring MODERNIZATION workflows.
- Verifying requirements, technical blueprints, or evidence artifacts specifically owned by this capability.

## DO NOT USE WHEN
- The task strictly belongs to another capability family (e.g. use `alper-greenfield-generator` for new full-stack builds, `alper-modernization-planner` for migrations, or `alper-design-repair` for surgical bug fixes).
- Attempting to bypass verification gates or generate ungrounded code without prerequisite discovery.
- Operating on deprecated Phase 0 workflows.

## MODE APPLICABILITY
- Supported Modes: **GREENFIELD**, **MODERNIZATION**, **REPAIR**, and **CONTINUOUS_GOVERNANCE**.
- Mode Relevance: Enforces capability boundaries whether operating on clean-sheet greenfield or legacy brownfield codebases.

## REQUIRED CONTEXT
- Validated workspace root and project configuration.
- Task brief and structured user intent.
- Up-to-date `.alper-design-os/project` intelligence snapshot (when initialized).
- Relevant stack profiles and dependency manifests.

## PROJECT INTELLIGENCE LOADING
- Consults durable project memory in `.alper-design-os/project` prior to action execution.
- Reads verified architecture graphs, registered entities, and recorded project decisions (ADRs).
- Strictly rejects hallucinated project memory; missing intelligence triggers truthful intake or initialization.

## DISCOVERY / AMBIGUITY BEHAVIOR
- If task requirements are incomplete, ambiguous, or lack technical grounding:
  1. Halt execution immediately before emitting ungrounded changes.
  2. Emit prioritized clarifying questions to the operator.
  3. Maintain derived acceptance criteria in `DEFINED` / `NOT_VERIFIED` state until ambiguity is formally resolved.

## WORKFLOW
1. **Intake & Verification**: Ingest task parameters and verify workspace preconditions.
2. **Context Assembly**: Load relevant project invariants, schema contracts, and active policies.
3. **Execution & Tool Invocation**: Dispatch canonical MCP tools (`generate_adr`, `create_action_plan`, `evaluate_change_risk`).
4. **Evidence Collection**: Gather qualifying verification artifacts (logs, diffs, test evidence).
5. **Quality Gate Evaluation**: Validate deliverables against release and safety gates.
6. **Output Synthesis**: Produce structured deliverables and handoff packages for downstream skills.

## DECISION RULES
- **Invariant Enforcement**: Universal invariant **NO CLAIM WITHOUT EVIDENCE** applies unconditionally.
- **Fail-Safe Principle**: If a tool returns `NEEDS_CLARIFICATION` or validation fails, stop execution and report truth state.
- **Scope Guard**: Confine modifications strictly to designated module boundaries. Uninvited modifications to foreign files are blocked.

## MCP TOOL STRATEGY
- `generate_adr`: Canonical handler for generate adr. Always supply required schema parameters and handle structured return states.
- `create_action_plan`: Canonical handler for create action plan. Always supply required schema parameters and handle structured return states.
- `evaluate_change_risk`: Canonical handler for evaluate change risk. Always supply required schema parameters and handle structured return states.

## SOURCE / RESEARCH STRATEGY
- When referencing design systems, frameworks, or security standards, cite authoritative sources verified by `alper-source-intelligence`.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Secret leakage prevention: Never log, store, or emit unredacted credentials or API keys.
- Destructive command guard: High-risk operations (e.g., hard reset, clean, force push) require explicit operator confirmation.

## HUMAN CHECKPOINTS
- Ambiguous architectural directions requiring trade-off resolution.
- Destructive state changes or breaking schema migrations.
- Visual approval on high-impact user interface changes.

## STOP CONDITIONS
- Discovery readiness check returns `NEEDS_CLARIFICATION`.
- Tool execution reports critical validation or gate failure.
- Scope boundary violation detected by `alper-scope-guard`.

## FAILURE HANDLING
- On schema failure: Log exact validation error, preserve rollback checkpoint, and return non-zero exit state.
- On test failure: Mark gate as `FAILED`, capture diagnostic trace, and prevent downstream progression.
- Never report simulated success or fake PASS results.

## EVIDENCE REQUIREMENTS
- Every asserted completion must supply qualifying evidence (e.g. `LINT_CLEAN`, `UNIT_TESTS_PASS`, `BUILD_CLEAN`, `HUMAN_REVIEW`).
- Missing evidence strictly resolves to `NOT_VERIFIED`.

## OUTPUT CONTRACT
- Structured execution report detailing actions executed, tools invoked, and evidence captured.
- Verified artifacts and updated project intelligence entries.
- Explicit handoff envelope for next-phase skills.

## HANDOFF / RELATED SKILLS
- `alper-modernization-planner`: Handoff target for sibling MODERNIZATION operations.
- `alper-behavior-preservation`: Handoff target for sibling MODERNIZATION operations.
- `alper-modernization-review`: Handoff target for sibling MODERNIZATION operations.
