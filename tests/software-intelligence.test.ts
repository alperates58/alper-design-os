import { describe, it, expect } from 'vitest';
import {
  detectArchitectureStyle,
  analyzeArchitecture,
  createArchitectureDecisionRecord,
  analyzeDatabase,
  detectMigrationRisk,
  createObservabilityPlan,
  detectSensitiveLogging,
  createReliabilityProfile,
  analyzeApiContract,
  classifyFileCodeType,
  evaluateProductionReadiness,
  createReleaseProfile,
  ArchitectureProfileSchema,
  DatabaseProfileSchema,
  ObservabilityProfileSchema
} from '@alper-design-os/software-intelligence';

describe('Software Engineering Intelligence Layer', () => {
  describe('Architecture Intelligence', () => {
    it('detects diverse architectural patterns without forcing or hardcoding', () => {
      // 1. Hexagonal
      const hexStyle = detectArchitectureStyle({
        rootDir: '/app',
        files: [{ path: 'src/ports/user-repo.ts' }, { path: 'src/adapters/postgres.ts' }]
      });
      expect(hexStyle).toBe('HEXAGONAL');

      // 2. Microservices
      const msStyle = detectArchitectureStyle({
        rootDir: '/app',
        files: [{ path: 'docker-compose.yml' }, { path: 'services/order-service/index.ts' }]
      });
      expect(msStyle).toBe('MICROSERVICES');

      // 3. Clean Architecture
      const cleanStyle = detectArchitectureStyle({
        rootDir: '/app',
        files: [{ path: 'src/domain/entities/order.ts' }, { path: 'src/infrastructure/db.ts' }]
      });
      expect(cleanStyle).toBe('CLEAN_ARCHITECTURE');

      // 4. Layered Monolith
      const layeredStyle = detectArchitectureStyle({
        rootDir: '/app',
        files: [{ path: 'app/Http/Controllers/OrderController.php' }, { path: 'app/Models/Order.php' }]
      });
      expect(layeredStyle).toBe('LAYERED');
    });

    it('generates a typed ArchitectureProfile from project analysis', () => {
      const profile = analyzeArchitecture({
        rootDir: '/workspace',
        files: [
          { path: 'packages/auth/src/index.ts' },
          { path: 'packages/billing/src/index.ts' }
        ]
      });

      expect(ArchitectureProfileSchema.safeParse(profile).success).toBe(true);
      expect(profile.modules).toContain('auth');
      expect(profile.modules).toContain('billing');
      expect(profile.dependencyDirection).toBe('UNIDIRECTIONAL_SAFE');
    });

    it('generates an Architecture Decision Record (ADR) document', () => {
      const { adr, markdown } = createArchitectureDecisionRecord({
        title: 'Adopt PostgreSQL as Primary Relational Store',
        context: 'We require ACID transactions, JSONB indexing, and reliable keyset pagination.',
        decision: 'Use PostgreSQL 16 managed instance via connection pooler.',
        consequences: {
          positive: ['Robust transactional guarantees', 'Rich JSON indexing'],
          negative: ['Operational overhead of connection pool tuning'],
          risks: ['Connection starvation under extreme load spikes']
        }
      });

      expect(adr.id).toContain('ADR-');
      expect(adr.status).toBe('ACCEPTED');
      expect(markdown).toContain('Adopt PostgreSQL as Primary Relational Store');
      expect(markdown).toContain('ACID transactions');
    });
  });

  describe('Database Engineering & Migration Safety', () => {
    it('classifies safe vs review-required vs dangerous schema migrations', () => {
      // 1. Dangerous: DROP TABLE
      const dropTableResult = detectMigrationRisk(['DROP TABLE customers;']);
      expect(dropTableResult.risk).toBe('DANGEROUS');

      // 2. Dangerous: DROP COLUMN without expand/contract
      const dropColResult = detectMigrationRisk(['ALTER TABLE orders DROP COLUMN tracking_code;']);
      expect(dropColResult.risk).toBe('DANGEROUS');

      // 3. Dangerous / Table lock: Adding NOT NULL without DEFAULT
      const notNullResult = detectMigrationRisk(['ALTER TABLE users ADD email_verified_at TIMESTAMP NOT NULL;']);
      expect(notNullResult.risk).toBe('DANGEROUS');
      expect(notNullResult.recommendations.some((r) => r.includes('Expand/Contract'))).toBe(true);

      // 4. Safe: Standard add column with default
      const safeResult = detectMigrationRisk(['ALTER TABLE users ADD status VARCHAR(50) DEFAULT "active";']);
      expect(safeResult.risk).toBe('SAFE');
    });

    it('audits SQL statements to detect N+1 queries and suggest indexes', () => {
      const dbProfile = analyzeDatabase({
        engine: 'POSTGRESQL',
        sqlStatements: [
          'SELECT * FROM orders WHERE id = ?',
          'SELECT * FROM orders WHERE id = ?',
          'SELECT * FROM orders WHERE id = ?',
          'SELECT * FROM orders WHERE id = ?',
          'SELECT * FROM users WHERE user_id = 123'
        ]
      });

      expect(DatabaseProfileSchema.safeParse(dbProfile).success).toBe(true);
      expect(dbProfile.nPlusOneSuspects.length).toBeGreaterThan(0);
      expect(dbProfile.missingIndexes.some((idx) => idx.includes('user_id'))).toBe(true);
    });
  });

  describe('Observability & PII Redaction', () => {
    it('generates an OpenTelemetry-aligned ObservabilityProfile', () => {
      const obsPlan = createObservabilityPlan({ isDistributed: true });
      expect(ObservabilityProfileSchema.safeParse(obsPlan).success).toBe(true);
      expect(obsPlan.supportedSignals).toEqual(['TRACES', 'METRICS', 'LOGS']);
      expect(obsPlan.piiRedactionEnforced).toBe(true);
    });

    it('detects sensitive data leakage in log samples (passwords, tokens, cookies)', () => {
      const sampleWithSecret = '2026-10-09 INFO UserLoginRequest: {"username": "admin", "password": "SuperSecretPassword123"}';
      const check = detectSensitiveLogging(sampleWithSecret);
      expect(check.hasSensitiveData).toBe(true);
      expect(check.leakedFields).toContain('password');

      const cleanSample = '2026-10-09 INFO UserLoginSuccess: {"username": "admin", "userId": "usr-123"}';
      const cleanCheck = detectSensitiveLogging(cleanSample);
      expect(cleanCheck.hasSensitiveData).toBe(false);
    });
  });

  describe('Reliability, SLOs & Error Budgets', () => {
    it('creates quantitative SLI/SLO reliability profiles', () => {
      const relProfile = createReliabilityProfile({ isMissionCritical: true, targetAvailabilityPercent: 99.99 });
      expect(relProfile.isMissionCritical).toBe(true);
      const availSli = relProfile.slis.find((s) => s.type === 'AVAILABILITY');
      expect(availSli?.targetPercentage).toBe(99.99);
      expect(relProfile.errorBudgetPolicy).toContain('freezes feature releases');
    });
  });

  describe('API Governance & Contract Drift', () => {
    it('detects breaking changes between API specifications', () => {
      const prevSpec = {
        paths: {
          '/api/v1/orders': {},
          '/api/v1/customers': {}
        }
      };
      const currSpec = {
        paths: {
          '/api/v1/orders': {}
        }
      };

      const apiProfile = analyzeApiContract({
        previousSpec: prevSpec,
        currentSpec: currSpec
      });

      expect(apiProfile.hasBreakingChanges).toBe(true);
      expect(apiProfile.breakingChangesSummary.some((s) => s.includes('/api/v1/customers'))).toBe(true);
    });
  });

  describe('Code Classification Engine', () => {
    it('correctly classifies files into SOURCE, GENERATED, VENDORED, BUILD_OUTPUT, MIGRATION, CONFIGURATION', () => {
      expect(classifyFileCodeType('src/services/OrderService.ts')).toBe('SOURCE');
      expect(classifyFileCodeType('src/generated/graphql.schema.ts')).toBe('GENERATED');
      expect(classifyFileCodeType('node_modules/lodash/index.js')).toBe('VENDORED');
      expect(classifyFileCodeType('dist/bundle.js')).toBe('BUILD_OUTPUT');
      expect(classifyFileCodeType('database/migrations/20261009_create_orders.sql')).toBe('MIGRATION');
      expect(classifyFileCodeType('config/database.json')).toBe('CONFIGURATION');
    });
  });

  describe('Production Readiness (Backup vs Restore Verified)', () => {
    it('differentiates between backup plan existing and actual restore verification', () => {
      const readyProfile = evaluateProductionReadiness({ hasBackupPlan: true, isRestoreVerified: true });
      expect(readyProfile.readinessRating).toBe('READY');

      const conditionalProfile = evaluateProductionReadiness({ hasBackupPlan: true, isRestoreVerified: false });
      expect(conditionalProfile.readinessRating).toBe('CONDITIONAL');

      const notReadyProfile = evaluateProductionReadiness({ hasBackupPlan: false, isRestoreVerified: false });
      expect(notReadyProfile.readinessRating).toBe('NOT_READY');
    });
  });
});
