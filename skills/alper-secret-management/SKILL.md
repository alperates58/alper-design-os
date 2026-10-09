---
name: alper-secret-management
description: Zero-tolerance secret leak prevention. Scans for hardcoded tokens, private keys, API secrets, and enforces .env practices.
---

# Alper Secret Management Skill

Eliminates hardcoded credentials and enforces modern secret management.

## Policies
- Zero API keys, private keys, or passwords committed to source control.
- Enforce `.env.example` with dummy placeholder values.
- Integrate with secret managers (Vault, AWS Secrets Manager, Azure Key Vault, Doppler) for runtime credentials.
