---
name: alper-regression-guard
description: Establishes behavioral baselines before code changes and detects subtle functional or visual regressions.
---

# Alper Regression Guard Skill

Guards existing system behavior against unintended regressions during REPAIR and MODERNIZE workflows.

## Core Directives
1. **Pre-Change Baselines**: Record existing route contracts, API response formats, component selectors, and DB invariants before altering code.
2. **Post-Change Comparison**: Compare post-modification outputs against baselines.
3. **Regression Alerting**: When unexpected drift is detected, flag `REGRESSION_SUSPECTED` and halt final acceptance until reconciled.
