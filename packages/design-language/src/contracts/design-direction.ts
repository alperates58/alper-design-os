import { DesignIntent, DensityMode, VisualHierarchy, TypographyProfile, ComponentState } from '../types.js';

/**
 * 9 Canonical Design Direction Profiles
 */
export type DesignProfileType =
  | 'PREMIUM_SAAS'
  | 'ENTERPRISE_ERP'
  | 'DATA_DENSE_OPERATIONS'
  | 'DEVELOPER_WORKSPACE'
  | 'CONSUMER_MARKETPLACE'
  | 'GAMING_PLATFORM'
  | 'EDITORIAL_CONTENT'
  | 'MINIMAL_PRODUCTIVITY'
  | 'INDUSTRIAL_APS_MES';

export type NavigationPattern =
  | 'SIDEBAR_COLLAPSIBLE'
  | 'TOP_NAV_FLAT'
  | 'COMMAND_PALETTE_DOMINANT'
  | 'DUAL_DRAWER_WORKSPACE'
  | 'BOTTOM_BAR_MOBILE'
  | 'SPLIT_TREE_PANEL';

export type LayoutComposition =
  | 'FLUID_WORKSPACE'
  | 'CENTERED_CONTAINER_CONSTRAINED'
  | 'MASTER_DETAIL_SPLIT'
  | 'MULTI_PANE_DOCK'
  | 'FEED_STREAM_HERO'
  | 'GANTT_TIMELINE_MATRIX';

export type AccentStrategy =
  | 'SINGLE_PURPOSE_BLUE'
  | 'HIGH_CONTRAST_EMERALD'
  | 'WARM_AMBER_OPERATIONAL'
  | 'TECHNICAL_MONOCHROME_CYAN'
  | 'VIBRANT_PURPLE_MAGENTA'
  | 'MUTED_SLATE_HAIRLINE';

export interface DesignDirectionCandidate {
  id: string;
  name: string;
  profile: DesignProfileType;
  conceptSummary: string;
  navigationPattern: NavigationPattern;
  layoutComposition: LayoutComposition;
  densityMode: DensityMode;
  visualHierarchy: VisualHierarchy;
  accentStrategy: AccentStrategy;
  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    scaleRatio: number;
    description: string;
  };
  colorPalette: {
    mode: 'LIGHT_FIRST' | 'DARK_FIRST' | 'UNIVERSAL_PARITY';
    primaryHex: string;
    accentHex: string;
    neutralBaseHex: string;
    surfaceBackgroundHex: string;
    surfaceElevatedHex: string;
    contrastRatioMin: number;
  };
  antiPatternGuards: string[];
  justificationScore: number;
  suitabilityScoreDetails: {
    workflowFit: number;
    densityAlignment: number;
    accessibilityConfidence: number;
    brandDistinctiveness: number;
    developerCognitiveLoad: number;
  };
  selectionTradeoffs: {
    advantages: string[];
    disadvantages: string[];
  };
}

export interface DesignDirectionContext {
  productName: string;
  productCategory: string;
  domain?: string;
  targetPersonas: string[];
  businessWorkflows: string[];
  userExpertise: 'NOVICE' | 'INTERMEDIATE' | 'EXPERT';
  informationDensity: DensityMode;
  brandPositioning: 'UTILITY' | 'PREMIUM' | 'PLAYFUL' | 'TECHNICAL' | 'EDITORIAL';
  screenSpaceTarget?: 'MOBILE' | 'DESKTOP' | 'BALANCED' | 'ULTRAWIDE';
  displayScalingFactor?: number; // e.g. 1.25 for Windows 125% DPI
  isTrivialVisualRepair?: boolean;
}

export interface SelectedDesignDirection {
  chosenCandidate: DesignDirectionCandidate;
  allCandidates: DesignDirectionCandidate[];
  selectionReasoning: string;
  rejectionReasons: Record<string, string>;
  designIntentBridge: DesignIntent;
}
