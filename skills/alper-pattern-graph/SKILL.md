---
name: alper-pattern-graph
description: Navigates and applies the 28 technology-independent UX patterns (Gantt, Dense Grid, Command Palette, Split Pane, Master-Detail, etc.) according to domain requirements.
---

# Alper Pattern Knowledge Graph

This skill connects user intents and domain ergonomics to 28 foundational UX patterns.

## Workflow

1. **Pattern Identification**:
   - Query patterns matching required interaction style (`COMMAND_PALETTE` for keyboard power users, `DENSE_GRID` for high-throughput blotters, `MASTER_DETAIL` for contextual list exploration).
2. **Ergonomic Specifications**:
   - Verify keyboard navigation specs (WAI-ARIA APG compliance, arrow traversal, focus traps).
   - Evaluate accessibility requirements (ARIA roles, contrast limits, screen-reader landmarks).
3. **Mobile Strategy Formulation**:
   - Select responsive transformation (drawer collapse, horizontal swipe with pinned column, stacked cards).
4. **Candidate Source Mapping**:
   - Link chosen pattern to battle-tested reference implementations (Carbon, Radix, Polaris).
