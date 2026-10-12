import { z } from 'zod';

// ============================================================================
// 1. DESIGN INTENT & CONTEXTUAL PROFILE (Technology-Neutral)
// ============================================================================

export type ProductType =
  | 'ENTERPRISE_INTERNAL'
  | 'B2B_SAAS'
  | 'B2C_CONSUMER'
  | 'ADMIN_OPERATIONAL'
  | 'ANALYTICS_DATA'
  | 'DEVELOPER_TOOL';

export type UserExpertise = 'NOVICE' | 'INTERMEDIATE' | 'EXPERT';
export type UsageFrequency = 'RARE_SPORADIC' | 'PERIODIC' | 'DAILY_FREQUENT' | 'CONTINUOUS_INTENSIVE';
export type SessionDuration = 'SHORT_FOCUSED' | 'MEDIUM' | 'LONG_EXTENDED';
export type InformationDensity = 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';
export type InteractionIntensity = 'READ_DOMINANT' | 'BALANCED' | 'INPUT_INTENSIVE' | 'KEYBOARD_POWER';
export type DevicePriority = 'DESKTOP_FIRST' | 'MOBILE_FIRST' | 'BALANCED_RESPONSIVE';
export type TaskCriticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'MISSION_CRITICAL';
export type ErrorCost = 'TRIVIAL' | 'LOW' | 'SIGNIFICANT' | 'CATASTROPHIC';
export type BrandCharacter = 'UTILITY_NEUTRAL' | 'AUTHORITATIVE' | 'FRIENDLY' | 'TECHNICAL';
export type VisualEmphasis = 'CONTENT_FIRST' | 'DATA_FIRST' | 'ACTION_FIRST' | 'BRAND_FIRST';
export type MotionTolerance = 'REDUCED' | 'SUBTLE' | 'EXPRESSIVE';
export type AccessibilityNeeds = 'STANDARD_AA' | 'ENHANCED_AAA' | 'HIGH_CONTRAST' | 'SCREEN_READER_OPTIMIZED';

export interface DesignIntent {
  productType: ProductType;
  userExpertise: UserExpertise;
  usageFrequency: UsageFrequency;
  sessionDuration: SessionDuration;
  informationDensity: InformationDensity;
  interactionIntensity: InteractionIntensity;
  devicePriority: DevicePriority;
  taskCriticality: TaskCriticality;
  errorCost: ErrorCost;
  brandCharacter: BrandCharacter;
  visualEmphasis: VisualEmphasis;
  motionTolerance: MotionTolerance;
  accessibilityNeeds: AccessibilityNeeds;
  decisionPrinciples: string[];
}

// ============================================================================
// 2. DESIGN PERSONALITY (6 Continuous Quantitative Axes)
// ============================================================================

export interface DesignPersonality {
  /** -100: Reserved & Utility-First <--> +100: Expressive & Brand-Heavy */
  reservedToExpressive: number;
  /** -100: Maximum Data Density <--> +100: Spacious Editorial Layout */
  compactToSpacious: number;
  /** -100: Raw Technical Precision <--> +100: Editorial Prose & Media */
  technicalToEditorial: number;
  /** -100: Neutral System UI <--> +100: Heavily Branded Personality */
  neutralToBranded: number;
  /** -100: Flat Clean Geometry <--> +100: Deep Layered Shadows & Elevation */
  flatToLayered: number;
  /** -100: Completely Static Instant <--> +100: Rich Choreographed Motion */
  staticToAnimated: number;
  rationale: string;
}

// ============================================================================
// 3. DENSITY & HIERARCHY
// ============================================================================

export type DensityMode = 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';

export interface DensityProfile {
  mode: DensityMode;
  baseSpacingUnit: number; // 4px (compact), 8px (comfortable), 12px (spacious)
  tableRowHeight: number; // 36px, 48px, 60px
  inputHeight: number; // 32px, 40px, 48px
  buttonHeight: number; // 32px, 40px, 48px
  fontSizeScale: 'COMPACT' | 'STANDARD' | 'PROMINENT';
}

export interface VisualHierarchy {
  surfaceLevels: number; // 1 to 4
  elevationStrategy: 'FLAT_BORDER' | 'SUBTLE_SHADOW' | 'LAYERED_ELEVATION';
  borderProminence: 'SUBTLE' | 'MODERATE' | 'STRONG';
  accentDominance: 'MINIMAL' | 'BALANCED' | 'VIBRANT';
}

