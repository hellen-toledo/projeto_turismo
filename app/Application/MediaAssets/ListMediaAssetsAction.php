<?php

namespace App\Application\MediaAssets;

use App\Domain\MediaAssets\MediaAsset;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListMediaAssetsAction
{
    public function __invoke(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 12), 1), 50);
        $collection = $filters['collection'] ?? null;

        return MediaAsset::query()
            ->when(filled($collection), fn ($query) => $query->where('collection', $collection))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }
}
