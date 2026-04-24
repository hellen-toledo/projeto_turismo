import { Building2, CalendarRange, LogOut, MapPinned } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const navItems = [
  { to: '/admin', label: 'Visão Geral', icon: Building2, end: true },
  { to: '/admin/cities', label: 'Cidades', icon: MapPinned },
  { to: '/admin/events', label: 'Eventos', icon: CalendarRange },
];

const navItemClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
    isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-700 hover:bg-white hover:text-emerald-700',
  ].join(' ');

export const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eefbf5_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur lg:sticky lg:top-6 lg:w-80 lg:self-start">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Admin</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900">Projeto Turismo</h1>
              <p className="mt-2 text-sm text-slate-500">Base operacional preparada para expansão do painel.</p>
            </div>
          </div>

          <nav className="space-y-2" aria-label="Navegação administrativa">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink key={item.to} className={navItemClassName} end={item.end} to={item.to}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="mt-1 text-sm text-slate-300">{user?.email}</p>

            <button
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-emerald-400 hover:text-emerald-300"
              onClick={() => {
                void handleLogout();
              }}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
