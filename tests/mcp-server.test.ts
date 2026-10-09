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
});

