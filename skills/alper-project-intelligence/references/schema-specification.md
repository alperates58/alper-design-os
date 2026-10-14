# Project Intelligence Durable Memory Specification

All persistent project memory is version-controlled inside `.alper-design-os/project/`:

## Directory Structure
- `.alper-design-os/project/snapshot.json`: Current canonical snapshot of project state.
- `.alper-design-os/project/architecture-graph.json`: Subsystem boundaries, module dependencies.
- `.alper-design-os/project/business-rules.json`: Derived and operator-confirmed business rules.
- `.alper-design-os/project/decisions/`: Markdown/JSON Architecture Decision Records (ADRs).
- `.alper-design-os/project/invariants.json`: Non-negotiable technical invariants.

## Integrity Invariant
- Business rules must record provenance (`DERIVED` vs `USER_CONFIRMED`).
- Unverified inferences must never be treated as verified ground truth.
