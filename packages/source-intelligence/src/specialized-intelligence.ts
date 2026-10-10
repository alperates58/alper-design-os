import {
  IconSystemMetadata,
  IconSystemMetadataSchema,
  ChartLibraryMetadata,
  ChartLibraryMetadataSchema,
  DataGridMetadata,
  DataGridMetadataSchema
} from './types.js';

// ============================================================================
// 1. Icon Systems Catalog
// ============================================================================
export const SEED_ICON_SYSTEMS: IconSystemMetadata[] = [
  {
    id: 'icon-lucide',
    name: 'Lucide Icons',
    license: 'ISC',
    iconCount: 1500,
    styleFamilies: ['outline', 'stroke-2'],
    treeShaking: true,
    frameworkSupport: ['React', 'Vue', 'Svelte', 'Angular', 'Vanilla JS', 'Web Components'],
    strokeFilledSupport: true,
    accessibilityGuidance: 'Render with aria-hidden="true" when decorative or provide title/aria-label when interactive.',
    bestFor: 'Modern SaaS dashboards, shadcn/ui integration, developer tools, general enterprise web.'
  },
  {
    id: 'icon-heroicons',
    name: 'Heroicons',
    license: 'MIT',
    iconCount: 290,
    styleFamilies: ['outline', 'solid', 'mini', 'micro'],
    treeShaking: true,
    frameworkSupport: ['React', 'Vue', 'Tailwind CSS', 'Figma'],
    strokeFilledSupport: true,
    accessibilityGuidance: 'Use solid variants at 20px and outline at 24px with role="img".',
    bestFor: 'Tailwind CSS projects, marketing sites, consumer applications.'
  },
  {
    id: 'icon-material-symbols',
    name: 'Google Material Symbols',
    license: 'Apache-2.0',
    iconCount: 3000,
    styleFamilies: ['outlined', 'rounded', 'sharp'],
    treeShaking: true,
    frameworkSupport: ['Web Font', 'React', 'Angular', 'Android', 'Flutter'],
    strokeFilledSupport: true,
    accessibilityGuidance: 'Variable font weight and optical sizing support with screen-reader text fallback.',
    bestFor: 'Cross-platform mobile and web applications following Material 3 guidelines.'
  },
  {
    id: 'icon-tabler',
    name: 'Tabler Icons',
    license: 'MIT',
    iconCount: 5200,
    styleFamilies: ['outline', 'filled'],
    treeShaking: true,
    frameworkSupport: ['React', 'Vue', 'Svelte', 'SVG sprites', 'PNG'],
    strokeFilledSupport: true,
    accessibilityGuidance: 'Customizable stroke width from 1px to 3px with inline aria-label support.',
    bestFor: 'Vast domain diversity (industrial, medical, electrical, accounting).'
  },
  {
    id: 'icon-phosphor',
    name: 'Phosphor Icons',
    license: 'MIT',
    iconCount: 1248,
    styleFamilies: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    treeShaking: true,
    frameworkSupport: ['React', 'Vue', 'Svelte', 'Flutter', 'Web Components'],
    strokeFilledSupport: true,
    accessibilityGuidance: 'Duotone style provides secondary opacity layer; ensure 3:1 graphical contrast.',
    bestFor: 'Design systems needing expressive icon weights and duotone accents.'
  },
  {
    id: 'icon-radix',
    name: 'Radix Icons',
    license: 'MIT',
    iconCount: 318,
    styleFamilies: ['15x15-pixel-grid'],
    treeShaking: true,
    frameworkSupport: ['React', 'SVG', 'Figma'],
    strokeFilledSupport: false,
    accessibilityGuidance: 'Crisp 15x15 pixel alignment prevents blurry rendering on standard displays.',
    bestFor: 'Compact micro-interfaces, context menus, and Radix UI primitives.'
  }
];

