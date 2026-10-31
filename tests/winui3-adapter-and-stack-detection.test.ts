import { describe, it, expect } from 'vitest';
import { detectStack } from '@alper-design-os/analyzer';
import { AdapterRegistry } from '@alper-design-os/registry';
import { WinUI3Adapter } from '@alper-design-os/adapter-winui3-xaml';
import { ProjectFile } from '@alper-design-os/adapter-contract';
import { inferProductUXProfile, coreUXPatterns } from '@alper-design-os/design-core';

describe('FAZ 0.3.5C: WinUI 3 Adapter & Stack Detection Suite', () => {
  const registry = AdapterRegistry.getInstance();
  const winuiAdapter = registry.get('winui3-xaml') as WinUI3Adapter;

  it('registers WinUI3Adapter in AdapterRegistry as canonical desktop adapter', () => {
    expect(winuiAdapter).toBeDefined();
    expect(winuiAdapter.id).toBe('winui3-xaml');
    expect(winuiAdapter.name).toContain('WinUI 3');
    const caps = winuiAdapter.getCapabilities();
    expect(caps.componentParadigm).toBe('WINUI_XAML_MVVM');
    expect(caps.stylingApproaches).toContain('XAML_RESOURCE_DICTIONARY');
    expect(caps.supportsTypeScript).toBe(false);
    expect(caps.serverRendered).toBe(false);
    expect(caps.targetFrameworks).toContain('.NET 10.0');
  });

  describe('10-Fixture Stack Detection Matrix', () => {
    // 1. Alpiora Production Architecture
    it('Fixture 1: Correctly identifies Alpiora WinUI 3 / Windows App SDK stack', () => {
      const alpioraFiles: ProjectFile[] = [
        {
          path: 'alpiora.csproj',
          extension: '.csproj',
          content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0-windows10.0.19041.0</TargetFramework>
    <UseWinUI>true</UseWinUI>
    <WindowsPackageType>None</WindowsPackageType>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.WindowsAppSDK" Version="2.6.4" />
    <PackageReference Include="Microsoft.Windows.SDK.BuildTools" Version="10.0.28000.2957" />
  </ItemGroup>
</Project>`
        },
        {
          path: 'App.xaml',
          extension: '.xaml',
          content: `<Application xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <XamlControlsResources xmlns="using:Microsoft.UI.Xaml.Controls" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</Application>`
        },
        {
          path: 'MainWindow.xaml',
          extension: '.xaml',
          content: `<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Grid>
        <TextBlock Text="{x:Bind ViewModel.DeviceTitle, Mode=OneWay}" />
    </Grid>
</Window>`
        },
        {
          path: 'ViewModels/MainViewModel.cs',
          extension: '.cs',
          content: `using CommunityToolkit.Mvvm.ComponentModel;
public partial class MainViewModel : ObservableObject {
    [ObservableProperty] private string _deviceTitle = "iPhone 11";
}`
        }
      ];

      const profile = detectStack(alpioraFiles);
      expect(profile.primaryStack).toBe('WinUI 3 (Windows App SDK)');
      expect(profile.recommendedAdapterId).toBe('winui3-xaml');
      expect(profile.confidence).toBe(0.99);
      expect(profile.languages).toContain('C#');
      expect(profile.languages).toContain('XAML');
      expect(profile.frameworks).toContain('WinUI 3');
      expect(profile.frameworks).toContain('Windows App SDK');
      expect(profile.templateEngine).toBe('Native XAML');
      expect(profile.styling.approach).toBe('XAML ResourceDictionary / Fluent');
    });

    // 2. Minimal WinUI 3
    it('Fixture 2: Detects Minimal WinUI 3 project with <UseWinUI>true</UseWinUI>', () => {
      const files: ProjectFile[] = [
        {
          path: 'DesktopApp.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><UseWinUI>true</UseWinUI></PropertyGroup></Project>'
        },
        { path: 'App.xaml', extension: '.xaml', content: '<Application xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"/>' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('WinUI 3 (Windows App SDK)');
      expect(profile.recommendedAdapterId).toBe('winui3-xaml');
      expect(profile.confidence).toBeGreaterThanOrEqual(0.98);
    });

    // 3. Legacy WPF
    it('Fixture 3: Correctly identifies WPF project and does NOT classify as ASP.NET Razor', () => {
      const files: ProjectFile[] = [
        {
          path: 'WpfApp.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><UseWPF>true</UseWPF><TargetFramework>net8.0-windows</TargetFramework></PropertyGroup></Project>'
        },
        {
          path: 'MainWindow.xaml',
          extension: '.xaml',
          content: '<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" Title="WPF Window"/>'
        },
        { path: 'MainWindow.xaml.cs', extension: '.cs', content: 'public partial class MainWindow : Window { public MainWindow() { InitializeComponent(); } }' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('WPF (.NET)');
      expect(profile.frameworks).toContain('WPF');
      expect(profile.recommendedAdapterId).not.toBe('aspnet-razor');
      expect(profile.recommendedAdapterId).not.toBe('winui3-xaml');
    });

    // 4. Windows Forms
    it('Fixture 4: Correctly identifies Windows Forms project without Razor false positive', () => {
      const files: ProjectFile[] = [
        {
          path: 'WinFormsApp.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><UseWindowsForms>true</UseWindowsForms><TargetFramework>net8.0-windows</TargetFramework></PropertyGroup></Project>'
        },
        { path: 'Form1.cs', extension: '.cs', content: 'public class Form1 : System.Windows.Forms.Form {}' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('Windows Forms (.NET)');
      expect(profile.frameworks).toContain('Windows Forms');
      expect(profile.recommendedAdapterId).not.toBe('aspnet-razor');
    });

    // 5. ASP.NET Core Razor / Blazor
    it('Fixture 5: Correctly identifies ASP.NET Core Razor / Blazor project', () => {
      const files: ProjectFile[] = [
        {
          path: 'WebStore.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk.Web"><PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>'
        },
        { path: 'Pages/Index.cshtml', extension: '.cshtml', content: '@page\n<h1>Store</h1>' },
        { path: 'Components/Counter.razor', extension: '.razor', content: '<h3>Counter</h3>' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('ASP.NET Core (Razor)');
      expect(profile.recommendedAdapterId).toBe('aspnet-razor');
      expect(profile.confidence).toBe(0.95);
    });

    // 6. ASP.NET Core Web API (No Razor)
    it('Fixture 6: Correctly handles ASP.NET Core Web API without Razor templates', () => {
      const files: ProjectFile[] = [
        {
          path: 'BackendApi.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk.Web"><ItemGroup><PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0"/></ItemGroup></Project>'
        },
        { path: 'Controllers/DataController.cs', extension: '.cs', content: '[ApiController] public class DataController : ControllerBase {}' }
      ];

      const profile = detectStack(files);
      expect(profile.frameworks).toContain('ASP.NET Core');
      expect(profile.recommendedAdapterId).not.toBe('winui3-xaml');
    });

    // 7. .NET Console Application
    it('Fixture 7: Correctly identifies .NET Console Application without claiming ASP.NET', () => {
      const files: ProjectFile[] = [
        {
          path: 'CliTool.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>'
        },
        { path: 'Program.cs', extension: '.cs', content: 'Console.WriteLine("Hello CLI");' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('.NET Console / Library');
      expect(profile.frameworks).not.toContain('ASP.NET Core');
      expect(profile.recommendedAdapterId).not.toBe('aspnet-razor');
    });

    // 8. .NET Class Library
    it('Fixture 8: Correctly identifies .NET Class Library', () => {
      const files: ProjectFile[] = [
        {
          path: 'CoreLibrary.csproj',
          extension: '.csproj',
          content: '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>'
        },
        { path: 'Calculator.cs', extension: '.cs', content: 'public class Calculator { public int Add(int a, int b) => a + b; }' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('.NET Console / Library');
      expect(profile.frameworks).not.toContain('ASP.NET Core');
      expect(profile.recommendedAdapterId).not.toBe('aspnet-razor');
    });

    // 9. React + TypeScript
    it('Fixture 9: Preserves React + TypeScript detection integrity', () => {
      const files: ProjectFile[] = [
        {
          path: 'package.json',
          extension: '.json',
          content: JSON.stringify({ dependencies: { react: '^18.0.0' }, devDependencies: { typescript: '^5.0.0' } })
        },
        { path: 'src/App.tsx', extension: '.tsx', content: 'export default () => <div>React</div>;' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toContain('React + TypeScript');
      expect(profile.recommendedAdapterId).toBe('react-typescript');
    });

    // 10. Laravel Blade
    it('Fixture 10: Preserves Laravel Blade detection integrity', () => {
      const files: ProjectFile[] = [
        {
          path: 'composer.json',
          extension: '.json',
          content: JSON.stringify({ require: { 'laravel/framework': '^11.0' } })
        },
        { path: 'resources/views/home.blade.php', extension: '.blade.php', content: '<div>Blade</div>' }
      ];

      const profile = detectStack(files);
      expect(profile.primaryStack).toBe('Laravel (Blade)');
      expect(profile.recommendedAdapterId).toBe('laravel-blade');
    });
  });

  describe('WinUI3Adapter Artifacts & Modernization', () => {
    const testProfile = inferProductUXProfile({
      name: 'Alpiora Desktop',
      description: 'Apple Device Manager for Windows'
    });

    it('generates WinUI 3 native desktop scaffolding artifacts', async () => {
      const artifacts = await winuiAdapter.generateScaffold({
        rootDir: './test-winui',
        productName: 'Alpiora',
        profile: testProfile
      });

      expect(artifacts.length).toBe(4);
      const paths = artifacts.map((a) => a.path);
      expect(paths).toContain('MainWindow.xaml');
      expect(paths).toContain('MainWindow.xaml.cs');
      expect(paths).toContain('Styles/Colors.xaml');
      expect(paths).toContain('app.manifest');

      const mainWindowXaml = artifacts.find((a) => a.path === 'MainWindow.xaml')!;
      expect(mainWindowXaml.content).toContain('MicaBackdrop');
      expect(mainWindowXaml.content).toContain('NavigationView');

      const colorsXaml = artifacts.find((a) => a.path === 'Styles/Colors.xaml')!;
      expect(colorsXaml.content).toContain('ThemeDictionaries');
      expect(colorsXaml.content).toContain('HighContrast');
    });

    it('renders native WinUI 3 UserControl with AutomationProperties', async () => {
      const testPattern = coreUXPatterns[0]!;
      const artifacts = await winuiAdapter.renderComponent(testPattern, {
        componentName: 'DeviceCard'
      });

      expect(artifacts.length).toBe(2);
      const xamlArtifact = artifacts.find((a) => a.path.endsWith('.xaml'))!;
      expect(xamlArtifact.content).toContain('AutomationProperties.Name');
      expect(xamlArtifact.content).toContain('AutomationProperties.AutomationId="DeviceCardControl"');
      expect(xamlArtifact.content).toContain('UserControl');
    });

    it('maps design tokens to native XAML ResourceDictionary and CSS', async () => {
      const artifacts = await winuiAdapter.mapTokens('css');
      expect(artifacts.length).toBeGreaterThanOrEqual(2);
      const xamlTokens = artifacts.find((a) => a.path === 'Styles/Tokens.xaml');
      expect(xamlTokens).toBeDefined();
      expect(xamlTokens?.content).toContain('<ResourceDictionary');
      expect(xamlTokens?.content).toContain('SolidColorBrush');
    });

    it('provides specialized 4-stage native desktop modernization strategy', () => {
      const strategy = winuiAdapter.recommendModernization([]);
      expect(strategy.adapterId).toBe('winui3-xaml');
      expect(strategy.phases.length).toBe(4);
      expect(strategy.phases[0]?.title).toContain('ResourceDictionary');
      expect(strategy.phases[1]?.title).toContain('Fluent Application Shell');
      expect(strategy.phases[2]?.title).toContain('High-Density Virtualized UI');
      expect(strategy.phases[3]?.title).toContain('UI Automation & Accessibility');
    });
  });

  describe('Specialized MVVM, XAML & UIA Inspection Helpers', () => {
    it('inspects C# MVVM patterns accurately', () => {
      const files: ProjectFile[] = [
        {
          path: 'ViewModels/MainViewModel.cs',
          extension: '.cs',
          content: `using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
public partial class MainViewModel : ObservableObject {
    [ObservableProperty] private string _name;
    [ObservableProperty] private bool _isLoading;
    [RelayCommand] private void LoadData() {}
    public void UpdateUI() { DispatcherQueue.TryEnqueue(() => {}); }
}`
        }
      ];

      const mvvm = winuiAdapter.inspectMvvm(files);
      expect(mvvm.hasObservableObject).toBe(true);
      expect(mvvm.viewModelsFound).toContain('MainViewModel');
      expect(mvvm.observablePropertiesCount).toBe(2);
      expect(mvvm.relayCommandsCount).toBe(1);
      expect(mvvm.hasThreadDispatching).toBe(true);
    });

    it('inspects XAML compiled bindings and virtualization', () => {
      const files: ProjectFile[] = [
        {
          path: 'Views/PhotosView.xaml',
          extension: '.xaml',
          content: `<Grid Background="{ThemeResource AppSurfaceLayer1Brush}">
    <GridView ItemsSource="{x:Bind Photos}">
        <GridView.ItemsPanel>
            <ItemsPanelTemplate>
                <ItemsWrapGrid Orientation="Horizontal" />
            </ItemsPanelTemplate>
        </GridView.ItemsPanel>
    </GridView>
</Grid>`
        }
      ];

      const binding = winuiAdapter.inspectXamlBindings(files);
      expect(binding.compiledBindingsCount).toBe(1);
      expect(binding.themeResourcesCount).toBe(1);
      expect(binding.usesVirtualization).toBe(true);
    });

    it('inspects Windows UI Automation (UIA) coverage', () => {
      const files: ProjectFile[] = [
        {
          path: 'MainWindow.xaml',
          extension: '.xaml',
          content: `<Grid>
    <Button AutomationProperties.Name="ExportButton" AutomationProperties.AutomationId="btnExport" />
    <Button Content="Unlabelled" />
</Grid>`
        }
      ];

      const uia = winuiAdapter.inspectAutomationProperties(files);
      expect(uia.totalInteractiveElements).toBe(2);
      expect(uia.elementsWithAutomationName).toBe(1);
      expect(uia.elementsWithAutomationId).toBe(1);
      expect(uia.complianceRate).toBe(0.5);
    });
  });
});
