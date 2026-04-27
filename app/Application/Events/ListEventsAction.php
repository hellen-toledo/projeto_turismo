<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListEventsAction
{
    public function __invoke(array $filters = [], bool $includeUnpublished = false): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 12), 1), 50);
        $search = $filters['search'] ?? null;
        $city = $filters['city'] ?? null;
        $cityId = $filters['city_id'] ?? null;
        $tag = $filters['tag'] ?? null;
        $tagId = $filters['tag_id'] ?? null;

        return Event::query()
            ->with(['city.region', 'interestTags'])
            ->when(
                ! $includeUnpublished,
                fn ($query) => $query->where('is_published', true),
                fn ($query) => $query->when(isset($filters['published']), fn ($publishedQuery) => $publishedQuery->where('is_published', $filters['published']))
            )
            ->when(
                filled($search),
                fn ($query) => $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
            )
            ->when(isset($filters['featured']), fn ($query) => $query->where('is_featured', $filters['featured']))
            ->when(
                $filters['future'] ?? false,
                fn ($query) => $query->where('starts_at', '>=', now())
            )
            ->when(isset($cityId), fn ($query) => $query->where('city_id', $cityId))
            ->when(
                ! isset($cityId) && filled($city),
                fn ($query) => $query->whereHas('city', function ($cityQuery) use ($city): void {
                    $cityQuery
                        ->where('slug', $city)
                        ->orWhere('name', $city)
                        ->when(is_numeric($city), fn ($numericQuery) => $numericQuery->orWhere('id', (int) $city));
                })
            )
            ->when(
                isset($tagId),
                fn ($query) => $query->whereHas('interestTags', fn ($tagQuery) => $tagQuery->whereKey($tagId))
            )
            ->when(
                ! isset($tagId) && filled($tag),
                fn ($query) => $query->whereHas('interestTags', function ($tagQuery) use ($tag): void {
                    $tagQuery
                        ->where('slug', $tag)
                        ->orWhere('name', $tag)
                        ->when(is_numeric($tag), fn ($numericQuery) => $numericQuery->orWhere('id', (int) $tag));
                })
            )
            ->orderBy('starts_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}
