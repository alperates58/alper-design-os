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
});
