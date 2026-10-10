import { TargetRenderer, RenderOptions, TokenRenderOptions } from './contract.js';
import {
  PageBlueprint,
  ComponentBlueprint,
  InteractionContract,
  AccessibilityContract,
  RendererOutput,
  TargetStack
} from '../types.js';
import { canonicalTokensV2 } from '../tokens-v2/definitions.js';
import { generateCssVariables, generateTypeScriptConstants } from '../tokens-v2/generators.js';

export class ReactTypeScriptRenderer implements TargetRenderer {
  readonly stack: TargetStack = 'react-typescript';
  readonly name = 'React + TypeScript Renderer';
  readonly description = 'Strict TypeScript React components with semantic JSX, controlled props, accessible ARIA, and zero gratuitous state/effects.';

  renderPageBlueprint(blueprint: PageBlueprint, options: RenderOptions = {}): RendererOutput {
    const theme = options.theme || 'LIGHT';
    const density = options.density || blueprint.density.mode;

    const componentCode = `import React, { useState, useCallback } from 'react';
import './alper-tokens.css';
import './alper-react-styles.css';

export interface DataManagementWorkspaceProps {
  initialTheme?: 'light' | 'dark' | 'high-contrast';
  initialDensity?: 'compact' | 'comfortable' | 'spacious';
}

export interface RecordItem {
  id: string;
  title: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  timestamp: string;
}

const mockData: RecordItem[] = [
  { id: 'REC-001', title: 'Telemetry Cluster Node A', status: 'Healthy', timestamp: '2026-10-10 14:00' },
  { id: 'REC-002', title: 'API Gateway Dispatcher', status: 'Healthy', timestamp: '2026-10-10 14:05' },
  { id: 'REC-003', title: 'Distributed Cache Replica', status: 'Warning', timestamp: '2026-10-10 14:10' }
];

export const ${this.sanitizeComponentName(blueprint.id)}: React.FC<DataManagementWorkspaceProps> = ({
  initialTheme = '${theme.toLowerCase()}',
  initialDensity = '${density.toLowerCase()}'
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = useCallback((id: string) => {
    setSelectedRecordId((prev) => (prev === id ? null : id));
  }, []);

  const filteredRecords = mockData.filter((r) =>
    r.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="alper-app-shell alper-shell-enterprise" data-theme={theme} data-density={initialDensity}>
      {/* Sidebar Navigation */}
      <aside className="alper-sidebar" aria-label="Main Navigation">
        <div className="alper-brand">Alper Design OS</div>
        <nav className="alper-nav">
          <ul className="alper-nav-list">
            <li className="alper-nav-item active"><a href="#overview" className="alper-nav-link">Overview</a></li>
            <li className="alper-nav-item"><a href="#records" className="alper-nav-link">Records</a></li>
            <li className="alper-nav-item"><a href="#reports" className="alper-nav-link">Reports</a></li>
            <li className="alper-nav-item"><a href="#settings" className="alper-nav-link">Settings</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="alper-main-content" id="main-content">
        <header className="alper-page-header">
          <h1 className="alper-page-title">${blueprint.title}</h1>
          <p className="alper-page-desc">${blueprint.description}</p>
        </header>

        {/* Filter Bar */}
        <section className="alper-region" aria-label="Filter records">
          <div className="alper-filter-bar">
            <input
              type="text"
              className="alper-input"
              placeholder="Filter by keyword..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              aria-label="Filter records"
            />
            {filterQuery && (
              <button
                type="button"
                className="alper-btn alper-btn-secondary"
                onClick={() => setFilterQuery('')}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="alper-btn alper-btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Bulk Action
            </button>
          </div>
        </section>

        {/* Dense Data Table */}
        <section className="alper-region" aria-label="Records Table">
          <div className="alper-table-container">
            <table className="alper-table" aria-label="Data Table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className={selectedRecordId === rec.id ? 'alper-row-selected' : ''}
                    onClick={() => handleRowClick(rec.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRowClick(rec.id); }}
                  >
                    <td>{rec.id}</td>
                    <td>{rec.title}</td>
                    <td>
                      <span className={\`alper-badge \${rec.status === 'Warning' ? 'alper-badge-warning' : 'alper-badge-success'}\`}>
                        {rec.status}
                      </span>
                    </td>
                    <td>{rec.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detail Drawer */}
        {selectedRecordId && (
          <aside className="alper-drawer-backdrop" aria-label="Record Details">
            <div className="alper-drawer-panel">
              <h3>Record Details</h3>
              <p>Selected Entity ID: <strong>{selectedRecordId}</strong></p>
              <button
                type="button"
                className="alper-btn alper-btn-secondary"
                onClick={() => setSelectedRecordId(null)}
              >
                Close Drawer
              </button>
            </div>
          </aside>
        )}

        {/* Modal Dialog */}
        {isModalOpen && (
          <div className="alper-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="alper-modal-card">
              <h3 id="modal-title">Confirm Bulk Action</h3>
              <p>Are you sure you want to execute operations on selected dataset records?</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="alper-btn alper-btn-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="alper-btn alper-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
`;

    const tokensCss = generateCssVariables(canonicalTokensV2);
    const reactStyles = `/* React Component Styling Hooked to CSS Variables */
.alper-row-selected td {
  background-color: var(--alper-action-secondary);
}
.alper-badge-warning {
  color: var(--alper-status-warning);
}
.alper-badge-success {
  color: var(--alper-status-success);
}
`;

    return {
      stack: this.stack,
      primaryFile: {
        path: `${this.sanitizeComponentName(blueprint.id)}.tsx`,
        content: componentCode,
        language: 'typescript'
      },
      supportingFiles: [
        { path: 'alper-tokens.css', content: tokensCss, language: 'css' },
        { path: 'alper-react-styles.css', content: reactStyles, language: 'css' }
      ],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(componentCode),
        cssBytes: Buffer.byteLength(tokensCss) + Buffer.byteLength(reactStyles),
        jsBytes: Buffer.byteLength(componentCode),
        externalDependencyCount: 1 // react
      }
    };
  }

  renderComponentBlueprint(blueprint: ComponentBlueprint, options: RenderOptions = {}): RendererOutput {
    const code = `import React from 'react';

export interface ${this.sanitizeComponentName(blueprint.id)}Props {
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ${this.sanitizeComponentName(blueprint.id)}: React.FC<${this.sanitizeComponentName(blueprint.id)}Props> = ({
  disabled = false,
  children,
  className = '',
  onClick
}) => {
  return (
    <button
      type="button"
      className={\`alper-btn alper-btn-primary \${className}\`}
      disabled={disabled}
      onClick={onClick}
      aria-label="Action Button"
    >
      {children || '${blueprint.role}'}
    </button>
  );
};
`;

    return {
      stack: this.stack,
      primaryFile: {
        path: `${this.sanitizeComponentName(blueprint.id)}.tsx`,
        content: code,
        language: 'typescript'
      },
      supportingFiles: [],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(code),
        cssBytes: 0,
        jsBytes: Buffer.byteLength(code),
        externalDependencyCount: 1
      }
    };
  }

  renderTokens(options: TokenRenderOptions = {}): RendererOutput {
    const tsCode = generateTypeScriptConstants(canonicalTokensV2);
    return {
      stack: this.stack,
      primaryFile: { path: 'tokens.ts', content: tsCode, language: 'typescript' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: Buffer.byteLength(tsCode), externalDependencyCount: 0 }
    };
  }

  renderInteractionContract(contract: InteractionContract): RendererOutput {
    const code = `export const interactionContract = ${JSON.stringify(contract, null, 2)} as const;`;
    return {
      stack: this.stack,
      primaryFile: { path: 'interactionContract.ts', content: code, language: 'typescript' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: Buffer.byteLength(code), externalDependencyCount: 0 }
    };
  }

  renderAccessibilityContract(contract: AccessibilityContract): RendererOutput {
    const code = `export const a11yContract = ${JSON.stringify(contract, null, 2)} as const;`;
    return {
      stack: this.stack,
      primaryFile: { path: 'a11yContract.ts', content: code, language: 'typescript' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: Buffer.byteLength(code), externalDependencyCount: 0 }
    };
  }

  private sanitizeComponentName(id: string): string {
    return id
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}
