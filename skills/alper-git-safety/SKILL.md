---
name: alper-git-safety
description: Protects user git working tree, blocks destructive commands (hard reset, clean -fd, force push), and manages safe checkpoints and rollbacks.
---

# Alper Git Safety Skill

Ensures non-destructive Git operations and rollback mechanisms.

## Core Directives
1. **Never Discard User Changes**: Never run destructive commands (`git reset --hard`, `git clean -fd`, `git push --force`) without explicit user consent.
2. **Dirty Tree Awareness**: Detect modified and untracked files before applying modifications.
3. **Safe Checkpoints**: Create lightweight checkpoint commits, stashes, or feature branches before executing changes with HIGH or CRITICAL blast radius.
4. **Deterministic Rollback**: Maintain step-by-step shell commands to revert changes back to clean working states.
