import {
  PageBlueprint,
  ComponentBlueprint,
  InteractionContract,
  AccessibilityContract,
  RendererOutput,
  TargetStack,
  ThemeMode,
  DensityMode
} from '../types.js';

export interface RenderOptions {
  theme?: ThemeMode;
  density?: DensityMode;
  includeStyles?: boolean;
  componentPrefix?: string;
}

export interface TokenRenderOptions {
  theme?: ThemeMode;
  format?: 'CSS' | 'TS' | 'TAILWIND' | 'SCSS';
}

export interface TargetRenderer {
  readonly stack: TargetStack;
  readonly name: string;
  readonly description: string;

  renderPageBlueprint(blueprint: PageBlueprint, options?: RenderOptions): RendererOutput;
  renderComponentBlueprint(blueprint: ComponentBlueprint, options?: RenderOptions): RendererOutput;
  renderTokens(options?: TokenRenderOptions): RendererOutput;
  renderInteractionContract(contract: InteractionContract): RendererOutput;
  renderAccessibilityContract(contract: AccessibilityContract): RendererOutput;
}
