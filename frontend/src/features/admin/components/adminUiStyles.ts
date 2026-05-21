export const adminButtonClassName = {
  primary:
    'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300',
  primaryAction:
    'inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-36',
  secondary:
    'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950',
  ghost:
    'inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950',
  danger:
    'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-rose-700 bg-rose-700 px-4 text-sm font-semibold text-white transition hover:border-rose-800 hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60',
  badge: 'inline-flex h-7 items-center rounded-md px-2.5 text-xs font-medium ring-1 ring-inset ring-slate-200 bg-slate-100 text-slate-700',
} as const;

export const adminSurfaceClassName = 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm';

export const adminInputClassName =
  'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';
