---
name: alper-dependency-lifecycle
description: Manages dependency lifecycles with Renovate policies, semantic pinning, and vendoring strategies.
---

# Alper Dependency Lifecycle Skill

Governs how third-party code enters, updates, and exits the codebase.

## Policy
- Automated dependency update PRs with Renovate or Dependabot.
- Mandatory license compatibility check (MIT, Apache-2.0, BSD).
- Strict package hash verification via package lockfiles.
