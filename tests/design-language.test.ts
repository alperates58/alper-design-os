import { describe, it, expect } from 'vitest';
import {
  createDesignIntent,
  computeDesignPersonality,
  resolveDensityProfile,
  canonicalTokensV2,
  generateCssVariables,
  generateTypeScriptConstants,
  generateTailwindTheme,
  generateScssVariables,
  generateDtcgJson,
  detectTokenDrift,
  canonicalComponentSet,
  canonicalButton,
  canonicalDataTable,
  canonicalModalDialog,
  createAppShellBlueprint,
  inferAppShellVariant,
  createDataManagementWorkspaceBlueprint,
  createRecipeBlueprint,
  canonicalRecipes,
  getRecipeByType,
  evaluateDesignAntiPatterns,
  HtmlCssJsRenderer,
  ReactTypeScriptRenderer,
  LaravelBladeRenderer,
  AspNetRazorRenderer,
  evaluateCrossStackParity,
  getAlperUiRegistrySummary
} from '../packages/design-language/src/index.js';

describe('Canonical Design Language & UI Blueprint DSL (Phase 1E)', () => {
  describe('1. Design Intent & Personality Engine', () => {
    it('synthesizes contextual design intent without hardcoding domain names', () => {
      const intent = createDesignIntent({
        productType: 'ENTERPRISE_INTERNAL',
        informationDensity: 'COMPACT',
        taskCriticality: 'MISSION_CRITICAL'
      });

      expect(intent.productType).toBe('ENTERPRISE_INTERNAL');
      expect(intent.informationDensity).toBe('COMPACT');
      expect(intent.taskCriticality).toBe('MISSION_CRITICAL');
      expect(intent.decisionPrinciples.length).toBeGreaterThan(0);
      expect(intent.decisionPrinciples[0]).toContain('density');
    });

    it('computes 6 quantitative personality axes correctly for dense technical tools', () => {
      const intent = createDesignIntent({
        productType: 'DEVELOPER_TOOL',
        informationDensity: 'COMPACT',
        brandCharacter: 'TECHNICAL',
        motionTolerance: 'SUBTLE'
      });

      const personality = computeDesignPersonality(intent);
      expect(personality.compactToSpacious).toBeLessThan(0); // Compact
      expect(personality.technicalToEditorial).toBeLessThan(0); // Technical
      expect(personality.staticToAnimated).toBeLessThan(0); // Restrained motion
      expect(personality.rationale).toBeDefined();
    });

    it('computes positive spacious and brand-oriented personality axes for consumer products', () => {
      const intent = createDesignIntent({
        productType: 'B2C_CONSUMER',
        informationDensity: 'SPACIOUS',
        brandCharacter: 'FRIENDLY',
        visualEmphasis: 'BRAND_FIRST'
      });

      const personality = computeDesignPersonality(intent);
      expect(personality.compactToSpacious).toBeGreaterThan(0);
      expect(personality.reservedToExpressive).toBeGreaterThan(0);
      expect(personality.neutralToBranded).toBeGreaterThan(0);
    });

    it('resolves density profiles correctly across COMPACT, COMFORTABLE, and SPACIOUS', () => {
      const compact = resolveDensityProfile('COMPACT');
      expect(compact.baseSpacingUnit).toBe(4);
      expect(compact.tableRowHeight).toBe(36);

      const comfortable = resolveDensityProfile('COMFORTABLE');
      expect(comfortable.baseSpacingUnit).toBe(8);
      expect(comfortable.tableRowHeight).toBe(48);

      const spacious = resolveDensityProfile('SPACIOUS');
      expect(spacious.baseSpacingUnit).toBe(12);
      expect(spacious.tableRowHeight).toBe(60);
    });
  });

  describe('2. Token Architecture V2 & Generators', () => {
    it('maintains 3-level token architecture with multi-theme and density support', () => {
      expect(Object.keys(canonicalTokensV2.primitives).length).toBeGreaterThan(20);
      expect(Object.keys(canonicalTokensV2.semantics).length).toBeGreaterThan(10);
      expect(Object.keys(canonicalTokensV2.components).length).toBeGreaterThan(5);

      const surfaceDefault = canonicalTokensV2.semantics['surface.default'];
      expect(surfaceDefault).toBeDefined();
      expect(surfaceDefault?.lightValue).toBe('#ffffff');
      expect(surfaceDefault?.darkValue).toBe('#111827');
      expect(surfaceDefault?.highContrastValue).toBe('#000000');
    });

    it('generates multi-theme CSS variables containing light, dark, and high-contrast rules', () => {
      const css = generateCssVariables(canonicalTokensV2);
      expect(css).toContain(':root, [data-theme="light"]');
      expect(css).toContain('[data-theme="dark"]');
      expect(css).toContain('[data-theme="high-contrast"]');
      expect(css).toContain('[data-density="compact"]');
      expect(css).toContain('--alper-action-primary: #2563eb');
      expect(css).toContain('--alper-table-row-height: 48px');
    });

    it('generates strict TypeScript constants and Tailwind theme extensions', () => {
      const tsCode = generateTypeScriptConstants(canonicalTokensV2);
      expect(tsCode).toContain('export const AlperTokens');

      const tailwindTheme: any = generateTailwindTheme(canonicalTokensV2);
      expect(tailwindTheme.theme.extend.colors['action-primary']).toBeDefined();
      expect(tailwindTheme.theme.extend.spacing['4']).toBeDefined();
    });

    it('generates SCSS variables and DTCG-compliant JSON format', () => {
      const scss = generateScssVariables(canonicalTokensV2);
      expect(scss).toContain('$alper-action-primary: var(--alper-action-primary);');

      const dtcg: any = generateDtcgJson(canonicalTokensV2);
      expect(dtcg.$description).toContain('DTCG');
      expect(dtcg.space['4'].$value).toBe('16px');
    });

    it('detects token drift, hardcoded hex colors, and magic numbers in stylesheets', () => {
      const badCss = `
        .card {
          background-color: #ff00ff;
          padding: 17px;
          margin-bottom: 23px;
        }
      `;
      const report = detectTokenDrift(badCss, 'bad-styles.css');
      expect(report.isClean).toBe(false);
      expect(report.totalFindings).toBeGreaterThanOrEqual(3);
      expect(report.findings.some((f) => f.type === 'HARDCODED_HEX_COLOR')).toBe(true);
      expect(report.findings.some((f) => f.type === 'MAGIC_SPACING_UNIT')).toBe(true);
    });
  });

  describe('3. Canonical Component Blueprints & Page DSL', () => {
    it('contains exactly 15 initial canonical component blueprints', () => {
      expect(canonicalComponentSet.length).toBe(15);
      const types = canonicalComponentSet.map((c) => c.type);
      expect(types).toContain('BUTTON');
      expect(types).toContain('INPUT');
      expect(types).toContain('SELECT');
      expect(types).toContain('CHECKBOX');
      expect(types).toContain('RADIO');
      expect(types).toContain('SWITCH');
      expect(types).toContain('BADGE');
      expect(types).toContain('ALERT');
      expect(types).toContain('CARD');
      expect(types).toContain('MODAL_DIALOG');
      expect(types).toContain('DRAWER');
      expect(types).toContain('TOOLTIP');
      expect(types).toContain('DROPDOWN_MENU');
      expect(types).toContain('DATA_TABLE');
      expect(types).toContain('FILTER_BAR');
    });

    it('ensures each canonical blueprint has interaction, responsive, and a11y contracts', () => {
      for (const comp of canonicalComponentSet) {
        expect(comp.id).toBeDefined();
        expect(comp.role).toBeDefined();
        expect(comp.variants.length).toBeGreaterThan(0);
        expect(comp.states.length).toBeGreaterThan(0);
        expect(comp.interactions).toBeDefined();
        expect(comp.responsiveBehavior).toBeDefined();
        expect(comp.accessibilityRequirements).toBeDefined();
        expect(comp.sourceReferences.length).toBeGreaterThan(0);
      }
    });

    it('infers application shell variant according to UX characteristics', () => {
      const denseIntent = createDesignIntent({ informationDensity: 'COMPACT', userExpertise: 'EXPERT' });
      expect(inferAppShellVariant(denseIntent)).toBe('ENTERPRISE_DENSE');

      const consumerIntent = createDesignIntent({ visualEmphasis: 'CONTENT_FIRST', userExpertise: 'NOVICE' });
      expect(inferAppShellVariant(consumerIntent)).toBe('CONSUMER_CONTENT');

      const saasIntent = createDesignIntent({ informationDensity: 'COMFORTABLE', userExpertise: 'INTERMEDIATE' });
      expect(inferAppShellVariant(saasIntent)).toBe('SAAS_STANDARD');
    });

    it('builds canonical test project "Data Management Workspace"', () => {
      const workspace = createDataManagementWorkspaceBlueprint();
      expect(workspace.id).toBe('data-management-workspace');
      expect(workspace.title).toBe('Data Management Workspace');
      expect(workspace.regions.length).toBe(5);

      const regionTypes = workspace.regions.map((r) => r.type);
      expect(regionTypes).toContain('PAGE_HEADER');
      expect(regionTypes).toContain('FILTER_BAR');
      expect(regionTypes).toContain('GRID_REGION');
      expect(regionTypes).toContain('STATUS_REGION');
      expect(regionTypes).toContain('DETAIL_PANEL');
    });
  });

  describe('4. Canonical UI Recipes', () => {
    it('defines 6 standard canonical UI recipes', () => {
      expect(canonicalRecipes.length).toBe(6);
      const types = canonicalRecipes.map((r) => r.type);
      expect(types).toContain('LOGIN_PAGE');
      expect(types).toContain('SETTINGS_PAGE');
      expect(types).toContain('LIST_DETAIL_PAGE');
      expect(types).toContain('DATA_MANAGEMENT_PAGE');
      expect(types).toContain('DASHBOARD_PAGE');
      expect(types).toContain('FORM_PAGE');
    });

    it('retrieves recipe by type and instantiates valid PageBlueprint', () => {
      const loginRecipe = getRecipeByType('LOGIN_PAGE');
      expect(loginRecipe).toBeDefined();
      expect(loginRecipe?.blueprint.regions.length).toBeGreaterThan(0);

      const generated = createRecipeBlueprint('SETTINGS_PAGE');
      expect(generated.title).toContain('Settings');
    });
  });

  describe('5. Design Anti-Pattern Critic', () => {
    it('detects glassmorphism and decorative gradients in compact enterprise layouts', () => {
      const badContent = `
        .panel {
          backdrop-filter: blur(10px);
          background: linear-gradient(to right, red, blue);
        }
      `;
      const intent = createDesignIntent({ productType: 'ENTERPRISE_INTERNAL', informationDensity: 'COMPACT' });
      const report = evaluateDesignAntiPatterns({ content: badContent, intent });

      expect(report.passed).toBe(false);
      expect(report.issues.some((i) => i.code === 'GLASSMORPHISM_OVERUSE')).toBe(true);
      expect(report.issues.some((i) => i.code === 'MEANINGLESS_GRADIENTS')).toBe(true);
    });

    it('detects tiny mobile touch targets and low contrast gray text', () => {
      const badContent = `
        button {
          width: 24px;
          height: 24px;
          color: #999999;
        }
      `;
      const intent = createDesignIntent({ devicePriority: 'MOBILE_FIRST' });
      const report = evaluateDesignAntiPatterns({ content: badContent, intent });

      expect(report.issues.some((i) => i.code === 'TINY_TOUCH_TARGET')).toBe(true);
      expect(report.issues.some((i) => i.code === 'LOW_CONTRAST')).toBe(true);
    });

    it('passes clean canonical blueprints with high critic scores', () => {
      const workspace = createDataManagementWorkspaceBlueprint();
      const report = evaluateDesignAntiPatterns({ blueprint: workspace });
      expect(report.passed).toBe(true);
      expect(report.criticScore).toBe(100);
    });
  });

  describe('6. Cross-Stack Target Renderers & Parity', () => {
    const workspace = createDataManagementWorkspaceBlueprint();

    it('renders production-grade semantic HTML/CSS/JS without dependencies', () => {
      const renderer = new HtmlCssJsRenderer();
      const output = renderer.renderPageBlueprint(workspace, { theme: 'DARK', density: 'COMPACT' });

      expect(output.stack).toBe('html-css-js');
      expect(output.primaryFile.path).toBe('index.html');
      expect(output.primaryFile.content).toContain('<!DOCTYPE html>');
      expect(output.primaryFile.content).toContain('data-theme="dark"');
      expect(output.primaryFile.content).toContain('data-density="compact"');
      expect(output.supportingFiles.length).toBe(3); // tokens.css, layout.css, interactions.js
      expect(output.assetMetrics.externalDependencyCount).toBe(0);
    });

    it('renders strict TypeScript React component without forced external packages', () => {
      const renderer = new ReactTypeScriptRenderer();
      const output = renderer.renderPageBlueprint(workspace);

      expect(output.stack).toBe('react-typescript');
      expect(output.primaryFile.path).toContain('.tsx');
      expect(output.primaryFile.content).toContain('import React, { useState, useCallback }');
      expect(output.primaryFile.content).toContain('role="dialog"');
      expect(output.primaryFile.content).toContain('alper-app-shell');
      expect(output.assetMetrics.externalDependencyCount).toBe(1); // React only
    });

    it('renders native Laravel Blade components without forcing React', () => {
      const renderer = new LaravelBladeRenderer();
      const output = renderer.renderPageBlueprint(workspace);

      expect(output.stack).toBe('laravel-blade');
      expect(output.primaryFile.path).toContain('.blade.php');
      expect(output.primaryFile.content).toContain("@extends('layouts.app')");
      expect(output.primaryFile.content).toContain('<x-ui.badge');
      expect(output.primaryFile.content).toContain('x-data=');
      expect(output.primaryFile.content).not.toContain('React.');
      expect(output.assetMetrics.externalDependencyCount).toBe(0);
    });

    it('renders native ASP.NET Core Razor partials without forcing client SPA frameworks', () => {
      const renderer = new AspNetRazorRenderer();
      const output = renderer.renderPageBlueprint(workspace);

      expect(output.stack).toBe('aspnet-razor');
      expect(output.primaryFile.path).toContain('.cshtml');
      expect(output.primaryFile.content).toContain('@model AlperDesignOs.ViewModels.');
      expect(output.primaryFile.content).toContain('asp-page=');
      expect(output.primaryFile.content).not.toContain('import React');
      expect(output.assetMetrics.externalDependencyCount).toBe(0);
    });

    it('evaluates cross-stack parity across HTML, React, Blade, and Razor yielding high scores', () => {
      const parity = evaluateCrossStackParity(workspace);
      expect(parity.visualParityScore).toBeGreaterThanOrEqual(90);
      expect(parity.behavioralParityScore).toBeGreaterThanOrEqual(90);
      expect(parity.accessibilityParityScore).toBeGreaterThanOrEqual(95);
      expect(parity.overallParityScore).toBeGreaterThanOrEqual(90);

      expect(parity.stackOutputs['html-css-js'].status).toBe('PASS');
      expect(parity.stackOutputs['react-typescript'].status).toBe('PASS');
      expect(parity.stackOutputs['laravel-blade'].status).toBe('PASS');
      expect(parity.stackOutputs['aspnet-razor'].status).toBe('PASS');
    });

    it('inspects Alper UI Canonical Registry summary', () => {
      const registry = getAlperUiRegistrySummary();
      expect(registry.name).toContain('Alper UI');
      expect(registry.componentsCount).toBe(15);
      expect(registry.recipesCount).toBe(6);
      expect(registry.supportedStacks).toContain('html-css-js');
      expect(registry.supportedStacks).toContain('react-typescript');
      expect(registry.supportedStacks).toContain('laravel-blade');
      expect(registry.supportedStacks).toContain('aspnet-razor');
    });
  });
});
