import React from 'react';

interface EventCardProps {
  day: string;
  month: string;
  title: string;
  location: string;
}

const EventCard: React.FC<EventCardProps> = ({ day, month, title, location }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      
      {/* Bloco Superior: Data em destaque (RN02) e Informações do Evento */}
      <div className="flex items-center gap-4 mb-6">
        {/* Bloco de Data Separada */}
        <div className="bg-green-100 text-green-800 rounded-xl p-3 text-center min-w-[72px]">
          <span className="block text-2xl font-bold leading-none">{day}</span>
          <span className="block text-sm font-semibold uppercase tracking-wider mt-1">{month}</span>
        </div>
        
        {/* Título e Localização */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{title}</h3>
          <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
        </div>
      </div>
      
      {/* Bloco Inferior: Botão de Ação (RF06) */}
      <div className="mt-auto">
        <button className="w-full py-3 rounded-xl border-2 border-green-600 text-green-700 font-bold hover:bg-green-600 hover:text-white transition-colors">
          Quero Conhecer
        </button>
      </div>
      
    </div>
  );
};

export default EventCard;