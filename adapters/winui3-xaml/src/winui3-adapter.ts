import {
  BaseAdapter,
  AdapterArtifact,
  ProjectFile,
  RenderOptions,
  ScaffoldOptions,
  StackDetectionMatch,
  ModernizationStrategy,
  WinUI3AdapterCapabilities,
  MvvmInspectionResult,
  XamlBindingInspectionResult,
  AutomationInspectionResult
} from '@alper-design-os/adapter-contract';
import {
  createDefaultTokenCompiler,
  TokenOutputFormat,
  UXPatternSpec
} from '@alper-design-os/design-core';

export class WinUI3Adapter extends BaseAdapter {
  readonly id = 'winui3-xaml';
  readonly name = 'Windows App SDK / WinUI 3 (XAML)';
  readonly description =
    'Native Windows 11 desktop application adapter providing XAML ResourceDictionaries, MVVM analysis, fluent design tokens, and Windows UI Automation support.';
  readonly targetExtensions = ['.xaml', '.cs', '.csproj', '.sln', '.appxmanifest', '.manifest'];

  getCapabilities(): WinUI3AdapterCapabilities {
    return {
      supportsTypeScript: false,
      templateEngine: 'XAML / WinUI 3',
      stylingApproaches: ['XAML_RESOURCE_DICTIONARY', 'WINUI_STYLES', 'FLUENT_DESIGN'],
      serverRendered: false,
      componentParadigm: 'WINUI_XAML_MVVM',
      targetFrameworks: ['.NET 8.0', '.NET 9.0', '.NET 10.0'],
      windowsAppSdkVersion: '1.6+',
      supportsUnpackaged: true,
      supportsThemeDictionaries: true,
      supportsDpiScaling: true,
      supportsAutomationPeers: true
    };
  }

  detect(files: ProjectFile[]): StackDetectionMatch {
    const detectedFiles: string[] = [];
    let hasUseWinUI = false;
    let hasWindowsAppSdk = false;
    let hasWinUiXaml = false;
    let isWpfOrWinFormsOnly = false;

    for (const f of files) {
      const ext = f.extension.toLowerCase();
      const pathLower = f.path.toLowerCase();

      // Check .csproj files
      if (ext === '.csproj' || pathLower.endsWith('.csproj')) {
        const content = f.content || '';
        if (/<UseWinUI>\s*true\s*<\/UseWinUI>/i.test(content)) {
          hasUseWinUI = true;
          detectedFiles.push(f.path);
        }
        if (/Microsoft\.WindowsAppSDK/i.test(content)) {
          hasWindowsAppSdk = true;
          detectedFiles.push(f.path);
        }
        if (
          !hasUseWinUI &&
          !hasWindowsAppSdk &&
          (/<UseWPF>\s*true\s*<\/UseWPF>/i.test(content) ||
            /<UseWindowsForms>\s*true\s*<\/UseWindowsForms>/i.test(content))
        ) {
          isWpfOrWinFormsOnly = true;
        }
      }

      // Check .xaml files
      if (ext === '.xaml' || pathLower.endsWith('.xaml')) {
        const content = f.content || '';
        if (
          content.includes('http://schemas.microsoft.com/winfx/2006/xaml/presentation') ||
          content.includes('using:Microsoft.UI.Xaml') ||
          content.includes('XamlControlsResources')
        ) {
          hasWinUiXaml = true;
          detectedFiles.push(f.path);
        }
      }
    }

    // Explicitly reject non-WinUI desktop stacks (WPF, WinForms) if no WinUI markers exist
    if (isWpfOrWinFormsOnly && !hasUseWinUI && !hasWindowsAppSdk) {
      return {
        matched: false,
        confidence: 0,
        reason: 'Detected WPF or Windows Forms project without Windows App SDK / WinUI 3 markers.',
        detectedFiles: []
      };
    }

    // Dynamic confidence evaluation
    if (hasUseWinUI && hasWindowsAppSdk) {
      return {
        matched: true,
        confidence: 0.99,
        detectedFramework: 'WinUI 3 / Windows App SDK',
        reason: 'Detected <UseWinUI>true</UseWinUI> and Microsoft.WindowsAppSDK in project manifest.',
        detectedFiles: Array.from(new Set(detectedFiles))
      };
    }

    if (hasUseWinUI || hasWindowsAppSdk) {
      return {
        matched: true,
        confidence: 0.98,
        detectedFramework: 'WinUI 3 / Windows App SDK',
        reason: 'Detected explicit Windows App SDK / WinUI markers in project configuration.',
        detectedFiles: Array.from(new Set(detectedFiles))
      };
    }

    if (hasWinUiXaml && files.some((f) => f.extension === '.cs' || f.path.endsWith('.cs'))) {
      return {
        matched: true,
        confidence: 0.92,
        detectedFramework: 'WinUI 3 / Windows App SDK',
        reason: 'Detected native XAML and C# code-behind matching Windows App SDK patterns.',
        detectedFiles: Array.from(new Set(detectedFiles))
      };
    }

    return {
      matched: false,
      confidence: 0,
      reason: 'No Windows App SDK or WinUI 3 project markers found.',
      detectedFiles: []
    };
  }

