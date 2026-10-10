import { InteractionContract, ComponentState } from '../types.js';

export function createButtonInteractionContract(): InteractionContract {
  return {
    triggers: [
      { event: 'CLICK', targetState: 'ACTIVE', action: 'invokePrimaryAction' },
      { event: 'HOVER', targetState: 'HOVER', action: 'highlightButton' },
      { event: 'FOCUS', targetState: 'FOCUS', action: 'showFocusRing' },
      { event: 'KEY_DOWN', targetState: 'ACTIVE', action: 'triggerViaEnterOrSpace' }
    ],
    keyboardShortcuts: [
      { key: 'Enter', action: 'ACTIVATE', description: 'Triggers primary action' },
      { key: 'Space', action: 'ACTIVATE', description: 'Triggers primary action' }
    ],
    focusManagement: {
      autoFocus: false,
      trapFocus: false,
      restoreFocus: false,
      focusVisibleRing: true
    },
    stateTransitions: [
      { from: 'DEFAULT', to: 'HOVER', trigger: 'mouseenter', durationMs: 150 },
      { from: 'HOVER', to: 'ACTIVE', trigger: 'mousedown', durationMs: 50 },
      { from: 'ACTIVE', to: 'DEFAULT', trigger: 'mouseup', durationMs: 150 }
    ]
  };
}

export function createInputInteractionContract(): InteractionContract {
  return {
    triggers: [
      { event: 'FOCUS', targetState: 'FOCUS', action: 'focusInput' },
      { event: 'VALUE_CHANGE', targetState: 'DEFAULT', action: 'validateInput' },
      { event: 'FORM_SUBMIT', targetState: 'DEFAULT', action: 'enforceRequired' }
    ],
    keyboardShortcuts: [
      { key: 'Escape', action: 'CLEAR_OR_BLUR', description: 'Clears input or exits focus' }
    ],
    focusManagement: {
      autoFocus: false,
      trapFocus: false,
      restoreFocus: false,
      focusVisibleRing: true
    },
    stateTransitions: [
      { from: 'DEFAULT', to: 'FOCUS', trigger: 'focus', durationMs: 150 },
      { from: 'FOCUS', to: 'DEFAULT', trigger: 'blur', durationMs: 150 }
    ],
    validationTrigger: 'ON_BLUR'
  };
}

export function createModalInteractionContract(): InteractionContract {
  return {
    triggers: [
      { event: 'CLICK', targetState: 'DEFAULT', action: 'closeOnBackdropOrButton' },
      { event: 'KEY_DOWN', targetState: 'DEFAULT', action: 'closeOnEscape' }
    ],
    keyboardShortcuts: [
      { key: 'Escape', action: 'CLOSE', description: 'Dismisses modal dialog' },
      { key: 'Tab', action: 'CYCLE_FOCUS', description: 'Cycles focus inside modal boundary' }
    ],
    focusManagement: {
      autoFocus: true,
      trapFocus: true,
      restoreFocus: true,
      focusVisibleRing: true
    },
    stateTransitions: [
      { from: 'DEFAULT', to: 'ACTIVE', trigger: 'open', durationMs: 250 },
      { from: 'ACTIVE', to: 'DEFAULT', trigger: 'close', durationMs: 200 }
    ]
  };
}

export function createDrawerInteractionContract(): InteractionContract {
  return {
    triggers: [
      { event: 'CLICK', targetState: 'DEFAULT', action: 'closeOnOverlay' },
      { event: 'KEY_DOWN', targetState: 'DEFAULT', action: 'closeOnEscape' }
    ],
    keyboardShortcuts: [
      { key: 'Escape', action: 'CLOSE', description: 'Dismisses drawer' }
    ],
    focusManagement: {
      autoFocus: true,
      trapFocus: true,
      restoreFocus: true,
      focusVisibleRing: true
    },
    stateTransitions: [
      { from: 'DEFAULT', to: 'ACTIVE', trigger: 'slideIn', durationMs: 250 },
      { from: 'ACTIVE', to: 'DEFAULT', trigger: 'slideOut', durationMs: 200 }
    ]
  };
}

export function createTableInteractionContract(): InteractionContract {
  return {
    triggers: [
      { event: 'CLICK', targetState: 'SELECTED', action: 'selectRow' },
      { event: 'HOVER', targetState: 'HOVER', action: 'highlightRow' },
      { event: 'KEY_DOWN', targetState: 'FOCUS', action: 'navigateRow' }
    ],
    keyboardShortcuts: [
      { key: 'ArrowDown', action: 'NEXT_ROW', description: 'Focuses next table row' },
      { key: 'ArrowUp', action: 'PREVIOUS_ROW', description: 'Focuses previous table row' },
      { key: 'Space', action: 'TOGGLE_ROW_SELECTION', description: 'Selects or deselects current row' }
    ],
    focusManagement: {
      autoFocus: false,
      trapFocus: false,
      restoreFocus: false,
      focusVisibleRing: true
    },
    stateTransitions: [
      { from: 'DEFAULT', to: 'HOVER', trigger: 'rowMouseEnter', durationMs: 100 }
    ]
  };
}
