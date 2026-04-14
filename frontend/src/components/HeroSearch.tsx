import React from 'react';

const HeroSearch: React.FC = () => {
  
  const categorias = ['Ecoturismo', 'Pesca Esportiva', 'Lagos', 'Trilhas'];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      
      <div className="w-full relative shadow-lg rounded-full mb-8 bg-white flex items-center">
        
        <div className="pl-6 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input 
          type="text" 
          placeholder="Para onde você quer ir? (Ex: Minaçu, Chapada...)" 
          className="w-full py-4 pl-4 pr-32 text-gray-700 bg-transparent rounded-full focus:outline-none text-lg"
        />
        
        <button className="absolute right-2 top-2 bottom-2 bg-green-600 text-white font-semibold px-8 rounded-full hover:bg-green-700 transition-colors shadow-md">
          Buscar
        </button>
      </div>

      
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {categorias.map((categoria) => (
          <button 
            key={categoria}
            className="px-6 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all shadow-sm"
          >
            {categoria}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default HeroSearch;