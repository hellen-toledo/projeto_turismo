import type { Event } from '../../../shared/types/api';
import { formatEventDate } from '../../../shared/lib/utils/formatEventDate';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { day, month } = formatEventDate(event.startsAt);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-shadow hover:shadow-md hover:border-gray-700">
      <div className="mb-6 flex items-center gap-4">
        <div className="min-w-[72px] rounded-xl bg-green-900/30 p-3 text-center text-green-400">
          <span className="block text-2xl font-bold leading-none">{day}</span>
          <span className="mt-1 block text-sm font-semibold uppercase tracking-wider">{month}</span>
        </div>

        <div>
          <h3 className="line-clamp-2 text-xl font-bold text-white">{event.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.city?.name ?? 'Cidade não informada'}
          </p>
        </div>
      </div>

      <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-400">{event.description}</p>

      <div className="mt-auto">
        {event.externalUrl ? (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full text-center rounded-xl border border-green-600 py-3 font-bold text-green-500 transition-colors hover:bg-green-600 hover:text-white"
            aria-label={`Abrir detalhes externos do evento ${event.title}`}
          >
            Quero Conhecer
          </a>
        ) : (
          <div className="w-full rounded-xl border border-gray-700 py-3 text-center font-bold text-gray-500 bg-gray-800/50">
            Em breve
          </div>
        )}
      </div>
    </div>
  );
};
