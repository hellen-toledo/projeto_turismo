import { Link } from 'react-router-dom';
import type { Event } from '../../../shared/types/api';

interface EventDetailsContentProps {
  event: Event;
}

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value));

export const EventDetailsContent = ({ event }: EventDetailsContentProps) => {
  const gallery = event.gallery ?? [];

  return (
    <article className="mx-auto max-w-7xl p-4 md:p-8">
      <Link
        to="/eventos"
        className="mb-6 inline-flex items-center text-sm font-semibold text-green-400 transition-colors hover:text-green-300 hover:underline"
        aria-label="Voltar para a listagem de eventos"
      >
        ← Voltar para eventos
      </Link>

      <section className="mb-8">
        <img
          src={event.coverImage ?? 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop'}
          alt={event.coverImage ? `Imagem de capa do evento ${event.title}` : `Imagem ilustrativa do evento ${event.title}`}
          className="h-[300px] w-full rounded-2xl object-cover shadow-lg md:h-[500px]"
        />
      </section>

      <article className="max-w-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">{event.title}</h1>
            <p className="font-medium uppercase tracking-widest text-green-500">
              Cidade: {event.city?.name ?? 'Não informada'}
            </p>
          </div>
          {event.externalUrl ? (
            <a
              href={event.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-green-600 px-5 py-3 text-sm font-bold text-green-500 transition-colors hover:bg-green-600 hover:text-white"
            >
              Acessar página oficial
            </a>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-5 text-sm text-gray-300 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-500">Início</p>
            <p className="mt-2">{formatDateTime(event.startsAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-500">Fim</p>
            <p className="mt-2">{event.endsAt ? formatDateTime(event.endsAt) : 'Horário não informado'}</p>
          </div>
        </div>

        <div className="mt-6 text-lg leading-relaxed text-gray-400">{event.description}</div>
      </article>

      {event.interestTags?.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-white">Interesses</h2>
          <div className="flex flex-wrap gap-3">
            {event.interestTags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-green-800 bg-green-900/30 px-4 py-2 text-sm font-medium text-green-400"
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
                  src={image.url}
                  alt={image.altText?.trim() || `Imagem ${index + 1} da galeria do evento ${event.title}`}
                  className="h-60 w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-sm text-gray-400">
                  {image.altText?.trim() || 'Registro visual do evento'}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/50 px-6 py-10 text-sm text-gray-400">
            Este evento ainda não possui imagens complementares.
          </div>
        )}
      </section>
    </article>
  );
};
