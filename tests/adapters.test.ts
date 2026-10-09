import { describe, it, expect } from 'vitest';
import { AdapterRegistry } from '@alper-design-os/registry';
import { inferProductUXProfile, coreUXPatterns } from '@alper-design-os/design-core';

describe('Adapters Architecture & Contracts', () => {
  const registry = AdapterRegistry.getInstance();
  const allAdapters = registry.getAll();
  const testProfile = inferProductUXProfile({
    name: 'Sample System',
    description: 'Test application'
  });
  const testPattern = coreUXPatterns[0]!;

  it('registers all 7 required adapter skeletons', () => {
    const expectedIds = [
      'generic-web',
      'html-css-js',
      'react',
      'react-typescript',
      'php',
      'laravel-blade',
      'aspnet-razor'
    ];

    expect(allAdapters.length).toBe(7);
    expectedIds.forEach((id) => {
      const adapter = registry.get(id);
      expect(adapter).toBeDefined();
      expect(adapter?.id).toBe(id);
    });
  });

  allAdapters.forEach((adapter) => {
    describe(`Adapter: ${adapter.name} (${adapter.id})`, () => {
      it('implements AdapterContract with valid capabilities', () => {
        const caps = adapter.getCapabilities();
        expect(caps.templateEngine).toBeDefined();
        expect(Array.isArray(caps.stylingApproaches)).toBe(true);
        expect(caps.componentParadigm).toBeDefined();
      });

      it('generates scaffolding artifacts conforming to its contract', async () => {
        const artifacts = await adapter.generateScaffold({
          rootDir: './test-app',
          productName: 'Test App',
          profile: testProfile
        });
        expect(artifacts.length).toBeGreaterThan(0);
        expect(artifacts[0]?.path).toBeDefined();
        expect(artifacts[0]?.content.length).toBeGreaterThan(0);
      });

      it('renders UX pattern component conforming to its contract', async () => {
        const artifacts = await adapter.renderComponent(testPattern, {
          componentName: 'SamplePatternComponent'
        });
        expect(artifacts.length).toBeGreaterThan(0);
        expect(artifacts[0]?.content).toContain(testPattern.name);
      });

      it('maps design tokens without errors', async () => {
        const artifacts = await adapter.mapTokens('css');
        expect(artifacts.length).toBeGreaterThan(0);
        expect(artifacts[0]?.content).toContain(':root');
      });

      it('provides a structured 4-phase modernization strategy', () => {
        const strategy = adapter.recommendModernization([]);
        expect(strategy.adapterId).toBe(adapter.id);
        expect(strategy.phases.length).toBe(4);
      });
    });
  });
});
