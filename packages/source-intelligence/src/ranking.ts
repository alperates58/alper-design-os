import {
  defaultRankingWeights,
  RankedSource,
  RankingScoreBreakdown,
  RankingWeights,
  SourceMetadata
} from './types.js';

export interface ScoreContext {
  targetFramework?: string;
  targetDomain?: string;
  weights?: Partial<RankingWeights>;
  requirePermissiveLicense?: boolean;
}

export function scoreSource(source: SourceMetadata, context: ScoreContext = {}): RankedSource {
  const weights: RankingWeights = { ...defaultRankingWeights, ...context.weights };
  const matchReasons: string[] = [];

  // 1. Trust Score (0-100)
  const trustScore = source.trustScore;

  // 2. Documentation Quality Score (0-100)
  let documentationScore = 65;
  if (source.documentationQuality === 'EXEMPLARY') {
    documentationScore = 100;
    matchReasons.push('Exemplary documentation quality');
  } else if (source.documentationQuality === 'HIGH') {
    documentationScore = 85;
  } else if (source.documentationQuality === 'MEDIUM') {
    documentationScore = 65;
  } else {
    documentationScore = 35;
  }

  // 3. Accessibility Score (0-100)
  let accessibilityScore = 40;
  if (source.accessibilityLevel === 'WCAG_2_1_AAA') {
    accessibilityScore = 100;
    matchReasons.push('Strict WCAG 2.1 AAA accessibility compliance');
  } else if (source.accessibilityLevel === 'WCAG_2_1_AA') {
    accessibilityScore = 90;
    matchReasons.push('Production WCAG 2.1 AA accessibility baseline');
  } else if (source.accessibilityLevel === 'PARTIAL') {
    accessibilityScore = 55;
  } else {
    accessibilityScore = 40;
  }

  // 4. Maintenance & Maturity Score (0-100)
  let maintenanceScore = 60;
  if (source.maturity === 'MATURE') {
    maintenanceScore = 95;
  } else if (source.maturity === 'STABLE') {
    maintenanceScore = 90;
  } else if (source.maturity === 'BETA') {
    maintenanceScore = 70;
  } else if (source.maturity === 'EXPERIMENTAL') {
    maintenanceScore = 45;
  } else if (source.maturity === 'DEPRECATED') {
    maintenanceScore = 10;
  }

  // 5. Stack Compatibility Score (0-100)
  let stackCompatibilityScore = 100;
  if (context.targetFramework) {
    const target = context.targetFramework.toLowerCase();
    const isAgnostic = source.frameworks.some((f) => f.toLowerCase().includes('agnostic'));
    const isExactMatch = source.frameworks.some((f) => f.toLowerCase().includes(target)) ||
      source.technologies.some((t) => t.toLowerCase().includes(target));

    if (isExactMatch) {
      stackCompatibilityScore = 100;
      matchReasons.push(`Direct native compatibility with ${context.targetFramework}`);
    } else if (isAgnostic || source.technologies.some((t) => t.includes('CSS') || t.includes('Tokens'))) {
      stackCompatibilityScore = 80;
      matchReasons.push(`Framework-agnostic integration possible for ${context.targetFramework}`);
    } else {
      stackCompatibilityScore = 30;
    }
  }

  // 6. Domain Compatibility Score (0-100)
  let domainCompatibilityScore = 100;
  if (context.targetDomain) {
    const domainTarget = context.targetDomain.toUpperCase();
    const isGlobal = source.domains.includes('GLOBAL_WEB');
    const isDirectDomainMatch = source.domains.includes(domainTarget);

    if (isDirectDomainMatch) {
      domainCompatibilityScore = 100;
      matchReasons.push(`Proven strengths in ${context.targetDomain}`);
    } else if (isGlobal || source.domains.includes('B2B_ENTERPRISE')) {
      domainCompatibilityScore = 75;
    } else {
      domainCompatibilityScore = 40;
    }
  }

  // 7. License Compatibility Score (0-100)
  let licenseCompatibilityScore = 70;
  const lic = source.license.toUpperCase();
  const isPermissive =
    lic.includes('MIT') ||
    lic.includes('APACHE') ||
    lic.includes('ISC') ||
    lic.includes('CC0') ||
    lic.includes('BSD');

  if (isPermissive) {
    licenseCompatibilityScore = 100;
  } else if (lic.includes('W3C') || lic.includes('OFL')) {
    licenseCompatibilityScore = 90;
  } else if (lic.includes('GPL') || lic.includes('MPL')) {
    licenseCompatibilityScore = 55;
  } else {
    licenseCompatibilityScore = 30;
  }

  // Compute Weighted Final Score
  const totalWeight =
    weights.trust +
    weights.documentation +
    weights.accessibility +
    weights.maintenance +
    weights.stackCompatibility +
    weights.domainCompatibility +
    weights.licenseCompatibility;

  const weightedSum =
    trustScore * weights.trust +
    documentationScore * weights.documentation +
    accessibilityScore * weights.accessibility +
    maintenanceScore * weights.maintenance +
    stackCompatibilityScore * weights.stackCompatibility +
    domainCompatibilityScore * weights.domainCompatibility +
    licenseCompatibilityScore * weights.licenseCompatibility;

  const finalWeightedScore = Math.round((weightedSum / totalWeight) * 10) / 10;

  const scoreBreakdown: RankingScoreBreakdown = {
    trustScore,
    documentationScore,
    accessibilityScore,
    maintenanceScore,
    stackCompatibilityScore,
    domainCompatibilityScore,
    licenseCompatibilityScore,
    finalWeightedScore
  };

  return {
    source,
    scoreBreakdown,
    compositeScore: finalWeightedScore,
    breakdown: {
      trust: trustScore,
      documentation: documentationScore,
      accessibility: accessibilityScore,
      maintenance: maintenanceScore,
      stackCompatibility: stackCompatibilityScore,
      domainCompatibility: domainCompatibilityScore,
      licenseCompatibility: licenseCompatibilityScore
    },
    matchReasons
  };
}

export function rankSources(sources: SourceMetadata[], context: ScoreContext = {}): RankedSource[] {
  let filtered = sources;

  if (context.requirePermissiveLicense) {
    filtered = filtered.filter((s) => s.codeReuseAllowed && s.modificationAllowed);
  }

  const scored = filtered.map((s) => scoreSource(s, context));
  return scored.sort((a, b) => b.scoreBreakdown.finalWeightedScore - a.scoreBreakdown.finalWeightedScore);
}
