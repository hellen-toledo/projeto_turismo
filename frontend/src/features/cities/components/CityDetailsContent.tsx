import { Link } from 'react-router-dom';
import type { City } from '../../../shared/types/api';

interface CityDetailsContentProps {
  city: City;
}

export const CityDetailsContent = ({ city }: CityDetailsContentProps) => {
  return (
    <article className="mx-auto max-w-7xl p-4 md:p-8">
      <Link
        to="/cidades"
        className="mb-6 inline-flex items-center text-sm font-semibold text-green-700 hover:underline"
      >
        ← Voltar para cidades
      </Link>

      <section className="mb-8">
        <img
          src={city.coverImage ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'}
          alt={city.name}
          className="h-[300px] w-full rounded-2xl object-cover shadow-lg md:h-[500px]"
        />
      </section>

      <article className="max-w-none">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{city.name}</h1>
        <p className="mb-6 font-medium uppercase tracking-widest text-green-600">
          Região: {city.region?.name ?? 'Não informada'}
        </p>
        {city.summary ? <p className="mb-4 text-lg text-gray-700">{city.summary}</p> : null}
        <div className="text-lg leading-relaxed text-gray-700">{city.description}</div>
      </article>

      {city.interestTags?.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Interesses</h2>
          <div className="flex flex-wrap gap-3">
            {city.interestTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
};
