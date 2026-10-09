---
name: alper-playwright-testing
description: Generates deterministic, resilient Playwright E2E tests utilizing accessible role locators and user journeys.
---

# Alper Playwright Testing Skill

Creates durable Playwright test suites that resist DOM refactoring.

## Best Practices
- Never use fragile CSS class selectors (e.g. `.btn-primary`, `.css-1x84a9`).
- Use accessible role locators: `page.getByRole('button', { name: 'Submit' })`.
- Test multiple viewports (Desktop 1920x1080, Tablet 768x1024, Mobile 390x844).
