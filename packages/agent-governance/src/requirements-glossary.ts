/**
 * Requirements & Shared Vocabulary Engine V2
 * Maintains canonical project glossary, detects material ambiguity,
 * tracks provenance of decisions (USER_EXPLICIT vs AGENT_INFERRED),
 * and prevents repetitive questioning across long agent sessions.
 */

export interface CanonicalGlossaryTerm {
  term: string;
  definition: string;
  avoidSynonyms: string[];
  provenance: 'USER_EXPLICIT' | 'AGENT_INFERRED' | 'CANONICAL_SPEC';
  decisionTimestamp: string;
  sourceContext?: string;
}

export interface CanonicalDecisionRecord {
  id: string;
  topic: string;
  selectedOption: string;
  alternativesConsidered: string[];
  rationale: string;
  provenance: 'USER_EXPLICIT' | 'AGENT_INFERRED';
  status: 'ACTIVE' | 'SUPERSEDED';
}

export interface AmbiguityDetectionResult {
  hasMaterialAmbiguity: boolean;
  ambiguousTermsFound: Array<{
    term: string;
    conflictingInterpretations: string[];
    suggestedResolution: string;
  }>;
  unresolvedQuestions: string[];
}

export class RequirementsGlossaryEngine {
  private glossary: Map<string, CanonicalGlossaryTerm> = new Map();
  private decisions: CanonicalDecisionRecord[] = [];

  constructor() {
    this.seedCanonicalDefaults();
  }

  private seedCanonicalDefaults(): void {
    this.addTerm({
      term: 'Issue',
      definition: 'A single tracked unit of work in the issue tracker (bug, task, spec).',
      avoidSynonyms: ['ticket', 'backlog item'],
      provenance: 'CANONICAL_SPEC',
      decisionTimestamp: new Date().toISOString()
    });

    this.addTerm({
      term: 'Design Direction',
      definition: 'A typed aesthetic and layout profile selected from one of the 9 canonical profiles with explicit reasoning.',
      avoidSynonyms: ['theme', 'skin', 'look and feel'],
      provenance: 'CANONICAL_SPEC',
      decisionTimestamp: new Date().toISOString()
    });

    this.addTerm({
      term: 'Preservation Contract',
      definition: 'Machine-readable invariants covering routes, APIs, user actions, and DB behavior that must remain unbroken.',
      avoidSynonyms: ['backward compatibility', 'regression checklist'],
      provenance: 'CANONICAL_SPEC',
      decisionTimestamp: new Date().toISOString()
    });
  }

  public addTerm(term: CanonicalGlossaryTerm): void {
    this.glossary.set(term.term.toLowerCase(), term);
  }

  public getTerm(term: string): CanonicalGlossaryTerm | undefined {
    return this.glossary.get(term.toLowerCase());
  }

  public listTerms(): CanonicalGlossaryTerm[] {
    return Array.from(this.glossary.values());
  }

  public recordDecision(decision: Omit<CanonicalDecisionRecord, 'id' | 'status'>): CanonicalDecisionRecord {
    const record: CanonicalDecisionRecord = {
      ...decision,
      id: `DEC-${this.decisions.length + 1}`,
      status: 'ACTIVE'
    };
    this.decisions.push(record);
    return record;
  }

  public listDecisions(): CanonicalDecisionRecord[] {
    return [...this.decisions];
  }

  /**
   * Scans a prompt or user brief to detect ambiguous or overloaded domain terms.
   */
  public detectAmbiguity(brief: string): AmbiguityDetectionResult {
    const lower = brief.toLowerCase();
    const found: AmbiguityDetectionResult['ambiguousTermsFound'] = [];
    const questions: string[] = [];

    // Check for overloaded terms
    if (/\bbacklog\b/i.test(lower)) {
      found.push({
        term: 'backlog',
        conflictingInterpretations: ['The project management tool itself', 'The queue of pending issues'],
        suggestedResolution: 'Use "Issue Tracker" for the tool and "Pending Issues" for unstarted items.'
      });
    }

    if (/\bticket\b/i.test(lower)) {
      found.push({
        term: 'ticket',
        conflictingInterpretations: ['Customer support ticket', 'Implementation task / Issue', 'Decision ticket'],
        suggestedResolution: 'Clarify whether this refers to a support ticket or a development Issue.'
      });
    }

    if (/\badmin\b/i.test(lower) && !/\b(role|dashboard|panel)\b/i.test(lower)) {
      found.push({
        term: 'admin',
        conflictingInterpretations: ['System superuser role', 'Administrative backoffice UI'],
        suggestedResolution: 'Specify whether "admin" refers to user authorization role or administrative console layout.'
      });
    }

    return {
      hasMaterialAmbiguity: found.length > 0,
      ambiguousTermsFound: found,
      unresolvedQuestions: questions
    };
  }

  /**
   * Exports canonical GLOSSARY.md markdown content.
   */
  public exportMarkdownGlossary(): string {
    let md = '# Canonical Project Glossary & Shared Vocabulary\n\n';
    md += '| Term | Definition | Avoid / Deprecated | Provenance |\n';
    md += '|---|---|---|---|\n';

    for (const term of this.glossary.values()) {
      md += `| **${term.term}** | ${term.definition} | \`${term.avoidSynonyms.join('`, `') || 'None'}\` | ${term.provenance} |\n`;
    }

    if (this.decisions.length > 0) {
      md += '\n## Recorded Architectural Decisions\n\n';
      for (const dec of this.decisions) {
        md += `### ${dec.id}: ${dec.topic} (${dec.provenance})\n`;
        md += `- **Selected:** ${dec.selectedOption}\n`;
        md += `- **Rationale:** ${dec.rationale}\n\n`;
      }
    }

    return md;
  }
}
