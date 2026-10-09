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

export class LaravelBladeAdapter extends BaseAdapter {
  readonly id = 'laravel-blade';
  readonly name = 'Laravel / Blade Components';
  readonly description = 'Laravel Blade anonymous and class-based components, Alpine.js integration, and Tailwind utilities.';
  readonly targetExtensions = ['.blade.php', '.php'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'Laravel Blade',
      stylingApproaches: ['TAILWIND', 'CSS_VARIABLES', 'BOOTSTRAP'],
      serverRendered: true,
      componentParadigm: 'SERVER_TEMPLATES'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const hasBladeFiles = files.some((f) => f.path.endsWith('.blade.php'));
    const composer = files.find((f) => f.path.endsWith('composer.json'));
    let hasLaravelDep = false;

    if (composer && composer.content) {
      hasLaravelDep = composer.content.includes('"laravel/framework"');
    }

    if (hasBladeFiles || hasLaravelDep) {
      return {
        matched: true,
        confidence: 0.95,
        detectedFramework: 'Laravel (Blade)',
        reason: 'Detected Laravel Blade templates (*.blade.php) or laravel/framework dependency in composer.json.',
        detectedFiles: files.filter((f) => f.path.endsWith('.blade.php') || f.path.endsWith('composer.json')).map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No Laravel or Blade markers detected.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: 'resources/views/layouts/workbench.blade.php',
        content: `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ $title ?? '${options.productName}' }}</title>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-surface-base text-gray-100 antialiased font-sans">
  <header class="h-10 border-b border-surface-border px-4 flex items-center justify-between">
    <h1 class="font-semibold text-sm">${options.productName}</h1>
  </header>
  <main class="h-[calc(100vh-2.5rem)] flex">
    {{ $slot }}
  </main>
</body>
</html>`,
        language: 'php',
        description: 'Laravel Blade master workbench layout'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    const kebabName = options.componentName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2');

    return [
      {
        path: `resources/views/components/${kebabName}.blade.php`,
        content: `@props([
    'title' => '${pattern.name}',
    'density' => 'high'
])

<section
    {{ $attributes->merge(['class' => 'alper-pattern-${pattern.id} border border-surface-border bg-surface-layer-1 flex flex-col']) }}
    role="${pattern.accessibilityRole}"
    aria-label="{{ $title }}"
    data-density="{{ $density }}"
>
    <header class="px-3 py-1.5 border-b border-surface-border flex items-center justify-between text-xs font-medium">
        <span>{{ $title }}</span>
    </header>
    <div class="flex-1 overflow-auto p-2">
        {{ $slot }}
    </div>
</section>`,
        language: 'php',
        description: `Blade component for ${pattern.name}`
      }
    ];
  }
}

export default LaravelBladeAdapter;
