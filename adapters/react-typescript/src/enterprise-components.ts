/**
 * ALPER DESIGN OS — Enterprise Component Suite Template
 * Canonical TypeScript / Tailwind implementation for DataGrid, AppShell, GanttTimeline, Form Controls.
 */

export const ENTERPRISE_COMPONENTS_SOURCE = `import React, { useState, useMemo } from 'react';

// ============================================================================
// 1. ENTERPRISE BADGE
// ============================================================================
export interface EnterpriseBadgeProps {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  size?: 'xs' | 'sm';
  children: React.ReactNode;
  className?: string;
}

export const EnterpriseBadge: React.FC<EnterpriseBadgeProps> = ({
  variant = 'default',
  size = 'xs',
  children,
  className = ''
}) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    neutral: 'bg-slate-800/80 text-slate-400 border-slate-750',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    critical: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
    info: 'bg-sky-950/60 text-sky-300 border-sky-800/60'
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 font-mono font-semibold',
    sm: 'text-xs px-2.5 py-1 font-mono font-medium'
  };

  return (
    <span
      className={\`inline-flex items-center rounded border tracking-wider uppercase \${variantStyles[variant]} \${sizeStyles[size]} \${className}\`}
    >
      {children}
    </span>
  );
};

// ============================================================================
// 2. ENTERPRISE FORM CONTROLS
// ============================================================================
export interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const EnterpriseFormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  hint,
  required,
  children,
  className = ''
}) => {
  return (
    <div className={\`flex flex-col gap-1 \${className}\`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
      {error && (
        <span id={\`\${id}-error\`} className="text-xs text-rose-400 font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export interface EnterpriseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const EnterpriseInput: React.FC<EnterpriseInputProps> = ({
  hasError,
  className = '',
  ...props
}) => {
  return (
    <input
      className={\`w-full bg-slate-900 border text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded px-3 py-1.5 focus:outline-none transition-colors \${
        hasError
          ? 'border-rose-500 focus:border-rose-400'
          : 'border-slate-800 focus:border-sky-500'
      } \${className}\`}
      {...props}
    />
  );
};

// ============================================================================
// 3. ENTERPRISE DATA GRID (Sortable, Filterable, Selectable, Dense)
// ============================================================================
export interface GridColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface EnterpriseDataGridProps<T> {
  data: T[];
  columns: GridColumn<T>[];
  keyField: keyof T;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelect?: (keys: string[]) => void;
  density?: 'compact' | 'normal' | 'spacious';
  pageSize?: number;
  emptyMessage?: string;
  toolbarActions?: React.ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function EnterpriseDataGrid<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  searchable = true,
  searchPlaceholder = 'Grid içinde ara...',
  selectable = false,
  selectedKeys = [],
  onSelect,
  density = 'compact',
  pageSize = 10,
  emptyMessage = 'Görüntülenecek veri bulunamadı.',
  toolbarActions,
  onRowClick,
  className = ''
}: EnterpriseDataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDensity, setCurrentDensity] = useState(density);

  // 1. Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  // 2. Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const res = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? res : -res;
    });
  }, [filteredData, sortKey, sortOrder]);

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelect) return;
    if (e.target.checked) {
      onSelect(paginatedData.map((d) => String(d[keyField])));
    } else {
      onSelect([]);
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelect) return;
    if (selectedKeys.includes(key)) {
      onSelect(selectedKeys.filter((k) => k !== key));
    } else {
      onSelect([...selectedKeys, key]);
    }
  };

  const paddingStyle =
    currentDensity === 'compact'
      ? 'py-2 px-3 text-xs'
      : currentDensity === 'spacious'
      ? 'py-3.5 px-4 text-sm'
      : 'py-2.5 px-3.5 text-xs sm:text-sm';

  return (
    <div className={\`flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden \${className}\`}>
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-slate-950/60 border-b border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-sky-500"
              />
              <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
            </div>
          )}
          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
            Toplam: <b>{sortedData.length}</b> kayıt
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {toolbarActions}
          {/* Density toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setCurrentDensity('compact')}
              className={\`px-2 py-0.5 text-[10px] rounded font-medium transition-colors \${
                currentDensity === 'compact' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }\`}
              title="Kompakt Görünüm"
            >
              Kompakt
            </button>
            <button
              onClick={() => setCurrentDensity('normal')}
              className={\`px-2 py-0.5 text-[10px] rounded font-medium transition-colors \${
                currentDensity === 'normal' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }\`}
              title="Standart Görünüm"
            >
              Standart
            </button>
          </div>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none">
              {selectable && (
                <th className="w-10 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every((d) => selectedKeys.includes(String(d[keyField])))}
                    onChange={handleSelectAll}
                    aria-label="Tümünü seç"
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={\`\${paddingStyle} \${col.sortable !== false ? 'cursor-pointer hover:text-white' : ''} \${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }\`}
                >
                  <div className={\`inline-flex items-center gap-1.5 \${col.align === 'right' ? 'justify-end' : ''}\`}>
                    <span>{col.label}</span>
                    {sortKey === col.key && (
                      <span className="text-sky-400 text-[10px] font-bold">
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-xs text-slate-500 font-mono"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const key = String(item[keyField]);
                const isSelected = selectedKeys.includes(key);
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={\`transition-colors \${
                      isSelected ? 'bg-sky-950/20' : idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/70'
                    } hover:bg-slate-800/50 \${onRowClick ? 'cursor-pointer' : ''}\`}
                  >
                    {selectable && (
                      <td className="w-10 px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          aria-label={\`Seçim: \${key}\`}
                          className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const val = item[col.key];
                      return (
                        <td
                          key={col.key}
                          className={\`\${paddingStyle} text-slate-200 \${
                            col.align === 'right' ? 'text-right font-mono tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left'
                          }\`}
                        >
                          {col.render ? col.render(val, item) : String(val ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400">
          <div className="font-mono text-[11px]">
            Sayfa <b>{currentPage}</b> / <b>{totalPages}</b>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-750"
            >
              Önceki
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-750"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. GANTT & MACHINE CAPACITY TIMELINE (Industrial Operations)
// ============================================================================
export interface MachineResource {
  id: string;
  name: string;
  category: string;
  shifts: number;
  totalCapacityHours: number;
  plannedHours: number;
}

export interface ScheduledJob {
  id: string;
  resourceId: string;
  orderNo: string;
  partName: string;
  quantity: number;
  startHour: number;
  durationHours: number;
  status: 'IN_PROGRESS' | 'SCHEDULED' | 'DELAY_RISK' | 'COMPLETED';
}

export interface GanttCapacityTimelineProps {
  resources: MachineResource[];
  jobs: ScheduledJob[];
  onJobClick?: (job: ScheduledJob) => void;
  selectedJobId?: string;
  className?: string;
}

export const GanttCapacityTimeline: React.FC<GanttCapacityTimelineProps> = ({
  resources,
  jobs,
  onJobClick,
  selectedJobId,
  className = ''
}) => {
  return (
    <div className={\`flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden \${className}\`}>
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Hat & Makine Kapasite Yük Matrisi</h3>
          <p className="text-[11px] text-slate-400">Vardiya bazlı haftalık planlanan saatler ve darboğaz takibi</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Normal (&lt;%75)</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Yüksek (%75-%90)</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Darboğaz (&gt;%90)</div>
        </div>
      </div>

      <div className="divide-y divide-slate-800/80 p-3 space-y-3">
        {resources.map((res) => {
          const loadPercent = Math.min(100, Math.round((res.plannedHours / Math.max(1, res.totalCapacityHours)) * 100));
          const loadColor =
            loadPercent > 90
              ? 'bg-rose-500 text-rose-300'
              : loadPercent > 75
              ? 'bg-amber-500 text-amber-300'
              : 'bg-emerald-500 text-emerald-300';

          const resJobs = jobs.filter((j) => j.resourceId === res.id);

          return (
            <div key={res.id} className="pt-2 first:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">{res.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {res.shifts} Vardiya
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">
                    Planlanan: <b className="text-sky-300">{res.plannedHours} sa</b> / {res.totalCapacityHours} sa
                  </span>
                  <span className={\`text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800/80 \${loadColor.split(' ')[1]}\`}>
                    %{loadPercent}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded h-2 overflow-hidden border border-slate-850 mb-2">
                <div
                  className={\`h-full rounded transition-all duration-500 \${loadColor.split(' ')[0]}\`}
                  style={{ width: \`\${loadPercent}%\` }}
                />
              </div>

              {/* Scheduled Jobs Track */}
              {resJobs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 mt-2">
                  {resJobs.map((job) => {
                    const isSelected = selectedJobId === job.id;
                    const statusBadge =
                      job.status === 'DELAY_RISK'
                        ? 'border-rose-600/60 bg-rose-950/40 text-rose-300'
                        : job.status === 'IN_PROGRESS'
                        ? 'border-sky-600/60 bg-sky-950/40 text-sky-300'
                        : 'border-slate-700 bg-slate-800/60 text-slate-300';

                    return (
                      <div
                        key={job.id}
                        onClick={() => onJobClick && onJobClick(job)}
                        className={\`p-2 rounded border cursor-pointer transition-all text-xs \${statusBadge} \${
                          isSelected ? 'ring-1 ring-sky-400' : 'hover:border-slate-500'
                        }\`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="font-bold">{job.orderNo}</span>
                          <span>{job.durationHours} saat</span>
                        </div>
                        <div className="font-medium text-slate-200 truncate mt-0.5">{job.partName}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                          <span>Adet: {job.quantity.toLocaleString('tr-TR')}</span>
                          <span className="uppercase font-semibold">{job.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 5. ENTERPRISE APPLICATION SHELL (Workbench Layout)
// ============================================================================
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
  count?: number;
  onClick: () => void;
}

export interface EnterpriseAppShellProps {
  appName: string;
  badge?: string;
  subtitle?: string;
  navItems: NavItem[];
  facilitySelector?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerTelemetry?: React.ReactNode;
  children: React.ReactNode;
}

export const EnterpriseAppShell: React.FC<EnterpriseAppShellProps> = ({
  appName,
  badge = 'ENTERPRISE',
  subtitle,
  navItems,
  facilitySelector,
  headerActions,
  footerTelemetry,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Navigation Toolbar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white md:hidden"
            aria-label="Menüyü Aç/Kapat"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">{appName}</span>
            {badge && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <span className="text-xs text-slate-400 hidden lg:inline border-l border-slate-800 pl-3">{subtitle}</span>}
        </div>

        <div className="flex items-center gap-3">
          {facilitySelector}
          {headerActions}
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex w-full">
        {/* Persistent Desktop Sidebar */}
        <aside
          className={\`fixed inset-y-0 left-0 top-14 z-30 w-60 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform md:translate-x-0 \${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }\`}
        >
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setSidebarOpen(false);
                }}
                className={\`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors \${
                  item.active
                    ? 'bg-sky-500/15 text-sky-400 font-semibold border-l-2 border-sky-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }\`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <span className="text-sm">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            aria-hidden="true"
          />
        )}

        {/* Content Region: Full Workbench Canvas without artificial narrow margins */}
        <main className="flex-1 md:pl-60 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
          <div className="flex-1 p-4 md:p-6 w-full max-w-none">{children}</div>

          {/* Operational Footer / Telemetry Bar */}
          <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-2 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>{appName} • ALPER DESIGN OS Engine</span>
            <div className="font-mono text-[11px] text-slate-400">{footerTelemetry || 'Sistem Hazır • Telemetri Aktif'}</div>
          </footer>
        </main>
      </div>
    </div>
  );
};
`;
