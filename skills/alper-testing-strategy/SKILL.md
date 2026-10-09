---
name: alper-testing-strategy
description: Synthesizes project-appropriate test pyramids across Static, Unit, Integration, API, Contract, E2E, and Performance.
---

# Alper Testing Strategy Skill

Generates custom-tailored test pyramids matched to project architecture.

## Strategy Selection
- Use `generate_test_pyramid` MCP tool with project archetype:
  - **LANDING_PAGE**: Focus on Smoke, Accessibility, Visual Regression, and Lighthouse Performance.
  - **ENTERPRISE_ERP_CRM**: Heavy Unit, Integration, E2E, ARIA Grid Accessibility, and Regression.
  - **MICROSERVICE_API**: Unit, Integration, Contract (Pact), and Load (k6).
