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

export class GenericWebAdapter extends BaseAdapter {
  readonly id = 'generic-web';
  readonly name = 'Generic Web Standards';
  readonly description = 'Framework-agnostic HTML5, CSS Custom Properties, and modular JavaScript.';
  readonly targetExtensions = ['.html', '.css', '.js'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'Vanilla HTML5',
      stylingApproaches: ['CSS_VARIABLES'],
      serverRendered: false,
      componentParadigm: 'WEB_COMPONENTS'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const hasHtml = files.some((f) => f.extension === '.html');
    const hasCss = files.some((f) => f.extension === '.css');
    const hasJs = files.some((f) => f.extension === '.js');
    const hasFramework = files.some((f) =>
      f.path.includes('react') ||
      f.extension === '.jsx' ||
      f.extension === '.tsx' ||
      f.extension === '.blade.php' ||
      f.extension === '.razor'
    );

    if (hasHtml && (hasCss || hasJs) && !hasFramework) {
      return {
        matched: true,
        confidence: 0.8,
        detectedFramework: 'Generic Web',
        reason: 'Detected HTML and CSS/JS without framework-specific dependencies.',
        detectedFiles: files.filter((f) => ['.html', '.css', '.js'].includes(f.extension)).map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No standard HTML/CSS web structure found without framework markers.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.productName} - Alper Design OS</title>
  <link rel="stylesheet" href="styles/tokens.css">
  <link rel="stylesheet" href="styles/layout.css">
</head>
<body class="alper-workbench-body">
  <header class="alper-workbench-header">
    <h1>${options.productName}</h1>
  </header>
  <main class="alper-workbench-container">
    <div id="workbench-root"></div>
  </main>
  <script type="module" src="scripts/main.js"></script>
</body>
</html>`;

    return [
      {
        path: 'index.html',
        content: indexHtml,
        language: 'html',
        description: 'Primary HTML5 workbench entry point'
      },
      {
        path: 'scripts/main.js',
        content: `console.log('${options.productName} initialized via Alper Design OS');`,
        language: 'javascript',
        description: 'Main script bundle entry point'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    const customElementTag = `alper-${pattern.id}`;
    const componentCode = `/**
 * ${pattern.name} - Web Component
 * Accessibility role: ${pattern.accessibilityRole}
 */
class ${options.componentName} extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', '${pattern.accessibilityRole}');
    this.innerHTML = \`
      <div class="alper-pattern-${pattern.id}" data-density="high">
        <div class="alper-pattern-header">
          <span>${pattern.name}</span>
        </div>
        <div class="alper-pattern-body">
          <!-- Dynamic high-density slot -->
        </div>
      </div>
    \`;
  }
}
customElements.define('${customElementTag}', ${options.componentName});
export default ${options.componentName};`;

    return [
      {
        path: `components/${pattern.id}.js`,
        content: componentCode,
        language: 'javascript',
        description: `Vanilla Web Component for ${pattern.name}`
      }
    ];
  }
}

export default GenericWebAdapter;
