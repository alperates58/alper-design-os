import { QAReport, QAReportSchema } from './types.js';

export function createQAReport(reportInput: Partial<QAReport> & { targetApplication: string }): {
  report: QAReport;
  markdown: string;
} {
  const testedFlows = reportInput.testedFlows || [];
  const testedBrowsers = reportInput.testedBrowsers || ['Chromium'];
  const testedViewports = reportInput.testedViewports || ['DESKTOP_1920', 'MOBILE_390'];
  const consoleErrors = reportInput.consoleErrors || [];
  const networkFailures = reportInput.networkFailures || [];
  const accessibilityFindings = reportInput.accessibilityFindings || [];
  const performanceFindings = reportInput.performanceFindings || [];
  const visualDiffs = reportInput.visualDiffs || [];
  const failedTests = reportInput.failedTests || [];
  const warnings = reportInput.warnings || [];
  const unverifiedAreas = reportInput.unverifiedAreas || [
    'Stress & Soak Load Testing (Not executed)',
    'Third-Party Payment Gateway Live Transactions (Mocked only)',
    'Safari / WebKit on real iOS hardware (Emulated viewports only)'
  ];

  const hasBlockers = failedTests.length > 0 || consoleErrors.length > 0 || networkFailures.length > 0;
  const overallStatus = hasBlockers
    ? 'FAIL'
    : warnings.length > 0 || visualDiffs.some((v) => v.requiresReview)
      ? 'WARN'
      : 'PASS';

  const summary = hasBlockers
    ? `QA Verification FAILED: Detected ${failedTests.length} failed test(s), ${consoleErrors.length} console exception(s), and ${networkFailures.length} network failure(s).`
    : `QA Verification PASSED across ${testedFlows.length} user journey(s) and ${testedViewports.length} viewport(s). Note: ${unverifiedAreas.length} area(s) remain unverified.`;

  const report: QAReport = {
    reportId: `qa-rep-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    targetApplication: reportInput.targetApplication,
    overallStatus,
    summary,
    testedFlows,
    testedBrowsers,
    testedViewports,
    consoleErrors,
    networkFailures,
    accessibilityFindings,
    performanceFindings,
    visualDiffs,
    failedTests,
    warnings,
    unverifiedAreas
  };

  const validated = QAReportSchema.parse(report);

  const markdown = `# QA & Verification Report: ${report.targetApplication}
**Generated**: ${report.generatedAt}  
**Overall Status**: **${report.overallStatus}**  
**Summary**: ${report.summary}

---

## 1. Scope & Matrix Verified
- **Tested User Flows**: ${report.testedFlows.length > 0 ? report.testedFlows.join(', ') : 'None executed'}
- **Tested Browsers**: ${report.testedBrowsers.join(', ')}
- **Tested Viewports**: ${report.testedViewports.join(', ')}

---

## 2. Runtime Integrity (Chrome DevTools MCP)
- **Console Errors / Exceptions**: ${report.consoleErrors.length}
${report.consoleErrors.map((e) => `  - \`[${e.type.toUpperCase()}]\` ${e.text} ${e.location ? `(${e.location})` : ''}`).join('\n')}
- **Failed Network Requests (4xx / 5xx / CORS)**: ${report.networkFailures.length}
${report.networkFailures.map((n) => `  - \`[HTTP ${n.status}]\` ${n.method} ${n.url}`).join('\n')}

---

## 3. Accessibility & Performance Audits
- **Accessibility Status**: ${report.accessibilityFindings.length === 0 ? 'PASS (Zero axe-core violations detected)' : `${report.accessibilityFindings.length} issue(s) detected`}
${report.accessibilityFindings.map((a) => `  - ${a}`).join('\n')}
- **Performance Findings**:
${report.performanceFindings.map((p) => `  - ${p}`).join('\n')}

---

## 4. Visual Regression
- **Visual Comparisons Evaluated**: ${report.visualDiffs.length}
${report.visualDiffs.map((v) => `  - [${v.viewport} / ${v.state}] Diff: ${v.diffPercentage.toFixed(2)}% | Review Required: ${v.requiresReview ? 'YES' : 'NO'}`).join('\n')}

---

## 5. Explicitly Unverified Areas
> **CRITICAL TRANSPARENCY NOTICE**: The following capabilities were NOT tested during this session and must NOT be assumed to pass:
${report.unverifiedAreas.map((u) => `- [ ] ${u}`).join('\n')}
`;

  return { report: validated, markdown };
}
