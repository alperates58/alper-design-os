import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inferProductUXProfile, ProductUXProfileSchema } from '@alper-design-os/design-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN_FIXTURES = [
  { id: 'APS', file: 'advanced-planning-scheduling.json' },
  { id: 'CRM', file: 'customer-relationship-management.json' },
  { id: 'Hospital', file: 'hospital-clinical-ehr.json' },
  { id: 'Hotel PMS', file: 'hotel-property-management.json' },
  { id: 'Restaurant POS', file: 'restaurant-point-of-sale.json' },
  { id: 'Warehouse WMS', file: 'warehouse-management-system.json' },
  { id: 'Banking', file: 'retail-commercial-banking.json' },
  { id: 'Streaming', file: 'media-video-streaming.json' },
  { id: 'E-commerce', file: 'digital-ecommerce-storefront.json' },
  { id: 'School Management', file: 'student-school-management.json' },
  { id: 'Fleet Management', file: 'vehicle-fleet-telematics.json' },
  { id: 'Legal Case Management', file: 'legal-case-practice-management.json' },
  { id: 'Accounting', file: 'general-ledger-accounting.json' },
  { id: 'Cybersecurity Dashboard', file: 'cybersecurity-threat-siem.json' },
  { id: 'IoT Monitoring', file: 'industrial-iot-telemetry.json' }
];

describe('15 Domain Benchmark Suite (Technology-Agnostic Generic Discovery)', () => {
  it('has all 15 required domain fixture files available', () => {
    expect(DOMAIN_FIXTURES.length).toBe(15);
    for (const item of DOMAIN_FIXTURES) {
      const fixturePath = path.resolve(__dirname, 'fixtures/domains', item.file);
      expect(fs.existsSync(fixturePath), `Fixture missing: ${item.file}`).toBe(true);
    }
  });

  DOMAIN_FIXTURES.forEach(({ id, file }) => {
    it(`benchmark domain [${id}]: generates compliant ProductUXProfile from ${file}`, () => {
      const fixturePath = path.resolve(__dirname, 'fixtures/domains', file);
      const spec = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

      const profile = inferProductUXProfile(spec);

      // 1. Strict Schema Validation
      const parseResult = ProductUXProfileSchema.safeParse(profile);
      if (!parseResult.success) {
        console.error(`Validation failed for domain [${id}]:`, parseResult.error.errors);
      }
      expect(parseResult.success).toBe(true);

      // 2. Profile Structural Integrity
      expect(profile.productName).toBeTruthy();
      expect(profile.domainClassification).toBeTruthy();
      expect(profile.personas.length).toBeGreaterThan(0);
      expect(profile.primaryJobsAndTasks.length).toBeGreaterThan(0);
      expect(profile.requiredVisualPatterns.length).toBeGreaterThan(0);
      expect(profile.criticalWorkflows.length).toBeGreaterThan(0);
      expect(profile.accessibilityConsiderations.level).toMatch(/^WCAG_2_1/);
      expect(profile.responsiveRequirements.primaryDevice).toBeTruthy();
      expect(profile.recommendedDesignDirection.layoutArchetype).toBeTruthy();
      expect(profile.recommendedDesignDirection.summary).toBeTruthy();

      // 3. Expected traits match if specified in fixture
      if (spec.expectedTraits) {
        if (spec.expectedTraits.domainClassification) {
          expect(profile.domainClassification).toBe(spec.expectedTraits.domainClassification);
        }
        if (spec.expectedTraits.informationDensity) {
          expect(profile.informationDensity).toBe(spec.expectedTraits.informationDensity);
        }
        if (spec.expectedTraits.interactionStyle) {
          expect(profile.interactionStyle).toBe(spec.expectedTraits.interactionStyle);
        }
      }
    });
  });

  it('correctly distinguishes high-density operational vs spacious consumer domains without domain hardcoding', () => {
    const apsFixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/domains/advanced-planning-scheduling.json'), 'utf-8'));
    const streamingFixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/domains/media-video-streaming.json'), 'utf-8'));
    const ecommerceFixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/domains/digital-ecommerce-storefront.json'), 'utf-8'));
    const accountingFixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fixtures/domains/general-ledger-accounting.json'), 'utf-8'));

    const apsProfile = inferProductUXProfile(apsFixture);
    const streamingProfile = inferProductUXProfile(streamingFixture);
    const ecommerceProfile = inferProductUXProfile(ecommerceFixture);
    const accountingProfile = inferProductUXProfile(accountingFixture);

    // Industrial and Accounting demand high density
    expect(apsProfile.informationDensity).toBe('HIGH');
    expect(accountingProfile.informationDensity).toBe('HIGH');

    // Consumer video and shopping demand spacious density
    expect(streamingProfile.informationDensity).toBe('SPACIOUS');
    expect(ecommerceProfile.informationDensity).toBe('SPACIOUS');

    // Classifications derived from operational taxonomy, not domain names
    expect(apsProfile.domainClassification).toBe('INDUSTRIAL_OPERATIONAL');
    expect(streamingProfile.domainClassification).toBe('B2C_CONSUMER');
    expect(ecommerceProfile.domainClassification).toBe('B2C_CONSUMER');
    expect(accountingProfile.domainClassification).toBe('FINTECH');
  });

  it('handles completely unknown, hypothetical domains with zero hardcoded knowledge', () => {
    const quantumDomain = {
      productName: 'QuantumQubit Control Plane',
      domain: 'Sub-Atomic Cryogenic Quantum Processor Telemetry',
      description: 'Cryogenic qubit microwave pulse calibrator and entanglement gate fidelities. Multi-channel microwave waveform sequencer, qubit coherence lifetime charts, and cryostat temperature sensor telemetry.',
      targetUsers: ['Cryogenic Quantum Physicist', 'Quantum Firmware Engineer'],
      keyFeatures: [
        'microwave pulse waveform timeline',
        'qubit state density matrix grid',
        'cryostat sensor telemetry stream',
        'gate fidelity constraint violation badges',
        'split pane waveform inspector'
      ],
      operatingEnvironment: 'Cleanroom cryo-lab multi-monitor control desk'
    };

    const profile = inferProductUXProfile(quantumDomain);
    const parseResult = ProductUXProfileSchema.safeParse(profile);
    expect(parseResult.success).toBe(true);

    // Should detect sensor/telemetry/timeline patterns generically
    expect(profile.requiredVisualPatterns.some((p) => p.patternId.includes('timeline'))).toBe(true);
    expect(profile.requiredVisualPatterns.some((p) => p.patternId.includes('dense-grid'))).toBe(true);
    expect(profile.requiredVisualPatterns.some((p) => p.patternId.includes('split-panes'))).toBe(true);
    expect(profile.personas.length).toBe(2);
    expect(profile.personas[0]?.name).toBe('Cryogenic Quantum Physicist');
  });
});
