---
name: alper-secure-coding
description: Enforces proactive secure coding practices based on OWASP Top 10 2025, ASVS 5.0, and stack-aware security policies.
---

# Alper Secure Coding Skill

Guidance and automated guardrails for developing secure software across all supported stacks.

## Authoritative Standards
- **OWASP ASVS 5.0.0**: Application Security Verification Standard (Level 1, 2, or 3).
- **OWASP Top 10 2025**: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, etc.
- **OWASP Cheat Sheet Series**: Practical, stack-specific defensive implementation patterns.
- **CWE Top 25**: Common Weakness Enumeration prevention.

## Procedure
1. Call `generate_engineering_policy` MCP tool with the project stack (e.g. `typescript`, `laravel`, `aspnet`).
2. Verify input validation, output encoding, and parameterized queries.
3. Validate authentication token lifetimes and secure cookie attributes (`HttpOnly`, `Secure`, `SameSite=Strict`).
4. Ensure defense-in-depth authorization checks on every state change and sensitive query.
