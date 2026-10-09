import {
  AuditFinding,
  ReleaseGateEvaluation,
  ReleaseGateEvaluationSchema,
  ReleaseGatePolicy
} from './types.js';

export function evaluateReleaseGates(
  findings: AuditFinding[],
  policy: ReleaseGatePolicy,
  criticalTestsFailed: boolean = false
): ReleaseGateEvaluation {
  const blockers: AuditFinding[] = [];
  const warnings: AuditFinding[] = [];
  const passedGates: string[] = [];
  const failedGates: string[] = [];

  // Gate 1: Failed Critical Tests
  if (criticalTestsFailed && policy.blockOnFailedCriticalTests) {
    failedGates.push('GATE_CRITICAL_TESTS');
    blockers.push({
      id: 'gate-failed-tests',
      category: 'TESTING',
      severity: 'CRITICAL',
      title: 'Critical Test Suite Failed',
      description: 'One or more mandatory unit/integration/E2E test suites failed.',
      tool: 'test-runner',
      remediation: 'Investigate and resolve failing tests before releasing.'
    });
  } else {
    passedGates.push('GATE_CRITICAL_TESTS');
  }

  // Iterate findings across categories
  for (const finding of findings) {
    // Secret Detected Gate
    if (finding.category === 'SECRET') {
      if (policy.blockOnSecretDetected) {
        if (!failedGates.includes('GATE_SECRET_SCAN')) failedGates.push('GATE_SECRET_SCAN');
        blockers.push(finding);
      } else {
        warnings.push(finding);
      }
      continue;
    }

    // Exploitable Dependency Gate
    if (finding.category === 'SUPPLY_CHAIN' && (finding.severity === 'CRITICAL' || finding.severity === 'HIGH')) {
      if (policy.blockOnExploitableDependency) {
        if (!failedGates.includes('GATE_SUPPLY_CHAIN')) failedGates.push('GATE_SUPPLY_CHAIN');
        blockers.push(finding);
      } else {
        warnings.push(finding);
      }
      continue;
    }

    // General Security Severity Gates
    if (finding.severity === 'CRITICAL') {
      if (policy.blockOnCriticalSecurity) {
        if (!failedGates.includes('GATE_CRITICAL_SECURITY')) failedGates.push('GATE_CRITICAL_SECURITY');
        blockers.push(finding);
      } else {
        warnings.push(finding);
      }
    } else if (finding.severity === 'HIGH') {
      if (policy.blockOnHighSecurity) {
        if (!failedGates.includes('GATE_HIGH_SECURITY')) failedGates.push('GATE_HIGH_SECURITY');
        blockers.push(finding);
      } else {
        warnings.push(finding);
      }
    } else if (finding.severity === 'MEDIUM') {
      if (policy.mediumSecurityAction === 'BLOCK') {
        if (!failedGates.includes('GATE_MEDIUM_SECURITY')) failedGates.push('GATE_MEDIUM_SECURITY');
        blockers.push(finding);
      } else {
        warnings.push(finding);
      }
    } else {
      // LOW / INFO
      if (policy.lowSecurityAction === 'BLOCK') {
        blockers.push(finding);
      } else {
        warnings.push(finding);
      }
    }
  }

  if (!failedGates.includes('GATE_SECRET_SCAN')) passedGates.push('GATE_SECRET_SCAN');
  if (!failedGates.includes('GATE_SUPPLY_CHAIN')) passedGates.push('GATE_SUPPLY_CHAIN');
  if (!failedGates.includes('GATE_CRITICAL_SECURITY')) passedGates.push('GATE_CRITICAL_SECURITY');
  if (!failedGates.includes('GATE_HIGH_SECURITY')) passedGates.push('GATE_HIGH_SECURITY');

  const passed = blockers.length === 0;
  const decision = passed ? (warnings.length > 0 ? 'WARN' : 'PASS') : 'BLOCK';

  const summary = passed
    ? `Release Gate PASSED with ${warnings.length} non-blocking warnings.`
    : `Release Gate BLOCKED: ${blockers.length} critical policy violation(s) identified. Immediate remediation required.`;

  const result: ReleaseGateEvaluation = {
    passed,
    decision,
    summary,
    blockers,
    warnings,
    passedGates,
    failedGates
  };

  return ReleaseGateEvaluationSchema.parse(result);
}
