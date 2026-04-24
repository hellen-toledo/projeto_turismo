<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Illuminate\Database\Eloquent\Collection;

class ListCitiesAction
{
    public function __invoke(array $filters = []): Collection
    {
        return City::query()
            ->with(['region', 'interestTags'])
            ->when(isset($filters['published']), fn ($query) => $query->where('is_published', $filters['published']))
            ->when(
                filled($filters['region'] ?? null),
                fn ($query) => $query->whereHas('region', function ($regionQuery) use ($filters): void {
                    $region = $filters['region'];
                    $regionQuery
                        ->where('name', $region)
                        ->when(is_numeric($region), fn ($numericQuery) => $numericQuery->orWhere('id', (int) $region));
                })
            )
            ->orderBy('name')
            ->get();
    }
}
