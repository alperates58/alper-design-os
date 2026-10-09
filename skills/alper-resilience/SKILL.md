---
name: alper-resilience
description: Designs fault-tolerant architectures with bulkheads, rate limiters, fallback caches, and health checks.
---

# Alper Resilience Skill

Ensures services withstand infrastructure failures and traffic spikes.

## Mechanisms
- Deep and shallow health check endpoints (`/health/liveness`, `/health/readiness`).
- Bulkhead isolation for resource-intensive subsystems.
- Graceful degradation when dependent microservices are unresponsive.
