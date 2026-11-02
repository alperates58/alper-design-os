import { DesignIntent, ProductType, DesignPersonality } from './types.js';
import { computeDesignPersonality } from './design-personality.js';

export interface DomainProfile {
  id: string;
  name: string;
  productType: ProductType;
  description: string;
  intent: DesignIntent;
  personality: DesignPersonality;
  layoutArchetype: 'WORKBENCH_MULTI_PANE' | 'FINANCIAL_LEDGER' | 'COMMERCE_CATALOG' | 'MEDIA_CANVAS';
  density: 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';
  recommendedComponents: string[];
  antiPatternStrictness: 'STRICT_ZERO_FLUFF' | 'HIGH' | 'BALANCED';
  colorPalettePhilosophy: string;
}

export const CANONICAL_DOMAIN_PROFILES: Record<string, DomainProfile> = {
  INDUSTRIAL_OPERATIONS: {
    id: 'industrial-operations',
    name: 'Enterprise Industrial Operations UI',
    productType: 'INDUSTRIAL_OPERATIONS',
    description: 'Precision manufacturing, advanced planning & scheduling (APS), MES, shop-floor and machine telemetry. Zero decorative fluff, extreme data density, full widescreen workbench, tabular production orders, finite capacity Gantt.',
    intent: {
      productType: 'INDUSTRIAL_OPERATIONS',
      userExpertise: 'EXPERT',
      usageFrequency: 'CONTINUOUS_INTENSIVE',
      sessionDuration: 'LONG_EXTENDED',
      informationDensity: 'COMPACT',
      interactionIntensity: 'KEYBOARD_POWER',
      devicePriority: 'DESKTOP_FIRST',
      taskCriticality: 'MISSION_CRITICAL',
      errorCost: 'CATASTROPHIC',
      brandCharacter: 'TECHNICAL',
      visualEmphasis: 'DATA_FIRST',
      motionTolerance: 'REDUCED',
      accessibilityNeeds: 'STANDARD_AA',
      decisionPrinciples: [
        'Density over decoration: operators need 20+ rows per screen, not 4 cards',
        'Tabular alignment and monospace numbers for quantities, runtimes, and tolerances',
        'Zero neon glow, zero gratuitous gradients: use high-contrast solid slate surfaces and precise status accents',
        'Full-width workbench layout: never constrain widescreen shop-floor displays with artificial max-w-7xl'
      ]
    },
    personality: {
      reservedToExpressive: -70,
      compactToSpacious: -85,
      technicalToEditorial: -90,
      neutralToBranded: -60,
      flatToLayered: -50,
      staticToAnimated: -60,
      rationale: 'Industrial shop-floor ergonomics: maximum data scanability, fast keyboard operations, machine timeline visualization.'
    },
    layoutArchetype: 'WORKBENCH_MULTI_PANE',
    density: 'COMPACT',
    recommendedComponents: [
      'EnterpriseAppShell',
      'EnterpriseDataGrid',
      'GanttCapacityTimeline',
      'EnterpriseToolbar',
      'EnterpriseDrawer',
      'EnterpriseStatusBadge'
    ],
    antiPatternStrictness: 'STRICT_ZERO_FLUFF',
    colorPalettePhilosophy: 'Slate-950 canvas, Slate-900 surface, 1px Slate-800 borders, Sky-400 primary technical accent, Emerald-400 on-time status, Amber-400 warning, Rose-500 delay risk.'
  },

  FINANCE_DATA_HEAVY: {
    id: 'finance-data-heavy',
    name: 'Finance / Data-Heavy UI',
    productType: 'FINANCE_DATA_HEAVY',
    description: 'Corporate ledger, accounting, ERP financials, transaction reconciliation and portfolio analysis. Tabular lining numbers, dual-entry verification, audit trails, dense multi-field filters.',
    intent: {
      productType: 'FINANCE_DATA_HEAVY',
      userExpertise: 'EXPERT',
      usageFrequency: 'DAILY_FREQUENT',
      sessionDuration: 'LONG_EXTENDED',
      informationDensity: 'COMPACT',
      interactionIntensity: 'INPUT_INTENSIVE',
      devicePriority: 'DESKTOP_FIRST',
      taskCriticality: 'HIGH',
      errorCost: 'SIGNIFICANT',
      brandCharacter: 'AUTHORITATIVE',
      visualEmphasis: 'DATA_FIRST',
      motionTolerance: 'SUBTLE',
      accessibilityNeeds: 'STANDARD_AA',
      decisionPrinciples: [
        'Numerical precision: right-aligned monospace tabular numbers with decimal lining',
        'Auditability: every balance and reconciliation step must have a traceable provenance drawer',
        'High information density: multi-column sortable ledgers with batch actions'
      ]
    },
    personality: {
      reservedToExpressive: -80,
      compactToSpacious: -80,
      technicalToEditorial: -95,
      neutralToBranded: -60,
      flatToLayered: -40,
      staticToAnimated: -40,
      rationale: 'Financial precision: strict tabular alignment, right-aligned currencies, minimal decorative distraction.'
    },
    layoutArchetype: 'FINANCIAL_LEDGER',
    density: 'COMPACT',
    recommendedComponents: [
      'EnterpriseAppShell',
      'EnterpriseDataGrid',
      'EnterpriseToolbar',
      'EnterpriseDrawer',
      'EnterpriseModal',
      'EnterpriseCommandPalette'
    ],
    antiPatternStrictness: 'STRICT_ZERO_FLUFF',
    colorPalettePhilosophy: 'Neutral zinc/slate base, Emerald-400 credit, Rose-400 debit, Indigo-400 reconciliation accent.'
  },

  COMMERCE: {
    id: 'commerce',
    name: 'Commerce UI',
    productType: 'COMMERCE',
    description: 'B2B/B2C catalog, e-commerce ordering, inventory storefront and customer checkout. Balanced density, visual product imagery, faceted attribute filters, prominent conversion actions.',
    intent: {
      productType: 'COMMERCE',
      userExpertise: 'INTERMEDIATE',
      usageFrequency: 'PERIODIC',
      sessionDuration: 'MEDIUM',
      informationDensity: 'COMFORTABLE',
      interactionIntensity: 'BALANCED',
      devicePriority: 'BALANCED_RESPONSIVE',
      taskCriticality: 'MEDIUM',
      errorCost: 'LOW',
      brandCharacter: 'FRIENDLY',
      visualEmphasis: 'CONTENT_FIRST',
      motionTolerance: 'EXPRESSIVE',
      accessibilityNeeds: 'STANDARD_AA',
      decisionPrinciples: [
        'Visual hierarchy with clear product aspect ratios and pricing badges',
        'Faceted filters with instant search and attribute pills',
        'Streamlined multi-step checkout drawer with clear total breakdowns'
      ]
    },
    personality: {
      reservedToExpressive: +50,
      compactToSpacious: +30,
      technicalToEditorial: +40,
      neutralToBranded: +60,
      flatToLayered: +40,
      staticToAnimated: +40,
      rationale: 'Commerce conversion: appealing visual cards, clear pricing contrast, responsive drawer checkout.'
    },
    layoutArchetype: 'COMMERCE_CATALOG',
    density: 'COMFORTABLE',
    recommendedComponents: [
      'EnterpriseAppShell',
      'ProductCatalogGrid',
      'FacetedFilterSidebar',
      'CartDrawer',
      'EnterpriseModal'
    ],
    antiPatternStrictness: 'HIGH',
    colorPalettePhilosophy: 'Clean light or deep slate surface, vibrant brand primary accent, high-contrast price badges.'
  },

  MEDIA_FIRST: {
    id: 'media-first',
    name: 'Media-First UI',
    productType: 'MEDIA_FIRST',
    description: 'Digital asset management, media editing, video/audio timeline playback and visual asset catalog. Dark neutral canvas, asset inspector sidebar, media player controls.',
    intent: {
      productType: 'MEDIA_FIRST',
      userExpertise: 'INTERMEDIATE',
      usageFrequency: 'DAILY_FREQUENT',
      sessionDuration: 'LONG_EXTENDED',
      informationDensity: 'COMFORTABLE',
      interactionIntensity: 'BALANCED',
      devicePriority: 'DESKTOP_FIRST',
      taskCriticality: 'MEDIUM',
      errorCost: 'LOW',
      brandCharacter: 'TECHNICAL',
      visualEmphasis: 'CONTENT_FIRST',
      motionTolerance: 'EXPRESSIVE',
      accessibilityNeeds: 'STANDARD_AA',
      decisionPrinciples: [
        'Dark neutral backdrop to ensure unskewed color fidelity of media assets',
        'Collapsible metadata inspector drawer for file properties and tags',
        'Smooth timeline scrubber and media player keyboard hotkeys'
      ]
    },
    personality: {
      reservedToExpressive: +30,
      compactToSpacious: +10,
      technicalToEditorial: +10,
      neutralToBranded: 0,
      flatToLayered: -20,
      staticToAnimated: +50,
      rationale: 'Media showcase: neutral dark canvas, asset focus, fluid timeline scrubbing.'
    },
    layoutArchetype: 'MEDIA_CANVAS',
    density: 'COMFORTABLE',
    recommendedComponents: [
      'EnterpriseAppShell',
      'MediaCanvasView',
      'AssetInspectorDrawer',
      'TimelineScrubber',
      'EnterpriseToolbar'
    ],
    antiPatternStrictness: 'HIGH',
    colorPalettePhilosophy: 'Deep neutral gray/black canvas (rgb(15,15,18)), neutral accents, high-contrast scrubber.'
  }
};

