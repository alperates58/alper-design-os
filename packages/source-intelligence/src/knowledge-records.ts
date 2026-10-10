import {
  DesignSystemKnowledgeRecord,
  DesignSystemKnowledgeRecordSchema,
  KnowledgeCategory
} from './types.js';

export const AUTHORITATIVE_KNOWLEDGE_RECORDS: DesignSystemKnowledgeRecord[] = [
  // 1. IBM Carbon - Tables & Density
  {
    id: 'kn-carbon-table-density',
    principle: 'Data Table Density Scaling',
    source: 'IBM Carbon Design System',
    sourceUrl: 'https://carbondesignsystem.com/components/data-table/usage/',
    category: 'tables',
    summary: 'Carbon defines 4 standard row heights: xs (24px), sm (32px), md (40px), and lg (48px). Use compact rows (xs/sm) for dense industrial telemetry and normal/tall rows (md/lg) for general administration.',
    applicability: 'Enterprise dashboards, APS systems, SCADA tables with > 20 visible rows',
    confidence: 0.98
  },
  {
    id: 'kn-carbon-modal-layering',
    principle: 'Modal & Flyout Hierarchy',
    source: 'IBM Carbon Design System',
    sourceUrl: 'https://carbondesignsystem.com/components/modal/usage/',
    category: 'layout',
    summary: 'Never stack two full dialog modals on top of each other. Use a slide-over side drawer or expandable inline accordion for sub-task details inside a primary modal.',
    applicability: 'All applications with nested configuration requirements',
    confidence: 0.95
  },

  // 2. GOV.UK - Forms & Accessibility
  {
    id: 'kn-govuk-error-summary',
    principle: 'Top-of-Page Error Summary Box',
    source: 'GOV.UK Design System',
    sourceUrl: 'https://design-system.service.gov.uk/components/error-summary/',
    category: 'forms',
    summary: 'When a form submission fails, render an error summary box at the very top of the page, immediately move focus into it with role="alert", and provide clickable anchor links directly to each invalid field.',
    applicability: 'All transactional forms across web and enterprise software',
    confidence: 0.99
  },
  {
    id: 'kn-govuk-single-question',
    principle: 'One Thing Per Page For High-Stakes Flows',
    source: 'GOV.UK Design System',
    sourceUrl: 'https://design-system.service.gov.uk/patterns/question-pages/',
    category: 'navigation',
    summary: 'For critical citizen or customer compliance flows, break intimidating multi-field forms into sequential single-question steps to minimize cognitive overload and increase completion rates.',
    applicability: 'Public sector portals, onboarding funnels, identity verification',
    confidence: 0.94
  },

  // 3. Shopify Polaris - Feedback & Merchants
  {
    id: 'kn-polaris-banner-tone',
    principle: 'Actionable Contextual Banners',
    source: 'Shopify Polaris',
    sourceUrl: 'https://polaris.shopify.com/components/feedback-indicators/banner',
    category: 'feedback',
    summary: 'Banners should explain what happened, why it matters, and provide a single clear recovery button inside the banner itself. Do not use ambiguous phrases like "An error occurred".',
    applicability: 'E-commerce, merchant portals, financial transaction consoles',
    confidence: 0.97
  },

  // 4. GitHub Primer - Developer Ergonomics & Diffs
  {
    id: 'kn-primer-color-modes',
    principle: 'Semantic Token Color Pairing',
    source: 'GitHub Primer',
    sourceUrl: 'https://primer.style/design/foundations/color',
    category: 'color',
    summary: 'Never pair hardcoded hex values across light and dark themes. Bind text and surface pairs to corresponding semantic tokens (e.g., fg.default with canvas.default, fg.muted with canvas.subtle) to guarantee accessible contrast ratios across all 6 themes.',
    applicability: 'Developer tools, multi-theme web applications, dark-mode first consoles',
    confidence: 0.99
  },

  // 5. Red Hat PatternFly - Enterprise Monitoring & Topology
  {
    id: 'kn-patternfly-topology-status',
    principle: 'Quad-Status Color + Shape Redundancy',
    source: 'Red Hat PatternFly',
    sourceUrl: 'https://www.patternfly.org/design-foundations/colors/',
    category: 'enterprise',
    summary: 'Never indicate operational status by color alone. Every critical status indicator must combine color with a distinct SVG icon shape: Green Circle (OK), Yellow Triangle (Warning), Red Exclamation Octagon (Critical), and Blue Diamond (Info).',
    applicability: 'Industrial automation, Kubernetes dashboards, plant monitoring',
    confidence: 0.99
  },

  // 6. Material Design (M3) - Responsive Motion & Touch
  {
    id: 'kn-material-touch-targets',
    principle: '48x48dp Touch Target Minimum',
    source: 'Google Material Design (M3)',
    sourceUrl: 'https://m3.material.io/foundations/accessible-design/accessibility-basics',
    category: 'accessibility',
    summary: 'All interactive elements on touch screens must measure at least 48x48 device-independent pixels with at least 8dp spacing between neighboring touch targets to prevent accidental triggers.',
    applicability: 'Mobile web, handheld rugged tablets, responsive web applications',
    confidence: 0.98
  },

  // 7. Salesforce Lightning (SLDS) - Business Path Status
  {
    id: 'kn-slds-process-path',
    principle: 'Visual Chevron Workflow Path',
    source: 'Salesforce Lightning Design System',
    sourceUrl: 'https://www.lightningdesignsystem.com/components/path/',
    category: 'navigation',
    summary: 'Display progression of a sales deal, manufacturing batch, or ticket through a horizontal chevron path with clear current, completed, and upcoming visual states.',
    applicability: 'CRM, ERP order lifecycles, manufacturing batch tracking',
    confidence: 0.93
  }
];

export class KnowledgeRecordsEngine {
  private records: DesignSystemKnowledgeRecord[] = [];

  constructor(initial: DesignSystemKnowledgeRecord[] = AUTHORITATIVE_KNOWLEDGE_RECORDS) {
    for (const rec of initial) {
      DesignSystemKnowledgeRecordSchema.parse(rec);
      this.records.push(rec);
    }
  }

  public getAll(): DesignSystemKnowledgeRecord[] {
    return [...this.records];
  }

  public getByCategory(category: KnowledgeCategory): DesignSystemKnowledgeRecord[] {
    return this.records.filter((r) => r.category === category);
  }

  public search(query: string): DesignSystemKnowledgeRecord[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return this.records.filter(
      (r) =>
        r.principle.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.applicability.toLowerCase().includes(q)
    );
  }

  public addRecord(record: DesignSystemKnowledgeRecord): void {
    DesignSystemKnowledgeRecordSchema.parse(record);
    this.records.push(record);
  }
}

export const knowledgeRecordsEngine = new KnowledgeRecordsEngine();
