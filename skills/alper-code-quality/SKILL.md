---
name: alper-code-quality
description: Applies strict static analysis, typed linting (typescript-eslint, PHPStan, Roslyn), and cognitive complexity limits.
---

# Alper Code Quality Skill

Maintains high code quality standards through automated linters and static analysis.

## Stack Linters
- **TypeScript**: typescript-eslint strict typed linting, ESLint.
- **PHP**: PHPStan (Level 8+), PHP-CS-Fixer, PSR-12 conformance.
- **C# / .NET**: Roslyn Analyzers, StyleCop, editorconfig.

## Quality Gates
- No unused variables or dangling promises.
- Strict nullability checks enabled.
- Cognitive complexity kept below threshold (max 15 per function).
