import { describe, it, expect } from 'vitest';
import {
  synthesizeUserJourneys,
  generatePlaywrightTestCode,
  analyzeRuntimeDiagnostics,
  evaluateVisualDiff,
  generateViewportMatrix,
  correlatePerformanceDiagnostics,
  createTestStrategy,
  createQAReport,
  UserJourneySchema,
  QAReportSchema
} from '@alper-design-os/qa-engine';
import { inferProductUXProfile } from '@alper-design-os/design-core';

describe('Browser, QA & Verification Engine', () => {
  describe('User Journey Synthesis', () => {
    it('synthesizes typed UserJourney models from ProductUXProfile without domain hardcoding', () => {
      const brief = {
        name: 'WarehouseFlow',
        domain: 'Inventory Logistics',
        description: 'Warehouse barcode picking and packing operations workbench.',
        targetUsers: ['Warehouse Picker'],
        keyFeatures: ['pick wave allocation', 'bin scan verification', 'dock door dispatch'],
        operatingEnvironment: 'Rugged forklift terminal'
      };

      const profile = inferProductUXProfile(brief);
      const journeys = synthesizeUserJourneys(profile);

      expect(journeys.length).toBeGreaterThan(0);
      for (const journey of journeys) {
        expect(UserJourneySchema.safeParse(journey).success).toBe(true);
        expect(journey.steps.length).toBeGreaterThan(0);
        expect(journey.failureStates.length).toBeGreaterThan(0);
        expect(journey.performanceBudget.maxFlowDurationMs).toBeGreaterThan(0);
      }
    });
  });

  describe('Playwright Test Generator', () => {
    it('generates clean, role-based Playwright test code with accessibility steps', () => {
      const journey = {
        id: 'journey-order-checkout',
        persona: 'Online Retail Shopper',
        goal: 'Complete Online Checkout',
        preconditions: ['Cart has 1 item'],
        steps: [
          'Navigate to cart review pane',
          'Fill shipping destination details',
          'Submit order payment'
        ],
        criticality: 'MISSION_CRITICAL' as const,
        expectedOutcome: 'Order confirmation screen rendered',
        failureStates: ['EMPTY_CART', 'PAYMENT_GATEWAY_TIMEOUT'],
        performanceBudget: { maxFlowDurationMs: 4000, maxStepLatencyMs: 1000 },
        accessibilityRequirements: { keyboardOnlyNavigable: true, announceLiveRegions: true, minTouchTargetPx: 44 }
      };

      const scenario = generatePlaywrightTestCode(journey, { baseURL: 'https://app.test' });
      expect(scenario.generatedCode).toContain("test.describe('Journey: Complete Online Checkout'");
      expect(scenario.generatedCode).toContain('AxeBuilder');
      expect(scenario.generatedCode).toContain('getByRole');
      expect(scenario.browserEngines).toContain('chromium');
    });
  });

  describe('Chrome DevTools Runtime Diagnostics', () => {
    it('identifies unhandled console errors, failed network requests, and CORS violations', () => {
      const consoleEvents = [
        {
          type: 'error' as const,
          text: 'Uncaught TypeError: Cannot read properties of undefined (reading "id")',
          location: 'app.js:42',
          timestamp: '2026-10-09T10:00:00Z'
        }
      ];

      const networkEvents = [
        {
          url: 'https://api.test/v1/orders',
          method: 'POST',
          status: 500,
          durationMs: 1200,
          failed: true,
          errorDescription: 'Internal Server Error',
          corsFailure: false,
          cspViolation: false,
          mixedContent: false
        },
        {
          url: 'https://thirdparty.test/data',
          method: 'GET',
          status: 0,
          durationMs: 50,
          failed: true,
          corsFailure: true,
          cspViolation: false,
          mixedContent: false
        }
      ];

      const diagnostics = analyzeRuntimeDiagnostics(consoleEvents, networkEvents);
      expect(diagnostics.isClean).toBe(false);
      expect(diagnostics.totalErrors).toBe(1);
      expect(diagnostics.failedRequestsCount).toBe(2);
      expect(diagnostics.corsViolationsCount).toBe(1);
      expect(diagnostics.slowRequestsCount).toBe(1);
      expect(diagnostics.insights.some((i) => i.includes('Uncaught TypeError'))).toBe(true);
      expect(diagnostics.insights.some((i) => i.includes('CORS Blocked'))).toBe(true);
    });

    it('confirms clean runtime when no console or network failures occur', () => {
      const diagnostics = analyzeRuntimeDiagnostics([], [
        {
          url: 'https://api.test/v1/health',
          method: 'GET',
          status: 200,
          durationMs: 80,
          failed: false,
          corsFailure: false,
          cspViolation: false,
          mixedContent: false
        }
      ]);
      expect(diagnostics.isClean).toBe(true);
      expect(diagnostics.totalErrors).toBe(0);
      expect(diagnostics.failedRequestsCount).toBe(0);
    });
  });

  describe('Visual Regression & Viewport Matrix', () => {
    it('provides multi-viewport matrix (Desktop, Laptop, Tablet, Mobile)', () => {
      const viewports = generateViewportMatrix();
      expect(viewports.length).toBe(4);
      expect(viewports.map((v) => v.name)).toEqual(['DESKTOP_1920', 'LAPTOP_1440', 'TABLET_768', 'MOBILE_390']);
    });

    it('requires explicit review when visual diff exceeds baseline threshold', () => {
      const diffReport = evaluateVisualDiff({
        testId: 'homepage-hero',
        viewport: 'DESKTOP_1920',
        state: 'default',
        colorMode: 'DARK',
        diffPercentage: 2.45
      });

      expect(diffReport.passed).toBe(false);
      expect(diffReport.requiresReview).toBe(true);
      expect(diffReport.approved).toBe(false);
    });

    it('passes visual check when diff is zero or negligible', () => {
      const diffReport = evaluateVisualDiff({
        testId: 'button-hover',
        viewport: 'MOBILE_390',
        diffPercentage: 0.0
      });

      expect(diffReport.passed).toBe(true);
      expect(diffReport.requiresReview).toBe(false);
      expect(diffReport.approved).toBe(true);
    });
  });

  describe('Performance Correlator (Lighthouse + DevTools Trace)', () => {
    it('correlates Lighthouse LCP deficits with heavy media and render-blocking scripts in trace', () => {
      const correlation = correlatePerformanceDiagnostics({
        url: 'https://app.test',
        lcpMs: 4200, // Deficit (> 2500ms)
        inpMs: 120,  // Good (< 200ms)
        cls: 0.02,   // Good (< 0.1)
        traceDetails: {
          heavyImages: [{ url: 'https://app.test/hero.png', sizeBytes: 4.3 * 1024 * 1024 }],
          renderBlockingScripts: ['bundle.js', 'analytics.js']
        }
      });

      expect(correlation.performanceScore).toBeLessThan(80);
      expect(correlation.rootCauseInsights.some((i) => i.includes('LCP Deficit'))).toBe(true);
      expect(correlation.rootCauseInsights.some((i) => i.includes('4.3MB'))).toBe(true);
    });
  });

  describe('Testing Pyramid Strategy', () => {
    it('generates tailored layer strategy for simple landing page vs enterprise ERP vs microservice', () => {
      const landingStrategy = createTestStrategy({ name: 'LandingPage', projectType: 'LANDING_PAGE' });
      expect(landingStrategy.recommendedLayers).toContain('SMOKE');
      expect(landingStrategy.recommendedLayers).toContain('VISUAL_REGRESSION');
      expect(landingStrategy.recommendedLayers).not.toContain('CONTRACT');

      const erpStrategy = createTestStrategy({ name: 'EnterpriseERP', projectType: 'ENTERPRISE_ERP_CRM' });
      expect(erpStrategy.recommendedLayers).toContain('UNIT');
      expect(erpStrategy.recommendedLayers).toContain('INTEGRATION');
      expect(erpStrategy.recommendedLayers).toContain('E2E');
      expect(erpStrategy.recommendedLayers).toContain('API');

      const microserviceStrategy = createTestStrategy({ name: 'AuthService', projectType: 'MICROSERVICE_API' });
      expect(microserviceStrategy.recommendedLayers).toContain('CONTRACT');
      expect(microserviceStrategy.recommendedLayers).toContain('LOAD');
      expect(microserviceStrategy.recommendedLayers).not.toContain('VISUAL_REGRESSION');
    });
  });

  describe('QA Report Generator & Transparency', () => {
    it('generates QA_REPORT.md with unverified areas explicitly documented (never falsely reports PASS)', () => {
      const { report, markdown } = createQAReport({
        targetApplication: 'ApexPortal v2',
        testedFlows: ['User Login Flow', 'Order Submission Flow'],
        testedBrowsers: ['Chromium', 'Firefox'],
        testedViewports: ['DESKTOP_1920', 'MOBILE_390'],
        accessibilityFindings: [],
        failedTests: []
      });

      expect(QAReportSchema.safeParse(report).success).toBe(true);
      expect(report.overallStatus).toBe('PASS');
      expect(report.unverifiedAreas.length).toBeGreaterThan(0);
      expect(markdown).toContain('# QA & Verification Report: ApexPortal v2');
      expect(markdown).toContain('CRITICAL TRANSPARENCY NOTICE');
      expect(markdown).toContain('Tested User Flows');
    });
  });
});