  async generateScaffold(options: ScaffoldOptions): Promise<AdapterArtifact[]> {
    const { productName } = options;

    return [
      {
        path: 'MainWindow.xaml',
        content: `<Window
    x:Class="${productName}.MainWindow"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    Title="${productName}">

    <Window.SystemBackdrop>
        <MicaBackdrop Kind="BaseAlt" />
    </Window.SystemBackdrop>

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
        </Grid.RowDefinitions>

        <!-- Custom Fluent TitleBar -->
        <AppTitleBar x:Name="TitleBar" Grid.Row="0" Title="${productName}" />

        <!-- Main Navigation & Content Area -->
        <NavigationView x:Name="NavView" Grid.Row="1" PaneDisplayMode="LeftCompact" IsSettingsVisible="True">
            <NavigationView.MenuItems>
                <NavigationViewItem Content="Dashboard" Tag="dashboard">
                    <NavigationViewItem.Icon>
                        <FontIcon Glyph="&#xE80F;" />
                    </NavigationViewItem.Icon>
                </NavigationViewItem>
            </NavigationView.MenuItems>
            <Frame x:Name="ContentFrame" />
        </NavigationView>
    </Grid>
</Window>`,
        language: 'xml',
        description: 'Native WinUI 3 Fluent AppWindow with Mica backdrop and NavigationView'
      },
      {
        path: 'MainWindow.xaml.cs',
        content: `using Microsoft.UI.Xaml;
using Microsoft.UI.Windowing;
using WinRT.Interop;

namespace ${productName}
{
    public sealed partial class MainWindow : Window
    {
        private AppWindow? _appWindow;

        public MainWindow()
        {
            this.InitializeComponent();
            InitializeCustomTitleBar();
        }

        private void InitializeCustomTitleBar()
        {
            var hwnd = WindowNative.GetWindowHandle(this);
            var windowId = Microsoft.UI.Win32Interop.GetWindowIdFromWindow(hwnd);
            _appWindow = AppWindow.GetFromWindowId(windowId);

            if (_appWindow != null && AppWindowTitleBar.IsCustomizationSupported())
            {
                _appWindow.TitleBar.ExtendsContentIntoTitleBar = true;
            }
        }
    }
}`,
        language: 'csharp',
        description: 'WinUI 3 MainWindow C# code-behind with window handle interop and custom titlebar'
      },
      {
        path: 'Styles/Colors.xaml',
        content: `<ResourceDictionary
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <!-- Static Brand Accent Colors -->
    <Color x:Key="BrandAccentColor">#00F2FE</Color>
    <SolidColorBrush x:Key="BrandAccentBrush" Color="{StaticResource BrandAccentColor}" />

    <!-- Theme Dictionaries for Light and Dark Fluent Themes -->
    <ResourceDictionary.ThemeDictionaries>
        <ResourceDictionary x:Key="Default">
            <Color x:Key="AppSurfaceBaseColor">#070C18</Color>
            <Color x:Key="AppSurfaceLayer1Color">#0C1527</Color>
            <Color x:Key="AppTextPrimaryColor">#F9FAFB</Color>
            <SolidColorBrush x:Key="AppSurfaceBaseBrush" Color="{StaticResource AppSurfaceBaseColor}" />
            <SolidColorBrush x:Key="AppSurfaceLayer1Brush" Color="{StaticResource AppSurfaceLayer1Color}" />
            <SolidColorBrush x:Key="AppTextPrimaryBrush" Color="{StaticResource AppTextPrimaryColor}" />
        </ResourceDictionary>

        <ResourceDictionary x:Key="Light">
            <Color x:Key="AppSurfaceBaseColor">#F3F4F6</Color>
            <Color x:Key="AppSurfaceLayer1Color">#FFFFFF</Color>
            <Color x:Key="AppTextPrimaryColor">#111827</Color>
            <SolidColorBrush x:Key="AppSurfaceBaseBrush" Color="{StaticResource AppSurfaceBaseColor}" />
            <SolidColorBrush x:Key="AppSurfaceLayer1Brush" Color="{StaticResource AppSurfaceLayer1Color}" />
            <SolidColorBrush x:Key="AppTextPrimaryBrush" Color="{StaticResource AppTextPrimaryColor}" />
        </ResourceDictionary>

        <ResourceDictionary x:Key="HighContrast">
            <SolidColorBrush x:Key="AppSurfaceBaseBrush" Color="{ThemeResource SystemColorWindowColor}" />
            <SolidColorBrush x:Key="AppSurfaceLayer1Brush" Color="{ThemeResource SystemColorWindowColor}" />
            <SolidColorBrush x:Key="AppTextPrimaryBrush" Color="{ThemeResource SystemColorWindowTextColor}" />
            <SolidColorBrush x:Key="BrandAccentBrush" Color="{ThemeResource SystemColorHighlightColor}" />
        </ResourceDictionary>
    </ResourceDictionary.ThemeDictionaries>
</ResourceDictionary>`,
        language: 'xml',
        description: 'Native XAML Theme ResourceDictionary with HighContrast and Light/Dark themes'
      },
      {
        path: 'app.manifest',
        content: `<?xml version="1.0" encoding="utf-8"?>
<assembly manifestVersion="1.0" xmlns="urn:schemas-microsoft-com:asm.v1">
  <assemblyIdentity version="1.0.0.0" name="${productName}.app"/>
  <application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
      <dpiAwareness xmlns="http://schemas.microsoft.com/SMI/2016/WindowsSettings">PerMonitorV2</dpiAwareness>
    </windowsSettings>
  </application>
  <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
    <application>
      <!-- Windows 10 and Windows 11 -->
      <supportedOS Id="{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}" />
    </application>
  </compatibility>
</assembly>`,
        language: 'xml',
        description: 'Windows application manifest with Per-Monitor V2 DPI awareness'
      }
    ];
  }

