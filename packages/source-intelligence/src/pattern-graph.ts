import { PatternId, PatternNode, PatternNodeSchema } from './types.js';

export const PATTERN_NODES: PatternNode[] = [
  {
    id: 'APP_SHELL',
    name: 'Application Shell',
    intent: 'Provide persistent outer framing, brand identity, navigation anchor, and user profile controls.',
    category: 'CONTAINER_SURFACE',
    appropriateWhen: ['Desktop web applications', 'Multi-view enterprise consoles', 'Portals requiring consistent top/side frame'],
    avoidWhen: ['Single-purpose mobile landing pages', 'Distraction-free document writing modes'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Skip to main content link (Accesskey/Tab)', 'Landmark navigation (banner, main, navigation)'],
    mobileStrategy: 'Collapse navigation into sliding drawer or bottom tab bar; hide non-essential status items.',
    accessibilityNotes: ['Must declare <header role="banner"> and <main role="main">', 'Accessible skip-navigation anchor required'],
    relatedPatterns: ['SIDEBAR', 'TOP_NAV', 'NOTIFICATION'],
    candidateSources: ['src-carbon-design-system', 'src-patternfly', 'src-primer', 'src-material-design']
  },
  {
    id: 'SIDEBAR',
    name: 'Collapsible Sidebar Navigation',
    intent: 'Provide hierarchical and multi-level navigational links organized into logical groups with state persistence.',
    category: 'NAVIGATION',
    appropriateWhen: ['Applications with more than 5 primary navigation destinations', 'Nested route hierarchies', 'Dense workspace consoles'],
    avoidWhen: ['Simple linear workflows', 'Consumer websites with less than 4 pages'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['ArrowUp/ArrowDown to traverse items', 'ArrowRight/ArrowLeft to expand/collapse nested menus'],
    mobileStrategy: 'Transform into off-canvas drawer opened via hamburger button with focus trap.',
    accessibilityNotes: ['Declare <nav aria-label="Primary Navigation">', 'Nested submenus require aria-expanded attributes'],
    relatedPatterns: ['APP_SHELL', 'TOP_NAV', 'COMMAND_PALETTE'],
    candidateSources: ['src-carbon-design-system', 'src-shadcn-ui', 'src-fluent-ui', 'src-polaris']
  },
  {
    id: 'TOP_NAV',
    name: 'Top Navigation Bar',
    intent: 'Host global search, environment switcher, notifications counter, and user account actions.',
    category: 'NAVIGATION',
    appropriateWhen: ['Global context switching is frequent', 'Wide horizontal layout has available header space'],
    avoidWhen: ['Workspaces needing maximum vertical viewport space'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Tab traversal through global actions', 'Escape to dismiss account menu'],
    mobileStrategy: 'Truncate brand title, compact search into modal icon, group overflow actions.',
    accessibilityNotes: ['Ensure color contrast >= 4.5:1 on background', 'Account dropdown must announce expanded state'],
    relatedPatterns: ['APP_SHELL', 'SEARCH', 'COMMAND_PALETTE'],
    candidateSources: ['src-govuk-design-system', 'src-primer', 'src-uswds', 'src-material-design']
  },
  {
    id: 'COMMAND_PALETTE',
    name: 'Command Palette / Quick Switcher',
    intent: 'Provide instant keyboard-driven search, navigation, and command execution across entire system.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Power-user productivity tools', 'Complex systems with 50+ deep views or actions'],
    avoidWhen: ['Simple consumer read-only websites', 'Touch-only kiosk devices'],
    informationDensity: 'HIGH',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['Cmd/Ctrl + K shortcut trigger', 'ArrowUp/Down selection', 'Enter to execute', 'Escape to dismiss'],
    mobileStrategy: 'Convert to full-screen search view triggered from search button.',
    accessibilityNotes: ['Combobox pattern with aria-autocomplete="list"', 'Active descendant announcement via aria-activedescendant'],
    relatedPatterns: ['SEARCH', 'SIDEBAR', 'APP_SHELL'],
    candidateSources: ['src-shadcn-ui', 'src-radix-ui', 'src-primer', 'src-carbon-design-system']
  },
  {
    id: 'DATA_TABLE',
    name: 'Structured Data Table',
    intent: 'Display tabular records with sortable columns, pagination, and multi-row selection.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Displaying homogeneous entity collections', 'Users need to compare attributes side-by-side'],
    avoidWhen: ['Highly unstructured or narrative content', 'Primary mobile portrait consumption'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Tab between sort buttons and row action triggers', 'Space to toggle row selection checkbox'],
    mobileStrategy: 'Switch to stacked card list or horizontal swipeable table container with sticky headers.',
    accessibilityNotes: ['<th> headers with scope="col"', 'aria-sort="ascending|descending" on sorted columns'],
    relatedPatterns: ['DENSE_GRID', 'FILTER_BAR', 'BULK_ACTION'],
    candidateSources: ['src-carbon-design-system', 'src-tanstack-table', 'src-patternfly', 'src-polaris']
  },
  {
    id: 'DENSE_GRID',
    name: 'High-Density Analytical Data Grid',
    intent: 'Render tens of thousands of real-time rows with column pin, virtualization, cell editing, and grouping.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Manufacturing scheduling', 'Financial market blotters', 'High-throughput operational oversight'],
    avoidWhen: ['Marketing websites', 'Basic contact lists', 'Low-information consumer portals'],
    informationDensity: 'HIGH',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['Full 2D arrow key cell navigation', 'Enter to start cell edit', 'F2 to inspect formula', 'Ctrl+C to copy cell'],
    mobileStrategy: 'Restricted view with read-only summary card; guide user to desktop for full grid manipulations.',
    accessibilityNotes: ['role="grid" with aria-rowindex and aria-colindex', 'Focus management on active cell container'],
    relatedPatterns: ['DATA_TABLE', 'INLINE_EDIT', 'FILTER_BAR'],
    candidateSources: ['src-ag-grid-community', 'src-tanstack-table', 'src-carbon-design-system']
  },
  {
    id: 'MASTER_DETAIL',
    name: 'Master-Detail Workbench',
    intent: 'Show list of items on one pane and deep inspection/editing controls for selected item in adjacent pane.',
    category: 'WORKFLOW_ORCHESTRATION',
    appropriateWhen: ['Users need to triage, inspect, or configure items sequentially without losing list context'],
    avoidWhen: ['Screens narrower than 1024px where both panes cannot comfortably co-exist'],
    informationDensity: 'HIGH',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['ArrowUp/Down to step through master list', 'Tab/F6 to jump focus into detail pane'],
    mobileStrategy: 'Transform into drill-down navigation stack where clicking item pushes detail screen.',
    accessibilityNotes: ['Establish aria-controls relationship between master item and detail region'],
    relatedPatterns: ['DATA_TABLE', 'SPLIT_PANE', 'DRAWER'],
    candidateSources: ['src-carbon-design-system', 'src-patternfly', 'src-fluent-ui', 'src-spectrum']
  },
  {
    id: 'SPLIT_PANE',
    name: 'Resizable Split Pane',
    intent: 'Allow users to dynamically adjust viewport ratio between two complementary workspaces.',
    category: 'CONTAINER_SURFACE',
    appropriateWhen: ['Code/preview editors', 'Log stream next to timeline', 'Dual document comparisons'],
    avoidWhen: ['Fixed layout mobile screens'],
    informationDensity: 'HIGH',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Separator has role="separator"', 'Arrow keys adjust split percentage by 5% increments'],
    mobileStrategy: 'Stack vertically or toggle via tabs.',
    accessibilityNotes: ['aria-valuenow, aria-valuemin, aria-valuemax on splitter element'],
    relatedPatterns: ['MASTER_DETAIL', 'APP_SHELL'],
    candidateSources: ['src-radix-ui', 'src-ariakit', 'src-mantine']
  },
  {
    id: 'FILTER_BAR',
    name: 'Faceted Filter Bar',
    intent: 'Provide multi-criteria filtering across attributes, dates, tags, and status states with active tag chips.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Collections exceeding 20 items where users search by specific dimensions'],
    avoidWhen: ['Static small datasets where full scan takes < 2 seconds'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Tab navigation between filter pills', 'Backspace/Delete on active chip to remove filter'],
    mobileStrategy: 'Collapse into dedicated "Filter & Sort" sheet/modal with apply button.',
    accessibilityNotes: ['Filter tag chips announce removal action', 'Live region announces result count updates'],
    relatedPatterns: ['DATA_TABLE', 'SEARCH', 'DENSE_GRID'],
    candidateSources: ['src-carbon-design-system', 'src-polaris', 'src-patternfly', 'src-shadcn-ui']
  },
  {
    id: 'SEARCH',
    name: 'Debounced Global / Scoped Search',
    intent: 'Locate entities rapidly using partial text match, highlighting, and scoped category suggestions.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Primary discovery mechanism for large unstructured or semi-structured indices'],
    avoidWhen: ['Tiny datasets where scrolling is faster than typing'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Escape to clear search query', 'Down arrow to enter result list directly'],
    mobileStrategy: 'Expand to full width when focused; dismiss keyboard on search trigger.',
    accessibilityNotes: ['type="search" with clearable button', 'aria-describedby pointing to result count summary'],
    relatedPatterns: ['COMMAND_PALETTE', 'FILTER_BAR', 'TOP_NAV'],
    candidateSources: ['src-govuk-design-system', 'src-primer', 'src-material-design']
  },
  {
    id: 'FORM',
    name: 'Validated Enterprise Form',
    intent: 'Collect complex business inputs with immediate inline validation, grouped fieldsets, and clear error states.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Record creation, settings adjustment, transaction authorization'],
    avoidWhen: ['Single-input quick triggers (use command or prompt instead)'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['Strict logical tab order', 'Enter submits form when not inside multiline textarea'],
    mobileStrategy: 'Single column layout with full-width inputs and visible error summaries at top.',
    accessibilityNotes: ['Explicit <label for="..."> for every input', 'aria-invalid="true" with aria-errormessage on failure'],
    relatedPatterns: ['WIZARD', 'INLINE_EDIT', 'MODAL'],
    candidateSources: ['src-govuk-design-system', 'src-polaris', 'src-uswds', 'src-carbon-design-system']
  },
  {
    id: 'WIZARD',
    name: 'Multi-Step Guided Wizard',
    intent: 'Break high-complexity multi-variable configuration into linear, digestible steps with progress indication.',
    category: 'WORKFLOW_ORCHESTRATION',
    appropriateWhen: ['Complex onboarding', 'Multi-stage provisioning', 'Infrequent tasks with branch logic'],
    avoidWhen: ['Repetitive daily tasks performed dozens of times by expert operators'],
    informationDensity: 'LOW',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Enter to advance to next step', 'Esc or Back button to review prior step'],
    mobileStrategy: 'Compact horizontal step stepper into "Step X of Y: Title" header.',
    accessibilityNotes: ['Declare aria-current="step" on active item', 'Announce step transition via polite live region'],
    relatedPatterns: ['FORM', 'MODAL'],
    candidateSources: ['src-carbon-design-system', 'src-patternfly', 'src-uswds']
  },
  {
    id: 'TIMELINE',
    name: 'Gantt / Operational Timeline',
    intent: 'Visualize chronological events, resource allocations, machine states, and dependency links across time scales.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Manufacturing scheduling', 'Logistics dispatch', 'Project milestone tracking'],
    avoidWhen: ['Data with no temporal component'],
    informationDensity: 'HIGH',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['ArrowLeft/Right to pan timeline', 'Plus/Minus or Ctrl+Wheel to zoom time resolution'],
    mobileStrategy: 'Provide date-grouped agenda/list view as primary mobile representation.',
    accessibilityNotes: ['Provide accessible alternative data table with identical schedule entries'],
    relatedPatterns: ['CALENDAR', 'DENSE_GRID', 'CHART'],
    candidateSources: ['src-carbon-design-system', 'src-echarts', 'src-patternfly']
  },
  {
    id: 'CALENDAR',
    name: 'Interactive Calendar View',
    intent: 'Display scheduled appointments, shifts, and deliverables across day, week, and month grids.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Work shift management', 'Customer appointment booking', 'Release calendar oversight'],
    avoidWhen: ['Dense sub-minute industrial sensor events'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Arrow keys navigate grid days', 'PageUp/PageDown moves month by month'],
    mobileStrategy: 'Default to day/agenda view with month picker drawer.',
    accessibilityNotes: ['role="grid" with table headers for weekdays', 'aria-label on each cell with full date text'],
    relatedPatterns: ['TIMELINE', 'DATA_TABLE'],
    candidateSources: ['src-radix-ui', 'src-chakra-ui', 'src-mantine']
  },
  {
    id: 'KANBAN',
    name: 'Kanban Workflow Board',
    intent: 'Manage progressive states of tasks, orders, or tickets across draggable vertical status columns.',
    category: 'WORKFLOW_ORCHESTRATION',
    appropriateWhen: ['Visual task management', 'Multi-stage dispatch pipeline', 'Support ticket triage'],
    avoidWhen: ['Datasets with > 10,000 active records requiring mathematical aggregation'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['Space to pick up card', 'Arrow keys to move column/slot', 'Enter to drop card'],
    mobileStrategy: 'Horizontal carousel where one column fills screen width with indicator dots.',
    accessibilityNotes: ['Full keyboard drag-and-drop support with aria-grabbed or custom action menu'],
    relatedPatterns: ['DATA_TABLE', 'MASTER_DETAIL', 'BULK_ACTION'],
    candidateSources: ['src-primer', 'src-atlassian-design-system', 'src-shadcn-ui']
  },
  {
    id: 'TREE',
    name: 'Hierarchical Tree View',
    intent: 'Represent deep recursive parent-child structures such as file systems, organizational charts, or asset boms.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Navigating directory trees', 'Complex bill of materials (BOM)', 'Nested taxonomy editors'],
    avoidWhen: ['Flat linear collections'],
    informationDensity: 'HIGH',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['ArrowDown/Up for vertical step', 'ArrowRight to expand node', 'ArrowLeft to collapse or go to parent'],
    mobileStrategy: 'Full-width indent with distinct collapse/expand touch targets >= 44x44px.',
    accessibilityNotes: ['role="tree" with role="treeitem" and aria-expanded="true|false"'],
    relatedPatterns: ['MASTER_DETAIL', 'SIDEBAR'],
    candidateSources: ['src-carbon-design-system', 'src-fluent-ui', 'src-radix-ui']
  },
  {
    id: 'GRAPH',
    name: 'Node-Link Network Graph',
    intent: 'Display entity relationships, dependency graphs, electrical topologies, and data lineages.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Topology mapping', 'Microservice dependency tracing', 'Supply chain lineage visualization'],
    avoidWhen: ['Simple 1-to-many tabular hierarchies'],
    informationDensity: 'HIGH',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['Focusable nodes with Tab/Arrow navigation', 'Enter to inspect node attributes'],
    mobileStrategy: 'Render read-only vector image with collapsible list of connections below.',
    accessibilityNotes: ['Provide companion textual adjacency list or table for screen readers'],
    relatedPatterns: ['CHART', 'TREE'],
    candidateSources: ['src-echarts', 'src-carbon-design-system']
  },
  {
    id: 'CHART',
    name: 'Analytical Metric Chart',
    intent: 'Render statistical distributions, line trends, bar comparisons, and telemetry streams.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['KPI trends over time', 'Comparative category metrics', 'Resource utilization visual summaries'],
    avoidWhen: ['Precise single-record data entry'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Interactive tooltip focusable via keyboard navigation along data series points'],
    mobileStrategy: 'Responsive SVG with reduced x-axis label density and touch scrub tooltip.',
    accessibilityNotes: ['Embedded <desc> and <title> tags in SVG', 'Accessible data table toggle adjacent to chart'],
    relatedPatterns: ['KPI', 'TIMELINE', 'GRAPH'],
    candidateSources: ['src-echarts', 'src-recharts', 'src-chartjs']
  },
  {
    id: 'KPI',
    name: 'Executive KPI Summary Card',
    intent: 'Prominently display a key business metric with trend direction indicator, delta percentage, and status color.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Dashboard overviews', 'Health indicators', 'Top-level status cards'],
    avoidWhen: ['Detailed multivariable regression analysis'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Card container focusable if clickable to drill down'],
    mobileStrategy: '2-column or 1-column responsive card grid.',
    accessibilityNotes: ['State trend semantic meaning in text (e.g. "Increased by 12%") rather than color alone'],
    relatedPatterns: ['CHART', 'DATA_TABLE', 'APP_SHELL'],
    candidateSources: ['src-carbon-design-system', 'src-polaris', 'src-patternfly']
  },
  {
    id: 'NOTIFICATION',
    name: 'Notification Center & Toast System',
    intent: 'Inform users of asynchronous background events, system errors, job completions, and required actions.',
    category: 'FEEDBACK_STATUS',
    appropriateWhen: ['Asynchronous operations', 'System alerts', 'Success feedback on form submissions'],
    avoidWhen: ['Critical blocking decisions requiring immediate modal intervention'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['F6 or shortcut to jump into toast container', 'Escape or button to dismiss'],
    mobileStrategy: 'Top or bottom banner matching native OS notification ergonomics.',
    accessibilityNotes: ['role="status" for informative toasts; role="alert" for error conditions'],
    relatedPatterns: ['APP_SHELL', 'ERROR_STATE'],
    candidateSources: ['src-radix-ui', 'src-sonner', 'src-carbon-design-system', 'src-chakra-ui']
  },
  {
    id: 'MODAL',
    name: 'Focus-Trapping Dialog Modal',
    intent: 'Interrupt user workflow to request immediate decision, confirmation, or self-contained sub-task input.',
    category: 'CONTAINER_SURFACE',
    appropriateWhen: ['Destructive confirmations (e.g. delete cluster)', 'Critical credential entry', 'Focused single-task edits'],
    avoidWhen: ['Non-blocking reference data display', 'Frequent repetitive operations'],
    informationDensity: 'LOW',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Strict focus trap within dialog boundaries', 'Escape key dismisses dialog', 'Initial focus on safe element'],
    mobileStrategy: 'Transform into full-screen bottom sheet with sticky action buttons.',
    accessibilityNotes: ['role="dialog" or role="alertdialog"', 'aria-modal="true"', 'aria-labelledby pointing to title'],
    relatedPatterns: ['DRAWER', 'FORM', 'ERROR_STATE'],
    candidateSources: ['src-radix-ui', 'src-react-aria', 'src-ariakit', 'src-shadcn-ui']
  },
  {
    id: 'DRAWER',
    name: 'Slide-Over Sheet / Drawer',
    intent: 'Provide secondary context, auxiliary settings, or deep inspections while keeping parent view partially visible.',
    category: 'CONTAINER_SURFACE',
    appropriateWhen: ['Quick item editing', 'Filter configuration panels', 'Activity logs inspection'],
    avoidWhen: ['Primary full-page workflows requiring maximum horizontal space'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Focus trap while open', 'Escape key to slide closed'],
    mobileStrategy: 'Slides from bottom filling 90% of screen height with drag handle.',
    accessibilityNotes: ['role="dialog" with aria-modal="true" and focus restore on close'],
    relatedPatterns: ['MODAL', 'MASTER_DETAIL', 'SIDEBAR'],
    candidateSources: ['src-radix-ui', 'src-shadcn-ui', 'src-carbon-design-system']
  },
  {
    id: 'CONTEXT_MENU',
    name: 'Right-Click Context Menu',
    intent: 'Provide contextual quick actions directly relevant to the element clicked or active selection.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Desktop web consoles', 'Data grids and canvas workbenches with rich item actions'],
    avoidWhen: ['Primary mobile touch interfaces without explicit long-press affordance'],
    informationDensity: 'LOW',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Shift+F10 or Menu key triggers menu', 'ArrowDown/Up traverses items', 'Escape dismisses'],
    mobileStrategy: 'Provide explicit three-dots "..." icon button triggering bottom action sheet.',
    accessibilityNotes: ['role="menu" with role="menuitem" and proper roving tabindex'],
    relatedPatterns: ['COMMAND_PALETTE', 'BULK_ACTION'],
    candidateSources: ['src-radix-ui', 'src-react-aria', 'src-ariakit']
  },
  {
    id: 'EMPTY_STATE',
    name: 'Actionable Empty State',
    intent: 'Guide users when no records exist, explaining why the view is empty and offering primary call-to-action.',
    category: 'FEEDBACK_STATUS',
    appropriateWhen: ['First-time user onboarding', 'Search returning zero results', 'Inbox with zero pending tasks'],
    avoidWhen: ['Transient loading states (use skeleton loaders)'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Focus lands cleanly on primary CTA button'],
    mobileStrategy: 'Centered illustration or icon, concise copy, and large full-width action button.',
    accessibilityNotes: ['Clear heading structure (e.g. <h3>No active machines</h3>) followed by descriptive text'],
    relatedPatterns: ['LOADING_STATE', 'ERROR_STATE', 'FORM'],
    candidateSources: ['src-polaris', 'src-patternfly', 'src-carbon-design-system', 'src-primer']
  },
  {
    id: 'ERROR_STATE',
    name: 'Resilient Error State & Boundary',
    intent: 'Inform user when an operation or network call failed, providing diagnostic error codes and retry action.',
    category: 'FEEDBACK_STATUS',
    appropriateWhen: ['API connection drop', 'Unauthorized access (403)', 'Server fault (500)', 'Crash boundary caught'],
    avoidWhen: ['Normal empty data scenarios'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Keyboard focus on "Retry" or "Back to Safety" button'],
    mobileStrategy: 'Prominent warning icon, human-readable recovery guidance, and sticky "Try Again" button.',
    accessibilityNotes: ['role="alert" for immediate screen reader announcement without losing focus context'],
    relatedPatterns: ['EMPTY_STATE', 'NOTIFICATION'],
    candidateSources: ['src-govuk-design-system', 'src-carbon-design-system', 'src-uswds']
  },
  {
    id: 'LOADING_STATE',
    name: 'Contextual Skeleton / Progress State',
    intent: 'Indicate background processing with layout-preserving skeleton placeholders rather than generic spinners.',
    category: 'FEEDBACK_STATUS',
    appropriateWhen: ['Initial page fetch', 'Card metric loading', 'Table query execution'],
    avoidWhen: ['Instantaneous actions taking < 200ms'],
    informationDensity: 'LOW',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Non-interactive; assistive tech informed via aria-busy="true"'],
    mobileStrategy: 'Skeletons match exact mobile card and line heights to eliminate Cumulative Layout Shift (CLS).',
    accessibilityNotes: ['Container marked with aria-busy="true"', 'Hidden live region announcing loading completion'],
    relatedPatterns: ['EMPTY_STATE', 'DATA_TABLE'],
    candidateSources: ['src-carbon-design-system', 'src-radix-ui', 'src-shadcn-ui', 'src-material-design']
  },
  {
    id: 'BULK_ACTION',
    name: 'Bulk Selection Toolbar',
    intent: 'Execute batched operations (archive, delete, approve, export) on multiple selected records.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Data tables, kanban cards, or document lists where users process records in batches'],
    avoidWhen: ['Views with strictly single-record execution rules'],
    informationDensity: 'LOW',
    interactionComplexity: 'MEDIUM',
    keyboardNeeds: ['Focus shifts to floating toolbar when rows are checked', 'Tab between action buttons'],
    mobileStrategy: 'Floating bottom bar displaying selected item count and primary action button.',
    accessibilityNotes: ['Announce count change (e.g. "4 items selected") to screen readers via polite live region'],
    relatedPatterns: ['DATA_TABLE', 'DENSE_GRID', 'CONTEXT_MENU'],
    candidateSources: ['src-carbon-design-system', 'src-polaris', 'src-patternfly']
  },
  {
    id: 'INLINE_EDIT',
    name: 'Inline Cell & Attribute Editor',
    intent: 'Allow modifying values directly in place without navigating to dedicated full-page edit form.',
    category: 'COMMAND_INPUT',
    appropriateWhen: ['Quick naming, status changing, or tag adjustments in data tables and detail views'],
    avoidWhen: ['Inputs requiring complex multi-field cross-validation or file uploads'],
    informationDensity: 'MEDIUM',
    interactionComplexity: 'HIGH',
    keyboardNeeds: ['Enter to commit edit', 'Escape to cancel edit and restore original value', 'Tab moves to next editable cell'],
    mobileStrategy: 'Double tap or explicit pencil icon trigger to prevent unintended focus while scrolling.',
    accessibilityNotes: ['Announce edit mode to screen readers; restore focus to trigger element on cancel'],
    relatedPatterns: ['DENSE_GRID', 'DATA_TABLE', 'FORM'],
    candidateSources: ['src-ag-grid-community', 'src-tanstack-table', 'src-carbon-design-system']
  },
  {
    id: 'AUDIT_TRAIL',
    name: 'Audit Trail / Change Log Stream',
    intent: 'Display immutable historical record of modifications, timestamps, actors, and diff snapshots for compliance.',
    category: 'DATA_DISPLAY',
    appropriateWhen: ['Enterprise systems subject to compliance, regulated finance, healthcare, security operations'],
    avoidWhen: ['Ephemeral consumer interactions with zero regulatory needs'],
    informationDensity: 'HIGH',
    interactionComplexity: 'LOW',
    keyboardNeeds: ['Expand/collapse diff details with Enter or Space'],
    mobileStrategy: 'Chronological timeline feed with relative timestamps.',
    accessibilityNotes: ['Semantic list <ol> with chronological order and structured metadata labels'],
    relatedPatterns: ['TIMELINE', 'MASTER_DETAIL', 'DATA_TABLE'],
    candidateSources: ['src-carbon-design-system', 'src-patternfly', 'src-primer']
  }
];

export class PatternKnowledgeGraph {
  private patterns: Map<PatternId, PatternNode> = new Map();

  constructor(initialNodes: PatternNode[] = PATTERN_NODES) {
    for (const node of initialNodes) {
      PatternNodeSchema.parse(node);
      this.patterns.set(node.id, node);
    }
  }

  public getAll(): PatternNode[] {
    return Array.from(this.patterns.values());
  }

  public get(id: PatternId): PatternNode | undefined {
    return this.patterns.get(id);
  }

  public search(query: string): PatternNode[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();

    return this.getAll().filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.intent.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.candidateSources.some((s) => s.toLowerCase().includes(q))
    );
  }

  public getPatternsByCategory(category: PatternNode['category']): PatternNode[] {
    return this.getAll().filter((p) => p.category === category);
  }

  public getPatternsForDensity(density: 'LOW' | 'MEDIUM' | 'HIGH'): PatternNode[] {
    return this.getAll().filter((p) => p.informationDensity === density);
  }

  public recommendPatternsForProduct(productContext: {
    domain?: string;
    density?: 'LOW' | 'MEDIUM' | 'HIGH';
    isEnterprise?: boolean;
    isMobileFirst?: boolean;
  }): PatternNode[] {
    const results: PatternNode[] = [];

    // Always include foundational shell
    const shell = this.get('APP_SHELL');
    if (shell) results.push(shell);

    if (productContext.density === 'HIGH' || productContext.isEnterprise) {
      const dense = this.get('DENSE_GRID') || this.get('DATA_TABLE');
      const palette = this.get('COMMAND_PALETTE');
      const filter = this.get('FILTER_BAR');
      const audit = this.get('AUDIT_TRAIL');
      const timeline = this.get('TIMELINE');

      if (dense) results.push(dense);
      if (palette) results.push(palette);
      if (filter) results.push(filter);
      if (audit) results.push(audit);
      if (timeline && productContext.domain?.toLowerCase().includes('manufacturing')) results.push(timeline);
    } else {
      const card = this.get('KPI');
      const form = this.get('FORM');
      const notif = this.get('NOTIFICATION');
      if (card) results.push(card);
      if (form) results.push(form);
      if (notif) results.push(notif);
    }

    return Array.from(new Set(results));
  }

  public recommendForContext(productContext: {
    domain?: string;
    density?: 'LOW' | 'MEDIUM' | 'HIGH';
    isEnterprise?: boolean;
    isMobileFirst?: boolean;
  }): PatternNode[] {
    return this.recommendPatternsForProduct(productContext);
  }
}

export const patternKnowledgeGraph = new PatternKnowledgeGraph();
