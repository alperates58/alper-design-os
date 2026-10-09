---
name: alper-dependency-hygiene
description: Audits packages for known CVEs, outdated versions, malicious packages, and unmaintained transitive dependencies.
---

# Alper Dependency Hygiene Skill

Keeps dependencies updated, minimal, and free of known vulnerabilities.

## Procedures
1. Run `npm audit`, `composer audit`, or `dotnet list package --vulnerable`.
2. Block dependencies with unpatched CRITICAL or HIGH CVEs.
3. Propose lockfile maintenance and minor upgrades via automated pull requests.
