/**
 * UI Design Knowledge & Recommendation Engine V2
 * Curated, compact, searchable knowledge base of product rules, layout recipes,
 * typography pairings, palettes, UX anti-patterns, and accessibility constraints.
 * Implements justified scoring and explicit explainability.
 */

export interface DesignKnowledgeRule {
  id: string;
  category: string;
  productArchetype: string;
  recommendedLayout: string;
  recommendedDensity: 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';
  primaryPalette: string;
  typographyPairing: {
    heading: string;
    body: string;
    mono: string;
  };
  navigationModel: string;
  keyUXGuidelines: string[];
  antiPatternsToAvoid: string[];
  accessibilityMandates: string[];
  provenance: string;
}

export interface RecommendationQuery {
  productType: string;
  industry?: string;
  userType?: 'OPERATOR' | 'ANALYST' | 'CONSUMER' | 'ENGINEER' | 'EXECUTIVE';
  primaryTask?: 'DATA_ANALYSIS' | 'WORKFLOW_ENTRY' | 'DISCOVERY_PURCHASE' | 'READING_WRITING' | 'CODING_DEBUGGING';
  deviceTarget?: 'DESKTOP' | 'MOBILE' | 'RESPONSIVE';
}

export interface RecommendationResult {
  matchedRule: DesignKnowledgeRule;
  matchConfidence: number;
  explanation: string;
  layoutBlueprint: {
    shellType: string;
    densityPreset: string;
    rowHeightPx: number;
    containerMaxWidth: string;
  };
  typographyRecommendation: {
    heading: string;
    body: string;
    mono: string;
    rationale: string;
  };
  paletteRecommendation: {
    name: string;
    primaryHex: string;
    accentHex: string;
    surfaceHex: string;
    contrastTargetRatio: string;
  };
  provenanceAttribution: string;
}