  async renderComponent(pattern: UXPatternSpec, options: RenderOptions): Promise<AdapterArtifact[]> {
    const compName = options.componentName;

    return [
      {
        path: `Views/${compName}Control.xaml`,
        content: `<UserControl
    x:Class="Views.${compName}Control"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    mc:Ignorable="d"
    AutomationProperties.Name="${pattern.name}"
    AutomationProperties.AutomationId="${compName}Control"
    AutomationProperties.ItemType="${pattern.category}">

    <Border
        Background="{ThemeResource AppSurfaceLayer1Brush}"
        CornerRadius="8"
        Padding="16"
        BorderBrush="{ThemeResource SurfaceStrokeBrush}"
        BorderThickness="1">
        <Grid RowDefinitions="Auto,*">
            <TextBlock
                Grid.Row="0"
                Text="{x:Bind HeaderTitle, Mode=OneWay}"
                Style="{ThemeResource SubtitleTextBlockStyle}"
                Margin="0,0,0,8" />
            <ContentPresenter Grid.Row="1" Content="{x:Bind InnerContent, Mode=OneWay}" />
        </Grid>
    </Border>
</UserControl>`,
        language: 'xml',
        description: `Native WinUI 3 UserControl for UX Pattern: ${pattern.name}`
      },
      {
        path: `Views/${compName}Control.xaml.cs`,
        content: `using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace Views
{
    public sealed partial class ${compName}Control : UserControl
    {
        public static readonly DependencyProperty HeaderTitleProperty =
            DependencyProperty.Register(
                nameof(HeaderTitle),
                typeof(string),
                typeof(${compName}Control),
                new PropertyMetadata("${pattern.name}"));

        public static readonly DependencyProperty InnerContentProperty =
            DependencyProperty.Register(
                nameof(InnerContent),
                typeof(object),
                typeof(${compName}Control),
                new PropertyMetadata(null));

        public string HeaderTitle
        {
            get => (string)GetValue(HeaderTitleProperty);
            set => SetValue(HeaderTitleProperty, value);
        }

        public object? InnerContent
        {
            get => GetValue(InnerContentProperty);
            set => SetValue(InnerContentProperty, value);
        }

        public ${compName}Control()
        {
            this.InitializeComponent();
        }
    }
}`,
        language: 'csharp',
        description: `C# code-behind with DependencyProperties for ${compName}Control`
      }
    ];
  }

