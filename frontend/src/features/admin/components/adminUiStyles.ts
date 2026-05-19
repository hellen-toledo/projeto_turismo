export const adminButtonClassName = {
  primary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300',
  secondary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950',
  ghost:
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950',
  danger:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60',
  badge: 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-slate-200 bg-slate-100 text-slate-700',
} as const;

export const adminSurfaceClassName = 'rounded-xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-900/10 backdrop-blur';

export const adminInputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';
