import { describe, it, expect } from 'vitest';
import { detectStack, auditAccessibility, auditExistingUI } from '@alper-design-os/analyzer';
import { ProjectFile } from '@alper-design-os/adapter-contract';

describe('Project Analyzer & Detector', () => {
  it('detects a React + TypeScript project with Tailwind CSS', () => {
    const files: ProjectFile[] = [
      {
        path: 'package.json',
        extension: '.json',
        content: JSON.stringify({
          dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0' },
          devDependencies: { typescript: '^5.0.0', tailwindcss: '^3.4.0' }
        })
      },
      { path: 'tsconfig.json', extension: '.json', content: '{}' },
      { path: 'src/App.tsx', extension: '.tsx', content: 'export default function App() { return <div>Hello</div>; }' },
      { path: 'src/index.css', extension: '.css', content: '@tailwind base;\n@tailwind components;' }
    ];

    const profile = detectStack(files);
    expect(profile.primaryStack).toContain('React + TypeScript');
    expect(profile.hasTypeScript).toBe(true);
    expect(profile.styling.usesTailwind).toBe(true);
    expect(profile.recommendedAdapterId).toBe('react-typescript');
  });

  it('detects a Laravel / Blade project', () => {
    const files: ProjectFile[] = [
      {
        path: 'composer.json',
        extension: '.json',
        content: JSON.stringify({ require: { 'laravel/framework': '^11.0' } })
      },
      { path: 'resources/views/welcome.blade.php', extension: '.blade.php', content: '<html><body>Welcome</body></html>' }
    ];

    const profile = detectStack(files);
    expect(profile.primaryStack).toBe('Laravel (Blade)');
    expect(profile.templateEngine).toBe('Blade');
    expect(profile.recommendedAdapterId).toBe('laravel-blade');
  });

  it('detects an ASP.NET Core Razor project', () => {
    const files: ProjectFile[] = [
      { path: 'ManufacturingAPS.csproj', extension: '.csproj', content: '<Project Sdk="Microsoft.NET.Sdk.Web"></Project>' },
      { path: 'Pages/Index.cshtml', extension: '.cshtml', content: '@page\n<h1>APS Workbench</h1>' }
    ];

    const profile = detectStack(files);
    expect(profile.primaryStack).toBe('ASP.NET Core (Razor)');
    expect(profile.languages).toContain('C#');
    expect(profile.recommendedAdapterId).toBe('aspnet-razor');
  });

  it('detects native PHP projects', () => {
    const files: ProjectFile[] = [
      { path: 'index.php', extension: '.php', content: '<?php echo "Hello World"; ?>' },
      { path: 'styles/main.css', extension: '.css', content: 'body { background: #fff; }' }
    ];

    const profile = detectStack(files);
    expect(profile.primaryStack).toBe('Native PHP');
    expect(profile.recommendedAdapterId).toBe('php');
  });

  it('audits UI and identifies hardcoded hex colors', () => {
    const files: ProjectFile[] = [
      {
        path: 'styles/app.css',
        extension: '.css',
        content: '.card { color: #123456; background: #654321; border-color: #abcdef; fill: #fedcba; }'
      }
    ];

    const audit = auditExistingUI(files);
    expect(audit.totalIssues).toBeGreaterThan(0);
    expect(audit.issues.some((i) => i.id === 'UI-HARDCODED-COLORS')).toBe(true);
  });

  it('audits accessibility and flags missing img alt attributes', () => {
    const files: ProjectFile[] = [
      {
        path: 'src/Header.html',
        extension: '.html',
        content: '<header><img src="logo.png"></header>'
      }
    ];

    const a11y = auditAccessibility(files);
    expect(a11y.violations.length).toBeGreaterThan(0);
    expect(a11y.violations.some((v) => v.id === 'A11Y-MISSING-IMG-ALT')).toBe(true);
  });
});
