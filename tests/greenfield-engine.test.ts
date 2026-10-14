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

    // Acceptance criteria must carry Gherkin format
    for (const ac of bundle.acceptanceCriteria) {
      expect(ac.given).toBeDefined();
      expect(ac.when).toBeDefined();
      expect(ac.then).toBeDefined();
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

  // 14. Implementation Plan Generation
  it('14. generates staged project implementation plan with checkpoints and verification points', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });

    const plan = createProjectImplementationPlan(blueprint);

    expect(plan.stages.length).toBe(7);
    expect(plan.stages[0].stageId).toBe('STAGE_1_FOUNDATION');
    expect(plan.stages[1].stageId).toBe('STAGE_2_DATA_MODEL');
    expect(plan.stages[2].stageId).toBe('STAGE_3_API_SURFACE');
    expect(plan.stages[3].stageId).toBe('STAGE_4_AUTH');
    expect(plan.stages[4].stageId).toBe('STAGE_5_APP_SHELL');
    expect(plan.stages[5].stageId).toBe('STAGE_6_CORE_WORKFLOW');
    expect(plan.stages[6].stageId).toBe('STAGE_7_QA_HARDENING');
    expect(plan.estimatedDays).toBeGreaterThan(0);
  });

  // 15. Concrete Buildable Scaffolding: React + TypeScript
  it('15. scaffolds buildable React + TypeScript project with tokens, router, and truthful UI', () => {
    const bench = loadBenchmark('small-internal-crud.json');
    const profile = createGreenfieldProjectProfile(bench.expectedProfile);
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    const targetDir = path.join(workspacesDir, 'scaffold-react');

    const result = scaffoldNewProject(blueprint, targetDir);

    expect(result.success).toBe(true);
    expect(result.filesGenerated.length).toBeGreaterThanOrEqual(10);
    expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(true);
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
    expect(fs.existsSync(path.join(targetDir, 'composer.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'routes/web.php'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'resources/views/layouts/app.blade.php'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'public/css/tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);

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
    expect(fs.existsSync(path.join(targetDir, 'App.csproj'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Program.cs'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Views/Shared/_Layout.cshtml'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'wwwroot/css/tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);

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
    expect(fs.existsSync(path.join(targetDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'styles.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'Dockerfile'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(false); // Zero npm packages!

    // Verify Truthful UI in plain web app
    const htmlContent = fs.readFileSync(path.join(targetDir, 'index.html'), 'utf-8');
    expect(htmlContent).toContain('Demo Data Notice');
    expect(htmlContent).not.toContain('99.9% uptime');
  });

  // 19. Completion Evaluation Contract with Evidence Taxonomy
  it('19. evaluates new project completion contract using evidence taxonomy without inflation', () => {
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
        { gate: 'accessibility', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'A11y markup audit clean' },
        { gate: 'security', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'Zero high severity vulnerabilities' },
        { gate: 'truthfulUI', kind: 'STATIC_ANALYSIS', status: 'VERIFIED', description: 'No fake telemetry verified' }
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
      productPurpose: 'Testing MCP invocation pipeline'
    });
    expect(profile.productName).toBe('MCP Test Product');

    // 99. derive_requirements
    const bundle = Tools.handleDeriveRequirements({
      profile,
      explicitUserBrief: 'Test brief'
    });
    expect(bundle.functional.length).toBeGreaterThan(0);

    // 100. create_requirement_traceability
    const rtm = Tools.handleCreateRequirementTraceability({
      requirements: bundle.functional,
      apiEndpoints: ['GET /api/v1/test'],
      pages: ['Test Page']
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

    // 110. evaluate_new_project_completion
    const evalResult = Tools.handleEvaluateNewProjectCompletion({
      technical: 'PASS',
      functional: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      truthfulUI: 'PASS',
      traceability: 'PASS',
      isSyntheticFixture: true
    });
    expect(evalResult.isComplete).toBe(true);
  });
});
