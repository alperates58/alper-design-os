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
import { generateCssVariables } from '../tokens-v2/generators.js';

export class HtmlCssJsRenderer implements TargetRenderer {
  readonly stack: TargetStack = 'html-css-js';
  readonly name = 'Semantic HTML / CSS / Vanilla JS Renderer';
  readonly description = 'Framework-free, progressive enhancement output using native HTML5, CSS variables, and accessible vanilla JS.';

  renderPageBlueprint(blueprint: PageBlueprint, options: RenderOptions = {}): RendererOutput {
    const theme = options.theme || 'LIGHT';
    const density = options.density || blueprint.density.mode;

    const regionsHtml = blueprint.regions
      .map((region) => {
        const componentsHtml = region.components
          .map((c) => this.renderComponentMarkup(c))
          .join('\n        ');

        return `      <!-- Region: ${region.title || region.type} -->
      <section class="alper-region alper-region-${region.type.toLowerCase().replace(/_/g, '-')}" data-region-id="${region.id}">
        <header class="alper-region-header">
          <h2 class="alper-region-title">${region.title || region.type}</h2>
        </header>
        <div class="alper-region-content">
        ${componentsHtml}
        </div>
      </section>`;
      })
      .join('\n\n');

    const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="${theme.toLowerCase()}" data-density="${density.toLowerCase()}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blueprint.title}</title>
  <link rel="stylesheet" href="styles/alper-tokens.css">
  <link rel="stylesheet" href="styles/alper-layout.css">
</head>
<body class="alper-body">
  <div class="alper-app-shell alper-shell-${blueprint.shell.variant.toLowerCase().replace(/_/g, '-')}">
    <!-- Shell Sidebar -->
    <aside class="alper-sidebar" aria-label="Main Navigation">
      <div class="alper-sidebar-header">
        <span class="alper-brand">Alper Design OS</span>
      </div>
      <nav class="alper-nav">
        <ul class="alper-nav-list">
          <li class="alper-nav-item active"><a href="#" class="alper-nav-link">Overview</a></li>
          <li class="alper-nav-item"><a href="#" class="alper-nav-link">Records</a></li>
          <li class="alper-nav-item"><a href="#" class="alper-nav-link">Reports</a></li>
          <li class="alper-nav-item"><a href="#" class="alper-nav-link">Settings</a></li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="alper-main-content" id="main-content">
      <header class="alper-page-header">
        <h1 class="alper-page-title">${blueprint.title}</h1>
        <p class="alper-page-desc">${blueprint.description}</p>
      </header>

${regionsHtml}
    </main>
  </div>

  <script src="scripts/alper-interactions.js" defer></script>
</body>
</html>`;

    const layoutCss = `/* Alper Design OS - Technology-Neutral Layout Styles */
.alper-body {
  margin: 0;
  padding: 0;
  font-family: var(--alper-font-body);
  background-color: var(--alper-surface-default);
  color: var(--alper-text-primary);
  font-size: var(--alper-font-size-base);
  line-height: 1.5;
}

.alper-app-shell {
  display: flex;
  min-height: 100vh;
}

.alper-sidebar {
  width: 260px;
  background-color: var(--alper-surface-elevated);
  border-right: 1px solid var(--alper-border-subtle);
  padding: calc(var(--alper-density-unit) * 2);
  display: flex;
  flex-direction: column;
}

.alper-brand {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--alper-text-primary);
}

.alper-nav-list {
  list-style: none;
  padding: 0;
  margin: calc(var(--alper-density-unit) * 3) 0;
}

.alper-nav-link {
  display: block;
  padding: calc(var(--alper-density-unit) * 1.25) calc(var(--alper-density-unit) * 2);
  color: var(--alper-text-secondary);
  text-decoration: none;
  border-radius: var(--alper-radius-md);
  transition: background-color var(--alper-motion-fast-duration) var(--alper-motion-fast-easing);
}

.alper-nav-link:hover, .alper-nav-item.active .alper-nav-link {
  background-color: var(--alper-surface-subtle);
  color: var(--alper-text-primary);
}

.alper-main-content {
  flex: 1;
  padding: calc(var(--alper-density-unit) * 3);
  overflow-y: auto;
}

.alper-page-header {
  margin-bottom: calc(var(--alper-density-unit) * 3);
  border-bottom: 1px solid var(--alper-border-subtle);
  padding-bottom: calc(var(--alper-density-unit) * 2);
}

.alper-page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.alper-region {
  margin-bottom: calc(var(--alper-density-unit) * 3);
  background: var(--alper-surface-default);
}

.alper-region-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: calc(var(--alper-density-unit) * 1.5);
}

