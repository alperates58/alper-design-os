import {
  RankedSource,
  RecommendationExplanation,
  RecommendationExplanationSchema
} from './types.js';

export function explainRecommendation(
  ranked: RankedSource,
  productContext?: {
    domain?: string;
    density?: 'LOW' | 'MEDIUM' | 'HIGH';
    framework?: string;
  }
): RecommendationExplanation {
  const s = ranked.source;
  const bd = ranked.breakdown;

  const highlights: string[] = [];
  const caveats: string[] = [];

  // Evaluate strengths
  if (bd.domainCompatibility >= 0.8) {
    highlights.push(`High domain alignment (${(bd.domainCompatibility * 100).toFixed(0)}%) with ${productContext?.domain || 'target industry'} patterns.`);
  }
  if (bd.accessibility >= 0.85) {
    highlights.push(`Robust accessibility foundation verified at ${s.accessibilityLevel} standard.`);
  }
  if (bd.stackCompatibility >= 0.85) {
    highlights.push(`Native, first-class compatibility with ${productContext?.framework || s.frameworks.join('/')}.`);
  }
  if (s.strengths && s.strengths.length > 0) {
    highlights.push(`Key operational strengths: ${s.strengths.slice(0, 3).join(', ')}.`);
  }

  // Evaluate caveats
  if (s.popularity < 60) {
    caveats.push('Smaller community adoption; evaluate internal maintainability before extensive customization.');
  }
  if (s.license === 'GPL-3.0' || s.license.toLowerCase().includes('copyleft')) {
    caveats.push(`License is ${s.license}; ensure copyleft terms align with distribution model.`);
  }
  if (s.accessibilityLevel === 'PARTIAL' || s.accessibilityLevel === 'NOT_SPECIFIED') {
    caveats.push('Accessibility support is not fully certified; additional manual keyboard and screen reader auditing required.');
  }

  // Synthesize primary reason
  let primaryReason = `${s.name} is recommended with a composite score of ${ranked.compositeScore.toFixed(0)}/100.`;
  if (s.domains.some((d) => d.includes('ENTERPRISE') || d.includes('INDUSTRIAL'))) {
    primaryReason += ' It offers battle-tested high-density data tables and mission-critical accessibility guidelines.';
  } else if (s.type === 'HEADLESS_UI') {
    primaryReason += ' Its unstyled headless architecture guarantees total styling autonomy and zero design token collisions.';
  } else {
    primaryReason += ` It matches ${s.frameworks[0] || 'the'} stack with comprehensive component primitives.`;
  }

  const explanation: RecommendationExplanation = {
    sourceId: s.id,
    sourceName: s.name,
    compositeScore: ranked.compositeScore,
    primaryRecommendationReason: primaryReason,
    scoreBreakdown: {
      domainSuitability: bd.domainCompatibility,
      stackCompatibility: bd.stackCompatibility,
      accessibilityScore: bd.accessibility,
      maintenanceScore: bd.maintenance,
      trustScore: bd.trust
    },
    highlights: highlights.length > 0 ? highlights : ['Verified open-source repository and active documentation.'],
    caveats
  };

  RecommendationExplanationSchema.parse(explanation);
  return explanation;
}
