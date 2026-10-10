import {
  RegistrySource,
  RegistrySourceSchema,
  RegistryComponent,
  RegistryComponentSchema
} from './types.js';

export const SEED_REGISTRIES: RegistrySource[] = [
  {
    id: 'reg-shadcn-official',
    name: 'Official shadcn/ui Registry',
    type: 'OFFICIAL',
    registryUrl: 'https://ui.shadcn.com/r',
    homepage: 'https://ui.shadcn.com',
    description: 'The canonical headless component and block distribution registry for accessible React primitives styled with Tailwind CSS.',
    registryFormat: 'SHADCN_V2',
    componentCount: 52,
    blockCount: 48,
    templateCount: 12,
    requiresAuth: false,
    freeTier: true,
    license: 'MIT',
    lastChecked: '2026-10-10'
  },
  {
    id: 'reg-magic-ui',
    name: 'Magic UI Registry',
    type: 'COMMUNITY',
    registryUrl: 'https://magicui.design/r',
    homepage: 'https://magicui.design',
    description: 'Animated UI components and marketing visual blocks designed to be installed directly via shadcn CLI.',
    registryFormat: 'SHADCN_V2',
    componentCount: 65,
    blockCount: 30,
    templateCount: 8,
    requiresAuth: false,
    freeTier: true,
    license: 'MIT',
    lastChecked: '2026-10-08'
  },
  {
    id: 'reg-aceternity',
    name: 'Aceternity UI Registry',
    type: 'COMMUNITY',
    registryUrl: 'https://ui.aceternity.com/r',
    homepage: 'https://ui.aceternity.com',
    description: 'Trendy, highly visual React components with Framer Motion animations and custom canvas shaders.',
    registryFormat: 'SHADCN_V1',
    componentCount: 45,
    blockCount: 22,
    templateCount: 5,
    requiresAuth: false,
    freeTier: true,
    license: 'MIT',
    lastChecked: '2026-10-05'
  },
  {
    id: 'reg-kokonut',
    name: 'Kokonut UI Registry',
    type: 'COMMUNITY',
    registryUrl: 'https://kokonutui.com/r',
    homepage: 'https://kokonutui.com',
    description: 'Modern, accessible UI blocks and micro-interactions built for Tailwind and React.',
    registryFormat: 'SHADCN_V2',
    componentCount: 38,
    blockCount: 18,
    templateCount: 4,
    requiresAuth: false,
    freeTier: true,
    license: 'MIT',
    lastChecked: '2026-10-01'
  }
];

export const SEED_REGISTRY_COMPONENTS: RegistryComponent[] = [
  {
    id: 'button',
    name: 'Button',
    registryId: 'reg-shadcn-official',
    type: 'ui',
    description: 'Displays a button or a component that looks like a button with multiple visual variants and sizes.',
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
    devDependencies: [],
    registryDependencies: [],
    files: ['ui/button.tsx'],
    category: 'Forms & Inputs'
  },
  {
    id: 'dialog',
    name: 'Dialog',
    registryId: 'reg-shadcn-official',
    type: 'ui',
    description: 'A window overlaid on either the primary window or another dialog window, rendering content underneath inert.',
    dependencies: ['@radix-ui/react-dialog', 'lucide-react'],
    devDependencies: [],
    registryDependencies: [],
    files: ['ui/dialog.tsx'],
    category: 'Overlays'
  },
  {
    id: 'data-table',
    name: 'Data Table Block',
    registryId: 'reg-shadcn-official',
    type: 'block',
    description: 'Complete data table implementation with sorting, pagination, filtering, and column visibility toggle using TanStack Table.',
    dependencies: ['@tanstack/react-table', 'lucide-react'],
    devDependencies: [],
    registryDependencies: ['button', 'dropdown-menu', 'input'],
    files: ['blocks/data-table/data-table.tsx', 'blocks/data-table/columns.tsx'],
    category: 'Data Display'
  },
  {
    id: 'animated-beam',
    name: 'Animated Beam',
    registryId: 'reg-magic-ui',
    type: 'component',
    description: 'SVG beam animation connecting multiple nodes to illustrate data flow and microservice pipelines.',
    dependencies: ['framer-motion'],
    devDependencies: [],
    registryDependencies: [],
    files: ['magicui/animated-beam.tsx'],
    category: 'Animation & Graphics'
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    registryId: 'reg-magic-ui',
    type: 'block',
    description: 'Bento-box inspired responsive grid layout with dynamic sizing, hover animations, and background effects.',
    dependencies: ['lucide-react', 'clsx', 'tailwind-merge'],
    devDependencies: [],
    registryDependencies: [],
    files: ['magicui/bento-grid.tsx'],
    category: 'Layout'
  }
];

export class RegistryDiscoveryEngine {
  private registries: Map<string, RegistrySource> = new Map();
  private components: Map<string, RegistryComponent> = new Map();

  constructor(
    initialRegistries: RegistrySource[] = SEED_REGISTRIES,
    initialComponents: RegistryComponent[] = SEED_REGISTRY_COMPONENTS
  ) {
    for (const reg of initialRegistries) {
      RegistrySourceSchema.parse(reg);
      this.registries.set(reg.id, reg);
    }
    for (const comp of initialComponents) {
      RegistryComponentSchema.parse(comp);
      const key = `${comp.registryId}:${comp.id}`;
      this.components.set(key, comp);
    }
  }

  public getAllRegistries(): RegistrySource[] {
    return Array.from(this.registries.values());
  }

  public getRegistry(id: string): RegistrySource | undefined {
    return this.registries.get(id);
  }

  public searchRegistries(query: string = ''): RegistrySource[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllRegistries();
    return this.getAllRegistries().filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
    );
  }

  public searchRegistryComponents(
    query: string = '',
    options: { registryId?: string; type?: RegistryComponent['type']; category?: string } = {}
  ): RegistryComponent[] {
    const q = query.toLowerCase().trim();
    let list = Array.from(this.components.values());

    if (options.registryId) {
      list = list.filter((c) => c.registryId === options.registryId);
    }
    if (options.type) {
      list = list.filter((c) => c.type === options.type);
    }
    if (options.category) {
      list = list.filter((c) => c.category?.toLowerCase() === options.category?.toLowerCase());
    }
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.dependencies.some((d) => d.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public inspectRegistryComponent(registryId: string, componentId: string): RegistryComponent | undefined {
    return this.components.get(`${registryId}:${componentId}`) ||
           Array.from(this.components.values()).find((c) => c.registryId === registryId && c.id === componentId);
  }

  public indexComponent(component: RegistryComponent): void {
    RegistryComponentSchema.parse(component);
    const key = `${component.registryId}:${component.id}`;
    this.components.set(key, component);
  }
}

export const registryDiscoveryEngine = new RegistryDiscoveryEngine();
