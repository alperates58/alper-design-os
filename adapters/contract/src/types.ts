import { ProductUXProfile, UXPatternSpec, TokenOutputFormat } from '@alper-design-os/design-core';

export interface ProjectFile {
  path: string;
  extension: string;
  content?: string;
  sizeBytes?: number;
}

export interface StackDetectionMatch {
  matched: boolean;
  confidence: number; // 0.0 to 1.0
  detectedFramework?: string;
  reason: string;
  detectedFiles: string[];
}

export interface AdapterCapabilities {
  supportsTypeScript: boolean;
  templateEngine: string;
  stylingApproaches: ('CSS_VARIABLES' | 'SCSS' | 'TAILWIND' | 'BOOTSTRAP' | 'INLINE_STYLES')[];
  serverRendered: boolean;
  componentParadigm: 'WEB_COMPONENTS' | 'REACT_COMPONENTS' | 'SERVER_TEMPLATES' | 'RAZOR_COMPONENTS';
}

export interface AdapterArtifact {
  path: string;
  content: string;
  language: string;
  description: string;
}

export interface ScaffoldOptions {
  rootDir: string;
  productName: string;
  profile: ProductUXProfile;
}

export interface RenderOptions {
  componentName: string;
  props?: Record<string, unknown>;
}

export interface ModernizationStep {
  stepNumber: number;
  title: string;
  description: string;
  affectedFilesPattern: string[];
  safeToRunAutomatically: boolean;
}

export interface ModernizationPhase {
  phase: number;
  title: string;
  summary: string;
  steps: ModernizationStep[];
}

export interface ModernizationStrategy {
  adapterId: string;
  summary: string;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  phases: ModernizationPhase[];
}

export interface AdapterContract {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly targetExtensions: string[];
  readonly supportedModes: ('NEW' | 'REPAIR' | 'MODERNIZE')[];

  getCapabilities(): AdapterCapabilities;
  detect(files: ProjectFile[]): StackDetectionMatch;
  generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]>;
  renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]>;
  mapTokens(format: TokenOutputFormat): Promise<AdapterArtifact[]>;
  recommendModernization(files: ProjectFile[]): ModernizationStrategy;
}
