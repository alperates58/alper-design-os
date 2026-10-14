---
name: alper-ui-recipe
description: Canonical UI recipes defining standard layouts, responsive regions, and component interactions. Use when executing design ux tasks for ui recipe. Do not use for unrelated capability domains or deprecated Phase 0 workflows.
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacing: true
mcpTools:
  - create_ui_recipe
relatedSkills:
  - alper-design-language
  - alper-design-personality
  - alper-pattern-graph
  - alper-design-critic
---

# Alper Ui Recipe Skill

## PURPOSE
Provides canonical, deterministic agent capability for **Ui Recipe** within the **DESIGN_UX** capability family.
Primary focus: Canonical UI recipes defining standard layouts, responsive regions, and component interactions.

## USE WHEN
- Initiating or progressing tasks requiring ui recipe capabilities.
- Operating within mode-specific pipelines requiring DESIGN_UX workflows.
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
3. **Execution & Tool Invocation**: Dispatch canonical MCP tools (`create_ui_recipe`).
4. **Evidence Collection**: Gather qualifying verification artifacts (logs, diffs, test evidence).
5. **Quality Gate Evaluation**: Validate deliverables against release and safety gates.
6. **Output Synthesis**: Produce structured deliverables and handoff packages for downstream skills.

## DECISION RULES
- **Invariant Enforcement**: Universal invariant **NO CLAIM WITHOUT EVIDENCE** applies unconditionally.
- **Fail-Safe Principle**: If a tool returns `NEEDS_CLARIFICATION` or validation fails, stop execution and report truth state.
- **Scope Guard**: Confine modifications strictly to designated module boundaries. Uninvited modifications to foreign files are blocked.

## MCP TOOL STRATEGY
- `create_ui_recipe`: Canonical handler for create ui recipe. Always supply required schema parameters and handle structured return states.

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
- `alper-design-language`: Handoff target for sibling DESIGN_UX operations.
- `alper-design-personality`: Handoff target for sibling DESIGN_UX operations.
- `alper-pattern-graph`: Handoff target for sibling DESIGN_UX operations.
- `alper-design-critic`: Handoff target for sibling DESIGN_UX operations.
