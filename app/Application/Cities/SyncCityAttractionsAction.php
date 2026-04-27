<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use App\Domain\CityAttractions\CityAttraction;

class SyncCityAttractionsAction
{
    public function __invoke(City $city, array $items): void
    {
        $existingIds = $city->attractions()->pluck('id')->all();
        $keptIds = [];

        foreach (array_values($items) as $index => $item) {
            $attraction = null;

            if (isset($item['id'])) {
                $attraction = $city->attractions()->whereKey($item['id'])->first();
            }

            if (! $attraction) {
                $attraction = new CityAttraction;
                $attraction->city()->associate($city);
            }

            $attraction->fill([
                'name' => $item['name'],
                'description' => $item['description'] ?? null,
                'image_url' => $item['imageUrl'] ?? null,
                'sort_order' => $item['sortOrder'] ?? $index,
                'is_published' => $item['isPublished'] ?? true,
            ]);
            $attraction->save();

            $keptIds[] = $attraction->id;
        }

        $idsToDelete = array_diff($existingIds, $keptIds);

        if ($idsToDelete !== []) {
            $city->attractions()->whereKey($idsToDelete)->delete();
        }
    }
}
