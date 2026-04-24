<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use Illuminate\Database\Eloquent\Collection;

class ListEventsAction
{
    public function __invoke(array $filters = []): Collection
    {
        return Event::query()
            ->with(['city.region', 'interestTags'])
            ->when(isset($filters['published']), fn ($query) => $query->where('is_published', $filters['published']))
            ->when(isset($filters['featured']), fn ($query) => $query->where('is_featured', $filters['featured']))
            ->when(
                $filters['future'] ?? false,
                fn ($query) => $query->where('starts_at', '>=', now())
            )
            ->when(
                filled($filters['city'] ?? null),
                fn ($query) => $query->whereHas('city', function ($cityQuery) use ($filters): void {
                    $city = $filters['city'];
                    $cityQuery
                        ->where('slug', $city)
                        ->orWhere('name', $city)
                        ->when(is_numeric($city), fn ($numericQuery) => $numericQuery->orWhere('id', (int) $city));
                })
            )
            ->orderBy('starts_at')
            ->get();
    }
}
