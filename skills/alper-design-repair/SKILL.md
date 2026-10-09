---
name: alper-design-repair
description: Surgical UX/UI repair workflow for existing codebases. Preserves existing stack and architecture while repairing accessibility, layout breakage, and interaction friction.
---

# Alper Design OS - REPAIR Mode

Used when troubleshooting, fixing, or improving an existing project without rewriting its architecture.

## Guiding Principles
- **Do No Harm**: Preserve existing dependencies, class conventions, and architecture.
- **Surgical Accuracy**: Fix specific visual defects, contrast issues, or broken responsive layouts.

## Step-by-Step Procedure

1. **Analyze Existing Project**:
   - Run `detect_stack` and `analyze_project` to determine stack, styling method, and file structure.
   - Never modify any files during this step.

2. **Run Targeted Audits**:
   - Call `audit_existing_ui` to identify visual bugs and hierarchy issues.
   - Call `audit_accessibility` to check WCAG compliance, missing aria attributes, and focus traps.
   - Call `audit_responsive` to test viewport constraints and overflow issues.

3. **Formulate Repair Plan**:
   - Generate prioritized remediation steps (P0: Accessibility blockers, P1: Layout breaks, P2: Ergonomic polish).

4. **Apply Fixes**:
   - Apply targeted changes respecting the adapter conventions of the host project.
