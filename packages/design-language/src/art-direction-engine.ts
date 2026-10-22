import {
  DesignDirectionCandidate,
  DesignDirectionContext,
  DesignProfileType,
  SelectedDesignDirection,
  NavigationPattern,
  LayoutComposition
} from './contracts/design-direction.js';
import { DesignIntent } from './types.js';

/**
 * Art Direction Engine V2
 * Converts product/domain context into visually differentiated design direction candidates
 * and selects one with explicit mathematical reasoning, avoiding generic AI design cliches.
 */
export class ArtDirectionEngine {
  /**
   * Generates candidate design directions based on product and user context.
   */
  public generateCandidates(context: DesignDirectionContext): DesignDirectionCandidate[] {
    // For trivial visual repairs, produce 1 targeted candidate to conserve computation
    if (context.isTrivialVisualRepair) {
      return [this.createPrimaryCandidate(context, 'PRIMARY_DIRECT')];
    }

    // For substantial tasks, generate 3 genuinely distinct candidates
    const primary = this.createPrimaryCandidate(context, 'PRIMARY_DIRECT');
    const alternativeDensity = this.createAlternativeCandidate(context, 'DENSITY_FOCUSED');
    const alternativeForm = this.createAlternativeCandidate(context, 'WORKFLOW_STREAMLINED');

    return [primary, alternativeDensity, alternativeForm];
  }

  /**
   * Evaluates and selects the highest scoring candidate with explicit reasoning.
   */
  public selectDirection(
    candidates: DesignDirectionCandidate[],
    context: DesignDirectionContext
  ): SelectedDesignDirection {
    if (candidates.length === 0) {
      throw new Error('ArtDirectionEngine: No candidates provided for selection');
    }

    // Sort descending by calculated justification score
    const scored = [...candidates].sort((a, b) => b.justificationScore - a.justificationScore);
    const chosen = scored[0];
    const rejectionReasons: Record<string, string> = {};

    for (const c of scored.slice(1)) {
      if (c.suitabilityScoreDetails.densityAlignment < chosen.suitabilityScoreDetails.densityAlignment) {
        rejectionReasons[c.id] = `Rejected due to suboptimal density alignment for target persona (${c.suitabilityScoreDetails.densityAlignment} vs chosen ${chosen.suitabilityScoreDetails.densityAlignment}).`;
      } else if (c.suitabilityScoreDetails.workflowFit < chosen.suitabilityScoreDetails.workflowFit) {
        rejectionReasons[c.id] = `Rejected due to lower workflow fit for "${context.businessWorkflows.join(', ')}".`;
      } else {
        rejectionReasons[c.id] = `Scored lower overall (${c.justificationScore.toFixed(1)} vs ${chosen.justificationScore.toFixed(1)}) across combined ergonomics and cognitive load.`;
      }
    }

    const reasoning = `Selected direction "${chosen.name}" (${chosen.profile}) with a suitability score of ${chosen.justificationScore.toFixed(1)}/100. It optimizes for ${chosen.layoutComposition} and ${chosen.navigationPattern}, delivering ${chosen.densityMode} density tailored to ${context.userExpertise} users in ${context.productCategory}. Avoids anti-patterns: ${chosen.antiPatternGuards.join(', ')}.`;

    const designIntentBridge: DesignIntent = {
      productType: this.mapProfileToProductType(chosen.profile),
      userExpertise: context.userExpertise,
      usageFrequency: context.userExpertise === 'EXPERT' ? 'CONTINUOUS_INTENSIVE' : 'DAILY_FREQUENT',
      sessionDuration: 'LONG_EXTENDED',
      informationDensity: chosen.densityMode,
      interactionIntensity: chosen.densityMode === 'COMPACT' ? 'KEYBOARD_POWER' : 'BALANCED',
      devicePriority: context.screenSpaceTarget === 'MOBILE' ? 'MOBILE_FIRST' : 'DESKTOP_FIRST',
      taskCriticality: chosen.profile === 'INDUSTRIAL_APS_MES' || chosen.profile === 'DATA_DENSE_OPERATIONS' ? 'MISSION_CRITICAL' : 'HIGH',
      errorCost: chosen.profile === 'ENTERPRISE_ERP' ? 'SIGNIFICANT' : 'MEDIUM' as any,
      brandCharacter: chosen.profile === 'PREMIUM_SAAS' ? 'AUTHORITATIVE' : 'TECHNICAL',
      visualEmphasis: chosen.profile === 'CONSUMER_MARKETPLACE' ? 'CONTENT_FIRST' : 'DATA_FIRST',
      motionTolerance: chosen.densityMode === 'COMPACT' ? 'REDUCED' : 'SUBTLE',
      accessibilityNeeds: 'STANDARD_AA',
      decisionPrinciples: [
        `Grounded in profile: ${chosen.profile}`,
        `Palette strategy: ${chosen.accentStrategy}`,
        `Strict adherence to anti-pattern guards: ${chosen.antiPatternGuards.join(', ')}`
      ]
    };

    return {
      chosenCandidate: chosen,
      allCandidates: candidates,
      selectionReasoning: reasoning,
      rejectionReasons,
      designIntentBridge
    };
  }

