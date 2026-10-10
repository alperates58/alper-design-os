---
name: alper-cross-stack-rendering
description: Cross-stack rendering engine compiling canonical UI blueprints into native HTML/CSS/JS, React, Laravel Blade, and ASP.NET Razor.
---

# Alper Cross-Stack Rendering Engine

## Purpose
Enforces the core principle: **No Framework Colonization**. When working in Laravel, output native Blade components. When in ASP.NET Core, output native Razor partials and Tag Helpers. When in React, produce clean TypeScript components with appropriate hooks. When framework-free, produce semantic HTML5 and vanilla JavaScript.

## Production Target Renderers
| Target Stack | Output Format | Interactivity Strategy | Dependencies |
|---|---|---|:---:|
| `html-css-js` | Semantic HTML5 + CSS Variables | Accessible Vanilla JS | 0 |
| `react-typescript` | Strict TypeScript React (.tsx) | Functional Components + Hooks | React |
| `laravel-blade` | Blade Components (`<x-ui.*>`) + Slots | Blade + Optional Alpine.js | 0 (Native) |
| `aspnet-razor` | Razor Partials (`.cshtml`) + Tag Helpers | Razor ViewModels + Vanilla JS | 0 (Native) |

## Quality Rules for All Renderers
1. Semantic HTML elements (`<button>`, `<input>`, `<dialog>`, `<table>`, `<aside>`) are mandatory.
2. Inline styles are strictly prohibited; styles must bind to canonical token CSS variables.
3. Every interactive modal or drawer must support `Escape` dismissal and focus management.
4. Mobile viewports must preserve touch target minimums (44x44px).
