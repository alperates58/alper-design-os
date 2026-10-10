import {
  TokenArchitectureV2,
  PrimitiveToken,
  SemanticToken,
  ComponentToken,
  TypographyProfile,
  MotionToken
} from '../types.js';

// ============================================================================
// 1. PRIMITIVE TOKENS (Level 1)
// ============================================================================

export const primitiveTokens: Record<string, PrimitiveToken> = {
  // Neutral Gray Scale
  'color.gray.0': { name: 'color.gray.0', value: '#ffffff', type: 'COLOR' },
  'color.gray.50': { name: 'color.gray.50', value: '#f9fafb', type: 'COLOR' },
  'color.gray.100': { name: 'color.gray.100', value: '#f3f4f6', type: 'COLOR' },
  'color.gray.200': { name: 'color.gray.200', value: '#e5e7eb', type: 'COLOR' },
  'color.gray.300': { name: 'color.gray.300', value: '#d1d5db', type: 'COLOR' },
  'color.gray.400': { name: 'color.gray.400', value: '#9ca3af', type: 'COLOR' },
  'color.gray.500': { name: 'color.gray.500', value: '#6b7280', type: 'COLOR' },
  'color.gray.600': { name: 'color.gray.600', value: '#4b5563', type: 'COLOR' },
  'color.gray.700': { name: 'color.gray.700', value: '#374151', type: 'COLOR' },
  'color.gray.800': { name: 'color.gray.800', value: '#1f2937', type: 'COLOR' },
  'color.gray.900': { name: 'color.gray.900', value: '#111827', type: 'COLOR' },
  'color.gray.950': { name: 'color.gray.950', value: '#030712', type: 'COLOR' },

  // Blue Primary Scale
  'color.blue.50': { name: 'color.blue.50', value: '#eff6ff', type: 'COLOR' },
  'color.blue.100': { name: 'color.blue.100', value: '#dbeafe', type: 'COLOR' },
  'color.blue.500': { name: 'color.blue.500', value: '#3b82f6', type: 'COLOR' },
  'color.blue.600': { name: 'color.blue.600', value: '#2563eb', type: 'COLOR' },
  'color.blue.700': { name: 'color.blue.700', value: '#1d4ed8', type: 'COLOR' },
  'color.blue.800': { name: 'color.blue.800', value: '#1e40af', type: 'COLOR' },

  // Status Colors (Green, Amber, Red)
  'color.green.500': { name: 'color.green.500', value: '#22c55e', type: 'COLOR' },
  'color.green.600': { name: 'color.green.600', value: '#16a34a', type: 'COLOR' },
  'color.amber.500': { name: 'color.amber.500', value: '#f59e0b', type: 'COLOR' },
  'color.amber.600': { name: 'color.amber.600', value: '#d97706', type: 'COLOR' },
  'color.red.500': { name: 'color.red.500', value: '#ef4444', type: 'COLOR' },
  'color.red.600': { name: 'color.red.600', value: '#dc2626', type: 'COLOR' },

  // Spacing Scale (Base 4px rhythmic scale)
  'space.0': { name: 'space.0', value: '0px', type: 'DIMENSION' },
  'space.1': { name: 'space.1', value: '4px', type: 'DIMENSION' },
  'space.2': { name: 'space.2', value: '8px', type: 'DIMENSION' },
  'space.3': { name: 'space.3', value: '12px', type: 'DIMENSION' },
  'space.4': { name: 'space.4', value: '16px', type: 'DIMENSION' },
  'space.5': { name: 'space.5', value: '20px', type: 'DIMENSION' },
  'space.6': { name: 'space.6', value: '24px', type: 'DIMENSION' },
  'space.8': { name: 'space.8', value: '32px', type: 'DIMENSION' },
  'space.10': { name: 'space.10', value: '40px', type: 'DIMENSION' },
  'space.12': { name: 'space.12', value: '48px', type: 'DIMENSION' },
  'space.16': { name: 'space.16', value: '64px', type: 'DIMENSION' },

  // Radius Scale
  'radius.none': { name: 'radius.none', value: '0px', type: 'DIMENSION' },
  'radius.sm': { name: 'radius.sm', value: '4px', type: 'DIMENSION' },
  'radius.md': { name: 'radius.md', value: '6px', type: 'DIMENSION' },
  'radius.lg': { name: 'radius.lg', value: '8px', type: 'DIMENSION' },
  'radius.full': { name: 'radius.full', value: '9999px', type: 'DIMENSION' },

  // Shadows
  'shadow.none': { name: 'shadow.none', value: 'none', type: 'SHADOW' },
  'shadow.sm': { name: 'shadow.sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', type: 'SHADOW' },
  'shadow.md': { name: 'shadow.md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', type: 'SHADOW' },
  'shadow.lg': { name: 'shadow.lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', type: 'SHADOW' }
};

