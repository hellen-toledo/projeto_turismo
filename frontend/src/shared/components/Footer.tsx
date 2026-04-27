import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-xl font-bold text-white">Turismo Norte-Goiano</h3>
          <p className="leading-relaxed">
            Descubra experiências de natureza, cultura e eventos na região norte de Goiás. Explore cachoeiras, lagos e a rica biodiversidade do Cerrado.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Navegação</h3>
          <nav aria-label="Navegação do rodapé">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="transition-colors hover:text-green-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="transition-colors hover:text-green-400">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/guia" className="transition-colors hover:text-green-400">
                  Guia do Visitante
                </Link>
              </li>
              <li>
                <Link to="/cidades" className="transition-colors hover:text-green-400">
                  Cidades
                </Link>
              </li>
              <li>
                <Link to="/contato" className="transition-colors hover:text-green-400">
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contato</h3>
          <p>Email: contato@turismonortegoiano.com.br</p>
          <p className="mt-2">Instagram: @turismonortegoiano</p>
          <p className="mt-2">Telefone: (62) 99999-9999</p>
        </div>
      </div>

      <div className="container mx-auto mt-12 border-t border-gray-800 px-4 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Projeto Turismo Norte-Goiano. Todos os direitos reservados.
      </div>
    </footer>
  );
};
