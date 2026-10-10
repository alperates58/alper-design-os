import { AccessibilityContract } from '../types.js';

export function createAccessibilityContract(
  role: string,
  accessibleNameStrategy: 'LABEL_ELEMENT' | 'ARIA_LABEL' | 'ARIA_LABELLEDBY' | 'INNER_TEXT',
  overrides?: Partial<AccessibilityContract>
): AccessibilityContract {
  return {
    semanticRole: role,
    accessibleNameStrategy,
    keyboardInteraction: ['Tab', 'Enter', 'Space'],
    focusBehavior: {
      focusable: true,
      tabIndex: 0
    },
    focusRestoration: false,
    ariaRequirements: [],
    wcagLevel: 'AA',
    ...overrides
  };
}

export function createButtonA11yContract(): AccessibilityContract {
  return createAccessibilityContract('button', 'INNER_TEXT', {
    keyboardInteraction: ['Enter', 'Space'],
    ariaRequirements: [
      { attribute: 'aria-disabled', valueDescription: 'true when button is disabled but focusable', required: false },
      { attribute: 'aria-busy', valueDescription: 'true when in LOADING state', required: false }
    ]
  });
}

export function createDialogA11yContract(): AccessibilityContract {
  return createAccessibilityContract('dialog', 'ARIA_LABELLEDBY', {
    keyboardInteraction: ['Escape to close', 'Tab to cycle within modal'],
    focusBehavior: {
      focusable: true,
      autoFocus: true
    },
    focusRestoration: true,
    ariaRequirements: [
      { attribute: 'aria-modal', valueDescription: '"true"', required: true },
      { attribute: 'aria-labelledby', valueDescription: 'ID of dialog title heading', required: true },
      { attribute: 'aria-describedby', valueDescription: 'ID of dialog body description', required: false }
    ]
  });
}

export function createTableA11yContract(): AccessibilityContract {
  return createAccessibilityContract('table', 'ARIA_LABEL', {
    keyboardInteraction: ['Arrow keys for cell navigation', 'Space for row select'],
    focusBehavior: {
      focusable: true,
      tabIndex: 0
    },
    ariaRequirements: [
      { attribute: 'aria-rowcount', valueDescription: 'Total number of dataset rows', required: false },
      { attribute: 'aria-colcount', valueDescription: 'Total number of dataset columns', required: false },
      { attribute: 'aria-selected', valueDescription: 'true on active/selected row tr elements', required: false }
    ]
  });
}