/* Component Level Styles */
.alper-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--alper-button-height);
  padding: 0 calc(var(--alper-density-unit) * 2);
  border-radius: var(--alper-radius-md);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color var(--alper-motion-fast-duration) var(--alper-motion-fast-easing);
}

.alper-btn:focus-visible {
  outline: 2px solid var(--alper-focus-ring);
  outline-offset: 2px;
}

.alper-btn-primary {
  background-color: var(--alper-action-primary);
  color: var(--alper-text-inverse);
}

.alper-btn-primary:hover {
  background-color: var(--alper-action-primary-hover);
}

.alper-btn-secondary {
  background-color: var(--alper-action-secondary);
  color: var(--alper-text-primary);
  border-color: var(--alper-border-subtle);
}

.alper-input {
  height: var(--alper-input-height);
  padding: 0 calc(var(--alper-density-unit) * 1.5);
  border: 1px solid var(--alper-border-strong);
  border-radius: var(--alper-radius-md);
  background-color: var(--alper-surface-default);
  color: var(--alper-text-primary);
  box-sizing: border-box;
}

.alper-input:focus-visible {
  outline: 2px solid var(--alper-focus-ring);
  outline-offset: 1px;
}

.alper-table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--alper-border-subtle);
  border-radius: var(--alper-radius-md);
}

.alper-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-feature-settings: var(--alper-font-feature-settings);
}

.alper-table th, .alper-table td {
  padding: calc(var(--alper-density-unit) * 1) calc(var(--alper-density-unit) * 1.5);
  border-bottom: 1px solid var(--alper-border-subtle);
  height: var(--alper-table-row-height);
}

.alper-table th {
  background-color: var(--alper-surface-subtle);
  font-weight: 600;
  color: var(--alper-text-secondary);
}

.alper-table tr:hover td {
  background-color: var(--alper-surface-subtle);
}

.alper-badge {
  display: inline-flex;
  padding: calc(var(--alper-density-unit) * 0.25) calc(var(--alper-density-unit) * 1);
  border-radius: var(--alper-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--alper-surface-subtle);
  color: var(--alper-text-secondary);
}

.alper-alert {
  padding: calc(var(--alper-density-unit) * 1.5);
  border-radius: var(--alper-radius-md);
  background-color: var(--alper-surface-elevated);
  border: 1px solid var(--alper-border-subtle);
  border-left: 4px solid var(--alper-action-primary);
  margin-bottom: calc(var(--alper-density-unit) * 2);
}

/* Modal Dialog */
.alper-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alper-modal-card {
  background: var(--alper-surface-default);
  border-radius: var(--alper-radius-lg);
  padding: calc(var(--alper-density-unit) * 3);
  max-width: 500px;
  width: 90%;
  box-shadow: var(--alper-shadow-lg);
}

/* Drawer */
.alper-drawer-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.alper-drawer-panel {
  width: 400px;
  max-width: 90vw;
  height: 100%;
  background: var(--alper-surface-default);
  box-shadow: var(--alper-shadow-lg);
  padding: calc(var(--alper-density-unit) * 3);
  overflow-y: auto;
}

/* Responsive contract rules */
@media (max-width: 768px) {
  .alper-app-shell {
    flex-direction: column;
  }
  .alper-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--alper-border-subtle);
  }
  .alper-table th, .alper-table td {
    padding: calc(var(--alper-density-unit) * 0.75);
  }
}
`;

    const interactionJs = `// Alper Design OS - Technology-Neutral Vanilla Interactions
