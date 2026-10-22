/**
 * Component Recipes Intelligence V2
 * 18 Canonical UI Component Recipes defining function, states, accessibility,
 * responsive behavior, theme behavior, keyboard interactions, and reuse contracts.
 */

export interface ComponentRecipe {
  id: string;
  name: string;
  category: 'NAVIGATION' | 'DATA_DISPLAY' | 'INPUTS' | 'FEEDBACK' | 'OVERLAYS' | 'LAYOUT';
  functionDescription: string;
  supportedStates: string[];
  accessibility: {
    role: string;
    ariaAttributes: string[];
    keyboardShortcuts: string[];
    focusManagement: string;
  };
  responsiveBehavior: {
    mobile: string;
    tablet: string;
    desktop: string;
    dpiScalingNote?: string;
  };
  themingBehavior: {
    lightSurface: string;
    darkSurface: string;
    contrastRequirements: string;
  };
  integrationConstraints: string[];
  preferredReuseTarget: string;
}

export const CANONICAL_COMPONENT_RECIPES: Record<string, ComponentRecipe> = {
  navigationShell: {
    id: 'REC-NAV-SHELL',
    name: 'App Navigation Shell',
    category: 'NAVIGATION',
    functionDescription: 'Top-level application container coordinating header, collapsible side rail, and primary workspace.',
    supportedStates: ['EXPANDED', 'COLLAPSED_ICONS_ONLY', 'MOBILE_DRAWER'],
    accessibility: {
      role: 'banner / navigation',
      ariaAttributes: ['aria-expanded', 'aria-label="Main Navigation"'],
      keyboardShortcuts: ['Alt + M (toggle navigation)', 'Escape (close mobile drawer)'],
      focusManagement: 'Focus trap active only when mobile overlay drawer is open.'
    },
    responsiveBehavior: {
      mobile: 'Hidden behind hamburger trigger; slides in as full-height sheet modal',
      tablet: 'Collapses to 64px icon-only rail',
      desktop: 'Persistent 240px sidebar with smooth collapse toggle',
      dpiScalingNote: 'At 125% DPI scaling, collapses to icon rail below 1280px viewport.'
    },
    themingBehavior: {
      lightSurface: 'var(--alper-nav-bg, #ffffff) with 1px border-r var(--alper-border-default)',
      darkSurface: 'var(--alper-nav-bg, #121215) with 1px border-r var(--alper-border-default)',
      contrastRequirements: 'Icons and labels maintain >= 4.5:1 against sidebar surface'
    },
    integrationConstraints: ['Must wrap all primary page routes; preserve active state during navigation'],
    preferredReuseTarget: 'Radix Dialog (mobile) / Native CSS Grid'
  },

  sidebarTopbar: {
    id: 'REC-SIDEBAR-TOPBAR',
    name: 'Header & Context Toolbar',
    category: 'NAVIGATION',
    functionDescription: 'Global header providing brand identity, breadcrumbs, search shortcut, and user profile menu.',
    supportedStates: ['DEFAULT', 'STICKY_SCROLLED', 'SEARCH_EXPANDED'],
    accessibility: {
      role: 'toolbar',
      ariaAttributes: ['aria-label="Application Header"'],
      keyboardShortcuts: ['Cmd/Ctrl + K (focus global search)'],
      focusManagement: 'Logical tab order from breadcrumb to search to actions.'
    },
    responsiveBehavior: {
      mobile: 'Height 56px; search collapses to modal icon button',
      tablet: 'Height 60px; compact breadcrumbs',
      desktop: 'Height 64px; full interactive breadcrumb with quick actions'
    },
    themingBehavior: {
      lightSurface: 'var(--alper-surface-default) with border-b var(--alper-border-default)',
      darkSurface: 'var(--alper-surface-default) with border-b var(--alper-border-default)',
      contrastRequirements: 'Text >= 4.5:1'
    },
    integrationConstraints: ['Keep sticky at top: 0 with z-index: 40'],
    preferredReuseTarget: 'HTML5 <header> + semantic nav'
  },

  toolbars: {
    id: 'REC-TOOLBARS',
    name: 'Contextual Action Toolbar',
    category: 'NAVIGATION',
    functionDescription: 'Operational action bar docked above tables or editors for batch operations and view toggles.',
    supportedStates: ['DEFAULT', 'BATCH_SELECTION_ACTIVE', 'STICKY'],
    accessibility: {
      role: 'toolbar',
      ariaAttributes: ['aria-controls="data-grid"', 'aria-label="Table Actions"'],
      keyboardShortcuts: ['ArrowLeft / ArrowRight to cycle toolbar buttons'],
      focusManagement: 'Roving tabindex for toolbar items.'
    },
    responsiveBehavior: {
      mobile: 'Secondary actions overflow into "..." dropdown menu',
      tablet: 'Wrap into dual row if width < 768px',
      desktop: 'Single continuous flex row with search, filters, and primary CTA'
    },
    themingBehavior: {
      lightSurface: 'var(--alper-surface-subtle)',
      darkSurface: 'var(--alper-surface-subtle)',
      contrastRequirements: 'Action buttons must be distinct from table headers'
    },
    integrationConstraints: ['Debounce filter inputs by 200ms'],
    preferredReuseTarget: 'Radix Toolbar primitive'
  },

  buttonsActionMenus: {
    id: 'REC-BUTTON-MENUS',
    name: 'Action Button & Split Menu',
    category: 'INPUTS',
    functionDescription: 'Primary, secondary, and destructive action triggers with optional split dropdown options.',
    supportedStates: ['DEFAULT', 'HOVER', 'FOCUS', 'ACTIVE', 'DISABLED', 'LOADING'],
    accessibility: {
      role: 'button',
      ariaAttributes: ['aria-haspopup="menu"', 'aria-expanded', 'aria-disabled'],
      keyboardShortcuts: ['Enter / Space to activate', 'ArrowDown to open split menu'],
      focusManagement: 'Visible 2px offset focus ring (--alper-interactive-focus-ring).'
    },
    responsiveBehavior: {
      mobile: 'Full width for primary screen CTA (min-height 44px for tap target)',
      tablet: 'Standard inline-block',
      desktop: 'Standard inline-block'
    },
    themingBehavior: {
      lightSurface: 'Primary solid with white text; secondary outlined with neutral border',
      darkSurface: 'High contrast solid with dark text; subtle borders',
      contrastRequirements: '>= 4.5:1 text-to-background contrast'
    },
    integrationConstraints: ['Always disable click handler when loading or disabled'],
    preferredReuseTarget: 'shadcn/ui Button / Radix DropdownMenu'
  },

  dataGrid: {
    id: 'REC-DATAGRID',
    name: 'Enterprise DataGrid & Tables',
    category: 'DATA_DISPLAY',
    functionDescription: 'High-density multi-column data viewer supporting sorting, resizing, filtering, and selection.',
    supportedStates: ['DEFAULT', 'SORTED', 'LOADING_SKELETON', 'EMPTY_FILTER', 'MULTI_ROW_SELECTED'],
    accessibility: {
      role: 'grid',
      ariaAttributes: ['aria-rowcount', 'aria-colcount', 'aria-sort', 'aria-selected'],
      keyboardShortcuts: ['ArrowUp/Down (row navigation)', 'Space (toggle row selection)', 'Enter (open row detail)'],
      focusManagement: 'Grid cell roving tabindex.'
    },
    responsiveBehavior: {
      mobile: 'Card list transformation or horizontal touch scroll with sticky first column',
      tablet: 'Scrollable container with sticky header and column visibility toggles',
      desktop: 'Fluid table taking 100% width with sticky header (36px compact or 48px comfortable)',
      dpiScalingNote: 'Maintain minimum 13px font size under 125% DPI scale.'
    },
    themingBehavior: {
      lightSurface: 'Zebra striping optional; alternate row hover: var(--alper-table-row-hover)',
      darkSurface: 'Subtle row borders (1px solid var(--alper-border-default)); no heavy zebra',
      contrastRequirements: 'Numbers and status badges >= 4.5:1'
    },
    integrationConstraints: ['Virtualize DOM rows if dataset exceeds 100 rows'],
    preferredReuseTarget: 'TanStack Table + Tailwind styles'
  },

  formsValidation: {
    id: 'REC-FORMS',
    name: 'Form Controls & Field Validation',
    category: 'INPUTS',
    functionDescription: 'Accessible input fields, selects, checkboxes, and textareas with live inline validation.',
    supportedStates: ['DEFAULT', 'FOCUS', 'VALID', 'INVALID_ERROR', 'DISABLED'],
    accessibility: {
      role: 'group / textbox / combobox',
      ariaAttributes: ['aria-invalid="true"', 'aria-describedby="field-error-id"', 'aria-required="true"'],
      keyboardShortcuts: ['Tab to advance, Shift+Tab to reverse, Enter to submit'],
      focusManagement: 'Automatically focus first invalid input upon failed submission.'
    },
    responsiveBehavior: {
      mobile: 'Single column layout with 100% input width',
      tablet: '2-column layout for related fields (City, State, Zip)',
      desktop: 'Structured grid with aligned labels and inline helper text'
    },
    themingBehavior: {
      lightSurface: 'Input bg: #ffffff with border: #cbd5e1; error text: #991b1b',
      darkSurface: 'Input bg: #18181b with border: #3f3f46; error text: #fca5a5',
      contrastRequirements: 'Placeholders must meet 4.5:1 contrast'
    },
    integrationConstraints: ['Use Zod schemas for client/server validation parity'],
    preferredReuseTarget: 'React Hook Form + Zod'
  },

  searchFilters: {
    id: 'REC-SEARCH-FILTERS',
    name: 'Instant Search & Filter Bar',
    category: 'INPUTS',
    functionDescription: 'Instant keyword search bar paired with facet filter dropdowns and active tag pills.',
    supportedStates: ['EMPTY', 'TYPING_DEBOUNCED', 'FILTERS_APPLIED', 'SEARCHING_PROGRESS'],
    accessibility: {
      role: 'search',
      ariaAttributes: ['aria-label="Filter items"', 'aria-live="polite"'],
      keyboardShortcuts: ['Escape (clear search or close filter panel)'],
      focusManagement: 'Screen reader announcement of matching record count.'
    },
    responsiveBehavior: {
      mobile: 'Filter button opens bottom sheet modal with facet checklist',
      tablet: 'Horizontal filter chips with horizontal scroll overflow',
      desktop: 'Inline filter bar with multi-select dropdown chips'
    },
    themingBehavior: {
      lightSurface: 'Active chip: var(--alper-interactive-selected); border: var(--alper-color-accent)',
      darkSurface: 'Active chip: var(--alper-color-secondary); border: var(--alper-color-accent)',
      contrastRequirements: 'Count badge inside chip >= 4.5:1'
    },
    integrationConstraints: ['URL query parameter synchronization for shareable filtered views'],
    preferredReuseTarget: 'Radix Popover / Checkbox facet'
  },

  dropdownsContextMenus: {
    id: 'REC-DROPDOWNS',
    name: 'Dropdown & Context Menu',
    category: 'OVERLAYS',
    functionDescription: 'Floating popover menu triggered by click or right-click context event.',
    supportedStates: ['OPEN', 'CLOSED', 'ITEM_HOVER', 'ITEM_DISABLED'],
    accessibility: {
      role: 'menu',
      ariaAttributes: ['aria-haspopup="true"', 'aria-activedescendant'],
      keyboardShortcuts: ['ArrowDown/Up to navigate', 'Enter/Space to select', 'Escape to close'],
      focusManagement: 'Focus returns to trigger element when dismissed.'
    },
    responsiveBehavior: {
      mobile: 'Converts to bottom sheet if menu items > 5',
      tablet: 'Floating popover with boundary collision flip',
      desktop: 'Floating popover anchored to trigger button'
    },
    themingBehavior: {
      lightSurface: 'Surface elevated (#ffffff) with shadow-md and 1px border',
      darkSurface: 'Surface elevated (#18181b) with 1px border (#3f3f46)',
      contrastRequirements: 'Destructive items marked in red (--alper-status-destructive-text)'
    },
    integrationConstraints: ['Collision detection against viewport boundaries (Floating UI)'],
    preferredReuseTarget: 'Radix DropdownMenu / ContextMenu'
  },

  dialogsDrawers: {
    id: 'REC-DIALOGS-DRAWERS',
    name: 'Modal Dialog & Side Inspection Drawer',
    category: 'OVERLAYS',
    functionDescription: 'Centered modal dialogs for critical confirmations and right-side slide-over drawers for record inspection.',
    supportedStates: ['OPEN_ANIMATING', 'OPEN', 'CLOSING'],
    accessibility: {
      role: 'dialog',
      ariaAttributes: ['aria-modal="true"', 'aria-labelledby="dialog-title-id"'],
      keyboardShortcuts: ['Escape (dismiss)', 'Tab (cycles within focus trap)'],
      focusManagement: 'Strict focus trap; focus first interactive element on open.'
    },
    responsiveBehavior: {
      mobile: 'Drawers and dialogs both fill 100% width and height',
      tablet: 'Drawer width: 440px; Dialog width: max 560px',
      desktop: 'Drawer width: 520px; Dialog width: max 640px'
    },
    themingBehavior: {
      lightSurface: 'Backdrop: rgba(15, 23, 42, 0.4); Dialog: #ffffff',
      darkSurface: 'Backdrop: rgba(0, 0, 0, 0.75); Dialog: #18181b',
      contrastRequirements: 'Dialog border must clearly demarcate from backdrop'
    },
    integrationConstraints: ['Prevent background body scroll when open'],
    preferredReuseTarget: 'Radix Dialog / Sheet'
  },

  tabs: {
    id: 'REC-TABS',
    name: 'Segmented & Navigational Tabs',
    category: 'NAVIGATION',
    functionDescription: 'Horizontal or vertical switcher separating related content views within the same page context.',
    supportedStates: ['TAB_ACTIVE', 'TAB_INACTIVE', 'TAB_HOVER', 'TAB_DISABLED'],
    accessibility: {
      role: 'tablist',
      ariaAttributes: ['aria-selected', 'aria-controls="panel-id"'],
      keyboardShortcuts: ['ArrowLeft / ArrowRight (or Up/Down) to switch active tab'],
      focusManagement: 'Active tab receives focus; panel is referenced by aria-labelledby.'
    },
    responsiveBehavior: {
      mobile: 'Horizontal scroll with scroll snap or dropdown select fallback',
      tablet: 'Horizontal flex tabs with underline indicator',
      desktop: 'Horizontal or vertical segmented rail'
    },
    themingBehavior: {
      lightSurface: 'Underline: 2px solid var(--alper-color-accent); text: var(--alper-text-primary)',
      darkSurface: 'Underline: 2px solid var(--alper-color-accent); text: var(--alper-text-primary)',
      contrastRequirements: 'Inactive tab text must still meet 4.5:1 contrast'
    },
    integrationConstraints: ['Keep tab state in sync with URL hash or sub-route'],
    preferredReuseTarget: 'Radix Tabs primitive'
  },

  fileExplorersTrees: {
    id: 'REC-FILE-TREE',
    name: 'Hierarchical Tree & File Explorer',
    category: 'NAVIGATION',
    functionDescription: 'Nested expandable directory tree for workspace navigation, project hierarchies, or categories.',
    supportedStates: ['EXPANDED', 'COLLAPSED', 'SELECTED', 'DRAGGING'],
    accessibility: {
      role: 'tree',
      ariaAttributes: ['aria-expanded', 'aria-selected', 'role="treeitem"'],
      keyboardShortcuts: ['ArrowRight (expand)', 'ArrowLeft (collapse)', 'ArrowDown/Up (navigate)', 'Enter (open)'],
      focusManagement: 'Single active item focus with roving tabindex.'
    },
    responsiveBehavior: {
      mobile: 'Collapsible into dedicated full-height drawer',
      tablet: 'Docked left panel with resize handle',
      desktop: 'Docked left panel (220px - 360px)'
    },
    themingBehavior: {
      lightSurface: 'Selection: var(--alper-interactive-selected); hover: var(--alper-interactive-hover)',
      darkSurface: 'Selection: var(--alper-interactive-selected); hover: var(--alper-interactive-hover)',
      contrastRequirements: 'Chevron icons must have 3:1 contrast against surface'
    },
    integrationConstraints: ['Debounce deep directory expansion to avoid layout jank'],
    preferredReuseTarget: 'WAI-ARIA Tree View pattern'
  },

  splitPanels: {
    id: 'REC-SPLIT-PANELS',
    name: 'Resizable Split Panel Workspace',
    category: 'LAYOUT',
    functionDescription: 'Dual or triple panel workspace with draggable splitter separator bars for developer/editor tools.',
    supportedStates: ['DEFAULT', 'DRAGGING_SPLITTER', 'PANEL_COLLAPSED'],
    accessibility: {
      role: 'separator',
      ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-orientation'],
      keyboardShortcuts: ['ArrowLeft / ArrowRight to resize by 5%', 'Home/End for min/max'],
      focusManagement: 'Splitter thumb receives visible focus ring.'
    },
    responsiveBehavior: {
      mobile: 'Converts into stacked or tabbed panels (no draggable splitters on mobile)',
      tablet: 'Horizontal split with touch-accessible 12px drag zone',
      desktop: 'Horizontal/vertical split with 6px grab handle'
    },
    themingBehavior: {
      lightSurface: 'Splitter border: 1px solid var(--alper-border-default); hover: var(--alper-color-accent)',
      darkSurface: 'Splitter border: 1px solid var(--alper-border-default); hover: var(--alper-color-accent)',
      contrastRequirements: 'Divider line visible at 3:1 against adjacent panels'
    },
    integrationConstraints: ['Persist panel sizes in localStorage'],
    preferredReuseTarget: 'react-resizable-panels'
  },

  charts: {
    id: 'REC-CHARTS',
    name: 'Analytical Charts & Metric Series',
    category: 'DATA_DISPLAY',
    functionDescription: 'Line, bar, and area charts presenting historical trends, telemetry, or KPI distributions.',
    supportedStates: ['DEFAULT', 'TOOLTIP_HOVER', 'LOADING_SHIMMER', 'EMPTY_DATA'],
    accessibility: {
      role: 'img / region',
      ariaAttributes: ['aria-label="Summary description of chart metrics"', 'role="graphics-document"'],
      keyboardShortcuts: ['Tab to focus chart; Arrow keys to traverse data point tooltips'],
      focusManagement: 'Accompanying hidden screen-reader accessible data table.'
    },
    responsiveBehavior: {
      mobile: 'Simplified axis labels, single primary metric line, hide dense tick marks',
      tablet: 'Standard aspect ratio 16:9',
      desktop: 'Fluid width with interactive crosshair and rich tooltip box'
    },
    themingBehavior: {
      lightSurface: 'Grid lines: #e2e8f0; series: vibrant blue, teal, amber',
      darkSurface: 'Grid lines: #27272a; series: bright cyan, emerald, orange',
      contrastRequirements: 'Series colors must have minimum 3:1 contrast against chart background'
    },
    integrationConstraints: ['Responsive SVG or Canvas with resize observer debouncing'],
    preferredReuseTarget: 'Recharts / Chart.js'
  },

  kpis: {
    id: 'REC-KPIS',
    name: 'Executive Metric & KPI Cards',
    category: 'DATA_DISPLAY',
    functionDescription: 'High-impact headline number with periodic trend delta and miniature sparkline.',
    supportedStates: ['POSITIVE_TREND', 'NEGATIVE_TREND', 'NEUTRAL_TREND', 'LOADING'],
    accessibility: {
      role: 'region',
      ariaAttributes: ['aria-label="Metric Summary"'],
      keyboardShortcuts: [],
      focusManagement: 'Standard document flow.'
    },
    responsiveBehavior: {
      mobile: '1 column (stacked)',
      tablet: '2 columns',
      desktop: '3 or 4 columns grid'
    },
    themingBehavior: {
      lightSurface: 'Surface elevated (#ffffff) with 1px border (#e2e8f0)',
      darkSurface: 'Surface elevated (#18181b) with 1px border (#27272a)',
      contrastRequirements: 'Trend badges (green/red) must use darkened text in light mode and bright text in dark mode'
    },
    integrationConstraints: ['Always display tabular baseline context (e.g., "vs prior month")'],
    preferredReuseTarget: 'shadcn/ui Card'
  },

  cards: {
    id: 'REC-CARDS',
    name: 'Structured Content Card',
    category: 'DATA_DISPLAY',
    functionDescription: 'Bounded container grouping media, title, metadata, and primary action.',
    supportedStates: ['DEFAULT', 'HOVER', 'FOCUSED', 'SELECTED'],
    accessibility: {
      role: 'article',
      ariaAttributes: ['aria-labelledby="card-title-id"'],
      keyboardShortcuts: ['Enter/Space on active card to trigger main action'],
      focusManagement: 'Visible focus outline enclosing interactive card.'
    },
    responsiveBehavior: {
      mobile: '100% width stacked list',
      tablet: '2 columns grid',
      desktop: '3 or 4 columns grid (auto-fit minmax(280px, 1fr))'
    },
    themingBehavior: {
      lightSurface: 'var(--alper-surface-default) with 1px solid var(--alper-border-default)',
      darkSurface: 'var(--alper-surface-default) with 1px solid var(--alper-border-default)',
      contrastRequirements: 'Title text >= 4.5:1; metadata >= 4.5:1'
    },
    integrationConstraints: ['Avoid "card soup" anti-pattern: max 8 cards per view before converting to data table'],
    preferredReuseTarget: 'shadcn/ui Card'
  },

  pagination: {
    id: 'REC-PAGINATION',
    name: 'Data Pagination & Record Count',
    category: 'NAVIGATION',
    functionDescription: 'Page number stepper, page size selector, and total count indicator for large datasets.',
    supportedStates: ['FIRST_PAGE', 'MIDDLE_PAGE', 'LAST_PAGE', 'DISABLED'],
    accessibility: {
      role: 'navigation',
      ariaAttributes: ['aria-label="Pagination"', 'aria-current="page"'],
      keyboardShortcuts: ['ArrowLeft (prior page)', 'ArrowRight (next page)'],
      focusManagement: 'Focus persists on next/previous buttons during paging.'
    },
    responsiveBehavior: {
      mobile: 'Compact stepper ("Page 1 of 12" with < and > buttons)',
      tablet: 'Numbered buttons with ellipsis truncation',
      desktop: 'Full pagination with rows-per-page dropdown and "Showing 1-25 of 340 results"'
    },
    themingBehavior: {
      lightSurface: 'Current page button: solid accent or distinct outline',
      darkSurface: 'Current page button: solid accent or distinct outline',
      contrastRequirements: 'Active page indicator >= 4.5:1'
    },
    integrationConstraints: ['Sync active page index with URL query parameters'],
    preferredReuseTarget: 'shadcn/ui Pagination'
  },

  notifications: {
    id: 'REC-NOTIFICATIONS',
    name: 'Toast Notifications & In-App Alerts',
    category: 'FEEDBACK',
    functionDescription: 'Transient toast notifications for action confirmations and persistent banner alerts for system notices.',
    supportedStates: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
    accessibility: {
      role: 'status / alert',
      ariaAttributes: ['aria-live="polite" (info)', 'aria-live="assertive" (error)'],
      keyboardShortcuts: ['Escape (dismiss focused toast)'],
      focusManagement: 'Do not automatically steal user focus unless mission critical error.'
    },
    responsiveBehavior: {
      mobile: 'Top/bottom full-width banner',
      tablet: 'Bottom-right floating toast stack (max-width 380px)',
      desktop: 'Bottom-right floating toast stack (max-width 420px)'
    },
    themingBehavior: {
      lightSurface: 'Semantic border and tinted background with dark readable text',
      darkSurface: 'Deep neutral background with semantic color accent border and light text',
      contrastRequirements: 'All alert messages strictly >= 4.5:1'
    },
    integrationConstraints: ['Auto-dismiss non-critical toasts after 4,000ms; errors persist until dismissed'],
    preferredReuseTarget: 'Sonner / Radix Toast'
  },

  mobileNav: {
    id: 'REC-MOBILE-NAV',
    name: 'Mobile Bottom Tab Bar & Quick Nav',
    category: 'NAVIGATION',
    functionDescription: 'Fixed bottom navigation bar providing instant access to 3-5 primary application sections on handheld screens.',
    supportedStates: ['DEFAULT', 'ACTIVE_TAB', 'BADGE_NOTIFICATION'],
    accessibility: {
      role: 'navigation',
      ariaAttributes: ['aria-label="Mobile Navigation"', 'aria-current="page"'],
      keyboardShortcuts: [],
      focusManagement: 'Standard touch target navigation.'
    },
    responsiveBehavior: {
      mobile: 'Fixed at viewport bottom (bottom: 0, height: 60px, z-index: 50)',
      tablet: 'Hidden (transfers to sidebar or header)',
      desktop: 'Hidden'
    },
    themingBehavior: {
      lightSurface: '#ffffff with border-t var(--alper-border-default)',
      darkSurface: '#121215 with border-t var(--alper-border-default)',
      contrastRequirements: 'Icons and labels meet 4.5:1'
    },
    integrationConstraints: ['Account for iOS/Android bottom safe area insets (env(safe-area-inset-bottom))'],
    preferredReuseTarget: 'Native semantic <nav>'
  }
};
