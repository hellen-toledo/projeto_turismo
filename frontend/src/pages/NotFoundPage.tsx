import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <section className="mx-auto max-w-2xl py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">Erro 404</p>
      <h1 className="mt-4 text-4xl font-bold text-gray-900">Página não encontrada</h1>
      <p className="mt-4 text-lg text-gray-600">
        O caminho acessado não existe ou foi movido. Use a navegação principal para continuar explorando.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          Ir para a home
        </Link>
        <Link
          to="/cidades"
          className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-green-600 hover:text-green-700"
        >
          Ver cidades
        </Link>
      </div>
    </section>
  );
};
