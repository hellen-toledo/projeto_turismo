import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../../shared/lib/api/resolveAssetUrl';
import type { City } from '../../../shared/types/api';

interface CityCardProps {
  city: City;
}

export const CityCard = ({ city }: CityCardProps) => {
  const coverImage = resolveAssetUrl(city.coverImage);

  return (
    <Link
      to={`/cidades/${city.slug}`}
      className="group relative block h-64 overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <img
        src={coverImage ?? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop'}
        alt={`Destino: ${city.name}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-6 text-center md:text-left">
        <h3 className="text-xl font-bold text-white md:text-2xl">{city.name}</h3>
        {city.region?.name ? (
          <p className="mt-2 text-sm text-green-100">{city.region.name}</p>
        ) : null}
      </div>
    </Link>
  );
};
