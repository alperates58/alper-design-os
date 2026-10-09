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

export class PhpAdapter extends BaseAdapter {
  readonly id = 'php';
  readonly name = 'Native PHP';
  readonly description = 'Native PHP templates, server-rendered views, and modular partial includes.';
  readonly targetExtensions = ['.php'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'Native PHP Views',
      stylingApproaches: ['CSS_VARIABLES', 'BOOTSTRAP', 'SCSS'],
      serverRendered: true,
      componentParadigm: 'SERVER_TEMPLATES'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const phpFiles = files.filter((f) => f.extension === '.php' && !f.path.includes('.blade.php'));
    const hasLaravelBlade = files.some((f) => f.path.includes('.blade.php'));

    if (phpFiles.length > 0 && !hasLaravelBlade) {
      return {
        matched: true,
        confidence: 0.85,
        detectedFramework: 'PHP (Native)',
        reason: 'Detected .php files without Laravel Blade template markers.',
        detectedFiles: phpFiles.map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No standard PHP files found.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: 'index.php',
        content: `<?php\n$productName = "${options.productName}";\n?>\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title><?= htmlspecialchars($productName) ?></title>\n  <link rel="stylesheet" href="styles/tokens.css">\n</head>\n<body class="alper-workbench-body">\n  <header><h1><?= htmlspecialchars($productName) ?></h1></header>\n  <main class="workbench-root">\n    <?php include __DIR__ . '/partials/workbench.php'; ?>\n  </main>\n</body>\n</html>`,
        language: 'php',
        description: 'Native PHP master template'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: `partials/${pattern.id}.php`,
        content: `<?php\n/**\n * ${pattern.name} - PHP Partial\n * Role: ${pattern.accessibilityRole}\n */\n$title = $title ?? "${pattern.name}";\n$density = $density ?? "high";\n?>\n<section class="alper-pattern-${pattern.id}" role="${pattern.accessibilityRole}" data-density="<?= htmlspecialchars($density) ?>">\n  <header class="pattern-header"><h3><?= htmlspecialchars($title) ?></h3></header>\n  <div class="pattern-content">\n    <!-- Dynamic PHP Slot -->\n  </div>\n</section>`,
        language: 'php',
        description: `PHP template partial for ${pattern.name}`
      }
    ];
  }
}

export default PhpAdapter;
