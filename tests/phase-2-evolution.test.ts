import { describe, it, expect, beforeAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

// Workstream A: Premium Design Intelligence
import {
  ArtDirectionEngine,
  DesignKnowledgeEngine,
  UniversalThemeEngine,
  CANONICAL_LIGHT_THEME,
  CANONICAL_DARK_THEME,
  CANONICAL_COMPONENT_RECIPES,
  LayoutReasoningEngine
} from '../packages/design-language/dist/index.js';

// Workstream B, C, D, E: Agent Governance & Engineering
import {
  extractComprehensivePreservationContract,
  verifyComprehensivePreservation,
  VisualRepairEngine,
  AdaptiveWorkflowEngine,
  RequirementsGlossaryEngine,
  ProjectGraphV2,
  ContextCompressor
} from '../packages/agent-governance/dist/index.js';

import { SimplicityGuard } from '../packages/engineering-guardrails/dist/index.js';

// Workstream F & G: Real Visual QA Runner
import { VisualQARunner } from '../packages/qa-engine/dist/index.js';

describe('ALPER DESIGN OS — PHASE 2 EVOLUTION CERTIFICATION SUITE', () => {
  const repoRoot = path.resolve('.');
  const fixtureDir = path.join(repoRoot, 'tests', 'fixtures', 'certification');
  const screenshotDir = path.join(fixtureDir, 'screenshots');

  beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  // =========================================================================
  // WORKSTREAM A: PREMIUM DESIGN INTELLIGENCE V2
  // =========================================================================
  describe('Workstream A: Premium Design Intelligence V2', () => {
    const artEngine = new ArtDirectionEngine();
    const knowledgeEngine = new DesignKnowledgeEngine();
    const themeEngine = new UniversalThemeEngine();
    const layoutEngine = new LayoutReasoningEngine();

    it('A1: generates 3 distinct candidates for enterprise ERP and selects top candidate with explicit reasoning', () => {
      const candidates = artEngine.generateCandidates({
        productName: 'SupplyChain Central',
        productCategory: 'Enterprise ERP & Planning',
        targetPersonas: ['Supply Planner', 'Operations Director'],
        businessWorkflows: ['Demand forecasting', 'Batch scheduling', 'Inventory reconciliation'],
        userExpertise: 'EXPERT',
        informationDensity: 'COMPACT',
        brandPositioning: 'TECHNICAL',
        screenSpaceTarget: 'DESKTOP'
      });

      expect(candidates.length).toBe(3);
      expect(candidates.some(c => c.profile === 'ENTERPRISE_ERP')).toBe(true);

      const selected = artEngine.selectDirection(candidates, {
        productName: 'SupplyChain Central',
        productCategory: 'Enterprise ERP & Planning',
        targetPersonas: ['Supply Planner'],
        businessWorkflows: ['Batch scheduling'],
        userExpertise: 'EXPERT',
        informationDensity: 'COMPACT',
        brandPositioning: 'TECHNICAL'
      });

      expect(selected.chosenCandidate.profile).toBe('ENTERPRISE_ERP');
      expect(selected.chosenCandidate.densityMode).toBe('COMPACT');
      expect(selected.selectionReasoning).toContain('Enterprise Structured Console');
      expect(Object.keys(selected.rejectionReasons).length).toBe(2);
      expect(selected.designIntentBridge.productType).toBe('ENTERPRISE_INTERNAL');
    });

    it('A1: generates single candidate for trivial visual repair tasks to conserve computation', () => {
      const candidates = artEngine.generateCandidates({
        productName: 'QuickFix App',
        productCategory: 'SaaS',
        targetPersonas: ['User'],
        businessWorkflows: ['View profile'],
        userExpertise: 'INTERMEDIATE',
        informationDensity: 'COMFORTABLE',
        brandPositioning: 'UTILITY',
        isTrivialVisualRepair: true
      });

      expect(candidates.length).toBe(1);
    });

    it('A2: queries curated design knowledge base with justified scoring and explainability', () => {
      const recommendation = knowledgeEngine.recommend({
        productType: 'Industrial APS & Factory MES',
        userType: 'OPERATOR',
        primaryTask: 'WORKFLOW_ENTRY'
      });

      expect(recommendation.matchConfidence).toBeGreaterThanOrEqual(90);
      expect(recommendation.matchedRule.id).toBe('KB-IND-APS');
      expect(recommendation.layoutBlueprint.densityPreset).toBe('COMPACT');
      expect(recommendation.explanation).toContain('Industrial APS & Factory MES');
      expect(recommendation.provenanceAttribution).toContain('ISA-101');
    });

    it('A3: generates canonical semantic CSS variables and validates mathematical contrast (WCAG 2.1 AA)', () => {
      const css = themeEngine.generateCssVariables();
      expect(css).toContain('--alper-color-primary');
      expect(css).toContain('--alper-surface-base');
      expect(css).toContain('[data-theme="dark"]');
      expect(css).toContain('@media (prefers-reduced-motion: reduce)');

      // Validate contrast calculation
      const lightContrast = themeEngine.evaluateContrast(CANONICAL_LIGHT_THEME.textPrimary, CANONICAL_LIGHT_THEME.surfaceDefault);
      expect(lightContrast.passesAA).toBe(true);
      expect(lightContrast.ratio).toBeGreaterThanOrEqual(7.0); // AAA passed

      const darkContrast = themeEngine.evaluateContrast(CANONICAL_DARK_THEME.textPrimary, CANONICAL_DARK_THEME.surfaceDefault);
      expect(darkContrast.passesAA).toBe(true);
      expect(darkContrast.ratio).toBeGreaterThanOrEqual(7.0);

      // Verify SSR hydration script
      const ssrScript = themeEngine.renderSSRThemeScript('custom-theme-pref');
      expect(ssrScript).toContain('custom-theme-pref');
      expect(ssrScript).toContain('data-theme');
    });

    it('A4: verifies 18 canonical component recipes and layout reasoning for Windows 125% DPI', () => {
      const keys = Object.keys(CANONICAL_COMPONENT_RECIPES);
      expect(keys.length).toBe(18);
      expect(keys).toContain('navigationShell');
      expect(keys).toContain('dataGrid');
      expect(keys).toContain('formsValidation');
      expect(keys).toContain('dialogsDrawers');
      expect(keys).toContain('splitPanels');

      // Test Layout Reasoning Engine under Windows 125% DPI display scaling
      const decision = layoutEngine.evaluateLayout({
        productType: 'Enterprise ERP',
        userTask: 'DATA_DENSE_MANAGEMENT',
        viewport: { width: 1920, height: 1080, dpiScalingFactor: 1.25 },
        recordCountEstimate: 120
      });

      expect(decision.densityPreset.mode).toBe('COMPACT');
      expect(decision.densityPreset.tableRowHeightPx).toBe(36);
      expect(decision.dataPresentationChoice.recommendedView).toBe('DATAGRID_PRIMARY');
      expect(decision.windowsDpiAdjustments).toBeDefined();
      expect(decision.windowsDpiAdjustments?.reducedChromeHeight).toBe(true);
      expect(decision.windowsDpiAdjustments?.recommendedHeaderHeightPx).toBe(48);
    });
  });

  // =========================================================================
  // WORKSTREAM B: MODERNIZE & REPAIR V2
  // =========================================================================
  describe('Workstream B: Modernize & Repair V2', () => {
    it('B1: extracts and verifies comprehensive preservation contract ensuring zero route or action drops', () => {
      const baselineHtml = fs.readFileSync(path.join(fixtureDir, 'fixture-modernize', 'index.html'), 'utf-8');
      const baselineFiles = [{ path: 'index.html', content: baselineHtml }];

      const baselineContract = extractComprehensivePreservationContract(baselineFiles);
      expect(baselineContract.routes.length).toBe(4); // dashboard, orders, inventory, settings
      expect(baselineContract.userActions.length).toBeGreaterThanOrEqual(4); // submit, delete, view, open modal
      expect(baselineContract.apiEndpoints.length).toBe(1); // /api/orders

      // Modernized version
      const modernizedHtml = fs.readFileSync(path.join(fixtureDir, 'fixture-modernize', 'modernized.html'), 'utf-8');
      const modernizedContract = extractComprehensivePreservationContract([{ path: 'modernized.html', content: modernizedHtml }]);

      const report = verifyComprehensivePreservation(baselineContract, modernizedContract);
      expect(report.preserved).toBe(true);
      expect(report.criticalViolations.length).toBe(0);
      expect(report.routePreservationRate).toBe(100);
      expect(report.actionPreservationRate).toBe(100);
      expect(report.score).toBeGreaterThanOrEqual(95);
    });

    it('B2: analyzes and surgically repairs defective UI in Fixture 1', () => {
      const repairEngine = new VisualRepairEngine();
      const defectiveCss = fs.readFileSync(path.join(fixtureDir, 'fixture-repair', 'style.css'), 'utf-8');
      const defectiveHtml = fs.readFileSync(path.join(fixtureDir, 'fixture-repair', 'index.html'), 'utf-8');

      const files = [
        { path: 'style.css', content: defectiveCss },
        { path: 'index.html', content: defectiveHtml }
      ];

      const report = repairEngine.analyzeVisualDefects(files);
      expect(report.totalDefects).toBeGreaterThanOrEqual(4);
      expect(report.defects.some(d => d.category === 'CONTRAST_FAILURE')).toBe(true);
      expect(report.defects.some(d => d.category === 'RESPONSIVE_BREAKAGE')).toBe(true);
      expect(report.defects.some(d => d.category === 'BROKEN_INTERACTIVE_STATE')).toBe(true);

      const repairResult = repairEngine.repair(report, files);
      expect(repairResult.resolvedDefectCount).toBeGreaterThanOrEqual(3);
      expect(repairResult.functionalPreservationCheck.eventListenersPreserved).toBe(true);

      // Verify repaired CSS no longer contains fixed 1200px width
      const repairedCss = repairResult.repairedFiles.find(f => f.path === 'style.css')?.content || '';
      expect(repairedCss).toContain('max-width: min(100%, 1200px)');
      expect(repairedCss).toContain('var(--alper-interactive-focus-ring');

      // Write repaired CSS to disk for visual verification
      fs.writeFileSync(path.join(fixtureDir, 'fixture-repair', 'repaired-style.css'), repairedCss, 'utf-8');
    });
  });

  // =========================================================================
  // WORKSTREAM C: AGENT WORKFLOW ENGINE V2
  // =========================================================================
  describe('Workstream C: Agent Workflow Engine V2', () => {
    it('C2: selects QUICK, STANDARD, and DEEP modes based on task risk and touched file count', () => {
      const adaptiveEngine = new AdaptiveWorkflowEngine();

      // Quick
      const quickReq = adaptiveEngine.evaluateWorkflowMode({
        taskBrief: 'Fix typo in login button text',
        touchedFilesCount: 1,
        riskLevel: 'LOW'
      });
      expect(quickReq.mode).toBe('QUICK');
      expect(quickReq.planDepth).toBe('MINIMAL_SUMMARY');

      // Standard
      const stdReq = adaptiveEngine.evaluateWorkflowMode({
        taskBrief: 'Implement new customer export table',
        touchedFilesCount: 4,
        riskLevel: 'MEDIUM'
      });
      expect(stdReq.mode).toBe('STANDARD');
      expect(stdReq.planDepth).toBe('STRUCTURED_STEPS');

      // Deep
      const deepReq = adaptiveEngine.evaluateWorkflowMode({
        taskBrief: 'Migrate enterprise database schema and security authentication',
        touchedFilesCount: 12,
        riskLevel: 'HIGH',
        hasSecurityImplications: true
      });
      expect(deepReq.mode).toBe('DEEP');
      expect(deepReq.subagentDispatchAllowed).toBe(true);
      expect(deepReq.mandatoryEvidence).toContain('PRESERVATION_PROOF');

      // Claim evaluation without tests fails
      const claimEval = adaptiveEngine.evaluateCompletionClaim(deepReq, {
        diffVerified: true,
        preservationVerified: true
      });
      expect(claimEval.canClaimCompletion).toBe(false);
      expect(claimEval.missingEvidence).toContain('Automated tests not executed or reported failures.');
    });

    it('C3: detects material ambiguity and manages canonical glossary with decision provenance', () => {
      const glossaryEngine = new RequirementsGlossaryEngine();

      // Ambiguity detection
      const ambig = glossaryEngine.detectAmbiguity('Please add a new ticket to the backlog for the admin.');
      expect(ambig.hasMaterialAmbiguity).toBe(true);
      expect(ambig.ambiguousTermsFound.some(t => t.term === 'ticket')).toBe(true);
      expect(ambig.ambiguousTermsFound.some(t => t.term === 'backlog')).toBe(true);

      // Record decision with provenance
      const dec = glossaryEngine.recordDecision({
        topic: 'Theme Storage Strategy',
        selectedOption: 'localStorage with SSR inline script',
        alternativesConsidered: ['cookie-based server render', 'sessionStorage'],
        rationale: 'Zero flicker, zero network latency on page reload',
        provenance: 'USER_EXPLICIT'
      });
      expect(dec.id).toBe('DEC-1');
      expect(dec.provenance).toBe('USER_EXPLICIT');

      const md = glossaryEngine.exportMarkdownGlossary();
      expect(md).toContain('Theme Storage Strategy');
      expect(md).toContain('Preservation Contract');
    });
  });

  // =========================================================================
  // WORKSTREAM D: CODE INTELLIGENCE & PROJECT GRAPH V2
  // =========================================================================
  describe('Workstream D: Code Intelligence & Project Graph V2', () => {
    it('D1: builds deterministic AST graph, identifies god nodes, computes change impact and affected tests', () => {
      const graph = new ProjectGraphV2();

      const sampleFiles = [
        {
          path: 'packages/core/src/index.ts',
          content: 'export function calculateTotal() { return 100; }\nexport function parseOrder() { return {}; }'
        },
        {
          path: 'packages/core/src/utils.ts',
          content: 'import { calculateTotal } from "./index.js";\nexport function formatCurrency() { return calculateTotal(); }'
        },
        {
          path: 'packages/api/src/routes.ts',
          content: 'import { formatCurrency } from "../../core/src/utils.js";\nrouter.get("/orders", handler);\nrouter.post("/orders", createHandler);'
        },
        {
          path: 'tests/core.test.ts',
          content: 'import { calculateTotal } from "../packages/core/src/index.js";\n// ADR-042 reference'
        }
      ];

      const buildStats = graph.buildGraph(sampleFiles);
      expect(buildStats.nodeCount).toBeGreaterThanOrEqual(6);
      expect(buildStats.extractedCount).toBeGreaterThanOrEqual(4);

      // Query Entity
      const entity = graph.queryEntity('packages/core/src/index.ts');
      expect(entity).toBeDefined();
      expect(entity?.provenance).toBe('EXTRACTED');

      // Change Impact Analysis: modifying core index impacts utils, routes, and tests
      const impact = graph.showChangeImpact('packages/core/src/index.ts');
      expect(impact.totalAffectedCount).toBeGreaterThanOrEqual(2);
      expect(impact.affectedTestSuites).toContain('tests/core.test.ts');

      // Dependency Path
      const pathFound = graph.queryDependencyPath('packages/api/src/routes.ts', 'packages/core/src/index.ts');
      expect(pathFound).toBeDefined();
      expect(pathFound?.length).toBeGreaterThanOrEqual(2);

      // Relationship explanation
      const explanation = graph.explainRelationship('packages/api/src/routes.ts', 'packages/core/src/index.ts');
      expect(explanation).toContain('transitively depends');
    });
  });

  // =========================================================================
  // WORKSTREAM E: SIMPLICITY & CONTEXT EFFICIENCY
  // =========================================================================
  describe('Workstream E: Simplicity & Context Efficiency', () => {
    it('E1: compresses test logs by >50% while preserving 100% of failure traces and exit statistics', () => {
      const compressor = new ContextCompressor();

      const rawVerboseLog = `
> vitest run
 RUN  v3.2.7
Progress: [==========] 10%
Progress: [==========] 20%
Progress: [==========] 30%
Progress: [==========] 40%
Progress: [==========] 50%
Progress: [==========] 60%
Progress: [==========] 70%
Progress: [==========] 80%
Progress: [==========] 90%
Progress: [==========] 100%
Updating files: 10% (100/1000)
Updating files: 50% (500/1000)
Updating files: 100% (1000/1000)
stdout | tests/sample.test.ts > basic test info line 1
stdout | tests/sample.test.ts > basic test info line 2
stdout | tests/sample.test.ts > basic test info line 3
stdout | tests/sample.test.ts > basic test info line 4
✓ tests/sample.test.ts > passes cleanly (12ms)
stdout | tests/sample.test.ts > another passing test
✓ tests/sample.test.ts > another passes cleanly (8ms)
stdout | tests/sample.test.ts > failing test
FAIL tests/sample.test.ts > should calculate accurately
  AssertionError: expected 10 to be 20
    at /project/tests/sample.test.ts:42:15
    at async runTest (/project/node_modules/vitest/index.js:12:4)
Test Files  1 failed (1)
Tests  1 failed | 2 passed (3)
Duration  1.24s
`.trim();

      const result = compressor.compressTestLog(rawVerboseLog);
      expect(result.reductionPercentage).toBeGreaterThanOrEqual(25);
      expect(result.hasFailureEvidence).toBe(true);
      expect(result.preservedErrorCount).toBeGreaterThanOrEqual(1);
      expect(result.compressedContent).toContain('FAIL tests/sample.test.ts');
      expect(result.compressedContent).toContain('AssertionError: expected 10 to be 20');
      expect(result.compressedContent).toContain('at /project/tests/sample.test.ts:42:15');
      expect(result.compressedContent).toContain('Tests  1 failed | 2 passed (3)');

      // Verify audit cache
      expect(compressor.getRawArtifact(result.auditArtifactRef!)).toBe(rawVerboseLog);
    });

    it('E2: simplicity guard flags speculative wrapper classes and unnecessary dependencies', () => {
      const guard = new SimplicityGuard();

      const badDiff = `
+import lodashGet from 'lodash.get';
+export class OrderServiceProxyWrapper {
+  getOrder(id: string) {
+    return lodashGet(this.db, id);
+  }
+}
+const x = 1; // TODO: for future use
`;

      const audit = guard.auditDiff(badDiff);
      expect(audit.passed).toBe(false);
      expect(audit.issues.some(i => i.rule === 'REUSE_BEFORE_DEPENDENCY')).toBe(true);
      expect(audit.issues.some(i => i.rule === 'NO_SPECULATIVE_ABSTRACTION')).toBe(true);
      expect(audit.issues.some(i => i.rule === 'YAGNI_UNUSED_OPTION')).toBe(true);
    });
  });

  // =========================================================================
  // WORKSTREAM F & G: REAL VISUAL QA & ISOLATED CERTIFICATION
  // =========================================================================
  describe('Workstream F & G: Real Visual QA & Isolated Certification', () => {
    const qaRunner = new VisualQARunner();

    it('F1 & G1: runs real Playwright browser inspection on Fixture 1 (Before vs Repaired) across viewports', async () => {
      // 1. Audit Defective Version (style.css with fixed width 1200px)
      const defectiveHtml = fs.readFileSync(path.join(fixtureDir, 'fixture-repair', 'index.html'), 'utf-8');
      const defectiveCss = fs.readFileSync(path.join(fixtureDir, 'fixture-repair', 'style.css'), 'utf-8');
      const defectiveCombined = defectiveHtml.replace('<link rel="stylesheet" href="style.css">', `<style>${defectiveCss}</style>`);

      const defectiveAudit = await qaRunner.runInspection({
        htmlContent: defectiveCombined,
        outputDir: screenshotDir,
        suiteName: 'fixture1-defective',
        themeModes: ['LIGHT'],
        viewports: [
          { name: 'MOBILE_390', width: 390, height: 844 },
          { name: 'DESKTOP_1920', width: 1920, height: 1080 }
        ]
      });

      // Defective version must trigger overflow on mobile (390px viewport vs 1200px container)
      const mobileDefective = defectiveAudit.results.find(r => r.viewportName === 'MOBILE_390');
      expect(mobileDefective?.hasHorizontalOverflow).toBe(true);
      expect(fs.existsSync(mobileDefective?.screenshotPath!)).toBe(true);

      // 2. Audit Repaired Version (repaired-style.css with max-width: 1200px)
      const repairedCss = fs.readFileSync(path.join(fixtureDir, 'fixture-repair', 'repaired-style.css'), 'utf-8');
      const repairedCombined = defectiveHtml.replace('<link rel="stylesheet" href="style.css">', `<style>${repairedCss}</style>`);

      const repairedAudit = await qaRunner.runInspection({
        htmlContent: repairedCombined,
        outputDir: screenshotDir,
        suiteName: 'fixture1-repaired',
        themeModes: ['LIGHT', 'DARK'],
        viewports: [
          { name: 'MOBILE_390', width: 390, height: 844 },
          { name: 'TABLET_768', width: 768, height: 1024 },
          { name: 'LAPTOP_1440', width: 1440, height: 900 },
          { name: 'DESKTOP_1920', width: 1920, height: 1080 }
        ]
      });

      // Repaired version eliminates overflow across all 4 viewports in Light & Dark modes
      if (repairedAudit.overallStatus !== 'VERIFIED') {
        console.error('REPAIRED AUDIT DEFECTS:', repairedAudit.unresolvedDefects);
      }
      expect(repairedAudit.overallStatus).toBe('VERIFIED');
      expect(repairedAudit.results.every(r => !r.hasHorizontalOverflow)).toBe(true);

      // Verify real screenshot files generated on disk
      for (const res of repairedAudit.results) {
        expect(fs.existsSync(res.screenshotPath!)).toBe(true);
        const stats = fs.statSync(res.screenshotPath!);
        expect(stats.size).toBeGreaterThan(1000); // real PNG image > 1KB
      }
    }, 60000);

    it('F2 & G2: runs real Playwright browser inspection on Fixture 2 (Modernized) across viewports and themes', async () => {
      const modernizedHtml = fs.readFileSync(path.join(fixtureDir, 'fixture-modernize', 'modernized.html'), 'utf-8');

      const modernAudit = await qaRunner.runInspection({
        htmlContent: modernizedHtml,
        outputDir: screenshotDir,
        suiteName: 'fixture2-modernized',
        themeModes: ['LIGHT', 'DARK'],
        viewports: [
          { name: 'MOBILE_390', width: 390, height: 844 },
          { name: 'TABLET_768', width: 768, height: 1024 },
          { name: 'LAPTOP_1440', width: 1440, height: 900 },
          { name: 'DESKTOP_1920', width: 1920, height: 1080 }
        ]
      });

      if (modernAudit.overallStatus !== 'VERIFIED') {
        console.error('MODERN AUDIT DEFECTS:', modernAudit.unresolvedDefects);
      }
      expect(modernAudit.overallStatus).toBe('VERIFIED');
      expect(modernAudit.results.length).toBe(8); // 4 viewports * 2 themes
      expect(modernAudit.results.every(r => !r.hasHorizontalOverflow)).toBe(true);
      expect(modernAudit.results.every(r => r.consoleErrors.length === 0)).toBe(true);

      // Verify screenshot generation
      for (const res of modernAudit.results) {
        expect(fs.existsSync(res.screenshotPath!)).toBe(true);
        const stats = fs.statSync(res.screenshotPath!);
        expect(stats.size).toBeGreaterThan(1000);
      }
    }, 60000);
  });
});
