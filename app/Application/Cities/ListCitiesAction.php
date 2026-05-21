<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListCitiesAction
{
    public function __invoke(array $filters = [], bool $includeUnpublished = false): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 12), 1), 50);
        $search = $filters['search'] ?? null;
        $region = $filters['region'] ?? null;
        $regionId = $filters['region_id'] ?? null;
        $tag = $filters['tag'] ?? null;
        $tagId = $filters['tag_id'] ?? null;

        return City::query()
            ->with(['region', 'interestTags', 'galleryMediaAssets' => function ($query) {
                $query->wherePivot('is_cover', true);
            }])
            ->when(
                ! $includeUnpublished,
                fn ($query) => $query->where('is_published', true),
                fn ($query) => $query->when(isset($filters['published']), fn ($publishedQuery) => $publishedQuery->where('is_published', $filters['published']))
            )
            ->when(
                filled($search),
                fn ($query) => $query->where(function ($searchQuery) use ($search): void {
                    $searchQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
            )
            ->when(isset($regionId), fn ($query) => $query->where('region_id', $regionId))
            ->when(
                ! isset($regionId) && filled($region),
                fn ($query) => $query->whereHas('region', function ($regionQuery) use ($region): void {
                    $regionQuery
                        ->where('name', 'like', "%{$region}%")
                        ->when(is_numeric($region), fn ($numericQuery) => $numericQuery->orWhere('id', (int) $region));
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
                        ->where('slug', 'like', "%{$tag}%")
                        ->orWhere('name', 'like', "%{$tag}%")
                        ->when(is_numeric($tag), fn ($numericQuery) => $numericQuery->orWhere('id', (int) $tag));
                })
            )
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }
}
