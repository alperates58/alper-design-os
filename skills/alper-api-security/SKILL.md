---
name: alper-api-security
description: Secures REST and Async APIs following OWASP API Security Top 10, rate limiting, and token governance.
---

# Alper API Security Skill

Hardens public and internal APIs against authorization bypasses, data exposure, and abuse.

## Core Protections
- **BOLA / IDOR Prevention**: Validate user ownership and tenant boundaries for every resource identifier.
- **Rate Limiting & Throttling**: Protect endpoints against brute force and resource exhaustion.
- **Strict Payload Validation**: Validate incoming request bodies against strict OpenAPI schemas.
- **Header Hardening**: Enforce CORS restrictions, CSP, HSTS, and Content-Type sniffing prevention.