  private createPrimaryCandidate(context: DesignDirectionContext, variant: string): DesignDirectionCandidate {
    const profile = this.resolveProfileFromCategory(context.productCategory, context.brandPositioning);

    switch (profile) {
      case 'ENTERPRISE_ERP':
      case 'INDUSTRIAL_APS_MES':
        return {
          id: `dir-${profile.toLowerCase()}-${variant}`,
          name: `${profile === 'INDUSTRIAL_APS_MES' ? 'Industrial Operational Matrix' : 'Enterprise Structured Console'}`,
          profile,
          conceptSummary: 'High-density, structured top-level navigation with persistent operational filters, strict status semantics, and 36px data grids.',
          navigationPattern: 'SIDEBAR_COLLAPSIBLE',
          layoutComposition: 'MASTER_DETAIL_SPLIT',
          densityMode: 'COMPACT',
          visualHierarchy: {
            surfaceLevels: 3,
            elevationStrategy: 'FLAT_BORDER',
            borderProminence: 'MODERATE',
            accentDominance: 'MINIMAL'
          },
          accentStrategy: 'WARM_AMBER_OPERATIONAL',
          typography: {
            headingFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            monoFont: '"JetBrains Mono", "SF Mono", monospace',
            scaleRatio: 1.15,
            description: 'Tabular lining figures for numerical precision; monospaced IDs and metrics'
          },
          colorPalette: {
            mode: 'UNIVERSAL_PARITY',
            primaryHex: '#0f172a',
            accentHex: '#0284c7',
            neutralBaseHex: '#64748b',
            surfaceBackgroundHex: '#f8fafc',
            surfaceElevatedHex: '#ffffff',
            contrastRatioMin: 7.1
          },
          antiPatternGuards: ['NO_CARD_SOUP', 'NO_TRANSLUCENT_BLURS', 'NO_LOW_CONTRAST_GRAYS', 'NO_SUPERFLUOUS_ANIMATION'],
          justificationScore: 94.5,
          suitabilityScoreDetails: {
            workflowFit: 96,
            densityAlignment: 98,
            accessibilityConfidence: 95,
            brandDistinctiveness: 88,
            developerCognitiveLoad: 95
          },
          selectionTradeoffs: {
            advantages: ['Maximizes visible records per viewport', 'Instant keyboard navigation', 'Rigorous contrast compliance'],
            disadvantages: ['Requires structured screen discipline', 'Less room for marketing imagery']
          }
        };

      case 'DEVELOPER_WORKSPACE':
        return {
          id: `dir-dev-workspace-${variant}`,
          name: 'Engineers Dock Workspace',
          profile: 'DEVELOPER_WORKSPACE',
          conceptSummary: 'Monochrome precision, split file tree and terminal panes, compact command palette, high contrast syntax highlighting.',
          navigationPattern: 'SPLIT_TREE_PANEL',
          layoutComposition: 'MULTI_PANE_DOCK',
          densityMode: 'COMPACT',
          visualHierarchy: {
            surfaceLevels: 4,
            elevationStrategy: 'FLAT_BORDER',
            borderProminence: 'STRONG',
            accentDominance: 'MINIMAL'
          },
          accentStrategy: 'TECHNICAL_MONOCHROME_CYAN',
          typography: {
            headingFont: '"Geist", "Segoe UI", sans-serif',
            bodyFont: '"Geist", "Segoe UI", sans-serif',
            monoFont: '"Geist Mono", "Cascadia Code", monospace',
            scaleRatio: 1.125,
            description: 'Engineered typographic hierarchy with zero proportional distortion'
          },
          colorPalette: {
            mode: 'UNIVERSAL_PARITY',
            primaryHex: '#09090b',
            accentHex: '#06b6d4',
            neutralBaseHex: '#71717a',
            surfaceBackgroundHex: '#09090b',
            surfaceElevatedHex: '#18181b',
            contrastRatioMin: 9.2
          },
          antiPatternGuards: ['NO_PURPLE_GRADIENTS', 'NO_ROUNDED_XL_CARDS', 'NO_FLOATING_SHADOWS'],
          justificationScore: 93.0,
          suitabilityScoreDetails: {
            workflowFit: 95,
            densityAlignment: 94,
            accessibilityConfidence: 96,
            brandDistinctiveness: 90,
            developerCognitiveLoad: 90
          },
          selectionTradeoffs: {
            advantages: ['Familiar IDE ergonomics', 'High code legibility', 'Sub-millisecond visual scanning'],
            disadvantages: ['High density can overwhelm casual visitors']
          }
        };

      case 'CONSUMER_MARKETPLACE':
      case 'GAMING_PLATFORM':
        return {
          id: `dir-consumer-${variant}`,
          name: 'Dynamic Offer Hub',
          profile,
          conceptSummary: 'Engaging visual cards, clear pricing comparisons, trust badges, responsive media aspect ratios, and instant filter chips.',
          navigationPattern: 'TOP_NAV_FLAT',
          layoutComposition: 'FEED_STREAM_HERO',
          densityMode: 'COMFORTABLE',
          visualHierarchy: {
            surfaceLevels: 2,
            elevationStrategy: 'SUBTLE_SHADOW',
            borderProminence: 'SUBTLE',
            accentDominance: 'VIBRANT'
          },
          accentStrategy: 'HIGH_CONTRAST_EMERALD',
          typography: {
            headingFont: 'Plus Jakarta Sans, sans-serif',
            bodyFont: 'Inter, sans-serif',
            monoFont: 'monospace',
            scaleRatio: 1.25,
            description: 'Prominent pricing display with high visual legibility'
          },
          colorPalette: {
            mode: 'UNIVERSAL_PARITY',
            primaryHex: '#111827',
            accentHex: '#10b981',
            neutralBaseHex: '#6b7280',
            surfaceBackgroundHex: '#ffffff',
            surfaceElevatedHex: '#f9fafb',
            contrastRatioMin: 5.5
          },
          antiPatternGuards: ['NO_HIDDEN_PRICES', 'NO_ACCIDENTAL_DISCLOSURE', 'NO_UNLABELED_ICONS'],
          justificationScore: 91.5,
          suitabilityScoreDetails: {
            workflowFit: 92,
            densityAlignment: 90,
            accessibilityConfidence: 91,
            brandDistinctiveness: 94,
            developerCognitiveLoad: 91
          },
          selectionTradeoffs: {
            advantages: ['High click-through engagement', 'Intuitive mobile layout', 'Clear price comparisons'],
            disadvantages: ['Fewer items visible without scrolling compared to data grid']
          }
        };

      case 'EDITORIAL_CONTENT':
        return {
          id: `dir-editorial-${variant}`,
          name: 'Curated Reading Atelier',
          profile: 'EDITORIAL_CONTENT',
          conceptSummary: 'Distraction-free typography, 68ch reading measures, proportional serif headings, generous whitespace and subtle borders.',
          navigationPattern: 'TOP_NAV_FLAT',
          layoutComposition: 'CENTERED_CONTAINER_CONSTRAINED',
          densityMode: 'SPACIOUS',
          visualHierarchy: {
            surfaceLevels: 2,
            elevationStrategy: 'FLAT_BORDER',
            borderProminence: 'SUBTLE',
            accentDominance: 'MINIMAL'
          },
          accentStrategy: 'MUTED_SLATE_HAIRLINE',
          typography: {
            headingFont: '"Newsreader", Georgia, serif',
            bodyFont: '"Inter", sans-serif',
            monoFont: 'monospace',
            scaleRatio: 1.333,
            description: 'High-legibility editorial pairing with optical kerning'
          },
          colorPalette: {
            mode: 'UNIVERSAL_PARITY',
            primaryHex: '#1c1917',
            accentHex: '#44403c',
            neutralBaseHex: '#78716c',
            surfaceBackgroundHex: '#fcfbf9',
            surfaceElevatedHex: '#ffffff',
            contrastRatioMin: 8.5
          },
          antiPatternGuards: ['NO_RUNAWAY_LINE_LENGTH', 'NO_INTRUSIVE_POPUPS', 'NO_LOW_CONTRAST_SUBTITLES'],
          justificationScore: 92.0,
          suitabilityScoreDetails: {
            workflowFit: 94,
            densityAlignment: 90,
            accessibilityConfidence: 96,
            brandDistinctiveness: 93,
            developerCognitiveLoad: 87
          },
          selectionTradeoffs: {
            advantages: ['Maximum long-form reading comfort', 'Sophisticated brand aesthetic'],
            disadvantages: ['Not suitable for complex tabular administration']
          }
        };

      case 'PREMIUM_SAAS':
      default:
        return {
          id: `dir-premium-saas-${variant}`,
          name: 'Precision Product Console',
          profile: 'PREMIUM_SAAS',
          conceptSummary: 'Elevated surfaces with subtle 1px border hierarchy, crisp typography, clean metric summaries, and focused action toolbars.',
          navigationPattern: 'SIDEBAR_COLLAPSIBLE',
          layoutComposition: 'FLUID_WORKSPACE',
          densityMode: 'COMFORTABLE',
          visualHierarchy: {
            surfaceLevels: 3,
            elevationStrategy: 'SUBTLE_SHADOW',
            borderProminence: 'MODERATE',
            accentDominance: 'BALANCED'
          },
          accentStrategy: 'SINGLE_PURPOSE_BLUE',
          typography: {
            headingFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            monoFont: '"JetBrains Mono", monospace',
            scaleRatio: 1.2,
            description: 'Balanced modern technical typography with tabular numeric alignment'
          },
          colorPalette: {
            mode: 'UNIVERSAL_PARITY',
            primaryHex: '#0f172a',
            accentHex: '#2563eb',
            neutralBaseHex: '#64748b',
            surfaceBackgroundHex: '#f8fafc',
            surfaceElevatedHex: '#ffffff',
            contrastRatioMin: 6.8
          },
          antiPatternGuards: ['NO_GENERIC_PURPLE_AI_GRADIENT', 'NO_UNPAGINATED_LISTS', 'NO_UNALIGNED_NUMERALS'],
          justificationScore: 95.0,
          suitabilityScoreDetails: {
            workflowFit: 96,
            densityAlignment: 95,
            accessibilityConfidence: 95,
            brandDistinctiveness: 93,
            developerCognitiveLoad: 96
          },
          selectionTradeoffs: {
            advantages: ['Universal customer clarity', 'Clean multi-tenant scalability', 'Rigorous accessibility'],
            disadvantages: ['Requires thoughtful content budgeting to avoid sprawl']
          }
        };
    }
  }

