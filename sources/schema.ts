import { z } from 'zod';

export const CatalogSourceTypeSchema = z.enum(['PUBLIC_APIS', 'AWESOME_MCP']);
export type CatalogSourceType = z.infer<typeof CatalogSourceTypeSchema>;

export const AuthTypeSchema = z.enum(['NONE', 'API_KEY', 'OAUTH2', 'BEARER', 'CUSTOM']);
export type AuthType = z.infer<typeof AuthTypeSchema>;

export const LicenseMetadataSchema = z.object({
  type: z.string(),
  url: z.string().optional(),
  commercialUseAllowed: z.boolean(),
  notes: z.string().optional()
});
export type LicenseMetadata = z.infer<typeof LicenseMetadataSchema>;

export const CatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  sourceCatalog: CatalogSourceTypeSchema,
  url: z.string().url(),
  authType: AuthTypeSchema,
  https: z.boolean(),
  cors: z.enum(['YES', 'NO', 'UNKNOWN']).optional(),
  license: LicenseMetadataSchema,
  tags: z.array(z.string()),
  capabilities: z.array(z.string()).optional(),
  transport: z.enum(['STDIO', 'SSE', 'HTTP']).optional(),
  lastVerified: z.string()
});
export type CatalogItem = z.infer<typeof CatalogItemSchema>;

export const CatalogIndexSchema = z.object({
  catalogName: z.string(),
  upstreamRepo: z.string().url(),
  version: z.string(),
  updatedAt: z.string(),
  itemCount: z.number().int().nonnegative(),
  items: z.array(CatalogItemSchema)
});
export type CatalogIndex = z.infer<typeof CatalogIndexSchema>;
