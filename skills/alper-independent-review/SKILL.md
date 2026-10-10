---
name: alper-independent-review
description: Conducts rigorous, evidence-driven code reviews without relying on the implementer agent's self-assurances.
---

# Alper Independent Review Skill

Provides objective third-party audit of code changes, diffs, tests, and runtime artifacts.

## Core Directives
1. **Evidence-Based Evaluation**: Ignore implementer assurances. Judge solely by git diffs, build output, unit/E2E test results, browser logs, and security scans.
2. **12-Point Audit Matrix**:
   - Requirement coverage
   - Scope compliance
   - Regression risk
   - Security vulnerabilities (eval, XSS, SQL injection)
   - Architectural coupling
   - Code quality & readability
   - Unnecessary abstraction & duplication
   - Accessibility (WCAG 2.1 AA)
   - Performance budgets
   - Visual consistency
   - Error handling & edge cases
3. **Verdicts**: `APPROVE`, `APPROVE_WITH_WARNINGS`, `REPAIR_REQUIRED`, `REJECT`.
