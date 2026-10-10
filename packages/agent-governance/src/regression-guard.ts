import {
  RegressionCheckResult,
  RegressionCheckResultSchema
} from './types.js';

export interface RegressionBaselineItem {
  id: string;
  type: 'ROUTE' | 'API_ENDPOINT' | 'DOM_SELECTOR' | 'COMPONENT' | 'DATABASE_INVARIANT';
  expectedValue?: any;
}

export interface RegressionInspectionTarget {
  id: string;
  type: 'ROUTE' | 'API_ENDPOINT' | 'DOM_SELECTOR' | 'COMPONENT' | 'DATABASE_INVARIANT';
  actualValue?: any;
}

export function detectRegressions(
  baselines: RegressionBaselineItem[],
  currentStates: RegressionInspectionTarget[]
): RegressionCheckResult {
  const regressionsDetected: RegressionCheckResult['regressionsDetected'] = [];

  for (const base of baselines) {
    const current = currentStates.find(c => c.id === base.id && c.type === base.type);

    if (!current) {
      regressionsDetected.push({
        target: `${base.type}:${base.id}`,
        baselineValue: base.expectedValue,
        currentValue: null,
        severity: 'HIGH',
        reason: `Baseline item missing completely after change.`
      });
      continue;
    }

    // Compare values
    const baseStr = JSON.stringify(base.expectedValue);
    const currStr = JSON.stringify(current.actualValue);

    if (baseStr !== currStr) {
      const severity = base.type === 'ROUTE' || base.type === 'DATABASE_INVARIANT' ? 'CRITICAL' : 'MEDIUM';
      regressionsDetected.push({
        target: `${base.type}:${base.id}`,
        baselineValue: base.expectedValue,
        currentValue: current.actualValue,
        severity,
        reason: `Value drifted from baseline. Expected: ${baseStr}, received: ${currStr}`
      });
    }
  }

  let status: RegressionCheckResult['status'];
  if (regressionsDetected.length === 0) {
    status = 'PASSED';
  } else if (regressionsDetected.some(r => r.severity === 'CRITICAL')) {
    status = 'FAILED';
  } else {
    status = 'REGRESSION_SUSPECTED';
  }

  const summary =
    status === 'PASSED'
      ? `All ${baselines.length} baseline check(s) preserved without regression.`
      : `${status}: Detected ${regressionsDetected.length} potential behavioral drift(s) against baseline.`;

  return RegressionCheckResultSchema.parse({
    status,
    regressionsDetected,
    summary
  });
}
