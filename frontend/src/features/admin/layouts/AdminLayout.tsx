import { Building2, CalendarRange, Globe2, Images, Landmark, LogOut, MapPinned, Menu, Shapes, Waypoints, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminAuth } from '../hooks/useAdminAuth';

const navItems = [
  { to: '/admin', label: 'Visão geral', icon: Building2, end: true },
  { to: '/admin/events', label: 'Eventos', icon: CalendarRange },
  { to: '/admin/cities', label: 'Cidades', icon: MapPinned },
  { to: '/admin/regions', label: 'Regiões', icon: Waypoints },
  { to: '/admin/media', label: 'Mídia', icon: Images },
  { to: '/admin/interest-tags', label: 'Tags', icon: Shapes },
];

const navItemClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition',
    isActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ');

const moduleLabelByPath = new Map<string, string>([
  ['/admin', 'Visão geral'],
  ['/admin/events', 'Eventos'],
  ['/admin/cities', 'Cidades'],
  ['/admin/regions', 'Regiões'],
  ['/admin/media', 'Mídia'],
  ['/admin/interest-tags', 'Tags'],
]);

interface SidebarProps {
  currentPath: string;
  onNavigate?: () => void;
}

const Sidebar = ({ currentPath, onNavigate }: SidebarProps) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-3 px-5 py-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
        <Landmark className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Turismo</p>
        <p className="text-base font-bold text-slate-950">Norte-Goiano</p>
      </div>
    </div>

    <nav aria-label="Navegação administrativa" className="flex-1 space-y-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            className={navItemClassName}
            end={item.end}
            onClick={onNavigate}
            to={item.to}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>

    <div className="m-3 rounded-3xl bg-emerald-50 p-4 text-emerald-950 ring-1 ring-emerald-100">
      <p className="text-sm font-bold">Portal público</p>
      <p className="mt-1 text-xs leading-5 text-emerald-800">Revise rapidamente como cidades e eventos aparecem fora da área administrativa.</p>
      <Link className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm transition hover:-translate-y-0.5" to="/">
        Abrir portal
        <Globe2 className="h-3.5 w-3.5" />
      </Link>
      <p className="mt-4 text-xs text-emerald-900/70">Módulo ativo: {moduleLabelByPath.get(currentPath) ?? 'Painel'}</p>
    </div>
  </div>
);

export const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentModule = moduleLabelByPath.get(location.pathname) ?? 'Painel';

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <Sidebar currentPath={location.pathname} />
      </aside>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => {
              setMobileMenuOpen(false);
            }}
            type="button"
          />
          <aside className="relative h-full w-80 max-w-[85vw] border-r border-slate-200 bg-white shadow-2xl">
            <button
              aria-label="Fechar navegação"
              className={['absolute right-4 top-4', adminButtonClassName.ghost].join(' ')}
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar
              currentPath={location.pathname}
              onNavigate={() => {
                setMobileMenuOpen(false);
              }}
            />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                aria-label="Abrir navegação"
                className={adminButtonClassName.ghost}
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
                type="button"
              >
                <Menu className="h-5 w-5 lg:hidden" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Área administrativa</p>
                <p className="font-bold text-slate-950">{currentModule}</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Perfil: <span className="font-semibold text-slate-950">{user?.name ?? 'Administrador'}</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                {(user?.name ?? 'AD')
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join('')
                  .slice(0, 2)}
              </div>
              <button className={adminButtonClassName.secondary} onClick={() => void handleLogout()} type="button">
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
