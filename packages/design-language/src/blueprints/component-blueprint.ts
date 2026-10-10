import { ComponentBlueprint, ComponentType, DensityMode, ComponentState } from '../types.js';
import { createButtonInteractionContract } from '../contracts/interaction-contract.js';
import { createResponsiveContract } from '../contracts/responsive-contract.js';
import { createButtonA11yContract } from '../contracts/accessibility-contract.js';

export function createComponentBlueprint(
  id: string,
  type: ComponentType,
  overrides?: Partial<ComponentBlueprint>
): ComponentBlueprint {
  return {
    id,
    type,
    role: type.toLowerCase(),
    intent: `Canonical UI element for ${type.toLowerCase()} interactions.`,
    variants: ['default', 'primary', 'secondary', 'outline', 'ghost'],
    states: ['DEFAULT', 'HOVER', 'FOCUS', 'ACTIVE', 'DISABLED'],
    size: 'MD',
    density: 'COMFORTABLE',
    contentModel: {
      slots: [{ name: 'children', type: 'node', required: true, description: 'Content rendered inside the component.' }],
      props: [{ name: 'disabled', type: 'boolean', defaultValue: false, required: false }]
    },
    tokens: {
      background: 'action.primary',
      text: 'text.inverse',
      border: 'border.subtle'
    },
    interactions: createButtonInteractionContract(),
    keyboardBehavior: ['Enter or Space to activate'],
    responsiveBehavior: createResponsiveContract(),
    accessibilityRequirements: createButtonA11yContract(),
    sourceReferences: [
      { sourceName: 'WAI-ARIA 1.2 Practices', mode: 'REFERENCE', notes: 'Accessible role and keyboard pattern' },
      { sourceName: 'Carbon Design System', mode: 'KNOWLEDGE', notes: 'Interaction state choreography and sizing' }
    ],
    implementationHints: [
      'Render with semantic native HTML element whenever possible.',
      'Ensure 2px visible focus ring for keyboard navigation.'
    ],
    ...overrides
  };
}
