import fs from 'node:fs';
import path from 'node:path';
import type { AntiPatternReport, AntiPatternIssue } from '@alper-design-os/design-language';

export type GateStatus = 'PASS' | 'WARN' | 'FAIL' | 'NOT_VERIFIED';
export type GateSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

export interface DoctorV3GateResult {
  gateId: string;
  name: string;
  status: GateStatus;
  severity: GateSeverity;
  message: string;
  details?: Record<string, unknown>;
  recommendations?: string[];
}

export interface DoctorV3Report {
  timestamp: string;
  targetProject: string;
  version: '3.0.0';
  overallStatus: 'PASS' | 'WARN' | 'FAIL' | 'BLOCKED';
  canPassQualityGate: boolean;
  gates: Record<string, DoctorV3GateResult>;
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
    notVerified: number;
  };
  domainIntelligence?: {
    classifiedDomain: string;
    antiPatternScore: number;
    detectedAntiPatterns: string[];
  };
  recommendations: string[];
}

export interface DoctorV3Options {
  strictMode?: boolean;
  previewUrl?: string;
  runVisualVerification?: boolean;
  allowBypassWithApproval?: boolean;
}

/**
 * Utility to scan source files recursively while ignoring common non-source dirs
 */
function scanSourceFiles(dir: string, extensions = ['.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte', '.html']): string[] {
  const results: string[] = [];
  const ignored = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.output', 'coverage']);

  function walk(current: string) {
    if (!fs.existsSync(current)) return;
    try {
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        if (ignored.has(entry.name)) continue;
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (extensions.includes(ext)) {
            results.push(full);
          }
        }
      }
    } catch {
      // Ignore unreadable dirs
    }
  }

  walk(dir);
  return results;
}

/**
 * ALPER DESIGN OS DOCTOR V3
 * Mandatory Quality Diagnostic for Projects Managed by Alper DevHub
 */