export class DesignKnowledgeEngine {
  private knowledgeBase: DesignKnowledgeRule[] = [
    {
      id: 'KB-ENT-ERP',
      category: 'ENTERPRISE',
      productArchetype: 'Enterprise ERP & Supply Chain',
      recommendedLayout: 'MASTER_DETAIL_SPLIT',
      recommendedDensity: 'COMPACT',
      primaryPalette: 'Slate Neutral & Amber Semantic',
      typographyPairing: {
        heading: 'Inter, -apple-system, sans-serif',
        body: 'Inter, -apple-system, sans-serif',
        mono: '"SF Mono", "Segoe UI Mono", monospace'
      },
      navigationModel: 'SIDEBAR_COLLAPSIBLE',
      keyUXGuidelines: [
        'Prioritize tabular record density (36px row height) to reduce scrolling',
        'Provide multi-column sorting and persistent filter chips above DataGrid',
        'Ensure non-modal inline editing or right-side inspection drawer for active records',
        'Support keyboard shortcuts: Up/Down for row navigation, Enter to open, Esc to dismiss'
      ],
      antiPatternsToAvoid: [
        'Do not use decorative cards with giant icons for high-volume transactions',
        'Never truncate critical monetary or inventory figures with ellipsis without hover tooltip',
        'Avoid low-contrast gray text on light gray backgrounds'
      ],
      accessibilityMandates: [
        'Minimum 4.5:1 text contrast for all cell contents',
        '3:1 contrast for table cell borders and active focus outlines',
        'ARIA role="grid" with aria-rowindex and aria-colindex attributes'
      ],
      provenance: 'Fluent 2 Web Standards & SAP Fiori Guidelines'
    },
    {
      id: 'KB-IND-APS',
      category: 'MANUFACTURING',
      productArchetype: 'Industrial APS & Factory MES',
      recommendedLayout: 'GANTT_TIMELINE_MATRIX',
      recommendedDensity: 'COMPACT',
      primaryPalette: 'Deep Charcoal & High-Visibility Status (Emerald/Amber/Crimson)',
      typographyPairing: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        mono: '"JetBrains Mono", monospace'
      },
      navigationModel: 'TOP_NAV_FLAT',
      keyUXGuidelines: [
        'Status colors must be semantically unambiguous: Green = Running, Amber = Warning/Idle, Red = Fault',
        'All critical machine and order statuses must be visible at 100% zoom without horizontal scrolling',
        'Timeline Gantt bars must feature readable high-contrast labels and tooltip details',
        'Touch-and-keyboard friendly hit targets for ruggedized shop-floor displays'
      ],
      antiPatternsToAvoid: [
        'Avoid subtle pastel status colors that wash out under fluorescent warehouse lighting',
        'Do not rely solely on color to convey status; always pair with icons or text status badges',
        'Never bury emergency pause or override controls inside nested drop-down menus'
      ],
      accessibilityMandates: [
        'WCAG AAA (7:1) contrast for mission-critical alerts',
        'Full keyboard accessibility without mouse requirement'
      ],
      provenance: 'ISA-101 Human Machine Interfaces & Industrial Automation Standards'
    },
    {
      id: 'KB-DEV-TOOL',
      category: 'DEVELOPER',
      productArchetype: 'Developer Workspace & Terminal IDE',
      recommendedLayout: 'MULTI_PANE_DOCK',
      recommendedDensity: 'COMPACT',
      primaryPalette: 'Zinc Dark & High-Contrast Cyan Accent',
      typographyPairing: {
        heading: '"Geist", "Segoe UI", sans-serif',
        body: '"Geist", "Segoe UI", sans-serif',
        mono: '"Geist Mono", "Cascadia Code", monospace'
      },
      navigationModel: 'SPLIT_TREE_PANEL',
      keyUXGuidelines: [
        'Persistent file tree with instant filter/search',
        'Split code and terminal/preview panes with draggable splitters',
        'Command palette accessible via Cmd/Ctrl + K or Shift + Shift',
        'Monospaced typography for all logs, hashes, file paths, and code snippets'
      ],
      antiPatternsToAvoid: [
        'No multi-colored decorative gradients in work surfaces',
        'Do not wrap or break monospaced tokens across multiple lines without clear continuation indicators',
        'Avoid forced modals that steal focus during continuous editing'
      ],
      accessibilityMandates: [
        'High contrast syntax highlighting adhering to WCAG 2.1 AA',
        'Accessible focus trap management in editor panels'
      ],
      provenance: 'VS Code Architecture & Radix Themes Dark UI'
    },
    {
      id: 'KB-B2C-SHOP',
      category: 'CONSUMER',
      productArchetype: 'Consumer Marketplace & Gaming Deals',
      recommendedLayout: 'FEED_STREAM_HERO',
      recommendedDensity: 'COMFORTABLE',
      primaryPalette: 'Clean Neutral & Emerald/Amber Action Accents',
      typographyPairing: {
        heading: '"Plus Jakarta Sans", sans-serif',
        body: '"Inter", sans-serif',
        mono: 'monospace'
      },
      navigationModel: 'TOP_NAV_FLAT',
      keyUXGuidelines: [
        'Prominent price comparisons (strike-through original, bold discounted)',
        'Trust badges indicating DRM, merchant rating, and verified keys',
        'Instant multi-tag filter chips with instant result counts',
        'Responsive media cards with fixed 16:9 or 2:3 aspect ratios'
      ],
      antiPatternsToAvoid: [
        'Do not hide shipping or final tax prices until the last checkout step',
        'Avoid unlabelled discount badges that do not clarify the currency or baseline',
        'Do not use tiny tap targets on mobile viewports'
      ],
      accessibilityMandates: [
        'All promo cards have explicit aria-label with product name and price',
        'Accessible color contrast between discount badges and card background'
      ],
      provenance: 'Baymard Institute E-Commerce Research & Tailwind UI Components'
    },
    {
      id: 'KB-EDITORIAL',
      category: 'CONTENT',
      productArchetype: 'Editorial Publication & Technical Docs',
      recommendedLayout: 'CENTERED_CONTAINER_CONSTRAINED',
      recommendedDensity: 'SPACIOUS',
      primaryPalette: 'Stone Warm Gray & Crisp Deep Charcoal',
      typographyPairing: {
        heading: '"Newsreader", Georgia, serif',
        body: '"Inter", sans-serif',
        mono: '"SF Mono", monospace'
      },
      navigationModel: 'TOP_NAV_FLAT',
      keyUXGuidelines: [
        'Optimal reading line measure constrained to 65-72 characters (max-w-prose)',
        'Generous line height (1.65 - 1.75) for prolonged readability',
        'Subtle typographic hierarchy with optical kerning',
        'Table of contents sticky sidebar for articles longer than 1,000 words'
      ],
      antiPatternsToAvoid: [
        'No full-width unconstrained text blocks on ultra-wide monitors',
        'Do not interrupt body text with full-screen blocking lead capture popups',
        'Avoid low-contrast caption text'
      ],
      accessibilityMandates: [
        'Strict WCAG AAA (7:1) body text contrast on light/dark surfaces',
        'Semantic HTML5 structure (<article>, <section>, <header>, <aside>)'
      ],
      provenance: 'Butterick Practical Typography & Smashing Magazine Standards'
    },
    {
      id: 'KB-B2B-SAAS',
      category: 'SAAS',
      productArchetype: 'Modern B2B SaaS Dashboard',
      recommendedLayout: 'FLUID_WORKSPACE',
      recommendedDensity: 'COMFORTABLE',
      primaryPalette: 'Neutral Slate & Royal Blue Accent',
      typographyPairing: {
        heading: 'Inter, -apple-system, sans-serif',
        body: 'Inter, -apple-system, sans-serif',
        mono: '"SF Mono", monospace'
      },
      navigationModel: 'SIDEBAR_COLLAPSIBLE',
      keyUXGuidelines: [
        'Hero metric summaries with clear delta indicators (+12.4% vs last period)',
        'Fluid workspace that adapts gracefully from 1024px to 2560px displays',
        'Unified search bar in top header with quick action triggers',
        'Clear empty states with single primary setup action'
      ],
      antiPatternsToAvoid: [
        'Do not use generic purple AI gradients across backgrounds',
        'Avoid empty cards with 0-value states that take up valuable dashboard space',
        'Never make entire cards clickable without discernible focus states'
      ],
      accessibilityMandates: [
        'All charts must have accessible data tables or screen-reader summaries',
        'Visible 2px focus rings on all interactive elements'
      ],
      provenance: 'shadcn/ui & Radix UI Primitives'
    }
  ];

  /**
   * Search knowledge base and return tailored recommendation with explicit explainability.
   */
  public recommend(query: RecommendationQuery): RecommendationResult {
    const pType = (query.productType || '').toLowerCase();
    const ind = (query.industry || '').toLowerCase();

    let matched: DesignKnowledgeRule;
    let confidence = 85;

    if (pType.includes('erp') || ind.includes('erp') || ind.includes('supply') || ind.includes('inventory')) {
      matched = this.knowledgeBase.find((r) => r.id === 'KB-ENT-ERP')!;
      confidence = 98;
    } else if (pType.includes('aps') || pType.includes('mes') || ind.includes('manufacturing') || ind.includes('factory')) {
      matched = this.knowledgeBase.find((r) => r.id === 'KB-IND-APS')!;
      confidence = 99;
    } else if (pType.includes('dev') || pType.includes('code') || query.userType === 'ENGINEER' || query.primaryTask === 'CODING_DEBUGGING') {
      matched = this.knowledgeBase.find((r) => r.id === 'KB-DEV-TOOL')!;
      confidence = 96;
    } else if (pType.includes('market') || pType.includes('deal') || pType.includes('shop') || query.primaryTask === 'DISCOVERY_PURCHASE') {
      matched = this.knowledgeBase.find((r) => r.id === 'KB-B2C-SHOP')!;
      confidence = 95;
    } else if (pType.includes('editorial') || pType.includes('blog') || pType.includes('news') || query.primaryTask === 'READING_WRITING') {
      matched = this.knowledgeBase.find((r) => r.id === 'KB-EDITORIAL')!;
      confidence = 94;
    } else {
      matched = this.knowledgeBase.find((r) => r.id === 'KB-B2B-SAAS')!;
      confidence = 90;
    }

    const explanation = `Recommended "${matched.productArchetype}" design recipe based on product category "${query.productType}" and primary task "${query.primaryTask || 'BALANCED'}". This archetype enforces ${matched.recommendedDensity} density and a ${matched.recommendedLayout} layout pattern. It was chosen to maximize task efficiency for ${query.userType || 'standard'} users while strictly avoiding anti-patterns like ${matched.antiPatternsToAvoid[0]}.`;

    return {
      matchedRule: matched,
      matchConfidence: confidence,
      explanation,
      layoutBlueprint: {
        shellType: matched.navigationModel,
        densityPreset: matched.recommendedDensity,
        rowHeightPx: matched.recommendedDensity === 'COMPACT' ? 36 : matched.recommendedDensity === 'COMFORTABLE' ? 48 : 60,
        containerMaxWidth: matched.recommendedLayout === 'CENTERED_CONTAINER_CONSTRAINED' ? '68ch' : '100%'
      },
      typographyRecommendation: {
        heading: matched.typographyPairing.heading,
        body: matched.typographyPairing.body,
        mono: matched.typographyPairing.mono,
        rationale: `Selected ${matched.typographyPairing.heading} for optimal legibility and tabular numeric precision in ${matched.recommendedDensity} interfaces.`
      },
      paletteRecommendation: {
        name: matched.primaryPalette,
        primaryHex: matched.id === 'KB-DEV-TOOL' ? '#09090b' : matched.id === 'KB-IND-APS' ? '#18181b' : '#0f172a',
        accentHex: matched.id === 'KB-DEV-TOOL' ? '#06b6d4' : matched.id === 'KB-IND-APS' ? '#10b981' : '#2563eb',
        surfaceHex: matched.id === 'KB-DEV-TOOL' ? '#18181b' : '#ffffff',
        contrastTargetRatio: matched.accessibilityMandates[0] || '4.5:1'
      },
      provenanceAttribution: matched.provenance
    };
  }

  /**
   * Retrieves all available knowledge base rules.
   */
  public listAllRules(): DesignKnowledgeRule[] {
    return [...this.knowledgeBase];
  }
}