/**
 * Classifies a project's prompt, name, or description into an appropriate canonical domain.
 */
export function classifyProjectDomain(nameOrPrompt: string, description: string = ''): DomainProfile {
  const combined = (nameOrPrompt + ' ' + description).toLowerCase();

  // 1. Industrial Operations / APS / Manufacturing / Factory
  if (
    combined.includes('üretim') ||
    combined.includes('planlama') ||
    combined.includes('aps') ||
    combined.includes('çizelgeleme') ||
    combined.includes('fabrika') ||
    combined.includes('manufacturing') ||
    combined.includes('factory') ||
    combined.includes('scheduling') ||
    combined.includes('tezgah') ||
    combined.includes('makine') ||
    combined.includes('vardiya') ||
    combined.includes('kapasite') ||
    combined.includes('shop-floor') ||
    combined.includes('mes') ||
    combined.includes('iş emri')
  ) {
    return CANONICAL_DOMAIN_PROFILES.INDUSTRIAL_OPERATIONS;
  }

  // 2. Finance / Accounting / Ledger
  if (
    combined.includes('muhasebe') ||
    combined.includes('finans') ||
    combined.includes('fatura') ||
    combined.includes('ledger') ||
    combined.includes('accounting') ||
    combined.includes('finance') ||
    combined.includes('bütçe') ||
    combined.includes('kasa') ||
    combined.includes('banka') ||
    combined.includes('vergi') ||
    combined.includes('reconciliation') ||
    combined.includes('mutabakat')
  ) {
    return CANONICAL_DOMAIN_PROFILES.FINANCE_DATA_HEAVY;
  }

  // 3. Commerce / Store / Marketplace / E-Ticaret
  if (
    combined.includes('e-ticaret') ||
    combined.includes('ticaret') ||
    combined.includes('mağaza') ||
    combined.includes('store') ||
    combined.includes('shop') ||
    combined.includes('commerce') ||
    combined.includes('marketplace') ||
    combined.includes('sepet') ||
    combined.includes('ürünler') ||
    combined.includes('siparişler') && !combined.includes('üretim')
  ) {
    return CANONICAL_DOMAIN_PROFILES.COMMERCE;
  }

  // 4. Media / Video / Audio / Portfolio
  if (
    combined.includes('medya') ||
    combined.includes('media') ||
    combined.includes('video') ||
    combined.includes('audio') ||
    combined.includes('galeri') ||
    combined.includes('görsel') ||
    combined.includes('asset') ||
    combined.includes('fotoğraf')
  ) {
    return CANONICAL_DOMAIN_PROFILES.MEDIA_FIRST;
  }

  // Default fallback: Industrial Operations if internal/operational, or standard B2B SaaS
  return CANONICAL_DOMAIN_PROFILES.INDUSTRIAL_OPERATIONS;
}
