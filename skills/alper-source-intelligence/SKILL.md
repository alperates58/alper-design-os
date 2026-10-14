---
name: alper-source-intelligence
description: Discovers, inspects, ranks, and licenses 65+ authoritative design systems, primitives, and icon/chart libraries. Use when executing source intelligence tasks for source intelligence. Do not use for unrelated capability domains or deprecated Phase 0 workflows.
status: ACTIVE
capabilityFamily: SOURCE_INTELLIGENCE
userFacing: true
mcpTools:
  - discover_sources
  - search_sources
  - rank_sources
  - inspect_source
  - recommend_sources_for_product
  - recommend_sources_for_stack
  - check_source_license
  - discover_design_sources
  - search_design_sources
  - inspect_design_source
  - sync_design_sources
  - recommend_design_sources
  - recommend_icon_system
  - recommend_chart_library
  - recommend_data_grid
  - explain_source_recommendation
  - search_components
  - search_mcp_servers
relatedSkills:
  - alper-registry-discovery
---

# Alper Source Intelligence Skill

## PURPOSE
Provides canonical, deterministic agent capability for **Source Intelligence** within the **SOURCE_INTELLIGENCE** capability family.
Primary focus: Discovers, inspects, ranks, and licenses 65+ authoritative design systems, primitives, and icon/chart libraries.

## USE WHEN
- Initiating or progressing tasks requiring source intelligence capabilities.
- Operating within mode-specific pipelines requiring SOURCE_INTELLIGENCE workflows.
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
3. **Execution & Tool Invocation**: Dispatch canonical MCP tools (`discover_sources`, `search_sources`, `rank_sources`, `inspect_source`, `recommend_sources_for_product`, `recommend_sources_for_stack`, `check_source_license`, `discover_design_sources`, `search_design_sources`, `inspect_design_source`, `sync_design_sources`, `recommend_design_sources`, `recommend_icon_system`, `recommend_chart_library`, `recommend_data_grid`, `explain_source_recommendation`, `search_components`, `search_mcp_servers`).
4. **Evidence Collection**: Gather qualifying verification artifacts (logs, diffs, test evidence).
5. **Quality Gate Evaluation**: Validate deliverables against release and safety gates.
6. **Output Synthesis**: Produce structured deliverables and handoff packages for downstream skills.

## DECISION RULES
- **Invariant Enforcement**: Universal invariant **NO CLAIM WITHOUT EVIDENCE** applies unconditionally.
- **Fail-Safe Principle**: If a tool returns `NEEDS_CLARIFICATION` or validation fails, stop execution and report truth state.
- **Scope Guard**: Confine modifications strictly to designated module boundaries. Uninvited modifications to foreign files are blocked.

## MCP TOOL STRATEGY
- `discover_sources`: Canonical handler for discover sources. Always supply required schema parameters and handle structured return states.
- `search_sources`: Canonical handler for search sources. Always supply required schema parameters and handle structured return states.
- `rank_sources`: Canonical handler for rank sources. Always supply required schema parameters and handle structured return states.
- `inspect_source`: Canonical handler for inspect source. Always supply required schema parameters and handle structured return states.
- `recommend_sources_for_product`: Canonical handler for recommend sources for product. Always supply required schema parameters and handle structured return states.
- `recommend_sources_for_stack`: Canonical handler for recommend sources for stack. Always supply required schema parameters and handle structured return states.
- `check_source_license`: Canonical handler for check source license. Always supply required schema parameters and handle structured return states.
- `discover_design_sources`: Canonical handler for discover design sources. Always supply required schema parameters and handle structured return states.
- `search_design_sources`: Canonical handler for search design sources. Always supply required schema parameters and handle structured return states.
- `inspect_design_source`: Canonical handler for inspect design source. Always supply required schema parameters and handle structured return states.
- `sync_design_sources`: Canonical handler for sync design sources. Always supply required schema parameters and handle structured return states.
- `recommend_design_sources`: Canonical handler for recommend design sources. Always supply required schema parameters and handle structured return states.
- `recommend_icon_system`: Canonical handler for recommend icon system. Always supply required schema parameters and handle structured return states.
- `recommend_chart_library`: Canonical handler for recommend chart library. Always supply required schema parameters and handle structured return states.
- `recommend_data_grid`: Canonical handler for recommend data grid. Always supply required schema parameters and handle structured return states.
- `explain_source_recommendation`: Canonical handler for explain source recommendation. Always supply required schema parameters and handle structured return states.
- `search_components`: Canonical handler for search components. Always supply required schema parameters and handle structured return states.
- `search_mcp_servers`: Canonical handler for search mcp servers. Always supply required schema parameters and handle structured return states.

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
- `alper-registry-discovery`: Handoff target for sibling SOURCE_INTELLIGENCE operations.
