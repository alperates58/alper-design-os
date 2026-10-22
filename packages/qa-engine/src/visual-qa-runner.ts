import * as path from 'path';
import * as fs from 'fs';
import { generateViewportMatrix } from './visual-regression.js';

export interface VisualQARunOptions {
  targetUrl?: string;
  htmlContent?: string;
  outputDir: string;
  suiteName: string;
  themeModes?: Array<'LIGHT' | 'DARK'>;
  viewports?: Array<{ name: string; width: number; height: number }>;
  captureScreenshots?: boolean;
}

export interface ViewportAuditResult {
  viewportName: string;
  width: number;
  height: number;
  themeMode: 'LIGHT' | 'DARK';
  screenshotPath?: string;
  hasHorizontalOverflow: boolean;
  scrollWidth: number;
  clientWidth: number;
  consoleErrors: string[];
  accessibilityIssues: string[];
  passed: boolean;
}

export interface VisualQASuiteReport {
  suiteName: string;
  timestamp: string;
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  results: ViewportAuditResult[];
  unresolvedDefects: string[];
  overallStatus: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'FAILED';
}

export class VisualQARunner {
  /**
   * Executes multi-viewport, light/dark Playwright visual inspection.
   */
  public async runInspection(options: VisualQARunOptions): Promise<VisualQASuiteReport> {
    const outputDir = path.resolve(options.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const viewports = options.viewports || generateViewportMatrix();
    const themes = options.themeModes || ['LIGHT', 'DARK'];
    const results: ViewportAuditResult[] = [];
    const unresolvedDefects: string[] = [];

    // Dynamically load playwright to avoid hard dependency failures in environments where browsers are optional
    let playwright: any = null;
    try {
      playwright = await import('playwright');
    } catch {
      // Return partial verification report if playwright is not installed
      return {
        suiteName: options.suiteName,
        timestamp: new Date().toISOString(),
        totalRuns: viewports.length * themes.length,
        passedRuns: 0,
        failedRuns: viewports.length * themes.length,
        results: [],
        unresolvedDefects: ['Playwright browser runtime not available in current environment'],
        overallStatus: 'FAILED'
      };
    }

    let browser: any;
    try {
      browser = await playwright.chromium.launch({ headless: true });
    } catch {
      // Fallback chain for corporate/restricted environments: msedge -> chrome
      try {
        browser = await playwright.chromium.launch({ headless: true, channel: 'msedge' });
      } catch {
        browser = await playwright.chromium.launch({ headless: true, channel: 'chrome' });
      }
    }

    try {
      for (const vp of viewports) {
        for (const theme of themes) {
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            colorScheme: theme === 'DARK' ? 'dark' : 'light'
          });

          const page = await context.newPage();
          const consoleErrors: string[] = [];
          page.on('console', (msg: any) => {
            if (msg.type() === 'error') {
              consoleErrors.push(msg.text());
            }
          });

          if (options.htmlContent) {
            await page.setContent(options.htmlContent, { waitUntil: 'load' });
          } else if (options.targetUrl) {
            await page.goto(options.targetUrl, { waitUntil: 'load' });
          }

          // Force theme attribute
          await page.evaluate((t: string) => {
            document.documentElement.setAttribute('data-theme', t.toLowerCase());
            if (t === 'DARK') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }, theme);

          // Allow any transitions to settle
          await page.waitForTimeout(100);

          // Check for horizontal overflow
          const overflowMetrics = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
            const clientWidth = docEl.clientWidth;
            return {
              hasOverflow: scrollWidth > clientWidth + 1, // 1px tolerance for subpixel rounding
              scrollWidth,
              clientWidth
            };
          });

          // Check basic accessibility markers
          const a11yIssues = await page.evaluate(() => {
            const issues: string[] = [];
            // Unlabeled buttons
            document.querySelectorAll('button').forEach((b) => {
              if (!b.innerText.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')) {
                issues.push('Unlabeled button found without text, aria-label, or title.');
              }
            });
            // Inputs without associated label
            document.querySelectorAll('input:not([type="hidden"])').forEach((input) => {
              const id = input.id;
              const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : false;
              const hasAria = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
              if (!hasLabel && !hasAria) {
                issues.push(`Input element missing associated <label> or aria-label: ${input.outerHTML.substring(0, 50)}`);
              }
            });
            return issues;
          });

          // Capture real screenshot
          let screenshotPath: string | undefined;
          if (options.captureScreenshots !== false) {
            const fileName = `${options.suiteName}-${vp.name}-${theme.toLowerCase()}.png`;
            screenshotPath = path.join(outputDir, fileName);
            await page.screenshot({ path: screenshotPath, fullPage: false });
          }

          const passed = !overflowMetrics.hasOverflow && consoleErrors.length === 0 && a11yIssues.length === 0;

          if (!passed) {
            if (overflowMetrics.hasOverflow) {
              unresolvedDefects.push(`[${vp.name}-${theme}] Horizontal overflow: scrollWidth ${overflowMetrics.scrollWidth}px > clientWidth ${overflowMetrics.clientWidth}px`);
            }
            if (consoleErrors.length > 0) {
              unresolvedDefects.push(`[${vp.name}-${theme}] ${consoleErrors.length} Console error(s) detected`);
            }
            if (a11yIssues.length > 0) {
              unresolvedDefects.push(`[${vp.name}-${theme}] ${a11yIssues.length} Accessibility issue(s) detected`);
            }
          }

          results.push({
            viewportName: vp.name,
            width: vp.width,
            height: vp.height,
            themeMode: theme,
            screenshotPath,
            hasHorizontalOverflow: overflowMetrics.hasOverflow,
            scrollWidth: overflowMetrics.scrollWidth,
            clientWidth: overflowMetrics.clientWidth,
            consoleErrors,
            accessibilityIssues: a11yIssues,
            passed
          });

          await context.close();
        }
      }
    } finally {
      await browser.close();
    }

    const passedRuns = results.filter((r) => r.passed).length;
    const failedRuns = results.length - passedRuns;
    const overallStatus = failedRuns === 0 ? 'VERIFIED' : passedRuns > 0 ? 'PARTIALLY_VERIFIED' : 'FAILED';

    return {
      suiteName: options.suiteName,
      timestamp: new Date().toISOString(),
      totalRuns: results.length,
      passedRuns,
      failedRuns,
      results,
      unresolvedDefects,
      overallStatus
    };
  }
}