// ============================================================================
// 2. Chart Libraries Catalog
// ============================================================================
export const SEED_CHART_LIBRARIES: ChartLibraryMetadata[] = [
  {
    id: 'chart-echarts',
    name: 'Apache ECharts',
    renderingEngine: 'CANVAS',
    largeDataSupport: true,
    interactionSupport: ['Zoom/Pan', 'DataZoom Slider', 'Brush Selection', 'Tooltips', 'VisualMap'],
    accessibilitySupport: 'Generates automatic text description and decibel audio sonification for visual charts.',
    typescript: true,
    license: 'Apache-2.0',
    bundleSizeKb: 380,
    frameworks: ['Agnostic', 'React', 'Vue', 'Angular', 'Vanilla JS'],
    chartTypes: ['Line', 'Bar', 'Pie', 'Scatter', 'Gantt', 'Heatmap', 'Tree', 'Graph', 'Candlestick', 'Sunburst', 'Gauge'],
    bestFor: 'High-throughput operational SCADA, industrial time-series, datasets with > 10,000 points.'
  },
  {
    id: 'chart-recharts',
    name: 'Recharts',
    renderingEngine: 'SVG',
    largeDataSupport: false,
    interactionSupport: ['Hover Tooltips', 'Legend Toggle', 'Brush Slider'],
    accessibilitySupport: 'Native SVG DOM elements inspectable by assistive technology; title and desc support.',
    typescript: true,
    license: 'MIT',
    bundleSizeKb: 95,
    frameworks: ['React'],
    chartTypes: ['Line', 'Area', 'Bar', 'Pie', 'Radar', 'Composed'],
    bestFor: 'React SaaS dashboards, clean financial metrics, datasets under 5,000 points.'
  },
  {
    id: 'chart-chartjs',
    name: 'Chart.js',
    renderingEngine: 'CANVAS',
    largeDataSupport: true,
    interactionSupport: ['Hover Tooltips', 'Legend Toggle', 'Animation Plugins'],
    accessibilitySupport: 'Canvas fallback table and accessibility plugin support.',
    typescript: true,
    license: 'MIT',
    bundleSizeKb: 65,
    frameworks: ['Vanilla JS', 'React', 'Vue', 'Angular', 'PHP/Laravel'],
    chartTypes: ['Line', 'Bar', 'Radar', 'Doughnut', 'PolarArea', 'Bubble', 'Scatter'],
    bestFor: 'Lightweight multi-framework applications, rapid prototyping, and standard marketing analytics.'
  }
];

// ============================================================================
// 3. Data Grid Catalog
// ============================================================================
export const SEED_DATA_GRIDS: DataGridMetadata[] = [
  {
    id: 'grid-ag-grid-community',
    name: 'AG Grid (Community Edition)',
    license: 'MIT',
    isHeadless: false,
    virtualization: true,
    grouping: false,
    pivot: false,
    filtering: true,
    sorting: true,
    editing: true,
    treeData: false,
    serverSideData: true,
    keyboardNavigation: true,
    accessibility: 'ARIA role="grid" with full cell focus roving tabindex and high-contrast theme support.',
    exportSupport: ['CSV'],
    maxRecommendedRows: 1000000,
    paidFeaturesNote: 'Row Grouping, Pivoting, Excel Export, Master/Detail, and Integrated Charts require AG Grid Enterprise (Commercial License).',
    freeFeatures: ['DOM Virtualization', 'Column Pinning', 'Column Resizing', 'Basic Filtering', 'Sorting', 'In-Cell Editing', 'CSV Export'],
    enterpriseOnlyFeatures: ['Row Grouping', 'Aggregation/Pivot', 'Excel XML/XLSX Export', 'Server-Side Row Model', 'Tree Data Model', 'Master-Detail View']
  },
  {
    id: 'grid-tanstack-table',
    name: 'TanStack Table (v8)',
    license: 'MIT',
    isHeadless: true,
    virtualization: true,
    grouping: true,
    pivot: false,
    filtering: true,
    sorting: true,
    editing: true,
    treeData: true,
    serverSideData: true,
    keyboardNavigation: true,
    accessibility: 'Headless architecture allows 100% control over semantic HTML markup, ARIA tags, and keyboard focus rings.',
    exportSupport: ['Any (Headless/Custom)'],
    maxRecommendedRows: 100000,
    paidFeaturesNote: '100% Free and Open Source MIT with zero commercial feature locks.',
    freeFeatures: ['Headless Rendering', 'Column Sorting', 'Multi-level Grouping', 'Global & Column Filtering', 'Column Pinning', 'Pagination', 'Expanding Rows', 'Virtualization (with TanStack Virtual)'],
    enterpriseOnlyFeatures: []
  }
];

// ============================================================================
// Engine & Recommendation Functions
// ============================================================================
export class SpecializedIntelligenceEngine {
  private icons: Map<string, IconSystemMetadata> = new Map();
  private charts: Map<string, ChartLibraryMetadata> = new Map();
  private grids: Map<string, DataGridMetadata> = new Map();

  constructor() {
    for (const icon of SEED_ICON_SYSTEMS) {
      IconSystemMetadataSchema.parse(icon);
      this.icons.set(icon.id, icon);
    }
    for (const chart of SEED_CHART_LIBRARIES) {
      ChartLibraryMetadataSchema.parse(chart);
      this.charts.set(chart.id, chart);
    }
    for (const grid of SEED_DATA_GRIDS) {
      DataGridMetadataSchema.parse(grid);
      this.grids.set(grid.id, grid);
    }
  }

