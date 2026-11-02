import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runDoctorV3 } from '../packages/qa-engine/src/doctor-v3.js';

describe('Design OS Doctor V3 Engine', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-v3-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  });

  it('fails Gate 1 and Gate 2 when .design-os/config.json is missing', async () => {
    const report = await runDoctorV3(tmpDir);
    expect(report.overallStatus).toBe('BLOCKED');
    expect(report.canPassQualityGate).toBe(false);
    expect(report.gates.gate1_integrationActive.status).toBe('FAIL');
    expect(report.gates.gate1_integrationActive.severity).toBe('CRITICAL');
  });

  it('strictly reports NOT_VERIFIED for Gate 6 when no visual screenshots exist', async () => {
    // Setup .design-os/config.json
    fs.mkdirSync(path.join(tmpDir, '.design-os'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.design-os', 'config.json'),
      JSON.stringify({
        schemaVersion: '1.0.0',
        domainProfile: 'INDUSTRIAL_OPERATIONS',
        stackAdapter: 'react-typescript'
      })
    );

    // Create a sample TSX file with enterprise component usage
    fs.writeFileSync(
      path.join(tmpDir, 'App.tsx'),
      `import { EnterpriseAppShell, EnterpriseDataGrid } from './components';
export function App() {
  return (
    <EnterpriseAppShell title="Operations Workbench" subtitle="Line 1">
      <div className="md:grid-cols-2 lg:grid-cols-4 overflow-x-auto">
        <EnterpriseDataGrid />
      </div>
    </EnterpriseAppShell>
  );
}`
    );

    const report = await runDoctorV3(tmpDir);
    expect(report.gates.gate1_integrationActive.status).toBe('PASS');
    expect(report.gates.gate3_realComponentUsage.status).toBe('PASS');
    expect(report.gates.gate5_responsiveValidation.status).toBe('PASS');
    // Gate 6 MUST be NOT_VERIFIED because no screenshots were taken!
    expect(report.gates.gate6_visualQualityCheck.status).toBe('NOT_VERIFIED');
    expect(report.canPassQualityGate).toBe(false);
  });

  it('passes Gate 6 when multi-viewport screenshots exist', async () => {
    fs.mkdirSync(path.join(tmpDir, '.design-os'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.design-os', 'config.json'),
      JSON.stringify({
        schemaVersion: '1.0.0',
        domainProfile: 'INDUSTRIAL_OPERATIONS',
        stackAdapter: 'react-typescript'
      })
    );

    // Add screenshot files
    const qaDir = path.join(tmpDir, '.design-os', 'qa', 'screenshots');
    fs.mkdirSync(qaDir, { recursive: true });
    fs.writeFileSync(path.join(qaDir, 'desktop-1920.png'), 'fake-image');
    fs.writeFileSync(path.join(qaDir, 'tablet-768.png'), 'fake-image');
    fs.writeFileSync(path.join(qaDir, 'mobile-375.png'), 'fake-image');

    // Create compliant TSX
    fs.writeFileSync(
      path.join(tmpDir, 'App.tsx'),
      `import { EnterpriseAppShell, EnterpriseDataGrid } from './components';
export function App() {
  return (
    <EnterpriseAppShell title="Operations Workbench">
      <div className="sm:flex md:grid-cols-2 lg:grid-cols-4 overflow-x-auto">
        <EnterpriseDataGrid />
      </div>
    </EnterpriseAppShell>
  );
}`
    );

    const report = await runDoctorV3(tmpDir);
    expect(report.gates.gate6_visualQualityCheck.status).toBe('PASS');
  });

  it('detects Generic AI UI Anti-Patterns in Gate 8', async () => {
    fs.mkdirSync(path.join(tmpDir, '.design-os'), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, '.design-os', 'config.json'),
      JSON.stringify({
        schemaVersion: '1.0.0',
        domainProfile: 'INDUSTRIAL_OPERATIONS',
        stackAdapter: 'react-typescript'
      })
    );

    // Write file with anti-patterns: neon glow shadow, 4 rounded KPI cards, emojis, marketing fluff
    fs.writeFileSync(
      path.join(tmpDir, 'App.tsx'),
      `export function App() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <header className="bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20">
        <h1>Akıllı APS Çizelgeleme Motoru Aktif</h1>
        <select><option>🏭 Tüm Tesisler</option></select>
      </header>
      <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl p-6">Card 1</div>
        <div className="rounded-2xl p-6">Card 2</div>
        <div className="rounded-2xl p-6">Card 3</div>
        <div className="rounded-2xl p-6">Card 4</div>
      </div>
    </div>
  );
}`
    );

    const report = await runDoctorV3(tmpDir);
    expect(report.gates.gate8_domainDesignLanguage.status).toBe('FAIL');
    expect(report.gates.gate8_domainDesignLanguage.severity).toBe('CRITICAL');
    expect(report.domainIntelligence?.detectedAntiPatterns).toContain('GENERIC_AI_GRADIENT_GLOW');
    expect(report.domainIntelligence?.detectedAntiPatterns).toContain('REDUNDANT_KPI_CARDS');
    expect(report.domainIntelligence?.detectedAntiPatterns).toContain('EMOJI_OVERUSE');
    expect(report.domainIntelligence?.detectedAntiPatterns).toContain('MARKETING_FLUFF_IN_OPS');
    expect(report.domainIntelligence?.detectedAntiPatterns).toContain('LOW_DATA_DENSITY');
  });
});