// ============================================================================
// 2. SEMANTIC TOKENS (Level 2: Light / Dark / High-Contrast)
// ============================================================================

export const semanticTokens: Record<string, SemanticToken> = {
  // Surfaces
  'surface.default': {
    name: 'surface.default',
    primitiveRef: 'color.gray.0',
    category: 'SURFACE',
    lightValue: '#ffffff',
    darkValue: '#111827',
    highContrastValue: '#000000',
    description: 'Base application canvas and page background.'
  },
  'surface.elevated': {
    name: 'surface.elevated',
    primitiveRef: 'color.gray.50',
    category: 'SURFACE',
    lightValue: '#f9fafb',
    darkValue: '#1f2937',
    highContrastValue: '#000000',
    description: 'Elevated surface for cards, panels, and dropdown containers.'
  },
  'surface.subtle': {
    name: 'surface.subtle',
    primitiveRef: 'color.gray.100',
    category: 'SURFACE',
    lightValue: '#f3f4f6',
    darkValue: '#374151',
    highContrastValue: '#111111',
    description: 'Subtle zebra striping, table headers, and sunken regions.'
  },

  // Text
  'text.primary': {
    name: 'text.primary',
    primitiveRef: 'color.gray.900',
    category: 'TEXT',
    lightValue: '#111827',
    darkValue: '#f9fafb',
    highContrastValue: '#ffffff',
    description: 'High-contrast readable primary text.'
  },
  'text.secondary': {
    name: 'text.secondary',
    primitiveRef: 'color.gray.600',
    category: 'TEXT',
    lightValue: '#4b5563',
    darkValue: '#9ca3af',
    highContrastValue: '#ffff00',
    description: 'Secondary supportive label text.'
  },
  'text.muted': {
    name: 'text.muted',
    primitiveRef: 'color.gray.400',
    category: 'TEXT',
    lightValue: '#9ca3af',
    darkValue: '#6b7280',
    highContrastValue: '#dddddd',
    description: 'Muted captions, placeholders, and inactive indicators.'
  },
  'text.inverse': {
    name: 'text.inverse',
    primitiveRef: 'color.gray.0',
    category: 'TEXT',
    lightValue: '#ffffff',
    darkValue: '#111827',
    highContrastValue: '#000000',
    description: 'Text rendered on top of vibrant or dark action surfaces.'
  },

  // Borders
  'border.subtle': {
    name: 'border.subtle',
    primitiveRef: 'color.gray.200',
    category: 'BORDER',
    lightValue: '#e5e7eb',
    darkValue: '#374151',
    highContrastValue: '#ffffff',
    description: 'Light structural dividers and table cell borders.'
  },
  'border.strong': {
    name: 'border.strong',
    primitiveRef: 'color.gray.400',
    category: 'BORDER',
    lightValue: '#9ca3af',
    darkValue: '#4b5563',
    highContrastValue: '#ffffff',
    description: 'Form input borders and focused container edges.'
  },

  // Actions
  'action.primary': {
    name: 'action.primary',
    primitiveRef: 'color.blue.600',
    category: 'ACTION',
    lightValue: '#2563eb',
    darkValue: '#3b82f6',
    highContrastValue: '#00ffff',
    description: 'Primary button and prominent interactive elements.'
  },
  'action.primary.hover': {
    name: 'action.primary.hover',
    primitiveRef: 'color.blue.700',
    category: 'ACTION',
    lightValue: '#1d4ed8',
    darkValue: '#2563eb',
    highContrastValue: '#ffffff',
    description: 'Hover state for primary action elements.'
  },
  'action.secondary': {
    name: 'action.secondary',
    primitiveRef: 'color.gray.100',
    category: 'ACTION',
    lightValue: '#f3f4f6',
    darkValue: '#374151',
    highContrastValue: '#000000',
    description: 'Secondary button background.'
  },

  // Status
  'status.critical': {
    name: 'status.critical',
    primitiveRef: 'color.red.600',
    category: 'STATUS',
    lightValue: '#dc2626',
    darkValue: '#ef4444',
    highContrastValue: '#ff0000',
    description: 'Destructive action, error states, and critical system alerts.'
  },
  'status.warning': {
    name: 'status.warning',
    primitiveRef: 'color.amber.500',
    category: 'STATUS',
    lightValue: '#f59e0b',
    darkValue: '#fbbf24',
    highContrastValue: '#ffff00',
    description: 'Attention needed, non-blocking warning alerts.'
  },
  'status.success': {
    name: 'status.success',
    primitiveRef: 'color.green.600',
    category: 'STATUS',
    lightValue: '#16a34a',
    darkValue: '#22c55e',
    highContrastValue: '#00ff00',
    description: 'Successful validation, completed tasks, and healthy states.'
  },

  // Focus
  'focus.ring': {
    name: 'focus.ring',
    primitiveRef: 'color.blue.500',
    category: 'INTERACTIVE',
    lightValue: '#3b82f6',
    darkValue: '#60a5fa',
    highContrastValue: '#ffff00',
    description: 'Accessible 2px focus ring for keyboard navigation.'
  }
};

