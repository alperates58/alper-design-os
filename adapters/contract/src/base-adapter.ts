import {
  AdapterArtifact,
  AdapterCapabilities,
  AdapterContract,
  ModernizationStrategy,
  ProjectFile,
  RenderOptions,
  ScaffoldOptions,
  StackDetectionMatch
} from './types.js';
import {
  createDefaultTokenCompiler,
  ProductUXProfile,
  TokenOutputFormat,
  UXPatternSpec
} from '@alper-design-os/design-core';

export abstract class BaseAdapter implements AdapterContract {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly targetExtensions: string[];
  readonly supportedModes: ('NEW' | 'REPAIR' | 'MODERNIZE')[] = ['NEW', 'REPAIR', 'MODERNIZE'];

  abstract getCapabilities(): AdapterCapabilities;
  abstract detect(files: ProjectFile[]): StackDetectionMatch;
  abstract generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]>;
  abstract renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]>;

  public async mapTokens(format: TokenOutputFormat): Promise<AdapterArtifact[]> {
    const compiler = createDefaultTokenCompiler();
    const output = compiler.compile(format);

    return [
      {
        path: `styles/${output.filename}`,
        content: output.content,
        language: format === 'typescript' ? 'typescript' : format === 'tailwind-json' ? 'json' : 'css',
        description: `Design tokens compiled to ${format}`
      }
    ];
  }

  public recommendModernization(files: ProjectFile[]): ModernizationStrategy {
    return {
      adapterId: this.id,
      summary: `Standard 4-phase incremental modernization for ${this.name}`,
      riskAssessment: 'LOW',
      phases: [
        {
          phase: 1,
          title: 'Design Token Extraction & Standardization',
          summary: 'Extract hardcoded styles to DTCG tokens without touching layout markup.',
          steps: [
            {
              stepNumber: 1,
              title: 'Generate CSS Variables Token Sheet',
              description: 'Place tokens.css in global assets directory.',
              affectedFilesPattern: ['styles/tokens.css'],
              safeToRunAutomatically: true
            },
            {
              stepNumber: 2,
              title: 'Reference tokens in global stylesheet',
              description: 'Import tokens.css into main stylesheet.',
              affectedFilesPattern: ['*.css', '*.scss'],
              safeToRunAutomatically: false
            }
          ]
        },
        {
          phase: 2,
          title: 'Workbench & Grid Modernization',
          summary: 'Standardize layout shells, split panes, and header containers.',
          steps: [
            {
              stepNumber: 3,
              title: 'Modernize Application Shell',
              description: 'Adopt responsive multi-pane layout grid.',
              affectedFilesPattern: ['layout/**'],
              safeToRunAutomatically: false
            }
          ]
        },
        {
          phase: 3,
          title: 'High-Density Component Upgrades',
          summary: 'Replace legacy tables, buttons, and inputs with accessible components.',
          steps: [
            {
              stepNumber: 4,
              title: 'Upgrade Data Tables',
              description: 'Refactor standard HTML tables to virtualized, accessible DataGrid.',
              affectedFilesPattern: ['views/**', 'components/**'],
              safeToRunAutomatically: false
            }
          ]
        },
        {
          phase: 4,
          title: 'Full Cohesive Integration',
          summary: 'Complete system-wide tokens and shortcuts alignment.',
          steps: [
            {
              stepNumber: 5,
              title: 'Audit and Clean Up Legacy CSS',
              description: 'Remove legacy vendor overrides and unused styles.',
              affectedFilesPattern: ['styles/**'],
              safeToRunAutomatically: false
            }
          ]
        }
      ]
    };
  }
}
