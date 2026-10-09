---
name: alper-ai-coding-safety
description: Guardrails against AI hallucinations, insecure dependencies, credential leaks, and supply chain attacks in AI-generated code.
---

# Alper AI Coding Safety Skill

Specialized guardrails designed for AI-assisted software engineering.

## Guardrail Rules
1. **Never Hallucinate Dependencies**: Check npm / packagist / nuget registries before recommending new packages.
2. **Never Commit Secrets**: Intercept hardcoded API tokens, private keys, or passwords.
3. **Validate Assumptions**: Never mark an untested flow or capability as "PASS".
4. **Architectural Consistency**: Ensure AI-generated code conforms to existing repository boundaries and patterns.
