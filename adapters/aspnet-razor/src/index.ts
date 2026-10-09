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

export class AspNetRazorAdapter extends BaseAdapter {
  readonly id = 'aspnet-razor';
  readonly name = 'ASP.NET Core Razor / Blazor';
  readonly description = 'ASP.NET Core Razor Pages (.cshtml) and Blazor component (.razor) integration with TagHelpers and C# models.';
  readonly targetExtensions = ['.cshtml', '.razor', '.cs'];

  getCapabilities(): AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'Razor C# Engine',
      stylingApproaches: ['CSS_VARIABLES', 'BOOTSTRAP', 'SCSS'],
      serverRendered: true,
      componentParadigm: 'RAZOR_COMPONENTS'
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const hasCsproj = files.some((f) => f.path.endsWith('.csproj') || f.path.endsWith('.sln'));
    const hasRazor = files.some((f) => f.extension === '.cshtml' || f.extension === '.razor');

    if (hasCsproj || hasRazor) {
      return {
        matched: true,
        confidence: 0.95,
        detectedFramework: 'ASP.NET Core (Razor/Blazor)',
        reason: 'Detected .csproj/.sln files or Razor/Blazor template files (*.cshtml, *.razor).',
        detectedFiles: files.filter((f) => f.extension === '.cshtml' || f.extension === '.razor' || f.path.endsWith('.csproj')).map((f) => f.path)
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No .NET/Razor markers detected.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: 'Pages/Shared/_WorkbenchLayout.cshtml',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@ViewData["Title"] - ${options.productName}</title>
  <link rel="stylesheet" href="~/css/tokens.css" asp-append-version="true" />
  <link rel="stylesheet" href="~/css/workbench.css" asp-append-version="true" />
</head>
<body class="alper-workbench-body">
  <header class="alper-header">
    <h1>${options.productName}</h1>
  </header>
  <main role="main" class="alper-workbench-main">
    @RenderBody()
  </main>
  @await RenderSectionAsync("Scripts", required: false)
</body>
</html>`,
        language: 'csharp',
        description: 'ASP.NET Core Razor master layout'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    return [
      {
        path: `Components/${options.componentName}.razor`,
        content: `@* ${pattern.name} - Blazor Component *@
<div class="alper-pattern-${pattern.id}" role="${pattern.accessibilityRole}" aria-label="@Title">
    <div class="pattern-header">
        <h4>@Title</h4>
    </div>
    <div class="pattern-content">
        @ChildContent
    </div>
</div>

@code {
    [Parameter]
    public string Title { get; set; } = "${pattern.name}";

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}`,
        language: 'csharp',
        description: `Blazor component for ${pattern.name}`
      }
    ];
  }
}

export default AspNetRazorAdapter;
