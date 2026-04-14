import React from 'react';

const Header: React.FC = () => {
  return (
    // Cabeçalho fixo no topo (fixed top-0) com z-index alto para ficar sobre os outros elementos
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logomarca */}
        <div className="text-2xl font-bold text-green-700">
          <a href="/">Turismo Norte-Goiano</a>
        </div>

        {/* Links de Navegação */}
        {/* Oculto em telas muito pequenas (mobile) e visível a partir do tamanho médio (md) */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">
            Home
          </a>
          <a href="/eventos" className="text-gray-700 hover:text-green-600 transition-colors">
            Eventos
          </a>
          <a href="/guia" className="text-gray-700 hover:text-green-600 transition-colors">
            Guia
          </a>
          <a href="/cidades" className="text-gray-700 hover:text-green-600 transition-colors">
            Cidades
          </a>
          <a href="/contato" className="text-gray-700 hover:text-green-600 transition-colors">
            Contato
          </a>
        </nav>

        {/* Botão de Destaque "Visualizar" */}
        <div>
          <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 transition-colors shadow-sm">
            Visualizar
          </button>
        </div>
        
      </div>
    </header>
  );
};

export default Header;