// ============================================================================
// 3. COMPONENT TOKENS (Level 3)
// ============================================================================

export const componentTokens: Record<string, ComponentToken> = {
  'button.primary.background': {
    name: 'button.primary.background',
    semanticRef: 'action.primary',
    componentType: 'BUTTON',
    property: 'BACKGROUND',
    state: 'DEFAULT',
    resolvedValue: 'var(--alper-action-primary)'
  },
  'button.primary.text': {
    name: 'button.primary.text',
    semanticRef: 'text.inverse',
    componentType: 'BUTTON',
    property: 'TEXT',
    state: 'DEFAULT',
    resolvedValue: 'var(--alper-text-inverse)'
  },
  'button.primary.hover.background': {
    name: 'button.primary.hover.background',
    semanticRef: 'action.primary.hover',
    componentType: 'BUTTON',
    property: 'BACKGROUND',
    state: 'HOVER',
    resolvedValue: 'var(--alper-action-primary-hover)'
  },
  'table.row.hover.background': {
    name: 'table.row.hover.background',
    semanticRef: 'surface.subtle',
    componentType: 'DATA_TABLE',
    property: 'BACKGROUND',
    state: 'HOVER',
    resolvedValue: 'var(--alper-surface-subtle)'
  },
  'table.header.background': {
    name: 'table.header.background',
    semanticRef: 'surface.subtle',
    componentType: 'DATA_TABLE',
    property: 'BACKGROUND',
    state: 'DEFAULT',
    resolvedValue: 'var(--alper-surface-subtle)'
  },
  'sidebar.background': {
    name: 'sidebar.background',
    semanticRef: 'surface.elevated',
    componentType: 'APP_SHELL',
    property: 'BACKGROUND',
    state: 'DEFAULT',
    resolvedValue: 'var(--alper-surface-elevated)'
  },
  'modal.overlay.background': {
    name: 'modal.overlay.background',
    semanticRef: 'surface.default',
    componentType: 'MODAL_DIALOG',
    property: 'BACKGROUND',
    state: 'DEFAULT',
    resolvedValue: 'rgba(0, 0, 0, 0.5)'
  },
  'input.border': {
    name: 'input.border',
    semanticRef: 'border.strong',
    componentType: 'INPUT',
    property: 'BORDER',
    state: 'DEFAULT',
    resolvedValue: 'var(--alper-border-strong)'
  },
  'input.focus.ring': {
    name: 'input.focus.ring',
    semanticRef: 'focus.ring',
    componentType: 'INPUT',
    property: 'SHADOW',
    state: 'FOCUS',
    resolvedValue: '0 0 0 2px var(--alper-focus-ring)'
  }
};

// ============================================================================
// 4. TYPOGRAPHY PROFILE (Tabular Numbers & System Fallback First-Class)
// ============================================================================

export const defaultTypographyProfile: TypographyProfile = {
  familyHeading: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ],
  familyBody: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ],
  familyMono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace'
  ],
  systemFallback: true,
  numericReadability: 'TABULAR_LINING',
  variableFontSupported: true,
  performanceClass: 'LOCAL_SYSTEM'
};

// ============================================================================
// 5. MOTION TOKENS (Reduced-Motion Resilient)
// ============================================================================

export const motionTokens: Record<string, MotionToken> = {
  'motion.instant': {
    name: 'motion.instant',
    durationMs: 0,
    easing: 'linear',
    distancePx: 0,
    reducedMotionFallbackMs: 0
  },
  'motion.fast': {
    name: 'motion.fast',
    durationMs: 150,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    distancePx: 4,
    reducedMotionFallbackMs: 0
  },
  'motion.normal': {
    name: 'motion.normal',
    durationMs: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    distancePx: 8,
    reducedMotionFallbackMs: 0
  },
  'motion.slow': {
    name: 'motion.slow',
    durationMs: 400,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    distancePx: 16,
    reducedMotionFallbackMs: 0
  }
};

// ============================================================================
// 6. DEFAULT CANONICAL TOKEN ARCHITECTURE V2
// ============================================================================

export const canonicalTokensV2: TokenArchitectureV2 = {
  primitives: primitiveTokens,
  semantics: semanticTokens,
  components: componentTokens,
  typography: defaultTypographyProfile,
  motion: motionTokens
};
