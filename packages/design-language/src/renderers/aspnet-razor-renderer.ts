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

export class AspNetRazorRenderer implements TargetRenderer {
  readonly stack: TargetStack = 'aspnet-razor';
  readonly name = 'ASP.NET Core Razor Renderer';
  readonly description = 'Native ASP.NET Core Razor partials, ViewComponents, and Tag Helpers without forced JavaScript SPA overhead.';

  renderPageBlueprint(blueprint: PageBlueprint, options: RenderOptions = {}): RendererOutput {
    const theme = options.theme || 'LIGHT';
    const density = options.density || blueprint.density.mode;

    const razorView = `@model AlperDesignOs.ViewModels.DataManagementWorkspaceViewModel
@{
    ViewData["Title"] = "${blueprint.title}";
    Layout = "_Layout";
}

<div class="alper-app-shell alper-shell-enterprise" data-theme="${theme.toLowerCase()}" data-density="${density.toLowerCase()}">
    <!-- Sidebar Navigation -->
    <aside class="alper-sidebar" aria-label="Main Navigation">
        <div class="alper-brand">Alper Design OS</div>
        <nav class="alper-nav">
            <ul class="alper-nav-list">
                <li class="alper-nav-item active"><a asp-page="/Overview" class="alper-nav-link">Overview</a></li>
                <li class="alper-nav-item"><a asp-page="/Records" class="alper-nav-link">Records</a></li>
                <li class="alper-nav-item"><a asp-page="/Reports" class="alper-nav-link">Reports</a></li>
                <li class="alper-nav-item"><a asp-page="/Settings" class="alper-nav-link">Settings</a></li>
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
        <section class="alper-region" aria-label="Filter records">
            <form method="get" class="alper-filter-bar">
                <input
                    type="text"
                    name="query"
                    value="@Model.SearchQuery"
                    class="alper-input"
                    placeholder="Filter records..."
                    aria-label="Filter records"
                />
                <button type="submit" class="alper-btn alper-btn-secondary">Search</button>
                <button type="button" class="alper-btn alper-btn-primary" data-bs-toggle="modal" data-bs-target="#bulkModal">
                    Bulk Action
                </button>
            </form>
        </section>

        <!-- Dense Data Table -->
        <section class="alper-region" aria-label="Records Table">
            <div class="alper-table-container">
                <table class="alper-table" aria-label="Data Table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Status</th>
                            <th scope="col">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if (Model.Records != null && Model.Records.Any())
                        {
                            @foreach (var record in Model.Records)
                            {
                                <tr onclick="openRecordDetail('@record.Id')" tabindex="0">
                                    <td>@record.Id</td>
                                    <td>@record.Title</td>
                                    <td>
                                        <span class="alper-badge @(record.Status == "Warning" ? "alper-badge-warning" : "alper-badge-success")">
                                            @record.Status
                                        </span>
                                    </td>
                                    <td>@record.Timestamp.ToString("yyyy-MM-dd HH:mm")</td>
                                </tr>
                            }
                        }
                        else
                        {
                            <tr>
                                <td colspan="4" class="alper-text-muted" style="text-align: center; padding: 24px;">
                                    No records available in this view.
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Detail Drawer Partial -->
        <div id="recordDetailDrawer" class="alper-drawer-backdrop" style="display:none;" aria-label="Record Details">
            <aside class="alper-drawer-panel">
                <h3>Record Details</h3>
                <p id="drawerRecordId">Selected ID: -</p>
                <button type="button" class="alper-btn alper-btn-secondary" onclick="closeRecordDetail()">Close</button>
            </aside>
        </div>

        <!-- Confirmation Modal -->
        <div id="bulkModal" class="alper-modal-backdrop" style="display:none;" role="dialog" aria-modal="true">
            <div class="alper-modal-card">
                <h3>Confirm Bulk Operation</h3>
                <p>Are you sure you want to execute operations on selected dataset records?</p>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button type="button" class="alper-btn alper-btn-primary" onclick="confirmBulkAction()">Confirm</button>
                    <button type="button" class="alper-btn alper-btn-secondary" onclick="closeBulkModal()">Cancel</button>
                </div>
            </div>
        </div>
    </main>
</div>

<script>
    function openRecordDetail(id) {
        document.getElementById('drawerRecordId').innerText = 'Selected ID: ' + id;
        document.getElementById('recordDetailDrawer').style.display = 'flex';
    }
    function closeRecordDetail() {
        document.getElementById('recordDetailDrawer').style.display = 'none';
    }
    function closeBulkModal() {
        document.getElementById('bulkModal').style.display = 'none';
    }
    function confirmBulkAction() {
        closeBulkModal();
    }
</script>
`;

    const viewModelCode = `namespace AlperDesignOs.ViewModels;

public class DataManagementWorkspaceViewModel
{
    public string SearchQuery { get; set; } = string.Empty;
    public List<RecordItemDto> Records { get; set; } = new();
}

public class RecordItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = "Healthy";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
`;

    const tokensCss = generateCssVariables(canonicalTokensV2);

    return {
      stack: this.stack,
      primaryFile: {
        path: 'Pages/DataManagementWorkspace.cshtml',
        content: razorView,
        language: 'csharp'
      },
      supportingFiles: [
        { path: 'ViewModels/DataManagementWorkspaceViewModel.cs', content: viewModelCode, language: 'csharp' },
        { path: 'wwwroot/css/alper-tokens.css', content: tokensCss, language: 'css' }
      ],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(razorView),
        cssBytes: Buffer.byteLength(tokensCss),
        jsBytes: 0,
        externalDependencyCount: 0
      }
    };
  }

  renderComponentBlueprint(blueprint: ComponentBlueprint, options: RenderOptions = {}): RendererOutput {
    const razorComponent = `@model AlperDesignOs.Components.ButtonModel

<button
    type="@(Model.Type ?? "button")"
    class="alper-btn alper-btn-@(Model.Variant ?? "primary") @Model.ExtraClass"
    disabled="@Model.Disabled"
    aria-label="Action"
>
    @Model.Text
</button>
`;

    return {
      stack: this.stack,
      primaryFile: {
        path: `Pages/Shared/Components/_${blueprint.type}.cshtml`,
        content: razorComponent,
        language: 'csharp'
      },
      supportingFiles: [],
      assetMetrics: {
        htmlBytes: Buffer.byteLength(razorComponent),
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
      primaryFile: { path: 'wwwroot/css/tokens.css', content: css, language: 'css' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: Buffer.byteLength(css), jsBytes: 0, externalDependencyCount: 0 }
    };
  }

  renderInteractionContract(contract: InteractionContract): RendererOutput {
    const json = JSON.stringify(contract, null, 2);
    return {
      stack: this.stack,
      primaryFile: { path: 'wwwroot/js/alper_interactions.json', content: json, language: 'json' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: 0, externalDependencyCount: 0 }
    };
  }

  renderAccessibilityContract(contract: AccessibilityContract): RendererOutput {
    const json = JSON.stringify(contract, null, 2);
    return {
      stack: this.stack,
      primaryFile: { path: 'wwwroot/js/alper_a11y.json', content: json, language: 'json' },
      supportingFiles: [],
      assetMetrics: { htmlBytes: 0, cssBytes: 0, jsBytes: 0, externalDependencyCount: 0 }
    };
  }
}
