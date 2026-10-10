import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

export function evaluateSeededDefects(browserFindings) {
  const expectedPath = path.resolve(rootDir, 'benchmarks/apps/broken-web/benchmark-expected-findings.json');
  const expectedData = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));

  const brokenAppCodePath = path.resolve(rootDir, 'benchmarks/apps/broken-web/app.js');
  const brokenAppCode = fs.existsSync(brokenAppCodePath) ? fs.readFileSync(brokenAppCodePath, 'utf8') : '';

  // Secret scanner check
  const secretPattern = /sk_test_[a-zA-Z0-9_]{20,}/g;
  const secretMatches = brokenAppCode.match(secretPattern) || [];
  const secretDetected = secretMatches.length > 0;

  // Masked secret for safe reporting
  const sanitizedSecret = secretDetected ? 'sk_test_fake_************************' : null;

  const b = browserFindings.brokenAppFindings;
  const g = browserFindings.goldenAppFindings;

  // Defect detection results map
  const defectVerification = [
    {
      id: 'SEED-01',
      title: 'JavaScript console error',
      detected: b.consoleErrors.length > 0 && b.consoleErrors.some((e) => e.message.includes('TelemetryError') || e.message.includes('ReferenceError')),
      evidence: b.consoleErrors[0]?.message || 'None'
    },
    {
      id: 'SEED-02',
      title: 'Failed network request / 404',
      detected: b.networkFailures.length > 0 && b.networkFailures.some((n) => n.url.includes('/api/missing-telemetry-endpoint')),
      evidence: b.networkFailures[0]?.url || 'None'
    },
    {
      id: 'SEED-03',
      title: 'Mobile horizontal overflow',
      detected: b.layoutOverflows.length > 0 && b.layoutOverflows.some((o) => o.viewport === 'mobile'),
      evidence: b.layoutOverflows[0] ? `scrollWidth: ${b.layoutOverflows[0].scrollWidth}px > viewport: ${b.layoutOverflows[0].width}px` : 'None'
    },
    {
      id: 'SEED-04',
      title: 'Missing accessible form label',
      detected: b.accessibilityViolations.length > 0 && b.accessibilityViolations.some((v) => v.includes('coupon-code')),
      evidence: b.accessibilityViolations.join(', ')
    },
    {
      id: 'SEED-05',
      title: 'Keyboard/focus usability problem',
      detected: b.keyboardIssues.length > 0 && b.keyboardIssues.some((k) => k.includes('faulty-submit-btn')),
      evidence: b.keyboardIssues.join(', ')
    },
    {
      id: 'SEED-06',
      title: 'Duplicate network request',
      detected: b.duplicateRequests.length > 0 && b.duplicateRequests.some((d) => d.url.includes('/api/status')),
      evidence: b.duplicateRequests[0] ? `${b.duplicateRequests[0].url} called ${b.duplicateRequests[0].count} times` : 'None'
    },
    {
      id: 'SEED-07',
      title: 'Fake hardcoded secret pattern',
      detected: secretDetected,
      evidence: sanitizedSecret || 'None'
    },
    {
      id: 'SEED-08',
      title: 'Responsive clipping problem',
      detected: b.clippingIssues.length > 0,
      evidence: b.clippingIssues[0] || 'None'
    },
    {
      id: 'SEED-09',
      title: 'Bad UI state / missing error feedback',
      detected: b.silentErrorStates.length > 0,
      evidence: b.silentErrorStates[0] || 'None'
    },
    {
      id: 'SEED-10',
      title: 'Design consistency problem (Comic Sans / Neon magenta)',
      detected: b.designViolations.length > 0,
      evidence: b.designViolations[0] || 'None'
    }
  ];

  const detectedCount = defectVerification.filter((d) => d.detected).length;
  const totalSeeded = 10;
  const detectionRate = (detectedCount / totalSeeded) * 100;

  // Check golden web defects (must be 0)
  const goldenDefects = [
    ...g.consoleErrors,
    ...g.networkFailures,
    ...g.duplicateRequests,
    ...g.layoutOverflows,
    ...g.accessibilityViolations,
    ...g.keyboardIssues,
    ...g.clippingIssues,
    ...g.silentErrorStates,
    ...g.designViolations
  ];

  const falsePositiveCount = goldenDefects.length;
  const totalFindings = detectedCount + falsePositiveCount;
  const precision = totalFindings > 0 ? (detectedCount / totalFindings) * 100 : 100;

  return {
    totalSeeded,
    detectedCount,
    detectionRate: `${detectionRate.toFixed(1)}%`,
    precision: `${precision.toFixed(1)}%`,
    falsePositiveCount,
    goldenClean: goldenDefects.length === 0,
    defects: defectVerification
  };
}
