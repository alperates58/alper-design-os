import {
  ChangeRiskLevel,
  RiskFactors,
  RiskAssessment
} from './types.js';

export function evaluateChangeRisk(factors: Partial<RiskFactors> & { fileCount?: number }): RiskAssessment {
  const normalizedFactors: RiskFactors = {
    fileCount: factors.fileCount ?? 1,
    architectureImpact: factors.architectureImpact ?? false,
    databaseImpact: factors.databaseImpact ?? false,
    authenticationImpact: factors.authenticationImpact ?? false,
    authorizationImpact: factors.authorizationImpact ?? false,
    publicApiImpact: factors.publicApiImpact ?? false,
    dependencyImpact: factors.dependencyImpact ?? false,
    configurationImpact: factors.configurationImpact ?? false,
    deploymentImpact: factors.deploymentImpact ?? false,
    dataLossPossibility: factors.dataLossPossibility ?? false
  };

  let score = 0;
  const reasons: string[] = [];
  const recommendedSafeguards: string[] = [];

  // File count weights
  if (normalizedFactors.fileCount > 15) {
    score += 35;
    reasons.push(`High file volume: modifying ${normalizedFactors.fileCount} files`);
  } else if (normalizedFactors.fileCount > 6) {
    score += 20;
    reasons.push(`Moderate file volume: modifying ${normalizedFactors.fileCount} files`);
  } else if (normalizedFactors.fileCount > 2) {
    score += 10;
  } else {
    score += 5;
  }

  // Critical architectural factors
  if (normalizedFactors.dataLossPossibility) {
    score += 50;
    reasons.push('Data loss possibility: destructive migrations, table alterations or file deletions');
    recommendedSafeguards.push('Mandatory database backup before proceeding');
  }

  if (normalizedFactors.authenticationImpact) {
    score += 30;
    reasons.push('Authentication impact: touches login, session handling, or credentials');
    recommendedSafeguards.push('Independent security review of auth flows');
  }

  if (normalizedFactors.authorizationImpact) {
    score += 25;
    reasons.push('Authorization impact: touches RBAC, role checks, or permissions');
    recommendedSafeguards.push('Verify permissions matrix against unprivileged roles');
  }

  if (normalizedFactors.databaseImpact) {
    score += 25;
    reasons.push('Database impact: changes schemas, queries, or persistence layer');
    recommendedSafeguards.push('Dry-run migrations and verify transaction rollback');
  }

  if (normalizedFactors.publicApiImpact) {
    score += 20;
    reasons.push('Public API impact: modifies public contracts or endpoints');
    recommendedSafeguards.push('Run API contract backward-compatibility check');
  }

  if (normalizedFactors.architectureImpact) {
    score += 20;
    reasons.push('Architecture impact: alters module boundaries or core dependencies');
    recommendedSafeguards.push('Verify architectural dependency cycle check');
  }

  if (normalizedFactors.dependencyImpact) {
    score += 15;
    reasons.push('Dependency impact: updates or adds third-party packages');
    recommendedSafeguards.push('Audit supply-chain vulnerability advisory lists');
  }

  if (normalizedFactors.configurationImpact) {
    score += 15;
    reasons.push('Configuration impact: modifies environment or appsettings');
    recommendedSafeguards.push('Run secret redaction and env var validation');
  }

  if (normalizedFactors.deploymentImpact) {
    score += 15;
    reasons.push('Deployment impact: modifies CI/CD or container orchestrations');
    recommendedSafeguards.push('Test build and deployment pipeline in isolated sandbox');
  }

  // Cap score at 100
  score = Math.min(100, score);

  let overallRisk: ChangeRiskLevel;
  if (score >= 70 || normalizedFactors.dataLossPossibility || (normalizedFactors.authenticationImpact && normalizedFactors.databaseImpact)) {
    overallRisk = 'CRITICAL';
  } else if (score >= 45 || normalizedFactors.authenticationImpact || normalizedFactors.databaseImpact || normalizedFactors.fileCount > 15) {
    overallRisk = 'HIGH';
  } else if (score >= 20 || normalizedFactors.fileCount > 3) {
    overallRisk = 'MEDIUM';
  } else {
    overallRisk = 'LOW';
  }

  const mandatoryCheckpoint = overallRisk === 'HIGH' || overallRisk === 'CRITICAL';
  const requiresApproval = overallRisk === 'HIGH' || overallRisk === 'CRITICAL';

  if (mandatoryCheckpoint) {
    recommendedSafeguards.unshift('Mandatory Git checkpoint commit or temporary branch before modifying files');
  }

  return {
    overallRisk,
    score,
    factors: normalizedFactors,
    reasons: reasons.length > 0 ? reasons : ['Low-risk targeted cosmetic or localized change'],
    mandatoryCheckpoint,
    requiresApproval,
    recommendedSafeguards
  };
}
