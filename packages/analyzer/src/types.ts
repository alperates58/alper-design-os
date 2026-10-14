export interface ProjectProfile {
  rootDir: string;
  primaryStack: string;
  frameworks: string[];
  languages: string[];
  styling: {
    approach: string;
    usesTailwind: boolean;
    usesBootstrap: boolean;
    usesScss: boolean;
    usesCssModules: boolean;
    usesPlainCss: boolean;
  };
  templateEngine: string;
  hasTypeScript: boolean;
  packageManagers: ('npm' | 'pnpm' | 'yarn' | 'composer' | 'nuget')[];
  fileCount: number;
  detectedFiles: string[];
  recommendedAdapterId: string;
  confidence: number;
  summary: string;
}

export interface AuditIssue {
  id: string;
  file: string;
  line?: number;
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  category: 'ACCESSIBILITY' | 'RESPONSIVE' | 'ERGONOMICS' | 'TOKEN_CONSISTENCY';
  message: string;
  remediation: string;
}

export interface UIAuditResult {
  totalIssues: number;
  score: number; // 0 to 100
  issues: AuditIssue[];
  summary: string;
}

export interface A11yAuditResult {
  wcagLevelTarget: 'WCAG_2_2_AA' | 'WCAG_2_2_AAA' | 'WCAG_2_1_AA' | 'WCAG_2_1_AAA';
  passedRatio: number;
  violations: AuditIssue[];
  recommendations: string[];
}

export interface ResponsiveAuditResult {
  mobileReady: boolean;
  desktopDenseOptimized: boolean;
  viewportIssues: AuditIssue[];
  breakpointsFound: string[];
}
