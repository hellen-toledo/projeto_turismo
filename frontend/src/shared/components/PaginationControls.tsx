interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const paginationButtonClassName =
  'pagination-button inline-flex h-10 min-w-24 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none';

export const PaginationControls = ({ currentPage, lastPage, onPageChange }: PaginationControlsProps) => {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:justify-between">
      <button
        className={paginationButtonClassName}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        Anterior
      </button>
      <p className="pagination-label inline-flex h-10 items-center whitespace-nowrap rounded-md bg-slate-950/60 px-3 text-xs font-semibold text-slate-100 shadow-sm">
        Página {currentPage} de {lastPage}
      </p>
      <button
        className={paginationButtonClassName}
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Próxima
      </button>
    </div>
  );
};
