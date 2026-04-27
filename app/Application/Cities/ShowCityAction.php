<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;

class ShowCityAction
{
    public function __invoke(City $city): City
    {
        return $city->load([
            'region',
            'interestTags',
            'attractions' => fn ($query) => $query
                ->where('is_published', true)
                ->orderBy('sort_order'),
            'galleryMediaAssets' => fn ($query) => $query->orderBy('city_media_asset.sort_order'),
        ]);
    }
}
