import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-xl font-bold">Turismo Norte-Goiano</h3>
          <p className="leading-relaxed text-gray-400">
            Descubra experiências de natureza, cultura e eventos na região norte de Goiás.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Navegação</h3>
          <nav aria-label="Navegação do rodapé">
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="transition-colors hover:text-white">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/cidades" className="transition-colors hover:text-white">
                  Cidades
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Contato</h3>
          <p className="text-gray-400">contato@turismonortegoiano.com.br</p>
          <p className="mt-2 text-gray-400">@turismonortegoiano</p>
        </div>
      </div>

      <div className="container mx-auto mt-12 border-t border-gray-800 px-4 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Projeto Turismo Norte-Goiano.
      </div>
    </footer>
  );
};
