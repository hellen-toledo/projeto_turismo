import { Link, NavLink } from 'react-router-dom';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-green-700'
    : 'text-gray-700 hover:text-green-600 transition-colors';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-green-700">
          Turismo Norte-Goiano
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 font-medium md:flex">
          <NavLink to="/" className={navLinkClassName} end>
            Home
          </NavLink>
          <NavLink to="/eventos" className={navLinkClassName}>
            Eventos
          </NavLink>
          <NavLink to="/cidades" className={navLinkClassName}>
            Cidades
          </NavLink>
        </nav>

        <Link
          to="/eventos"
          aria-label="Explorar eventos"
          className="rounded-full bg-green-600 px-6 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
        >
          Explorar
        </Link>
      </div>
    </header>
  );
};