  public override async mapTokens(format: TokenOutputFormat): Promise<AdapterArtifact[]> {
    // If format is standard web, fall back to BaseAdapter
    if (format === 'css' || format === 'scss' || format === 'typescript' || format === 'tailwind-json') {
      const baseResult = await super.mapTokens(format);

      // In addition to base token export, always provide XAML ResourceDictionary for WinUI
      const xamlTokens: AdapterArtifact = {
        path: 'Styles/Tokens.xaml',
        content: `<ResourceDictionary
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <!-- DTCG Design Tokens Compiled to Native XAML Resources -->
    <Color x:Key="BrandPrimaryColor">#00F2FE</Color>
    <Color x:Key="BrandSecondaryColor">#4FACFE</Color>
    <SolidColorBrush x:Key="BrandPrimaryBrush" Color="{StaticResource BrandPrimaryColor}" />
    <SolidColorBrush x:Key="BrandSecondaryBrush" Color="{StaticResource BrandSecondaryColor}" />

    <CornerRadius x:Key="ControlCornerRadius">6</CornerRadius>
    <CornerRadius x:Key="OverlayCornerRadius">8</CornerRadius>

    <Thickness x:Key="ControlSpacingDense">4,4,4,4</Thickness>
    <Thickness x:Key="ControlSpacingStandard">8,8,8,8</Thickness>
    <Thickness x:Key="PageMarginStandard">16,16,16,16</Thickness>
</ResourceDictionary>`,
        language: 'xml',
        description: 'Native WinUI 3 XAML ResourceDictionary design tokens'
      };

      return [...baseResult, xamlTokens];
    }

    return super.mapTokens(format);
  }

  public override recommendModernization(_files: ProjectFile[]): ModernizationStrategy {
    return {
      adapterId: this.id,
      summary: 'Native Windows 11 WinUI 3 / XAML 4-stage modernization roadmap',
      riskAssessment: 'LOW',
      phases: [
        {
          phase: 1,
          title: 'Design Token & ResourceDictionary Standardization',
          summary: 'Extract hardcoded hex colors and dimensions into centralized XAML ThemeDictionaries.',
          steps: [
            {
              stepNumber: 1,
              title: 'Compile DTCG Tokens to Styles/Colors.xaml',
              description: 'Generate ThemeDictionaries for Light, Dark (Default), and HighContrast themes.',
              affectedFilesPattern: ['Styles/Colors.xaml', 'Styles/Tokens.xaml'],
              safeToRunAutomatically: true
            },
            {
              stepNumber: 2,
              title: 'Merge Dictionaries in App.xaml',
              description: 'Ensure Application.Resources merges Colors.xaml and Icons.xaml.',
              affectedFilesPattern: ['App.xaml'],
              safeToRunAutomatically: false
            }
          ]
        },
        {
          phase: 2,
          title: 'Fluent Application Shell & Windowing',
          summary: 'Modernize window frame with Mica backdrop, custom TitleBar, and responsive NavigationView.',
          steps: [
            {
              stepNumber: 3,
              title: 'Enable Mica System Backdrop & AppWindowTitleBar',
              description: 'Extend content into title bar and attach MicaBackdrop in MainWindow.xaml.',
              affectedFilesPattern: ['MainWindow.xaml', 'MainWindow.xaml.cs'],
              safeToRunAutomatically: false
            }
          ]
        },
        {
          phase: 3,
          title: 'High-Density Virtualized UI & MVVM Optimization',
          summary: 'Verify ItemsRepeater/ItemsWrapGrid virtualization and migrate to compiled {x:Bind} bindings.',
          steps: [
            {
              stepNumber: 4,
              title: 'Convert UI Bindings to Compiled {x:Bind Mode=OneWay}',
              description: 'Improve rendering performance by replacing runtime reflection bindings with type-safe x:Bind.',
              affectedFilesPattern: ['Views/**/*.xaml', 'MainWindow.xaml'],
              safeToRunAutomatically: false
            }
          ]
        },
        {
          phase: 4,
          title: 'Windows UI Automation & Accessibility (UIA)',
          summary: 'Implement AutomationProperties across all interactive controls for screen reader and test automation parity.',
          steps: [
            {
              stepNumber: 5,
              title: 'Attach AutomationProperties (Name, AutomationId, ItemType)',
              description: 'Ensure automated testing and accessibility via Windows UI Automation.',
              affectedFilesPattern: ['Views/**/*.xaml', 'MainWindow.xaml'],
              safeToRunAutomatically: false
            }
          ]
        }
      ]
    };
  }

  // --- Specialized Desktop & XAML Analysis Helpers ---

