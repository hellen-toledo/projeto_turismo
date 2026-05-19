import { Filter, Globe2, Search, X } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { adminButtonClassName, adminInputClassName, adminSurfaceClassName } from './adminUiStyles';

interface AdminPageProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export const AdminPage = ({ eyebrow, title, description, actions, children }: PropsWithChildren<AdminPageProps>) => (
  <div className="space-y-6">
    <header className="relative overflow-hidden rounded-none border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 opacity-35 lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(45deg,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[length:54px_54px]" />
      </div>
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-700">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {actions}
          <Link className={adminButtonClassName.secondary} to="/">
            <Globe2 className="h-4 w-4" />
            Acessar Portal Público
          </Link>
        </div>
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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {meta ? <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{meta}</div> : null}
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
  <article className="rounded-xl border border-slate-200 bg-white/95 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      {icon ? <div className="rounded-lg bg-slate-50 p-3 text-teal-700">{icon}</div> : null}
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
  <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
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
      return 'bg-teal-50 text-teal-800 ring-teal-200';
    case 'Em revisão':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'Rascunho':
      return 'bg-slate-100 text-slate-700 ring-slate-200';
    case 'Destaque':
      return 'bg-teal-50 text-teal-800 ring-teal-200';
    case 'Futuro':
      return 'bg-slate-100 text-slate-700 ring-slate-300';
    case 'Encerrado':
      return 'bg-slate-100 text-slate-600 ring-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-200';
  }
};

export const AdminStatusBadge = ({ status }: AdminStatusBadgeProps) => (
  <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ring-inset', getStatusClassName(status)].join(' ')}>
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
  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
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
  <select className={`${adminInputClassName} min-w-[190px] bg-white font-semibold`} defaultValue={defaultValue} name={name}>
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-sm">
          <thead className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-2">
                  {column.label}
                </th>
              ))}
              {actions ? <th className="px-5 py-2 text-right">Ações</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="rounded-xl shadow-sm transition hover:shadow-md">
                {columns.map((column) => (
                  <td key={column.key} className={['border-y border-slate-200 bg-white px-5 py-5 align-middle text-slate-700 first:rounded-l-xl first:border-l last:rounded-r-xl last:border-r', column.className ?? ''].join(' ').trim()}>
                    {column.render(row)}
                  </td>
                ))}
                {actions ? <td className="rounded-r-xl border-y border-r border-slate-200 bg-white px-5 py-5 text-right">{actions(row)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface AdminSideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

export const AdminSideSheet = ({ isOpen, onClose, title, description, children }: PropsWithChildren<AdminSideSheetProps>) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        aria-label="Fechar painel"
        className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        type="button"
      />
      
      {/* Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
