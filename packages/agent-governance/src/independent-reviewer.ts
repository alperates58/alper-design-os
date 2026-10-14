import {
  IndependentReviewResult,
  ReviewerVerdict,
  ReviewerFinding,
  ReviewerCheckItem
} from './types.js';

export interface IndependentReviewInput {
  taskObjective: string;
  diffContent: string;
  filesChanged: string[];
  testOutput?: string;
  testsPassed?: boolean;
  browserEvidence?: Array<{ type: string; summary: string; passed: boolean }>;
  consoleErrors?: string[];
  networkErrors?: string[];
  securityFindings?: Array<{ severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; title: string }>;
  performanceMetrics?: { lcpMs?: number; inpMs?: number; cls?: number };
  scopeAudit?: { isClean: boolean; violations: Array<{ file: string; reason: string }> };
  // Modernization-specific criteria (Section 22)
  isModernizationTask?: boolean;
  behavioralRegressionAudit?: { passed: boolean; breaks: string[] };
  preservationAudit?: { compliant: boolean; violations: string[] };
  dependencyCreepAudit?: { hasUnjustifiedDeps: boolean; rejectedDependencies: string[] };
  truthfulnessAudit?: { passed: boolean; fabricatedTelemetryDetected: boolean };
  unnecessaryRewriteDetected?: boolean;
  rollbackPlanAttached?: boolean;
  humanVisualApprovalStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export function performIndependentReview(input: IndependentReviewInput): IndependentReviewResult {
  const findings: ReviewerFinding[] = [];
  const evidenceInspected: string[] = ['GIT_DIFF'];

  // Initialize checks to true, then falsify based on concrete evidence
  const checks: ReviewerCheckItem = {
    requirementCoverage: true,
    scopeCompliance: true,
    regressionRisk: true,
    security: true,
    architecture: true,
    codeQuality: true,
    duplication: true,
    unnecessaryAbstraction: true,
    accessibility: true,
    performance: true,
    visualConsistency: true,
    errorHandling: true
  };

  // 1. Scope Compliance Check
  if (input.scopeAudit && !input.scopeAudit.isClean) {
    checks.scopeCompliance = false;
    for (const v of input.scopeAudit.violations) {
      findings.push({
        severity: 'CRITICAL',
        category: 'SCOPE_GUARD',
        description: `Unapproved scope violation on file: ${v.file}`,
        suggestion: 'Revert unrequested file modification to satisfy scope boundaries.'
      });
    }
  }

  // 2. Security Check
  if (input.securityFindings && input.securityFindings.length > 0) {
    const hasCritical = input.securityFindings.some(f => f.severity === 'CRITICAL' || f.severity === 'HIGH');
    if (hasCritical) {
      checks.security = false;
    }
    for (const f of input.securityFindings) {
      findings.push({
        severity: f.severity,
        category: 'SECURITY',
        description: f.title,
        suggestion: 'Remediate vulnerability before releasing changes.'
      });
    }
    evidenceInspected.push('SECURITY_REPORT');
  }

  // Check diff for dangerous constructs (eval, dangerouslySetInnerHTML without sanitize, raw sql)
  if (input.diffContent) {
    if (/\beval\s*\(/.test(input.diffContent)) {
      checks.security = false;
      findings.push({
        severity: 'CRITICAL',
        category: 'SECURITY',
        description: 'Dangerous eval() usage detected in diff.',
        suggestion: 'Replace dynamic eval with safe structured evaluation.'
      });
    }
    if (/dangerouslySetInnerHTML/i.test(input.diffContent) && !/DOMPurify|sanitize/i.test(input.diffContent)) {
      checks.security = false;
      findings.push({
        severity: 'HIGH',
        category: 'SECURITY',
        description: 'Unsanitized dangerouslySetInnerHTML introduces XSS risk.',
        suggestion: 'Sanitize markup using DOMPurify before injection.'
      });
    }
    if (/SELECT\s+.*\s+FROM\s+.*\+\s*['"]?[a-zA-Z]/i.test(input.diffContent)) {
      checks.security = false;
      findings.push({
        severity: 'CRITICAL',
        category: 'SECURITY',
        description: 'Potential raw SQL string concatenation detected.',
        suggestion: 'Use parameterized queries or ORM bindings.'
      });
    }
  }

  // 3. Test & Verification Output
  if (input.testsPassed === false) {
    checks.regressionRisk = false;
    findings.push({
      severity: 'CRITICAL',
      category: 'TEST_FAILURE',
      description: 'One or more unit or integration tests failed in verification.',
      suggestion: 'Fix failing test cases before re-submitting for review.'
    });
  }
  if (input.testOutput) evidenceInspected.push('TEST_RESULT');

  // 4. Console & Runtime Errors
  if (input.consoleErrors && input.consoleErrors.length > 0) {
    checks.errorHandling = false;
    for (const err of input.consoleErrors) {
      findings.push({
        severity: 'HIGH',
        category: 'RUNTIME_CONSOLE_ERROR',
        description: `Browser console runtime error: ${err}`,
        suggestion: 'Inspect uncaught exception in Chrome DevTools inspector.'
      });
    }
    evidenceInspected.push('CONSOLE_LOG');
  }

  // 5. Network Failures
  if (input.networkErrors && input.networkErrors.length > 0) {
    checks.errorHandling = false;
    for (const netErr of input.networkErrors) {
      findings.push({
        severity: 'HIGH',
        category: 'NETWORK_FAILURE',
        description: `HTTP 4xx/5xx network failure: ${netErr}`,
        suggestion: 'Ensure API routes exist and request headers are valid.'
      });
    }
    evidenceInspected.push('NETWORK_TRACE');
  }

  // 6. Performance Metrics
  if (input.performanceMetrics) {
    evidenceInspected.push('PERFORMANCE_TRACE');
    if (input.performanceMetrics.lcpMs && input.performanceMetrics.lcpMs > 3500) {
      checks.performance = false;
      findings.push({
        severity: 'MEDIUM',
        category: 'PERFORMANCE',
        description: `Largest Contentful Paint (${input.performanceMetrics.lcpMs}ms) exceeds 3500ms budget.`,
        suggestion: 'Optimize hero asset loading and defer non-critical scripts.'
      });
    }
  }

  // 7. Code Quality & Duplication Inspection
  if (input.diffContent) {
    // Check for excessive console.log left in code
    const consoleLogMatches = (input.diffContent.match(/\+.*console\.log\(/g) || []).length;
    if (consoleLogMatches > 3) {
      checks.codeQuality = false;
      findings.push({
        severity: 'LOW',
        category: 'CODE_QUALITY',
        description: `Found ${consoleLogMatches} debugging console.log statements left in committed diff.`,
        suggestion: 'Remove temporary debugging statements or replace with structured logger.'
      });
    }

    // Check for TODO / FIXME leftovers
    const todoMatches = (input.diffContent.match(/\+.*\b(TODO|FIXME|HACK)\b/g) || []).length;
    if (todoMatches > 0) {
      findings.push({
        severity: 'INFO',
        category: 'CODE_QUALITY',
        description: `Diff contains ${todoMatches} new TODO/FIXME markers.`,
        suggestion: 'Track unfinished work in backlog or resolve before merge.'
      });
    }
  }

  // 8. Modernization-Specific Review Checks (Section 22)
  if (input.isModernizationTask) {
    evidenceInspected.push('MODERNIZATION_GOVERNANCE');

    // Behavior preservation
    if (input.behavioralRegressionAudit && !input.behavioralRegressionAudit.passed) {
      checks.regressionRisk = false;
      findings.push({
        severity: 'CRITICAL',
        category: 'BEHAVIORAL_REGRESSION',
        description: `Behavioral baseline broken: ${input.behavioralRegressionAudit.breaks.join('; ')}`,
        suggestion: 'Restore missing baseline routes, auth flows, and form actions before release.'
      });
    }

    // Preservation contract compliance
    if (input.preservationAudit && !input.preservationAudit.compliant) {
      checks.architecture = false;
      findings.push({
        severity: 'CRITICAL',
        category: 'PRESERVATION_CONTRACT_VIOLATION',
        description: `Preservation contract violated: ${input.preservationAudit.violations.join('; ')}`,
        suggestion: 'Ensure backend business logic, database, and auth invariants remain untouched.'
      });
    }

    // Unnecessary rewrite
    if (input.unnecessaryRewriteDetected) {
      checks.architecture = false;
      findings.push({
        severity: 'HIGH',
        category: 'UNNECESSARY_REWRITE',
        description: 'Unnecessary full rewrite detected where incremental adapter/bridge modernization was feasible.',
        suggestion: 'Adopt incremental component or shell modernization strategy instead of big-bang rewrite.'
      });
    }

    // Dependency creep
    if (input.dependencyCreepAudit?.hasUnjustifiedDeps) {
      checks.codeQuality = false;
      findings.push({
        severity: 'HIGH',
        category: 'DEPENDENCY_CREEP',
        description: `Dependency creep detected: Rejected unjustified dependencies: ${input.dependencyCreepAudit.rejectedDependencies.join(', ')}`,
        suggestion: 'Use existing project libraries or native CSS/JS instead of adding unjustified runtime packages.'
      });
    }

    // Truthful UI / Telemetry
    if (input.truthfulnessAudit && (!input.truthfulnessAudit.passed || input.truthfulnessAudit.fabricatedTelemetryDetected)) {
      checks.requirementCoverage = false;
      findings.push({
        severity: 'CRITICAL',
        category: 'TRUTHFUL_UI_VIOLATION',
        description: 'Truthful UI violation: Fabricated telemetry, status, or provenance-less KPI elements detected.',
        suggestion: 'Remove fake operational metrics and attach verified data provenance sources.'
      });
    }

    // Rollback feasibility
    if (input.rollbackPlanAttached === false) {
      checks.architecture = false;
      findings.push({
        severity: 'HIGH',
        category: 'ROLLBACK_INFEASIBILITY',
        description: 'Missing verified rollback checkpoint plan or rollback script in modernization plan.',
        suggestion: 'Attach git checkpoint tag and automated rollback instructions before proceeding.'
      });
    }

    // Human Visual Approval check
    if (input.humanVisualApprovalStatus && input.humanVisualApprovalStatus !== 'APPROVED' && (input.humanVisualApprovalStatus as string) !== 'NOT_APPLICABLE_SYNTHETIC_FIXTURE') {
      checks.visualConsistency = false;
      findings.push({
        severity: 'HIGH',
        category: 'HUMAN_VISUAL_APPROVAL_PENDING',
        description: `Visual release blocked: HUMAN_VISUAL_APPROVAL is ${input.humanVisualApprovalStatus}.`,
        suggestion: 'Obtain explicit human sign-off on design direction candidate before releasing modernization.'
      });
    }
  }

  // Determine Verdict
  let verdict: ReviewerVerdict;
  const criticalFindings = findings.filter(f => f.severity === 'CRITICAL');
  const highFindings = findings.filter(f => f.severity === 'HIGH');
  const mediumFindings = findings.filter(f => f.severity === 'MEDIUM');

  if (criticalFindings.length > 0) {
    verdict = 'REJECT';
  } else if (highFindings.length > 0) {
    verdict = 'REPAIR_REQUIRED';
  } else if (mediumFindings.length > 0) {
    verdict = 'APPROVE_WITH_WARNINGS';
  } else {
    verdict = 'APPROVE';
  }

  const summary = `Independent Review completed with verdict: ${verdict}. ${findings.length} finding(s) detected across ${evidenceInspected.length} evidence artifact(s).`;
  const recommendedAction =
    verdict === 'APPROVE'
      ? 'Changes are verified and ready for merge or deployment.'
      : verdict === 'APPROVE_WITH_WARNINGS'
      ? 'Approved for merge, but address non-blocking warnings in subsequent cleanup.'
      : verdict === 'REPAIR_REQUIRED'
      ? 'Block merge. Implement required fixes for high-severity findings and re-verify.'
      : 'Strict REJECT. Critical security, scope, or test failure must be resolved immediately.';

  return {
    verdict,
    summary,
    checks,
    findings,
    evidenceInspected,
    recommendedAction
  };
}
