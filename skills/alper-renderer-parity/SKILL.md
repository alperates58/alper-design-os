---
name: alper-renderer-parity
description: Verifies visual and behavioral parity across different technology stack renderers. Use when verifying renderer consistency across supported technology stacks. Do not use for executing single-project application development (use alper-greenfield-generator).
status: ACTIVE
capabilityFamily: DESIGN_UX
userFacingType: SUPPORTING_CAPABILITY
userFacing: false
modeApplicability:
  - CONTINUOUS_GOVERNANCE
mcpTools:
  - compare_renderer_parity
relatedSkills:
  - alper-cross-stack-rendering
  - alper-ui-blueprint
---

# Alper Renderer Parity Skill

## PURPOSE
Validates that different stack renderers (React vs Blade vs Razor) produce equivalent DOM structures, accessibility trees, and visual hierarchy from the same underlying blueprint.

## USE WHEN
- Verifying renderer consistency across supported technology stacks.
- Testing adapter compliance for new framework targets.
- Ensuring multi-stack component parity in cross-platform design systems.

## DO NOT USE WHEN
- Executing single-project application development (use alper-greenfield-generator).
- Fixing user-reported bugs (use alper-design-repair).
- Running security penetration testing (use alper-security-audit).

## MODE APPLICABILITY
- Supported Modes: **CONTINUOUS_GOVERNANCE**.
- Applicability Context: Operates strictly within declared modes; does not execute outside its operational boundaries.


## REQUIRED CONTEXT
- UI wireframes, page layouts, component markup, or browser DOM.
- Design token definitions (tokens.json, tokens.css) and theme configurations.
- Stated user personas and target operational density.

## PROJECT INTELLIGENCE LOADING
**Status: NOT_REQUIRED**
Operates as a self-contained, stateless capability. Does not require loading repository project intelligence snapshots to perform its core diagnosis or transformation.

## DISCOVERY / AMBIGUITY BEHAVIOR
**Protocol: NOT_APPLICABLE**
Operates on concrete, localized technical artifacts (e.g. query plans, code diffs, DOM elements). Discovery ambiguity gates do not apply to direct inspection or repair of existing assets.

## WORKFLOW
1. Render identical PageBlueprint using two different stack renderers.
2. Compare DOM element hierarchy, ARIA attributes, and token bindings.
3. Detect discrepancies or adapter-specific rendering defects.
4. Emit ParityReport.

## DECISION RULES
- Accessibility Parity: All renderers must generate identical accessibility trees and roles.
- Parity score below 95% indicates an adapter defect requiring remediation.

## MCP TOOL STRATEGY
- `compare_renderer_parity`: Canonical handler for compare renderer parity. Always pass required schema arguments; handle return states deterministically.

## SOURCE / RESEARCH STRATEGY
- Authoritative Guidance: W3C DOM specifications, accessibility tree diffing, and cross-stack parity matrices.
- Prohibit ad-hoc, unverified external advice.

## POLICY & GOVERNANCE
- Complies strictly with `rules/AGENTS.md`.
- Universal Evidence Invariant: **NO CLAIM WITHOUT EVIDENCE**.
- Secret Redaction: All credentials, connection strings, and tokens must be masked with `[REDACTED]`.

## HUMAN CHECKPOINTS
- None required during automated parity checking.

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
- RendererParityReport with element diff and parity score.

## HANDOFF / RELATED SKILLS
- `alper-cross-stack-rendering`: Downstream or sibling capability for DESIGN_UX operations.
- `alper-ui-blueprint`: Downstream or sibling capability for DESIGN_UX operations.
