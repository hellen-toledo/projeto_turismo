import { Fish, Leaf, Mountain, Search, Waves } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'Ecoturismo', icon: Leaf },
  { label: 'Pesca Esportiva', icon: Fish },
  { label: 'Lagos', icon: Waves },
  { label: 'Trilhas', icon: Mountain },
];

const heroImageUrl = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=85&w=2400&auto=format&fit=crop';

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
    <section
      className="relative left-1/2 -mt-24 mb-16 flex min-h-screen w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-gray-950 bg-cover bg-center px-4 text-center"
      style={{ backgroundImage: `url('${heroImageUrl}')` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center pt-24">
        <h1 className="mb-5 text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
          Descubra o Norte Goiano
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-100 md:text-2xl">
          Onde a Aventura Encontra a Alma do Cerrado
        </p>

        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <form
            onSubmit={handleSearch}
            className="relative mb-7 flex h-16 w-full items-center rounded-full bg-white shadow-[0_22px_60px_rgba(0,0,0,0.28)]"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Para onde você quer ir? (Ex: Minaçu, Chapada...)"
              className="h-full min-w-0 flex-1 rounded-full bg-transparent pl-6 pr-20 text-sm text-gray-900 placeholder-gray-500 focus:outline-none md:pr-24"
            />

            <button
              type="submit"
              aria-label="Buscar destinos"
              className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleTagClick(label)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
