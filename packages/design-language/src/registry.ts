export interface AlperUiRegistryCatalog {
  name: string;
  version: string;
  componentsCount: number;
  recipesCount: number;
  supportedStacks: string[];
  components: Array<{ id: string; type: string; role: string; density: string }>;
  recipes: Array<{ id: string; type: string; title: string }>;
}

export function getAlperUiRegistrySummary(): AlperUiRegistryCatalog {
  return {
    name: 'Alper UI Canonical Registry',
    version: '1.0.0',
    componentsCount: 15,
    recipesCount: 6,
    supportedStacks: ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor'],
    components: [
      { id: 'canonical-button', type: 'BUTTON', role: 'button', density: 'COMFORTABLE' },
      { id: 'canonical-input', type: 'INPUT', role: 'textbox', density: 'COMFORTABLE' },
      { id: 'canonical-select', type: 'SELECT', role: 'combobox', density: 'COMFORTABLE' },
      { id: 'canonical-checkbox', type: 'CHECKBOX', role: 'checkbox', density: 'COMFORTABLE' },
      { id: 'canonical-radio', type: 'RADIO', role: 'radio', density: 'COMFORTABLE' },
      { id: 'canonical-switch', type: 'SWITCH', role: 'switch', density: 'COMFORTABLE' },
      { id: 'canonical-badge', type: 'BADGE', role: 'status', density: 'COMPACT' },
      { id: 'canonical-alert', type: 'ALERT', role: 'alert', density: 'COMFORTABLE' },
      { id: 'canonical-card', type: 'CARD', role: 'region', density: 'COMFORTABLE' },
      { id: 'canonical-modal-dialog', type: 'MODAL_DIALOG', role: 'dialog', density: 'COMFORTABLE' },
      { id: 'canonical-drawer', type: 'DRAWER', role: 'complementary', density: 'COMFORTABLE' },
      { id: 'canonical-tooltip', type: 'TOOLTIP', role: 'tooltip', density: 'COMPACT' },
      { id: 'canonical-dropdown-menu', type: 'DROPDOWN_MENU', role: 'menu', density: 'COMFORTABLE' },
      { id: 'canonical-data-table', type: 'DATA_TABLE', role: 'table', density: 'COMPACT' },
      { id: 'canonical-filter-bar', type: 'FILTER_BAR', role: 'search', density: 'COMPACT' }
    ],
    recipes: [
      { id: 'recipe-login-page', type: 'LOGIN_PAGE', title: 'Sign In to Workspace' },
      { id: 'recipe-settings-page', type: 'SETTINGS_PAGE', title: 'Account & Workspace Settings' },
      { id: 'recipe-list-detail-page', type: 'LIST_DETAIL_PAGE', title: 'Directory & Item Inspector' },
      { id: 'recipe-data-management-page', type: 'DATA_MANAGEMENT_PAGE', title: 'Data Management Workspace' },
      { id: 'recipe-dashboard-page', type: 'DASHBOARD_PAGE', title: 'Executive Metrics & Pulse' },
      { id: 'recipe-form-page', type: 'FORM_PAGE', title: 'New Record Submission Form' }
    ]
  };
}
