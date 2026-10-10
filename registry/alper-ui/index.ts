export interface RegistryComponentItem {
  id: string;
  type: string;
  role: string;
  density: string;
}

export interface RegistryRecipeItem {
  id: string;
  type: string;
  title: string;
}

export interface AlperUiRegistryCatalog {
  name: string;
  version: string;
  componentsCount: number;
  recipesCount: number;
  supportedStacks: string[];
}

export function getAlperUiRegistrySummary(): AlperUiRegistryCatalog {
  return {
    name: 'Alper UI Canonical Registry',
    version: '1.0.0',
    componentsCount: 15,
    recipesCount: 6,
    supportedStacks: ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor']
  };
}
