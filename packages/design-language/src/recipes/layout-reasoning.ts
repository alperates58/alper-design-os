/**
 * Layout Reasoning Layer V2
 * Formulates structural layout decisions: content width, density, sidebar behavior,
 * master-detail split allocations, chart-vs-table tradeoffs, responsive priorities,
 * and Windows 125% DPI display scaling tolerance.
 */

export interface ViewportConstraint {
  width: number;
  height: number;
  dpiScalingFactor?: number; // e.g. 1.25 for Windows 125%
}

export interface LayoutReasoningDecision {
  layoutPattern: string;
  containerMaxWidth: string;
  sidebarBehavior: 'PERSISTENT_EXPANDED' | 'COLLAPSIBLE_ICON_RAIL' | 'HIDDEN_MOBILE_DRAWER';
  sidebarWidthPx: number;
  masterDetailSplit: {
    enabled: boolean;
    masterWidth: string;
    detailWidth: string;
    stackOnNarrow: boolean;
  };
  densityPreset: {
    mode: 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS';
    baseSpacingPx: number;
    tableRowHeightPx: number;
    buttonHeightPx: number;
  };
  dataPresentationChoice: {
    recommendedView: 'DATAGRID_PRIMARY' | 'CHART_HERO_TABLE_SECONDARY' | 'CARD_STREAM';
    rationale: string;
  };
  responsivePriorities: {
    primaryVisibleSection: string;
    deferredToDrawer: string[];
    mobileActionPlacement: 'STICKY_BOTTOM' | 'HEADER_RIGHT';
  };
  windowsDpiAdjustments?: {
    effectiveViewportHeight: number;
    reducedChromeHeight: boolean;
    recommendedHeaderHeightPx: number;
  };
}

export interface LayoutReasoningContext {
  productType: string;
  userTask: 'DATA_DENSE_MANAGEMENT' | 'EXECUTIVE_OVERVIEW' | 'CONTENT_CONSUMPTION' | 'DEVELOPER_BUILD';
  viewport: ViewportConstraint;
  recordCountEstimate?: number;
  isMissionCritical?: boolean;
}

export class LayoutReasoningEngine {
  /**
   * Formulates concrete layout structure based on device viewport and task context.
   */
  public evaluateLayout(context: LayoutReasoningContext): LayoutReasoningDecision {
    const { width, height } = context.viewport;
    const dpi = context.viewport.dpiScalingFactor || 1.0;
    const effectiveWidth = Math.floor(width / dpi);
    const effectiveHeight = Math.floor(height / dpi);

    const isMobile = effectiveWidth < 768;
    const isTablet = effectiveWidth >= 768 && effectiveWidth < 1200;
    const isDesktop = effectiveWidth >= 1200;

    // 1. Sidebar behavior
    let sidebarBehavior: 'PERSISTENT_EXPANDED' | 'COLLAPSIBLE_ICON_RAIL' | 'HIDDEN_MOBILE_DRAWER';
    let sidebarWidthPx = 240;

    if (isMobile) {
      sidebarBehavior = 'HIDDEN_MOBILE_DRAWER';
      sidebarWidthPx = 0;
    } else if (isTablet || (dpi >= 1.25 && effectiveWidth < 1280)) {
      sidebarBehavior = 'COLLAPSIBLE_ICON_RAIL';
      sidebarWidthPx = 64;
    } else {
      sidebarBehavior = 'PERSISTENT_EXPANDED';
      sidebarWidthPx = 240;
    }

    // 2. Master Detail Split
    const masterDetail = {
      enabled: isDesktop && context.userTask === 'DATA_DENSE_MANAGEMENT',
      masterWidth: isDesktop ? '380px' : '100%',
      detailWidth: isDesktop ? 'calc(100% - 380px)' : '100%',
      stackOnNarrow: true
    };

    // 3. Density Mode & Measurements
    let densityMode: 'COMPACT' | 'COMFORTABLE' | 'SPACIOUS' = 'COMFORTABLE';
    if (context.userTask === 'DATA_DENSE_MANAGEMENT' || context.userTask === 'DEVELOPER_BUILD' || dpi >= 1.25) {
      densityMode = 'COMPACT';
    } else if (context.userTask === 'CONTENT_CONSUMPTION') {
      densityMode = 'SPACIOUS';
    }

    const densityPreset = {
      mode: densityMode,
      baseSpacingPx: densityMode === 'COMPACT' ? 4 : densityMode === 'COMFORTABLE' ? 8 : 12,
      tableRowHeightPx: densityMode === 'COMPACT' ? 36 : densityMode === 'COMFORTABLE' ? 48 : 60,
      buttonHeightPx: densityMode === 'COMPACT' ? 32 : densityMode === 'COMFORTABLE' ? 40 : 44
    };

    // 4. Data Presentation Choice (Table vs Chart vs Card)
    const records = context.recordCountEstimate || 50;
    let dataChoice: {
      recommendedView: 'DATAGRID_PRIMARY' | 'CHART_HERO_TABLE_SECONDARY' | 'CARD_STREAM';
      rationale: string;
    };

    if (context.userTask === 'EXECUTIVE_OVERVIEW') {
      dataChoice = {
        recommendedView: 'CHART_HERO_TABLE_SECONDARY',
        rationale: 'Executive tasks require high-level aggregation and metric trendlines before granular item inspection.'
      };
    } else if (context.userTask === 'DATA_DENSE_MANAGEMENT' || records > 20) {
      dataChoice = {
        recommendedView: 'DATAGRID_PRIMARY',
        rationale: `High record volume (${records} items) and operational management mandate a multi-column data grid with 36px rows to minimize vertical scrolling.`
      };
    } else {
      dataChoice = {
        recommendedView: 'CARD_STREAM',
        rationale: 'Low item volume and consumer focus favor visual card presentation with clear click targets.'
      };
    }

    // 5. Container Max Width
    let containerMaxWidth = '100%';
    if (context.userTask === 'CONTENT_CONSUMPTION') {
      containerMaxWidth = '68ch'; // 68 characters reading measure
    } else if (isTablet) {
      containerMaxWidth = '100%';
    } else if (!isDesktop) {
      containerMaxWidth = '100%';
    } else if (context.userTask === 'EXECUTIVE_OVERVIEW') {
      containerMaxWidth = '1440px';
    }

    // 6. Windows 125% DPI Adjustments
    let windowsDpiAdjustments;
    if (dpi >= 1.25) {
      windowsDpiAdjustments = {
        effectiveViewportHeight: effectiveHeight,
        reducedChromeHeight: true,
        recommendedHeaderHeightPx: 48 // reduced from 64px to save 16px of vertical height
      };
    }

    return {
      layoutPattern: isMobile ? 'STACKED_MOBILE_SHELL' : masterDetail.enabled ? 'MASTER_DETAIL_PANEL' : 'FLUID_EXPANDED_WORKSPACE',
      containerMaxWidth,
      sidebarBehavior,
      sidebarWidthPx,
      masterDetailSplit: masterDetail,
      densityPreset,
      dataPresentationChoice: dataChoice,
      responsivePriorities: {
        primaryVisibleSection: context.userTask === 'DATA_DENSE_MANAGEMENT' ? 'DataGrid Table' : 'Primary Overview Content',
        deferredToDrawer: ['Secondary Filters', 'Metadata Properties', 'Audit Log History'],
        mobileActionPlacement: isMobile ? 'STICKY_BOTTOM' : 'HEADER_RIGHT'
      },
      windowsDpiAdjustments
    };
  }
}
