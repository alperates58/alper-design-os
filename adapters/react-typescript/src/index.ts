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

export class ReactTypeScriptAdapter extends BaseAdapter {
  readonly id = 'react-typescript';
  readonly name = 'React + TypeScript';
  readonly description = 'React components written in strictly typed TypeScript (TSX) with zero-any guarantees.';
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

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: 'src/App.tsx',
        content: `import React from 'react';\nimport './styles/tokens.css';\n\nexport const App: React.FC = () => {\n  return (\n    <div className="alper-workbench-ts">\n      <header><h1>${options.productName}</h1></header>\n      <main id="workbench-view"></main>\n    </div>\n  );\n};\n\nexport default App;`,
        language: 'typescript',
        description: 'React TypeScript main application shell'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: `src/components/${options.componentName}.tsx`,
        content: `import React from 'react';\n\nexport interface ${options.componentName}Props {\n  title?: string;\n  density?: 'EXTREME' | 'HIGH' | 'MEDIUM' | 'SPACIOUS';\n  className?: string;\n  children?: React.ReactNode;\n}\n\n/**\n * ${pattern.name} (Strict TypeScript React Component)\n * Accessibility Role: ${pattern.accessibilityRole}\n */\nexport const ${options.componentName}: React.FC<${options.componentName}Props> = ({\n  title = '${pattern.name}',\n  density = 'HIGH',\n  className = '',\n  children\n}) => {\n  return (\n    <section\n      className={\`alper-pattern-${pattern.id} \${className}\`}\n      data-density={density}\n      role="${pattern.accessibilityRole}"\n      aria-label={title}\n    >\n      <header className="pattern-header">\n        <h3>{title}</h3>\n      </header>\n      <div className="pattern-content">\n        {children}\n      </div>\n    </section>\n  );\n};\n\nexport default ${options.componentName};`,
        language: 'typescript',
        description: `React TypeScript component for ${pattern.name}`
      }
    ];
  }
}

export default ReactTypeScriptAdapter;
