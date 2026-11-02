import {
  BaseAdapter,
  AdapterArtifact,
  AdapterCapabilities,
  ProjectFile,
  RenderOptions,
  ScaffoldOptions,
  StackDetectionMatch
} from '@alper-design-os/adapter-contract';
import { UXPatternSpec } from '@alper-design-os/design-core';
import { ENTERPRISE_COMPONENTS_SOURCE } from './enterprise-components.js';

export class ReactTypeScriptAdapter extends BaseAdapter {
  readonly id = 'react-typescript';
  readonly name = 'React + TypeScript';
  readonly description = 'Enterprise React components written in strictly typed TypeScript (TSX) with zero-any guarantees and Tailwind CSS.';
  readonly targetExtensions = ['.tsx', '.ts'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: true,
      templateEngine: 'React TSX',
      stylingApproaches: ['CSS_VARIABLES', 'TAILWIND', 'SCSS'],
      serverRendered: false,
      componentParadigm: 'REACT_COMPONENTS'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const pkg = files.find((f) => f.path.endsWith('package.json'));
    let hasReact = false;
    let hasTs = false;

    if (pkg && pkg.content) {
      hasReact = pkg.content.includes('"react"') || pkg.content.includes('"react-dom"');
      hasTs = pkg.content.includes('"typescript"');
    }

    const hasTsx = files.some((f) => f.extension === '.tsx');
    const hasTsconfig = files.some((f) => f.path.includes('tsconfig.json'));

    if ((hasReact && (hasTs || hasTsconfig)) || hasTsx) {
      return {
        matched: true,
        confidence: 0.95,
        detectedFramework: 'React (TypeScript)',
        reason: 'Detected React paired with TypeScript configuration and .tsx files.',
        detectedFiles: files.filter((f) => f.extension === '.tsx' || f.extension === '.ts' || f.path.endsWith('tsconfig.json')).map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No React + TypeScript markers detected.',
      detectedFiles: []
    };
  }

  /**
   * Generates the core Enterprise Component Suite in src/components/enterprise/EnterpriseComponents.tsx
   */
  scaffoldEnterpriseSuite(): AdapterArtifact[] {
    return [
      {
        path: 'src/components/enterprise/EnterpriseComponents.tsx',
        content: ENTERPRISE_COMPONENTS_SOURCE,
        language: 'typescript',
        description: 'ALPER DESIGN OS Enterprise Component Suite (DataGrid, AppShell, GanttTimeline, FormField, Input, Badge)'
      }
    ];
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    const suiteArtifacts = this.scaffoldEnterpriseSuite();

    const appScaffold: AdapterArtifact = {
      path: 'src/App.tsx',
      content: `import React, { useState } from 'react';
import './styles/tokens.css';
import {
  EnterpriseAppShell,
  EnterpriseDataGrid,
  GanttCapacityTimeline,
  EnterpriseBadge
} from './components/enterprise/EnterpriseComponents';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <EnterpriseAppShell
      appName="${options.productName || 'DevHub Application'}"
      badge="ENTERPRISE OPS"
      subtitle="ALPER DESIGN OS • Yüksek Veri Yoğunluğu"
      navItems={[
        { id: 'orders', label: 'Operasyonel Emirler', icon: '📋', active: activeTab === 'orders', count: 12, onClick: () => setActiveTab('orders') },
        { id: 'capacity', label: 'Kapasite & Çizelge', icon: '⚡', active: activeTab === 'capacity', count: 4, onClick: () => setActiveTab('capacity') },
        { id: 'analytics', label: 'Analitik & Verim', icon: '📊', active: activeTab === 'analytics', onClick: () => setActiveTab('analytics') },
      ]}
      footerTelemetry="Telemetri Aktif • Çakışma Yok • 4/4 Hat Çevrimiçi"
    >
      <div className="space-y-4">
        {/* Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aktif Emirler</span>
            <div className="text-xl font-bold font-mono text-white mt-1">12 / 12</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Doluluk Oranı</span>
            <div className="text-xl font-bold font-mono text-sky-400 mt-1">%74.2</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Termin Riski</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">0 Risk</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Kullanılabilir Saat</span>
            <div className="text-xl font-bold font-mono text-slate-200 mt-1">428 sa</div>
          </div>
        </div>

        {/* Dynamic View */}
        {activeTab === 'orders' ? (
          <EnterpriseDataGrid
            data={[
              { id: 'EMR-01', code: 'SIP-2026-001', part: 'Otomotiv Şanzıman Flanşı', qty: 2400, line: 'Hat 1 (CNC)', priority: 'YÜKSEK', status: 'IN_PROGRESS' },
              { id: 'EMR-02', code: 'SIP-2026-002', part: 'Yüksek Basınçlı Valf Gövdesi', qty: 1800, line: 'Hat 2 (Plastik)', priority: 'ACİL', status: 'SCHEDULED' },
              { id: 'EMR-03', code: 'SIP-2026-003', part: 'Polimer Şasi Braketi', qty: 7000, line: 'Hat 1 (CNC)', priority: 'NORMAL', status: 'COMPLETED' },
            ]}
            columns={[
              { key: 'code', label: 'Sipariş No', sortable: true, width: '130px' },
              { key: 'part', label: 'Parça Tanımı', sortable: true },
              { key: 'line', label: 'Üretim Hattı', sortable: true, width: '160px' },
              { key: 'qty', label: 'Miktar', align: 'right', sortable: true, width: '100px', render: (v: number) => v.toLocaleString('tr-TR') },
              { key: 'priority', label: 'Öncelik', align: 'center', width: '90px', render: (v: string) => <EnterpriseBadge variant={v === 'ACİL' ? 'critical' : v === 'YÜKSEK' ? 'warning' : 'default'}>{v}</EnterpriseBadge> },
              { key: 'status', label: 'Durum', align: 'center', width: '110px', render: (v: string) => <EnterpriseBadge variant={v === 'COMPLETED' ? 'success' : 'info'}>{v}</EnterpriseBadge> },
            ]}
            keyField="id"
          />
        ) : (
          <GanttCapacityTimeline
            resources={[
              { id: 'L1', name: 'Hat 1: CNC Talaşlı İmalat', category: 'CNC', shifts: 3, totalCapacityHours: 172, plannedHours: 58.8 },
              { id: 'L2', name: 'Hat 2: Plastik Enjeksiyon', category: 'PLASTIC', shifts: 2, totalCapacityHours: 112, plannedHours: 45.9 },
            ]}
            jobs={[
              { id: 'J1', resourceId: 'L1', orderNo: 'SIP-2026-001', partName: 'Şanzıman Flanşı', quantity: 2400, startHour: 8, durationHours: 24, status: 'IN_PROGRESS' },
              { id: 'J2', resourceId: 'L2', orderNo: 'SIP-2026-002', partName: 'Valf Gövdesi', quantity: 1800, startHour: 16, durationHours: 18, status: 'SCHEDULED' },
            ]}
          />
        )}
      </div>
    </EnterpriseAppShell>
  );
};

export default App;`,
      language: 'typescript',
      description: 'ALPER DESIGN OS Enterprise Workbench main application shell'
    };

    return [...suiteArtifacts, appScaffold];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: `src/components/${options.componentName}.tsx`,
        content: `import React from 'react';
import { EnterpriseBadge } from './enterprise/EnterpriseComponents';

export interface ${options.componentName}Props {
  title?: string;
  density?: 'EXTREME' | 'HIGH' | 'MEDIUM' | 'SPACIOUS';
  className?: string;
  children?: React.ReactNode;
}

/**
 * ${pattern.name} (Enterprise Strict TypeScript Component)
 * Role: ${pattern.accessibilityRole}
 */
export const ${options.componentName}: React.FC<${options.componentName}Props> = ({
  title = '${pattern.name}',
  density = 'HIGH',
  className = '',
  children
}) => {
  return (
    <section
      className={\`alper-enterprise-card bg-slate-900 border border-slate-800 rounded p-4 \${className}\`}
      data-density={density.toLowerCase()}
      role="${pattern.accessibilityRole}"
      aria-label={title}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h3>
        <EnterpriseBadge variant="neutral">CANONICAL</EnterpriseBadge>
      </div>
      <div className="text-slate-300 text-xs sm:text-sm">
        {children}
      </div>
    </section>
  );
};

export default ${options.componentName};`,
        language: 'typescript',
        description: `Enterprise React TypeScript component for ${pattern.name}`
      }
    ];
  }
}

export default ReactTypeScriptAdapter;
