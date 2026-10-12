---
name: alper-modernization-review
description: Evaluates modernization pull requests and plans against behavioral preservation, dependency creep, truthful UI, and completion contracts.
---

# Alper Modernization Review Skill

Governs the independent review and completion gating of modernization tasks, ensuring self-assurances are never accepted without evidence.

## Pipeline Position
`INDEPENDENT_REVIEW -> COMPLETION_CONTRACT`

## Core Responsibilities
1. **Scope Fidelity & Boundary Audit**:
   - Verify changes remained strictly within declared scope levels (COMPONENT, PAGE, FEATURE, SHELL, MODULE, APPLICATION).
   - Ensure a page-level task never silently expanded into global shell or application files.
2. **Behavior Preservation Audit**:
   - Verify 100% pass rate on behavioral baseline route, auth, and form comparisons.
3. **Unnecessary Rewrite & Dependency Creep Detection**:
   - Flag gratuitous rewrites when incremental bridge/adapter modernization was possible.
   - Reject new dependencies justified solely by "UI looks nicer".
4. **Truthful UI & Telemetry Inspection**:
   - Enforce FAZ 1E.7 Truthful UI policy: zero fake status, fake telemetry, or fabricated operational indicators.
5. **Modernization Completion Contract**:
   - Validate all 8 gates (technical, visualAI, ux, accessibility, security, regression, contentTruth, humanVisualApproval).
   - Enforce that `verdict = COMPLETE` can only be generated when `HUMAN_VISUAL_APPROVAL === 'APPROVED'`.

## Associated MCP Tools
- `review_change`: Runs independent review including modernization-specific criteria.
- `evaluate_modernization_completion`: Generates signed `ModernizationCompletionContract`.
- `manage_human_visual_approval`: Inspects and records human visual sign-off.
