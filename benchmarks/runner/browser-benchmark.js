import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'large-desktop', width: 1920, height: 1080 }
];

export async function runBrowserBenchmark({
  brokenUrl,
  goldenUrl,
  screenshotDir = null
}) {
  const browser = await chromium.launch({ headless: true });
  const results = {
    testedAt: new Date().toISOString(),
    viewportsTested: VIEWPORTS.map((v) => `${v.name} (${v.width}x${v.height})`),
    brokenAppFindings: {
      consoleErrors: [],
      networkFailures: [],
      duplicateRequests: [],
      layoutOverflows: [],
      accessibilityViolations: [],
      keyboardIssues: [],
      clippingIssues: [],
      silentErrorStates: [],
      designViolations: [],
      screenshots: []
    },
    goldenAppFindings: {
      consoleErrors: [],
      networkFailures: [],
      duplicateRequests: [],
      layoutOverflows: [],
      accessibilityViolations: [],
      keyboardIssues: [],
      clippingIssues: [],
      silentErrorStates: [],
      designViolations: [],
      screenshots: []
    },
    chromeDevToolsMcpStatus: 'UNVERIFIED (Chrome DevTools MCP inspected; host remote debugging endpoint not active in headless CI runner)'
  };

  if (screenshotDir && !fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  async function inspectPage(url, appName, findingsRef) {
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleLogs = [];
    const requests = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
      if (msg.type() === 'error') {
        findingsRef.consoleErrors.push({ app: appName, message: msg.text() });
      }
    });

    page.on('request', (req) => {
      requests.push({ url: req.url(), method: req.method() });
    });

    page.on('response', (res) => {
      if (res.status() >= 400) {
        failedRequests.push({ url: res.url(), status: res.status() });
        findingsRef.networkFailures.push({ app: appName, url: res.url(), status: res.status() });
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText || 'Unknown' });
      findingsRef.networkFailures.push({ app: appName, url: req.url(), status: 0 });
    });

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'networkidle' });

      // Layout Overflow check
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalScroll) {
        findingsRef.layoutOverflows.push({
          viewport: vp.name,
          width: vp.width,
          scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth)
        });
      }

      // Screenshot capture
      if (screenshotDir) {
        const screenshotPath = path.join(screenshotDir, `${appName}-${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        findingsRef.screenshots.push({ viewport: vp.name, path: screenshotPath });
      }
    }

    // Duplicate network request analysis (detects if multiple requests are made per page view)
    const urlCounts = {};
    for (const r of requests) {
      urlCounts[r.url] = (urlCounts[r.url] || 0) + 1;
    }
    for (const [reqUrl, count] of Object.entries(urlCounts)) {
      if (count > VIEWPORTS.length && reqUrl.includes('/api/status')) {
        findingsRef.duplicateRequests.push({ url: reqUrl, count: Math.round(count / VIEWPORTS.length) });
      }
    }

    // Accessibility & Label Audit
    const missingLabels = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'));
      return inputs
        .filter((input) => {
          const id = input.id;
          const hasLabelFor = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
          return !hasLabelFor && !hasAriaLabel;
        })
        .map((i) => i.id || i.name || i.placeholder || 'unnamed-input');
    });

    if (missingLabels.length > 0) {
      findingsRef.accessibilityViolations.push(...missingLabels);
    }

    // Keyboard & Focus usability check (detects interactive elements removed from tab order)
    const keyboardIssues = await page.evaluate(() => {
      const interactive = Array.from(document.querySelectorAll('button, a, [role="button"]'));
      return interactive
        .filter((el) => {
          const tabIndex = el.getAttribute('tabindex');
          return tabIndex === '-1';
        })
        .map((el) => el.className || el.id || el.tagName);
    });

    if (keyboardIssues.length > 0) {
      findingsRef.keyboardIssues.push(...keyboardIssues);
    }

    // Responsive clipping check
    const clippingDetected = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.clipped-card-content, .card'));
      return cards.some((c) => {
        const s = window.getComputedStyle(c);
        return s.overflow === 'hidden' && parseInt(s.height, 10) < 40 && c.textContent.length > 80;
      });
    });

    if (clippingDetected) {
      findingsRef.clippingIssues.push('Card description clipped by fixed height and overflow:hidden');
    }

    // Silent error state check on form submit
    const hasSilentErrorState = await page.evaluate(() => {
      const form = document.querySelector('form');
      const input = document.querySelector('input[type="text"]');
      const feedback = document.querySelector('#form-feedback, .feedback-container');
      if (form && input) {
        input.value = '';
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        const isShown = feedback && window.getComputedStyle(feedback).display !== 'none' && feedback.textContent.trim().length > 0;
        return !isShown;
      }
      return false;
    });

    if (hasSilentErrorState) {
      findingsRef.silentErrorStates.push('Form submission with empty input produced no visual error feedback');
    }

    // Design consistency check (font and neon color inspection)
    const designIssues = await page.evaluate(() => {
      const banners = Array.from(document.querySelectorAll('.inconsistent-banner, .announcement-banner'));
      return banners.some((b) => {
        const style = window.getComputedStyle(b);
        return style.fontFamily.toLowerCase().includes('comic sans') || style.color === 'rgb(255, 0, 255)';
      });
    });

    if (designIssues) {
      findingsRef.designViolations.push('Conflicting Comic Sans typography and hardcoded magenta #ff00ff');
    }

    await context.close();
  }

  try {
    // 1. Inspect Broken Web App
    await inspectPage(brokenUrl, 'broken-web', results.brokenAppFindings);

    // 2. Inspect Golden Web App
    await inspectPage(goldenUrl, 'golden-web', results.goldenAppFindings);
  } finally {
    await browser.close();
  }

  return results;
}
