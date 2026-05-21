import { AlertTriangle, ChevronDown, Filter, Globe2, Search, X } from 'lucide-react';
import { useEffect } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { adminButtonClassName, adminInputClassName, adminSurfaceClassName } from './adminUiStyles';

interface AdminPageProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export const AdminPage = ({ actions, children }: PropsWithChildren<AdminPageProps>) => (
  <div className="space-y-5">
    <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
      {actions}
      <Link className={adminButtonClassName.secondary} to="/">
        <Globe2 className="h-4 w-4" />
        Acessar Portal Público
      </Link>
    </div>

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
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        {meta ? <div className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700">{meta}</div> : null}
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
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
      </div>
      {icon ? <div className="rounded-md bg-slate-100 p-2.5 text-teal-700">{icon}</div> : null}
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
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {badges ? <div className="flex flex-wrap gap-2">{badges}</div> : null}
    </div>

    {description ? <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p> : null}
    {actions ? <div className="mt-5 flex flex-wrap items-center gap-2">{actions}</div> : null}
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
  <span className={['inline-flex h-7 items-center rounded-md px-2.5 text-xs font-semibold uppercase ring-1 ring-inset', getStatusClassName(status)].join(' ')}>
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
  <div className={['grid gap-3 lg:items-center', filterInput ? 'lg:grid-cols-[minmax(0,1fr)_auto]' : 'grid-cols-1'].join(' ')}>
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      {searchInput}
    </div>
    {filterInput ? (
      <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:w-auto">
        <Filter className="hidden h-4 w-4 text-slate-400 sm:block" />
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
  <span className="relative block w-full sm:w-auto">
    <select className={`${adminInputClassName} min-w-0 appearance-none bg-white pr-10 font-semibold sm:w-auto sm:min-w-[180px]`} defaultValue={defaultValue} name={name}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
  </span>
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.label}
                </th>
              ))}
              {actions ? <th className="px-4 py-3 text-right">Ações</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="transition-colors hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className={['px-4 py-4 align-middle text-slate-700', column.className ?? ''].join(' ').trim()}>
                    {column.render(row)}
                  </td>
                ))}
                {actions ? <td className="px-4 py-4 align-middle text-right">{actions(row)}</td> : null}
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
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-layer fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 sm:p-8 !m-0">
      <button
        aria-label="Fechar painel"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
        tabIndex={-1}
      />
      <div
        aria-modal="true"
        className="admin-modal-card relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button
            className="shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="admin-modal-body flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface AdminConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminConfirmDialog = ({
  cancelLabel = 'Cancelar',
  confirmLabel = 'Excluir',
  description,
  isConfirming = false,
  isOpen,
  onClose,
  onConfirm,
  title,
}: AdminConfirmDialogProps) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-layer fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 sm:p-8 !m-0">
      <button
        aria-label="Cancelar confirmação"
        className="absolute inset-0 h-full w-full cursor-default"
        disabled={isConfirming}
        onClick={onClose}
        type="button"
        tabIndex={-1}
      />
      <div
        aria-modal="true"
        className="admin-modal-card relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        role="dialog"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-rose-100 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button className={adminButtonClassName.secondary} disabled={isConfirming} onClick={onClose} type="button">
            {cancelLabel}
          </button>
          <button className={adminButtonClassName.danger} disabled={isConfirming} onClick={onConfirm} type="button">
            {isConfirming ? 'Excluindo...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
