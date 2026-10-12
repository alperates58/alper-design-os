import { describe, it, expect } from 'vitest';
import * as Tools from '../packages/mcp-server/src/tools/index.js';

describe('Alper Design MCP Tools Verification', () => {
  it('1. understand_product returns a typed ProductUXProfile', () => {
    const result = Tools.handleUnderstandProduct({
      productName: 'APS Scheduler',
      description: 'Finite capacity scheduling system for manufacturing'
    });
    expect(result.domainClassification).toBe('INDUSTRIAL_OPERATIONAL');
    expect(result.informationDensity).toBe('HIGH');
  });

  it('2. research_domain returns domain intelligence', () => {
    const result = Tools.handleResearchDomain({ domainQuery: 'Manufacturing Scheduling' });
    expect(result.classification).toBe('INDUSTRIAL_OPERATIONAL');
    expect(result.criticalJobs.length).toBeGreaterThan(0);
  });

  it('3. recommend_ux_patterns returns matching patterns', () => {
    const result = Tools.handleRecommendUXPatterns({ density: 'HIGH' });
    expect(result.recommendedPatterns.length).toBeGreaterThan(0);
    expect(result.recommendedPatterns.some((p) => p.id === 'gantt-timeline')).toBe(true);
  });

  it('4. search_design_patterns searches pattern catalog', () => {
    const result = Tools.handleSearchDesignPatterns({ query: 'gantt' });
    expect(result.totalMatches).toBeGreaterThan(0);
    expect(result.patterns[0]?.id).toBe('gantt-timeline');
  });

  it('5. search_components returns adapter component paradigms', () => {
    const result = Tools.handleSearchComponents({ patternId: 'dense-datagrid' });
    expect(result.availableInAdapters.length).toBe(7);
  });

  it('6. get_design_tokens compiles DTCG tokens to CSS', () => {
    const result = Tools.handleGetDesignTokens({ format: 'css' });
    expect(result.format).toBe('css');
    expect(result.content).toContain('--color-brand-primary:');
  });

  it('7. create_design_plan outputs structured design plan', () => {
    const result = Tools.handleCreateDesignPlan({
      mode: 'NEW',
      productName: 'Factory APS',
      adapterId: 'react-typescript',
      briefOrProfile: {
        productName: 'Factory APS',
        description: 'Discrete manufacturing finite capacity planner'
      }
    });
    expect(result.phases.length).toBe(4);
    expect(result.safetyPolicy).toContain('READ_ONLY_DEFAULT');
  });

  it('8. search_public_apis searches indexed public APIs', () => {
    const result = Tools.handleSearchPublicApis({ query: 'weather' });
    expect(result.totalResults).toBeGreaterThan(0);
    expect(result.results[0]?.name).toContain('Weather');
  });

  it('9. search_mcp_servers searches indexed awesome MCP servers', () => {
    const result = Tools.handleSearchMcpServers({ query: 'github' });
    expect(result.totalResults).toBeGreaterThan(0);
    expect(result.results[0]?.name).toContain('GitHub');
  });

  it('10. detect_stack analyzes target directory', () => {
    const result = Tools.handleDetectStack({ projectPath: '.' });
    expect(result.rootDir).toBe('.');
    expect(result.languages).toBeDefined();
  });

  it('11. analyze_project runs comprehensive analysis', () => {
    const result = Tools.handleAnalyzeProject({ projectPath: '.' });
    expect(result.projectProfile).toBeDefined();
    expect(typeof result.uiHealthScore).toBe('number');
  });

  it('12. audit_existing_ui runs UI audit', () => {
    const result = Tools.handleAuditExistingUI({ projectPath: '.' });
    expect(typeof result.score).toBe('number');
  });

  it('13. audit_accessibility runs a11y audit', () => {
    const result = Tools.handleAuditAccessibility({ projectPath: '.', targetLevel: 'WCAG_2_1_AA' });
    expect(result.wcagLevelTarget).toBe('WCAG_2_1_AA');
    expect(typeof result.passedRatio).toBe('number');
  });

  it('14. audit_responsive runs responsive audit', () => {
    const result = Tools.handleAuditResponsive({ projectPath: '.' });
    expect(typeof result.mobileReady).toBe('boolean');
  });

  it('15. recommend_modernization produces 4-phase plan', () => {
    const result = Tools.handleRecommendModernization({ projectPath: '.', targetAdapter: 'generic-web' });
    expect(result.phases.length).toBe(4);
  });

  it('16. generate_engineering_policy returns stack-aware EngineeringQualityProfile', () => {
    const result = Tools.handleGenerateEngineeringPolicy({ stack: 'typescript', securityLevel: 'HIGH' });
    expect(result.securityLevel).toBe('LEVEL_2');
    expect(result.codeQualityRules.length).toBeGreaterThan(0);
  });

  it('17. evaluate_release_gates blocks on critical findings', () => {
    const result = Tools.handleEvaluateReleaseGates({
      staticIssues: [
        {
          id: 'crit-1',
          category: 'SECURITY',
          severity: 'CRITICAL',
          title: 'Remote Code Execution',
          description: 'eval() used on user input',
          tool: 'semgrep',
          remediation: 'Remove eval()'
        }
      ]
    });
    expect(result.passed).toBe(false);
    expect(result.blockers.length).toBe(1);
  });

  it('18. generate_threat_model returns STRIDE threat model', () => {
    const result = Tools.handleGenerateThreatModel({
      systemName: 'Portal',
      architecture: 'SPA_API'
    });
    expect(result.productName).toBe('Portal');
    expect(result.threats.length).toBeGreaterThan(0);
  });

  it('19. generate_user_journeys synthesizes journeys from domain brief', () => {
    const result = Tools.handleGenerateUserJourneys({
      productName: 'ApexCRM',
      description: 'Customer relations and sales funnel pipeline'
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.goal).toBeDefined();
  });

  it('20. generate_playwright_test outputs resilient script', () => {
    const result = Tools.handleGeneratePlaywrightTest({
      journeyTitle: 'Create Lead',
      targetUrl: 'http://localhost:3000',
      steps: [{ order: 1, action: 'Click', target: 'Create Lead Button' }]
    });
    expect(result.generatedCode).toContain('@playwright/test');
    expect(result.generatedCode).toContain('getByRole');
  });

  it('21. generate_qa_report creates report and markdown with unverified areas', () => {
    const result = Tools.handleGenerateQAReport({
      targetApplication: 'ApexCRM',
      testedFlows: ['Create Lead']
    });
    expect(result.report.overallStatus).toBe('PASS');
    expect(result.markdown).toContain('CRITICAL TRANSPARENCY NOTICE');
  });

  it('22. generate_test_pyramid tailors layers to project archetype', () => {
    const result = Tools.handleGenerateTestPyramid({
      projectName: 'API Service',
      projectType: 'MICROSERVICE_API'
    });
    expect(result.recommendedLayers).toContain('CONTRACT');
    expect(result.recommendedLayers).toContain('LOAD');
  });

  it('23. analyze_architecture detects style and modules', () => {
    const result = Tools.handleAnalyzeArchitecture({ projectPath: '.' });
    expect(result.architectureStyle).toBeDefined();
    expect(result.boundaries).toBeDefined();
  });

  it('24. generate_adr produces valid ADR document and markdown', () => {
    const result = Tools.handleGenerateADR({
      number: 1,
      title: 'Adopt Hexagonal Architecture',
      context: 'Decouple core domain from web framework.',
      decision: 'Ports and adapters pattern.',
      consequences: {
        positive: ['Domain testability without database'],
        negative: ['Initial abstraction boilerplate']
      }
    });
    expect(result.adr.title).toBe('Adopt Hexagonal Architecture');
    expect(result.markdown).toContain('## Context');
  });

  it('25. analyze_database_schema evaluates migration safety', () => {
    const result = Tools.handleAnalyzeDatabaseSchema({
      migrationContent: 'ALTER TABLE users DROP COLUMN email;'
    });
    expect(result.migrationEvaluation?.risk).toBe('DANGEROUS');
  });

  it('26. evaluate_api_compatibility flags removed endpoints', () => {
    const result = Tools.handleEvaluateAPICompatibility({
      oldSpec: JSON.stringify({ paths: { '/v1/users': {}, '/v1/orders': {} } }),
      newSpec: JSON.stringify({ paths: { '/v1/users': {} } })
    });
    expect(result.hasBreakingChanges).toBe(true);
    expect(result.breakingChangesSummary[0]).toContain('Removed endpoint [/v1/orders]');
  });

  it('27. classify_code_paths classifies files accurately', () => {
    const result = Tools.handleClassifyCodePaths({
      paths: ['src/index.ts', 'dist/bundle.js', 'vendor/autoload.php', 'migrations/001_init.sql']
    });
    expect(result[0]?.classification).toBe('SOURCE');
    expect(result[1]?.classification).toBe('BUILD_OUTPUT');
    expect(result[2]?.classification).toBe('VENDORED');
    expect(result[3]?.classification).toBe('MIGRATION');
  });

  it('28. create_action_plan produces validated AgentActionPlan', () => {
    const result = Tools.handleCreateActionPlan({
      objective: 'Modernize button styles',
      requestedScope: ['src/Button.tsx'],
      filesExpectedToChange: ['src/Button.tsx']
    });
    expect(result.objective).toBe('Modernize button styles');
    expect(result.estimatedBlastRadius).toBe('LOW');
  });

  it('29. evaluate_scope audits boundary adherence', () => {
    const result = Tools.handleEvaluateScope({
      filesToChange: ['src/Button.tsx', '.env'],
      requestedScope: ['src/Button.tsx']
    });
    expect(result.isClean).toBe(false);
    expect(result.violations.length).toBe(1);
  });

  it('30. evaluate_change_risk assesses risk factors', () => {
    const result = Tools.handleEvaluateChangeRisk({
      fileCount: 20,
      databaseImpact: true,
      authenticationImpact: true
    });
    expect(result.overallRisk).toBe('CRITICAL');
    expect(result.mandatoryCheckpoint).toBe(true);
  });

  it('31. create_checkpoint_plan inspects git status and prepares rollback', () => {
    const result = Tools.handleCreateCheckpointPlan({
      gitStatusText: 'On branch main\n modified: src/app.ts',
      taskName: 'Update App',
      currentBranch: 'main'
    });
    expect(result.requiresApproval).toBe(true);
    expect(result.rollbackScript.length).toBeGreaterThan(0);
  });

  it('32. create_verification_plan plans scalable verification stages', () => {
    const result = Tools.handleCreateVerificationPlan({
      objective: 'Fix core UI accessibility',
      isUI: true,
      riskLevel: 'MEDIUM'
    });
    expect(result.activeStages).toContain('VISUAL_VERIFY');
  });

  it('33. normalize_verification_evidence standardizes evidence items', () => {
    const result = Tools.handleNormalizeVerificationEvidence({
      rawItems: [{ type: 'BUILD_OUTPUT', source: 'tsc', summary: 'Clean compilation', verified: true }]
    });
    expect(result.length).toBe(1);
    expect(result[0]?.type).toBe('BUILD_OUTPUT');
  });

  it('34. review_change performs independent review', () => {
    const result = Tools.handleReviewChange({
      taskObjective: 'Sanitize user avatar URL',
      diffContent: '+ const sanitized = encodeURI(url);',
      filesChanged: ['src/Avatar.tsx'],
      testsPassed: true
    });
    expect(result.verdict).toBe('APPROVE');
    expect(result.checks.security).toBe(true);
  });

  it('35. detect_regression compares against baseline', () => {
    const result = Tools.handleDetectRegression({
      baselines: [{ id: 'route-1', type: 'ROUTE', expectedValue: '/dashboard' }],
      currentStates: [{ id: 'route-1', type: 'ROUTE', actualValue: '/dashboard' }]
    });
    expect(result.status).toBe('PASSED');
  });

  it('36. create_environment_profile inspects project directory', () => {
    const result = Tools.handleCreateEnvironmentProfile({
      projectPath: '.'
    });
    expect(result.lockFiles.length).toBeGreaterThan(0);
  });

  it('37. route_context scopes agent context to task', () => {
    const result = Tools.handleRouteContext({
      taskId: 't-1',
      taskBrief: 'Fix React button accessibility',
      detectedStack: 'react-typescript',
      mode: 'REPAIR'
    });
    expect(result.requiredSkills).toContain('alper-design-repair');
    expect(result.tokenBudgetReductionPercent).toBeGreaterThan(40);
  });

  it('38. route_tool selects appropriate tool', () => {
    const result = Tools.handleRouteTool({
      taskDescription: 'Inspect package.json file'
    });
    expect(result.chosenTool).toBe('view_file');
  });

  it('39. create_execution_journal writes sanitized artifacts', () => {
    const result = Tools.handleCreateExecutionJournal({
      baseDir: 'scratch',
      runId: 'test-run-123',
      plan: { objective: 'Test Run', apiKey: 'sk-abcdef1234567890abcdef1234567890' }
    });
    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(result.secretsRedactedCount).toBeGreaterThanOrEqual(1);

    // Clean up scratch dir
    try {
      fs.rmSync(path.join('scratch', '.alper-design-os'), { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('40. evaluate_completion_claim checks assertion against evidence', () => {
    const result = Tools.handleEvaluateCompletionClaim({
      claim: 'Production ready',
      evidences: []
    });
    expect(result.status).toBe('NOT_VERIFIED');
    expect(result.missingEvidence.length).toBeGreaterThan(0);
  });

  it('41. create_design_intent synthesizes contextual profile', () => {
    const result = Tools.handleCreateDesignIntent({
      productType: 'ENTERPRISE_INTERNAL',
      informationDensity: 'COMPACT'
    });
    expect(result.productType).toBe('ENTERPRISE_INTERNAL');
    expect(result.informationDensity).toBe('COMPACT');
    expect(result.decisionPrinciples.length).toBeGreaterThan(0);
  });

  it('42. create_page_blueprint instantiates canonical workspace blueprint', () => {
    const result = Tools.handleCreatePageBlueprint({
      preset: 'DATA_MANAGEMENT_WORKSPACE'
    });
    expect(result.id).toBe('data-management-workspace');
    expect(result.regions.length).toBe(5);
  });

  it('43. create_component_blueprint outputs canonical component blueprint', () => {
    const result = Tools.handleCreateComponentBlueprint({
      type: 'DATA_TABLE',
      density: 'COMPACT'
    });
    expect(result.type).toBe('DATA_TABLE');
    expect(result.density).toBe('COMPACT');
    expect(result.interactions).toBeDefined();
  });

  it('44. create_app_shell_blueprint creates shell based on variant', () => {
    const result = Tools.handleCreateAppShellBlueprint({
      id: 'test-shell',
      variant: 'ENTERPRISE_DENSE'
    });
    expect(result.variant).toBe('ENTERPRISE_DENSE');
    expect(result.navigation.breadcrumbs).toBe(true);
  });

  it('45. render_blueprint compiles canonical blueprint to target stack', () => {
    const result = Tools.handleRenderBlueprint({
      targetStack: 'html-css-js',
      theme: 'LIGHT',
      density: 'COMPACT'
    });
    expect(result.stack).toBe('html-css-js');
    expect(result.primaryFile.content).toContain('<!DOCTYPE html>');
    expect(result.supportingFiles.length).toBe(3);
  });

  it('46. render_component compiles single component blueprint', () => {
    const result = Tools.handleRenderComponent({
      componentType: 'BUTTON',
      targetStack: 'react-typescript'
    });
    expect(result.stack).toBe('react-typescript');
    expect(result.primaryFile.content).toContain('export const');
  });

  it('47. create_ui_recipe instantiates canonical recipe', () => {
    const result = Tools.handleCreateUiRecipe({
      recipeType: 'LOGIN_PAGE'
    });
    expect(result.type).toBe('LOGIN_PAGE');
    expect(result.supportedThemes).toContain('DARK');
  });

  it('48. select_design_personality calculates quantitative axes', () => {
    const result = Tools.handleSelectDesignPersonality({
      productType: 'DEVELOPER_TOOL',
      informationDensity: 'COMPACT'
    });
    expect(result.compactToSpacious).toBeLessThan(0);
    expect(result.technicalToEditorial).toBeLessThan(0);
  });

  it('49. evaluate_design_antipatterns inspects markup/css for defects', () => {
    const result = Tools.handleEvaluateDesignAntipatterns({
      content: 'button { color: #888888; backdrop-filter: blur(10px); }',
      blueprintPreset: 'DATA_MANAGEMENT_WORKSPACE'
    });
    expect(result.totalIssues).toBeGreaterThan(0);
    expect(result.issues.some((i) => i.code === 'LOW_CONTRAST' || i.code === 'GLASSMORPHISM_OVERUSE')).toBe(true);
  });

  it('50. compare_renderer_parity evaluates cross-stack parity scores', () => {
    const result = Tools.handleCompareRendererParity({
      blueprintPreset: 'DATA_MANAGEMENT_WORKSPACE'
    });
    expect(result.overallParityScore).toBeGreaterThanOrEqual(90);
    expect(result.stackOutputs['html-css-js'].status).toBe('PASS');
    expect(result.stackOutputs['react-typescript'].status).toBe('PASS');
    expect(result.stackOutputs['laravel-blade'].status).toBe('PASS');
    expect(result.stackOutputs['aspnet-razor'].status).toBe('PASS');
  });

  it('51. inspect_alper_registry queries registry catalog', () => {
    const result = Tools.handleInspectAlperRegistry({
      section: 'ALL'
    });
    expect(result.name).toBe('Alper UI Canonical Registry');
    expect(result.componentsCount).toBe(15);
    expect(result.recipesCount).toBe(6);
  });

  it('52. evaluate_truthful_ui evaluates UI truthfulness via MCP', () => {
    const result = Tools.handleEvaluateTruthfulUi({
      components: [
        {
          id: 'comp-1',
          name: 'Realtime Latency',
          type: 'telemetry',
          hasLiveDataSource: false,
          dataSourceUri: '/api/missing-telemetry-endpoint'
        }
      ]
    });
    expect(result.verdict).toBe('CONTENT_TRUTH_FAIL');
  });

  it('53. audit_data_provenance audits provenance via MCP', () => {
    const result = Tools.handleAuditDataProvenance({
      records: [
        {
          fieldOrComponentId: 'temp',
          originType: 'AUTHORITATIVE_API',
          endpointOrSource: 'https://api.domain.internal'
        }
      ]
    });
    expect(result.isCompliant).toBe(true);
  });

  it('54. evaluate_page_intent audits intent alignment via MCP', () => {
    const result = Tools.handleEvaluatePageIntent({
      intentType: 'OPERATIONAL_MONITORING',
      primaryGoal: 'Observe industrial telemetry',
      targetAudience: 'Technicians',
      components: [
        {
          id: 'grid-1',
          type: 'GRID',
          role: 'telemetry-grid',
          originType: 'TELEMETRY_STREAM'
        }
      ]
    });
    expect(result.matchesIntent).toBe(true);
  });

  it('55. audit_information_relevance evaluates signal to noise via MCP', () => {
    const result = Tools.handleAuditInformationRelevance({
      intentType: 'OPERATIONAL_MONITORING',
      primaryGoal: 'Quick diagnostics',
      elements: [
        {
          id: 'sensor-card',
          title: 'Sensor Health',
          role: 'sensor'
        }
      ]
    });
    expect(result.passed).toBe(true);
  });

  it('56. classify_source_authority categorizes source tier via MCP', () => {
    const result = Tools.handleClassifySourceAuthority({
      sourceId: 'src-gateway',
      isProductionEndpoint: true,
      hasAuthHeaders: true
    });
    expect(result.authorityTier).toBe('AUTHORITATIVE_SYSTEM');
  });

  it('57. evaluate_content_truth_gate evaluates content truth release gate via MCP', () => {
    const result = Tools.handleEvaluateContentTruthGate({
      components: [],
      requireVisualApproval: false
    });
    expect(result.verdict).toBe('CONTENT_TRUTH_PASS');
  });

  it('58. manage_human_visual_approval manages approval workflow via MCP', () => {
    const result = Tools.handleManageHumanVisualApproval({
      action: 'GET_STATUS'
    });
    expect(result.record.status).toBe('NOT_REVIEWED');
    expect(result.gateResult.gateStatus).toBe('PENDING');
  });

  it('59. audit_track_trace_telemetry performs static telemetry audit via MCP', () => {
    const result = Tools.handleAuditTrackTraceTelemetry({});
    expect(result.auditMode).toBe('STATIC_AUDIT_ONLY');
    expect(result.liveContainersProbed).toBe(false);
    expect(result.deferredItems.length).toBeGreaterThan(0);
  });
});


