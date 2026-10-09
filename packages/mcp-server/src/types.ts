import { z } from 'zod';
import {
  ProductUXProfileSchema,
  UXPatternSpecSchema,
  ProductBriefInput
} from '@alper-design-os/design-core';

// 1. analyze_project
export const AnalyzeProjectInputSchema = z.object({
  projectPath: z.string().describe('Absolute or relative path to the existing project directory to analyze')
});
export type AnalyzeProjectInput = z.infer<typeof AnalyzeProjectInputSchema>;

// 2. detect_stack
export const DetectStackInputSchema = z.object({
  projectPath: z.string().describe('Path to inspect for frameworks, languages, and build tools')
});
export type DetectStackInput = z.infer<typeof DetectStackInputSchema>;

// 3. understand_product
export const UnderstandProductInputSchema = z.object({
  productName: z.string().describe('Name of the product or system'),
  description: z.string().describe('Functional summary of the product and its users'),
  domain: z.string().optional().describe('Industry domain (e.g. Manufacturing, Fintech, ERP)'),
  targetUsers: z.array(z.string()).optional().describe('Primary user personas or roles'),
  keyFeatures: z.array(z.string()).optional().describe('Key modules or workflows needed'),
  operatingEnvironment: z.string().optional().describe('Physical or hardware context (e.g. Control Room, Factory Floor, Desk)')
});
export type UnderstandProductInput = z.infer<typeof UnderstandProductInputSchema>;

// 4. research_domain
export const ResearchDomainInputSchema = z.object({
  domainQuery: z.string().describe('Industry or niche domain to research (e.g., Finite capacity scheduling)')
});
export type ResearchDomainInput = z.infer<typeof ResearchDomainInputSchema>;

// 5. recommend_ux_patterns
export const RecommendUXPatternsInputSchema = z.object({
  profile: ProductUXProfileSchema.optional().describe('ProductUXProfile if already generated'),
  density: z.enum(['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS']).optional(),
  interactionStyle: z.enum(['KEYBOARD_FIRST', 'HYBRID_MOUSE_KEYBOARD', 'TOUCH_OPTIMIZED', 'GUIDED_WIZARD']).optional()
});
export type RecommendUXPatternsInput = z.infer<typeof RecommendUXPatternsInputSchema>;

// 6. search_design_patterns
export const SearchDesignPatternsInputSchema = z.object({
  query: z.string().describe('Search keyword for pattern (e.g., gantt, grid, split, filter)')
});
export type SearchDesignPatternsInput = z.infer<typeof SearchDesignPatternsInputSchema>;

// 7. search_components
export const SearchComponentsInputSchema = z.object({
  adapterId: z.string().optional().describe('Target adapter (react, laravel-blade, aspnet-razor, etc.)'),
  patternId: z.string().describe('UX pattern identifier to inspect')
});
export type SearchComponentsInput = z.infer<typeof SearchComponentsInputSchema>;

// 8. get_design_tokens
export const GetDesignTokensInputSchema = z.object({
  format: z.enum(['css', 'scss', 'typescript', 'tailwind-json']).default('css'),
  density: z.enum(['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS']).optional()
});
export type GetDesignTokensInput = z.infer<typeof GetDesignTokensInputSchema>;

// 9. create_design_plan
export const CreateDesignPlanInputSchema = z.object({
  mode: z.enum(['NEW', 'REPAIR', 'MODERNIZE']),
  productName: z.string(),
  adapterId: z.string(),
  briefOrProfile: z.union([UnderstandProductInputSchema, ProductUXProfileSchema])
});
export type CreateDesignPlanInput = z.infer<typeof CreateDesignPlanInputSchema>;

// 10. audit_existing_ui
export const AuditExistingUIInputSchema = z.object({
  projectPath: z.string()
});
export type AuditExistingUIInput = z.infer<typeof AuditExistingUIInputSchema>;

// 11. audit_accessibility
export const AuditAccessibilityInputSchema = z.object({
  projectPath: z.string(),
  targetLevel: z.enum(['WCAG_2_1_AA', 'WCAG_2_1_AAA']).default('WCAG_2_1_AA')
});
export type AuditAccessibilityInput = z.infer<typeof AuditAccessibilityInputSchema>;

// 12. audit_responsive
export const AuditResponsiveInputSchema = z.object({
  projectPath: z.string()
});
export type AuditResponsiveInput = z.infer<typeof AuditResponsiveInputSchema>;

// 13. recommend_modernization
export const RecommendModernizationInputSchema = z.object({
  projectPath: z.string(),
  targetAdapter: z.string().optional()
});
export type RecommendModernizationInput = z.infer<typeof RecommendModernizationInputSchema>;

// 14. search_public_apis
export const SearchPublicApisInputSchema = z.object({
  query: z.string().describe('Search query for public APIs catalog'),
  category: z.string().optional()
});
export type SearchPublicApisInput = z.infer<typeof SearchPublicApisInputSchema>;

// 15. search_mcp_servers
export const SearchMcpServersInputSchema = z.object({
  query: z.string().describe('Search query for awesome MCP servers catalog'),
  category: z.string().optional()
});
export type SearchMcpServersInput = z.infer<typeof SearchMcpServersInputSchema>;
