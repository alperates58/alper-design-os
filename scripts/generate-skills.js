import fs from 'node:fs';
import path from 'node:path';

const skillsDir = path.resolve('skills');

const skills = [
  // A. Engineering Guardrails (12)
  {
    dir: 'alper-secure-coding',
    name: 'alper-secure-coding',
    description: 'Enforces proactive secure coding practices based on OWASP Top 10 2025, ASVS 5.0, and stack-aware security policies.',
    content: `# Alper Secure Coding Skill

Guidance and automated guardrails for developing secure software across all supported stacks.

## Authoritative Standards
- **OWASP ASVS 5.0.0**: Application Security Verification Standard (Level 1, 2, or 3).
- **OWASP Top 10 2025**: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, etc.
- **OWASP Cheat Sheet Series**: Practical, stack-specific defensive implementation patterns.
- **CWE Top 25**: Common Weakness Enumeration prevention.

## Procedure
1. Call \`generate_engineering_policy\` MCP tool with the project stack (e.g. \`typescript\`, \`laravel\`, \`aspnet\`).
2. Verify input validation, output encoding, and parameterized queries.
3. Validate authentication token lifetimes and secure cookie attributes (\`HttpOnly\`, \`Secure\`, \`SameSite=Strict\`).
4. Ensure defense-in-depth authorization checks on every state change and sensitive query.`
  },
  {
    dir: 'alper-security-audit',
    name: 'alper-security-audit',
    description: 'Runs passive security audits, vulnerability scanning, and evaluates findings against release gates.',
    content: `# Alper Security Audit Skill

Audits codebases for security vulnerabilities, configuration flaws, and release blockers.

## Critical Safety Notice
- All automatic security audits default to **PASSIVE / READ-ONLY** analysis.
- Active DAST or port scanning is strictly restricted to local/staging environments and requires explicit user consent.

## Procedure
1. Run \`run_safe_security_scan\` with target directory.
2. Evaluate results with \`evaluate_release_gates\`.
3. Check for CRITICAL and HIGH severity findings which block release gates.
4. Provide structured remediations for every flagged finding.`
  },
  {
    dir: 'alper-api-security',
    name: 'alper-api-security',
    description: 'Secures REST and Async APIs following OWASP API Security Top 10, rate limiting, and token governance.',
    content: `# Alper API Security Skill

Hardens public and internal APIs against authorization bypasses, data exposure, and abuse.

## Core Protections
- **BOLA / IDOR Prevention**: Validate user ownership and tenant boundaries for every resource identifier.
- **Rate Limiting & Throttling**: Protect endpoints against brute force and resource exhaustion.
- **Strict Payload Validation**: Validate incoming request bodies against strict OpenAPI schemas.
- **Header Hardening**: Enforce CORS restrictions, CSP, HSTS, and Content-Type sniffing prevention.`
  },
  {
    dir: 'alper-ai-coding-safety',
    name: 'alper-ai-coding-safety',
    description: 'Guardrails against AI hallucinations, insecure dependencies, credential leaks, and supply chain attacks in AI-generated code.',
    content: `# Alper AI Coding Safety Skill

Specialized guardrails designed for AI-assisted software engineering.

## Guardrail Rules
1. **Never Hallucinate Dependencies**: Check npm / packagist / nuget registries before recommending new packages.
2. **Never Commit Secrets**: Intercept hardcoded API tokens, private keys, or passwords.
3. **Validate Assumptions**: Never mark an untested flow or capability as "PASS".
4. **Architectural Consistency**: Ensure AI-generated code conforms to existing repository boundaries and patterns.`
  },
  {
    dir: 'alper-code-quality',
    name: 'alper-code-quality',
    description: 'Applies strict static analysis, typed linting (typescript-eslint, PHPStan, Roslyn), and cognitive complexity limits.',
    content: `# Alper Code Quality Skill

Maintains high code quality standards through automated linters and static analysis.

## Stack Linters
- **TypeScript**: typescript-eslint strict typed linting, ESLint.
- **PHP**: PHPStan (Level 8+), PHP-CS-Fixer, PSR-12 conformance.
- **C# / .NET**: Roslyn Analyzers, StyleCop, editorconfig.

## Quality Gates
- No unused variables or dangling promises.
- Strict nullability checks enabled.
- Cognitive complexity kept below threshold (max 15 per function).`
  },
  {
    dir: 'alper-performance-engineering',
    name: 'alper-performance-engineering',
    description: 'Enforces Core Web Vitals (LCP, INP, CLS), bundle budgets, pagination, and sub-second operational responsiveness.',
    content: `# Alper Performance Engineering Skill

Guarantees snappy user interfaces and scalable backend data operations.

## Performance Budgets
- **LCP (Largest Contentful Paint)**: < 2.5s (Target: < 1.8s).
- **INP (Interaction to Next Paint)**: < 200ms (Target: < 100ms).
- **CLS (Cumulative Layout Shift)**: < 0.1 (Target: < 0.05).
- **Initial JS Bundle**: < 300 KB gzipped.

## Techniques
- Virtualized lists for data tables exceeding 50 items.
- Keyset (seek) pagination for database queries.
- Code splitting and route-level lazy loading.`
  },
  {
    dir: 'alper-reliability',
    name: 'alper-reliability',
    description: 'Defines SLIs/SLOs, circuit breakers, retry policies, backoff strategies, and graceful degradation.',
    content: `# Alper Reliability Skill

Builds resilient software that degrades gracefully under failure conditions.

## Reliability Patterns
- **Exponential Backoff with Jitter**: Avoid thundering herd problems during downstream retries.
- **Circuit Breaker**: Stop traffic to failing external systems to allow recovery.
- **Fallback UI States**: Render cached data or informative offline placeholders when network requests fail.
- **SLI / SLO Tracking**: Define clear availability and latency targets.`
  },
  {
    dir: 'alper-supply-chain-security',
    name: 'alper-supply-chain-security',
    description: 'Enforces NIST SSDF, SLSA provenance, CycloneDX SBOM generation, and OpenSSF Scorecard hygiene.',
    content: `# Alper Supply Chain Security Skill

Protects the software supply chain from dependency poisoning and tampering.

## Core Capabilities
- **SBOM Generation**: Generate CycloneDX / SPDX Software Bill of Materials.
- **Provenance Attestation**: Align build pipelines with SLSA Build Level 2+.
- **Scorecard Auditing**: Verify OpenSSF Scorecard ratings for critical upstream libraries.`
  },
  {
    dir: 'alper-dependency-hygiene',
    name: 'alper-dependency-hygiene',
    description: 'Audits packages for known CVEs, outdated versions, malicious packages, and unmaintained transitive dependencies.',
    content: `# Alper Dependency Hygiene Skill

Keeps dependencies updated, minimal, and free of known vulnerabilities.

## Procedures
1. Run \`npm audit\`, \`composer audit\`, or \`dotnet list package --vulnerable\`.
2. Block dependencies with unpatched CRITICAL or HIGH CVEs.
3. Propose lockfile maintenance and minor upgrades via automated pull requests.`
  },
  {
    dir: 'alper-secret-management',
    name: 'alper-secret-management',
    description: 'Zero-tolerance secret leak prevention. Scans for hardcoded tokens, private keys, API secrets, and enforces .env practices.',
    content: `# Alper Secret Management Skill

Eliminates hardcoded credentials and enforces modern secret management.

## Policies
- Zero API keys, private keys, or passwords committed to source control.
- Enforce \`.env.example\` with dummy placeholder values.
- Integrate with secret managers (Vault, AWS Secrets Manager, Azure Key Vault, Doppler) for runtime credentials.`
  },
  {
    dir: 'alper-testing-strategy',
    name: 'alper-testing-strategy',
    description: 'Synthesizes project-appropriate test pyramids across Static, Unit, Integration, API, Contract, E2E, and Performance.',
    content: `# Alper Testing Strategy Skill

Generates custom-tailored test pyramids matched to project architecture.

## Strategy Selection
- Use \`generate_test_pyramid\` MCP tool with project archetype:
  - **LANDING_PAGE**: Focus on Smoke, Accessibility, Visual Regression, and Lighthouse Performance.
  - **ENTERPRISE_ERP_CRM**: Heavy Unit, Integration, E2E, ARIA Grid Accessibility, and Regression.
  - **MICROSERVICE_API**: Unit, Integration, Contract (Pact), and Load (k6).`
  },
  {
    dir: 'alper-observability',
    name: 'alper-observability',
    description: 'Architects OpenTelemetry tracing, metrics, structured logging, correlation IDs, and automated PII redaction.',
    content: `# Alper Observability Skill

Standardizes distributed tracing, metrics, and structured logging.

## Core Signals
- **Traces**: OpenTelemetry distributed context propagation across services.
- **Metrics**: Request rates, error counts, duration percentiles (p50, p95, p99).
- **Logs**: Structured JSON with trace_id, span_id, and automated PII redaction (scrubbing emails, tokens, cards).`
  },

  // B. Browser, QA & Verification (11)
  {
    dir: 'alper-browser-qa',
    name: 'alper-browser-qa',
    description: 'Master browser QA orchestration using Playwright MCP for functional flows and Chrome DevTools MCP for runtime inspection.',
    content: `# Alper Browser QA Skill

Master coordinator for browser-based QA verification and end-to-end testing.

## Tool Roles
- **Playwright MCP**: Functional user journey execution, multi-browser navigation, DOM interactions, accessibility tree queries.
- **Chrome DevTools MCP**: Deep runtime diagnostics, uncaught exceptions, 4xx/5xx network failures, performance traces, and DOM inspection.`
  },
  {
    dir: 'alper-playwright-testing',
    name: 'alper-playwright-testing',
    description: 'Generates deterministic, resilient Playwright E2E tests utilizing accessible role locators and user journeys.',
    content: `# Alper Playwright Testing Skill

Creates durable Playwright test suites that resist DOM refactoring.

## Best Practices
- Never use fragile CSS class selectors (e.g. \`.btn-primary\`, \`.css-1x84a9\`).
- Use accessible role locators: \`page.getByRole('button', { name: 'Submit' })\`.
- Test multiple viewports (Desktop 1920x1080, Tablet 768x1024, Mobile 390x844).`
  },
  {
    dir: 'alper-runtime-debugging',
    name: 'alper-runtime-debugging',
    description: 'Inspects runtime console errors, uncaught exceptions, network failures (4xx/5xx/CORS), and performance traces.',
    content: `# Alper Runtime Debugging Skill

Diagnoses runtime errors and network issues using Chrome DevTools MCP.

## Inspection Checklist
- Capture all console \`error\` and \`exception\` events.
- Audit failed HTTP requests (status 400+, 500+, or aborted CORS requests).
- Inspect source-mapped stack traces to pinpoint root cause.`
  },
  {
    dir: 'alper-visual-regression',
    name: 'alper-visual-regression',
    description: 'Evaluates pixel diffs across viewport matrix and themes, enforcing human review for visual changes.',
    content: `# Alper Visual Regression Skill

Protects user interfaces from unintended visual regressions across viewports and color schemes.

## Rules
- Test both Light and Dark modes.
- Evaluate multi-viewport matrix.
- Flag any visual diff > 0.05% for explicit human review.`
  },
  {
    dir: 'alper-accessibility-testing',
    name: 'alper-accessibility-testing',
    description: 'Verifies WCAG 2.1 AA/AAA compliance using axe-core automation combined with keyboard navigation checks.',
    content: `# Alper Accessibility Testing Skill

Ensures universal accessibility compliance across digital products.

## Standards
- Automated audit using axe-core (@axe-core/playwright).
- Full keyboard operability (Tab order, Enter/Space activation, Esc dismiss).
- Color contrast ratio minimums (4.5:1 for normal text, 3:1 for large text).
- ARIA live region announcements for dynamic data updates.`
  },
  {
    dir: 'alper-performance-testing',
    name: 'alper-performance-testing',
    description: 'Measures Lighthouse Core Web Vitals, correlated with DevTools traces to identify layout shifts and long tasks.',
    content: `# Alper Performance Testing Skill

Measures real-world user experience and Core Web Vitals.

## Procedure
1. Execute Lighthouse audit via Chrome DevTools.
2. Correlate slow LCP with unoptimized images or render-blocking scripts.
3. Correlate high INP with long tasks (> 50ms) on the main thread.
4. Output actionable optimization recommendations.`
  },
  {
    dir: 'alper-api-testing',
    name: 'alper-api-testing',
    description: 'Automates functional, edge-case, validation, and error contract testing of REST and GraphQL APIs.',
    content: `# Alper API Testing Skill

Verifies backend APIs independently of the user interface.

## Verification Matrix
- Happy path functional workflows with status 200/201.
- Schema validation failures returning 400 Bad Request.
- Authentication/Authorization checks returning 401/403.
- Idempotency key replay verification.`
  },
  {
    dir: 'alper-contract-testing',
    name: 'alper-contract-testing',
    description: 'Applies consumer-driven contract testing with Pact to prevent breaking integrations between services.',
    content: `# Alper Contract Testing Skill

Ensures microservices and frontend-backend boundaries do not break each other.

## Pact Workflow
1. Consumer writes expectations into Pact contract file.
2. Provider verifies contract against its live/staging endpoints.
3. Contracts are published to Pact Broker to gate deployments.`
  },
  {
    dir: 'alper-load-testing',
    name: 'alper-load-testing',
    description: 'Benchmarks throughput and latency under stress with Grafana k6, enforcing explicit approval for load tests.',
    content: `# Alper Load Testing Skill

Evaluates system throughput, latency, and degradation under concurrent load.

## Safety Constraint
- Load testing is destructive to unscaled targets.
- Requires explicit user approval before execution.`
  },
  {
    dir: 'alper-regression-testing',
    name: 'alper-regression-testing',
    description: 'Orchestrates selective smoke and regression test suites to safeguard critical user conversion funnels.',
    content: `# Alper Regression Testing Skill

Runs targeted test suites to safeguard established features after code modifications.

## Flow
1. Identify impacted modules based on git diff.
2. Run targeted unit and component tests.
3. Execute smoke E2E tests for primary conversion journeys.`
  },
  {
    dir: 'alper-cross-browser-testing',
    name: 'alper-cross-browser-testing',
    description: 'Validates user flows across Chromium, Firefox, WebKit, and mobile viewport simulations.',
    content: `# Alper Cross Browser Testing Skill

Validates rendering and behavioral parity across modern browser rendering engines.

## Engines Tested
- **Chromium** (Chrome, Edge, Opera)
- **Firefox** (Gecko)
- **WebKit** (Safari desktop & iOS simulation)`
  },

  // C. Software Engineering Intelligence (11)
  {
    dir: 'alper-architecture',
    name: 'alper-architecture',
    description: 'Analyzes project structure, classifies architectural styles (Hexagonal, Clean, Monolith, Microservices), and defines boundaries.',
    content: `# Alper Architecture Skill

Discovers and models the software architecture of any codebase.

## Capabilities
- Detects architecture style (Modular Monolith, Clean, Hexagonal, Microservices, Event-Driven, SPA+API).
- Maps subsystem boundaries, exported interfaces, and dependency direction.
- Records key architectural decisions using ADRs.`
  },
  {
    dir: 'alper-architecture-audit',
    name: 'alper-architecture-audit',
    description: 'Detects circular dependencies, inappropriate coupling, god classes, and cross-layer leakage.',
    content: `# Alper Architecture Audit Skill

Inspects architecture for structural technical debt and coupling violations.

## Anti-Pattern Checks
- Circular dependencies between modules.
- Presentation logic leaking into database repositories.
- God modules exceeding responsibility boundaries.`
  },
  {
    dir: 'alper-refactoring-strategy',
    name: 'alper-refactoring-strategy',
    description: 'Formulates safe refactoring roadmaps using strangler fig patterns, branch-by-abstraction, and ADRs.',
    content: `# Alper Refactoring Strategy Skill

Plans safe, incremental modernization of legacy codebases without big-bang rewrites.

## Patterns
- **Strangler Fig**: Incrementally intercept calls and route to modern implementations.
- **Branch by Abstraction**: Introduce an adapter interface, swap implementations behind feature flags.`
  },
  {
    dir: 'alper-database-engineering',
    name: 'alper-database-engineering',
    description: 'Architects transactional schemas, connection pooling, and multi-database persistence strategies.',
    content: `# Alper Database Engineering Skill

Designs robust relational and NoSQL data architectures.

## Standards
- Foreign key constraints and check constraints for relational integrity.
- Connection pooling configured with bounded min/max connections.
- Transaction isolation levels explicitly declared.`
  },
  {
    dir: 'alper-sql-performance',
    name: 'alper-sql-performance',
    description: 'Diagnoses N+1 query loops, missing foreign key indexes, and enforces keyset pagination over unbounded offsets.',
    content: `# Alper SQL Performance Skill

Optimizes query performance and eliminates database bottlenecks.

## Heuristics
- Flag loop queries fetching single records by ID (N+1 hazard).
- Recommend missing composite indexes on frequent WHERE/ORDER BY clauses.
- Replace \`OFFSET 100000\` with Keyset pagination (\`WHERE id > ?\`).`
  },
  {
    dir: 'alper-migration-safety',
    name: 'alper-migration-safety',
    description: 'Classifies DDL migration risk (SAFE/REVIEW/DANGEROUS) and enforces expand/contract schema evolution.',
    content: `# Alper Migration Safety Skill

Prevents catastrophic downtime caused by unsafe database migrations.

## Safety Levels
- **SAFE**: Non-locking changes (e.g. adding nullable column, new table).
- **REVIEW_REQUIRED**: Changes that may acquire locks or require concurrent indexing.
- **DANGEROUS**: Destructive drops (\`DROP TABLE\`, \`DROP COLUMN\`) or locking column constraints.`
  },
  {
    dir: 'alper-data-integrity',
    name: 'alper-data-integrity',
    description: 'Guarantees ACID transactions, idempotency keys, optimistic locking, and prevents duplicate writes.',
    content: `# Alper Data Integrity Skill

Protects transactional consistency in distributed and multi-user environments.

## Controls
- Optimistic concurrency control (version column).
- Idempotency key tracking on state-mutating API calls.
- Atomic multi-table updates wrapped in explicit transactions.`
  },
  {
    dir: 'alper-api-architecture',
    name: 'alper-api-architecture',
    description: 'Designs resilient REST/AsyncAPI contracts, detects breaking changes, and enforces semantic versioning.',
    content: `# Alper API Architecture Skill

Architects scalable APIs with clear contracts and versioning.

## Principles
- OpenAPI 3.1 / AsyncAPI 3.0 specification-first design.
- Automated breaking change detection before release.
- Semantic versioning (SemVer) on all public interfaces.`
  },
  {
    dir: 'alper-resilience',
    name: 'alper-resilience',
    description: 'Designs fault-tolerant architectures with bulkheads, rate limiters, fallback caches, and health checks.',
    content: `# Alper Resilience Skill

Ensures services withstand infrastructure failures and traffic spikes.

## Mechanisms
- Deep and shallow health check endpoints (\`/health/liveness\`, \`/health/readiness\`).
- Bulkhead isolation for resource-intensive subsystems.
- Graceful degradation when dependent microservices are unresponsive.`
  },
  {
    dir: 'alper-release-safety',
    name: 'alper-release-safety',
    description: 'Coordinates canary rollouts, OpenFeature feature flags, database backwards compatibility, and release gates.',
    content: `# Alper Release Safety Skill

Enables zero-downtime deployments and controlled feature rollouts.

## Capabilities
- OpenFeature feature flagging for gradual user rollout.
- Database backwards compatibility verification before code deployment.
- Automated release gate checks (evaluating security, tests, and secrets).`
  },
  {
    dir: 'alper-dependency-lifecycle',
    name: 'alper-dependency-lifecycle',
    description: 'Manages dependency lifecycles with Renovate policies, semantic pinning, and vendoring strategies.',
    content: `# Alper Dependency Lifecycle Skill

Governs how third-party code enters, updates, and exits the codebase.

## Policy
- Automated dependency update PRs with Renovate or Dependabot.
- Mandatory license compatibility check (MIT, Apache-2.0, BSD).
- Strict package hash verification via package lockfiles.`
  }
];

let created = 0;
for (const s of skills) {
  const dirPath = path.join(skillsDir, s.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const skillFile = path.join(dirPath, 'SKILL.md');
  const fileContent = `---
name: ${s.name}
description: ${s.description}
---

${s.content}
`;
  fs.writeFileSync(skillFile, fileContent, 'utf-8');
  created++;
}

console.log('Successfully generated ' + created + ' Antigravity skills in skills/');
