---
name: alper-reliability
description: Defines SLIs/SLOs, circuit breakers, retry policies, backoff strategies, and graceful degradation.
---

# Alper Reliability Skill

Builds resilient software that degrades gracefully under failure conditions.

## Reliability Patterns
- **Exponential Backoff with Jitter**: Avoid thundering herd problems during downstream retries.
- **Circuit Breaker**: Stop traffic to failing external systems to allow recovery.
- **Fallback UI States**: Render cached data or informative offline placeholders when network requests fail.
- **SLI / SLO Tracking**: Define clear availability and latency targets.
