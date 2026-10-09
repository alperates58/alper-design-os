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

export class ReactAdapter extends BaseAdapter {
  readonly id = 'react';
  readonly name = 'React (JavaScript / JSX)';
  readonly description = 'React functional components using modern hooks and JavaScript JSX syntax.';
  readonly targetExtensions = ['.jsx', '.js'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'React JSX',
      stylingApproaches: ['CSS_VARIABLES', 'TAILWIND', 'SCSS'],
      serverRendered: false,
      componentParadigm: 'REACT_COMPONENTS'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const pkg = files.find((f) => f.path.endsWith('package.json'));
    let hasReact = false;

    if (pkg && pkg.content) {
      hasReact = pkg.content.includes('"react"') || pkg.content.includes('"react-dom"');
    }

    const hasJsx = files.some((f) => f.extension === '.jsx');
    const hasTsx = files.some((f) => f.extension === '.tsx');

    if (hasReact && !hasTsx) {
      return {
        matched: true,
        confidence: 0.9,
        detectedFramework: 'React (JavaScript)',
        reason: 'Detected React dependency with JSX files and without TypeScript configuration.',
        detectedFiles: files.filter((f) => f.extension === '.jsx' || f.path.endsWith('package.json')).map((f) => f.path)
      };
    }

    if (hasJsx && !hasTsx) {
      return {
        matched: true,
        confidence: 0.8,
        detectedFramework: 'React (JSX)',
        reason: 'Found .jsx files without TypeScript.',
        detectedFiles: files.filter((f) => f.extension === '.jsx').map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No non-TypeScript React project markers found.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: 'src/App.jsx',
        content: `import React from 'react';\nimport './styles/tokens.css';\n\nexport default function App() {\n  return (\n    <div className="alper-workbench">\n      <header><h1>${options.productName}</h1></header>\n      <main id="workbench-view"></main>\n    </div>\n  );\n}`,
        language: 'javascript',
        description: 'React main App component'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: `src/components/${options.componentName}.jsx`,
        content: `import React from 'react';\n\n/**\n * ${pattern.name}\n * Role: ${pattern.accessibilityRole}\n */\nexport function ${options.componentName}(props) {\n  return (\n    <section className="alper-pattern-${pattern.id}" role="${pattern.accessibilityRole}" aria-label="${pattern.name}">\n      <header className="pattern-header"><h3>${pattern.name}</h3></header>\n      <div className="pattern-content">{props.children}</div>\n    </section>\n  );\n}\n\nexport default ${options.componentName};`,
        language: 'javascript',
        description: `React JSX component for ${pattern.name}`
      }
    ];
  }
}

export default ReactAdapter;