// ============================================================================
// 4. TOKEN ARCHITECTURE V2 (3 Levels + DTCG Compliant)
// ============================================================================

export type ThemeMode = 'LIGHT' | 'DARK' | 'HIGH_CONTRAST';

export interface PrimitiveToken {
  name: string;
  value: string;
  type: 'COLOR' | 'DIMENSION' | 'FONT_FAMILY' | 'FONT_WEIGHT' | 'DURATION' | 'CUBIC_BEZIER' | 'SHADOW';
  description?: string;
}

export interface SemanticToken {
  name: string;
  primitiveRef: string;
  category: 'SURFACE' | 'TEXT' | 'BORDER' | 'ACTION' | 'STATUS' | 'INTERACTIVE';
  lightValue: string;
  darkValue: string;
  highContrastValue: string;
  description: string;
}

export interface ComponentToken {
  name: string;
  semanticRef: string;
  componentType: string;
  property: 'BACKGROUND' | 'TEXT' | 'BORDER' | 'PADDING' | 'RADIUS' | 'SHADOW' | 'HEIGHT';
  state?: ComponentState;
  resolvedValue: string;
}

export interface TypographyProfile {
  familyHeading: string[];
  familyBody: string[];
  familyMono: string[];
  systemFallback: boolean;
  numericReadability: 'STANDARD' | 'TABULAR_LINING' | 'MONOSPACE';
  variableFontSupported: boolean;
  performanceClass: 'LOCAL_SYSTEM' | 'OPTIMIZED_WEB_FONT' | 'SELF_HOSTED';
}

export interface MotionToken {
  name: string;
  durationMs: number;
  easing: string;
  distancePx?: number;
  reducedMotionFallbackMs: number;
}

export interface TokenArchitectureV2 {
  primitives: Record<string, PrimitiveToken>;
  semantics: Record<string, SemanticToken>;
  components: Record<string, ComponentToken>;
  typography: TypographyProfile;
  motion: Record<string, MotionToken>;
}

// ============================================================================
// 5. COMPONENT STATES & TYPES
// ============================================================================

export type ComponentState =
  | 'DEFAULT'
  | 'HOVER'
  | 'FOCUS'
  | 'ACTIVE'
  | 'DISABLED'
  | 'LOADING'
  | 'ERROR'
  | 'SUCCESS'
  | 'EMPTY'
  | 'SELECTED';

export type ComponentType =
  | 'BUTTON'
  | 'INPUT'
  | 'SELECT'
  | 'CHECKBOX'
  | 'RADIO'
  | 'SWITCH'
  | 'BADGE'
  | 'ALERT'
  | 'CARD'
  | 'MODAL_DIALOG'
  | 'DRAWER'
  | 'TOOLTIP'
  | 'DROPDOWN_MENU'
  | 'DATA_TABLE'
  | 'FILTER_BAR';

// ============================================================================
// 6. CONTRACTS (Interaction, Responsive, Accessibility, Icon, Data-Dense)
// ============================================================================

export interface InteractionContract {
  triggers: Array<{
    event: 'CLICK' | 'HOVER' | 'FOCUS' | 'KEY_DOWN' | 'DRAG' | 'VALUE_CHANGE' | 'FORM_SUBMIT';
    targetState: ComponentState;
    action: string;
  }>;
  keyboardShortcuts: Array<{
    key: string;
    action: string;
    description: string;
  }>;
  focusManagement: {
    autoFocus?: boolean;
    trapFocus?: boolean;
    restoreFocus?: boolean;
    focusVisibleRing?: boolean;
  };
  stateTransitions: Array<{
    from: ComponentState;
    to: ComponentState;
    trigger: string;
    durationMs?: number;
  }>;
  validationTrigger?: 'ON_CHANGE' | 'ON_BLUR' | 'ON_SUBMIT' | 'MANUAL';
}

