const categories = ['Ecoturismo', 'Pesca Esportiva', 'Lagos', 'Trilhas'];

export const HeroSection = () => {
  return (
    <section className="mb-10 py-12 text-center md:py-20">
      <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
        Onde a Aventura Encontra a <span className="text-green-700">Alma do Cerrado</span>
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
        Explore as maravilhas do Norte Goiano, da Chapada dos Veadeiros às águas do Lago Serra da Mesa.
      </p>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="relative mb-8 flex w-full items-center rounded-full bg-white shadow-lg">
          <div className="pl-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Para onde você quer ir? (Ex: Minaçu, Chapada...)"
            className="w-full rounded-full bg-transparent py-4 pl-4 pr-32 text-lg text-gray-700 focus:outline-none"
          />

          <button className="absolute bottom-2 right-2 top-2 rounded-full bg-green-600 px-8 font-semibold text-white shadow-md transition-colors hover:bg-green-700">
            Buscar
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className="rounded-full border border-gray-200 bg-white/80 px-6 py-2 font-medium text-gray-700 shadow-sm transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
