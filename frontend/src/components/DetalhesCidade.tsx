import React from 'react';
import { useParams } from 'react-router-dom';
import { useCidade } from '../hooks/useCidade';

const DetalhesCidade: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: cidade, isLoading, isError } = useCidade(id || '');

  // Estado de Carregamento (Skeleton Loader) 
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 animate-pulse">
        <div className="w-full h-96 bg-gray-700 rounded-2xl mb-6"></div>
        <div className="h-8 bg-gray-700 w-1/3 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 w-full rounded mb-2"></div>
        <div className="h-4 bg-gray-700 w-full rounded"></div>
      </div>
    );
  }

  // Tratamento de Erro [cite: 355]
  if (isError || !cidade) {
    return (
      <div className="text-center text-red-500 py-10">
        Erro ao carregar os detalhes da cidade. Tente novamente mais tarde.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Imagem de Destaque Widescreen [cite: 22, 146] */}
      <section className="mb-8">
        <img 
          src={cidade.imagemCapa} 
          alt={cidade.nome} 
          className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl shadow-lg"
        />
      </section>

      {/* Informações da Cidade  */}
      <article className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-white mb-2">{cidade.nome}</h1>
        <p className="text-green-500 font-medium mb-6 uppercase tracking-widest">
          Região: {cidade.regiao}
        </p>
        <div className="text-gray-300 leading-relaxed text-lg">
          {cidade.descricao}
        </div>
      </article>

      {/* Módulo Guia do Visitante (Em breve) [cite: 19, 201, 203] */}
      <section className="mt-12 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-2xl font-semibold mb-2">Guia do Visitante</h2>
        <p className="text-zinc-500 italic">
          Em breve: dicas de hospedagem, gastronomia e mais para sua visita a {cidade.nome}...
        </p>
      </section>
    </main>
  );
};

export default DetalhesCidade;