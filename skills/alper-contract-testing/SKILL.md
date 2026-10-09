---
name: alper-contract-testing
description: Applies consumer-driven contract testing with Pact to prevent breaking integrations between services.
---

# Alper Contract Testing Skill

Ensures microservices and frontend-backend boundaries do not break each other.

## Pact Workflow
1. Consumer writes expectations into Pact contract file.
2. Provider verifies contract against its live/staging endpoints.
3. Contracts are published to Pact Broker to gate deployments.