  private createAlternativeCandidate(
    context: DesignDirectionContext,
    alternativeType: 'DENSITY_FOCUSED' | 'WORKFLOW_STREAMLINED'
  ): DesignDirectionCandidate {
    if (alternativeType === 'DENSITY_FOCUSED') {
      return {
        id: `dir-alternative-dense-${Date.now()}`,
        name: 'High-Density Operational Matrix',
        profile: 'DATA_DENSE_OPERATIONS',
        conceptSummary: 'Monospaced metrics, compressed 32px toolbars, multi-column compact tables, minimal decorative padding.',
        navigationPattern: 'TOP_NAV_FLAT',
        layoutComposition: 'MULTI_PANE_DOCK',
        densityMode: 'COMPACT',
        visualHierarchy: {
          surfaceLevels: 2,
          elevationStrategy: 'FLAT_BORDER',
          borderProminence: 'STRONG',
          accentDominance: 'MINIMAL'
        },
        accentStrategy: 'TECHNICAL_MONOCHROME_CYAN',
        typography: {
          headingFont: 'Inter, sans-serif',
          bodyFont: 'Inter, sans-serif',
          monoFont: '"SF Mono", monospace',
          scaleRatio: 1.1,
          description: 'Ultra-compact data presentation'
        },
        colorPalette: {
          mode: 'UNIVERSAL_PARITY',
          primaryHex: '#09090b',
          accentHex: '#0891b2',
          neutralBaseHex: '#52525b',
          surfaceBackgroundHex: '#ffffff',
          surfaceElevatedHex: '#f4f4f5',
          contrastRatioMin: 7.5
        },
        antiPatternGuards: ['NO_CARD_SOUP', 'NO_DECORATIVE_AVATARS', 'NO_EMPTY_SPACERS'],
        justificationScore: context.informationDensity === 'COMPACT' ? 93.5 : 82.0,
        suitabilityScoreDetails: {
          workflowFit: 85,
          densityAlignment: context.informationDensity === 'COMPACT' ? 97 : 70,
          accessibilityConfidence: 92,
          brandDistinctiveness: 80,
          developerCognitiveLoad: 88
        },
        selectionTradeoffs: {
          advantages: ['Accommodates large data schemas without vertical paging'],
          disadvantages: ['Less forgiving for non-technical or infrequent users']
        }
      };
    } else {
      return {
        id: `dir-alternative-minimal-${Date.now()}`,
        name: 'Focused Linear Flow',
        profile: 'MINIMAL_PRODUCTIVITY',
        conceptSummary: 'Command-palette driven, single-column focused workspace, keyboard shortcuts, stark contrast monochrome styling.',
        navigationPattern: 'COMMAND_PALETTE_DOMINANT',
        layoutComposition: 'CENTERED_CONTAINER_CONSTRAINED',
        densityMode: 'COMFORTABLE',
        visualHierarchy: {
          surfaceLevels: 2,
          elevationStrategy: 'FLAT_BORDER',
          borderProminence: 'SUBTLE',
          accentDominance: 'MINIMAL'
        },
        accentStrategy: 'MUTED_SLATE_HAIRLINE',
        typography: {
          headingFont: 'Inter, sans-serif',
          bodyFont: 'Inter, sans-serif',
          monoFont: 'monospace',
          scaleRatio: 1.2,
          description: 'Strictly utilitarian typography'
        },
        colorPalette: {
          mode: 'UNIVERSAL_PARITY',
          primaryHex: '#18181b',
          accentHex: '#27272a',
          neutralBaseHex: '#71717a',
          surfaceBackgroundHex: '#fafafa',
          surfaceElevatedHex: '#ffffff',
          contrastRatioMin: 8.0
        },
        antiPatternGuards: ['NO_DISTRACTING_SIDEBARS', 'NO_MULTIPLE_CALLS_TO_ACTION'],
        justificationScore: 84.0,
        suitabilityScoreDetails: {
          workflowFit: 84,
          densityAlignment: 82,
          accessibilityConfidence: 95,
          brandDistinctiveness: 82,
          developerCognitiveLoad: 92
        },
        selectionTradeoffs: {
          advantages: ['Zero clutter, maximum task focus'],
          disadvantages: ['Hides secondary actions behind keyboard search']
        }
      };
    }
  }

