import React from 'react';

interface CityCardProps {
  name: string;
  imageUrl: string;
}

const CityCard: React.FC<CityCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 h-64">
      {/* Imagem de Fundo com efeito de zoom ao passar o rato */}
      <img 
        src={imageUrl} 
        alt={`Destino: ${name}`} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      {/* Gradiente escuro na base para garantir que o texto branco seja sempre legível */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      {/* Nome da Cidade */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-center md:text-left">
        <h3 className="text-white text-xl md:text-2xl font-bold">{name}</h3>
      </div>
    </div>
  );
};

export default CityCard;