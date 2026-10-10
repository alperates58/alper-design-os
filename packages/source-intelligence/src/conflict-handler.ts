import {
  SourceConflictRecord,
  SourceConflictRecordSchema
} from './types.js';

export const KNOWN_CONFLICTS: SourceConflictRecord[] = [
  {
    id: 'conflict-form-labels',
    sourceA: 'Material Design (M3)',
    sourceB: 'Shopify Polaris & GOV.UK',
    topic: 'Form Field Label Placement',
    difference: 'Material advocates floating/in-field placeholder labels that animate upward on focus. Polaris and GOV.UK strictly mandate persistent top-aligned static labels outside the input.',
    projectContext: 'Enterprise Data Entry & Transactional Forms',
    chosenApproach: 'Persistent Top-Aligned Static Labels (Polaris / GOV.UK style)',
    reason: 'Floating labels cause accessibility and translation issues, disappear during auto-fill, and increase cognitive load for high-stakes business forms.'
  },
  {
    id: 'conflict-table-pagination',
    sourceA: 'IBM Carbon Design System',
    sourceB: 'Consumer Modern Web (e.g. NextUI/DaisyUI)',
    topic: 'Table Pagination vs Infinite Scroll',
    difference: 'Carbon prescribes explicit server-side pagination with rows-per-page selectors and page jump inputs. Consumer systems often default to infinite scroll or click-to-load-more.',
    projectContext: 'Industrial Operational & B2B Enterprise',
    chosenApproach: 'Explicit Server-Side Pagination (Carbon style)',
    reason: 'Infinite scroll breaks keyboard navigation to the footer, prevents referencing specific row positions, and makes record counts ambiguous in audit environments.'
  },
  {
    id: 'conflict-status-color-redundancy',
    sourceA: 'Red Hat PatternFly',
    sourceB: 'Generic Web CSS Systems',
    topic: 'Status Indicator Visual Encodings',
    difference: 'Generic frameworks often rely solely on background color (green/red/yellow) badges. PatternFly strictly requires distinct icon shapes alongside colors.',
    projectContext: 'All Applications (Accessibility & Color Blindness)',
    chosenApproach: 'Color + Icon Shape Redundancy (PatternFly style)',
    reason: 'Satisfies WCAG 1.4.1 (Use of Color), guaranteeing clarity for users with deuteranopia and protanopia.'
  },
  {
    id: 'conflict-modal-layering',
    sourceA: 'IBM Carbon Design System',
    sourceB: 'Chakra UI / Generic Modals',
    topic: 'Nested Dialog Stacking',
    difference: 'Some component libraries allow stacking dialog on top of dialog. Carbon forbids multi-modal stacks, prescribing fly-out panels or drawers instead.',
    projectContext: 'Complex Multi-Entity Configurations',
    chosenApproach: 'Slide-Over Drawer for Sub-Tasks (Carbon style)',
    reason: 'Stacking modals produces severe focus trap bugs and disorients users regarding background state.'
  }
];

export class SourceConflictEngine {
  private conflicts: Map<string, SourceConflictRecord> = new Map();

  constructor(initial: SourceConflictRecord[] = KNOWN_CONFLICTS) {
    for (const c of initial) {
      SourceConflictRecordSchema.parse(c);
      this.conflicts.set(c.id, c);
    }
  }

  public getAllConflicts(): SourceConflictRecord[] {
    return Array.from(this.conflicts.values());
  }

  public findConflictForTopic(topicQuery: string): SourceConflictRecord | undefined {
    const q = topicQuery.toLowerCase().trim();
    return this.getAllConflicts().find(
      (c) =>
        c.topic.toLowerCase().includes(q) ||
        c.difference.toLowerCase().includes(q)
    );
  }

  public evaluateDesignDecision(topic: string, isEnterprise: boolean = true): {
    conflictDetected: boolean;
    record?: SourceConflictRecord;
    guidance: string;
  } {
    const matched = this.findConflictForTopic(topic);
    if (!matched) {
      return {
        conflictDetected: false,
        guidance: `No active design system conflict recorded for "${topic}". Apply standard Design Tokens and WCAG 2.1 AA contrast.`
      };
    }

    return {
      conflictDetected: true,
      record: matched,
      guidance: `Design system conflict detected between ${matched.sourceA} and ${matched.sourceB}. Recommended approach for ${isEnterprise ? 'enterprise' : 'consumer'} context: "${matched.chosenApproach}". Rationale: ${matched.reason}`
    };
  }
}

export const sourceConflictEngine = new SourceConflictEngine();