export interface ResponsiveContract {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  collapseOrder: number;
  hidePolicy: 'NEVER' | 'ON_MOBILE' | 'ON_TABLET' | 'ACCORDION_ON_MOBILE';
  stackPolicy: 'INLINE' | 'STACK_ON_MOBILE' | 'STACK_ALWAYS';
  overflowPolicy: 'SCROLL' | 'CLIP' | 'ELLIPSIS' | 'WRAP' | 'DRAWER';
  drawerConversion: boolean;
  tableStrategy?: 'FULL_GRID' | 'PRIORITY_COLUMNS' | 'CARD_LIST' | 'HORIZONTAL_SCROLL';
  touchTarget: {
    minWidth: number; // e.g. 44px on mobile
    minHeight: number;
  };
  contentMinWidth?: number;
}

export interface AccessibilityContract {
  semanticRole: string; // WAI-ARIA role
  accessibleNameStrategy: 'LABEL_ELEMENT' | 'ARIA_LABEL' | 'ARIA_LABELLEDBY' | 'INNER_TEXT';
  keyboardInteraction: string[];
  focusBehavior: {
    focusable: boolean;
    tabIndex?: number;
    autoFocus?: boolean;
  };
  focusRestoration: boolean;
  ariaRequirements: Array<{
    attribute: string;
    valueDescription: string;
    required: boolean;
  }>;
  wcagLevel: 'AA' | 'AAA';
}

export type IconFamily = 'LUCIDE' | 'HEROICONS' | 'MATERIAL_SYMBOLS' | 'TABLER' | 'PHOSPHOR';

export interface IconProfile {
  primaryFamily: IconFamily;
  semanticMap: Record<string, string>; // e.g. "search" -> "search-icon"
  enforceSingleFamily: boolean;
}

export interface DataDenseProfile {
  compactDensity: boolean;
  keyboardRowNavigation: boolean;
  rowSelection: 'NONE' | 'SINGLE' | 'MULTI';
  bulkActions: boolean;
  stickyHeaders: boolean;
  columnResizing: boolean;
  savedViews: boolean;
  filterPersistence: boolean;
  contextActions: boolean;
  masterDetail: boolean;
  splitPanes: boolean;
}

// ============================================================================
// 7. COMPONENT BLUEPRINT (Canonical Model)
// ============================================================================

export interface ComponentBlueprint {
  id: string;
  type: ComponentType;
  role: string;
  intent: string;
  variants: string[];
  states: ComponentState[];
  size: 'SM' | 'MD' | 'LG' | 'XL';
  density: DensityMode;
  contentModel: {
    slots: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    props: Array<{
      name: string;
      type: string;
      defaultValue?: unknown;
      required: boolean;
      description?: string;
    }>;
  };
  tokens: Record<string, string>;
  interactions: InteractionContract;
  keyboardBehavior: string[];
  responsiveBehavior: ResponsiveContract;
  accessibilityRequirements: AccessibilityContract;
  validationRules?: Array<{ rule: string; message: string }>;
  sourceReferences: Array<{
    sourceName: string;
    mode: 'REFERENCE' | 'KNOWLEDGE' | 'DIRECT_CODE';
    notes: string;
  }>;
  implementationHints: string[];
}

// ============================================================================
// 8. APPLICATION SHELL & PAGE BLUEPRINT DSL
// ============================================================================

export type AppShellVariant = 'ENTERPRISE_DENSE' | 'SAAS_STANDARD' | 'CONSUMER_CONTENT';

export interface ApplicationShellBlueprint {
  id: string;
  variant: AppShellVariant;
  navigation: {
    sidebar?: boolean;
    topNav?: boolean;
    breadcrumbs?: boolean;
    commandArea?: boolean;
    navItems: Array<{ label: string; href: string; icon?: string; active?: boolean }>;
  };
  userMenu: {
    location: 'TOP_RIGHT' | 'BOTTOM_LEFT';
    items: string[];
  };
  mobileDrawer: boolean;
  contentRegion: {
    fullWidth: boolean;
    maxWidth?: string;
    padding: string;
  };
}

export type PageRegionType =
  | 'APP_SHELL'
  | 'PAGE_HEADER'
  | 'TOOLBAR'
  | 'FILTER_BAR'
  | 'CONTENT_REGION'
  | 'GRID_REGION'
  | 'DETAIL_PANEL'
  | 'ACTION_REGION'
  | 'STATUS_REGION';

