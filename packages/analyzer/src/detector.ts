import { ProjectFile } from '@alper-design-os/adapter-contract';
import { AdapterRegistry } from '@alper-design-os/registry';
import { ProjectProfile } from './types.js';

export function detectStack(files: ProjectFile[], rootDir: string = '.'): ProjectProfile {
  const frameworks: string[] = [];
  const languages: Set<string> = new Set();
  const detectedFiles: string[] = [];
  const packageManagers: Set<'npm' | 'pnpm' | 'yarn' | 'composer' | 'nuget'> = new Set();

  let hasTypeScript = false;
  let usesTailwind = false;
  let usesBootstrap = false;
  let usesScss = false;
  let usesCssModules = false;
  let usesPlainCss = false;
  let templateEngine = 'Standard HTML';

  // Check lockfiles & package managers
  if (files.some((f) => f.path.endsWith('pnpm-lock.yaml'))) packageManagers.add('pnpm');
  if (files.some((f) => f.path.endsWith('package-lock.json'))) packageManagers.add('npm');
  if (files.some((f) => f.path.endsWith('yarn.lock'))) packageManagers.add('yarn');
  if (files.some((f) => f.path.endsWith('composer.lock') || f.path.endsWith('composer.json'))) packageManagers.add('composer');
  if (files.some((f) => f.path.endsWith('.csproj') || f.path.endsWith('.sln') || f.path.endsWith('packages.config'))) packageManagers.add('nuget');

  // 1. Analyze package.json
  const pkgFile = files.find((f) => f.path.endsWith('package.json'));
  if (pkgFile) {
    detectedFiles.push(pkgFile.path);
    if (!packageManagers.has('pnpm') && !packageManagers.has('yarn')) packageManagers.add('npm');

    const content = pkgFile.content || '';
    if (content.includes('"react"') || content.includes('"react-dom"')) {
      frameworks.push('React');
    }
    if (content.includes('"typescript"')) {
      hasTypeScript = true;
    }
    if (content.includes('"tailwindcss"')) {
      usesTailwind = true;
    }
    if (content.includes('"bootstrap"')) {
      usesBootstrap = true;
    }
    if (content.includes('"sass"') || content.includes('"node-sass"')) {
      usesScss = true;
    }
  }

  // 2. Analyze composer.json
  const composerFile = files.find((f) => f.path.endsWith('composer.json'));
  if (composerFile) {
    detectedFiles.push(composerFile.path);
    languages.add('PHP');
    const content = composerFile.content || '';
    if (content.includes('"laravel/framework"')) {
      frameworks.push('Laravel');
      templateEngine = 'Blade';
    }
  }

  // 3. Analyze .NET / C#
  const csprojFiles = files.filter((f) => f.path.endsWith('.csproj') || f.path.endsWith('.sln'));
  if (csprojFiles.length > 0) {
    csprojFiles.forEach((f) => detectedFiles.push(f.path));
    languages.add('C#');
    frameworks.push('ASP.NET Core');
  }

  // 4. File extension heuristics
  for (const f of files) {
    if (f.extension === '.ts' || f.extension === '.tsx') {
      hasTypeScript = true;
      languages.add('TypeScript');
    } else if (f.extension === '.js' || f.extension === '.jsx' || f.extension === '.mjs') {
      languages.add('JavaScript');
    } else if (f.extension === '.php') {
      languages.add('PHP');
    } else if (f.extension === '.cs') {
      languages.add('C#');
    } else if (f.extension === '.html') {
      languages.add('HTML');
    }

    if (f.extension === '.blade.php') {
      templateEngine = 'Blade';
      if (!frameworks.includes('Laravel')) frameworks.push('Laravel');
    } else if (f.extension === '.cshtml' || f.extension === '.razor') {
      templateEngine = 'Razor / Blazor';
      if (!frameworks.includes('ASP.NET Core')) frameworks.push('ASP.NET Core');
    } else if (f.extension === '.jsx' || f.extension === '.tsx') {
      if (!frameworks.includes('React')) frameworks.push('React');
      templateEngine = 'React JSX/TSX';
    }

    if (f.extension === '.scss' || f.extension === '.sass') usesScss = true;
    if (f.extension === '.css') usesPlainCss = true;
    if (f.path.includes('.module.css') || f.path.includes('.module.scss')) usesCssModules = true;

    // Scan file content for CSS signatures
    if (f.content) {
      if (f.content.includes('@tailwind') || f.path.includes('tailwind.config')) usesTailwind = true;
      if (f.content.includes('bootstrap') || f.content.includes('container-fluid')) usesBootstrap = true;
    }
  }

  // Fallback defaults
  if (languages.size === 0) languages.add('JavaScript');

  let stylingApproach = 'CSS Custom Properties';
  if (usesTailwind) stylingApproach = 'Tailwind CSS';
  else if (usesBootstrap) stylingApproach = 'Bootstrap';
  else if (usesScss) stylingApproach = 'SCSS Variables';
  else if (usesCssModules) stylingApproach = 'CSS Modules';

  // Ask AdapterRegistry for best adapter
  const registry = AdapterRegistry.getInstance();
  const matchResult = registry.detectBestAdapter(files);

  const recommendedAdapterId = matchResult?.adapter.id || (hasTypeScript && frameworks.includes('React') ? 'react-typescript' : 'generic-web');
  const confidence = matchResult?.match.confidence ?? 0.8;

  let primaryStack = 'Generic Web';
  if (frameworks.includes('React')) {
    primaryStack = hasTypeScript ? 'React + TypeScript' : 'React (JavaScript)';
  } else if (frameworks.includes('Laravel')) {
    primaryStack = 'Laravel (Blade)';
  } else if (frameworks.includes('ASP.NET Core')) {
    primaryStack = 'ASP.NET Core (Razor)';
  } else if (languages.has('PHP')) {
    primaryStack = 'Native PHP';
  } else if (languages.has('TypeScript')) {
    primaryStack = 'TypeScript Standards';
  }

  return {
    rootDir,
    primaryStack,
    frameworks: Array.from(new Set(frameworks)),
    languages: Array.from(languages),
    styling: {
      approach: stylingApproach,
      usesTailwind,
      usesBootstrap,
      usesScss,
      usesCssModules,
      usesPlainCss
    },
    templateEngine,
    hasTypeScript,
    packageManagers: Array.from(packageManagers),
    fileCount: files.length,
    detectedFiles,
    recommendedAdapterId,
    confidence,
    summary: `Identified stack as ${primaryStack} with ${stylingApproach} and ${templateEngine}. Recommended adapter: ${recommendedAdapterId} (confidence: ${(confidence * 100).toFixed(0)}%).`
  };
}
