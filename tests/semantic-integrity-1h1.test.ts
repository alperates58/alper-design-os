import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  createGreenfieldProjectProfile,
  deriveRequirements,
  recommendArchitecture,
  recommendStack,
  createDatabaseBlueprint,
  createPageInventory,
  createNewProjectBlueprint,
  scaffoldNewProject,
  evaluateNewProjectCompletion,
  initializeProjectIntelligence,
  recordProjectDecision,
  recordBusinessRule,
  buildProjectArchitectureGraph,
  createProjectSnapshot,
  analyzeChangeImpact,
  detectKnowledgeConflicts,
  evaluateProjectKnowledgeHealth
} from '@alper-design-os/agent-governance';
import {
  inferProductUXProfile,
  generateLayoutGuidance,
  searchUXPatterns,
  getShortcutsForScope
} from '@alper-design-os/design-core';
import * as Tools from '../packages/mcp-server/src/tools/index.js';
import {
  getToolDefinitions,
  getRegisteredToolCount,
  dispatchCanonicalToolCall
} from '../packages/mcp-server/src/server.js';

describe('ALPER DESIGN OS - FAZ 1H.1: Architecture Integrity & Adversarial Truth Suite', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = path.join(os.tmpdir(), `alper-1h1-test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // ============================================================================
  // SECTION 34 — ADVERSARIAL CASES A THROUGH L
  // ============================================================================

  it('Adversarial Case A — Empty Completion Evidence: returns NOT_VERIFIED and never VERIFIED HIGH', () => {
    const result = evaluateNewProjectCompletion({
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
      evidenceRecords: []
    });

    expect(result.isComplete).toBe(false);
    expect(result.overallAssurance).not.toBe('HIGH');
    expect(result.gateResults.technical.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.functional.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.ux.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.accessibility.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.security.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.truthfulUI.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.traceability.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.testCoverage.status).toBe('NOT_VERIFIED');
    expect(result.gateResults.boundaryCompliance.status).toBe('NOT_VERIFIED');
    expect(result.blockingReasons.length).toBeGreaterThanOrEqual(9);

    // HUMAN_REVIEW must NOT satisfy technical or unit-test gates where policy forbids it
    const humanOnlyAttempt = evaluateNewProjectCompletion({
      evidenceRecords: [
        { gate: 'technical', kind: 'HUMAN_REVIEW', status: 'VERIFIED', description: 'Looked at code manually' },
        { gate: 'functional', kind: 'HUMAN_REVIEW', status: 'VERIFIED', description: 'Clicked around manually' }
      ]
    });
    expect(humanOnlyAttempt.gateResults.technical.status).toBe('NOT_VERIFIED');
    expect(humanOnlyAttempt.gateResults.functional.status).toBe('NOT_VERIFIED');
  });

  it('Adversarial Case B — Unbuilt Scaffold: reports filesGenerated without claiming buildable or syntaxValid', () => {
    const profile = createGreenfieldProjectProfile({
      productName: 'Warehouse Asset Tracker',
      productPurpose: 'Internal application to track warehouse pallets and assign forklifts to operators',
      targetUsers: ['Warehouse Supervisors'],
      primaryJobs: ['Track warehouse pallets', 'Assign forklifts to operators']
    });
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    const targetDir = path.join(tempDir, 'unbuilt-scaffold');

    const scaffold = scaffoldNewProject(blueprint, targetDir);

    expect(scaffold.success).toBe(true);
    expect(scaffold.filesGenerated.length).toBeGreaterThan(0);
    expect(scaffold.buildStatus).toBe('NOT_VERIFIED');
    expect(scaffold.buildable).toBe(false);
    expect(scaffold.syntaxValid).toBe(false);
  });

  it('Adversarial Case C — Verb-Only Job Statement: never creates "manages" or "reviews" tables', () => {
    const profile = createGreenfieldProjectProfile({
      productName: 'Order Fulfillment Desk',
      productPurpose: 'Operational desk to manage orders and review shipments across distribution centers',
      targetUsers: ['Fulfillment Coordinators'],
      primaryJobs: ['Manage orders', 'Review shipments']
    });
    const requirements = deriveRequirements(profile, 'Manage orders and review shipments');
    const stack = recommendStack(profile, undefined, 'REACT_TYPESCRIPT');
    const db = createDatabaseBlueprint(profile, requirements, stack);

    const tableNames = db.tables.map((t) => t.tableName);
    expect(tableNames).not.toContain('manages');
    expect(tableNames).not.toContain('reviews');
    expect(tableNames).not.toContain('primary_entities');
    expect(tableNames).not.toContain('items');
    expect(tableNames.some((n) => n.includes('orders') || n.includes('shipments'))).toBe(true);

    // Also test pure verbs with zero nouns -> returns NEEDS_CLARIFICATION without inventing tables
    const verbOnlyProfile = createGreenfieldProjectProfile({
      productName: 'System',
      productPurpose: 'Manage and review and process and monitor',
      targetUsers: ['Operators'],
      primaryJobs: ['Manage', 'Review']
    });
    const verbOnlyReqs = deriveRequirements(verbOnlyProfile, 'Manage and review');
    const verbOnlyDb = createDatabaseBlueprint(verbOnlyProfile, verbOnlyReqs, stack);
    expect(verbOnlyDb.status).toBe('NEEDS_CLARIFICATION');
    expect(verbOnlyDb.clarifyingQuestions?.length).toBeGreaterThan(0);
    expect(verbOnlyDb.tables.map((t) => t.tableName)).not.toContain('manages');
  });

  it('Adversarial Case D — Ambiguous Prompt: "Build me an APS" blocks downstream generation and returns progressive questions', () => {
    const profile = createGreenfieldProjectProfile({
      productName: 'APS',
      productPurpose: 'Build me an APS'
    });

    expect(profile.complexityClassification).toBeDefined();
    expect(['AMBIGUOUS_PRODUCT', 'HIGH_COMPLEXITY_PRODUCT', 'INSUFFICIENT_CONTEXT']).toContain(
      profile.complexityClassification
    );
    expect(['NEEDS_CLARIFICATION', 'BLOCKED_BY_AMBIGUITY']).toContain(
      profile.discoveryReadiness?.state
    );
    expect(profile.discoveryReadiness?.clarifyingQuestions.length).toBeGreaterThanOrEqual(1);
    expect(profile.discoveryReadiness?.clarifyingQuestions.length).toBeLessThanOrEqual(5);
    expect(profile.discoveryReadiness?.whyBlocked).toBeDefined();

    // Downstream blueprint synthesis must refuse to proceed when discovery is blocked
    expect(() => createNewProjectBlueprint(profile)).toThrow(/Discovery Gate blocked/i);
  });

  it('Adversarial Case E — Clear Prompt: grounded internal CRUD specification resolves to READY and derives grounded entities', () => {
    const profile = createGreenfieldProjectProfile({
      productName: 'Calibration Logbook',
      productPurpose: 'Internal quality tool to record gauge calibrations and track inspection certificates',
      targetUsers: ['Quality Engineers', 'Lab Technicians'],
      primaryJobs: ['Record gauge calibrations', 'Track inspection certificates'],
      deploymentEnvironment: 'ON_PREM'
    });

    expect(profile.discoveryReadiness?.state).toBe('READY');
    expect(profile.discoveryReadiness?.clarifyingQuestions.length).toBe(0);

    const requirements = deriveRequirements(profile);
    for (const ac of requirements.acceptanceCriteria) {
      expect(ac.verified).toBe(false);
      expect(ac.status).toBe('DEFINED');
      expect(ac.verificationStatus).toBe('NOT_VERIFIED');
    }

    const stack = recommendStack(profile);
    expect(stack.decisionSource).toBe('REVERSIBLE_ASSUMPTION');

    const db = createDatabaseBlueprint(profile, requirements, stack);
    expect(db.status).toBe('READY');
    const tableNames = db.tables.map((t) => t.tableName);
    expect(tableNames.some((n) => n.includes('calibrations') || n.includes('certificates'))).toBe(true);
  });

  it('Adversarial Case F — Empty Repository Intelligence: never invents AppCore/DataModule/inventory_items or 90% EXCELLENT health', () => {
    const uninitializedHealth = evaluateProjectKnowledgeHealth(tempDir);
    expect(uninitializedHealth.healthStatus).toBe('NOT_INITIALIZED');
    expect(uninitializedHealth.coveragePercentage).toBe(0);

    const graph = buildProjectArchitectureGraph(tempDir);
    expect(graph.completeness).toBe('EMPTY');
    expect(graph.verificationStatus).toBe('NOT_VERIFIED');
    expect(graph.nodes.length).toBe(0);
    expect(graph.nodes.map((n) => n.name)).not.toContain('AppCore');
    expect(graph.nodes.map((n) => n.name)).not.toContain('DataModule');
    expect(graph.nodes.map((n) => n.name)).not.toContain('inventory_items');
    expect(graph.unknownAreas.length).toBeGreaterThan(0);

    initializeProjectIntelligence(tempDir, { mode: 'NEW', projectName: 'Empty Dir Project' });
    const initializedEmptyHealth = evaluateProjectKnowledgeHealth(tempDir);
    expect(initializedEmptyHealth.healthStatus).toBe('INSUFFICIENT_DATA');
    expect(initializedEmptyHealth.coveragePercentage).toBe(0);

    const emptyImpact = analyzeChangeImpact(tempDir, 'auth_middleware', 'Change auth flow');
    expect(emptyImpact.affectedModules).not.toContain('DataModule');
    expect(emptyImpact.affectedApis).not.toContain('POST /api/v1/auth/login');
  });

  it('Adversarial Case G — Unverified Business Rule: substring "Alper" or "USER_SPECIFICATION" without confirmation never produces VERIFIED', () => {
    initializeProjectIntelligence(tempDir, { mode: 'NEW', projectName: 'Provenance Test' });

    const spoofedAlperRule = recordBusinessRule(tempDir, {
      ruleId: 'BR-SPOOF-01',
      statement: 'Allow negative stock balances automatically',
      source: 'Alper mentioned maybe we could allow negative balances in chat'
    });
    expect(spoofedAlperRule.status).toBe('UNVERIFIED');
    expect(spoofedAlperRule.verificationStatus).toBe('NOT_VERIFIED');

    const unconfirmedSpecStringRule = recordBusinessRule(tempDir, {
      ruleId: 'BR-SPOOF-02',
      statement: 'Auto-cancel all invoices after 24 hours',
      source: 'USER_SPECIFICATION: inferred by agent without confirmation',
      confirmedByUser: false
    });
    expect(unconfirmedSpecStringRule.status).toBe('UNVERIFIED');
    expect(unconfirmedSpecStringRule.verificationStatus).toBe('NOT_VERIFIED');

    const aiHeuristicRule = recordBusinessRule(tempDir, {
      ruleId: 'BR-SPOOF-03',
      statement: 'Suggested default discount is 15%',
      source: 'AI_SUGGESTION',
      sourceType: 'LLM_INFERRED_HEURISTIC',
      confirmedByUser: true // Even if flagged true, LLM_INFERRED_HEURISTIC cannot be VERIFIED
    });
    expect(aiHeuristicRule.status).toBe('UNVERIFIED');
    expect(aiHeuristicRule.verificationStatus).toBe('NOT_VERIFIED');

    // Similarly for recordProjectDecision: substring "alper" without confirmation or USER_DECISION authority is not treated as user-confirmed
    const spoofedDecision = recordProjectDecision(tempDir, {
      id: 'ADR-SPOOF-01',
      title: 'Inferred Caching Strategy',
      context: 'Agent inferred caching',
      decision: 'Use Redis cluster everywhere',
      approvedBy: 'inferred-for-alper-by-agent'
    });
    expect(spoofedDecision.record.authoritySource).toBe('SYSTEM_RECOMMENDATION');
    expect(spoofedDecision.record.confirmedByUser).toBe(false);
    expect(spoofedDecision.record.verificationStatus).toBe('NOT_VERIFIED');
  });

  it('Adversarial Case H — Stack Mismatch Docker: generates stack-native Dockerfiles only when Docker is requested', () => {
    const dockerProfile = createGreenfieldProjectProfile({
      productName: 'MultiStack Docker Test',
      productPurpose: 'Internal service to manage workorders and track shipments',
      targetUsers: ['Dispatchers'],
      primaryJobs: ['Manage workorders', 'Track shipments'],
      deploymentEnvironment: 'DOCKER'
    });

    // Laravel Blade -> PHP/Composer/FPM Dockerfile
    const bladeBp = createNewProjectBlueprint(dockerProfile, { userPreferredStack: 'LARAVEL_BLADE' });
    const bladeDir = path.join(tempDir, 'docker-blade');
    scaffoldNewProject(bladeBp, bladeDir);
    const bladeDocker = fs.readFileSync(path.join(bladeDir, 'Dockerfile'), 'utf-8');
    expect(bladeDocker).toContain('php:8.2-fpm-alpine');
    expect(bladeDocker).not.toContain('node:20-alpine');

    // ASP.NET Razor -> dotnet SDK/ASP.NET runtime Dockerfile
    const razorBp = createNewProjectBlueprint(dockerProfile, { userPreferredStack: 'ASPNET_RAZOR' });
    const razorDir = path.join(tempDir, 'docker-razor');
    scaffoldNewProject(razorBp, razorDir);
    const razorDocker = fs.readFileSync(path.join(razorDir, 'Dockerfile'), 'utf-8');
    expect(razorDocker).toContain('mcr.microsoft.com/dotnet/sdk:8.0');
    expect(razorDocker).not.toContain('node:20-alpine');

    // Plain Web -> nginx:alpine Dockerfile
    const plainBp = createNewProjectBlueprint(dockerProfile, { userPreferredStack: 'PLAIN_HTML_CSS_JS' });
    const plainDir = path.join(tempDir, 'docker-plain');
    scaffoldNewProject(plainBp, plainDir);
    const plainDocker = fs.readFileSync(path.join(plainDir, 'Dockerfile'), 'utf-8');
    expect(plainDocker).toContain('nginx:alpine');
    expect(plainDocker).not.toContain('node:20-alpine');

    // Non-Docker deployment (STATIC_HOSTING) -> NO Dockerfile generated unless explicitly requested
    const staticProfile = createGreenfieldProjectProfile({
      productName: 'Static App Test',
      productPurpose: 'Internal tool to manage workorders and track shipments',
      targetUsers: ['Dispatchers'],
      primaryJobs: ['Manage workorders', 'Track shipments'],
      deploymentEnvironment: 'STATIC_HOSTING'
    });
    const staticBp = createNewProjectBlueprint(staticProfile, { userPreferredStack: 'PLAIN_HTML_CSS_JS' });
    const staticDir = path.join(tempDir, 'no-docker-static');
    scaffoldNewProject(staticBp, staticDir);
    expect(fs.existsSync(path.join(staticDir, 'Dockerfile'))).toBe(false);
    expect(fs.existsSync(path.join(staticDir, 'docker-compose.yml'))).toBe(false);
  });

  it('Adversarial Case I — React Build Integrity: generates complete Vite + React + TS entry and configuration files', () => {
    const profile = createGreenfieldProjectProfile({
      productName: 'React Build Check',
      productPurpose: 'Internal application to manage customer invoices and track payments',
      targetUsers: ['Billing Specialists'],
      primaryJobs: ['Manage customer invoices', 'Track payments']
    });
    const blueprint = createNewProjectBlueprint(profile, { userPreferredStack: 'REACT_TYPESCRIPT' });
    const reactDir = path.join(tempDir, 'react-integrity');

    scaffoldNewProject(blueprint, reactDir);

    const pkgJson = JSON.parse(fs.readFileSync(path.join(reactDir, 'package.json'), 'utf-8'));
    expect(pkgJson.devDependencies['@vitejs/plugin-react']).toBeDefined();
    expect(pkgJson.devDependencies['typescript']).toBeDefined();
    expect(pkgJson.devDependencies['vite']).toBeDefined();

    const indexHtml = fs.readFileSync(path.join(reactDir, 'index.html'), 'utf-8');
    expect(indexHtml).toContain('<div id="root"></div>');
    expect(indexHtml).toContain('/src/main.tsx');

    const mainTsx = fs.readFileSync(path.join(reactDir, 'src/main.tsx'), 'utf-8');
    expect(mainTsx).toContain('createRoot');
    expect(mainTsx).toContain("import App from './App'");

    const viteConfig = fs.readFileSync(path.join(reactDir, 'vite.config.ts'), 'utf-8');
    expect(viteConfig).toContain('@vitejs/plugin-react');

    expect(fs.existsSync(path.join(reactDir, 'tsconfig.json'))).toBe(true);
    expect(fs.existsSync(path.join(reactDir, 'src/vite-env.d.ts'))).toBe(true);
  });

  it('Adversarial Case J — MCP Argument Loss: non-default arguments materially affect output across fixed handlers', () => {
    // 1. evaluate_release_gates: criticalTestsFailed, a11yScore, visualRegressionDiffs, unresolvedConflicts
    const gatePass = Tools.handleEvaluateReleaseGates({
      criticalTestsFailed: 0,
      a11yScore: 95,
      visualRegressionDiffs: 0,
      unresolvedConflicts: 0
    });
    expect(gatePass.passed).toBe(true);

    const gateFailOnArgs = Tools.handleEvaluateReleaseGates({
      criticalTestsFailed: 2,
      a11yScore: 72,
      visualRegressionDiffs: 3,
      unresolvedConflicts: 1
    });
    expect(gateFailOnArgs.passed).toBe(false);
    const blockersStr = JSON.stringify(gateFailOnArgs.blockers);
    const warningsStr = JSON.stringify(gateFailOnArgs.warnings);
    expect(blockersStr).toContain('2 critical test(s) failed');
    expect(blockersStr).toContain('72');
    expect(blockersStr).toContain('1 unresolved conflict');
    expect(warningsStr).toContain('3 visual regression diff');

    // 2. generate_adr: number and consequences.neutral
    const adrRes = Tools.handleGenerateADR({
      number: 42,
      title: 'Use Event Outbox Pattern',
      context: 'Ensure atomic database and message publication',
      decision: 'Write events to outbox table in same transaction',
      consequences: {
        positive: ['Guaranteed at-least-once delivery'],
        negative: ['Requires polling worker'],
        neutral: ['Outbox table requires periodic archival']
      }
    });
    expect(adrRes.adr.id).toContain('ADR-042');
    expect(adrRes.adr.consequences.neutral).toContain('Outbox table requires periodic archival');
    expect(adrRes.markdown).toContain('### Neutral');
    expect(adrRes.markdown).toContain('Outbox table requires periodic archival');

    // 3. create_verification_plan: isUI and isSecuritySensitive
    const nonUiPlan = Tools.handleCreateVerificationPlan({
      objective: 'Update CLI parser',
      isUI: false,
      isSecuritySensitive: false,
      riskLevel: 'LOW'
    });
    expect(nonUiPlan.activeStages).not.toContain('VISUAL_VERIFY');

    const secPlan = Tools.handleCreateVerificationPlan({
      objective: 'Update password hashing service',
      isUI: false,
      isSecuritySensitive: true,
      riskLevel: 'LOW'
    });
    expect(secPlan.activeStages).toContain('INDEPENDENT_REVIEW');

    // 4. create_page_blueprint: id and title overrides
    const customPageBp = Tools.handleCreatePageBlueprint({
      preset: 'DATA_MANAGEMENT_WORKSPACE',
      id: 'custom-orders-workspace',
      title: 'Global Orders Control Desk'
    });
    expect(customPageBp.id).toBe('custom-orders-workspace');
    expect(customPageBp.title).toBe('Global Orders Control Desk');

    // 5. render_blueprint: customPageTitle
    const renderedBp = Tools.handleRenderBlueprint({
      blueprintPreset: 'DATA_MANAGEMENT_WORKSPACE',
      targetStack: 'html-css-js',
      customPageTitle: 'Custom Telemetry Command Center'
    });
    expect(renderedBp.primaryFile.content).toContain('Custom Telemetry Command Center');
  });

  it('Adversarial Case K — Snapshot Without Evidence: uninspected fields remain empty or NOT_VERIFIED without fake defaults', () => {
    initializeProjectIntelligence(tempDir, { mode: 'NEW', projectName: 'Snapshot Truth Test' });
    const snap = createProjectSnapshot(tempDir, 'SNAP-EMPTY-01');

    expect(snap.routeInventory).toEqual([]);
    expect(snap.apiInventory).toEqual([]);
    expect(snap.routeInventory).not.toContain('/dashboard');
    expect(snap.routeInventory).not.toContain('/items');
    expect(snap.apiInventory).not.toContain('GET /api/v1/health');
    expect(snap.databaseFingerprint).toBe('NOT_VERIFIED');
    expect(snap.dependencyFingerprint).toBe('NOT_VERIFIED');
    expect(snap.uiTokenFingerprint).toBe('NOT_VERIFIED');
    expect(snap.verificationStatus).toBe('NOT_VERIFIED');
  });

  it('Adversarial Case L — Non-APS Domain Neutrality: healthcare, fintech, education, and SaaS prompts contain zero APS scheduling strings', () => {
    const prompts = [
      { name: 'ClinicCare Portal', desc: 'Healthcare patient appointment and electronic medical record system' },
      { name: 'LedgerPulse', desc: 'Fintech treasury reconciliation and multi-currency payment approval platform' },
      { name: 'CampusLearn', desc: 'Education course enrollment and student grading portal' },
      { name: 'TeamFlow SaaS', desc: 'B2B subscription workspace and customer support ticketing software' }
    ];

    const forbiddenApsTerms = [
      'Unscheduled Orders',
      'Finite Capacity Gantt Schedule',
      'Resource Inspector & Bottlenecks',
      'finite capacity and frozen horizon constraints'
    ];

    for (const p of prompts) {
      const profile = inferProductUXProfile({ name: p.name, description: p.desc });
      const layout = generateLayoutGuidance(profile);
      const patterns = searchUXPatterns('grid');
      const interactions = getShortcutsForScope('GLOBAL');
      const research = Tools.handleResearchDomain({ domainQuery: p.desc });

      const combinedJson = JSON.stringify({ profile, layout, patterns, interactions, research });
      for (const term of forbiddenApsTerms) {
        expect(combinedJson).not.toContain(term);
      }
    }
  });

  // ============================================================================
  // SECTION 35 — MCP PARITY & SINGLE SOURCE OF TRUTH SUITE
  // ============================================================================

  it('MCP Parity 1 — serverToolCount equals canonicalToolRegistry count (124 tools)', () => {
    const serverDefs = getToolDefinitions();
    const serverCount = getRegisteredToolCount();
    const canonicalCount = Tools.canonicalToolRegistry.size;
    const legacyMapCount = Tools.toolRegistry.size;

    expect(serverCount).toBe(canonicalCount);
    expect(serverDefs.length).toBe(canonicalCount);
    expect(legacyMapCount).toBe(canonicalCount);
    expect(canonicalCount).toBe(124);
  });

  it('MCP Parity 2 — Every canonical tool is exposed in ListTools definitions with valid inputSchema', () => {
    const serverDefs = getToolDefinitions();
    const serverToolNames = new Set(serverDefs.map((d) => d.name));

    for (const [toolName, def] of Tools.canonicalToolRegistry.entries()) {
      expect(serverToolNames.has(toolName)).toBe(true);
      expect(def.description.length).toBeGreaterThan(5);
      expect(def.inputSchema.type).toBe('object');
    }
  });

  it('MCP Parity 3 — Representative tools across Phases 1F, 1G, and 1H execute through dispatchCanonicalToolCall', async () => {
    // Phase 1F: Modernization Engine tool via server dispatch
    const modStrategy = (await dispatchCanonicalToolCall('select_modernization_strategy', {
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectPath: 'tests/fixtures/legacy-razor',
      explicitUserRequest: false
    })) as { blocked: boolean; strategy: string };
    expect(modStrategy.blocked).toBe(true);
    expect(modStrategy.strategy).toBe('BRIDGE');

    // Phase 1G: Greenfield Engine tool via server dispatch
    const gfProfile = (await dispatchCanonicalToolCall('create_greenfield_project_profile', {
      productName: 'Dispatched Greenfield App',
      productPurpose: 'Build an APS'
    })) as { discoveryReadiness: { state: string } };
    expect(['NEEDS_CLARIFICATION', 'BLOCKED_BY_AMBIGUITY']).toContain(gfProfile.discoveryReadiness.state);

    // Phase 1H: Project Intelligence Engine tool via server dispatch
    const piHealth = (await dispatchCanonicalToolCall('evaluate_project_knowledge_health', {
      baseDir: tempDir
    })) as { healthStatus: string; coveragePercentage: number };
    expect(piHealth.healthStatus).toBe('NOT_INITIALIZED');
    expect(piHealth.coveragePercentage).toBe(0);
  });

  it('MCP Parity 4 — Unknown tool and invalid schema inputs fail cleanly via dispatchCanonicalToolCall', async () => {
    await expect(dispatchCanonicalToolCall('non_existent_tool_xyz', {})).rejects.toThrow(
      /Unknown tool: non_existent_tool_xyz/
    );
    await expect(dispatchCanonicalToolCall('generate_adr', { title: 'Missing required fields' })).rejects.toThrow();
  });

  it('MCP Parity 5 — Compiled dist/server.js parity check prevents stale manual switch regression', () => {
    const srcServer = fs.readFileSync(path.resolve('packages/mcp-server/src/server.ts'), 'utf-8');
    expect(srcServer).toContain('canonicalToolRegistry');
    expect(srcServer).toContain('dispatchCanonicalToolCall');
    expect(srcServer).not.toContain('switch (name)');

    const distServerPath = path.resolve('packages/mcp-server/dist/server.js');
    if (fs.existsSync(distServerPath)) {
      const distServer = fs.readFileSync(distServerPath, 'utf-8');
      expect(distServer).toContain('canonicalToolRegistry');
      expect(distServer).toContain('dispatchCanonicalToolCall');
      expect(distServer).not.toContain('switch (name)');
    }
  });
});
