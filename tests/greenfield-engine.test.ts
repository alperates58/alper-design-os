import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import {
  createGreenfieldProjectProfile,
  deriveRequirements,
  createRequirementTraceability,
  recommendArchitecture,
  recommendStack,
  createDatabaseBlueprint,
  createApiBlueprint,
  createAuthModel,
  createPageInventory,
  createProjectPerformanceBudget,
  createProjectObservabilityProfile,
  createNewProjectBlueprint,
  createProjectImplementationPlan,
  createRequirementBoundaryContract,
  scaffoldNewProject,
  evaluateNewProjectCompletion,
  DEFAULT_GATE_EVIDENCE_POLICIES
} from '@alper-design-os/agent-governance';
import * as Tools from '../packages/mcp-server/src/tools/index.js';

describe('ALPER DESIGN OS - FAZ 1G: New Project Generation Engine V1', () => {
  const workspacesDir = path.resolve('tests/workspaces/greenfield');
  const fixturesDir = path.resolve('tests/fixtures/greenfield');

  // Helper to load fixture JSON
  function loadBenchmark(fileName: string) {
    const raw = fs.readFileSync(path.join(fixturesDir, fileName), 'utf-8');
    return JSON.parse(raw);
  }

  // 1. Greenfield Project Profile Creation
  it('1. creates validated GreenfieldProjectProfile from brief and constraints', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile({
      ...bench.expectedProfile,
      productName: bench.expectedProfile.productName,
      productPurpose: bench.expectedProfile.productPurpose
    });

    expect(profile.productName).toBe('AssetTrack Internal');
    expect(profile.domain).toContain('Asset Management');
    expect(profile.businessCriticality).toBe('LOW');
    expect(profile.expectedScale).toBe('SMALL_INTERNAL');
    expect(profile.deviceTargets).toContain('DESKTOP');
    expect(profile.deploymentEnvironment).toBe('DOCKER');
  });

  // 2. Requirements Derivation & Anti-Hallucination Source Rule
  it('2. derives structured requirements with explicit provenance without hallucination', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    expect(bundle.functional.length).toBeGreaterThanOrEqual(3);
    expect(bundle.nonFunctional.length).toBeGreaterThanOrEqual(3);
    expect(bundle.businessRules.length).toBeGreaterThanOrEqual(2);
    expect(bundle.acceptanceCriteria.length).toBeGreaterThanOrEqual(3);
    expect(bundle.userJourneys.length).toBeGreaterThanOrEqual(1);

    // Provenance verification: Every requirement has a valid source
    for (const req of bundle.functional) {
      expect(['EXPLICIT_USER_BRIEF', 'DOMAIN_INFERENCE', 'SECURITY_POLICY', 'PLATFORM_BASELINE']).toContain(req.source);
      if (req.source !== 'EXPLICIT_USER_BRIEF') {
        expect(req.confidence).toBeLessThanOrEqual(0.85);
      }
    }

    // Canonical WCAG 2.2 AA default verification
    const a11yReq = bundle.nonFunctional.find(n => n.id === 'REQ-NFR-A11Y');
    expect(a11yReq).toBeDefined();
    expect(a11yReq?.description).toContain('WCAG 2.2 Level AA');

    // Business rules provenance verification
    for (const br of bundle.businessRules) {
      expect(['EXPLICIT_REQUIREMENT', 'POLICY_REQUIREMENT', 'REVERSIBLE_ASSUMPTION', 'DOMAIN_INFERENCE']).toContain(br.provenance);
    }

    // Acceptance criteria must carry Gherkin format and initialize as DEFINED / NOT_VERIFIED
    for (const ac of bundle.acceptanceCriteria) {
      expect(ac.given).toBeDefined();
      expect(ac.when).toBeDefined();
      expect(ac.then).toBeDefined();
      expect(ac.verified).toBe(false);
      expect(ac.status).toBe('DEFINED');
      expect(ac.verificationStatus).toBe('NOT_VERIFIED');
    }
  });

  // 3. Bidirectional Requirement Traceability Matrix
  it('3. generates bidirectional requirement traceability matrix and detects orphans', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    const rtm = createRequirementTraceability(bundle.functional, {
      architecturalDecisions: ['ADR-001-Monolith'],
      databaseEntities: ['assets', 'assignments'],
      apiEndpoints: ['GET /api/v1/assets', 'POST /api/v1/assets'],
      pages: ['Asset Inventory', 'Asset Detail'],
      implementationFiles: ['src/App.tsx', 'src/api/client.ts'],
      verificationTests: ['tests/asset.test.ts']
    });

    expect(rtm.matrix.length).toBe(bundle.functional.length);
    expect(rtm.coveragePercentage).toBeGreaterThanOrEqual(50);
    expect(rtm.untraceableCount).toBeDefined();
    expect(Array.isArray(rtm.orphanRequirements)).toBe(true);
    expect(Array.isArray(rtm.unexpectedFeatures)).toBe(true);
  });

  // 3b. Requirement Traceability Never Invents Targets
  it('3b. requirement traceability matrix never invents targets when artifacts are absent', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    // Call RTM with empty artifacts object
    const rtm = createRequirementTraceability(bundle.functional, {});

    // Must NOT contain hallucinated strings
    for (const item of rtm.items) {
      for (const edge of item.edges) {
        if (edge.applicability === 'APPLICABLE') {
          expect(edge.targetId).toBeUndefined();
          expect(edge.reason).toContain('UNRESOLVED');
          expect(edge.targetId).not.toBe('DECISION_MONOLITH');
          expect(edge.targetId).not.toBe('users');
          expect(edge.targetId).not.toBe('/api/v1/health');
          expect(edge.targetId).not.toBe('PAGE_DASHBOARD');
          expect(edge.targetId).not.toBe('test_suite');
        }
      }
      expect(item.status).toBe('ORPHAN');
    }
    expect(rtm.orphanRequirements.length).toBe(bundle.functional.length);
    expect(rtm.coveragePercentage).toBe(0);
  });

  // 4. Anti-Overengineering Architecture Selection (Small CRUD)
  it('4. enforces anti-overengineering guardrails: small CRUD receives MONOLITH with low complexity score', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    const arch = recommendArchitecture(profile, bundle);

    expect(arch.style).toBe('MONOLITH');
    expect(arch.complexityBudget.complexityScore).toBeLessThanOrEqual(3);
    expect(arch.antiOverengineeringGuard.triggered).toBe(true);
    expect(arch.prohibitedTechnologies).toContain('KAFKA');
    expect(arch.prohibitedTechnologies).toContain('KUBERNETES');
    expect(arch.prohibitedTechnologies).toContain('MICROSERVICES');
    expect(arch.fitnessAssessment.operationalSimplicityScore).toBeGreaterThanOrEqual(80);
  });

  // 5. Architecture Selection: Data-Dense Operational System
  it('5. recommends MODULAR_MONOLITH for mission-critical enterprise operational terminal', () => {
    const bench = loadBenchmark('data-dense-operational.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    const arch = recommendArchitecture(profile, bundle);

    expect(arch.style).toBe('MODULAR_MONOLITH');
    expect(arch.prohibitedTechnologies).toContain('MICROSERVICES');
    expect(arch.complexityBudget.maxAcceptableComplexity).toBeGreaterThanOrEqual(5);
  });

  // 6. Stack Recommendation across 4 Target Stacks
  it('6. recommends appropriate production stack respecting user preference and domain', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);

    const reactStack = recommendStack(profile, undefined, 'REACT_TYPESCRIPT');
    expect(reactStack.primaryStack).toBe('REACT_TYPESCRIPT');
    expect(reactStack.frontendLanguage).toBe('TypeScript');

    const bladeStack = recommendStack(profile, undefined, 'LARAVEL_BLADE');
    expect(bladeStack.primaryStack).toBe('LARAVEL_BLADE');
    expect(bladeStack.templateEngine).toBe('Blade');

    const razorStack = recommendStack(profile, undefined, 'ASPNET_RAZOR');
    expect(razorStack.primaryStack).toBe('ASPNET_RAZOR');
    expect(razorStack.backendLanguage).toBe('C#');

    const plainStack = recommendStack(profile, undefined, 'PLAIN_HTML_CSS_JS');
    expect(plainStack.primaryStack).toBe('PLAIN_HTML_CSS_JS');
    expect(plainStack.buildTool).toBe('NONE');
  });

  // 7. Database Blueprint with Data Classification & SQL Migrations
  it('7. creates database blueprint with field-level sensitivity classification and migrations', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);
    const stack = recommendStack(profile, undefined, 'REACT_TYPESCRIPT');

    const db = createDatabaseBlueprint(profile, bundle, stack);

    expect(db.engine).toBe('SQLITE');
    expect(db.tables.length).toBeGreaterThanOrEqual(2);
    expect(db.migrations.length).toBeGreaterThanOrEqual(1);

    // Verify migration SQL contains table creations
    const migration = db.migrations[0];
    expect(migration.upSql).toContain('CREATE TABLE');

    // Verify data sensitivity classification exists on columns
    const usersTable = db.tables.find(t => t.tableName === 'users');
    expect(usersTable).toBeDefined();
    const pwColumn = usersTable?.columns.find(c => c.columnName === 'password_hash');
    expect(pwColumn?.sensitivity).toBe('SENSITIVE');
    expect(pwColumn?.maskInLogs).toBe(true);
  });

  // 8. API Blueprint with REST Endpoints and OpenAPI 3.1.0 Document
  it('8. creates API blueprint with standard pagination, envelopes, and OpenAPI 3.1.0 specification', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);
    const stack = recommendStack(profile, undefined, 'REACT_TYPESCRIPT');
    const db = createDatabaseBlueprint(profile, bundle, stack);

    const api = createApiBlueprint(profile, bundle, db);

    expect(api.endpoints.length).toBeGreaterThanOrEqual(3);
    expect(api.pagination.defaultLimit).toBe(25);
    expect(api.errorEnvelope.code).toBeDefined();

    // Verify OpenAPI 3.1.0 document is properly formed
    expect(api.openApiDocument.openapi).toBe('3.1.0');
    expect(api.openApiDocument.info.title).toContain(profile.productName);
    expect(Object.keys(api.openApiDocument.paths).length).toBeGreaterThan(0);
  });

  // 9. Separated Authentication & Authorization Model
  it('9. enforces separated authentication mechanics and role-based authorization rules', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    const auth = createAuthModel(profile, bundle);

    expect(auth.authentication.mechanism).toBe('SESSION_COOKIE');
    expect(auth.authentication.sessionCookieName).toBe('app_session');
    expect(auth.authorization.roles.length).toBeGreaterThanOrEqual(2);
    expect(auth.authorization.roles.some(r => r.roleName === 'Admin')).toBe(true);
    expect(auth.authorization.permissions.length).toBeGreaterThanOrEqual(2);
  });

  // 10. Page Inventory with Navigation Tree & 8 Mandatory Page States
  it('10. creates page inventory with Information Architecture and 8 UX states per page', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    const inventory = createPageInventory(profile, bundle);

    expect(inventory.pages.length).toBeGreaterThanOrEqual(3);
    expect(inventory.navigationTree.length).toBeGreaterThanOrEqual(2);

    // Verify all 8 states are defined for each page
    const statesExpected = ['LOADING', 'EMPTY', 'SUCCESS', 'ERROR', 'PARTIAL', 'UNAUTHORIZED', 'FORBIDDEN', 'OFFLINE'];
    for (const page of inventory.pages) {
      for (const st of statesExpected) {
        expect(page.states[st as keyof typeof page.states]).toBeDefined();
      }
    }
  });

  // 11. Performance Budget & Observability Profile
  it('11. creates performance budget and observability profile', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);

    const perfBudget = createProjectPerformanceBudget(profile);
    expect(perfBudget.maxBundleSizeKb).toBeGreaterThan(0);
    expect(perfBudget.maxLcpMs).toBeLessThanOrEqual(2500);

    const obsProfile = createProjectObservabilityProfile(profile);
    expect(obsProfile.structuredLogging).toBe(true);
    expect(obsProfile.sensitiveFieldRedaction.length).toBeGreaterThanOrEqual(4);
    expect(obsProfile.healthCheckEndpoint).toBe('/health');
  });

  // 12. Requirement Boundary Contract (Feature Creep Blocker)
  it('12. creates requirement boundary contract and catches feature creep', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const bundle = deriveRequirements(profile, bench.userBrief);

    const contract = createRequirementBoundaryContract(profile, bundle);

    expect(contract.allowedFeatureIds.length).toBe(bundle.functional.length);
    expect(contract.forbiddenTechnologies).toContain('KAFKA');

    // Check breach detection
    const breachCheck = contract.checkFeatureCreep([
      'REQ-FUNC-01',
      'UNREQUESTED-AI-CHATBOT'
    ]);
    expect(breachCheck.hasCreep).toBe(true);
    expect(breachCheck.unauthorizedFeatures).toContain('UNREQUESTED-AI-CHATBOT');
  });

  // 13. Master Blueprint Assembly
  it('13. synthesizes master NewProjectBlueprint with all subsystems and validation', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);

    const blueprint = createNewProjectBlueprint(profile, {
      userPreferredStack: 'REACT_TYPESCRIPT'
    });

    expect(blueprint.blueprintId).toBeDefined();
    expect(blueprint.profile.productName).toBe('AssetTrack Internal');
    expect(blueprint.requirements.functional.length).toBeGreaterThan(0);
    expect(blueprint.architecture.style).toBe('MONOLITH');
    expect(blueprint.stack.primaryStack).toBe('REACT_TYPESCRIPT');
    expect(blueprint.database.tables.length).toBeGreaterThan(0);
    expect(blueprint.api.endpoints.length).toBeGreaterThan(0);
    expect(blueprint.pages.pages.length).toBeGreaterThan(0);
    expect(blueprint.boundaryContract.allowedFeatureIds.length).toBeGreaterThan(0);
  });

  // 14. Implementation Plan Generation (Dynamic Dependency-Driven Stages)
  it('14. derives implementation stages dynamically from dependencies and project features', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });

    // 1. Standard CRUD has 7 stages
    const planStandard = createProjectImplementationPlan(blueprint);
    expect(planStandard.stages.length).toBe(7);
    expect(planStandard.stages.map(s => s.type)).toEqual([
      'FOUNDATION',
      'DATA',
      'API',
      'AUTH',
      'SHELL',
      'CORE_WORKFLOW',
      'HARDENING'
    ]);
    expect(planStandard.estimatedDays).toBeGreaterThan(0);

    // 2. Project with reporting needs dynamically generates 8 stages (adding SECONDARY_WORKFLOW)
    const profileWithReporting = createGreenfieldProjectProfile({
      ...bench.expectedProfile,
      reportingNeeds: true
    });
    const blueprintWithReporting = createNewProjectBlueprint(profileWithReporting, { userPreferredStack: 'REACT_TYPESCRIPT' });
    const planWithReporting = createProjectImplementationPlan(blueprintWithReporting);
    expect(planWithReporting.stages.length).toBe(8);
    expect(planWithReporting.stages.some(s => s.type === 'SECONDARY_WORKFLOW')).toBe(true);

    // 3. Project without database/api dynamically produces fewer stages
    const blueprintMinimal = {
      ...blueprint,
      database: { ...blueprint.database, entities: [], tables: [] },
      api: { ...blueprint.api, endpoints: [] }
    };
    const planMinimal = createProjectImplementationPlan(blueprintMinimal);
    expect(planMinimal.stages.length).toBeLessThan(7);
    expect(planMinimal.stages.map(s => s.type)).not.toContain('DATA');
    expect(planMinimal.stages.map(s => s.type)).not.toContain('API');
  });

  // 15. Concrete Buildable Scaffolding: React + TypeScript
  it('15. scaffolds buildable React + TypeScript project with tokens, router, and truthful UI', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    const targetDir = path.join(workspacesDir, 'scaffold-react');

    const result = scaffoldNewProject(blueprint, targetDir);

    expect(result.success).toBe(true);
    expect(result.buildStatus).toBe('NOT_VERIFIED');
    expect(result.buildable).toBe(false);
    expect(result.syntaxValid).toBe(false);
    expect(result.filesGenerated.length).toBeGreaterThanOrEqual(10);
    expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/main.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/vite-env.d.ts'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'tsconfig.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'vite.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/styles/tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/App.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'README.md'))).toBe(true);

    // Verify Truthful UI: No fake uptime or fake metrics
    const appContent = fs.readFileSync(path.join(targetDir, 'src/App.tsx'), 'utf-8');
    expect(appContent).not.toContain('99.9% uptime');
    expect(appContent).toContain('[DEMO_DATA]');
  });

  // 16. Concrete Buildable Scaffolding: Laravel Blade
  it('16. scaffolds buildable Laravel Blade project with CSRF protection and CSS bridge', () => {
    const bench = loadBenchmark('consumer-responsive-app.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'LARAVEL_BLADE' });
    const targetDir = path.join(workspacesDir, 'scaffold-blade');

    const result = scaffoldNewProject(blueprint, targetDir);

    expect(result.success).toBe(true);
    expect(result.buildStatus).toBe('NOT_VERIFIED');
    expect(fs.existsSync(path.join(targetDir, 'composer.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'routes/web.php'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'resources/views/layouts/app.blade.php'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'public/css/tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);

    const dockerfileContent = fs.readFileSync(path.join(targetDir, 'Dockerfile'), 'utf-8');
    expect(dockerfileContent).toContain('php:8.2-fpm-alpine');
    expect(dockerfileContent).not.toContain('node:20-alpine');

    // Verify Blade @csrf invariant
    const layoutContent = fs.readFileSync(path.join(targetDir, 'resources/views/layouts/app.blade.php'), 'utf-8');
    expect(layoutContent).toContain('@csrf');
  });

  // 17. Concrete Buildable Scaffolding: ASP.NET Razor
  it('17. scaffolds buildable ASP.NET Razor project with AntiForgery and controllers', () => {
    const bench = loadBenchmark('api-centric-service.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'ASPNET_RAZOR' });
    const targetDir = path.join(workspacesDir, 'scaffold-razor');

    const result = scaffoldNewProject(blueprint, targetDir);

    expect(result.success).toBe(true);
    expect(result.buildStatus).toBe('NOT_VERIFIED');
    expect(fs.existsSync(path.join(targetDir, 'App.csproj'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Program.cs'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Views/Shared/_Layout.cshtml'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'wwwroot/css/tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);

    const dockerfileContent = fs.readFileSync(path.join(targetDir, 'Dockerfile'), 'utf-8');
    expect(dockerfileContent).toContain('mcr.microsoft.com/dotnet/sdk:8.0');
    expect(dockerfileContent).not.toContain('node:20-alpine');

    // Verify Razor anti-forgery invariant
    const layoutContent = fs.readFileSync(path.join(targetDir, 'Views/Shared/_Layout.cshtml'), 'utf-8');
    expect(layoutContent).toContain('@Html.AntiForgeryToken()');
  });

  // 18. Concrete Buildable Scaffolding: Plain HTML/CSS/JS (Zero framework dependencies)
  it('18. scaffolds pure Plain HTML/CSS/JS project with zero node_modules or build tools', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'PLAIN_HTML_CSS_JS' });
    const targetDir = path.join(workspacesDir, 'scaffold-plain');

    const result = scaffoldNewProject(blueprint, targetDir);

    expect(result.success).toBe(true);
    expect(result.buildStatus).toBe('NOT_VERIFIED');
    expect(fs.existsSync(path.join(targetDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'styles.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(false); // Zero npm packages!

    const dockerfileContent = fs.readFileSync(path.join(targetDir, 'Dockerfile'), 'utf-8');
    expect(dockerfileContent).toContain('nginx:alpine');
    expect(dockerfileContent).not.toContain('node:20-alpine');

    // Verify Truthful UI in plain web app
    const htmlContent = fs.readFileSync(path.join(targetDir, 'index.html'), 'utf-8');
    expect(htmlContent).toContain('Demo Data Notice');
    expect(htmlContent).not.toContain('99.9% uptime');
  });

  // 19. Completion Evaluation Contract with Evidence Taxonomy
  it('19. evaluates new project completion contract using evidence taxonomy without inflation', () => {
    // Missing evidence for required gates must resolve to NOT_VERIFIED (isComplete: false)
    const partialCompletion = evaluateNewProjectCompletion({
      technical: 'PASS',
      functional: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      truthfulUI: 'PASS',
      traceability: 'PASS',
      testCoverage: 'PASS',
      boundaryCompliance: 'PASS',
      evidenceRecords: [
        { gate: 'technical', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Clean compilation & linting' },
        { gate: 'functional', kind: 'UNIT_TEST', status: 'VERIFIED', description: 'Unit test suite passed 100%' },
        { gate: 'accessibility', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'A11y markup audit clean' },
        { gate: 'security', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Zero high severity vulnerabilities' },
        { gate: 'truthfulUI', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'No fake telemetry verified' }
      ],
      isSyntheticFixture: true
    });

    expect(partialCompletion.isComplete).toBe(false);
    expect(partialCompletion.gateResults.traceability.status).toBe('NOT_VERIFIED');
    expect(partialCompletion.gateResults.ux.status).toBe('NOT_VERIFIED');

    // Full qualifying evidence across all required gates resolves to VERIFIED
    const completion = evaluateNewProjectCompletion({
      technical: 'PASS',
      functional: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      truthfulUI: 'PASS',
      traceability: 'PASS',
      testCoverage: 'PASS',
      boundaryCompliance: 'PASS',
      evidenceRecords: [
        { gate: 'technical', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Clean compilation & linting' },
        { gate: 'functional', kind: 'UNIT_TEST', status: 'VERIFIED', description: 'Unit test suite passed 100%' },
        { gate: 'ux', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'All 8 UX states verified' },
        { gate: 'accessibility', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'A11y markup audit clean' },
        { gate: 'security', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Zero high severity vulnerabilities' },
        { gate: 'truthfulUI', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'No fake telemetry verified' },
        { gate: 'traceability', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: '100% forward/backward RTM verified' },
        { gate: 'testCoverage', kind: 'UNIT_TEST', status: 'VERIFIED', description: 'Test coverage threshold met' },
        { gate: 'boundaryCompliance', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Zero unauthorized features' }
      ],
      isSyntheticFixture: true
    });

    expect(completion.isComplete).toBe(true);
    expect(completion.overallAssurance).toBeDefined();
    expect(completion.gateResults.technical.status).toBe('VERIFIED');
    expect(completion.gateResults.truthfulUI.status).toBe('VERIFIED');
    expect(completion.gateResults.traceability.status).toBe('VERIFIED');
  });

  // 20. MCP Tools Integration: All 13 Greenfield MCP Tools Invocable
  it('20. MCP tools execute correctly across all 13 Greenfield capabilities', () => {
    // 98. create_greenfield_project_profile
    const profile = Tools.handleCreateGreenfieldProjectProfile({
      productName: 'MCP Test Product',
      productPurpose: 'Internal application to track hardware assets and assign laptops to staff',
      targetUsers: ['IT Operators', 'Department Managers'],
      primaryJobs: ['Track hardware assets', 'Assign laptops to staff']
    });
    expect(profile.productName).toBe('MCP Test Product');
    expect(profile.discoveryReadiness?.state).toBe('READY');

    // 99. derive_requirements
    const bundle = Tools.handleDeriveRequirements({
      profile,
      explicitUserBrief: 'Internal application to track hardware assets and assign laptops to staff'
    });
    expect(bundle.functional.length).toBeGreaterThan(0);

    // 100. create_requirement_traceability
    const rtm = Tools.handleCreateRequirementTraceability({
      requirements: bundle.functional,
      apiEndpoints: ['GET /api/v1/assets'],
      pages: ['Assets Workspace']
    });
    expect(rtm.matrix.length).toBe(bundle.functional.length);

    // 101. recommend_architecture
    const arch = Tools.handleRecommendArchitecture({ profile, requirements: bundle });
    expect(arch.style).toBe('MONOLITH');

    // 102. recommend_stack
    const stack = Tools.handleRecommendStack({ profile, architecture: arch, userPreferredStack: 'REACT_TYPESCRIPT' });
    expect(stack.primaryStack).toBe('REACT_TYPESCRIPT');

    // 103. create_database_blueprint
    const db = Tools.handleCreateDatabaseBlueprint({ profile, requirements: bundle, stack });
    expect(db.tables.length).toBeGreaterThan(0);

    // 104. create_api_blueprint
    const api = Tools.handleCreateApiBlueprint({ profile, requirements: bundle, database: db });
    expect(api.endpoints.length).toBeGreaterThan(0);

    // 105. create_auth_model
    const auth = Tools.handleCreateAuthModel({ profile, requirements: bundle });
    expect(auth.authentication.mechanism).toBe('SESSION_COOKIE');

    // 106. create_page_inventory
    const pages = Tools.handleCreatePageInventory({ profile, requirements: bundle, database: db, api });
    expect(pages.pages.length).toBeGreaterThan(0);

    // 107. create_project_blueprint
    const blueprint = Tools.handleCreateProjectBlueprint({ profile, requirementsBundle: bundle, userPreferredStack: 'REACT_TYPESCRIPT' });
    expect(blueprint.blueprintId).toBeDefined();

    // 108. create_project_implementation_plan
    const plan = Tools.handleCreateProjectImplementationPlan({ blueprint });
    expect(plan.stages.length).toBe(7);

    // 109. scaffold_new_project
    const targetDir = path.join(workspacesDir, 'mcp-scaffold-test');
    const scaffoldResult = Tools.handleScaffoldNewProject({ blueprint, targetDirectory: targetDir });
    expect(scaffoldResult.success).toBe(true);
    expect(scaffoldResult.buildStatus).toBe('NOT_VERIFIED');

    // 110. evaluate_new_project_completion
    const unverifiedEval = Tools.handleEvaluateNewProjectCompletion({
      isSyntheticFixture: true
    });
    expect(unverifiedEval.isComplete).toBe(false);

    const evalResult = Tools.handleEvaluateNewProjectCompletion({
      evidenceRecords: [
        { gate: 'technical', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Clean build' },
        { gate: 'functional', kind: 'UNIT_TEST', status: 'VERIFIED', description: 'Unit tests pass' },
        { gate: 'ux', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'UX states verified' },
        { gate: 'accessibility', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'A11y clean' },
        { gate: 'security', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Security clean' },
        { gate: 'truthfulUI', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Truthful UI clean' },
        { gate: 'traceability', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'RTM complete' },
        { gate: 'testCoverage', kind: 'UNIT_TEST', status: 'VERIFIED', description: 'Coverage met' },
        { gate: 'boundaryCompliance', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'No feature creep' }
      ],
      isSyntheticFixture: true
    });
    expect(evalResult.isComplete).toBe(true);
  });

  // 22. Architecture <-> Boundary Contract Alignment (Phase 1I Pre-Flight Issue A)
  it('22. dynamically aligns boundary contract forbidden technologies with architecture style', () => {
    // A) Small Internal CRUD: Monolith prohibits Kafka, Kubernetes, Microservices
    const bench = loadBenchmark('small-internal-crud.json');
    const smallProfile = createGreenfieldProjectProfile(bench.expectedProfile);
    const smallBlueprint = createNewProjectBlueprint(smallProfile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    expect(smallBlueprint.architecture.style).toBe('MONOLITH');
    expect(smallBlueprint.boundaryContract.forbiddenTechnologies).toContain('MICROSERVICES');
    expect(smallBlueprint.boundaryContract.forbiddenTechnologies).toContain('KAFKA');
    expect(smallBlueprint.boundaryContract.forbiddenTechnologies).toContain('KUBERNETES');

    // B) Justified Internet-Scale Distributed System: Architecture selects MICROSERVICES
    const distributedProfile = createGreenfieldProjectProfile({
      ...bench.expectedProfile,
      productName: 'GlobalScaleExchange',
      expectedScale: 'INTERNET_SCALE',
      concurrency: 'MASSIVE',
      operationalConstraints: ['multi-team', 'microservices']
    });
    const distributedBlueprint = createNewProjectBlueprint(distributedProfile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    expect(distributedBlueprint.architecture.style).toBe('MICROSERVICES');
    // Crucial Phase 1I guarantee: boundary contract must NOT forbid MICROSERVICES!
    expect(distributedBlueprint.boundaryContract.forbiddenTechnologies).not.toContain('MICROSERVICES');
  });

  // 23. Stack-Native Implementation Plan (Phase 1I Pre-Flight Issue B)
  it('23. generates framework-native stage paths across all four supported stacks', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);

    // 1. React + TypeScript
    const reactBp = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    const reactPlan = createProjectImplementationPlan(reactBp);
    const allReactFiles = reactPlan.stages.flatMap(s => s.filesToCreate);
    expect(allReactFiles).toContain('src/styles/tokens.css');
    expect(allReactFiles).toContain('src/models/entities.ts');
    expect(allReactFiles).toContain('src/components/Shell.tsx');
    expect(allReactFiles).toContain('src/pages/DirectoryView.tsx');
    expect(allReactFiles).toContain('src/security/security-headers.ts');
    expect(allReactFiles.some(f => f.endsWith('.blade.php') || f.endsWith('.cshtml'))).toBe(false);

    // 2. Laravel Blade
    const laravelBp = createNewProjectBlueprint(profile, { userPreferredStack: 'LARAVEL_BLADE' });
    const laravelPlan = createProjectImplementationPlan(laravelBp);
    const allLaravelFiles = laravelPlan.stages.flatMap(s => s.filesToCreate);
    expect(allLaravelFiles).toContain('public/css/tokens.css');
    expect(allLaravelFiles).toContain('app/Models/Entity.php');
    expect(allLaravelFiles).toContain('resources/views/layouts/app.blade.php');
    expect(allLaravelFiles).toContain('resources/views/directory/index.blade.php');
    expect(allLaravelFiles).toContain('app/Http/Middleware/SecurityHeadersMiddleware.php');
    expect(allLaravelFiles.some(f => f.endsWith('.tsx') || f.endsWith('.cshtml'))).toBe(false);

    // 3. ASP.NET Razor
    const aspnetBp = createNewProjectBlueprint(profile, { userPreferredStack: 'ASPNET_RAZOR' });
    const aspnetPlan = createProjectImplementationPlan(aspnetBp);
    const allAspnetFiles = aspnetPlan.stages.flatMap(s => s.filesToCreate);
    expect(allAspnetFiles).toContain('wwwroot/css/tokens.css');
    expect(allAspnetFiles).toContain('Models/Entities.cs');
    expect(allAspnetFiles).toContain('Views/Shared/_Layout.cshtml');
    expect(allAspnetFiles).toContain('Pages/Directory/Index.cshtml');
    expect(allAspnetFiles).toContain('Middleware/SecurityHeadersMiddleware.cs');
    expect(allAspnetFiles.some(f => f.endsWith('.tsx') || f.endsWith('.blade.php'))).toBe(false);

    // 4. Plain Web (HTML/CSS/JS)
    const plainBp = createNewProjectBlueprint(profile, { userPreferredStack: 'PLAIN_HTML_CSS_JS' });
    const plainPlan = createProjectImplementationPlan(plainBp);
    const allPlainFiles = plainPlan.stages.flatMap(s => s.filesToCreate);
    expect(allPlainFiles).toContain('css/tokens.css');
    expect(allPlainFiles).toContain('js/models/entities.js');
    expect(allPlainFiles).toContain('templates/shell.html');
    expect(allPlainFiles).toContain('pages/directory.html');
    expect(allPlainFiles).toContain('js/security/security-headers.js');
    expect(allPlainFiles.some(f => f.endsWith('.tsx') || f.endsWith('.blade.php') || f.endsWith('.cshtml'))).toBe(false);
  });
});