export interface PageRegion {
  id: string;
  type: PageRegionType;
  title?: string;
  components: ComponentBlueprint[];
  layoutGrid?: {
    cols: number;
    gap: string;
    stackOnMobile?: boolean;
  };
}

export interface PageBlueprint {
  id: string;
  title: string;
  description: string;
  intent: DesignIntent;
  personality: DesignPersonality;
  density: DensityProfile;
  shell: ApplicationShellBlueprint;
  regions: PageRegion[];
  responsiveRules: ResponsiveContract[];
}

// ============================================================================
// 9. CHART / VISUALIZATION BLUEPRINT
// ============================================================================

export interface ChartBlueprint {
  id: string;
  title: string;
  dataShape: 'CATEGORICAL' | 'TIME_SERIES' | 'HIERARCHICAL' | 'SCATTER' | 'GEOGRAPHIC';
  seriesCount: number;
  timeSeries: boolean;
  interaction: {
    zoom: boolean;
    brush: boolean;
    tooltip: boolean;
    legend: boolean;
  };
  largeData: boolean;
  realTime: boolean;
  accessibility: {
    screenReaderSummary: string;
    tabularAlternative: boolean;
  };
  renderingPreference: 'SVG' | 'CANVAS' | 'AUTO';
}

// ============================================================================
// 10. UI RECIPES
// ============================================================================

export type RecipeType =
  | 'LOGIN_PAGE'
  | 'SETTINGS_PAGE'
  | 'LIST_DETAIL_PAGE'
  | 'DATA_MANAGEMENT_PAGE'
  | 'DASHBOARD_PAGE'
  | 'FORM_PAGE';

export interface UIRecipe {
  id: string;
  name: string;
  type: RecipeType;
  description: string;
  blueprint: PageBlueprint;
  supportedThemes: ThemeMode[];
  supportedDensities: DensityMode[];
}

// ============================================================================
// 11. ANTI-PATTERN ENGINE & CRITIC
// ============================================================================

export type AntiPatternSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AntiPatternIssue {
  id: string;
  code: string;
  category:
    | 'EXCESSIVE_CARDS'
    | 'MEANINGLESS_GRADIENTS'
    | 'GLASSMORPHISM_OVERUSE'
    | 'LOW_CONTRAST'
    | 'OVERSIZED_WHITESPACE'
    | 'AMBIGUOUS_ICON_ACTION'
    | 'EXCESSIVE_MODAL_NESTING'
    | 'HIDDEN_PRIMARY_ACTION'
    | 'UNNECESSARY_ANIMATION'
    | 'TINY_TOUCH_TARGET'
    | 'RANDOM_RADIUS'
    | 'MIXED_ICON_SYSTEMS'
    | 'INCONSISTENT_SPACING'
    | 'INCONSISTENT_DENSITY'
    | 'DECEPTIVE_TELEMETRY'
    | 'UNGROUNDED_DATA';
  severity: AntiPatternSeverity;
  message: string;
  location: string;
  remediation: string;
}

export interface AntiPatternReport {
  timestamp: string;
  totalIssues: number;
  passed: boolean;
  issues: AntiPatternIssue[];
  criticScore: number; // 0-100
}

// ============================================================================
// 12. TARGET RENDERERS & CROSS-STACK PARITY
// ============================================================================

export type TargetStack = 'html-css-js' | 'react-typescript' | 'laravel-blade' | 'aspnet-razor';

export interface RendererOutput {
  stack: TargetStack;
  primaryFile: {
    path: string;
    content: string;
    language: string;
  };
  supportingFiles: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  assetMetrics: {
    htmlBytes: number;
    cssBytes: number;
    jsBytes: number;
    externalDependencyCount: number;
  };
}

export interface CrossStackParityReport {
  runId: string;
  timestamp: string;
  visualParityScore: number; // 0-100
  behavioralParityScore: number; // 0-100
  accessibilityParityScore: number; // 0-100
  overallParityScore: number; // 0-100
  stackOutputs: Record<
    TargetStack,
    {
      htmlSize: number;
      cssSize: number;
      jsSize: number;
      dependencyCount: number;
      status: 'PASS' | 'WARN' | 'FAIL';
    }
  >;
  findings: Array<{
    stack: TargetStack;
    issue: string;
    severity: 'INFO' | 'WARNING' | 'BLOCKING';
  }>;
}
