import { ComponentBlueprint } from '../types.js';
import {
  createButtonInteractionContract,
  createInputInteractionContract,
  createModalInteractionContract,
  createDrawerInteractionContract,
  createTableInteractionContract
} from '../contracts/interaction-contract.js';
import {
  createResponsiveContract,
  createDenseTableResponsiveContract,
  createFilterBarResponsiveContract
} from '../contracts/responsive-contract.js';
import {
  createButtonA11yContract,
  createDialogA11yContract,
  createTableA11yContract,
  createAccessibilityContract
} from '../contracts/accessibility-contract.js';

// 1. BUTTON
export const canonicalButton: ComponentBlueprint = {
  id: 'canonical-button',
  type: 'BUTTON',
  role: 'button',
  intent: 'Triggers an immediate user action or opens an interactive surface.',
  variants: ['primary', 'secondary', 'destructive', 'outline', 'ghost'],
  states: ['DEFAULT', 'HOVER', 'FOCUS', 'ACTIVE', 'DISABLED', 'LOADING'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [{ name: 'children', type: 'node', required: true, description: 'Button text label and optional icon.' }],
    props: [
      { name: 'variant', type: 'string', defaultValue: 'primary', required: false },
      { name: 'disabled', type: 'boolean', defaultValue: false, required: false },
      { name: 'loading', type: 'boolean', defaultValue: false, required: false },
      { name: 'type', type: 'string', defaultValue: 'button', required: false }
    ]
  },
  tokens: {
    background: 'action.primary',
    hoverBackground: 'action.primary.hover',
    text: 'text.inverse',
    border: 'border.subtle',
    focusRing: 'focus.ring'
  },
  interactions: createButtonInteractionContract(),
  keyboardBehavior: ['Enter: Trigger action', 'Space: Trigger action'],
  responsiveBehavior: createResponsiveContract({ touchTarget: { minWidth: 44, minHeight: 44 } }),
  accessibilityRequirements: createButtonA11yContract(),
  sourceReferences: [
    { sourceName: 'WAI-ARIA 1.2 Button Pattern', mode: 'REFERENCE', notes: 'Native keyboard and focus specs' },
    { sourceName: 'Carbon Design System Button', mode: 'KNOWLEDGE', notes: 'Loading state and sizing standards' }
  ],
  implementationHints: ['Always use native <button> tag with type="button" by default.']
};

// 2. INPUT
export const canonicalInput: ComponentBlueprint = {
  id: 'canonical-input',
  type: 'INPUT',
  role: 'textbox',
  intent: 'Captures single-line alphanumeric user input with validation states.',
  variants: ['default', 'filled', 'underlined'],
  states: ['DEFAULT', 'HOVER', 'FOCUS', 'DISABLED', 'ERROR', 'SUCCESS'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [{ name: 'prefixIcon', type: 'icon', required: false, description: 'Optional leading search or filter icon.' }],
    props: [
      { name: 'placeholder', type: 'string', defaultValue: '', required: false },
      { name: 'value', type: 'string', defaultValue: '', required: false },
      { name: 'disabled', type: 'boolean', defaultValue: false, required: false },
      { name: 'required', type: 'boolean', defaultValue: false, required: false }
    ]
  },
  tokens: {
    background: 'surface.default',
    border: 'border.strong',
    text: 'text.primary',
    focusRing: 'focus.ring',
    errorBorder: 'status.critical'
  },
  interactions: createInputInteractionContract(),
  keyboardBehavior: ['Escape: Blur or clear', 'Tab: Move to next focusable element'],
  responsiveBehavior: createResponsiveContract({ contentMinWidth: 200 }),
  accessibilityRequirements: createAccessibilityContract('textbox', 'LABEL_ELEMENT', {
    ariaRequirements: [
      { attribute: 'aria-invalid', valueDescription: 'true when validation failed', required: false },
      { attribute: 'aria-required', valueDescription: 'true if mandatory', required: false }
    ]
  }),
  sourceReferences: [
    { sourceName: 'W3C WAI-ARIA Form Practices', mode: 'REFERENCE', notes: 'Form field accessibility' }
  ],
  implementationHints: ['Always associate input with an explicit <label for="id"> element.']
};

