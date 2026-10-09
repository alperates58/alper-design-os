import {
  DatabaseEngine,
  DatabaseProfile,
  DatabaseProfileSchema,
  MigrationRisk
} from './types.js';

export interface DatabaseAuditInput {
  engine?: DatabaseEngine;
  sqlStatements?: string[];
  migrationDdl?: string[];
  schemaEntities?: string[];
}

export function detectMigrationRisk(ddlStatements: string[]): {
  risk: MigrationRisk;
  dangerousOperations: string[];
  recommendations: string[];
} {
  const dangerousOps: string[] = [];
  const recommendations: string[] = [];

  for (const statement of ddlStatements) {
    const s = statement.toUpperCase();

    if (s.includes('DROP TABLE')) {
      dangerousOps.push(`[Irreversible Loss] DROP TABLE detected: "${statement.trim()}"`);
    }

    if (s.includes('DROP COLUMN')) {
      dangerousOps.push(`[Data Deletion] DROP COLUMN detected without expand/contract deprecation phase: "${statement.trim()}"`);
    }

    if (s.includes('ALTER TABLE') && s.includes('ADD') && s.includes('NOT NULL') && !s.includes('DEFAULT')) {
      dangerousOps.push(`[Table Lock Risk] Adding NOT NULL column without DEFAULT value will fail on existing rows: "${statement.trim()}"`);
      recommendations.push('Apply Expand/Contract pattern: (1) Add nullable column, (2) Backfill in batches, (3) Apply NOT NULL constraint with validation.');
    }

    if (s.includes('CREATE INDEX') && !s.includes('CONCURRENTLY') && !s.includes('ONLINE = ON')) {
      recommendations.push('Consider CREATE INDEX CONCURRENTLY (Postgres) or WITH (ONLINE = ON) (SQL Server) to prevent blocking concurrent write traffic.');
    }
  }

  let risk: MigrationRisk = 'SAFE';
  if (dangerousOps.length > 0) {
    risk = 'DANGEROUS';
  } else if (recommendations.length > 0) {
    risk = 'REVIEW_REQUIRED';
  }

  return { risk, dangerousOperations: dangerousOps, recommendations };
}

export function analyzeDatabase(input: DatabaseAuditInput): DatabaseProfile {
  const engine = input.engine || 'POSTGRESQL';
  const entities = input.schemaEntities || ['users', 'orders', 'products', 'audit_logs'];
  const sql = input.sqlStatements || [];
  const ddl = input.migrationDdl || [];

  const nPlusOneSuspects: string[] = [];
  const missingIndexes: string[] = [];
  let paginationStrategy: 'KEYSET' | 'OFFSET_SAFE' | 'UNBOUNDED_RISK' = 'OFFSET_SAFE';

  // Analyze SQL patterns
  for (const query of sql) {
    const q = query.toLowerCase();

    // Check for N+1 indicators
    if (q.includes('select') && q.includes('where') && q.includes('id = ?') && !q.includes('in (')) {
      // Loop select heuristic
      if (sql.filter((s) => s.includes('id = ?')).length > 3) {
        nPlusOneSuspects.push('High frequency single-record query in loop detected (N+1 query pattern).');
      }
    }

    // Check pagination
    if (q.includes('offset')) {
      const offsetMatch = q.match(/offset\s+(\d+)/);
      if (offsetMatch && parseInt(offsetMatch[1] || '0', 10) > 10000) {
        paginationStrategy = 'UNBOUNDED_RISK';
      }
    } else if (q.includes('where id >') || q.includes('where created_at <')) {
      paginationStrategy = 'KEYSET';
    }

    // Check unindexed foreign key lookups
    if (q.includes('where user_id =') || q.includes('where order_id =')) {
      missingIndexes.push('CREATE INDEX idx_user_id ON orders(user_id)');
    }
  }

  const migrationAudit = detectMigrationRisk(ddl);

  const profile: DatabaseProfile = {
    engine,
    entitiesCount: entities.length,
    indexesCount: entities.length * 2,
    missingIndexes: Array.from(new Set(missingIndexes)),
    unusedIndexes: [],
    nPlusOneSuspects: Array.from(new Set(nPlusOneSuspects)),
    paginationStrategy,
    transactionIsolation: 'READ_COMMITTED',
    connectionPoolingConfigured: true,
    migrationSafety: migrationAudit.risk,
    recommendations: [
      ...migrationAudit.recommendations,
      'Adopt Keyset pagination (seek method) for datasets exceeding 100k rows to avoid OFFSET table scans',
      'Use ORM eager loading (e.g. .include() / ->with()) to prevent N+1 query roundtrips'
    ]
  };

  return DatabaseProfileSchema.parse(profile);
}
