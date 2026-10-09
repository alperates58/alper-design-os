import { z } from 'zod';

export const DomainClassificationSchema = z.enum([
  'B2B_ENTERPRISE',
  'INDUSTRIAL_OPERATIONAL',
  'B2C_CONSUMER',
  'DEVELOPER_TOOL',
  'FINTECH',
  'HEALTHCARE'
]);
export type DomainClassification = z.infer<typeof DomainClassificationSchema>;

export const UsageFrequencySchema = z.enum([
  'CONTINUOUS_WORKBENCH', // 6-10 hours/day active screen time
  'DAILY_FREQUENT',      // Several times a day
  'OCCASIONAL_ADMIN',   // Weekly or monthly
  'TRANSACTIONAL'        // Quick task-based usage
]);
export type UsageFrequency = z.infer<typeof UsageFrequencySchema>;

export const InformationDensitySchema = z.enum([
  'EXTREME',   // High-volume telemetry, trading, multi-machine Gantt (compact rows, sub-pixel fit)
  'HIGH',      // Dense grids, split panes, complex scheduling (APS, ERP)
  'MEDIUM',    // Standard business SaaS, analytics dashboards
  'SPACIOUS'   // Consumer, content, mobile-first
]);
export type InformationDensity = z.infer<typeof InformationDensitySchema>;

export const InteractionStyleSchema = z.enum([
  'KEYBOARD_FIRST',           // Heavy shortcut usage, inline edits, hotkeys
  'HYBRID_MOUSE_KEYBOARD',    // Drag-and-drop + hotkeys + context menus
  'TOUCH_OPTIMIZED',          // Large targets, gestures
  'GUIDED_WIZARD'             // Step-by-step linear process
]);
export type InteractionStyle = z.infer<typeof InteractionStyleSchema>;

export const PersonaProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  expertiseLevel: z.enum(['NOVICE', 'INTERMEDIATE', 'EXPERT_OPERATOR']),
  dailyTimeInAppHours: z.number().nonnegative(),
  primaryPainPoints: z.array(z.string()),
  ergonomicNeeds: z.array(z.string())
});
export type PersonaProfile = z.infer<typeof PersonaProfileSchema>;

export const JobToBeDoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  frequency: z.string(),
  complexity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'MISSION_CRITICAL']),
  successMetric: z.string()
});
export type JobToBeDone = z.infer<typeof JobToBeDoneSchema>;

export const CriticalWorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  steps: z.array(z.string()),
  trigger: z.string(),
  latencyTolerance: z.enum(['REAL_TIME_INSTANT', 'SUB_SECOND', 'BATCH_ASYNCHRONOUS']),
  requiredShortcuts: z.array(z.string()).optional()
});
export type CriticalWorkflow = z.infer<typeof CriticalWorkflowSchema>;

export const VisualPatternRequirementSchema = z.object({
  patternId: z.string(),
  name: z.string(),
  reason: z.string(),
  recommendedVariant: z.string()
});
export type VisualPatternRequirement = z.infer<typeof VisualPatternRequirementSchema>;

export const AccessibilityRequirementSchema = z.object({
  level: z.enum(['WCAG_2_1_AA', 'WCAG_2_1_AAA']),
  focusOrderStrict: z.boolean(),
  highContrastSupport: z.boolean(),
  keyboardOnlyNavigable: z.boolean(),
  screenReaderAnnouncementNotes: z.array(z.string())
});
export type AccessibilityRequirement = z.infer<typeof AccessibilityRequirementSchema>;

export const ResponsiveRequirementSchema = z.object({
  primaryDevice: z.enum(['DESKTOP_LARGE_DISPLAY', 'LAPTOP_WORKBENCH', 'TABLET_RUGGED', 'MOBILE_RESPONSIVE']),
  minimumViewportWidthPx: z.number().int().positive(),
  multiMonitorSupport: z.boolean(),
  splitPaneBehavior: z.string()
});
export type ResponsiveRequirement = z.infer<typeof ResponsiveRequirementSchema>;

export const DesignDirectionSchema = z.object({
  layoutArchetype: z.enum([
    'WORKBENCH_MULTI_PANE',
    'DATA_GRID_DOMINANT',
    'TIMELINE_GANTT_DOMINANT',
    'METRICS_DASHBOARD',
    'MASTER_DETAIL_INSPECTOR'
  ]),
  colorModePreference: z.enum(['DARK_DOMINANT', 'LIGHT_DOMINANT', 'SYSTEM_ADAPTIVE']),
  typographyScale: z.enum(['COMPACT_HIGH_DENSITY', 'BALANCED_SYSTEM', 'EXPRESSIVE_EDITORIAL']),
  primaryTokensOverride: z.record(z.string()).optional(),
  summary: z.string()
});
export type DesignDirection = z.infer<typeof DesignDirectionSchema>;

export const ProductUXProfileSchema = z.object({
  productName: z.string(),
  productDomain: z.string(),
  domainClassification: DomainClassificationSchema,
  personas: z.array(PersonaProfileSchema),
  primaryJobsAndTasks: z.array(JobToBeDoneSchema),
  usageFrequency: UsageFrequencySchema,
  informationDensity: InformationDensitySchema,
  interactionStyle: InteractionStyleSchema,
  criticalWorkflows: z.array(CriticalWorkflowSchema),
  requiredVisualPatterns: z.array(VisualPatternRequirementSchema),
  accessibilityConsiderations: AccessibilityRequirementSchema,
  responsiveRequirements: ResponsiveRequirementSchema,
  recommendedDesignDirection: DesignDirectionSchema
});
export type ProductUXProfile = z.infer<typeof ProductUXProfileSchema>;

export interface ProductBriefInput {
  name?: string;
  productName?: string;
  description: string;
  domain?: string;
  targetUsers?: string[];
  keyFeatures?: string[];
  operatingEnvironment?: string;
}
