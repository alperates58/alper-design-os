import { TargetRenderer, RenderOptions, TokenRenderOptions } from './contract.js';
import {
  PageBlueprint,
  ComponentBlueprint,
  InteractionContract,
  AccessibilityContract,
  RendererOutput,
  TargetStack
} from '../types.js';
import { canonicalTokensV2 } from '../tokens-v2/definitions.js';
import { generateCssVariables } from '../tokens-v2/generators.js';

export class LaravelBladeRenderer implements TargetRenderer {
  readonly stack: TargetStack = 'laravel-blade';
  readonly name = 'Laravel Blade Renderer';
  readonly description = 'Native Laravel Blade components with slots, attribute bags, CSS variables, and optional lightweight Alpine.js interactivity.';

  renderPageBlueprint(blueprint: PageBlueprint, options: RenderOptions = {}): RendererOutput {
    const theme = options.theme || 'LIGHT';
    const density = options.density || blueprint.density.mode;

    const bladeTemplate = `@extends('layouts.app')

@section('title', '${blueprint.title}')

@section('content')
<div class="alper-app-shell alper-shell-enterprise" data-theme="${theme.toLowerCase()}" data-density="${density.toLowerCase()}" x-data="{ selectedRecord: null, isModalOpen: false, filterQuery: '' }">
    <!-- Sidebar Navigation -->
    <aside class="alper-sidebar" aria-label="{{ __('Main Navigation') }}">
        <div class="alper-brand">Alper Design OS</div>
        <nav class="alper-nav">
            <ul class="alper-nav-list">
                <li class="alper-nav-item active"><a href="{{ route('overview') }}" class="alper-nav-link">{{ __('Overview') }}</a></li>
                <li class="alper-nav-item"><a href="{{ route('records') }}" class="alper-nav-link">{{ __('Records') }}</a></li>
                <li class="alper-nav-item"><a href="{{ route('reports') }}" class="alper-nav-link">{{ __('Reports') }}</a></li>
                <li class="alper-nav-item"><a href="{{ route('settings') }}" class="alper-nav-link">{{ __('Settings') }}</a></li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="alper-main-content" id="main-content">
        <header class="alper-page-header">
            <h1 class="alper-page-title">${blueprint.title}</h1>
            <p class="alper-page-desc">${blueprint.description}</p>
        </header>

        <!-- Filter Bar -->
        <section class="alper-region" aria-label="{{ __('Filter records') }}">
            <div class="alper-filter-bar">
                <input
                    type="text"
                    class="alper-input"
                    placeholder="{{ __('Filter by keyword...') }}"
                    x-model="filterQuery"
                    aria-label="{{ __('Filter records') }}"
                />
                <button
                    type="button"
                    class="alper-btn alper-btn-primary"
                    @click="isModalOpen = true"
                >
                    {{ __('Bulk Action') }}
                </button>
            </div>
        </section>

        <!-- Dense Data Table Component -->
        <section class="alper-region" aria-label="{{ __('Records Table') }}">
            <div class="alper-table-container">
                <table class="alper-table" aria-label="{{ __('Data Table') }}">
                    <thead>
                        <tr>
                            <th scope="col">{{ __('ID') }}</th>
                            <th scope="col">{{ __('Title') }}</th>
                            <th scope="col">{{ __('Status') }}</th>
                            <th scope="col">{{ __('Timestamp') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($records ?? [] as $record)
                            <tr
                                :class="{ 'alper-row-selected': selectedRecord === '{{ $record->id }}' }"
                                @click="selectedRecord = '{{ $record->id }}'"
                                tabindex="0"
                            >
                                <td>{{ $record->id }}</td>
                                <td>{{ $record->title }}</td>
                                <td>
                                    <x-ui.badge :status="$record->status">
                                        {{ $record->status }}
                                    </x-ui.badge>
                                </td>
                                <td>{{ $record->created_at }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="alper-text-muted" style="text-align: center; padding: 24px;">
                                    {{ __('No records found.') }}
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Detail Drawer -->
        <div
            class="alper-drawer-backdrop"
            x-show="selectedRecord !== null"
            x-cloak
            aria-label="{{ __('Record Details') }}"
        >
            <aside class="alper-drawer-panel">
                <h3>{{ __('Record Details') }}</h3>
                <p>{{ __('Selected ID:') }} <strong x-text="selectedRecord"></strong></p>
                <button
                    type="button"
                    class="alper-btn alper-btn-secondary"
                    @click="selectedRecord = null"
                >
                    {{ __('Close') }}
                </button>
            </aside>
        </div>

        <!-- Modal Dialog -->
        <div
            class="alper-modal-backdrop"
            x-show="isModalOpen"
            x-cloak
            role="dialog"
            aria-modal="true"
        >
            <div class="alper-modal-card">
                <h3>{{ __('Confirm Bulk Action') }}</h3>
                <p>{{ __('Are you sure you want to execute operations on selected dataset records?') }}</p>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button type="button" class="alper-btn alper-btn-primary" @click="isModalOpen = false">{{ __('Confirm') }}</button>
                    <button type="button" class="alper-btn alper-btn-secondary" @click="isModalOpen = false">{{ __('Cancel') }}</button>
                </div>
            </div>
        </div>
    </main>
</div>
@endsection
`;

    const buttonComponent = `@props(['variant' => 'primary', 'type' => 'button', 'disabled' => false])

<button
    type="{{ $type }}"
    {{ $disabled ? 'disabled' : '' }}
    {{ $attributes->merge(['class' => 'alper-btn alper-btn-' . $variant]) }}
>
    {{ $slot }}
</button>
`;

    const badgeComponent = `@props(['status' => 'default'])

@php
    $classMap = [
        'Healthy' => 'alper-badge-success',
        'Warning' => 'alper-badge-warning',
        'Critical' => 'alper-badge-critical',
        'default' => ''
    ];
    $statusClass = $classMap[$status] ?? '';
@endphp

<span {{ $attributes->merge(['class' => 'alper-badge ' . $statusClass]) }}>
    {{ $slot }}
</span>
`;

    const tokensCss = generateCssVariables(canonicalTokensV2);

    return {
      stack: this.stack,
      primaryFile: {
        path: 'resources/views/pages/data-management-workspace.blade.php',
        content: bladeTemplate,
        language: 'php'
      },
      supportingFiles: [
        { path: 'resources/views/components/ui/button.blade.php', content: buttonComponent, language: 'php' },
        { path: 'resources/views/components/ui/badge.blade.php', content: badgeComponent, language: 'php' },
        { path: 'public/css/alper-tokens.css', content: tokensCss, language: 'css' }
      ],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(bladeTemplate),
        cssBytes: Buffer.byteLength(tokensCss),
        jsBytes: 0,
        externalDependencyCount: 0
      }
    };
  }

  renderComponentBlueprint(blueprint: ComponentBlueprint, options: RenderOptions = {}): RendererOutput {
    const bladeComponent = `@props(['variant' => 'primary', 'disabled' => false])

<button
    type="button"
    {{ $disabled ? 'disabled' : '' }}
    {{ $attributes->merge(['class' => 'alper-btn alper-btn-' . $variant]) }}
    aria-label="Action"
>
    {{ $slot->isEmpty() ? '${blueprint.role}' : $slot }}
</button>
`;

    return {
      stack: this.stack,
      primaryFile: {
        path: `resources/views/components/ui/${blueprint.type.toLowerCase().replace(/_/g, '-')}.blade.php`,
        content: bladeComponent,
        language: 'php'
      },
      supportingFiles: [],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(bladeComponent),
        cssBytes: 0,
        jsBytes: 0,
        externalDependencyCount: 0
      }
    };
  }

  renderTokens(options: TokenRenderOptions = {}): RendererOutput {
    const css = generateCssVariables(canonicalTokensV2);
    return {
      stack: this.stack,
      primaryFile: { path: 'public/css/tokens.css', content: css, language: 'css' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: Buffer.byteLength(css), jsBytes: 0, externalDependencyCount: 0 }
    };
  }

  renderInteractionContract(contract: InteractionContract): RendererOutput {
    const phpComment = `<?php\n// Blade Interaction Contract\nreturn ${JSON.stringify(contract, null, 2)};`;
    return {
      stack: this.stack,
      primaryFile: { path: 'config/alper_interactions.php', content: phpComment, language: 'php' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: 0, externalDependencyCount: 0 }
    };
  }

  renderAccessibilityContract(contract: AccessibilityContract): RendererOutput {
    const json = JSON.stringify(contract, null, 2);
    return {
      stack: this.stack,
      primaryFile: { path: 'config/alper_a11y.json', content: json, language: 'json' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: 0, externalDependencyCount: 0 }
    };
  }
}
