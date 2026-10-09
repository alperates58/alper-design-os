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

export class HtmlCssJsAdapter extends BaseAdapter {
  readonly id = 'html-css-js';
  readonly name = 'Semantic HTML / CSS / JavaScript';
  readonly description = 'Semantic HTML5 layouts, structured CSS modules/BEM, and modern vanilla JavaScript controllers.';
  readonly targetExtensions = ['.html', '.css', '.js', '.mjs'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'Semantic HTML5 Templates',
      stylingApproaches: ['CSS_VARIABLES', 'SCSS'],
      serverRendered: false,
      componentParadigm: 'WEB_COMPONENTS'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const htmlFiles = files.filter((f) => f.extension === '.html');
    const hasCss = files.some((f) => f.extension === '.css');
    const isVanilla = !files.some((f) =>
      ['.jsx', '.tsx', '.vue', '.svelte', '.blade.php', '.cshtml'].includes(f.extension)
    );

    if (htmlFiles.length > 0 && hasCss && isVanilla) {
      return {
        matched: true,
        confidence: 0.85,
        detectedFramework: 'HTML/CSS/JS',
        reason: 'Detected semantic HTML and CSS with vanilla JS scripts.',
        detectedFiles: files.map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No vanilla HTML/CSS/JS signature matched.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: 'public/index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${options.productName}</title>
  <link rel="stylesheet" href="../styles/tokens.css">
</head>
<body>
  <div class="workbench-layout">
    <header class="workbench-header"><h2>${options.productName}</h2></header>
    <main id="app-container"></main>
  </div>
</body>
</html>`,
        language: 'html',
        description: 'Semantic HTML entry point'
      },
      {
        path: 'src/main.js',
        content: `import { initWorkbench } from './workbench.js';\ndocument.addEventListener('DOMContentLoaded', initWorkbench);`,
        language: 'javascript',
        description: 'App initializer'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: `src/components/${pattern.id}.js`,
        content: `export function render${options.componentName}(container) {
  container.innerHTML = \`
    <section class="alper-${pattern.id}" role="${pattern.accessibilityRole}" aria-label="${pattern.name}">
      <header class="pattern-header"><h3>${pattern.name}</h3></header>
      <div class="pattern-content"></div>
    </section>
  \`;
}`,
        language: 'javascript',
        description: `Vanilla JS component renderer for ${pattern.name}`
      }
    ];
  }
}

export default HtmlCssJsAdapter;