  public getIconSystem(id: string): IconSystemMetadata | undefined {
    return this.icons.get(id);
  }

  public getAllIconSystems(): IconSystemMetadata[] {
    return Array.from(this.icons.values());
  }

  public recommendIconSystem(context: {
    framework?: string;
    useTailwind?: boolean;
    useShadcn?: boolean;
    density?: 'LOW' | 'MEDIUM' | 'HIGH';
    existingIconImports?: string[];
  }): {
    recommended: IconSystemMetadata;
    rationale: string;
    familyMixingWarning?: string;
  } {
    // 1. Detect existing icon library to avoid discordant visual mixing
    if (context.existingIconImports && context.existingIconImports.length > 0) {
      const existing = context.existingIconImports[0]!.toLowerCase();
      if (existing.includes('lucide')) {
        return {
          recommended: this.icons.get('icon-lucide')!,
          rationale: 'Project already imports Lucide. Maintaining single icon family preserves visual consistency across stroke weights and bounding boxes.'
        };
      }
      if (existing.includes('heroicon')) {
        return {
          recommended: this.icons.get('icon-heroicons')!,
          rationale: 'Project already imports Heroicons. Preserving uniform Tailwind aesthetics.'
        };
      }
      if (existing.includes('phosphor')) {
        return {
          recommended: this.icons.get('icon-phosphor')!,
          rationale: 'Project already imports Phosphor. Preserving consistent icon geometry and weight family.'
        };
      }
    }

    if (context.useShadcn || context.density === 'HIGH') {
      return {
        recommended: this.icons.get('icon-lucide')!,
        rationale: 'Lucide provides comprehensive 24px stroke consistency and is the canonical standard for shadcn/ui and enterprise consoles.'
      };
    }

    if (context.useTailwind) {
      return {
        recommended: this.icons.get('icon-heroicons')!,
        rationale: 'Heroicons provides native optical sizing (micro, mini, solid, outline) engineered specifically for Tailwind CSS.'
      };
    }

    return {
      recommended: this.icons.get('icon-tabler')!,
      rationale: 'Tabler Icons offers the widest breadth of technical, industrial, and domain-specific glyphs under MIT license.'
    };
  }

  public recommendChartLibrary(context: {
    dataPoints?: number;
    requireGanttOrTimeline?: boolean;
    framework?: string;
    accessibleRequirement?: boolean;
  }): {
    recommended: ChartLibraryMetadata;
    rationale: string;
  } {
    const points = context.dataPoints || 1000;

    if (points > 10000 || context.requireGanttOrTimeline) {
      return {
        recommended: this.charts.get('chart-echarts')!,
        rationale: `High data volume (${points.toLocaleString()} points) or Gantt/Timeline requirement requires Canvas/WebGL rendering with hardware acceleration.`
      };
    }

    if (context.framework?.toLowerCase().includes('react')) {
      return {
        recommended: this.charts.get('chart-recharts')!,
        rationale: 'Recharts offers declarative React JSX components, clean CSS token integration, and inspectable SVG markup for moderate data volumes.'
      };
    }

    return {
      recommended: this.charts.get('chart-chartjs')!,
      rationale: 'Chart.js delivers lightweight Canvas charting with minimal bundle overhead and multi-framework portability.'
    };
  }

  public recommendDataGrid(context: {
    estimatedRows?: number;
    requiresVirtualization?: boolean;
    requiresServerSide?: boolean;
    requiresGroupingOrPivot?: boolean;
    licensePreference?: 'PERMISSIVE_MIT' | 'COMMERCIAL_OK';
  }): {
    recommended: DataGridMetadata;
    rationale: string;
    cautionNote?: string;
  } {
    const rows = context.estimatedRows || 500;

    if (rows > 50000 || context.requiresServerSide) {
      const rec = this.grids.get('grid-ag-grid-community')!;
      let caution: string | undefined;
      if (context.requiresGroupingOrPivot) {
        caution = 'CAUTION: Row Grouping and Pivoting in AG Grid require a commercial AG Grid Enterprise license. Community Edition is strictly flat grid.';
      }
      return {
        recommended: rec,
        rationale: `Extreme row count (${rows.toLocaleString()} rows) benefits from AG Grid's battle-tested viewport virtualization engine.`,
        cautionNote: caution
      };
    }

    return {
      recommended: this.grids.get('grid-tanstack-table')!,
      rationale: 'TanStack Table v8 is 100% open source MIT with zero commercial upsells, delivering headless flexibility and headless styling control.'
    };
  }
}

export const specializedIntelligenceEngine = new SpecializedIntelligenceEngine();
