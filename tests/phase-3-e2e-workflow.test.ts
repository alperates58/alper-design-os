import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  routeContext,
  routeTool,
  initializeProjectIntelligence,
  VisualRepairEngine,
  validateCssSyntax,
  verifyComprehensivePreservation,
  extractComprehensivePreservationContract,
  evaluateCompletionClaim,
  configureTrustedWorkspaceRoots,
  resetTrustedWorkspaceRoots
} from '@alper-design-os/agent-governance';
import { UniversalThemeEngine } from '@alper-design-os/design-language';
import { VisualQARunner } from '@alper-design-os/qa-engine';
import {
  handleAnalyzeProject,
  handleSelectDesignPersonality,
  handleRenderBlueprint
} from '@alper-design-os/mcp-server';

describe('Phase 3 Section 13: Actual User Workflow E2E Verification', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alper-phase3-e2e-'));
    configureTrustedWorkspaceRoots([
      { path: tmpRoot, capabilities: ['READ', 'WRITE'] }
    ]);
  });

  afterEach(() => {
    resetTrustedWorkspaceRoots();
    if (tmpRoot && fs.existsSync(tmpRoot)) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('Scenario 1: Existing Project UI Repair end-to-end chain (Intent -> Skill -> Tool -> Profile -> Design -> Repair -> Real Browser QA -> Preservation -> Completion)', async () => {
    const projectDir = path.join(tmpRoot, 'ops-console-repair');
    fs.mkdirSync(projectDir, { recursive: true });

    // Seed realistic existing project with broken CSS layout + JS file containing identical string literal
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify({ name: 'ops-console', version: '1.2.0', private: true }, null, 2),
      'utf-8'
    );
    const initialCss = [
      ':root { --bg: #f8fafc; --fg: #0f172a; }',
      'body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: var(--fg); }',
      '.main-shell { width: 1200px; padding: 16px; }'
    ].join('\n');
    const initialJs = [
      'const LEGACY_CONFIG_GUARD = "width: 1200px";',
      'function submitIncident(e) { if (e) e.preventDefault(); return fetch("/api/incidents", { method: "POST" }); }'
    ].join('\n');
    const initialHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OpsConsole Incident Workbench</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="main-shell">
    <h1>OpsConsole Incident Workbench</h1>
    <form id="incident-form" action="/api/incidents" method="POST">
      <label for="incident-title">Incident Title</label>
      <input id="incident-title" name="title" type="text" required style="min-height: 36px; min-width: 180px;" />
      <button id="submit-incident-btn" type="submit" data-action="submitIncident" style="min-height: 36px; min-width: 96px; padding: 8px 16px;">Create Incident</button>
    </form>
  </main>
  <script src="app.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(projectDir, 'styles.css'), initialCss, 'utf-8');
    fs.writeFileSync(path.join(projectDir, 'app.js'), initialJs, 'utf-8');
    fs.writeFileSync(path.join(projectDir, 'index.html'), initialHtml, 'utf-8');

    // Stage 1: Task intent -> Skill selection
    const skillRoute = routeContext({
      taskId: 'e2e-repair-01',
      taskBrief: 'Repair the fixed 1200px container overflow in styles.css on the existing incident workbench without altering JavaScript logic',
      mode: 'REPAIR'
    });
    expect(skillRoute.mode).toBe('REPAIR');
    expect(skillRoute.requiredSkills).toContain('alper-design-repair');
    expect(skillRoute.routingExplanation).toContain('Mode: REPAIR');

    // Stage 2: MCP / Tool plan
    const toolPlan = routeTool('Repair responsive container CSS and verify layout in live browser', {
      requireLiveBrowser: true,
      readOnly: false
    });
    expect(toolPlan.routingExplanation).toBeTruthy();
    expect(toolPlan.chosenTool).not.toBe('view_file');

    // Stage 3: Trusted project profile & Project Intelligence initialization
    const analysis = handleAnalyzeProject({
      projectPath: projectDir,
      productName: 'OpsConsole',
      description: 'Existing incident workbench'
    } as any);
    expect(analysis.verificationStatus).toBe('VERIFIED');
    expect(analysis.totalAuditedFiles).toBeGreaterThanOrEqual(3);

    const intel = initializeProjectIntelligence(projectDir, {
      mode: 'REPAIR',
      projectName: 'OpsConsole',
      primaryStack: 'PLAIN_HTML_CSS_JS'
    });
    expect(fs.existsSync(path.join(intel.rootPath, 'manifest.json'))).toBe(true);

    // Capture baseline preservation contract before repair
    const baselineFiles = [
      { path: 'index.html', content: fs.readFileSync(path.join(projectDir, 'index.html'), 'utf-8') },
      { path: 'styles.css', content: fs.readFileSync(path.join(projectDir, 'styles.css'), 'utf-8') },
      { path: 'app.js', content: fs.readFileSync(path.join(projectDir, 'app.js'), 'utf-8') }
    ];
    const baselineContract = extractComprehensivePreservationContract(baselineFiles);

    // Stage 4: Design direction
    const personality = handleSelectDesignPersonality({
      productType: 'B2B_SAAS',
      domain: 'ENTERPRISE_OPERATIONS',
      targetAudience: 'Incident Responders'
    } as any);
    expect(personality).toBeDefined();

    // Stage 5: Actual repair via VisualRepairEngine
    const repairEngine = new VisualRepairEngine();
    const defects = repairEngine.analyzeVisualDefects(baselineFiles);
    expect(defects.totalDefects).toBeGreaterThan(0);

    const repairResult = repairEngine.repair(defects, baselineFiles);
    expect(repairResult.resolvedDefectCount).toBeGreaterThan(0);
    expect(repairResult.functionalPreservationCheck.unrelatedFilesUnchanged).toBe(true);
    expect(repairResult.functionalPreservationCheck.cssSyntaxValid).toBe(true);

    const patchedCssFile = repairResult.repairedFiles.find((f) => f.path === 'styles.css')!;
    const patchedJsFile = repairResult.repairedFiles.find((f) => f.path === 'app.js')!;
    expect(validateCssSyntax(patchedCssFile.content).valid).toBe(true);
    expect(patchedCssFile.content).toContain('max-width: min(100%, 1200px)');
    expect(patchedCssFile.content).not.toContain('max-max-width');
    // Unrelated JS file with identical literal must remain byte-for-byte identical
    expect(patchedJsFile.content).toBe(initialJs);

    // Write repaired CSS back to workspace
    fs.writeFileSync(path.join(projectDir, 'styles.css'), patchedCssFile.content, 'utf-8');

    // Stage 6: Real browser verification via Playwright VisualQARunner
    const inlinedHtml = initialHtml.replace(
      '<link rel="stylesheet" href="styles.css" />',
      `<style>${patchedCssFile.content}</style>`
    );
    const qaRunner = new VisualQARunner();
    const qaReport = await qaRunner.runInspection({
      htmlContent: inlinedHtml,
      outputDir: path.join(projectDir, 'qa-out'),
      suiteName: 'e2e-repair-suite',
      viewports: [{ name: 'MOBILE_390', width: 390, height: 844 }],
      themeModes: ['LIGHT'],
      captureScreenshots: true
    });
    expect(qaReport.overallStatus).toBe('VERIFIED');
    const mobileAudit = qaReport.results[0]!;
    expect(mobileAudit.passed).toBe(true);
    expect(mobileAudit.screenshotVerified).toBe(true);
    expect(mobileAudit.hasHorizontalOverflow).toBe(false);
    expect(mobileAudit.consoleErrors).toEqual([]);

    // Stage 7: Preservation checks
    const candidateFiles = [
      { path: 'index.html', content: initialHtml },
      { path: 'styles.css', content: patchedCssFile.content },
      { path: 'app.js', content: patchedJsFile.content }
    ];
    const candidateContract = extractComprehensivePreservationContract(candidateFiles);
    const preservation = verifyComprehensivePreservation(baselineContract, candidateContract);
    expect(preservation.status).toBe('PRESERVED');
    expect(preservation.preserved).toBe(true);

    // Stage 8: Evidence-backed completion (first verify fail-closed if a stage fails, then verify pass)
    const blockedClaim = evaluateCompletionClaim(
      'Build, tests, and visual repair succeeded for OpsConsole',
      [
        {
          id: 'ev-build-fail',
          type: 'BUILD_OUTPUT',
          source: 'ci',
          timestamp: new Date().toISOString(),
          summary: 'Build failed with exit code 1',
          verified: false,
          rawData: { exitCode: 1, projectId: 'OpsConsole', revision: 'rev-repair-1' }
        }
      ],
      { expectedProject: 'OpsConsole', expectedRevision: 'rev-repair-1' }
    );
    expect(blockedClaim.status).not.toBe('VERIFIED');

    const verifiedClaim = evaluateCompletionClaim(
      'Visual repair and test verification completed for OpsConsole',
      [
        {
          id: 'ev-build-ok',
          type: 'BUILD_OUTPUT',
          source: 'tsc',
          timestamp: new Date().toISOString(),
          summary: 'CSS and JS syntax validation passed',
          verified: true,
          rawData: { exitCode: 0, projectId: 'OpsConsole', revision: 'rev-repair-1' }
        },
        {
          id: 'ev-test-ok',
          type: 'TEST_RESULT',
          source: 'vitest',
          timestamp: new Date().toISOString(),
          summary: 'All preservation and visual QA checks passed',
          verified: mobileAudit.passed && preservation.preserved,
          rawData: { exitCode: 0, projectId: 'OpsConsole', revision: 'rev-repair-1' }
        }
      ],
      { expectedProject: 'OpsConsole', expectedRevision: 'rev-repair-1' }
    );
    expect(verifiedClaim.status).toBe('VERIFIED');
  }, 30000);

  it('Scenario 2: Legacy Screen Modernization end-to-end chain (Intent -> Skill -> Tool -> Profile -> Render -> Browser QA + Theme -> Preservation Gate -> Completion)', async () => {
    const projectDir = path.join(tmpRoot, 'legacy-orders-modernize');
    fs.mkdirSync(projectDir, { recursive: true });

    const legacyScreenHtml = `<!DOCTYPE html>
<html lang="en">
<head><title>Legacy Orders</title></head>
<body>
  <nav><a data-route="/orders" href="/orders">Orders</a></nav>
  <div data-role="Role:OrderManager">Order Manager View</div>
  <form id="order-approval-form" action="/api/orders/approve" method="POST">
    <input name="orderId" type="text" required />
    <input name="tenantId" type="hidden" required />
    <button type="submit" data-action="approveOrder">Approve Order</button>
  </form>
  <script>
    function checkSession() { return true; }
    async function approveOrder(e) {
      e.preventDefault();
      return fetch('/api/orders/approve', { method: 'POST' });
    }
  </script>
</body>
</html>`;
    const legacySchemaSql = `CREATE TABLE orders (id INT PRIMARY KEY, order_number VARCHAR(64) UNIQUE NOT NULL, tenant_id VARCHAR(64) NOT NULL);`;
    const legacyTestTs = `describe('orders approval', () => { it('enforces tenant isolation', () => {}); });`;

    fs.writeFileSync(path.join(projectDir, 'orders.html'), legacyScreenHtml, 'utf-8');
    fs.writeFileSync(path.join(projectDir, 'schema.sql'), legacySchemaSql, 'utf-8');
    fs.writeFileSync(path.join(projectDir, 'orders.spec.ts'), legacyTestTs, 'utf-8');

    // Stage 1: Task intent -> Skill selection (without explicit mode, must detect MODERNIZE)
    const skillRoute = routeContext({
      taskId: 'e2e-modernize-01',
      taskBrief: 'Modernize the legacy orders approval screen into a clean enterprise workspace while preserving existing API routes, forms, and tenant isolation'
    } as any);
    expect(skillRoute.mode).toBe('MODERNIZE');
    expect(skillRoute.requiredSkills).toContain('alper-behavior-preservation');
    expect(skillRoute.routingExplanation).toContain('Mode: MODERNIZE');

    // Stage 2: MCP / Tool plan
    const toolPlan = routeTool('Modernize legacy orders screen and inspect in browser', {
      requireLiveBrowser: true,
      readOnly: false
    });
    expect(toolPlan.routingExplanation).toBeTruthy();

    // Stage 3: Trusted project profile & baseline preservation extraction
    const analysis = handleAnalyzeProject({
      projectPath: projectDir,
      productName: 'LegacyOrders',
      description: 'Legacy order management portal'
    } as any);
    expect(analysis.verificationStatus).toBe('VERIFIED');

    const baselineContract = extractComprehensivePreservationContract([
      { path: 'orders.html', content: legacyScreenHtml },
      { path: 'schema.sql', content: legacySchemaSql },
      { path: 'orders.spec.ts', content: legacyTestTs }
    ]);
    expect(baselineContract.apiEndpoints.length).toBeGreaterThan(0);
    expect(baselineContract.formIdentifiers).toContain('order-approval-form');

    // Stage 4 & 5: Design direction, Theme SSR script & Safe HTML rendering (with XSS canary in title)
    const themeEngine = new UniversalThemeEngine();
    const ssrThemeScript = themeEngine.renderSSRThemeScript();
    expect(ssrThemeScript).toContain("addEventListener('change'");

    const rendered = handleRenderBlueprint({
      blueprintId: 'data-management-workspace',
      targetStack: 'html-css-js',
      customPageTitle: 'Orders Portal <script>window.__xss=99</script>'
    } as any);
    expect(rendered.primaryFile.content).not.toContain('<script>window.__xss=99</script>');
    expect(rendered.primaryFile.content).toContain('&lt;script&gt;window.__xss=99&lt;/script&gt;');

    // Stage 6: Real browser verification via Playwright VisualQARunner in SYSTEM theme mode
    const fullModernHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Modernized Orders</title>
  ${ssrThemeScript}
  <style>
    :root, [data-theme="light"] { --bg-surface: rgb(248, 250, 252); --text-primary: rgb(15, 23, 42); }
    [data-theme="dark"] { --bg-surface: rgb(15, 23, 42); --text-primary: rgb(248, 250, 252); }
    body { margin: 0; background: var(--bg-surface); color: var(--text-primary); font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <nav><a data-route="/orders" href="/orders" style="display:inline-block; min-height:32px; padding:8px;">Orders</a></nav>
  <div data-role="Role:OrderManager">Order Manager View</div>
  <form id="order-approval-form" action="/api/orders/approve" method="POST" style="padding: 16px;">
    <label for="orderId">Order ID</label>
    <input id="orderId" name="orderId" type="text" required style="min-height: 36px; min-width: 180px;" />
    <input name="tenantId" type="hidden" required />
    <button type="submit" data-action="approveOrder" style="min-height: 36px; min-width: 120px; padding: 8px 16px;">Approve Order</button>
  </form>
  <script>
    function checkSession() { return true; }
    async function approveOrder(e) {
      e.preventDefault();
      return fetch('/api/orders/approve', { method: 'POST' });
    }
  </script>
</body>
</html>`;

    const qaRunner = new VisualQARunner();
    const qaSystemReport = await qaRunner.runInspection({
      htmlContent: fullModernHtml,
      outputDir: path.join(projectDir, 'qa-system'),
      suiteName: 'e2e-modernize-system',
      viewports: [{ name: 'DESKTOP_1440', width: 1440, height: 900 }],
      themeModes: ['SYSTEM'],
      captureScreenshots: true
    });
    expect(qaSystemReport.overallStatus).toBe('VERIFIED');
    const systemAudit = qaSystemReport.results[0]!;
    expect(systemAudit.passed).toBe(true);
    expect(systemAudit.screenshotVerified).toBe(true);
    expect(systemAudit.systemThemeDynamicSwitchVerified).toBe(true);

    // Stage 7A: Negative preservation check — dropping the form or POST endpoint MUST block preservation
    const regressedContract = extractComprehensivePreservationContract([
      { path: 'orders.html', content: '<html><body><nav><a data-route="/orders">Orders</a></nav></body></html>' },
      { path: 'schema.sql', content: legacySchemaSql },
      { path: 'orders.spec.ts', content: legacyTestTs }
    ]);
    const regressedVerdict = verifyComprehensivePreservation(baselineContract, regressedContract);
    expect(regressedVerdict.status).toBe('REGRESSION_DETECTED');
    expect(regressedVerdict.preserved).toBe(false);
    expect(regressedVerdict.criticalViolations.length).toBeGreaterThan(0);

    // Stage 7B: Positive preservation check — modernized screen preserving all 10 dimensions passes
    const preservedContract = extractComprehensivePreservationContract([
      { path: 'orders.html', content: fullModernHtml },
      { path: 'schema.sql', content: legacySchemaSql },
      { path: 'orders.spec.ts', content: legacyTestTs }
    ]);
    const preservedVerdict = verifyComprehensivePreservation(baselineContract, preservedContract);
    expect(preservedVerdict.status).toBe('PRESERVED');
    expect(preservedVerdict.preserved).toBe(true);

    // Stage 8: Evidence-backed completion
    const completion = evaluateCompletionClaim(
      'Modernized LegacyOrders screen with verified browser QA and behavioral preservation',
      [
        {
          id: 'ev-mod-build',
          type: 'BUILD_OUTPUT',
          source: 'renderer',
          timestamp: new Date().toISOString(),
          summary: 'Modernized HTML/CSS/JS bundle compiled cleanly',
          verified: true,
          rawData: { exitCode: 0, projectId: 'LegacyOrders', revision: 'rev-mod-1' }
        },
        {
          id: 'ev-mod-test',
          type: 'TEST_RESULT',
          source: 'vitest',
          timestamp: new Date().toISOString(),
          summary: 'Preservation contract and Playwright SYSTEM theme visual QA passed',
          verified: preservedVerdict.preserved && systemAudit.passed,
          rawData: { exitCode: 0, projectId: 'LegacyOrders', revision: 'rev-mod-1' }
        }
      ],
      { expectedProject: 'LegacyOrders', expectedRevision: 'rev-mod-1' }
    );
    expect(completion.status).toBe('VERIFIED');
  }, 30000);
});
