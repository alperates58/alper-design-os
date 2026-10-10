---
name: alper-change-planner
description: Creates rigorous AgentActionPlan contracts with blast radius, forbidden files, rollback strategies, and mandatory verification before any code changes.
---

# Alper Change Planner Skill

Enforces structured planning before modifying any project files.

## Core Directives
1. **Never mutate code without an action plan**: Every modification must have an explicit objective, requested scope boundaries, and estimated blast radius.
2. **Blast Radius Assessment**: Compute risk level (LOW, MEDIUM, HIGH, CRITICAL) evaluating file volume, DB changes, authentication, public APIs, and data loss risks.
3. **Mandatory Checkpoint for High Risk**: HIGH and CRITICAL blast radius plans strictly mandate a pre-change git checkpoint.
4. **Automated Rollback Strategy**: Every plan must supply deterministic rollback steps (e.g. `git checkout -- <files>` or checkpoint checkout).
