import {
  DesignCritiqueResult,
  DesignCritiqueResultSchema,
  DesignCriticDimension
} from './types.js';

export interface DesignCritiqueInput {
  markupOrCss: string;
  domain?: string;
  density?: string;
  hasEmptyStates?: boolean;
  hasLoadingStates?: boolean;
  hasErrorStates?: boolean;
}

export function critiqueDesign(input: DesignCritiqueInput): DesignCritiqueResult {
  const dimensions: DesignCriticDimension[] = [];
  const content = input.markupOrCss.toLowerCase();

  // 1. AI-Generated Generic Appearance Detection
  const hasPurpleGradients = /linear-gradient.*(?:#8a2be2|#7928ca|#ff0080|purple|violet)/i.test(input.markupOrCss);
  const hasGenericFloatingCards = /backdrop-blur|shadow-2xl.*rounded-3xl|shadow-neon/i.test(input.markupOrCss);
  const aiGenericSmellDetected = hasPurpleGradients || hasGenericFloatingCards;

  if (aiGenericSmellDetected) {
    dimensions.push({
      category: 'AI_GENERIC_APPEARANCE',
      rating: 'POOR',
      observation: 'Detected generic AI aesthetic tropes (excessive glowing neon gradients, bubbly rounded cards, darkmode blur).',
      recommendations: [
        'Replace decorative AI purple gradients with purpose-driven domain tokens and semantic status colors.',
        'Use crisp, functional borders rather than heavy diffuse drop-shadows in enterprise tools.'
      ],
      isSubjective: true
    });
  } else {
    dimensions.push({
      category: 'AI_GENERIC_APPEARANCE',
      rating: 'EXCELLENT',
      observation: 'Clean, professional presentation without generic decorative AI gimmicks.',
      recommendations: [],
      isSubjective: true
    });
  }

  // 2. Visual & Information Hierarchy
  const hasHeadings = /<h1|<h2|<h3|\.heading|\.title/i.test(input.markupOrCss);
  dimensions.push({
    category: 'VISUAL_HIERARCHY',
    rating: hasHeadings ? 'EXCELLENT' : 'NEEDS_WORK',
    observation: hasHeadings
      ? 'Clear typographic heading scale established.'
      : 'Flat visual hierarchy; lacks distinct font sizes or weights for section headers.',
    recommendations: hasHeadings ? [] : ['Introduce distinct heading weights (H1/H2) to guide eye flow.'],
    isSubjective: true
  });

  // 3. Spacing Rhythm & Alignment
  const hasGridOrFlex = /display:\s*(?:grid|flex)|flex\s+|grid-cols/i.test(input.markupOrCss);
  dimensions.push({
    category: 'SPACING_RHYTHM',
    rating: hasGridOrFlex ? 'EXCELLENT' : 'NEEDS_WORK',
    observation: hasGridOrFlex
      ? 'Consistent alignment using CSS Grid/Flexbox spatial rhythm.'
      : 'Ad-hoc margins and positioning without an underlying layout grid.',
    recommendations: hasGridOrFlex ? [] : ['Adopt standard 4px/8px spacing grid tokens.'],
    isSubjective: true
  });

  // 4. Density & Efficiency
  const isIndustrial = input.domain === 'INDUSTRIAL_OPERATIONAL';
  const hasSpaciousPadding = /padding:\s*(?:24px|32px|40px)|p-8|p-10/i.test(input.markupOrCss);
  if (isIndustrial && hasSpaciousPadding) {
    dimensions.push({
      category: 'DENSITY',
      rating: 'NEEDS_WORK',
      observation: 'Excessive whitespace in an industrial operational dashboard limits visible data capacity.',
      recommendations: ['Compact table rows and toolbar padding to achieve High/Extreme density for shift operators.'],
      isSubjective: false // Grounded in domain requirement
    });
  } else {
    dimensions.push({
      category: 'DENSITY',
      rating: 'ADEQUATE',
      observation: 'Spacing density is commensurate with the target user context.',
      recommendations: [],
      isSubjective: true
    });
  }

  // 5. State Handling (Empty, Loading, Error)
  const emptyStateTested = input.hasEmptyStates ?? /empty-state|no-data|no\s+records/i.test(content);
  dimensions.push({
    category: 'EMPTY_STATES',
    rating: emptyStateTested ? 'EXCELLENT' : 'NEEDS_WORK',
    observation: emptyStateTested
      ? 'Dedicated empty state markup or illustrations present.'
      : 'Missing empty state handling for zero-data scenarios.',
    recommendations: emptyStateTested ? [] : ['Add clear zero-data prompt with actionable call-to-action.'],
    isSubjective: false
  });

  const loadingStateTested = input.hasLoadingStates ?? /spinner|skeleton|is-loading|loading/i.test(content);
  dimensions.push({
    category: 'LOADING_STATES',
    rating: loadingStateTested ? 'EXCELLENT' : 'NEEDS_WORK',
    observation: loadingStateTested
      ? 'Skeleton loaders or progress indicators present.'
      : 'Lacks perceived performance indicators during async fetching.',
    recommendations: loadingStateTested ? [] : ['Implement skeleton layout to eliminate layout shifts during data loading.'],
    isSubjective: false
  });

  const errorStateTested = input.hasErrorStates ?? /error-banner|is-invalid|alert-danger/i.test(content);
  dimensions.push({
    category: 'ERROR_STATES',
    rating: errorStateTested ? 'EXCELLENT' : 'NEEDS_WORK',
    observation: errorStateTested
      ? 'Structured error presentation with recovery actions.'
      : 'No inline error messaging or validation feedback detected.',
    recommendations: errorStateTested ? [] : ['Provide contextual error banners with clear retry triggers.'],
    isSubjective: false
  });

  // Score calculation
  const scoreMap = { EXCELLENT: 25, ADEQUATE: 18, NEEDS_WORK: 10, POOR: 0 };
  const totalScore = dimensions.reduce((acc, d) => acc + scoreMap[d.rating], 0);
  const maxScore = dimensions.length * 25;
  const overallScore = Math.round((totalScore / maxScore) * 100);

  const passed = overallScore >= 65 && !aiGenericSmellDetected;
  const actionableTweaks = dimensions.flatMap(d => d.recommendations);

  const critiqueSummary = `Design Critique Score: ${overallScore}/100. ${
    aiGenericSmellDetected ? 'Warning: Generic AI design smell detected. ' : ''
  }${actionableTweaks.length} visual/ergonomic recommendations provided.`;

  return DesignCritiqueResultSchema.parse({
    overallScore,
    passed,
    aiGenericSmellDetected,
    dimensions,
    critiqueSummary,
    actionableTweaks
  });
}
