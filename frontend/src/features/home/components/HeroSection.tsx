import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = ['Ecoturismo', 'Pesca Esportiva', 'Lagos', 'Trilhas'];

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cidades?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/cidades');
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/cidades?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="mb-10 py-12 text-center md:py-20 relative">
      {/* Decorative background image or gradient for the "Hero" feel */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-900/20 to-transparent pointer-events-none rounded-3xl" />
      
      <div className="relative z-10">
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Onde a Aventura Encontra a <span className="text-green-500">Alma do Cerrado</span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
          Explore as maravilhas do Norte Goiano, da Chapada dos Veadeiros às águas do Lago Serra da Mesa.
        </p>

        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <form onSubmit={handleSearch} className="relative mb-8 flex w-full items-center rounded-full bg-gray-900 shadow-lg border border-gray-700">
            <div className="pl-6 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Para onde você quer ir? (Ex: Minaçu, Chapada...)"
              className="w-full rounded-full bg-transparent py-4 pl-4 pr-32 text-lg text-gray-100 placeholder-gray-500 focus:outline-none"
            />

            <button type="submit" className="absolute bottom-2 right-2 top-2 rounded-full bg-green-600 px-8 font-semibold text-white shadow-md transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400">
              Buscar
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleTagClick(category)}
                className="rounded-full border border-gray-700 bg-gray-800 px-6 py-2 font-medium text-gray-300 shadow-sm transition-all hover:border-green-500 hover:bg-gray-700 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
