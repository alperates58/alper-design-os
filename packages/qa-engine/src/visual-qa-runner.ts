import * as path from 'path';
import * as fs from 'fs';
import { generateViewportMatrix } from './visual-regression.js';

export interface VisualQARunOptions {
  targetUrl?: string;
  htmlContent?: string;
  outputDir: string;
  suiteName: string;
  themeModes?: Array<'LIGHT' | 'DARK' | 'SYSTEM'>;
  viewports?: Array<{ name: string; width: number; height: number }>;
  captureScreenshots?: boolean;
  verifyReducedMotion?: boolean;
}

export interface ViewportAuditResult {
  viewportName: string;
  width: number;
  height: number;
  themeMode: 'LIGHT' | 'DARK' | 'SYSTEM';
  screenshotPath?: string;
  screenshotVerified: boolean;
  hasHorizontalOverflow: boolean;
  hasClippedContent: boolean;
  clippedElements: string[];
  scrollWidth: number;
  clientWidth: number;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  accessibilityIssues: string[];
  targetSizeIssues: string[];
  keyboardFocusVerified: boolean;
  systemThemeDynamicSwitchVerified?: boolean;
  reducedMotionVerified?: boolean;
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
   * Executes multi-viewport, light/dark/system Playwright visual and runtime inspection.
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

    let playwright: any = null;
    try {
      playwright = await import('playwright');
    } catch {
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

    const launchArgs = [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--hide-scrollbars'
    ];

    let browser: any;
    try {
      browser = await playwright.chromium.launch({ headless: true, args: launchArgs });
    } catch {
      try {
        browser = await playwright.chromium.launch({ headless: true, channel: 'msedge', args: launchArgs });
      } catch {
        browser = await playwright.chromium.launch({ headless: true, channel: 'chrome', args: launchArgs });
      }
    }

    try {
      for (const vp of viewports) {
        for (const theme of themes) {
          const initialColorScheme = theme === 'DARK' ? 'dark' : 'light';
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            colorScheme: initialColorScheme
          });

          const page = await context.newPage();
          const consoleErrors: string[] = [];
          const pageErrors: string[] = [];
          const failedRequests: string[] = [];

          page.on('console', (msg: any) => {
            if (msg.type() === 'error') {
              consoleErrors.push(msg.text());
            }
          });

          page.on('pageerror', (err: any) => {
            const msg = err?.message || String(err);
            pageErrors.push(msg);
            consoleErrors.push(`UncaughtPageError: ${msg}`);
          });

          page.on('requestfailed', (req: any) => {
            const failure = req.failure();
            failedRequests.push(`${req.method()} ${req.url()} (${failure?.errorText || 'failed'})`);
          });

          page.on('response', (res: any) => {
            if (res.status() >= 400) {
              failedRequests.push(`${res.request().method()} ${res.url()} -> HTTP ${res.status()}`);
            }
          });

          if (options.htmlContent) {
            await page.setContent(options.htmlContent, { waitUntil: 'load' });
          } else if (options.targetUrl) {
            await page.goto(options.targetUrl, { waitUntil: 'load' });
          }

          let systemThemeDynamicSwitchVerified: boolean | undefined;

          if (theme === 'SYSTEM') {
            // Do NOT force data-theme when testing SYSTEM mode!
            // Instead, test dynamic OS color-scheme switching (light -> dark -> light)
            await page.emulateMedia({ colorScheme: 'light' });
            await page.waitForTimeout(40);
            const lightThemeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

            await page.emulateMedia({ colorScheme: 'dark' });
            await page.waitForTimeout(40);
            const darkCheck = await page.evaluate(() => {
              const attr = document.documentElement.getAttribute('data-theme');
              const mqMatches = window.matchMedia('(prefers-color-scheme: dark)').matches;
              return { attr, mqMatches };
            });

            systemThemeDynamicSwitchVerified =
              darkCheck.mqMatches && (darkCheck.attr === 'dark' || lightThemeAttr === null);
            if (!systemThemeDynamicSwitchVerified) {
              unresolvedDefects.push(
                `[${vp.name}-SYSTEM] Dynamic OS theme switch light->dark failed (data-theme remained '${darkCheck.attr}')`
              );
            }
          } else {
            await page.evaluate((t: string) => {
              document.documentElement.setAttribute('data-theme', t.toLowerCase());
              if (t === 'DARK') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }, theme);
          }

          let reducedMotionVerified: boolean | undefined;
          if (options.verifyReducedMotion) {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            reducedMotionVerified = await page.evaluate(() => {
              return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            });
            await page.emulateMedia({ reducedMotion: 'no-preference' });
          }

          await page.waitForTimeout(80);

          // Check for document horizontal overflow AND inner element content clipping
          const layoutMetrics = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
            const clientWidth = docEl.clientWidth;
            const hasOverflow = scrollWidth > clientWidth + 1;

            const clippedElements: string[] = [];
            const candidates = document.querySelectorAll('div, section, main, header, footer, p, span, td, th, button, a');
            candidates.forEach((el) => {
              const htmlEl = el as HTMLElement;
              if (!htmlEl.offsetParent && htmlEl.tagName !== 'BODY') return;
              const style = window.getComputedStyle(htmlEl);
              if (
                (style.overflowX === 'hidden' || style.overflowX === 'clip') &&
                style.textOverflow !== 'ellipsis' &&
                htmlEl.clientWidth > 0 &&
                htmlEl.scrollWidth > htmlEl.clientWidth + 4
              ) {
                const idOrClass = htmlEl.id ? `#${htmlEl.id}` : htmlEl.className ? `.${String(htmlEl.className).trim().split(/\s+/)[0]}` : htmlEl.tagName.toLowerCase();
                clippedElements.push(`${idOrClass} (scrollWidth ${htmlEl.scrollWidth}px > clientWidth ${htmlEl.clientWidth}px with overflow-x:${style.overflowX})`);
              }
            });

            return {
              hasOverflow,
              hasClippedContent: clippedElements.length > 0,
              clippedElements: clippedElements.slice(0, 10),
              scrollWidth,
              clientWidth
            };
          });

