import { VisualDiffReport, VisualDiffReportSchema } from './types.js';

export interface VisualComparisonInput {
  testId: string;
  viewport: string;
  state?: string;
  colorMode?: 'LIGHT' | 'DARK';
  diffPercentage?: number;
  baselinePath?: string;
  currentPath?: string;
  diffPath?: string;
}

export function evaluateVisualDiff(input: VisualComparisonInput): VisualDiffReport {
  const state = input.state || 'default';
  const colorMode = input.colorMode || 'LIGHT';
  const diffPercentage = input.diffPercentage ?? 0;

  // Threshold: any visual difference > 0.05% triggers human review; never auto-accept
  const exceedsThreshold = diffPercentage > 0.05;
  const passed = !exceedsThreshold;
  const requiresReview = exceedsThreshold;

  const report: VisualDiffReport = {
    testId: input.testId,
    viewport: input.viewport,
    state,
    colorMode,
    diffPercentage,
    passed,
    requiresReview,
    approved: passed ? true : false,
    baselineImagePath: input.baselinePath,
    currentImagePath: input.currentPath,
    diffImagePath: input.diffPath
  };

  return VisualDiffReportSchema.parse(report);
}

export function generateViewportMatrix(): Array<{ name: string; width: number; height: number }> {
  return [
    { name: 'DESKTOP_1920', width: 1920, height: 1080 },
    { name: 'LAPTOP_1440', width: 1440, height: 900 },
    { name: 'TABLET_768', width: 768, height: 1024 },
    { name: 'MOBILE_390', width: 390, height: 844 }
  ];
}