  public inspectMvvm(files: ProjectFile[]): MvvmInspectionResult {
    const csFiles = files.filter((f) => f.extension === '.cs' || f.path.endsWith('.cs'));
    let hasObservableObject = false;
    let hasNotifyPropertyChanged = false;
    let observablePropsCount = 0;
    let relayCommandsCount = 0;
    let hasThreadDispatching = false;
    const viewModelsFound: string[] = [];

    for (const f of csFiles) {
      const content = f.content || '';
      if (/ObservableObject/i.test(content)) hasObservableObject = true;
      if (/INotifyPropertyChanged/i.test(content)) hasNotifyPropertyChanged = true;
      if (/class\s+(\w+ViewModel)/i.test(content)) {
        const matches = content.matchAll(/class\s+(\w+ViewModel)/g);
        for (const m of matches) {
          if (m[1]) viewModelsFound.push(m[1]);
        }
      }

      const propMatches = content.match(/\[ObservableProperty\]/g);
      if (propMatches) observablePropsCount += propMatches.length;

      const cmdMatches = content.match(/\[RelayCommand\]|ICommand/g);
      if (cmdMatches) relayCommandsCount += cmdMatches.length;

      if (/DispatcherQueue\.TryEnqueue/i.test(content)) hasThreadDispatching = true;
    }

    return {
      hasObservableObject,
      hasNotifyPropertyChanged: hasNotifyPropertyChanged || hasObservableObject,
      viewModelsFound: Array.from(new Set(viewModelsFound)),
      observablePropertiesCount: observablePropsCount,
      relayCommandsCount: relayCommandsCount,
      hasThreadDispatching,
      summary: `Found ${viewModelsFound.length} ViewModels, ${observablePropsCount} observable properties, and ${relayCommandsCount} commands. DispatcherQueue thread dispatching: ${hasThreadDispatching ? 'ACTIVE' : 'NONE'}.`
    };
  }

  public inspectXamlBindings(files: ProjectFile[]): XamlBindingInspectionResult {
    const xamlFiles = files.filter((f) => f.extension === '.xaml' || f.path.endsWith('.xaml'));
    let compiledBindingsCount = 0;
    let classicBindingsCount = 0;
    let themeResourcesCount = 0;
    let staticResourcesCount = 0;
    let usesVirtualization = false;

    for (const f of xamlFiles) {
      const content = f.content || '';
      const compiled = content.match(/\{x:Bind\s+/g);
      if (compiled) compiledBindingsCount += compiled.length;

      const classic = content.match(/\{Binding\s+/g);
      if (classic) classicBindingsCount += classic.length;

      const theme = content.match(/\{ThemeResource\s+/g);
      if (theme) themeResourcesCount += theme.length;

      const staticRes = content.match(/\{StaticResource\s+/g);
      if (staticRes) staticResourcesCount += staticRes.length;

      if (/ItemsWrapGrid|ItemsRepeater|VirtualizingStackPanel/i.test(content)) {
        usesVirtualization = true;
      }
    }

    return {
      compiledBindingsCount,
      classicBindingsCount,
      themeResourcesCount,
      staticResourcesCount,
      usesVirtualization,
      summary: `Bindings: ${compiledBindingsCount} compiled {x:Bind}, ${classicBindingsCount} classic {Binding}. Resources: ${themeResourcesCount} ThemeResource, ${staticResourcesCount} StaticResource. Virtualization: ${usesVirtualization ? 'YES' : 'NO'}.`
    };
  }

  public inspectAutomationProperties(files: ProjectFile[]): AutomationInspectionResult {
    const xamlFiles = files.filter((f) => f.extension === '.xaml' || f.path.endsWith('.xaml'));
    let totalInteractive = 0;
    let withName = 0;
    let withId = 0;

    for (const f of xamlFiles) {
      const content = f.content || '';
      const interactiveMatches = content.match(/<(Button|ListView|GridView|TextBox|ToggleSwitch|Slider|ComboBox)\b/g);
      if (interactiveMatches) {
        totalInteractive += interactiveMatches.length;
      }

      const nameMatches = content.match(/AutomationProperties\.Name=/g);
      if (nameMatches) withName += nameMatches.length;

      const idMatches = content.match(/AutomationProperties\.AutomationId=/g);
      if (idMatches) withId += idMatches.length;
    }

    const complianceRate = totalInteractive > 0 ? (withName + withId) / (totalInteractive * 2) : 1.0;

    return {
      totalInteractiveElements: totalInteractive,
      elementsWithAutomationName: withName,
      elementsWithAutomationId: withId,
      complianceRate: Number(complianceRate.toFixed(2)),
      summary: `Inspected ${totalInteractive} interactive XAML elements. AutomationProperties: ${withName} Name, ${withId} AutomationId (${(complianceRate * 100).toFixed(0)}% compliance).`
    };
  }
}