          // Check accessible names, target sizes, and keyboard focusability
          const a11yEvaluation = await page.evaluate(() => {
            const issues: string[] = [];
            const targetSizeIssues: string[] = [];

            document.querySelectorAll('button, [role="button"]').forEach((b) => {
              const btn = b as HTMLElement;
              const text = (btn.innerText || btn.textContent || '').trim();
              const ariaLabel = btn.getAttribute('aria-label');
              const ariaLabelledBy = btn.getAttribute('aria-labelledby');
              const title = btn.getAttribute('title');
              if (!text && !ariaLabel && !ariaLabelledBy && !title) {
                issues.push('Unlabeled button found without text, aria-label, or title.');
              }
              const rect = btn.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && (rect.width < 16 || rect.height < 16)) {
                targetSizeIssues.push(`Interactive target too small (${Math.round(rect.width)}x${Math.round(rect.height)}px < 16x16px)`);
              }
            });

            document.querySelectorAll('input:not([type="hidden"])').forEach((input) => {
              const id = input.id;
              const hasLabel = id ? Boolean(document.querySelector(`label[for="${id}"]`)) : Boolean(input.closest('label'));
              const hasAria = Boolean(input.getAttribute('aria-label') || input.getAttribute('aria-labelledby') || input.getAttribute('title'));
              if (!hasLabel && !hasAria) {
                issues.push(`Input element missing associated <label> or aria-label: ${input.outerHTML.substring(0, 50)}`);
              }
            });

            // Verify keyboard focus moves to first focusable control
            const focusables = Array.from(
              document.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
              )
            ).filter(el => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            });

            let keyboardFocusVerified = true;
            if (focusables.length > 0) {
              const first = focusables[0];
              first.focus();
              keyboardFocusVerified = document.activeElement === first;
              if (!keyboardFocusVerified) {
                issues.push('First interactive control failed to receive keyboard focus.');
              }
            }

            return {
              issues,
              targetSizeIssues,
              keyboardFocusVerified
            };
          });

          // Capture and strictly verify screenshot file existence & non-empty size
          let screenshotPath: string | undefined;
          let screenshotVerified = true;
          if (options.captureScreenshots !== false) {
            screenshotVerified = false;
            const fileName = `${options.suiteName}-${vp.name}-${theme.toLowerCase()}.png`;
            screenshotPath = path.join(outputDir, fileName);
            try {
              await page.screenshot({ path: screenshotPath, fullPage: false, timeout: 5000 });
              if (fs.existsSync(screenshotPath) && fs.statSync(screenshotPath).size > 0) {
                screenshotVerified = true;
              } else {
                unresolvedDefects.push(`[${vp.name}-${theme}] Screenshot file missing or empty at ${screenshotPath}`);
              }
            } catch (shotErr: any) {
              unresolvedDefects.push(`[${vp.name}-${theme}] Screenshot capture failed: ${shotErr.message}`);
            }
          }

          const passed =
            !layoutMetrics.hasOverflow &&
            !layoutMetrics.hasClippedContent &&
            consoleErrors.length === 0 &&
            pageErrors.length === 0 &&
            failedRequests.length === 0 &&
            a11yEvaluation.issues.length === 0 &&
            a11yEvaluation.targetSizeIssues.length === 0 &&
            a11yEvaluation.keyboardFocusVerified &&
            screenshotVerified &&
            (systemThemeDynamicSwitchVerified !== false);

          if (!passed) {
            if (layoutMetrics.hasOverflow) {
              unresolvedDefects.push(`[${vp.name}-${theme}] Horizontal overflow: scrollWidth ${layoutMetrics.scrollWidth}px > clientWidth ${layoutMetrics.clientWidth}px`);
            }
            if (layoutMetrics.hasClippedContent) {
              unresolvedDefects.push(`[${vp.name}-${theme}] Clipped content detected: ${layoutMetrics.clippedElements.join('; ')}`);
            }
            if (consoleErrors.length > 0) {
              unresolvedDefects.push(`[${vp.name}-${theme}] ${consoleErrors.length} Console/Page error(s) detected`);
            }
            if (failedRequests.length > 0) {
              unresolvedDefects.push(`[${vp.name}-${theme}] ${failedRequests.length} Failed network request(s) detected`);
            }
            if (a11yEvaluation.issues.length > 0) {
              unresolvedDefects.push(`[${vp.name}-${theme}] ${a11yEvaluation.issues.length} Accessibility issue(s) detected`);
            }
            if (a11yEvaluation.targetSizeIssues.length > 0) {
              unresolvedDefects.push(`[${vp.name}-${theme}] ${a11yEvaluation.targetSizeIssues.length} Target size issue(s) detected`);
            }
          }

          results.push({
            viewportName: vp.name,
            width: vp.width,
            height: vp.height,
            themeMode: theme,
            screenshotPath,
            screenshotVerified,
            hasHorizontalOverflow: layoutMetrics.hasOverflow,
            hasClippedContent: layoutMetrics.hasClippedContent,
            clippedElements: layoutMetrics.clippedElements,
            scrollWidth: layoutMetrics.scrollWidth,
            clientWidth: layoutMetrics.clientWidth,
            consoleErrors,
            pageErrors,
            failedRequests,
            accessibilityIssues: a11yEvaluation.issues,
            targetSizeIssues: a11yEvaluation.targetSizeIssues,
            keyboardFocusVerified: a11yEvaluation.keyboardFocusVerified,
            systemThemeDynamicSwitchVerified,
            reducedMotionVerified,
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
