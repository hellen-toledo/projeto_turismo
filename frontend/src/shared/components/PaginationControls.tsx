interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({ currentPage, lastPage, onPageChange }: PaginationControlsProps) => {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <button
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        Anterior
      </button>
      <p className="text-sm text-slate-500">Página {currentPage} de {lastPage}</p>
      <button
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Próxima
      </button>
    </div>
  );
};
