---
name: alper-change-impact-analysis
description: Analyzes the ripple effect and blast radius of proposed code or architectural modifications across requirements, modules, APIs, UI pages, and verification tests.
---

# Alper Change Impact Analysis Skill

Evaluates the consequences of modifying a component, entity, endpoint, or configuration before code is touched. Traverses the project architecture graph and traceability matrix to compute risk and recommend targeted test suites.

## Core Responsibilities

1. **Graph-Based Impact Traversal**:
   - Identifies all modules, services, database entities, APIs, and UI pages connected to the target component.
2. **Traceability Propagation**:
   - Maps affected requirements, business rules, and relevant historical ADRs.
3. **Risk Scoring**:
   - Calculates risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) based on dependency count, security sensitivity, and breaking change potential.
4. **Targeted Verification Planning**:
   - Proposes targeted unit, integration, and accessibility test suites rather than blind re-running of everything.

## Associated MCP Tools
- `analyze_change_impact`: Produces formal `ChangeImpactAssessment` with affected components and verification steps.
- `build_task_context`: Builds token-efficient, highly relevant task context tailored to the target scope.
