import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import CityCard from './components/CityCard';
import EventCard from './components/EventCard';
import DetalhesCidade from './components/DetalhesCidade';
import { useEventos } from './hooks/useEventos'; // Hook para consumir a API de eventos

// Componente para a página inicial (Home)
const Home: React.FC = () => {
  // Consumo dinâmico da Agenda de Eventos (RF06) [cite: 15, 133]
  const { data: eventos, isLoading: loadingEventos } = useEventos();

  return (
    <>
      {/* Seção Hero e Busca Inteligente (RF02) [cite: 13, 132] */}
      <section className="text-center py-12 md:py-20 mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Onde a Aventura Encontra a <span className="text-green-700">Alma do Cerrado</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore as maravilhas do Norte Goiano, da Chapada dos Veadeiros às águas majestosas do Lago Serra da Mesa[cite: 5].
        </p>
        <HeroSearch />
      </section>

      {/* Vitrine de Cidades (RF04) [cite: 15, 133] */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Cidades Incríveis</h2>
            <p className="text-gray-600 mt-1">Explore destinos divididos por macrorregiões (Ex: Chapada dos Veadeiros)[cite: 15].</p>
          </div>
          <button className="text-green-700 font-semibold hover:underline">Ver todas as cidades</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* IDs vinculados à rota dinâmica de detalhes (RF05) [cite: 16, 136] */}
          <CityCard 
            id="1"
            name="Alto Paraíso de Goiás" 
            imageUrl="https://images.unsplash.com/photo-1695420959065-27a3ed7fb50c?q=80&w=600&auto=format&fit=crop" 
          />
          <CityCard 
            id="2"
            name="Cavalcante" 
            imageUrl="https://images.unsplash.com/photo-1627448896568-7c8585e135ed?q=80&w=600&auto=format&fit=crop" 
          />
          <CityCard 
            id="3"
            name="Colinas do Sul" 
            imageUrl="https://images.unsplash.com/photo-1590393275627-0c484ce3dd7e?q=80&w=600&auto=format&fit=crop" 
          />
          <CityCard 
            id="4"
            name="São João d'Aliança" 
            imageUrl="https://images.unsplash.com/photo-1596703598126-17b2b73bcff2?q=80&w=600&auto=format&fit=crop" 
          />
        </div>
      </section>

      {/* Agenda de Eventos Dinâmica (RF06 + RN02) [cite: 17, 111, 134] */}
      <section className="mb-20">
        <div className="bg-green-50 rounded-3xl p-8 md:p-12">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Próximos Eventos</h2>
            <button className="text-green-700 font-semibold hover:underline hidden md:block">Ver agenda completa</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingEventos ? (
              <div className="col-span-full text-center py-10 text-gray-500 italic">Carregando eventos do Norte Goiano...</div>
            ) : (
              eventos?.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
              ))
            )}
          </div>
          
          <button className="mt-6 w-full text-center text-green-700 font-semibold hover:underline md:hidden">Ver agenda completa</button>
        </div>
      </section>

      {/* Módulo Guia do Visitante (RF07) [cite: 19, 136] */}
      <section className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Guia do Visitante</h2>
        <p className="text-lg text-green-700 font-medium italic">
          Em breve: dicas de hospedagem, gastronomia local e muito mais... [cite: 19, 203]
        </p>
      </section>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* RF01: Menu Global fixo em todas as páginas [cite: 12, 131] */}
        <Header />

        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* RF05: Rota dinâmica para exibir detalhes específicos de cada cidade [cite: 16, 136] */}
              <Route path="/cidade/:id" element={<DetalhesCidade />} />
            </Routes>
          </div>
        </main>

        {/* RF08: Rodapé Informativo fixo [cite: 20, 115] */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Turismo Norte-Goiano</h3>
              <p className="text-gray-400 leading-relaxed">
                O portal oficial para descobrir a alma do Cerrado e as belezas naturais da região Norte de Goiás[cite: 4].
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navegação</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/eventos" className="hover:text-white transition-colors">Eventos</a></li>
                <li><a href="/cidades" className="hover:text-white transition-colors">Cidades</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-gray-400">Email: contato@turismonortegoiano.com.br [cite: 218]</p>
              <p className="text-gray-400 mt-2">Instagram: @turismonortegoiano [cite: 217]</p>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Projeto Turismo Norte-Goiano. Todos os direitos reservados[cite: 220].
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;