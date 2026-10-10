---
name: alper-scope-guard
description: Prevents uninvited file modifications and silent scope expansion outside user requirements.
---

# Alper Scope Guard Skill

Strictly bounds modifications to user-requested areas.

## Core Directives
1. **Zero Silent Expansion**: Never touch files or subsystems outside explicit user requests without declaring scope expansion.
2. **Scope Statuses**:
   - `IN_SCOPE`: Directly requested by the user brief.
   - `REQUIRED_DEPENDENCY`: Necessary linked component or CSS asset.
   - `OUT_OF_SCOPE`: Unrelated files, API routes, or package upgrades.
   - `FORBIDDEN`: Protected infrastructure, secrets, environment files, or explicitly blacklisted paths.
3. **Hard Rejection**: If forbidden files or unapproved scope expansions are detected, halt modification immediately.
