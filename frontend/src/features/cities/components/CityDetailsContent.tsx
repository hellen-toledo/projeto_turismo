import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../../shared/lib/api/resolveAssetUrl';
import type { City } from '../../../shared/types/api';

interface CityDetailsContentProps {
  city: City;
}

export const CityDetailsContent = ({ city }: CityDetailsContentProps) => {
  const publishedAttractions = city.attractions?.filter((attraction) => attraction.isPublished !== false) ?? [];
  const gallery = city.gallery ?? [];
  const coverImage = resolveAssetUrl(city.coverImage);

  return (
    <article className="mx-auto max-w-7xl p-4 md:p-8">
      <Link
        to="/cidades"
        className="mb-6 inline-flex items-center text-sm font-semibold text-green-400 hover:text-green-300 hover:underline transition-colors"
        aria-label="Voltar para a listagem de cidades"
      >
        ← Voltar para cidades
      </Link>

      <section className="mb-8">
        <img
          src={coverImage ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'}
          alt={city.coverImage ? `Imagem de capa de ${city.name}` : `Imagem ilustrativa de ${city.name}`}
          className="h-[300px] w-full rounded-2xl object-cover shadow-lg md:h-[500px]"
        />
      </section>

      <article className="max-w-none">
        <h1 className="mb-2 text-4xl font-bold text-white">{city.name}</h1>
        <p className="mb-6 font-medium uppercase tracking-widest text-green-500">
          Região: {city.region?.name ?? 'Não informada'}
        </p>
        {city.summary ? <p className="mb-4 text-lg text-gray-300">{city.summary}</p> : null}
        <div className="text-lg leading-relaxed text-gray-400">{city.description}</div>
      </article>

      {city.interestTags?.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-white">Interesses</h2>
          <div className="flex flex-wrap gap-3">
            {city.interestTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-green-900/30 px-4 py-2 text-sm font-medium text-green-400 border border-green-800"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Galeria</h2>
          <span className="text-sm text-gray-500">{gallery.length ? `${gallery.length} imagens` : 'Sem imagens adicionais'}</span>
        </div>

        {gallery.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((image, index) => (
              <figure key={image.id} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70">
                <img
                  src={resolveAssetUrl(image.url) ?? image.url}
                  alt={image.altText?.trim() || `Imagem ${index + 1} da galeria de ${city.name}`}
                  className="h-60 w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-gray-400">
                  {image.altText?.trim() || 'Registro visual da cidade'}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/50 px-6 py-10 text-sm text-gray-400">
            A galeria desta cidade ainda não possui imagens complementares.
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Atrações</h2>
          <span className="text-sm text-gray-500">{publishedAttractions.length ? `${publishedAttractions.length} experiências` : 'Sem atrações publicadas'}</span>
        </div>

        {publishedAttractions.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {publishedAttractions.map((attraction, index) => (
              <article key={attraction.id} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70">
                {attraction.imageUrl ? (
                  <img
                    src={attraction.imageUrl}
                    alt={attraction.name}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-950 text-sm font-medium text-gray-500">
                    Imagem da atração indisponível
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{attraction.name}</h3>
                    <span className="rounded-full border border-green-800 bg-green-900/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-400">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {attraction.description?.trim() || 'Descrição da atração em breve.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/50 px-6 py-10 text-sm text-gray-400">
            Ainda não há atrações publicadas para esta cidade.
          </div>
        )}
      </section>
    </article>
  );
};
