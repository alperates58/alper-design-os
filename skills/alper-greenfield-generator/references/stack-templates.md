# Greenfield Multi-Stack Scaffolding Templates & Architecture

This reference outlines canonical scaffolding invariants for ALPER DESIGN OS supported stacks:

## 1. REACT_TYPESCRIPT
- Standard: Vite + React 18+ + TypeScript.
- Required Scaffold:
  - `package.json`: Includes react, react-dom, @vitejs/plugin-react, typescript, vite.
  - `vite.config.ts`: Configured with react plugin and path aliases.
  - `tsconfig.json`: Strict mode, jsx: react-jsx, moduleResolution: bundler.
  - `index.html`: Mount root `<div id="root">`.
  - `src/main.tsx`: React root rendering `App`.
  - `src/App.tsx`: Root application component using design tokens.
  - `src/styles/tokens.css`: DTCG-compliant CSS custom properties.

## 2. LARAVEL_BLADE
- Standard: Laravel 11+ Blade web application.
- Required Scaffold:
  - `composer.json`: php ^8.2, laravel/framework.
  - `routes/web.php`: Explicit web routes for each modeled page.
  - `resources/views/layouts/app.blade.php`: App shell with navigation and CSRF tokens.
  - `app/Http/Controllers/`: Grounded entity controllers.

## 3. ASPNET_RAZOR
- Standard: .NET 8 / 9 ASP.NET Core Razor Pages / MVC.
- Required Scaffold:
  - `App.csproj`: TargetFramework net8.0 or net9.0.
  - `Program.cs`: Host builder, routing, static files, anti-forgery middleware.
  - `Pages/` or `Views/`: Razor components with `@Html.AntiForgeryToken()`.

## 4. PLAIN_HTML_CSS_JS
- Standard: Zero-build, vanilla web standard layout.
- Required Scaffold:
  - `index.html`: Semantic HTML5 structure.
  - `styles.css`: Responsive CSS variables.
  - `app.js`: Vanilla DOM interactions with no external dependencies.
