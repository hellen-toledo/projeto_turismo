import React from 'react';
import type { Evento } from '../types/evento'; // Importação do tipo padronizado

interface EventCardProps {
  evento: Evento; // Recebe o objeto completo para facilitar o consumo da API
}

const EventCard: React.FC<EventCardProps> = ({ evento }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      
      {/* Cabeçalho do Card: Data e Títulos */}
      <div className="flex items-center gap-4 mb-6">
        
        {/* Bloco de Data Separada (Cumpre a Regra de Negócio RN02) */}
        <div className="bg-green-100 text-green-800 rounded-xl p-3 text-center min-w-[72px]">
          <span className="block text-2xl font-bold leading-none">{evento.dia}</span>
          <span className="block text-sm font-semibold uppercase tracking-wider mt-1">{evento.mes}</span>
        </div>
        
        {/* Informações do Evento (Cumpre o Requisito RF06) */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{evento.nome}</h3>
          <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {evento.cidade}
          </p>
        </div>
      </div>
      
      {/* Botão de Ação "Quero Conhecer" (Cumpre o Requisito RF17/RF06) */}
      <div className="mt-auto">
        <button 
          onClick={() => evento.linkAcao && window.open(evento.linkAcao, '_blank')}
          className="w-full py-3 rounded-xl border-2 border-green-600 text-green-700 font-bold hover:bg-green-600 hover:text-white transition-colors"
        >
          Quero Conhecer
        </button>
      </div>
      
    </div>
  );
};

export default EventCard;