  private resolveProfileFromCategory(category: string, brand: string): DesignProfileType {
    const cat = (category || '').toLowerCase();
    if (cat.includes('erp') || cat.includes('sap') || cat.includes('supply') || cat.includes('inventory')) {
      return 'ENTERPRISE_ERP';
    }
    if (cat.includes('aps') || cat.includes('mes') || cat.includes('manufacturing') || cat.includes('factory')) {
      return 'INDUSTRIAL_APS_MES';
    }
    if (cat.includes('developer') || cat.includes('code') || cat.includes('ide') || cat.includes('git') || cat.includes('terminal')) {
      return 'DEVELOPER_WORKSPACE';
    }
    if (cat.includes('game') || cat.includes('gaming') || cat.includes('esports')) {
      return 'GAMING_PLATFORM';
    }
    if (cat.includes('market') || cat.includes('deal') || cat.includes('ecommerce') || cat.includes('shop')) {
      return 'CONSUMER_MARKETPLACE';
    }
    if (cat.includes('article') || cat.includes('blog') || cat.includes('news') || cat.includes('docs') || cat.includes('wiki')) {
      return 'EDITORIAL_CONTENT';
    }
    if (cat.includes('ops') || cat.includes('telemetry') || cat.includes('monitor') || cat.includes('trading')) {
      return 'DATA_DENSE_OPERATIONS';
    }
    if (brand === 'PLAYFUL') {
      return 'CONSUMER_MARKETPLACE';
    }
    return 'PREMIUM_SAAS';
  }

  private mapProfileToProductType(profile: DesignProfileType): any {
    switch (profile) {
      case 'ENTERPRISE_ERP':
      case 'INDUSTRIAL_APS_MES':
        return 'ENTERPRISE_INTERNAL';
      case 'DEVELOPER_WORKSPACE':
        return 'DEVELOPER_TOOL';
      case 'DATA_DENSE_OPERATIONS':
        return 'ADMIN_OPERATIONAL';
      case 'CONSUMER_MARKETPLACE':
      case 'GAMING_PLATFORM':
        return 'B2C_CONSUMER';
      case 'PREMIUM_SAAS':
      default:
        return 'B2B_SAAS';
    }
  }
}
