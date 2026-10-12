---
name: alper-modernization-planner
description: Formulates staged modernization plans, change classifications (KEEP/IMPROVE/REPLACE/DEFER/REMOVE), and candidate design directions.
---

# Alper Modernization Planner Skill

Translates project analysis and modernization intent into an executable, staged modernization plan with strict blast-radius controls.

## Pipeline Position
`PRESERVE -> CLASSIFY -> PLAN -> PROPOSE -> HUMAN SELECT`

## Core Responsibilities
1. **Modernization Intent Formulation**:
   - Enforce rigorous problem definition, user pain points, and measurable success criteria.
   - Reject vague inputs such as "Make it modern" without concrete technical and business context.
2. **Strategy Selection**:
   - Evaluate strategy options: `ADOPT`, `ADAPT`, `BRIDGE`, `MIGRATE`, `REBUILD_COMPONENT`, `REBUILD_PAGE`, `REBUILD_SHELL`.
   - Strictly prohibit `BIG_BANG_REWRITE` by default; require explicit user request and high justification.
3. **Change Classification**:
   - Classify every affected element into `KEEP`, `IMPROVE`, `REPLACE`, `DEFER`, or `REMOVE`.
   - Enforce `REMOVE` as high or critical risk with zero-dependent-flow verification.
4. **Staged Implementation**:
   - Divide execution into dynamic stages (Stage 1 Foundation, Stage 2 Shell, Stage 3 Target, Stage 4 Shared, Stage 5 Refinement).
   - Require independent checkpoints and rollback instructions per stage.
5. **Design Direction Candidates**:
   - Propose baseline and distinct candidates (A, B, C) varying by composition, hierarchy, density, navigation, and interaction.
   - Enforce mandatory `HUMAN_VISUAL_APPROVAL` before final release.

## Associated MCP Tools
- `create_modernization_intent`: Validates intent rationale and outcomes.
- `select_modernization_strategy`: Safely maps stack to modernization strategy.
- `classify_existing_elements`: Generates structured change decisions.
- `create_modernization_stages`: Dynamically plans implementation stages.
- `create_modernization_plan`: Emits comprehensive typed `ModernizationPlan`.