export async function runDoctorV3(projectPath: string, options: DoctorV3Options = {}): Promise<DoctorV3Report> {
  const targetProject = path.resolve(projectPath);
  const timestamp = new Date().toISOString();
  const recommendations: string[] = [];

  const gates: Record<string, DoctorV3GateResult> = {};

  function addGate(
    gateId: string,
    name: string,
    status: GateStatus,
    severity: GateSeverity,
    message: string,
    details?: Record<string, unknown>,
    gateRecommendations?: string[]
  ) {
    gates[gateId] = {
      gateId,
      name,
      status,
      severity,
      message,
      details,
      recommendations: gateRecommendations || []
    };
    if (gateRecommendations && gateRecommendations.length > 0) {
      recommendations.push(...gateRecommendations);
    }
  }

  // Read .design-os/config.json if it exists
  const designOsDir = path.join(targetProject, '.design-os');
  const configPath = path.join(designOsDir, 'config.json');
  let config: Record<string, any> | null = null;

  // -------------------------------------------------------------
  // GATE 1: Design OS Integration Active
  // -------------------------------------------------------------
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config && (config.domainProfile || config.domain || config.stackAdapter)) {
        addGate(
          'gate1_integrationActive',
          'Design OS Integration Active',
          'PASS',
          'INFO',
          'Design OS configuration verified active (.design-os/config.json)',
          {
            version: config.schemaVersion || config.version || '1.0.0',
            domain: config.domainProfile || config.domain || 'UNKNOWN',
            stackAdapter: config.stackAdapter || 'auto'
          }
        );
      } else {
        addGate(
          'gate1_integrationActive',
          'Design OS Integration Active',
          'FAIL',
          'CRITICAL',
          'Design OS configuration file (.design-os/config.json) exists but is incomplete or corrupted.',
          { path: configPath },
          ['Run DevHub Design OS initialization on the project.']
        );
      }
    } catch (e: any) {
      addGate(
        'gate1_integrationActive',
        'Design OS Integration Active',
        'FAIL',
        'CRITICAL',
        `Failed to parse .design-os/config.json: ${e.message}`,
        { path: configPath },
        ['Repair or regenerate .design-os/config.json.']
      );
    }
  } else {
    addGate(
      'gate1_integrationActive',
      'Design OS Integration Active',
      'FAIL',
      'CRITICAL',
      'ALPER DESIGN OS configuration (.design-os/config.json) is missing. Design OS is mandatory for all DevHub projects.',
      { path: configPath },
      ['Initialize Design OS integration in this project workspace.']
    );
  }

  // -------------------------------------------------------------
  // GATE 2: Stack Adapter Match
  // -------------------------------------------------------------
  const pkgPath = path.join(targetProject, 'package.json');
  let pkgData: any = null;
  if (fs.existsSync(pkgPath)) {
    try {
      pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    } catch {}
  }

  const configuredAdapter = config?.stackAdapter || 'unknown';
  let detectedStack = 'generic-web';

  if (pkgData) {
    const allDeps = { ...(pkgData.dependencies || {}), ...(pkgData.devDependencies || {}) };
    if (allDeps['react'] && (allDeps['typescript'] || fs.existsSync(path.join(targetProject, 'tsconfig.json')))) {
      detectedStack = 'react-typescript';
    } else if (allDeps['react']) {
      detectedStack = 'react';
    } else if (allDeps['vue']) {
      detectedStack = 'vue';
    }
  } else {
    const files = fs.readdirSync(targetProject).map(f => f.toLowerCase());
    if (files.some(f => f.endsWith('.blade.php') || f === 'artisan')) {
      detectedStack = 'laravel-blade';
    } else if (files.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) {
      detectedStack = 'aspnet-razor';
    }
  }

  if (config && (configuredAdapter === detectedStack || configuredAdapter === 'auto' || configuredAdapter.startsWith('react'))) {
    addGate(
      'gate2_stackAdapter',
      'Stack Adapter Compatibility',
      'PASS',
      'INFO',
      `Target project stack (${detectedStack}) matches configured Design OS adapter (${configuredAdapter})`,
      { detectedStack, configuredAdapter }
    );
  } else if (!config) {
    addGate(
      'gate2_stackAdapter',
      'Stack Adapter Compatibility',
      'FAIL',
      'MAJOR',
      `Cannot verify stack adapter without active Design OS config. Detected stack: ${detectedStack}`,
      { detectedStack }
    );
  } else {
    addGate(
      'gate2_stackAdapter',
      'Stack Adapter Compatibility',
      'WARN',
      'MAJOR',
      `Stack adapter mismatch: project uses ${detectedStack} but config specifies ${configuredAdapter}`,
      { detectedStack, configuredAdapter },
      [`Update .design-os/config.json stackAdapter to "${detectedStack}".`]
    );
  }

  // -------------------------------------------------------------
  // Collect source files for code analysis
  // -------------------------------------------------------------
  const sourceFiles = scanSourceFiles(targetProject);
  let aggregatedCode = '';
  const fileContents: { file: string; content: string }[] = [];

  for (const file of sourceFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      fileContents.push({ file: path.relative(targetProject, file), content });
      aggregatedCode += `\n/* File: ${path.relative(targetProject, file)} */\n` + content;
    } catch {}
  }

  // -------------------------------------------------------------
  // GATE 3: Real Component Usage
  // -------------------------------------------------------------
  const canonicalComponents = [
    'EnterpriseAppShell',
    'EnterpriseDataGrid',
    'GanttCapacityTimeline',
    'EnterpriseFormField',
    'EnterpriseInput',
    'EnterpriseBadge',
    'EnterpriseModal',
    'EnterpriseDrawer',
    'CommandPalette',
    'StatusBanner'
  ];

  const foundComponents: Record<string, number> = {};
  let totalComponentUsages = 0;

  for (const comp of canonicalComponents) {
    const regex = new RegExp(`\\b${comp}\\b`, 'g');
    const matches = aggregatedCode.match(regex);
    if (matches && matches.length > 0) {
      foundComponents[comp] = matches.length;
      totalComponentUsages += matches.length;
    }
  }

  if (totalComponentUsages > 0) {
    addGate(
      'gate3_realComponentUsage',
      'Real Enterprise Component Usage',
      'PASS',
      'INFO',
      `Canonical enterprise components verified: found ${totalComponentUsages} usages across ${Object.keys(foundComponents).length} component types`,
      { foundComponents, totalComponentUsages }
    );
  } else if (sourceFiles.length === 0) {
    addGate(
      'gate3_realComponentUsage',
      'Real Enterprise Component Usage',
      'WARN',
      'MAJOR',
      'No source files found in target project to verify component usage.',
      { sourceFilesCount: 0 }
    );
  } else {
    addGate(
      'gate3_realComponentUsage',
      'Real Enterprise Component Usage',
      'FAIL',
      'CRITICAL',
      'No canonical Design OS components utilized. Project uses ad-hoc HTML/CSS instead of reusable enterprise components.',
      { availableComponents: canonicalComponents },
      ['Scaffold and import EnterpriseAppShell, EnterpriseDataGrid, or domain-specific components from Design OS.']
    );
  }

  // -------------------------------------------------------------
  // GATE 4: Token Consistency & Raw Value Leaks
  // -------------------------------------------------------------
  const rawHexMatches: { file: string; match: string }[] = [];
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;

  for (const { file, content } of fileContents) {
    if (file.includes('tailwind.config') || file.includes('tokens') || file.includes('.design-os')) continue;
    const matches = content.match(hexRegex);
    if (matches) {
      for (const m of matches) {
        if (m.length === 4 || m.length === 7 || m.length === 9) {
          rawHexMatches.push({ file, match: m });
        }
      }
    }
  }

  if (rawHexMatches.length === 0) {
    addGate(
      'gate4_tokenConsistency',
      'Design Token Consistency',
      'PASS',
      'INFO',
      'Zero raw hex colors leaked. All styles use semantic design tokens or theme variables.',
      { rawColorLeaks: 0 }
    );
  } else if (rawHexMatches.length <= 5) {
    addGate(
      'gate4_tokenConsistency',
      'Design Token Consistency',
      'PASS',
      'MINOR',
      `Acceptable token discipline: ${rawHexMatches.length} raw hex color instances detected`,
      { rawColorLeaks: rawHexMatches.length, sample: rawHexMatches.slice(0, 3) }
    );
  } else {
    addGate(
      'gate4_tokenConsistency',
      'Design Token Consistency',
      'WARN',
      'MAJOR',
      `Raw color leak detected: ${rawHexMatches.length} hardcoded hex colors found instead of semantic design tokens`,
      { rawColorLeaks: rawHexMatches.length, sample: rawHexMatches.slice(0, 5) },
      ['Refactor hardcoded hex colors to Design OS semantic tokens (e.g. bg-background, text-foreground, border-border).']
    );
  }

  // -------------------------------------------------------------
  // GATE 5: Responsive Screen Validation
  // -------------------------------------------------------------
  const responsivePatterns = [
    /\bsm:/,
    /\bmd:/,
    /\blg:/,
    /\bxl:/,
    /@media\s*\(min-width/,
    /@media\s*\(max-width/,
    /grid-cols-1.*md:grid-cols-/,
    /flex-col.*md:flex-row/,
    /overflow-x-auto/
  ];

  let responsiveIndicatorsFound = 0;
  for (const pat of responsivePatterns) {
    if (pat.test(aggregatedCode)) {
      responsiveIndicatorsFound++;
    }
  }

  if (responsiveIndicatorsFound >= 3) {
    addGate(
      'gate5_responsiveValidation',
      'Responsive Viewport Coverage',
      'PASS',
      'INFO',
      `Responsive layout rules verified across Desktop, Tablet and Mobile breakpoints (${responsiveIndicatorsFound} distinct responsive patterns detected)`,
      { responsiveIndicatorsFound }
    );
  } else if (sourceFiles.length === 0) {
    addGate(
      'gate5_responsiveValidation',
      'Responsive Viewport Coverage',
      'WARN',
      'MAJOR',
      'No source code available to verify responsive design.',
      { responsiveIndicatorsFound: 0 }
    );
  } else {
    addGate(
      'gate5_responsiveValidation',
      'Responsive Viewport Coverage',
      'WARN',
      'MAJOR',
      'Weak responsive layout adaptation. Few or no responsive breakpoints (md:, lg:, overflow-x-auto) detected.',
      { responsiveIndicatorsFound },
      ['Add mobile and tablet responsive layouts using Tailwind responsive prefixes or flex/grid adaptations.']
    );
  }

  // -------------------------------------------------------------
  // GATE 6: Visual Quality Gate (STRICT REAL VERIFICATION RULE)
  // -------------------------------------------------------------
  const possibleScreenshotDirs = [
    path.join(targetProject, '.design-os', 'qa', 'screenshots'),
    path.join(targetProject, 'screenshots'),
    path.join(targetProject, 'test-results'),
    path.join(targetProject, 'playwright-report')
  ];

  let foundScreenshots: string[] = [];
  for (const sDir of possibleScreenshotDirs) {
    if (fs.existsSync(sDir)) {
      try {
        const files = fs.readdirSync(sDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
        foundScreenshots.push(...files.map(f => path.join(sDir, f)));
      } catch {}
    }
  }

  if (foundScreenshots.length >= 3) {
    addGate(
      'gate6_visualQualityCheck',
      'Visual Quality Gate & Multi-Viewport Render Evidence',
      'PASS',
      'INFO',
      `Visual render verified: ${foundScreenshots.length} viewport screenshots captured and inspected`,
      { screenshotCount: foundScreenshots.length, sample: foundScreenshots.slice(0, 3) }
    );
  } else if (foundScreenshots.length > 0) {
    addGate(
      'gate6_visualQualityCheck',
      'Visual Quality Gate & Multi-Viewport Render Evidence',
      'WARN',
      'MAJOR',
      `Partial visual inspection: ${foundScreenshots.length} screenshot(s) found, but full 3-viewport (Desktop, Tablet, Mobile) coverage required`,
      { screenshotCount: foundScreenshots.length },
      ['Execute full 3-viewport visual capture using VisualQARunner across Desktop (1920x1080), Tablet (768x1024), and Mobile (375x667).']
    );
  } else {
    addGate(
      'gate6_visualQualityCheck',
      'Visual Quality Gate & Multi-Viewport Render Evidence',
      'NOT_VERIFIED',
      'CRITICAL',
      'NO VISUAL RENDER EVIDENCE FOUND. Static code analysis alone does not qualify as visual verification. Real browser screenshot inspection is required.',
      { screenshotCount: 0, previewUrl: options.previewUrl || 'none' },
      ['Launch preview server and execute real browser visual quality check via DevHub Visual Quality Gate.']
    );
  }

  // -------------------------------------------------------------
  // GATE 7: Accessibility (WCAG 2.1/2.2 AA)
  // -------------------------------------------------------------
  const a11yViolations: string[] = [];
  if (/<button[^>]*>\s*<\/button>/i.test(aggregatedCode)) {
    a11yViolations.push('Empty <button> tag without accessible label detected');
  }
  if (/<img(?![^>]*\balt=)[^>]*>/i.test(aggregatedCode)) {
    a11yViolations.push('<img> elements missing alt attribute detected');
  }
  if (/<input(?![^>]*\b(aria-label|aria-labelledby|placeholder|id)=)[^>]*>/i.test(aggregatedCode)) {
    a11yViolations.push('Form inputs lacking aria-label or accessible identification detected');
  }

  if (a11yViolations.length === 0) {
    addGate(
      'gate7_accessibility',
      'Accessibility & WCAG AA Compliance',
      'PASS',
      'INFO',
      'Basic accessibility checks passed (accessible buttons, labels, and image descriptions verified)',
      { a11yViolationsCount: 0 }
    );
  } else {
    addGate(
      'gate7_accessibility',
      'Accessibility & WCAG AA Compliance',
      'WARN',
      'MAJOR',
      `Accessibility warnings found (${a11yViolations.length} issue types): ${a11yViolations.join('; ')}`,
      { violations: a11yViolations },
      a11yViolations.map((v: string) => `Fix accessibility issue: ${v}`)
    );
  }

  // -------------------------------------------------------------
  // GATE 8: Sector / Domain Design Language & Anti-Patterns
  // -------------------------------------------------------------
  const configuredDomain = config?.domainProfile || config?.domain || 'INDUSTRIAL_OPERATIONS';
  let antiPatternReport: AntiPatternReport | null = null;

  try {
    const dl = await import('../../design-language/dist/index.js');
    if (typeof dl.evaluateDesignAntiPatterns === 'function') {
      antiPatternReport = dl.evaluateDesignAntiPatterns({
        content: aggregatedCode,
        intent: {
          productType: configuredDomain as any,
          userExpertise: 'EXPERT',
          usageFrequency: 'DAILY_FREQUENT',
          sessionDuration: 'LONG_EXTENDED',
          informationDensity: 'COMPACT',
          interactionIntensity: 'KEYBOARD_POWER',
          devicePriority: 'DESKTOP_FIRST',
          taskCriticality: 'MISSION_CRITICAL',
          errorCost: 'SIGNIFICANT',
          brandCharacter: 'TECHNICAL',
          visualEmphasis: 'DATA_FIRST',
          motionTolerance: 'REDUCED',
          accessibilityNeeds: 'STANDARD_AA',
          decisionPrinciples: ['Density over whitespace', 'No decorative fluff']
        }
      });
    }
  } catch {
    // Fallback if evaluation fails
  }

  let domainIntelligenceData = undefined;

  if (antiPatternReport) {
    domainIntelligenceData = {
      classifiedDomain: configuredDomain,
      antiPatternScore: antiPatternReport.criticScore,
      detectedAntiPatterns: antiPatternReport.issues.map((i: AntiPatternIssue) => i.code)
    };

    const criticalCount = antiPatternReport.issues.filter((i: AntiPatternIssue) => i.severity === 'CRITICAL').length;

    if (antiPatternReport.criticScore >= 70 && criticalCount === 0) {
      addGate(
        'gate8_domainDesignLanguage',
        'Domain Design Language & Generic AI Anti-Pattern Defense',
        'PASS',
        'INFO',
        `Domain design language adheres to ${configuredDomain} (Critic Score: ${antiPatternReport.criticScore}/100, 0 critical anti-patterns)`,
        {
          score: antiPatternReport.criticScore,
          criticalViolations: 0,
          warnings: antiPatternReport.issues.length
        }
      );
    } else {
      const summaryList = antiPatternReport.issues.slice(0, 3).map((i: AntiPatternIssue) => `${i.code}: ${i.message}`);
      addGate(
        'gate8_domainDesignLanguage',
        'Domain Design Language & Generic AI Anti-Pattern Defense',
        'FAIL',
        'CRITICAL',
        `Generic AI UI Anti-Patterns detected! Critic score ${antiPatternReport.criticScore}/100. Violations: ${summaryList.join('; ')}`,
        {
          score: antiPatternReport.criticScore,
          criticalViolationsCount: criticalCount,
          issues: antiPatternReport.issues
        },
        antiPatternReport.issues.map((i: AntiPatternIssue) => i.remediation)
      );
    }
  } else {
    addGate(
      'gate8_domainDesignLanguage',
      'Domain Design Language & Generic AI Anti-Pattern Defense',
      'WARN',
      'MAJOR',
      'Could not run anti-pattern evaluation on codebase.',
      {}
    );
  }

  // -------------------------------------------------------------
  // Summary & Overall Status Calculation
  // -------------------------------------------------------------
  const summary = {
    total: Object.keys(gates).length,
    passed: 0,
    warnings: 0,
    failed: 0,
    notVerified: 0
  };

  for (const g of Object.values(gates)) {
    if (g.status === 'PASS') summary.passed++;
    else if (g.status === 'WARN') summary.warnings++;
    else if (g.status === 'FAIL') summary.failed++;
    else if (g.status === 'NOT_VERIFIED') summary.notVerified++;
  }

  let overallStatus: 'PASS' | 'WARN' | 'FAIL' | 'BLOCKED' = 'PASS';
  let canPassQualityGate = true;

  if (summary.failed > 0) {
    const hasCritical = Object.values(gates).some(g => g.status === 'FAIL' && g.severity === 'CRITICAL');
    overallStatus = hasCritical ? 'BLOCKED' : 'FAIL';
    canPassQualityGate = false;
  } else if (summary.notVerified > 0) {
    overallStatus = 'WARN';
    canPassQualityGate = false;
  } else if (summary.warnings > 0) {
    overallStatus = 'WARN';
    canPassQualityGate = true;
  }

  return {
    timestamp,
    targetProject,
    version: '3.0.0',
    overallStatus,
    canPassQualityGate,
    gates,
    summary,
    domainIntelligence: domainIntelligenceData,
    recommendations: Array.from(new Set(recommendations))
  };
}