// 3. SELECT
export const canonicalSelect: ComponentBlueprint = {
  id: 'canonical-select',
  type: 'SELECT',
  role: 'combobox',
  intent: 'Enables selection of one or multiple options from a collapsed dropdown list.',
  variants: ['default', 'outline'],
  states: ['DEFAULT', 'HOVER', 'FOCUS', 'ACTIVE', 'DISABLED', 'ERROR'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [{ name: 'options', type: 'array', required: true, description: 'List of key-value option items.' }],
    props: [
      { name: 'placeholder', type: 'string', defaultValue: 'Select...', required: false },
      { name: 'multiple', type: 'boolean', defaultValue: false, required: false }
    ]
  },
  tokens: {
    background: 'surface.default',
    border: 'border.strong',
    text: 'text.primary',
    focusRing: 'focus.ring'
  },
  interactions: createInputInteractionContract(),
  keyboardBehavior: ['ArrowDown/ArrowUp: Navigate options', 'Enter: Select option', 'Escape: Close list'],
  responsiveBehavior: createResponsiveContract(),
  accessibilityRequirements: createAccessibilityContract('combobox', 'LABEL_ELEMENT', {
    ariaRequirements: [
      { attribute: 'aria-expanded', valueDescription: 'true when options popup is open', required: true }
    ]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Select Pattern', mode: 'REFERENCE', notes: 'Listbox and combobox' }],
  implementationHints: ['Ensure native select fallback for mobile devices if custom menu lacks touch polish.']
};

// 4. CHECKBOX
export const canonicalCheckbox: ComponentBlueprint = {
  id: 'canonical-checkbox',
  type: 'CHECKBOX',
  role: 'checkbox',
  intent: 'Allows binary or indeterminate toggle state selection.',
  variants: ['default'],
  states: ['DEFAULT', 'HOVER', 'FOCUS', 'ACTIVE', 'DISABLED', 'SELECTED'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [{ name: 'label', type: 'text', required: true, description: 'Descriptive checkbox label.' }],
    props: [
      { name: 'checked', type: 'boolean', defaultValue: false, required: false },
      { name: 'indeterminate', type: 'boolean', defaultValue: false, required: false }
    ]
  },
  tokens: {
    background: 'surface.default',
    activeBackground: 'action.primary',
    border: 'border.strong',
    focusRing: 'focus.ring'
  },
  interactions: createButtonInteractionContract(),
  keyboardBehavior: ['Space: Toggle checked state'],
  responsiveBehavior: createResponsiveContract({ touchTarget: { minWidth: 44, minHeight: 44 } }),
  accessibilityRequirements: createAccessibilityContract('checkbox', 'LABEL_ELEMENT', {
    ariaRequirements: [{ attribute: 'aria-checked', valueDescription: 'true, false, or mixed', required: true }]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Checkbox Pattern', mode: 'REFERENCE', notes: 'WCAG 2.2 states' }],
  implementationHints: ['Provide minimum 44x44px clickable target box around the input.']
};

// 5. RADIO
export const canonicalRadio: ComponentBlueprint = {
  id: 'canonical-radio',
  type: 'RADIO',
  role: 'radio',
  intent: 'Allows mutually exclusive choice selection within a group.',
  variants: ['default'],
  states: ['DEFAULT', 'HOVER', 'FOCUS', 'DISABLED', 'SELECTED'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [{ name: 'label', type: 'text', required: true, description: 'Radio item text label.' }],
    props: [
      { name: 'name', type: 'string', required: true },
      { name: 'value', type: 'string', required: true }
    ]
  },
  tokens: {
    background: 'surface.default',
    activeIndicator: 'action.primary',
    border: 'border.strong'
  },
  interactions: createButtonInteractionContract(),
  keyboardBehavior: ['ArrowUp/ArrowDown/ArrowLeft/ArrowRight: Move selection between radio buttons'],
  responsiveBehavior: createResponsiveContract(),
  accessibilityRequirements: createAccessibilityContract('radio', 'LABEL_ELEMENT', {
    ariaRequirements: [{ attribute: 'aria-checked', valueDescription: 'true if selected', required: true }]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Radio Group', mode: 'REFERENCE', notes: 'Roving tabindex' }],
  implementationHints: ['Group related radio buttons in <fieldset> with <legend>.']
};

// 6. SWITCH
export const canonicalSwitch: ComponentBlueprint = {
  id: 'canonical-switch',
  type: 'SWITCH',
  role: 'switch',
  intent: 'Immediate toggle control between on and off states.',
  variants: ['default'],
  states: ['DEFAULT', 'HOVER', 'FOCUS', 'DISABLED', 'ACTIVE', 'SELECTED'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [{ name: 'label', type: 'text', required: true, description: 'Descriptive setting label.' }],
    props: [{ name: 'checked', type: 'boolean', defaultValue: false, required: false }]
  },
  tokens: {
    trackDefault: 'border.subtle',
    trackActive: 'action.primary',
    thumb: 'surface.default'
  },
  interactions: createButtonInteractionContract(),
  keyboardBehavior: ['Space or Enter: Toggle switch value'],
  responsiveBehavior: createResponsiveContract(),
  accessibilityRequirements: createAccessibilityContract('switch', 'LABEL_ELEMENT', {
    ariaRequirements: [{ attribute: 'aria-checked', valueDescription: 'true or false', required: true }]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Switch Pattern', mode: 'REFERENCE', notes: 'Immediate activation' }],
  implementationHints: ['Use role="switch" instead of checkbox when change takes effect immediately without submit.']
};

// 7. BADGE
export const canonicalBadge: ComponentBlueprint = {
  id: 'canonical-badge',
  type: 'BADGE',
  role: 'status',
  intent: 'Visual tag indicating categorical status, count, or metadata pill.',
  variants: ['neutral', 'success', 'warning', 'critical', 'info'],
  states: ['DEFAULT'],
  size: 'SM',
  density: 'COMPACT',
  contentModel: {
    slots: [{ name: 'children', type: 'text', required: true, description: 'Badge label text or numeric count.' }],
    props: [{ name: 'variant', type: 'string', defaultValue: 'neutral', required: false }]
  },
  tokens: {
    background: 'surface.subtle',
    text: 'text.secondary',
    border: 'border.subtle'
  },
  interactions: {
    triggers: [],
    keyboardShortcuts: [],
    focusManagement: { autoFocus: false, trapFocus: false, restoreFocus: false, focusVisibleRing: false },
    stateTransitions: []
  },
  keyboardBehavior: [],
  responsiveBehavior: createResponsiveContract({ touchTarget: { minWidth: 20, minHeight: 20 } }),
  accessibilityRequirements: createAccessibilityContract('status', 'INNER_TEXT'),
  sourceReferences: [{ sourceName: 'Atlassian Design System Badge', mode: 'KNOWLEDGE', notes: 'Status pill standards' }],
  implementationHints: ['Do not rely on color alone; always pair status color with explicit text label.']
};

// 8. ALERT
export const canonicalAlert: ComponentBlueprint = {
  id: 'canonical-alert',
  type: 'ALERT',
  role: 'alert',
  intent: 'Prominent contextual banner notifying user of system feedback or status.',
  variants: ['info', 'success', 'warning', 'critical'],
  states: ['DEFAULT'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [
      { name: 'title', type: 'text', required: true, description: 'Short alert summary.' },
      { name: 'description', type: 'text', required: false, description: 'Detailed explanatory message.' }
    ],
    props: [{ name: 'dismissible', type: 'boolean', defaultValue: false, required: false }]
  },
  tokens: {
    background: 'surface.elevated',
    border: 'border.subtle',
    text: 'text.primary',
    criticalBorder: 'status.critical',
    successBorder: 'status.success'
  },
  interactions: {
    triggers: [{ event: 'CLICK', targetState: 'DEFAULT', action: 'dismissAlert' }],
    keyboardShortcuts: [{ key: 'Escape', action: 'DISMISS', description: 'Dismisses alert' }],
    focusManagement: { autoFocus: false, trapFocus: false, restoreFocus: false, focusVisibleRing: true },
    stateTransitions: []
  },
  keyboardBehavior: ['Escape: Dismiss if dismissible'],
  responsiveBehavior: createResponsiveContract(),
  accessibilityRequirements: createAccessibilityContract('alert', 'INNER_TEXT', {
    ariaRequirements: [{ attribute: 'aria-live', valueDescription: '"assertive" or "polite"', required: true }]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Alert Pattern', mode: 'REFERENCE', notes: 'Screen reader announcement' }],
  implementationHints: ['Use role="alert" for immediate critical feedback; role="status" for non-disruptive feedback.']
};

// 9. CARD
export const canonicalCard: ComponentBlueprint = {
  id: 'canonical-card',
  type: 'CARD',
  role: 'region',
  intent: 'Structural container grouping related content, actions, and media.',
  variants: ['elevated', 'outlined', 'flat'],
  states: ['DEFAULT', 'HOVER'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [
      { name: 'header', type: 'node', required: false, description: 'Title, subtitle and badge.' },
      { name: 'body', type: 'node', required: true, description: 'Main card content region.' },
      { name: 'footer', type: 'node', required: false, description: 'Action buttons or timestamps.' }
    ],
    props: [{ name: 'hoverable', type: 'boolean', defaultValue: false, required: false }]
  },
  tokens: {
    background: 'surface.elevated',
    border: 'border.subtle',
    shadow: 'shadow.sm'
  },
  interactions: {
    triggers: [],
    keyboardShortcuts: [],
    focusManagement: { autoFocus: false, trapFocus: false, restoreFocus: false, focusVisibleRing: false },
    stateTransitions: []
  },
  keyboardBehavior: [],
  responsiveBehavior: createResponsiveContract({ stackPolicy: 'STACK_ON_MOBILE' }),
  accessibilityRequirements: createAccessibilityContract('region', 'LABEL_ELEMENT'),
  sourceReferences: [{ sourceName: 'Polaris Card Pattern', mode: 'KNOWLEDGE', notes: 'Card grouping guidelines' }],
  implementationHints: ['Avoid "card soup" anti-pattern; do not wrap every single statistic in isolated tiny cards.']
};

// 10. MODAL_DIALOG
export const canonicalModalDialog: ComponentBlueprint = {
  id: 'canonical-modal-dialog',
  type: 'MODAL_DIALOG',
  role: 'dialog',
  intent: 'Interruptive modal layer requiring user action or confirmation before returning.',
  variants: ['standard', 'confirmation', 'destructive'],
  states: ['DEFAULT', 'ACTIVE'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [
      { name: 'title', type: 'text', required: true, description: 'Modal heading.' },
      { name: 'content', type: 'node', required: true, description: 'Form or dialog body text.' },
      { name: 'actions', type: 'node', required: true, description: 'Confirm and cancel buttons.' }
    ],
    props: [{ name: 'isOpen', type: 'boolean', defaultValue: false, required: true }]
  },
  tokens: {
    overlay: 'modal.overlay.background',
    surface: 'surface.default',
    border: 'border.subtle',
    shadow: 'shadow.lg'
  },
  interactions: createModalInteractionContract(),
  keyboardBehavior: ['Escape: Close modal', 'Tab: Trap and cycle focus within modal'],
  responsiveBehavior: createResponsiveContract({
    touchTarget: { minWidth: 44, minHeight: 44 },
    contentMinWidth: 320
  }),
  accessibilityRequirements: createDialogA11yContract(),
  sourceReferences: [
    { sourceName: 'WAI-ARIA Dialog (Modal) Pattern', mode: 'REFERENCE', notes: 'Focus trap and escape restoration' }
  ],
  implementationHints: ['Trap focus strictly inside modal when open; restore focus to trigger element on dismiss.']
};

// 11. DRAWER
export const canonicalDrawer: ComponentBlueprint = {
  id: 'canonical-drawer',
  type: 'DRAWER',
  role: 'complementary',
  intent: 'Sliding contextual inspector panel anchored to the edge of the viewport.',
  variants: ['right', 'left', 'bottom'],
  states: ['DEFAULT', 'ACTIVE'],
  size: 'LG',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [
      { name: 'header', type: 'node', required: true, description: 'Drawer title and close button.' },
      { name: 'body', type: 'node', required: true, description: 'Form fields or detail attributes.' }
    ],
    props: [{ name: 'isOpen', type: 'boolean', defaultValue: false, required: true }]
  },
  tokens: {
    surface: 'surface.default',
    border: 'border.subtle',
    shadow: 'shadow.lg'
  },
  interactions: createDrawerInteractionContract(),
  keyboardBehavior: ['Escape: Close drawer'],
  responsiveBehavior: createResponsiveContract({
    stackPolicy: 'STACK_ALWAYS',
    overflowPolicy: 'SCROLL'
  }),
  accessibilityRequirements: createAccessibilityContract('complementary', 'ARIA_LABELLEDBY'),
  sourceReferences: [{ sourceName: 'Atlassian Inspector Drawer', mode: 'KNOWLEDGE', notes: 'Detail pane patterns' }],
  implementationHints: ['On mobile viewports, expand drawer width to 100vw for seamless full-screen inspection.']
};

// 12. TOOLTIP
export const canonicalTooltip: ComponentBlueprint = {
  id: 'canonical-tooltip',
  type: 'TOOLTIP',
  role: 'tooltip',
  intent: 'Brief informative textual label appearing on keyboard focus or mouse hover.',
  variants: ['default'],
  states: ['DEFAULT', 'ACTIVE'],
  size: 'SM',
  density: 'COMPACT',
  contentModel: {
    slots: [
      { name: 'trigger', type: 'node', required: true, description: 'Anchor element.' },
      { name: 'content', type: 'text', required: true, description: 'Tooltip description string.' }
    ],
    props: [{ name: 'placement', type: 'string', defaultValue: 'top', required: false }]
  },
  tokens: {
    background: 'text.primary',
    text: 'text.inverse',
    radius: 'radius.sm'
  },
  interactions: {
    triggers: [
      { event: 'HOVER', targetState: 'ACTIVE', action: 'showTooltip' },
      { event: 'FOCUS', targetState: 'ACTIVE', action: 'showTooltip' }
    ],
    keyboardShortcuts: [{ key: 'Escape', action: 'DISMISS_TOOLTIP', description: 'Hides tooltip' }],
    focusManagement: { autoFocus: false, trapFocus: false, restoreFocus: false, focusVisibleRing: false },
    stateTransitions: [{ from: 'DEFAULT', to: 'ACTIVE', trigger: 'hover', durationMs: 150 }]
  },
  keyboardBehavior: ['Escape: Dismiss tooltip without losing trigger focus'],
  responsiveBehavior: createResponsiveContract({ hidePolicy: 'ON_MOBILE' }),
  accessibilityRequirements: createAccessibilityContract('tooltip', 'INNER_TEXT', {
    ariaRequirements: [{ attribute: 'aria-describedby', valueDescription: 'ID of tooltip container', required: true }]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Tooltip Pattern', mode: 'REFERENCE', notes: 'Hover & focus parity' }],
  implementationHints: ['Never place essential interactive content inside a tooltip; use for supplemental hints only.']
};

// 13. DROPDOWN_MENU
export const canonicalDropdownMenu: ComponentBlueprint = {
  id: 'canonical-dropdown-menu',
  type: 'DROPDOWN_MENU',
  role: 'menu',
  intent: 'Contextual floating action menu opened from an overflow trigger.',
  variants: ['default'],
  states: ['DEFAULT', 'ACTIVE'],
  size: 'MD',
  density: 'COMFORTABLE',
  contentModel: {
    slots: [
      { name: 'trigger', type: 'node', required: true, description: 'Button that toggles the dropdown.' },
      { name: 'items', type: 'array', required: true, description: 'List of menu item actions.' }
    ],
    props: [{ name: 'isOpen', type: 'boolean', defaultValue: false, required: false }]
  },
  tokens: {
    background: 'surface.elevated',
    border: 'border.subtle',
    shadow: 'shadow.md',
    itemHover: 'surface.subtle'
  },
  interactions: createModalInteractionContract(),
  keyboardBehavior: ['ArrowDown/ArrowUp: Navigate items', 'Enter: Activate item', 'Escape: Close menu'],
  responsiveBehavior: createResponsiveContract(),
  accessibilityRequirements: createAccessibilityContract('menu', 'ARIA_LABELLEDBY', {
    ariaRequirements: [{ attribute: 'aria-haspopup', valueDescription: '"menu"', required: true }]
  }),
  sourceReferences: [{ sourceName: 'WAI-ARIA Menu & Menubar Pattern', mode: 'REFERENCE', notes: 'Roving tabindex' }],
  implementationHints: ['Trigger button must indicate aria-expanded="true/false".']
};

// 14. DATA_TABLE
export const canonicalDataTable: ComponentBlueprint = {
  id: 'canonical-data-table',
  type: 'DATA_TABLE',
  role: 'table',
  intent: 'High-density structured data presentation with sorting, filtering, selection and pagination.',
  variants: ['striped', 'bordered', 'compact'],
  states: ['DEFAULT', 'HOVER', 'LOADING', 'EMPTY', 'SELECTED'],
  size: 'MD',
  density: 'COMPACT',
  contentModel: {
    slots: [
      { name: 'columns', type: 'array', required: true, description: 'Column schema, titles, and cell renderers.' },
      { name: 'rows', type: 'array', required: true, description: 'Dataset rows matching column keys.' }
    ],
    props: [
      { name: 'sortable', type: 'boolean', defaultValue: true, required: false },
      { name: 'selectable', type: 'boolean', defaultValue: false, required: false },
      { name: 'stickyHeader', type: 'boolean', defaultValue: true, required: false }
    ]
  },
  tokens: {
    headerBackground: 'table.header.background',
    rowHoverBackground: 'table.row.hover.background',
    border: 'border.subtle',
    text: 'text.primary'
  },
  interactions: createTableInteractionContract(),
  keyboardBehavior: [
    'ArrowDown/ArrowUp: Move row selection',
    'Space: Toggle row selection',
    'Enter: Open row details'
  ],
  responsiveBehavior: createDenseTableResponsiveContract(),
  accessibilityRequirements: createTableA11yContract(),
  sourceReferences: [
    { sourceName: 'WAI-ARIA Table & Grid Pattern', mode: 'REFERENCE', notes: 'Tabular accessibility' },
    { sourceName: 'TanStack Table & AG Grid', mode: 'KNOWLEDGE', notes: 'Keyboard and sorting interactions' }
  ],
  implementationHints: [
    'Wrap in horizontal scroll container for mobile fallback; prioritize key columns before collapsing.'
  ]
};

// 15. FILTER_BAR
export const canonicalFilterBar: ComponentBlueprint = {
  id: 'canonical-filter-bar',
  type: 'FILTER_BAR',
  role: 'search',
  intent: 'Query refinement strip combining search typeahead, faceted filter chips, and saved view presets.',
  variants: ['inline', 'collapsed'],
  states: ['DEFAULT', 'ACTIVE'],
  size: 'MD',
  density: 'COMPACT',
  contentModel: {
    slots: [
      { name: 'searchField', type: 'component', required: true, description: 'Text input for query string.' },
      { name: 'filterChips', type: 'array', required: false, description: 'Active filter tags with remove buttons.' },
      { name: 'actions', type: 'node', required: false, description: 'Clear all and Save View buttons.' }
    ],
    props: [{ name: 'liveFilter', type: 'boolean', defaultValue: true, required: false }]
  },
  tokens: {
    background: 'surface.default',
    border: 'border.subtle'
  },
  interactions: {
    triggers: [
      { event: 'VALUE_CHANGE', targetState: 'ACTIVE', action: 'triggerLiveFiltering' },
      { event: 'CLICK', targetState: 'DEFAULT', action: 'removeFilterChip' }
    ],
    keyboardShortcuts: [{ key: 'Control+f', action: 'FOCUS_SEARCH', description: 'Jump focus to search bar' }],
    focusManagement: { autoFocus: false, trapFocus: false, restoreFocus: false, focusVisibleRing: true },
    stateTransitions: []
  },
  keyboardBehavior: ['Ctrl+F / Cmd+F: Jump focus to search input'],
  responsiveBehavior: createFilterBarResponsiveContract(),
  accessibilityRequirements: createAccessibilityContract('search', 'ARIA_LABEL', {
    ariaRequirements: [{ attribute: 'aria-label', valueDescription: '"Filter records"', required: true }]
  }),
  sourceReferences: [{ sourceName: 'IBM Carbon Filter Pattern', mode: 'KNOWLEDGE', notes: 'Faceted search UI' }],
  implementationHints: [
    'On mobile viewports, provide a single Filter button that opens a drawer containing all faceted controls.'
  ]
};

export const canonicalComponentSet: ComponentBlueprint[] = [
  canonicalButton,
  canonicalInput,
  canonicalSelect,
  canonicalCheckbox,
  canonicalRadio,
  canonicalSwitch,
  canonicalBadge,
  canonicalAlert,
  canonicalCard,
  canonicalModalDialog,
  canonicalDrawer,
  canonicalTooltip,
  canonicalDropdownMenu,
  canonicalDataTable,
  canonicalFilterBar
];
