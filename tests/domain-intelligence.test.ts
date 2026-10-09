import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inferProductUXProfile, ProductUXProfileSchema } from '@alper-design-os/design-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Generic Domain Intelligence Discovery Pipeline', () => {
  it('correctly models and extracts the APS domain fixture through the generic pipeline', () => {
    const fixturePath = path.resolve(__dirname, 'fixtures/domains/advanced-planning-scheduling.json');
    const spec = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

    const profile = inferProductUXProfile(spec);

    // 1. Schema Conformance
    const parseResult = ProductUXProfileSchema.safeParse(profile);
    expect(parseResult.success).toBe(true);

    // 2. Generic Classification & Operational Profile
    expect(profile.domainClassification).toBe('INDUSTRIAL_OPERATIONAL');
    expect(profile.usageFrequency).toBe('CONTINUOUS_WORKBENCH');
    expect(profile.informationDensity).toBe('HIGH');
    expect(profile.interactionStyle).toBe('HYBRID_MOUSE_KEYBOARD');

    // 3. Dynamic Personas (Production Planner)
    const planner = profile.personas.find((p) => p.name.toLowerCase().includes('planner') || p.id.includes('planner'));
    expect(planner).toBeDefined();
    expect(planner?.expertiseLevel).toBe('EXPERT_OPERATOR');
    expect(planner?.dailyTimeInAppHours).toBe(8);

    // 4. Finite capacity planning & machine scheduling jobs
    const finiteJob = profile.primaryJobsAndTasks.find((j) =>
      j.title.toLowerCase().includes('capacity') || j.id.includes('capacity')
    );
    expect(finiteJob).toBeDefined();

    // 5. Timeline / Gantt pattern
    const timelinePattern = profile.requiredVisualPatterns.find((p) => p.patternId.includes('timeline'));
    expect(timelinePattern).toBeDefined();

    // 6. Capacity utilization / Bottleneck detection pattern
    const bottleneckPattern = profile.requiredVisualPatterns.find((p) => p.patternId.includes('bottleneck'));
    expect(bottleneckPattern).toBeDefined();

    // 7. Dense grids pattern
    const denseGridPattern = profile.requiredVisualPatterns.find((p) => p.patternId.includes('dense-grid'));
    expect(denseGridPattern).toBeDefined();

    // 8. Split panes pattern
    const splitPanesPattern = profile.requiredVisualPatterns.find((p) => p.patternId.includes('split-panes'));
    expect(splitPanesPattern).toBeDefined();

    // 9. Filters pattern
    const filterPattern = profile.requiredVisualPatterns.find((p) => p.patternId.includes('filter'));
    expect(filterPattern).toBeDefined();

    // 10. Context menus pattern
    const contextMenuPattern = profile.requiredVisualPatterns.find((p) => p.patternId.includes('context-menus'));
    expect(contextMenuPattern).toBeDefined();

    // 11. Rescheduling workflow
    const reschedulingWf = profile.criticalWorkflows.find((w) => w.id.includes('resequence') || w.name.toLowerCase().includes('re-sequencing'));
    expect(reschedulingWf).toBeDefined();

    // 12. What-if scenarios workflow
    const whatIfWf = profile.criticalWorkflows.find((w) => w.id.includes('scenario') || w.name.toLowerCase().includes('what-if'));
    expect(whatIfWf).toBeDefined();

    // 13. Design Direction
    expect(profile.recommendedDesignDirection.layoutArchetype).toBe('WORKBENCH_MULTI_PANE');
    expect(profile.recommendedDesignDirection.colorModePreference).toBe('DARK_DOMINANT');
    expect(profile.recommendedDesignDirection.typographyScale).toBe('COMPACT_HIGH_DENSITY');
  });

  it('successfully processes an unknown domain through the exact same discovery pipeline', () => {
    const unknownDomainBrief = {
      productName: 'AeroDNA Sequencing Lab',
      domain: 'Biotechnology High-Throughput Genomic Diagnostics',
      description: 'Laboratory telemetry console for molecular geneticists inspecting DNA sequencer runs, real-time error rates, dense specimen ledgers, multi-channel spectra, and alert thresholds.',
      targetUsers: ['Clinical Geneticist', 'Lab Automation Lead'],
      keyFeatures: [
        'specimen ledger table',
        'run sequencing timeline',
        'anomaly alert detection',
        'split-pane plate inspector'
      ],
      operatingEnvironment: 'Cleanroom touchscreen and workstation multi-monitor console'
    };

    const profile = inferProductUXProfile(unknownDomainBrief);

    const parseResult = ProductUXProfileSchema.safeParse(profile);
    expect(parseResult.success).toBe(true);
    expect(profile.productName).toBe('AeroDNA Sequencing Lab');
    expect(profile.personas.length).toBe(2);
    expect(profile.personas[0]?.name).toBe('Clinical Geneticist');
    expect(profile.requiredVisualPatterns.some((p) => p.patternId.includes('dense-grid'))).toBe(true);
    expect(profile.requiredVisualPatterns.some((p) => p.patternId.includes('timeline'))).toBe(true);
    expect(profile.requiredVisualPatterns.some((p) => p.patternId.includes('split-panes'))).toBe(true);
  });
});
