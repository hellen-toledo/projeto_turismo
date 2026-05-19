import { CalendarRange, ChevronLeft, ChevronRight, Home, Images, Landmark, LogOut, MapPinned, Menu, Moon, Shapes, Sun, Waypoints, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getStoredString, setStoredString } from '../../../shared/lib/storage/browserStorage';
import { adminButtonClassName } from '../components/adminUiStyles';
import { useAdminAuth } from '../hooks/useAdminAuth';

const navItems = [
  { to: '/admin', label: 'Visão geral', icon: Home, end: true },
  { to: '/admin/events', label: 'Eventos', icon: CalendarRange },
  { to: '/admin/cities', label: 'Cidades', icon: MapPinned },
  { to: '/admin/regions', label: 'Regiões', icon: Waypoints },
  { to: '/admin/media', label: 'Mídia', icon: Images },
  { to: '/admin/interest-tags', label: 'Tags', icon: Shapes },
];

const navItemClassName = ({ isActive }: { isActive: boolean }, isCollapsed: boolean) =>
  [
    'relative flex items-center rounded-xl text-base font-semibold transition',
    isCollapsed ? 'justify-center w-11 h-11' : 'w-full gap-4 px-4 py-4 text-left',
    isActive
      ? 'bg-slate-100 text-slate-950 shadow-sm before:absolute before:right-5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-teal-700/60'
      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
  ].join(' ');

const moduleLabelByPath = new Map<string, string>([
  ['/admin', 'Visão geral'],
  ['/admin/events', 'Eventos'],
  ['/admin/cities', 'Cidades'],
  ['/admin/regions', 'Regiões'],
  ['/admin/media', 'Mídia'],
  ['/admin/interest-tags', 'Tags'],
]);

const adminThemeStorageKey = 'turismo-admin-theme';

interface SidebarProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onLogout: () => void;
}

const Sidebar = ({ onNavigate, isCollapsed = false, onLogout }: SidebarProps) => (
  <div className="flex h-full flex-col">
    <div className={['flex items-center py-8', isCollapsed ? 'justify-center' : 'gap-5 px-7'].join(' ')}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
        <Landmark className="h-5 w-5" />
      </div>
      {!isCollapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Turismo</p>
          <p className="truncate text-base font-bold text-slate-950">Norte-Goiano</p>
        </div>
      )}
    </div>

    <nav aria-label="Navegação administrativa" className={['flex-1 space-y-3 pt-8', isCollapsed ? 'px-2 flex flex-col items-center' : 'px-5'].join(' ')}>
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            className={(props) => navItemClassName(props, isCollapsed)}
            end={item.end}
            onClick={onNavigate}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon className="h-6 w-6 shrink-0 text-slate-800" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>

    {!isCollapsed ? (
      <div className="p-5">
        <button className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-base font-semibold text-slate-800 transition hover:bg-slate-50" onClick={onLogout} type="button">
          <LogOut className="h-6 w-6" />
          Sair
        </button>
      </div>
    ) : (
      <div className="p-3 flex justify-center">
        <button className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-50" onClick={onLogout} title="Sair" type="button">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    )}
  </div>
);

export const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => getStoredString(adminThemeStorageKey) === 'dark');
  const currentModule = moduleLabelByPath.get(location.pathname) ?? 'Painel';

  useEffect(() => {
    setStoredString(adminThemeStorageKey, isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={['admin-shell min-h-screen transition-colors', isDarkTheme ? 'admin-dark bg-slate-950 text-slate-100' : 'admin-light bg-white text-slate-900'].join(' ')}>
      {/* Desktop Sidebar */}
      <aside className={['fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-all duration-300 lg:block', isCollapsed ? 'w-20' : 'w-72'].join(' ')}>
        <Sidebar isCollapsed={isCollapsed} onLogout={() => void handleLogout()} />
        
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-24 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-700 focus:outline-none"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
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
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-2xl">
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
              onNavigate={() => {
                setMobileMenuOpen(false);
              }}
              isCollapsed={false}
              onLogout={() => void handleLogout()}
            />
          </aside>
        </div>
      ) : null}

      <div className={['transition-all duration-300', isCollapsed ? 'lg:pl-20' : 'lg:pl-72'].join(' ')}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                aria-label={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
                onClick={() => setIsDarkTheme((current) => !current)}
                title={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}
                type="button"
              >
                {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-950">
                  {(user?.name ?? 'AD')
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join('')
                    .slice(0, 2)}
                </div>
                <span className="max-w-40 truncate text-base font-semibold text-slate-950">{user?.name ?? 'Administrador'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1700px] px-0 py-0 sm:px-0 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
