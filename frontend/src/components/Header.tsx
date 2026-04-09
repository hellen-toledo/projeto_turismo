import React from 'react';
import { Menu, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-black/90 text-white z-50 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logomarca */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block">
            Turismo Norte-Goiano
          </span>
        </div>

        {/* Navegação Global (RF01) */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="hover:text-green-500 transition-colors border-b-2 border-green-500 pb-1">Home</a>
          <a href="/eventos" className="hover:text-green-500 transition-colors">Eventos</a>
          <a href="/guia" className="hover:text-green-500 transition-colors">Guia</a>
          <a href="/cidades" className="hover:text-green-500 transition-colors">Cidades</a>
          <a href="/contato" className="hover:text-green-500 transition-colors">Contato</a>
        </nav>

        {/* Ações (RF01 - Botão Visualizar) */}
        <div className="flex items-center gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105">
            Visualizar
          </button>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;