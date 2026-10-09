import { z } from 'zod';

// 1. User Journey Schema
export const UserJourneySchema = z.object({
  id: z.string(),
  persona: z.string(),
  goal: z.string(),
  preconditions: z.array(z.string()),
  steps: z.array(z.string()),
  criticality: z.enum(['MISSION_CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  expectedOutcome: z.string(),
  failureStates: z.array(z.string()).default([
    'EMPTY_STATE',
    'LOADING_TIMEOUT',
    'API_400_BAD_REQUEST',
    'API_401_UNAUTHORIZED',
    'API_403_FORBIDDEN',
    'API_500_SERVER_ERROR',
    'NETWORK_OFFLINE',
    'DOUBLE_SUBMIT_GUARD'
  ]),
  performanceBudget: z.object({
    maxFlowDurationMs: z.number().positive().default(5000),
    maxStepLatencyMs: z.number().positive().default(1000)
  }),
  accessibilityRequirements: z.object({
    keyboardOnlyNavigable: z.boolean().default(true),
    announceLiveRegions: z.boolean().default(true),
    minTouchTargetPx: z.number().positive().default(44)
  })
});
export type UserJourney = z.infer<typeof UserJourneySchema>;

// 2. Playwright Test Scenario
export const PlaywrightTestScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  targetUrl: z.string(),
  viewports: z.array(z.object({
    name: z.string(),
    width: z.number().positive(),
    height: z.number().positive()
  })),
  browserEngines: z.array(z.enum(['chromium', 'firefox', 'webkit'])).default(['chromium']),
  generatedCode: z.string()
});
export type PlaywrightTestScenario = z.infer<typeof PlaywrightTestScenarioSchema>;

// 3. Runtime Console & Network Events (Chrome DevTools MCP)
export const ConsoleEventSchema = z.object({
  type: z.enum(['error', 'warning', 'info', 'exception']),
  text: z.string(),
  location: z.string().optional(),
  timestamp: z.string()
});
export type ConsoleEvent = z.infer<typeof ConsoleEventSchema>;

export const NetworkEventSchema = z.object({
  url: z.string(),
  method: z.string(),
  status: z.number().int(),
  durationMs: z.number().nonnegative(),
  failed: z.boolean(),
  errorDescription: z.string().optional(),
  corsFailure: z.boolean().default(false),
  cspViolation: z.boolean().default(false),
  mixedContent: z.boolean().default(false)
});
export type NetworkEvent = z.infer<typeof NetworkEventSchema>;

// 4. Visual Regression
export const ViewportPresetSchema = z.object({
  name: z.enum(['DESKTOP_1920', 'LAPTOP_1440', 'TABLET_768', 'MOBILE_390']),
  width: z.number().positive(),
  height: z.number().positive()
});
export type ViewportPreset = z.infer<typeof ViewportPresetSchema>;

export const DEFAULT_VIEWPORTS: ViewportPreset[] = [
  { name: 'DESKTOP_1920', width: 1920, height: 1080 },
  { name: 'LAPTOP_1440', width: 1440, height: 900 },
  { name: 'TABLET_768', width: 768, height: 1024 },
  { name: 'MOBILE_390', width: 390, height: 844 }
];

export const VisualDiffReportSchema = z.object({
  testId: z.string(),
  viewport: z.string(),
  state: z.string(),
  colorMode: z.enum(['LIGHT', 'DARK']),
  diffPercentage: z.number().min(0).max(100),
  passed: z.boolean(),
  requiresReview: z.boolean(),
  approved: z.boolean().optional(),
  baselineImagePath: z.string().optional(),
  currentImagePath: z.string().optional(),
  diffImagePath: z.string().optional()
});
export type VisualDiffReport = z.infer<typeof VisualDiffReportSchema>;

// 5. Accessibility Audit (axe-core)
export const AxeAuditResultSchema = z.object({
  targetUrl: z.string(),
  passesCount: z.number().int().nonnegative(),
  violations: z.array(z.object({
    id: z.string(),
    impact: z.enum(['minor', 'moderate', 'serious', 'critical']),
    description: z.string(),
    help: z.string(),
    helpUrl: z.string(),
    nodesCount: z.number().int().positive()
  })),
  manualChecksRequired: z.array(z.string())
});
export type AxeAuditResult = z.infer<typeof AxeAuditResultSchema>;

// 6. Performance & Trace Analysis (Lighthouse + Chrome DevTools)
export const LighthouseAuditResultSchema = z.object({
  url: z.string(),
  performanceScore: z.number().min(0).max(100),
  accessibilityScore: z.number().min(0).max(100),
  bestPracticesScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  metrics: z.object({
    lcpMs: z.number().nonnegative(),
    inpMs: z.number().nonnegative(),
    cls: z.number().nonnegative(),
    fcpMs: z.number().nonnegative(),
    speedIndexMs: z.number().nonnegative()
  }),
  rootCauseInsights: z.array(z.string())
});
export type LighthouseAuditResult = z.infer<typeof LighthouseAuditResultSchema>;

// 7. Load & Stress Test (Grafana k6)
export const LoadTestProfileSchema = z.object({
  profileType: z.enum(['SMOKE', 'BASELINE', 'LOAD', 'STRESS', 'SOAK']),
  virtualUsers: z.number().int().positive(),
  durationSeconds: z.number().int().positive(),
  targetUrl: z.string(),
  isDestructive: z.boolean(),
  userExplicitApproval: z.boolean().optional()
});
export type LoadTestProfile = z.infer<typeof LoadTestProfileSchema>;

// 8. Testing Strategy Pyramid
export const TestingLayerSchema = z.enum([
  'STATIC',
  'UNIT',
  'COMPONENT',
  'INTEGRATION',
  'API',
  'CONTRACT',
  'E2E',
  'ACCESSIBILITY',
  'VISUAL_REGRESSION',
  'PERFORMANCE',
  'LOAD',
  'SECURITY',
  'SMOKE',
  'REGRESSION',
  'MUTATION'
]);
export type TestingLayer = z.infer<typeof TestingLayerSchema>;

export const TestPyramidStrategySchema = z.object({
  projectName: z.string(),
  recommendedLayers: z.array(TestingLayerSchema),
  rationales: z.record(z.string()),
  skippedLayers: z.array(TestingLayerSchema)
});
export type TestPyramidStrategy = z.infer<typeof TestPyramidStrategySchema>;

// 9. Master QA Report
export const QAReportSchema = z.object({
  reportId: z.string(),
  generatedAt: z.string(),
  targetApplication: z.string(),
  overallStatus: z.enum(['PASS', 'WARN', 'FAIL', 'INCOMPLETE']),
  summary: z.string(),
  testedFlows: z.array(z.string()),
  testedBrowsers: z.array(z.string()),
  testedViewports: z.array(z.string()),
  consoleErrors: z.array(ConsoleEventSchema),
  networkFailures: z.array(NetworkEventSchema),
  accessibilityFindings: z.array(z.string()),
  performanceFindings: z.array(z.string()),
  visualDiffs: z.array(VisualDiffReportSchema),
  failedTests: z.array(z.string()),
  warnings: z.array(z.string()),
  unverifiedAreas: z.array(z.string())
});
export type QAReport = z.infer<typeof QAReportSchema>;
