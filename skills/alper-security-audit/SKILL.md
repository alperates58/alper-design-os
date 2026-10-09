---
name: alper-security-audit
description: Runs passive security audits, vulnerability scanning, and evaluates findings against release gates.
---

# Alper Security Audit Skill

Audits codebases for security vulnerabilities, configuration flaws, and release blockers.

## Critical Safety Notice
- All automatic security audits default to **PASSIVE / READ-ONLY** analysis.
- Active DAST or port scanning is strictly restricted to local/staging environments and requires explicit user consent.

## Procedure
1. Run `run_safe_security_scan` with target directory.
2. Evaluate results with `evaluate_release_gates`.
3. Check for CRITICAL and HIGH severity findings which block release gates.
4. Provide structured remediations for every flagged finding.
