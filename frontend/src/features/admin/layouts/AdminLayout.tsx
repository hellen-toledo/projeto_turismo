import { CalendarRange, Home, Images, Landmark, LogOut, MapPinned, Menu, Moon, PanelLeftClose, PanelLeftOpen, Shapes, Sun, Waypoints, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
    'relative flex items-center overflow-hidden rounded-md text-sm font-semibold transition-all duration-500 ease-in-out',
    isCollapsed ? 'h-10 w-10 justify-center gap-0 px-0' : 'h-10 w-full gap-3 px-3 text-left',
    isActive
      ? 'bg-teal-50 text-teal-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ');

const collapsingTextClassName = (isCollapsed: boolean) =>
  [
    'min-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out',
    isCollapsed ? 'w-0 opacity-0' : 'w-36 opacity-100',
  ].join(' ');

const adminThemeStorageKey = 'turismo-admin-theme';

interface SidebarProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  isDarkTheme: boolean;
  onLogout: () => void;
  showCollapseControl?: boolean;
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
}

const Sidebar = ({ onNavigate, isCollapsed = false, isDarkTheme, onLogout, showCollapseControl = true, onToggleCollapse, onToggleTheme }: SidebarProps) => (
  <div className="flex h-full flex-col">
    <div className={['flex h-20 items-center transition-all duration-500 ease-in-out', isCollapsed ? 'justify-center gap-0 px-0' : 'gap-3 px-5'].join(' ')}>
      {isCollapsed ? (
        <button
          aria-label="Expandir menu"
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white shadow-sm transition hover:bg-teal-800 focus:outline-none"
          onClick={onToggleCollapse}
          title="Expandir menu"
          type="button"
        >
          <Landmark className="h-5 w-5 group-hover:hidden" />
          <PanelLeftOpen className="hidden h-5 w-5 group-hover:block" />
        </button>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white shadow-sm">
          <Landmark className="h-5 w-5" />
        </div>
      )}
      <div className={collapsingTextClassName(isCollapsed)}>
        <p className="truncate text-xs font-semibold uppercase text-teal-700">Turismo</p>
        <p className="truncate text-base font-bold text-slate-950">Norte-Goiano</p>
      </div>
      {showCollapseControl ? (
        <button
          aria-label="Recolher menu"
          className={[
            'flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-md text-slate-600 transition-all duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-950',
            isCollapsed ? 'w-0 opacity-0' : 'ml-auto w-10 opacity-100',
          ].join(' ')}
          onClick={onToggleCollapse}
          tabIndex={isCollapsed ? -1 : undefined}
          title="Recolher menu"
          type="button"
        >
          <PanelLeftClose className="h-5 w-5 shrink-0" />
        </button>
      ) : null}
    </div>

    <nav aria-label="Navegação administrativa" className={['flex-1 space-y-1 py-5 transition-all duration-500 ease-in-out', isCollapsed ? 'flex flex-col items-center px-2' : 'px-3'].join(' ')}>
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
            <Icon className="h-4 w-4 shrink-0" />
            <span className={collapsingTextClassName(isCollapsed)}>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>

    <div className={['space-y-1 p-3 transition-all duration-500 ease-in-out', isCollapsed ? 'flex flex-col items-center' : ''].join(' ')}>
      <button
        aria-label={isCollapsed ? (isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro') : undefined}
        className={[
          'flex h-10 items-center overflow-hidden rounded-md text-sm font-semibold text-slate-700 transition-all duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-950',
          isCollapsed ? 'w-10 justify-center gap-0 px-0' : 'w-full gap-3 px-3 text-left',
        ].join(' ')}
        onClick={onToggleTheme}
        title={isCollapsed ? (isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro') : undefined}
        type="button"
      >
        {isDarkTheme ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
        <span className={collapsingTextClassName(isCollapsed)}>{isDarkTheme ? 'Tema claro' : 'Tema escuro'}</span>
      </button>
      <button
        className={[
          'flex h-10 items-center overflow-hidden rounded-md text-sm font-semibold text-slate-700 transition-all duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-950',
          isCollapsed ? 'w-10 justify-center gap-0 px-0' : 'w-full gap-3 px-3 text-left',
        ].join(' ')}
        onClick={onLogout}
        title={isCollapsed ? 'Sair' : undefined}
        type="button"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span className={collapsingTextClassName(isCollapsed)}>Sair</span>
      </button>
    </div>
  </div>
);

export const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => getStoredString(adminThemeStorageKey) === 'dark');

  useEffect(() => {
    setStoredString(adminThemeStorageKey, isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div
      className={['admin-shell min-h-screen bg-cover bg-fixed bg-center transition-colors', isDarkTheme ? 'admin-dark bg-slate-950 text-slate-100' : 'admin-light bg-slate-50 text-slate-900'].join(' ')}
      style={{ backgroundImage: "url('/imagemFundoLogin.jpeg')" }}
    >
      <aside className={['fixed inset-y-0 left-0 z-40 hidden overflow-hidden bg-white transition-[width] duration-500 ease-in-out lg:block', isCollapsed ? 'w-20' : 'w-64'].join(' ')}>
        <Sidebar isCollapsed={isCollapsed} isDarkTheme={isDarkTheme} onLogout={() => void handleLogout()} onToggleCollapse={() => setIsCollapsed((current) => !current)} onToggleTheme={() => setIsDarkTheme((current) => !current)} />
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
          <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-2xl">
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
              isDarkTheme={isDarkTheme}
              onLogout={() => void handleLogout()}
              showCollapseControl={false}
              onToggleCollapse={() => setIsCollapsed((current) => !current)}
              onToggleTheme={() => setIsDarkTheme((current) => !current)}
            />
          </aside>
        </div>
      ) : null}

      <div className={['relative z-10 transition-[padding] duration-500 ease-in-out', isCollapsed ? 'lg:pl-20' : 'lg:pl-64'].join(' ')}>
        <button
          aria-label="Abrir navegação"
          className="fixed bottom-4 left-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-md bg-white text-slate-800 shadow-lg transition hover:bg-slate-50 lg:hidden"
          onClick={() => {
            setMobileMenuOpen(true);
          }}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <main className="mx-auto max-w-[1600px] px-0 py-0 sm:px-0 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
