import {
  PolicyLevel,
  ConflictResult,
  ConflictResultSchema
} from './types.js';

const POLICY_WEIGHTS: Record<PolicyLevel, number> = {
  USER_EXPLICIT_REQUIREMENT: 100,
  SECURITY_DATA_SAFETY: 90,
  PROJECT_RULES: 80,
  ALPER_DESIGN_OS_RULES: 70,
  FRAMEWORK_BEST_PRACTICES: 60,
  OPTIONAL_RECOMMENDATIONS: 50
};

export interface PolicyRuleStatement {
  policyLevel: PolicyLevel;
  ruleId: string;
  statement: string;
  source?: string;
}

export function resolvePolicyConflict(
  ruleA: PolicyRuleStatement,
  ruleB: PolicyRuleStatement
): ConflictResult {
  const weightA = POLICY_WEIGHTS[ruleA.policyLevel];
  const weightB = POLICY_WEIGHTS[ruleB.policyLevel];

  // Special constraint: User requirement cannot override critical security/data safety
  // e.g. User says "disable CSRF token check everywhere" -> Security policy prevails
  if (
    (ruleA.policyLevel === 'USER_EXPLICIT_REQUIREMENT' && ruleB.policyLevel === 'SECURITY_DATA_SAFETY') ||
    (ruleB.policyLevel === 'USER_EXPLICIT_REQUIREMENT' && ruleA.policyLevel === 'SECURITY_DATA_SAFETY')
  ) {
    const securityRule = ruleA.policyLevel === 'SECURITY_DATA_SAFETY' ? ruleA : ruleB;
    const userRule = ruleA.policyLevel === 'USER_EXPLICIT_REQUIREMENT' ? ruleA : ruleB;

    return ConflictResultSchema.parse({
      conflictDetected: true,
      higherPolicy: 'SECURITY_DATA_SAFETY',
      lowerPolicy: 'USER_EXPLICIT_REQUIREMENT',
      winningPolicy: 'SECURITY_DATA_SAFETY',
      resolution: `Security and Data Safety rule '${securityRule.ruleId}' overrides user request '${userRule.ruleId}'. Data integrity and vulnerability prevention take absolute precedence.`
    });
  }

  if (weightA > weightB) {
    return ConflictResultSchema.parse({
      conflictDetected: true,
      higherPolicy: ruleA.policyLevel,
      lowerPolicy: ruleB.policyLevel,
      winningPolicy: ruleA.policyLevel,
      resolution: `Higher priority rule '${ruleA.ruleId}' (${ruleA.policyLevel}) supersedes lower rule '${ruleB.ruleId}' (${ruleB.policyLevel}).`
    });
  }

  if (weightB > weightA) {
    return ConflictResultSchema.parse({
      conflictDetected: true,
      higherPolicy: ruleB.policyLevel,
      lowerPolicy: ruleA.policyLevel,
      winningPolicy: ruleB.policyLevel,
      resolution: `Higher priority rule '${ruleB.ruleId}' (${ruleB.policyLevel}) supersedes lower rule '${ruleA.ruleId}' (${ruleA.policyLevel}).`
    });
  }

  // Equal weights
  return ConflictResultSchema.parse({
    conflictDetected: true,
    higherPolicy: ruleA.policyLevel,
    lowerPolicy: ruleB.policyLevel,
    winningPolicy: ruleA.policyLevel,
    resolution: `Rules have identical priority (${ruleA.policyLevel}). Defaulting to safer, least-destructive policy: ${ruleA.ruleId}.`
  });
}