document.addEventListener('DOMContentLoaded', () => {
  // 1. Modal focus trap & escape dismissal
  document.querySelectorAll('[data-alper-modal]').forEach(modal => {
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.add('alper-hidden');
      }
    });
  });

  // 2. Table row selection
  document.querySelectorAll('.alper-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      row.classList.toggle('alper-row-selected');
    });
  });

  // 3. Drawer dismiss
  document.querySelectorAll('[data-alper-drawer-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const drawer = btn.closest('.alper-drawer-backdrop');
      if (drawer) drawer.style.display = 'none';
    });
  });
});
`;

    const tokensCss = generateCssVariables(canonicalTokensV2);

    return {
      stack: this.stack,
      primaryFile: {
        path: 'index.html',
        content: htmlContent,
        language: 'html'
      },
      supportingFiles: [
        { path: 'styles/alper-tokens.css', content: tokensCss, language: 'css' },
        { path: 'styles/alper-layout.css', content: layoutCss, language: 'css' },
        { path: 'scripts/alper-interactions.js', content: interactionJs, language: 'javascript' }
      ],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(htmlContent),
        cssBytes: Buffer.byteLength(tokensCss) + Buffer.byteLength(layoutCss),
        jsBytes: Buffer.byteLength(interactionJs),
        externalDependencyCount: 0
      }
    };
  }

  renderComponentBlueprint(blueprint: ComponentBlueprint, options: RenderOptions = {}): RendererOutput {
    const markup = this.renderComponentMarkup(blueprint);
    const css = generateCssVariables(canonicalTokensV2);

    return {
      stack: this.stack,
      primaryFile: {
        path: `${blueprint.id}.html`,
        content: markup,
        language: 'html'
      },
      supportingFiles: [
        { path: 'tokens.css', content: css, language: 'css' }
      ],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(markup),
        cssBytes: Buffer.byteLength(css),
        jsBytes: 0,
        externalDependencyCount: 0
      }
    };
  }

  renderTokens(options: TokenRenderOptions = {}): RendererOutput {
    const css = generateCssVariables(canonicalTokensV2);
    return {
      stack: this.stack,
      primaryFile: {
        path: 'tokens.css',
        content: css,
        language: 'css'
      },
      supportingFiles: [],
      assetMetrics: {
        htmlBytes: 0,
        cssBytes: Buffer.byteLength(css),
        jsBytes: 0,
        externalDependencyCount: 0
      }
    };
  }

  renderInteractionContract(contract: InteractionContract): RendererOutput {
    const js = `// Compiled Interaction Contract\nexport const contract = ${JSON.stringify(contract, null, 2)};`;
    return {
      stack: this.stack,
      primaryFile: { path: 'interaction-contract.js', content: js, language: 'javascript' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: Buffer.byteLength(js), externalDependencyCount: 0 }
    };
  }

  renderAccessibilityContract(contract: AccessibilityContract): RendererOutput {
    const json = JSON.stringify(contract, null, 2);
    return {
      stack: this.stack,
      primaryFile: { path: 'accessibility-contract.json', content: json, language: 'json' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: 0, externalDependencyCount: 0 }
    };
  }

  private renderComponentMarkup(comp: ComponentBlueprint): string {
    switch (comp.type) {
      case 'BUTTON':
        return `<button type="button" class="alper-btn alper-btn-primary" id="${comp.id}" aria-label="Action">${comp.role || 'Action'}</button>`;
      case 'INPUT':
        return `<input type="text" class="alper-input" id="${comp.id}" placeholder="Search records..." aria-label="Search">`;
      case 'BADGE':
        return `<span class="alper-badge" id="${comp.id}">Active</span>`;
      case 'ALERT':
        return `<div class="alper-alert" role="alert" id="${comp.id}"><strong>Notice:</strong> High-density operational data ready.</div>`;
      case 'FILTER_BAR':
        return `<div class="alper-filter-bar" role="search" id="${comp.id}">
          <input type="text" class="alper-input" placeholder="Filter by keyword..." aria-label="Filter records">
          <button type="button" class="alper-btn alper-btn-secondary">Clear</button>
        </div>`;
      case 'DATA_TABLE':
        return `<div class="alper-table-container" id="${comp.id}">
          <table class="alper-table" aria-label="Data Table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>REC-001</td><td>Telemetry Cluster Node A</td><td><span class="alper-badge">Healthy</span></td><td>2026-10-10 14:00</td></tr>
              <tr><td>REC-002</td><td>API Gateway Dispatcher</td><td><span class="alper-badge">Healthy</span></td><td>2026-10-10 14:05</td></tr>
              <tr><td>REC-003</td><td>Distributed Cache Replica</td><td><span class="alper-badge">Warning</span></td><td>2026-10-10 14:10</td></tr>
            </tbody>
          </table>
        </div>`;
      case 'DRAWER':
        return `<div class="alper-drawer-backdrop" id="${comp.id}" style="display:none;" aria-label="Detail Panel">
          <aside class="alper-drawer-panel">
            <h3>Record Details</h3>
            <p>ID: REC-001</p>
            <button type="button" class="alper-btn alper-btn-secondary" data-alper-drawer-close>Close</button>
          </aside>
        </div>`;
      case 'MODAL_DIALOG':
        return `<div class="alper-modal-backdrop" id="${comp.id}" style="display:none;" role="dialog" aria-modal="true">
          <div class="alper-modal-card">
            <h3>Confirmation Required</h3>
            <p>Are you sure you want to execute bulk action?</p>
            <button type="button" class="alper-btn alper-btn-primary">Confirm</button>
            <button type="button" class="alper-btn alper-btn-secondary">Cancel</button>
          </div>
        </div>`;
      default:
        return `<div class="alper-component" id="${comp.id}">${comp.type}</div>`;
    }
  }
}
