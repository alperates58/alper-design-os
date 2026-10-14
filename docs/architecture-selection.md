# Architecture Selection & Anti-Overengineering Guardrails

## Purpose

The Architecture Selection Engine prevents premature complexity and cognitive bloat in generated projects. In Alper Design OS, distributed microservices, event streaming brokers (e.g. Apache Kafka), and container orchestration platforms (e.g. Kubernetes) are explicitly **prohibited** for small-to-medium scale applications.

---

## Architectural Styles & Complexity Budget

| Architecture Style | Complexity Budget | Operational Simplicity | Typical Target Use Cases |
| :--- | :--- | :--- | :--- |
| `MONOLITH` | $\le 3 / 10$ | $9 / 10$ | Small CRUD apps, internal tools, prototypes, single-team projects |
| `MODULAR_MONOLITH` | $4 - 6 / 10$ | $8 / 10$ | Multi-domain operational backoffices, data-dense workbenches |
| `JAMSTACK` | $3 - 5 / 10$ | $8 / 10$ | Content-heavy marketing sites, static catalogs, serverless frontends |
| `EVENT_DRIVEN` | $7 - 8 / 10$ | $4 / 10$ | High-throughput asynchronous pipelines, telemetry ingestion |
| `MICROSERVICES` | $9 - 10 / 10$ | $2 / 10$ | Extreme scale, independent multi-organization domain teams (Strict Gate) |

---

## Selection Algorithm & Fitness Assessment

When evaluating a project brief, the engine computes:

1. **Domain Criticality & Sensitivity**: High security or regulated domains mandate isolation without requiring distributed services.
2. **Concurrency & Scale Forecast**:
   - $< 1,000$ concurrent users $\rightarrow$ Guaranteed `MONOLITH` or `MODULAR_MONOLITH`.
   - SQLite / PostgreSQL single-instance storage is preferred over clustered distributed databases.
3. **Prohibited Technologies Check**:
   - Any suggestion of Kafka, Kubernetes, or service meshes for a CRUD/Operational tool triggers a hard rejection with replacement recommendations:
     - Kafka $\rightarrow$ In-process event emitter or SQLite / PostgreSQL job queue.
     - Kubernetes $\rightarrow$ Docker Compose or single VM deployment.
     - Microservices $\rightarrow$ Modular monolith with clean module boundaries.
