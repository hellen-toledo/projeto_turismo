import React from 'react';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import CityCard from './components/CityCard';
import EventCard from './components/EventCard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <Header />

      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          
         
          <section className="text-center py-12 md:py-20 mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Onde a Aventura Encontra a <span className="text-green-700">Alma do Cerrado</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Explore as maravilhas do Norte Goiano, da Chapada dos Veadeiros às águas majestosas do Lago Serra da Mesa.
            </p>
            
            
            <HeroSearch />
          </section>

          
         
          <section className="mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Cidades Incríveis</h2>
                <p className="text-gray-600 mt-1">Explore destinos divididos por macrorregiões (Ex: Chapada dos Veadeiros)</p>
              </div>
              <button className="text-green-700 font-semibold hover:underline">Ver todas as cidades</button>
            </div>
            
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CityCard 
                name="Alto Paraíso de Goiás" 
                imageUrl="https://images.unsplash.com/photo-1695420959065-27a3ed7fb50c?q=80&w=600&auto=format&fit=crop" 
              />
              <CityCard 
                name="Cavalcante" 
                imageUrl="https://images.unsplash.com/photo-1627448896568-7c8585e135ed?q=80&w=600&auto=format&fit=crop" 
              />
              <CityCard 
                name="Colinas do Sul" 
                imageUrl="https://images.unsplash.com/photo-1590393275627-0c484ce3dd7e?q=80&w=600&auto=format&fit=crop" 
              />
              <CityCard 
                name="São João d'Aliança" 
                imageUrl="https://images.unsplash.com/photo-1596703598126-17b2b73bcff2?q=80&w=600&auto=format&fit=crop" 
              />
            </div>
          </section>

          
          <section className="mb-20">
            <div className="bg-green-50 rounded-3xl p-8 md:p-12">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Próximos Eventos</h2>
                <button className="text-green-700 font-semibold hover:underline hidden md:block">Ver agenda completa</button>
              </div>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EventCard 
                  day="20" 
                  month="Jul" 
                  title="Festival de Inverno da Chapada" 
                  location="Alto Paraíso de Goiás" 
                />
                <EventCard 
                  day="15" 
                  month="Ago" 
                  title="Torneio de Pesca Serra da Mesa" 
                  location="Minaçu" 
                />
                <EventCard 
                  day="10" 
                  month="Set" 
                  title="Festa do Cerrado" 
                  location="Porangatu" 
                />
              </div>
              
              
              <button className="mt-6 w-full text-center text-green-700 font-semibold hover:underline md:hidden">Ver agenda completa</button>
            </div>
          </section>

          
          <section className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Guia do Visitante</h2>
            <p className="text-lg text-green-700 font-medium italic">
              Em breve: dicas de hospedagem, gastronomia local e muito mais...
            </p>
          </section>

        </div>
      </main>

      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Turismo Norte-Goiano</h3>
            <p className="text-gray-400 leading-relaxed">
              O portal oficial para descobrir a alma do Cerrado e as belezas naturais da região Norte de Goiás.
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
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-gray-400">Email: contato@turismonortegoiano.com.br</p>
            <p className="text-gray-400 mt-2">Instagram: @turismonortegoiano</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Projeto Turismo Norte-Goiano. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App;