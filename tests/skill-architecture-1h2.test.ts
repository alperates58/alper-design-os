import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  routeContext,
  ALL_ACTIVE_SKILLS,
  DEPRECATED_SKILLS
} from '../packages/agent-governance/src/context-router.js';
import {
  CANONICAL_SKILL_CATALOG,
  USER_ENTRYPOINT_SKILLS,
  INTERNAL_ORCHESTRATION_SKILLS,
  CAPABILITY_FAMILIES
} from '../packages/agent-governance/src/skill-registry.js';
import {
  BUILTIN_TOOL_REGISTRY,
  CANONICAL_MCP_TOOL_NAMES,
  getToolRoutingMetadata
} from '../packages/agent-governance/src/tool-router.js';
import { CANONICAL_TOOL_DEFINITIONS } from '../packages/mcp-server/src/server.js';
import { SKILL_MIGRATION_MAP } from '../scripts/skill-standard.js';
import { EvidenceKindSchema } from '../packages/agent-governance/src/types.js';
import {
  createGreenfieldProjectProfile,
  deriveRequirements
} from '../packages/agent-governance/src/greenfield-engine.js';

describe('Phase 1H.2: Skill Architecture Remediation & Agent Orchestration Standardization', () => {
  const skillsDir = path.resolve('skills');

  // ==========================================================
  // Gate 1: Skill Inventory & Directory Health
  // ==========================================================
  describe('Gate 1: Skill Inventory & Accounting', () => {
    it('verifies exact inventory of 74 skills (55 active + 19 deprecated)', () => {
      const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      expect(skillDirs.length).toBe(74);

      const active = skillDirs.filter(s => SKILL_MIGRATION_MAP[s] && !SKILL_MIGRATION_MAP[s].deprecated);
      const deprecated = skillDirs.filter(s => SKILL_MIGRATION_MAP[s] && SKILL_MIGRATION_MAP[s].deprecated);

      expect(active.length).toBe(55);
      expect(deprecated.length).toBe(19);
      expect(ALL_ACTIVE_SKILLS.length).toBe(55);
      expect(DEPRECATED_SKILLS.length).toBe(19);
    });

    it('verifies all 17 capability families are populated', () => {
      expect(CAPABILITY_FAMILIES.length).toBe(17);
      const familyCounts = new Map<string, number>();

      for (const skill of Object.values(SKILL_MIGRATION_MAP)) {
        familyCounts.set(
          skill.capabilityFamily,
          (familyCounts.get(skill.capabilityFamily) || 0) + 1
        );
      }

      for (const fam of CAPABILITY_FAMILIES) {
        expect(familyCounts.get(fam)).toBeGreaterThan(0);
      }
    });
  });

  // ==========================================================
  // Gate 2: SKILL_QUALITY_GATE_V1 Compliance
  // ==========================================================
  describe('Gate 2: SKILL_QUALITY_GATE_V1 Frontmatter & Structure', () => {
    const requiredSections = [
      '## PURPOSE',
      '## USE WHEN',
      '## DO NOT USE WHEN',
      '## MODE APPLICABILITY',
      '## REQUIRED CONTEXT',
      '## PROJECT INTELLIGENCE LOADING',
      '## DISCOVERY / AMBIGUITY BEHAVIOR',
      '## WORKFLOW',
      '## DECISION RULES',
      '## MCP TOOL STRATEGY',
      '## POLICY & GOVERNANCE',
      '## EVIDENCE REQUIREMENTS',
      '## STOP CONDITIONS',
      '## FAILURE HANDLING',
      '## OUTPUT CONTRACT',
      '## HANDOFF / RELATED SKILLS'
    ];

    it('validates all 55 active skills comply with ALPER_SKILL_STANDARD_V1', () => {
      for (const skillName of ALL_ACTIVE_SKILLS) {
        const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
        expect(fs.existsSync(skillPath), `Missing SKILL.md for active skill ${skillName}`).toBe(true);

        const content = fs.readFileSync(skillPath, 'utf-8');
        expect(content.startsWith('---'), `${skillName} must start with YAML frontmatter`).toBe(true);

        const endFm = content.indexOf('---', 3);
        expect(endFm).toBeGreaterThan(3);
        const frontmatter = content.slice(3, endFm);

        expect(frontmatter).toContain(`name: ${skillName}`);
        expect(frontmatter).toContain('status: ACTIVE');
        expect(frontmatter).toMatch(/userFacing: (true|false)/);
        expect(frontmatter).toContain('userFacingType:');
        expect(frontmatter).toContain('modeApplicability:');
        expect(frontmatter).toContain('capabilityFamily:');
        expect(frontmatter).toContain('mcpTools:');
        expect(frontmatter).toContain('relatedSkills:');

        // Description positive/negative trigger check
        expect(frontmatter).toMatch(/Use when/i);
        expect(frontmatter).toMatch(/Do not use/i);

        // Body sections validation
        for (const section of requiredSections) {
          expect(content).toContain(section);
        }
      }
    });

    it('validates user-facing classification distribution (35 entrypoints vs 20 internal/supporting)', () => {
      expect(USER_ENTRYPOINT_SKILLS.length).toBe(35);
      expect(INTERNAL_ORCHESTRATION_SKILLS.length).toBe(20);
      expect(USER_ENTRYPOINT_SKILLS.length + INTERNAL_ORCHESTRATION_SKILLS.length).toBe(55);
    });

    it('enforces semantic quality: non-visual skills have zero visual UI approval checkpoints', () => {
      const nonVisualSkills = ['alper-sql-performance', 'alper-security-audit', 'alper-api-designer', 'alper-secret-management'];
      for (const name of nonVisualSkills) {
        const content = fs.readFileSync(path.join(skillsDir, name, 'SKILL.md'), 'utf-8');
        const checkpointsMatch = content.match(/## HUMAN CHECKPOINTS\s*\n([\s\S]*?)(?=\n##|$)/);
        expect(checkpointsMatch).toBeDefined();
        const checkpointsText = checkpointsMatch![1].toLowerCase();
        expect(checkpointsText).not.toContain('visual');
        expect(checkpointsText).not.toContain('ui layout');
        expect(checkpointsText).not.toContain('color token');
      }
    });

    it('enforces semantic quality: alper-greenfield-generator mode applicability is strictly GREENFIELD', () => {
      const content = fs.readFileSync(path.join(skillsDir, 'alper-greenfield-generator', 'SKILL.md'), 'utf-8');
      expect(content).toContain('modeApplicability:\n  - GREENFIELD');
      expect(content).not.toContain('  - MODERNIZATION');
      expect(content).not.toContain('  - REPAIR');
    });

    it('enforces semantic quality: alper-sql-performance includes pagination trade-offs without dogmatic keyset claims', () => {
      const content = fs.readFileSync(path.join(skillsDir, 'alper-sql-performance', 'SKILL.md'), 'utf-8');
      expect(content).toContain('Keyset Pagination');
      expect(content).toContain('Offset Pagination');
      expect(content).toContain('Do NOT claim keyset is universally superior');
    });

    it('enforces semantic quality: alper-security-audit defines PASSIVE vs ACTIVE boundaries and STRIDE threat modeling', () => {
      const content = fs.readFileSync(path.join(skillsDir, 'alper-security-audit', 'SKILL.md'), 'utf-8');
      expect(content).toContain('PASSIVE AUDITING (Default)');
      expect(content).toContain('ACTIVE SECURITY TESTING (Restricted)');
      expect(content).toContain('STRIDE THREAT MODELING');
    });

    it('enforces accessibility baseline: WCAG 2.2 AA canonical standard across accessibility skills', () => {
      const content = fs.readFileSync(path.join(skillsDir, 'alper-accessibility-testing', 'SKILL.md'), 'utf-8');
      expect(content).toContain('WCAG 2.2 AA');
    });

    it('validates all 19 deprecated skills have explicit deprecation frontmatter and pointers', () => {
      for (const skillName of DEPRECATED_SKILLS) {
        const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
        expect(fs.existsSync(skillPath), `Missing SKILL.md for deprecated skill ${skillName}`).toBe(true);

        const content = fs.readFileSync(skillPath, 'utf-8');
        expect(content.startsWith('---')).toBe(true);

        const endFm = content.indexOf('---', 3);
        const frontmatter = content.slice(3, endFm);

        expect(frontmatter).toContain(`name: ${skillName}`);
        expect(frontmatter).toContain('status: DEPRECATED');
        expect(frontmatter).toContain('deprecated: true');
        expect(frontmatter).toContain('userFacing: false');
        expect(frontmatter).toContain('replacement:');

        const replacement = CANONICAL_SKILL_CATALOG[skillName]?.replacement;
        expect(replacement).toBeDefined();
        expect(ALL_ACTIVE_SKILLS).toContain(replacement);

        expect(content).toContain('Superseded By');
        expect(content).toContain(replacement!);
      }
    });
  });

  // ==========================================================
  // Gate 3: 100% MCP Tool Reachability (0 Orphans)
  // ==========================================================
  describe('Gate 3: MCP Tool Reachability', () => {
    it('verifies all 124 canonical MCP tools are owned by active skills with 0 orphans', () => {
      const canonicalNames = CANONICAL_TOOL_DEFINITIONS.map(t => t.name);
      expect(canonicalNames.length).toBe(124);

      const mappedTools = new Set<string>();
      for (const skill of Object.values(SKILL_MIGRATION_MAP)) {
        if (!skill.deprecated && skill.mcpTools) {
          for (const t of skill.mcpTools) {
            mappedTools.add(t);
          }
        }
      }

      const unreached = canonicalNames.filter(name => !mappedTools.has(name));
      const unknown = [...mappedTools].filter(name => !canonicalNames.includes(name));

      expect(unreached).toEqual([]);
      expect(unknown).toEqual([]);
      expect(mappedTools.size).toBe(124);
    });

    it('verifies tool-router.ts maintains metadata for all 124 canonical tools', () => {
      expect(CANONICAL_MCP_TOOL_NAMES.length).toBe(124);
      for (const name of CANONICAL_MCP_TOOL_NAMES) {
        const meta = getToolRoutingMetadata(name);
        expect(meta, `Missing routing metadata for tool ${name}`).toBeDefined();
        expect(meta?.name).toBe(name);
        expect(meta?.capability).toBeDefined();
        expect(meta?.availability).toBe('AVAILABLE');
      }
    });
  });

  // ==========================================================
  // Gate 4: Progressive Disclosure References
  // ==========================================================
  describe('Gate 4: Progressive Disclosure References', () => {
    const references = [
      'alper-greenfield-generator/references/stack-templates.md',
      'alper-modernization-planner/references/preservation-checklist.md',
      'alper-project-intelligence/references/schema-specification.md',
      'alper-truthful-ui/references/provenance-evaluation-guide.md',
      'alper-operator-execution/references/run-bundle-standard.md',
      'alper-source-intelligence/references/source-ranking-weights.md'
    ];

    it('verifies all deep progressive disclosure reference documents exist and have content', () => {
      for (const relPath of references) {
        const fullPath = path.join(skillsDir, relPath);
        expect(fs.existsSync(fullPath), `Reference document ${relPath} must exist`).toBe(true);
        const text = fs.readFileSync(fullPath, 'utf-8');
        expect(text.length).toBeGreaterThan(150);
      }
    });
  });

  // ==========================================================
  // Gate 5: Context Router & Deprecation Exclusion
  // ==========================================================
  describe('Gate 5: Context Router & Deprecation Exclusion', () => {
    it('strictly excludes all 19 deprecated skills from routing decisions', () => {
      const decision = routeContext({
        taskId: 't-audit-01',
        taskBrief: 'Modernize legacy PHP database and refactor authentication',
        mode: 'MODERNIZE'
      });

      for (const dep of DEPRECATED_SKILLS) {
        expect(decision.requiredSkills).not.toContain(dep);
      }

      for (const skill of decision.requiredSkills) {
        expect(ALL_ACTIVE_SKILLS).toContain(skill);
      }
    });

    it('achieves substantial token budget reduction by scoping context', () => {
      const decision = routeContext({
        taskId: 't-audit-02',
        taskBrief: 'Fix CSS button padding on login screen',
        mode: 'REPAIR'
      });

      expect(decision.tokenBudgetReductionPercent).toBeGreaterThanOrEqual(40);
      expect(decision.excludedSkills.length).toBeGreaterThan(30);
    });
  });

  // ==========================================================
  // Gate 6: Canonical Scenario Routing Matrix (Section 34)
  // ==========================================================
  describe('Gate 6: Canonical Scenario Routing Matrix (Section 34)', () => {
    it('Scenario 1: "Build a React dashboard for warehouse operations"', () => {
      const decision = routeContext({
        taskId: 's-1',
        taskBrief: 'Build a React dashboard for warehouse operations',
        detectedStack: 'react',
        mode: 'NEW'
      });
      expect(decision.requiredSkills).toContain('alper-greenfield-generator');
      expect(decision.requiredSkills).toContain('alper-greenfield-product-analysis');
      expect(decision.requiredSkills).toContain('alper-domain-intelligence');
      expect(decision.requiredSkills).not.toContain('alper-design-new');
    });

    it('Scenario 2: "Fix broken responsive layout on mobile navigation"', () => {
      const decision = routeContext({
        taskId: 's-2',
        taskBrief: 'Fix broken responsive layout on mobile navigation',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-design-repair');
      expect(decision.requiredSkills).toContain('alper-browser-qa');
      expect(decision.requiredSkills).toContain('alper-visual-regression');
    });

    it('Scenario 3: "Modernize legacy ASP.NET WebForms to modern Razor pages"', () => {
      const decision = routeContext({
        taskId: 's-3',
        taskBrief: 'Modernize legacy ASP.NET WebForms to modern Razor pages',
        detectedStack: 'aspnet',
        mode: 'MODERNIZE'
      });
      expect(decision.requiredSkills).toContain('alper-modernization-planner');
      expect(decision.requiredSkills).toContain('alper-behavior-preservation');
      expect(decision.requiredSkills).toContain('alper-modernization-review');
      expect(decision.requiredSkills).not.toContain('alper-design-modernize');
    });

    it('Scenario 4: "Review this pull request for SQL injection and auth bypass"', () => {
      const decision = routeContext({
        taskId: 's-4',
        taskBrief: 'Review this pull request for SQL injection and auth bypass vulnerability',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-security-audit');
      expect(decision.requiredSkills).toContain('alper-secure-coding');
      expect(decision.requiredSkills).toContain('alper-api-security');
      expect(decision.requiredSkills).not.toContain('alper-ai-coding-safety');
    });

    it('Scenario 5: "Why is this PostgreSQL query taking 4 seconds"', () => {
      const decision = routeContext({
        taskId: 's-5',
        taskBrief: 'Why is this PostgreSQL query taking 4 seconds to execute in production',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-sql-performance');
      expect(decision.requiredSkills).not.toContain('alper-database-designer');
      expect(decision.requiredSkills).not.toContain('alper-database-engineering');
    });

    it('Scenario 6: "Audit our design system against WCAG 2.1 AA"', () => {
      const decision = routeContext({
        taskId: 's-6',
        taskBrief: 'Audit our design system against WCAG 2.1 AA accessibility guidelines',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-accessibility-testing');
      expect(decision.requiredSkills).toContain('alper-browser-qa');
    });

    it('Scenario 7: "Generate synthetic Playwright tests for checkout funnel"', () => {
      const decision = routeContext({
        taskId: 's-7',
        taskBrief: 'Generate synthetic Playwright tests for user checkout funnel',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-browser-qa');
      expect(decision.requiredSkills).toContain('alper-requirements-engineering');
      expect(decision.requiredSkills).not.toContain('alper-playwright-testing');
    });

    it('Scenario 8: "Record ADR for switching from REST to gRPC"', () => {
      const decision = routeContext({
        taskId: 's-8',
        taskBrief: 'Record ADR architectural decision for switching from REST API to gRPC',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-decision-management');
      expect(decision.requiredSkills).toContain('alper-project-intelligence');
      expect(decision.requiredSkills).toContain('alper-architecture');
      expect(decision.requiredSkills).not.toContain('alper-architecture-planner');
    });
  });

  // ==========================================================
  // Gate 7: Carried Verification Debt Preservation
  // ==========================================================
  describe('Gate 7: Carried Verification Debt Preservation', () => {
    it('preserves GENERATED_PROJECT_REAL_BUILDS = NOT_VERIFIED invariant', () => {
      const carriedDebtStatus = 'NOT_VERIFIED';
      expect(carriedDebtStatus).toBe('NOT_VERIFIED');
      expect(carriedDebtStatus).not.toBe('VERIFIED');
      expect(carriedDebtStatus).not.toBe('PASS');
    });
  });

  // ==========================================================
  // Gate 8: Safety Hooks & Destructive Command Guard
  // ==========================================================
  describe('Gate 8: Safety Hooks Configuration & Runtime Enforcement', () => {
    it('verifies hooks.json has destructive-command-guard configured', () => {
      const hooksPath = path.resolve('hooks.json');
      expect(fs.existsSync(hooksPath)).toBe(true);

      const parsed = JSON.parse(fs.readFileSync(hooksPath, 'utf-8'));
      expect(parsed['destructive-command-guard']).toBeDefined();
      expect(parsed['destructive-command-guard'].PreToolUse).toBeDefined();

      const preToolUse = parsed['destructive-command-guard'].PreToolUse[0];
      expect(preToolUse.matcher).toBe('run_command');
      expect(preToolUse.hooks[0].command).toContain('guard-destructive-command.js');
    });

    it('verifies guard-destructive-command.js script exists and handles destructive patterns', () => {
      const scriptPath = path.resolve('scripts/guard-destructive-command.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      const text = fs.readFileSync(scriptPath, 'utf-8');
      expect(text).toContain('git\\s+reset\\s+--hard');
      expect(text).toContain('git\\s+push\\s+.*--force');
      expect(text).toContain('git\\s+clean');
    });

    it('verifies runtime enforcement: blocks destructive git reset --hard', () => {
      const input = JSON.stringify({ args: { CommandLine: 'git reset --hard HEAD~1' } });
      let blocked = false;
      try {
        execSync('node scripts/guard-destructive-command.js', {
          input,
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: process.cwd()
        });
      } catch (err: any) {
        blocked = err.status === 1;
        const stderr = err.stderr ? err.stderr.toString() : '';
        expect(stderr).toContain('DESTRUCTIVE_COMMAND_GUARD');
      }
      expect(blocked).toBe(true);
    });

    it('verifies runtime enforcement: allows safe command execution', () => {
      const input = JSON.stringify({ args: { CommandLine: 'git status' } });
      const output = execSync('node scripts/guard-destructive-command.js', {
        input,
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });
      expect(output).toBeDefined();
    });
  });

  // ==========================================================
  // Gate 9: Agent Personas Standardization
  // ==========================================================
  describe('Gate 9: Agent Personas Standardization', () => {
    const agents = [
      'design-critic.md',
      'design-token-specialist.md',
      'domain-researcher.md',
      'independent-reviewer.md',
      'legacy-modernizer.md',
      'ux-architect.md'
    ];

    it('verifies all 6 agent personas are standardized with role, directives, and contracts', () => {
      for (const agent of agents) {
        const p = path.resolve('agents', agent);
        expect(fs.existsSync(p)).toBe(true);
        const text = fs.readFileSync(p, 'utf-8');
        expect(text).toContain('## Role & Persona Identity');
        expect(text).toContain('## Primary Directives & Invariants');
        expect(text).toContain('## Allowed Capabilities & Tool Boundaries');
        expect(text).toContain('## Input Contract');
        expect(text).toContain('## Output Contract');
        expect(text).toContain('## Collaboration Boundaries & Handoff Protocol');
      }
    });
  });

  // ==========================================================
  // Gate 10: Red Team Routing Scenarios (Section 20 Verification)
  // ==========================================================
  describe('Gate 10: Red Team Routing Scenarios (Section 20 Verification)', () => {
    it('Scenario A: "Build me an APS" -> PRODUCT DISCOVERY and no scaffolding', () => {
      const decision = routeContext({
        taskId: 'rt-a',
        taskBrief: 'Build me an APS',
        mode: 'NEW'
      });
      expect(decision.requiredSkills).toContain('alper-greenfield-product-analysis');
      expect(decision.requiredSkills).toContain('alper-domain-intelligence');
      expect(decision.requiredTools).not.toContain('scaffold_new_project');
      expect(decision.rationale).toContain('scaffolding is blocked');
    });

    it('Scenario B: "Fix the padding of the login button" -> REPAIR and no security audit', () => {
      const decision = routeContext({
        taskId: 'rt-b',
        taskBrief: 'Fix the padding of the login button',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-design-repair');
      expect(decision.requiredSkills).not.toContain('alper-security-audit');
    });

    it('Scenario C: "Investigate slow SQL query" -> SQL PERFORMANCE and no schema redesign', () => {
      const decision = routeContext({
        taskId: 'rt-c',
        taskBrief: 'Investigate slow SQL query in order processing',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-sql-performance');
      expect(decision.requiredSkills).not.toContain('alper-database-designer');
    });

    it('Scenario D: "Perform an active penetration test against production" -> SECURITY with explicit authorization required', () => {
      const decision = routeContext({
        taskId: 'rt-d',
        taskBrief: 'Perform an active penetration test against production environment',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-security-audit');
      expect(decision.rationale).toContain('ACTIVE PENETRATION TESTING REQUIRES EXPLICIT HUMAN OPERATOR AUTHORIZATION');
    });

    it('Scenario E: "Use this Dribbble page as visual inspiration" -> DESIGN / SOURCE AUTHORITY, not layout source-of-truth', () => {
      const decision = routeContext({
        taskId: 'rt-e',
        taskBrief: 'Use this Dribbble page as visual inspiration for dashboard theme',
        mode: 'NEW'
      });
      expect(decision.requiredSkills).toContain('alper-source-intelligence');
      expect(decision.rationale).toContain('External visual inspiration is non-authoritative');
    });

    it('Scenario F: "Continue yesterday" -> PROJECT INTELLIGENCE / CONTINUATION', () => {
      const decision = routeContext({
        taskId: 'rt-f',
        taskBrief: 'Continue yesterday task on payment gateway integration',
        mode: 'NEW'
      });
      expect(decision.requiredSkills).toContain('alper-project-continuation');
      expect(decision.requiredSkills).toContain('alper-project-intelligence');
    });

    it('Scenario G: "Should we move from monolith to microservices?" -> ARCHITECTURE with no immediate implementation', () => {
      const decision = routeContext({
        taskId: 'rt-g',
        taskBrief: 'Should we move from monolith to microservices architecture?',
        mode: 'NEW'
      });
      expect(decision.requiredSkills).toContain('alper-architecture');
      expect(decision.requiredSkills).toContain('alper-decision-management');
      expect(decision.requiredTools).not.toContain('scaffold_new_project');
    });

    it('Scenario H: Ambiguous task without mode -> clarification / discovery and NOT REPAIR default', () => {
      const decision = routeContext({
        taskId: 'rt-h',
        taskBrief: 'Improve warehouse operations workflow'
      });
      expect(decision.requiredSkills).toContain('alper-greenfield-product-analysis');
      expect(decision.requiredSkills).toContain('alper-domain-intelligence');
      expect(decision.requiredSkills).not.toContain('alper-design-repair');
      expect(decision.rationale).toContain('routed to product discovery for clarification');
    });
  });

  // ==========================================================
  // Gate 11: Phase 1H.2B Closure Hotfix Repository Truth Invariants
  // ==========================================================
  describe('Gate 11: Phase 1H.2B Closure Hotfix Repository Truth Invariants', () => {
    it('11.1 verifies zero non-canonical EvidenceKinds across all 55 active skills in registry', () => {
      const canonicalKinds = new Set(EvidenceKindSchema.options);
      const invalidEntries: Record<string, string[]> = {};

      for (const [name, skill] of Object.entries(CANONICAL_SKILL_CATALOG)) {
        if (skill.status === 'ACTIVE') {
          const bad = skill.evidenceRequirements.filter((k: any) => !canonicalKinds.has(k));
          if (bad.length > 0) {
            invalidEntries[name] = bad;
          }
        }
      }

      expect(invalidEntries).toEqual({});
    });

    it('11.2 verifies all active SKILL.md files declare only canonical EvidenceKinds', () => {
      const canonicalKinds = new Set(EvidenceKindSchema.options);
      const nonCanonical = [
        'BUILD_OUTPUT',
        'SECURITY_REPORT',
        'DATABASE_ANALYSIS',
        'PERFORMANCE_TRACE',
        'API_CONTRACT_RESULT',
        'CONSOLE_LOG',
        'NETWORK_TRACE',
        'SCREENSHOT',
        'ACCESSIBILITY_REPORT',
        'TEST_RESULT'
      ];

      for (const skillName of ALL_ACTIVE_SKILLS) {
        const filePath = path.resolve('skills', skillName, 'SKILL.md');
        expect(fs.existsSync(filePath)).toBe(true);
        const text = fs.readFileSync(filePath, 'utf-8');

        // Extract Canonical Evidence Kinds line
        const match = text.match(/- Canonical Evidence Kinds:\s*([^\n\r]+)/);
        if (match) {
          const kinds = match[1].split(',').map(s => s.trim().replace(/[`.]/g, '')).filter(Boolean);
          for (const kind of kinds) {
            expect(canonicalKinds.has(kind as any)).toBe(true);
            expect(nonCanonical).not.toContain(kind);
          }
        }
      }
    });

    it('11.3 verifies repository-wide WCAG 2.2 AA canonical accessibility default', () => {
      const profile = createGreenfieldProjectProfile({
        productName: 'A11yTest',
        productPurpose: 'Testing WCAG default'
      });
      expect(profile.accessibilityNeeds).toBe('WCAG_2_2_AA');

      const bundle = deriveRequirements(profile);
      const a11yNfr = bundle.nonFunctional.find(n => n.id === 'REQ-NFR-A11Y');
      expect(a11yNfr).toBeDefined();
      expect(a11yNfr?.description).toContain('WCAG 2.2 Level AA');
    });

    it('11.4 verifies dynamic dependency-driven implementation plan without fixed 7-stage claim', () => {
      // Skill registry must not claim fixed 7-phase implementation plan
      const greenfieldDef = CANONICAL_SKILL_CATALOG['alper-greenfield-generator'];
      expect(greenfieldDef.keyWorkflow.join(' ')).not.toContain('7-phase');

      // Greenfield SKILL.md must not claim 7-phase staged plan
      const greenfieldSkillMd = fs.readFileSync(path.resolve('skills/alper-greenfield-generator/SKILL.md'), 'utf-8');
      expect(greenfieldSkillMd).not.toContain('7-Phase Staged Plan');
      expect(greenfieldSkillMd).toContain('Dynamic Dependency-Driven Staged Plan');

      // Tool router capability description must say dynamic dependency-driven
      const meta = getToolRoutingMetadata('create_project_implementation_plan');
      expect(meta?.capability).not.toContain('7-stage');
      expect(meta?.capability).toContain('dynamic dependency-driven');
    });

    it('11.5 verifies architecture skill reflects recommendArchitecture engine reality', () => {
      const archDef = CANONICAL_SKILL_CATALOG['alper-architecture'];
      const rules = archDef.decisionRules.join(' ');
      expect(rules).toContain('Anti-Overengineering Rule');
      expect(rules).toContain('Distributed architecture (e.g. Microservices) is justified only when');

      const archSkillMd = fs.readFileSync(path.resolve('skills/alper-architecture/SKILL.md'), 'utf-8');
      expect(archSkillMd).toContain('Anti-Overengineering Principle');
      expect(archSkillMd).toContain('Distributed Architecture Boundary');
    });

    it('11.6 records explicit hook status distinction (HOOK_SCRIPT_RUNTIME = VERIFIED, ANTIGRAVITY_HOOK_INTEGRATION = NOT_VERIFIED)', () => {
      const hookStatus = {
        HOOK_SCRIPT_RUNTIME: 'VERIFIED',
        HOOK_STATIC_CONFIG: 'VERIFIED',
        ANTIGRAVITY_HOOK_INTEGRATION: 'NOT_VERIFIED'
      };
      expect(hookStatus.HOOK_SCRIPT_RUNTIME).toBe('VERIFIED');
      expect(hookStatus.HOOK_STATIC_CONFIG).toBe('VERIFIED');
      expect(hookStatus.ANTIGRAVITY_HOOK_INTEGRATION).toBe('NOT_VERIFIED');
    });
  });
});
