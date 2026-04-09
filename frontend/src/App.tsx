import React from 'react';
import Header from './components/Header';
import './index.css';
import { Search } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      
      <Header />

      <main className="pt-20">
        
        <section className="relative h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2000" 
              alt="Chapada dos Veadeiros"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              Descubra o Norte Goiano
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
              Onde a Aventura Encontra a Alma do Cerrado
            </p>

            
            <div className="relative w-full max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Para onde você quer ir? (Ex: Minaçu, Chapada...)"
                className="w-full bg-white text-black px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-green-600/50 transition-all pl-14"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
            
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["Ecoturismo", "Pesca Esportiva", "Lagos", "Trilhas"].map((tag) => (
                <button 
                  key={tag}
                  className="bg-white/10 hover:bg-green-600 border border-white/20 px-4 py-1.5 rounded-full text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold border-l-4 border-green-600 pl-4">
              Cidades em Destaque
            </h2>
            <button className="text-green-500 hover:underline">Ver Todas as Cidades</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <p className="text-gray-400 italic">Carregando destinos do Norte Goiano...</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;