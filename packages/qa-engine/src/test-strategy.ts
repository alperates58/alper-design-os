import { TestingLayer, TestPyramidStrategy, TestPyramidStrategySchema } from './types.js';

export interface ProjectContextInput {
  name: string;
  projectType?: 'LANDING_PAGE' | 'ENTERPRISE_ERP_CRM' | 'MICROSERVICE_API' | 'GENERIC_SPA';
  hasBackend?: boolean;
  hasApi?: boolean;
  hasPublicUI?: boolean;
  isHighScale?: boolean;
}

export function createTestStrategy(context: ProjectContextInput): TestPyramidStrategy {
  const type = context.projectType || 'GENERIC_SPA';
  const recommendedLayers: TestingLayer[] = [];
  const skippedLayers: TestingLayer[] = [];
  const rationales: Record<string, string> = {};

  if (type === 'LANDING_PAGE') {
    recommendedLayers.push('SMOKE', 'ACCESSIBILITY', 'VISUAL_REGRESSION', 'PERFORMANCE');
    rationales['SMOKE'] = 'Verify basic HTTP availability and DOM element rendering.';
    rationales['ACCESSIBILITY'] = 'Public storefront requires strict WCAG compliance.';
    rationales['VISUAL_REGRESSION'] = 'Brand aesthetics and multi-viewport layout consistency.';
    rationales['PERFORMANCE'] = 'Lighthouse Core Web Vitals critical for search ranking and bounce rate.';

    skippedLayers.push('CONTRACT', 'LOAD', 'MUTATION', 'UNIT');
  } else if (type === 'ENTERPRISE_ERP_CRM') {
    recommendedLayers.push(
      'UNIT',
      'INTEGRATION',
      'E2E',
      'ACCESSIBILITY',
      'VISUAL_REGRESSION',
      'API',
      'REGRESSION',
      'PERFORMANCE'
    );
    rationales['UNIT'] = 'Validate complex business calculations, constraints, and state transitions.';
    rationales['INTEGRATION'] = 'Ensure database transactions and repository operations execute correctly.';
    rationales['E2E'] = 'Verify multi-step operator workflows across split panes and data grids.';
    rationales['ACCESSIBILITY'] = 'Keyboard-heavy enterprise accessibility and ARIA grid navigation.';
    rationales['API'] = 'Verify transactional API responses, auth tokens, and validation schemas.';
    rationales['PERFORMANCE'] = 'Dense grid render times and sub-second operational responsiveness.';

    skippedLayers.push('LOAD', 'CONTRACT');
  } else if (type === 'MICROSERVICE_API') {
    recommendedLayers.push('UNIT', 'INTEGRATION', 'API', 'CONTRACT', 'LOAD', 'SECURITY');
    rationales['UNIT'] = 'Isolated business domain logic testing.';
    rationales['INTEGRATION'] = 'Database and message queue integration verification.';
    rationales['API'] = 'REST/gRPC schema and status code conformance.';
    rationales['CONTRACT'] = 'Pact consumer-driven contracts to prevent breaking upstream/downstream services.';
    rationales['LOAD'] = 'k6 API throughput and latency benchmarking under concurrent traffic.';
    rationales['SECURITY'] = 'BOLA, authentication, and rate limiting validation.';

    skippedLayers.push('VISUAL_REGRESSION', 'ACCESSIBILITY');
  } else {
    // Default Balanced Web App
    recommendedLayers.push('UNIT', 'INTEGRATION', 'E2E', 'ACCESSIBILITY', 'SMOKE');
    rationales['UNIT'] = 'Core component and utility correctness.';
    rationales['INTEGRATION'] = 'Component-state interaction tests.';
    rationales['E2E'] = 'Primary user conversion journey verification.';
    rationales['ACCESSIBILITY'] = 'Baseline WCAG 2.1 AA validation.';
    rationales['SMOKE'] = 'Sanity deployment check.';

    skippedLayers.push('CONTRACT', 'LOAD');
  }

  const result: TestPyramidStrategy = {
    projectName: context.name,
    recommendedLayers,
    rationales,
    skippedLayers
  };

  return TestPyramidStrategySchema.parse(result);
}
