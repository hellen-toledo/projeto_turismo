import { Filter, Search } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { adminInputClassName, adminSurfaceClassName } from './adminUiStyles';

interface AdminPageProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export const AdminPage = ({ eyebrow, title, description, actions, children }: PropsWithChildren<AdminPageProps>) => (
  <div className="space-y-6">
    <header className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>

    {children}
  </div>
);

interface AdminSurfaceProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export const AdminSurface = ({ title, description, meta, actions, children }: AdminSurfaceProps) => (
  <section className={adminSurfaceClassName}>
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {meta ? <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{meta}</div> : null}
        {actions}
      </div>
    </div>

    <div className="mt-6">{children}</div>
  </section>
);

interface AdminKpiProps {
  label: string;
  value: ReactNode;
  hint: string;
  icon?: ReactNode;
}

export const AdminKpi = ({ label, value, hint, icon }: AdminKpiProps) => (
  <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      {icon ? <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">{icon}</div> : null}
    </div>
    <p className="mt-4 text-sm text-slate-500">{hint}</p>
  </article>
);

interface AdminListItemProps {
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  description?: string;
  actions?: ReactNode;
}

export const AdminListItem = ({ title, subtitle, badges, description, actions }: AdminListItemProps) => (
  <article className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 transition-colors hover:border-slate-300">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
    </div>

    {description ? <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p> : null}
    {actions ? <div className="mt-5 flex flex-wrap gap-2">{actions}</div> : null}
  </article>
);

interface AdminStatusBadgeProps {
  status: string;
}

const getStatusClassName = (status: string) => {
  switch (status) {
    case 'Publicado':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'Em revisão':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'Rascunho':
      return 'bg-slate-100 text-slate-700 ring-slate-200';
    case 'Destaque':
      return 'bg-sky-50 text-sky-700 ring-sky-200';
    case 'Futuro':
      return 'bg-violet-50 text-violet-700 ring-violet-200';
    case 'Encerrado':
      return 'bg-slate-100 text-slate-600 ring-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-200';
  }
};

export const AdminStatusBadge = ({ status }: AdminStatusBadgeProps) => (
  <span className={['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset', getStatusClassName(status)].join(' ')}>
    {status}
  </span>
);

interface AdminFilterOption {
  label: string;
  value: string;
}

interface AdminSearchToolbarProps {
  searchInput: ReactNode;
  filterInput?: ReactNode;
}

export const AdminSearchToolbar = ({ searchInput, filterInput }: AdminSearchToolbarProps) => (
  <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      {searchInput}
    </div>
    {filterInput ? (
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        {filterInput}
      </div>
    ) : null}
  </div>
);

interface AdminSelectFilterProps {
  defaultValue?: string;
  name: string;
  options: AdminFilterOption[];
}

export const AdminSelectFilter = ({ defaultValue, name, options }: AdminSelectFilterProps) => (
  <select className={`${adminInputClassName} min-w-[180px] bg-slate-50`} defaultValue={defaultValue} name={name}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

interface AdminDataTableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: AdminDataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  actions?: (row: T) => ReactNode;
  emptyState: ReactNode;
}

export const AdminDataTable = <T,>({ columns, rows, getRowKey, actions, emptyState }: AdminDataTableProps<T>) => {
  if (rows.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4">
                  {column.label}
                </th>
              ))}
              {actions ? <th className="px-5 py-4 text-right">Ações</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="transition hover:bg-slate-50/70">
                {columns.map((column) => (
                  <td key={column.key} className={['px-5 py-4 align-middle text-slate-700', column.className ?? ''].join(' ').trim()}>
                    {column.render(row)}
                  </td>
                ))}
                {actions ? <td className="px-5 py-4 text-right">{actions(row)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
